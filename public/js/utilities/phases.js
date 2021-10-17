class Phase {
    constructor(player, board) {
        Object.defineProperties(this, {
            player: {
                value: player
            },
            board: {
                value: board
            },
        });
        
        this.complete = false;
        this.victory = false;
        this.defeated = false;
        this.paused = false;
        this.name = this.constructor.name;
        this.activePlayerIndex = this.player.index;
        this.playersDefeated();
    }

    playersDefeated() {
        this.defeated = this.board.playersDefeated();
    }

    init() {

    }

    eventClick(card, player) {
        let valid = true;
        if (card.name == EventCardNames.RESILIENTPOP && this.board.infectDeck.discards.length == 0) {
            valid = false;
        } else if (card.name == EventCardNames.GOVGRANT && this.board.status.stations == 0) {
            this.board.discardPlayerCard(player, card);
            valid = false;
        }

        if (valid) {
            this.board.discardPlayerCard(player, card);
            this.eventPhase = true;
            this.paused = true;
            this.eventPlayerIndex = player.index;
        }
    }

    registerClick(handler, obj) {
        let excludedPhases = ['SetupPhase', 'ShareActionPhase', 'EventPhase', 'FinishedPhase'];
        if (!excludedPhases.includes(this.name)) {
            if (handler.targetIsEventCard()) {
                let clickedPlayer = obj;
                let ind = clickedPlayer.cards.length - 1 - $(handler.target).parent().index();
                let card = clickedPlayer.cards[ind];

                this.eventClick(card, clickedPlayer);
            }
        }
    }

    clearPointers() {
        $('.clickable').removeClass('clickable');
    }
}

class SetupPhase extends Phase {
    constructor(player, board) {
        super(player, board);
    }

    showPointers() {

    }

    registerClick(handler, obj) {
        super.registerClick(handler, obj);

        if (handler.isStartButton()) {
            $('.setup-display').addClass('hide');
            this.complete = true;
        } else if (handler.isRandomiseButton()) {
            let x = this.getNoPlayers();
            let y = this.getNoEpidemics();
            this.board.enableStartButton();
            board.setup(x, y);
        }
    }

    getNoPlayers() {
        return $('.no-players .slider').val();
    }

    getNoEpidemics() {
        return $('.no-epidemics .slider').val();
    }
}

class EventPhase extends Phase {
    constructor(player, board) {
        super(player, board);

        this.interruptFinished = false;
    }

    init() {
        this.board.clearAllCardHighlights();
        
        this.eventCard = this.board.playerDeck.discards[0];
        if (this.eventCard.name == EventCardNames.ONEQUIETNIGHT) {
            phaseController.skipInfect = true;
            this.player.addHighlight();
        } else if (this.eventCard.name == EventCardNames.AIRLIFT) {
            
        } else if (this.eventCard.name == EventCardNames.GOVGRANT) {
            if (this.board.status.stations <= 0) {
                this.finished();
            }
        } else if (this.eventCard.name == EventCardNames.RESILIENTPOP) {
            this.board.infectDeck.displayDiscards();
            this.selected = false;
        } else if (this.eventCard.name == EventCardNames.FORECAST) {
            this.board.infectDeck.displayTopSix();
            this.selectedCard = null;
        }
    }

    showPointers() {
        super.clearPointers();

        if (this.eventCard.name == EventCardNames.ONEQUIETNIGHT) {

        } else if (this.eventCard.name == EventCardNames.AIRLIFT) {
            for (let player of this.board.players) {
                player.setClickable();
            }
            if (this.selectedPlayer) {
                for (let city of Object.values(this.board.cities)) {
                    city.setClickable();
                }
            }
        } else if (this.eventCard.name == EventCardNames.GOVGRANT) {
            for (let city of Object.values(this.board.cities)) {
                city.setClickable();
            }
        } else if (this.eventCard.name == EventCardNames.RESILIENTPOP) {
            this.board.infectDeck.setDisplayCardsClickable();
        } else if (this.eventCard.name == EventCardNames.FORECAST) {
            this.board.infectDeck.setDisplayCardsClickable();
            this.board.infectDeck.setClickable();
        }
    }

    initSelected() {
        if (this.selectedPlayerIndex > -1) {
            this.selectedPlayer = this.board.players[this.selectedPlayerIndex];
            this.selectedPlayer.addHighlight();
        }
    }

