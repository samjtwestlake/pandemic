class PhaseController {
    constructor(board) {
        this.board = board;
        this.activePlayer = this.board.players[0];
        this.phase = new SetupPhase(this.activePlayer, this.board);
        this.prevPhase = this.phase;
        this.skipInfect = false;
        // this.phase = new ActionPhase(this.activePlayer, this.board);
    }

    display() {
        if (Object.keys(PhaseLabels).includes(this.phase.name)) {
            $('.phase-display').show();
            $('.phase-display .active-piece').attr('src', RoleImgFPs[this.phase.player.role]);
            $('.phase-display .phase-label').text(PhaseLabels[this.phase.name]);
            let stageLabel = $('.phase-display .stage-label');
            if (this.phase.name == "ActionPhase") {
                stageLabel.parent().show();
                stageLabel.text(this.phase.actionNo + 1);
            } else {
                stageLabel.parent().hide();
            }
        }
    }

    setStaticListeners() {
        let self = this;

        $('.reset').on('click', function(e) {
            let handler = new ClickHandler(e);
            self.registerClick(handler, {});
        });

        let { cities } = this.board;
        for (let city of Object.values(cities)) {
            $(city.element).on('click', function(e) {
                let handler = new ClickHandler(e);
                self.registerClick(handler, city);
            });
            $(city.element).find('.cube-cont .infect-cont').on('click', function(e) {
                let handler = new ClickHandler(e);
                self.registerClick(handler, city);
            });
        }

        let infectDeck = this.board.infectDeck;
        $(infectDeck.element).on('click', function(e) {
            let handler = new ClickHandler(e);
            self.registerClick(handler, infectDeck);
        });
        $(infectDeck.display).on('click', function(e) {
            let handler = new ClickHandler(e);
            self.registerClick(handler, infectDeck);
        });
        $('.infect-card-display .button.show').on('click', function(e) {
            $('.infect-card-display').removeClass('hide');
        });
        $('.infect-card-display .button.hide').on('click', function(e) {
            $('.infect-card-display').addClass('hide');
        });

        let setupButtons = $('.setup-display .button');
        setupButtons.on('click', function(e) {
            let handler = new ClickHandler(e);
            self.registerClick(handler, {});
            if (handler.isStartButton()) {
                socket.emit('broadcast-setup', { state: state });
                phaseController.activePlayer.addHighlight();
            }
        });

        let sliders = $('.slider').on('change', function(e) {
            self.board.disableStartButton();
        });

        $('.control-button.skip').on('click', function(e) {
            let handler = new ClickHandler(e);
            self.registerClick(handler, {});
        });
    }

    setSetupListeners() {
        let self = this;

        let players = this.board.players;
        for (let player of players) {
            let actionButts = $(player.element).find('.action-button');
            actionButts.on('click', function(e) {
                let handler = new ClickHandler(e);
                self.registerClick(handler, player);
            });

            let piece = $(player.element).find('.piece');
            piece.on('click', function(e) {
                let handler = new ClickHandler(e);
                self.registerClick(handler, player);
            });
            piece.on('contextmenu', function(e) {
                let handler = new ClickHandler(e);
                self.registerClick(handler, player);
                return false;
            });

            let hand = $(player.handEl);
            hand.on('click', function(e) {
                let handler = new ClickHandler(e);
                self.registerClick(handler, player);
            });
        }

        let playerDeck = this.board.playerDeck;
        $(playerDeck.element).on('click', function(e) {
            let handler = new ClickHandler(e);
            self.registerClick(handler, playerDeck);
        });
    }

    registerClick(handler, obj) {
        if(handler.isResetButton()) {
            socket.emit('nullify-state', {});
            window.location.reload();
        } else {
            if (this.activePlayer.index == this.board.ownIndex) {
                this.phase.registerClick(handler, obj);
                if (this.phase.paused) {
                    this.interruptPhase();
                } else if (this.phase.interruptFinished) {
                    this.resumePhase();
                    if (this.phase.complete || this.phase.interruptFinished) {
                        this.nextPhase();
                    }
                } else if (this.phase.complete) {
                    this.nextPhase();
                }
                stateController.saveState();
                socket.emit('broadcast-state', { state: state });
            }
        }
    }

    interruptPhase() {
        let { phase } = this;
        phaseController.prevPhase = phase;
        phaseController.prevPhase.origPlayerIndex = this.activePlayer.index;
        
        // let actionNo = phase.actionNo;
        // if (phase.sharePhase) {
        //     this.phase = new ShareActionPhase(this.activePlayer, this.board);
        //     this.phase.init();
        //     phaseController.prevPhase.sharePhase = false;
        // } else 
        if (phase.eventPhase) {
            this.phase = new EventPhase(this.activePlayer, this.board);
            this.phase.init();
            phaseController.prevPhase.eventPhase = false;
            if (this.phase.eventCard.name == EventCardNames.ONEQUIETNIGHT) {
                phaseController.prevPhase.paused = false;
                this.resumePhase();
                return;
            }
        } else if (phase.discardPhase) {
            this.activePlayer = phase.discardPlayer;
            this.phase = new DiscardPhase(this.activePlayer, this.board);
            this.phase.init();
            phaseController.prevPhase.discardPhase = false;
        }
        phaseController.prevPhase.paused = false;
        // this.phase.actionNo = actionNo;
    }

    resumePhase() {
        this.phase = this.prevPhase;
        this.activePlayer = this.board.players[this.prevPhase.origPlayerIndex];
        // let { phase } = this;
        // if (phase.constructor.name == 'ShareActionPhase') {
        //     if (phase.actionNo == 4) {
        //         this.phase = new DrawPhase(this.activePlayer, this.board);
        //     } else {
        //         let actionNo = phase.actionNo;
        //         this.phase = new ActionPhase(this.activePlayer, this.board);
        //         this.phase.actionNo = actionNo;
        //     }
        // } else if (phase.constructor.name == 'EventPhase') {
        //     let actionNo = phase.actionNo;
        //     this.phase = new ActionPhase(this.activePlayer, this.board);
        //     this.phase.actionNo = actionNo;
        // }
    }

    nextPhase() {
        let { phase } = this;
        
        if (phase.defeated || phase.victory) {
            let result = { defeated: phase.defeated, victory: phase.victory};
            this.phase = new FinishedPhase(this.activePlayer, this.board, result);
        }
        if (phase.constructor.name == 'SetupPhase') {
            this.activePlayer = this.board.players[0];
            this.activePlayer.addHighlight();
            this.phase = new ActionPhase(this.activePlayer, this.board);
        } else if (phase.constructor.name == 'ActionPhase') {
            if (!phase.sharePhase) {
                this.phase = new DrawPhase(this.activePlayer, this.board);
            } else {
                let actionNo = phase.actionNo;
                this.phase = new ShareActionPhase(this.activePlayer, this.board);
                this.phase.actionNo = actionNo;
            }
        } else if (phase.constructor.name == 'ShareActionPhase') {
            if (phase.actionNo < 4) {
                let actionNo = phase.actionNo;
                this.phase = new ActionPhase(this.activePlayer, this.board);
                this.phase.actionNo = actionNo;
            } else {
                this.phase = new DrawPhase(this.activePlayer, this.board);
            }
        } else if (phase.constructor.name == 'DrawPhase') {
            if (phase.epidemic == true) {
                this.phase = new EpidemicPhase(this.activePlayer, this.board);
                board.incrInfectStage();
            } else {
                this.infectPhase();
            }
        } else if (phase.constructor.name == 'EpidemicPhase') {
            this.infectPhase();
        } else if (phase.constructor.name == 'InfectPhase') {
            this.nextPlayer();
        }
        this.phase.init();
    }

    infectPhase() {
        if (!this.skipInfect) {
            this.phase = new InfectPhase(this.activePlayer, this.board);
            if (this.phase.defeated) {
                let result = { defeated: true, victory: false};
                this.phase = new FinishedPhase(this.activePlayer, this.board, result);
            }
        } else {
            this.nextPlayer();
            this.skipInfect = false;
        }
    }

    nextPlayer() {
        let ind = this.activePlayer.index;
        let noPlayers = this.board.players.length;
        let newInd = (++ind % noPlayers);
        let newPlayer = this.board.players[newInd];
        this.activePlayer = newPlayer;
        this.board.clearPlayerHighlights();
        this.activePlayer.addHighlight();
        this.phase = new ActionPhase(this.activePlayer, this.board);
        this.phase.init();
    }
}