    registerClick(handler, obj) {
        super.registerClick(handler, obj);
        let player = this.player;

        if (this.eventCard.name == EventCardNames.ONEQUIETNIGHT) {

        } else if (this.eventCard.name == EventCardNames.AIRLIFT) {
            if (handler.isPlayerPiece()) {
                let clickedPlayer = obj;
                if (this.selectedPlayer) {
                    this.selectedPlayer.removeHighlight();
                }
                this.selectedPlayer = clickedPlayer;
                this.selectedPlayerIndex = this.selectedPlayer.index;
                this.selectedPlayer.addHighlight();
                handler.event.stopPropagation();
            } else if (this.selectedPlayer && handler.isCity()) {
                let city = obj;
                if (this.selectedPlayer.location != city.name) {
                    this.board.movePlayer(this.selectedPlayer, city);
                    this.selectedPlayer.removeHighlight();
                    this.player.addHighlight();
                    this.finished();
                }
            }
        } else if (this.eventCard.name == EventCardNames.GOVGRANT) {
            if (handler.isCity()) {
                let city = obj;
                if (!city.hasStation()) {
                    this.board.buildStation(city);
                    this.finished();
                }
            }
        } else if (this.eventCard.name == EventCardNames.RESILIENTPOP) {
            if (handler.targetIsInfectCard()) {
                let infectDeck = obj;
                let ind = $(handler.target).index();
                infectDeck.discards.splice(ind, 1);
                infectDeck.displayDiscardTop();
                this.finished();
            }
        } else if (this.eventCard.name == EventCardNames.FORECAST) {
            if (handler.targetIsInfectCard() && this.selectedCard != null) {
                let infectDeck = obj;
                let ind = $(handler.target).index();
                let cards = infectDeck.cards;
                [cards[ind], cards[this.selectedCard]] = [cards[this.selectedCard], cards[ind]];
                this.selectedCard = null;
                infectDeck.displayTopSix();
            } else if (handler.targetIsInfectCard() && !this.selectedCard) {
                let infectDeck = obj;
                let ind = $(handler.target).index();
                this.selectedCard = ind;
            } else if (handler.isInfectDeck() && !this.selected) {
                let infectDeck = obj;
                infectDeck.displayDiscardTop();
                this.finished();
            }
        }
    }

    finished() {
        this.interruptFinished = true;
        this.selectedPlayer = undefined;
    }
}

class ActionPhase extends Phase {
    constructor(player, board) {
        super(player, board);
        this.actionNo = 0;
        this.board.disablePlayerActions();
        if (this.player.index == this.board.ownIndex) {
            this.player.enableActions();
        }
        this.eventPhase = false;
        this.sharePhase = false;
        this.discard = null;
        
        if (player.hasRole(RoleNames.OPERATIONS)) {
            this.operationsFlightNo = 0;
        } else if (this.player.hasRole(RoleNames.DISPATCHER)) {
            Object.defineProperty(this, 'selectedPlayer', {
                value: this.player,
                writable: true,
            });
        }
    }

    init() {
        this.player.addHighlight();
    }

    showPointers() {
        super.clearPointers();
        let { board } = this;
        let { player } = this;
        
        for (let city of Object.values(board.cities)) {
            if (!player.hasRole(RoleNames.DISPATCHER)) {
                if (board.playerCanMoveToCity(player, city)) {
                    city.setClickable();
                }
            } else {
                if (board.playerCanMoveToCity(this.selectedPlayer, city)) {
                    city.setClickable();
                }
            }
        }
        for (let plyr of board.players) {
            plyr.setEventCardsClickable();
            if (player.hasRole(RoleNames.DISPATCHER)) {
                plyr.setClickable();
            }
        }
    }

    initSelected() {
        if (this.player.hasRole(RoleNames.DISPATCHER)) {
            if (this.selectedPlayerIndex > -1) {
                this.player.removeHighlight();
                this.selectedPlayer = this.board.players[this.selectedPlayerIndex];
                this.selectedPlayer.addHighlight();
            } 
        }
    }

    registerClick(handler, obj) {
        super.registerClick(handler, obj);

        let player = this.player;
        if (handler.isSkipButton()) {
            this.completeAction();
            return;
        }

        if (handler.isCity() && obj.name != player.location) {
            if (player.hasRole(RoleNames.DISPATCHER)) {
                player = this.selectedPlayer;
            }
            let city = obj;

            let currentCity = player.location;
            let cities = this.board.cities;

            let conns = cities[currentCity].conns.concat(cities[currentCity].wrapConns);
            let startCard = player.getCityCard(player.location);
            let destCard = player.getCityCard(city.name);
            let discard = this.discard;
            
            if (discard) {
                if (discard.name == player.location || discard.name == city.name) {
                    this.board.discardPlayerCard(player, discard);
                    this.board.movePlayer(player, city);
                    this.completeAction();
                    return;
                } else if (player.hasRole(RoleNames.OPERATIONS) && this.operationsFlightNo == 0) {
                    let origCity = this.board.cities[player.location];
                    if (origCity.hasStation()) {
                        this.operationsFlightNo++;
                        this.board.discardPlayerCard(player, discard);
                        this.board.movePlayer(player, city);
                        this.completeAction();
                        return;
                    }
                }
            }
            if (conns.includes(city.name)) {
                this.board.movePlayer(player, city);
                this.completeAction();
            } else if (city.hasStation() && this.board.cities[player.location].hasStation()) {
                this.board.movePlayer(player, city);
                this.completeAction();
            } else if (destCard) {
                this.board.discardPlayerCard(player, destCard);
                this.board.movePlayer(player, city);
                this.completeAction();
                // this.board.discardCityCardByLocation(city.location, player);
            } else if (startCard) {
                this.board.discardPlayerCard(player, startCard);
                this.board.movePlayer(player, city);
                this.completeAction();
            }
            
            if (player.hasRole(RoleNames.MEDIC)) {
                let city = this.board.cities[player.location];
                if (this.board.status.cured[city.color] && city.infect[city.color] > 0) {
                    this.board.maxTreat(player, city.color);
                }
            }
        } else if (handler.isActionButton()) {
            if(handler.isStationButton()) {
                let city = this.board.cities[player.location];
                if (!city.hasStation() && this.board.status.stations > 0) {
                    if (player.hasCityCard(player.location) || player.hasRole(RoleNames.OPERATIONS)) {
                        this.board.buildStation(city);
                        if (!player.hasRole(RoleNames.OPERATIONS)) {
                            player.discardByLocation(player.location);
                        }
                        this.completeAction();
                    }
                }
            } else if(handler.isShareButton()) {
                this.sharePhase = true;
                this.complete = true;
            } else if(handler.isTreatButton()) {
                let city = this.board.cities[player.location];
                if (city.infect[city.color] > 0) {
                    if (player.hasRole(RoleNames.MEDIC) || this.board.status.cured[city.color]) {
                        this.board.maxTreat(player, city.color);
                    } else {
                        this.board.treat(player, city.color);
                    }
                    this.completeAction();
                }
            } else if(handler.isCureButton()) {
                let colorCount = player.countCardColors();
                let maxColor = Object.keys(colorCount).reduce((a, b) => colorCount[a] > colorCount[b] ? a : b);
                let maxCount = colorCount[maxColor];
                let city = this.board.cities[player.location];
                if (city.hasStation()) {
                    if (maxCount >= 5 || maxCount >= 4 && player.hasRole(RoleNames.SCIENTIST)) {
                        let discardNo;
                        if (player.hasRole(RoleNames.SCIENTIST)) {
                            discardNo = 4;
                        } else {
                            discardNo = 5;
                        }
                        this.board.cureDisease(maxColor);
                        this.board.applyMedicOnCure(maxColor);
                        this.board.discardCureCards(player, maxColor, discardNo);
                        this.achievedVictory();
                        this.completeAction();
                    }
                }   
            }
        } else if (handler.isInfectCube()) {
            let city = obj;
            if (city.name == player.location) {
                let infectCont = $(handler.element);
                let color = infectCont.attr('data-color');
                if (city.infect[color] > 0) {
                    if (player.hasRole(RoleNames.MEDIC) || this.board.status.cured[color]) {
                        this.board.maxTreat(player, color);
                    } else {
                        this.board.treat(player, color);
                    }
                    this.completeAction();
                }
            }
        } else if (handler.targetIsCityCard()) {
            let clickedPlayer = obj;
            if (clickedPlayer.index == player.index) {
                let ind = clickedPlayer.cards.length - 1 - $(handler.target).parent().index();
                let discard = player.cards[ind];
    
                if (this.discard) {
                    player.clearCardHighlights();
                }
                discard.highlighted = true;
                this.discard = discard;
            }
        }

        if (player.hasRole(RoleNames.DISPATCHER)) {
            if (handler.isPlayerPiece()) {
                let clickedPlayer = obj;

                if (handler.event.type == 'click') {
                    if (clickedPlayer.index != this.selectedPlayer.index) {
                        this.selectedPlayer.removeHighlight();
                        this.selectedPlayer = clickedPlayer;
                        this.selectedPlayerIndex = this.selectedPlayer.index;
                        this.selectedPlayer.addHighlight();
                    }
                } else if (handler.event.type == 'contextmenu') {
                    if (clickedPlayer.location != this.selectedPlayer.location) {
                        let city = this.board.cities[clickedPlayer.location];
                        this.board.movePlayer(this.selectedPlayer, city);

                        if (this.selectedPlayer.hasRole(RoleNames.MEDIC)) {
                            if (this.board.status.cured[city.color] && city.infect[city.color] > 0) {
                                this.board.maxTreat(player, city.color);
                            }
                        }

                        this.completeAction();
                    }
                    event.preventDefault();
                }
                event.stopPropagation();
            }
        } else if (player.hasRole(RoleNames.OPERATIONS)) {
            // if (handler.targetIsCityCard()) {
            //     let clickedPlayer = obj;
            //     if (player.index == clickedPlayer.index) {
            //         if (this.operationsFlightNo == 0) {
            //             let ind = clickedPlayer.cards.length - 1 - $(handler.target).parent().index();
            //             let card = player.cards[ind];
            //             if (card.type == PCType.CITY && this.board.cities[player.location].hasStation()) {
            //                 this.operationsCard = card;
            //             }
            //         }
            //     }
            // }
            // this.buildNo = 0;
        }
    }

    completeAction() {
        this.actionNo++;
        if (this.actionNo == 4 || this.victory) {
            this.complete = true;
            if (this.discard) {
                this.player.clearCardHighlights();
                this.discard = null;
            }
            this.player.disableActions();
            this.player.removeHighlight();
            if (this.player.hasRole(RoleNames.DISPATCHER)) {
                this.selectedPlayer.removeHighlight();
                this.selectedPlayer = undefined;
            }
        }
    }

    achievedVictory() {
        this.victory = this.board.allDiseasesCured();
    }
}

class ShareActionPhase extends Phase {
    constructor(player, board) {
        super(player, board);
        this.interruptFinished = false;
        this.card = null;

        if (this.player.index == this.board.ownIndex) {
            this.player.enableActions();
        }
    }

    init() {
        this.player.addShareHighlight();
    }

    showPointers() {
        super.clearPointers();

        this.board.setShareCityCardsClickable(this.player);
    }

    registerClick(handler, obj) {
        super.registerClick(handler, obj);
        let player = this.player;

        if (handler.targetIsPlayerCard()) {
            let clickedPlayer = obj;

            let ind = clickedPlayer.cards.length - 1 - $(handler.target).parent().index();
            let card = clickedPlayer.cards[ind];

            if (card.type == PCType.CITY) {
                if (clickedPlayer.index == player.index) {
                    if (player.location == card.name || player.hasRole(RoleNames.RESEARCHER)) {
                        let coPlayers = this.board.coincidingPlayers(player);
                        if (coPlayers.length == 1) {
                            let coPlayer = coPlayers[0];
                            card.highlighted = false;
                            coPlayer.takeCard(card, player);
                            if (coPlayer.tooManyCards()) {
                                this.discardPhase = true;
                                this.paused = true;
                                this.discardPlayer = coPlayer;
                            }
                            this.finished();
                        } else if (coPlayers.length > 1) {
                            this.card = card;
                            this.card.highlighted = true;
                        }
                    }
                } else {
                    if (player.location == clickedPlayer.location) {
                        if (player.location == card.name  || clickedPlayer.hasRole(RoleNames.RESEARCHER)) {
                            card.highlighted = false;
                            player.takeCard(card, clickedPlayer);
                            if (player.tooManyCards()) {
                                this.discardPhase = true;
                                this.paused = true;
                                this.discardPlayer = player;
                            }
                            this.finished();
                        }
                    }
                }
            }
        } else if (handler.isPlayerPiece()) {
            let clickedPlayer = obj;
            let card = this.card;
            if (card) {
                if (player.location == clickedPlayer.location) {
                    if (player.location == card.name  || player.hasRole(RoleNames.RESEARCHER)) {
                        card.highlighted = false;
                        clickedPlayer.takeCard(card, player);
                        if (clickedPlayer.tooManyCards()) {
                            this.discardPhase = true;
                            this.paused = true;
                            this.discardPlayer = clickedPlayer;
                        }
                        this.finished();
                    }
                }
            }
        } else if (handler.isShareButton()) {
            if (this.card) {
                this.card.highlighted = false;
            }
            this.cancel();
        }
    }

    finished() {
        this.actionNo++;
        this.complete = true;
        this.player.removeShareHighlight();
        this.player.disableActions();
    }

    cancel() {
        this.complete = true;
        this.player.removeShareHighlight();
        this.player.disableActions();
    }
}

class DrawPhase extends Phase {
    constructor(player, board) {
        super(player, board);
        this.epidemic = false;
    }

    init() {
        this.board.clearPlayerHighlights();
    }

    showPointers() {
        super.clearPointers();

        this.board.playerDeck.setClickable();
        this.board.setEventCardsClickable();
    }

    registerClick(handler, obj) {
        super.registerClick(handler, obj);

        if (handler.isPlayerDeck()) {
            let playerDeck = obj;
            let player = this.player;

            player.drawCards(2, playerDeck);

            let drawnCards = player.cards.slice(0,2);
            let epidemicCards = drawnCards.filter(function (card) { return (card.type == PCType.EPIDEMIC); });
            if (epidemicCards.length) {
                this.epidemic = true;
                for (let card of epidemicCards) {
                    this.board.discardPlayerCard(player, card);
                }
            }
            if (player.cards.length > MaxNoCards) {
                this.discardPhase = true;
                this.paused = true;
                this.discardPlayer = player;
            }
            this.complete = true;
        }
    }
}

class DiscardPhase extends Phase {
    constructor(player, board) {
        super(player, board);

        this.interruptFinished = false;
    }

    showPointers() {
        super.clearPointers();

        this.player.setPlayerCardsClickable();
        this.board.setEventCardsClickable();
    }

    registerClick(handler, obj) {
        super.registerClick(handler, obj);
        let player = this.player;

        if (handler.targetIsPlayerCard()) {
            let clickedPlayer = obj;
            if (clickedPlayer.isSamePlayer(player)) {
                let ind = clickedPlayer.cards.length - 1 - $(handler.target).parent().index();
                let card = player.cards[ind];
                this.board.discardPlayerCard(player, card);
            }

            if (player.cards.length <= MaxNoCards) {
                this.interruptFinished = true;
            }
        }
    }
}

class EpidemicPhase extends Phase {
    constructor(player, board) {
        super(player, board);
        this.stage = 2;
    }

    showPointers() {
        super.clearPointers();

        this.board.infectDeck.setClickable();
        this.board.setEventCardsClickable();
    }

    registerClick(handler, obj) {
        super.registerClick(handler, obj);

        if (this.stage == 2 && handler.isInfectDeck()) {
            let infectDeck = obj;
            infectDeck.discardBottomCard();
            let card = infectDeck.discards[0];

            if(!this.board.quarantineBlocks(card.name) && !this.board.medicBlocks(card.name)) {
                this.board.applyMaxInfection(card.name, card.color);
            }
            this.stage++;
        } else if (this.stage == 3 && handler.isInfectDeck()) {
            let infectDeck = obj;
            infectDeck.shuffleDiscards();
            infectDeck.replaceDiscards();
            this.complete = true;
        }
    }
}

class InfectPhase extends Phase {
    constructor(player, board) {
        super(player, board);
        this.drawNo = 0;
    }

    showPointers() {
        super.clearPointers();
        this.board.infectDeck.setClickable();
        this.board.setEventCardsClickable();
    }

    registerClick(handler, obj) {
        super.registerClick(handler, obj);

        if (handler.isInfectDeck()) {
            let infectDeck = obj;
            infectDeck.discardCard();
            let card = infectDeck.discards[0];

            if(!this.board.quarantineBlocks(card.name) && !this.board.medicBlocks(card.name)) {
                this.board.applyInfection(card.name, card.color);
            }

            this.drawNo++;
            super.playersDefeated();
            if (this.defeated || this.drawNo == InfectRateStages[this.board.status.infectStage]) {
                this.complete = true;
            }
        }
    }
}

class FinishedPhase extends Phase {
    constructor(player, board, result) {
        super(player, board);

        this.board.status.defeated = result.defeated;
        this.board.status.victory = result.victory;

        this.board.displayAll();

        stateController.saveState();
    }

    showPointers() {
        super.clearPointers();
    }

    registerClick(handler, obj) {
        super.registerClick(handler, obj);
    }
}
