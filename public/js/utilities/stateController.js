class StateController {
    constructor(board) {
        this.board = board;
    }

    // initState() {
    //     this.derivePlayers();
    //     this.deriveInfectDeck();
    //     this.derivePlayerDeck();
    // }

    saveState() {
        this.savePlayers();
        this.saveInfectDeck();
        this.savePlayerDeck();
        this.saveCities();
        this.saveStatus();
        this.savePhaseController();
        this.savePhase();
    }

    saveStatus() {
        Object.assign(state.status, { ...this.board.status });
    }

    savePlayers() {
        state.players = [];
        for (let player of this.board.players) {
            let playerState = {};
            Object.assign(playerState, { ...player });
            state.players.push(playerState);
        }
    }

    saveCities() {
        Object.assign(state.cities, { ...this.board.cities });
    }

    saveInfectDeck() {
        let infectDeck = this.board.infectDeck;
        state.infectDeck.cards = [];
        for (let card of infectDeck.cards) {
            state.infectDeck.cards.push(card);
        }
        state.infectDeck.discards = [];
        for (let card of infectDeck.discards) {
            state.infectDeck.discards.push(card);
        }
        state.infectDeck.displayState = infectDeck.displayState;
    }

    savePlayerDeck() {
        let playerDeck = this.board.playerDeck;
        state.playerDeck.cards = [];
        for (let card of playerDeck.cards) {
            state.playerDeck.cards.push(card);
        }
        state.playerDeck.discards = [];
        for (let card of playerDeck.discards) {
            state.playerDeck.discards.push(card);
        }
    }

    savePhaseController() {
        state.phaseController.skipInfect = phaseController.skipInfect;
    }

    savePhase() {
        Object.assign(state.phase, { ...phaseController.phase });
        Object.assign(state.prevPhase, { ...phaseController.prevPhase });
    }

    // update(type, data) {
    //     if (type == StateChange.MOVEPLAYER) {
    //         let player = data.player;
    //         let destination = data.destination;
    //         let playerObj = state.players[player.index];
    //         playerObj.location = destination;
    //     } else if (type == StateChange.DRAWINFECTCARD) {
    //         let infectDeck = state.infectDeck;
    //         infectDeck.discards.unshift(infectDeck.cards.shift());
    //     } else if (type == StateChange.DRAWPLAYERCARD) {
    //         let player = data.currPlayer;
    //         let playerDeck = state.playerDeck;
    //         state.players[player.index].cards.unshift(playerDeck.cards.shift());
    //     }

    //     this.applyState();
    // }

    loadInitState(newState) {
        state = newState;
        loadInitPlayers();
    }

    initStateFromJSONString(str) {
        let newState = JSON.parse(str);
        this.initPlayers(newState.players);
        // this.initPlayerDeck();
        this.loadState(newState);
        this.displayState();
    }

    initState(state) {
        this.initPlayers(state.players);
        // this.initPlayerDeck();
        this.loadState(state);
        this.displayState();
        phaseController.setSetupListeners();
    }

    applyStateFromJSONString(str) {
        let newState = JSON.parse(str);
        this.loadState(newState);
        this.displayState();
    }

    applyState(state) {
        this.loadState(state);
        this.displayState();
    }

    loadState(newState) {
        state = newState;
        this.loadPlayers();
        this.loadInfectDeck();
        this.loadPlayerDeck();
        this.loadCities();
        this.loadStatus();
        this.loadPhaseController();
        this.loadPhase();
    }

    displayState() {
        this.board.displayAll();
        this.board.applyPlayerHighlights();
        phaseController.display();
        phaseController.phase.clearPointers();
        
        if (this.board.ownIndex == phaseController.phase.player.index) {
            phaseController.phase.showPointers();
        }
    }

    initPlayerDeck() {
        this.board.playerDeck = new PlayerDeck(this.board.cities);
    }

    initPlayers(statePlayers) {
        let { board } = this;
        board.clearPlayers();
        for (let i = 0; i < statePlayers.length; i++) {
            board.players.push(new Player(statePlayers[i].role, i, board.elements.hands));
        }
        board.players[board.ownIndex].setOwnPlayer(true);
        board.players[board.ownIndex].setOwnHand(board.elements.ownHand);
    }

    // loadPlayers() {
    //     let { players } = state;
    //     this.board.players = [];
    //     for (let i = 0; i < players.length; i++) {
    //         this.board.players.push(new Player(players[i].role, i));
    //         Object.assign(this.board.players[i], { ...players[i] });
    //     }
    // }

    // applyState() {
    //     // board.movePlayer(player, location);
    //     this.applyPlayers();
    //     this.applyInfectDeck();
    // }

    loadPlayers() {
        let playerStates = state.players;
        for (let playerState of playerStates) {
            let player = this.board.players[playerState.index];
            Object.assign(player, { ...playerState });
            player.applyHighlight();
        }
    }

    loadInfectDeck() {
        Object.assign(this.board.infectDeck, { ...state.infectDeck });
    }

    loadPlayerDeck() {
        Object.assign(this.board.playerDeck, { ...state.playerDeck });
    }

    loadCities() {
        for (let key of Object.keys(state.cities)) {
            Object.assign(this.board.cities[key], { ...state.cities[key] });
        }
    }

    loadStatus() {
        Object.assign(this.board.status, { ...state.status });
    }

    loadPhaseController() {
        phaseController.skipInfect = state.phaseController.skipInfect;
        let activePlayer = this.board.players[state.phase.activePlayerIndex];
        phaseController.activePlayer = activePlayer;
    }

    initPhase(phaseName) {
        let phase;
        let activePlayer = phaseController.activePlayer;
        if (phaseName == 'ActionPhase') {
            phase = new ActionPhase(activePlayer, this.board);
            // if (activePlayer.hasRole(RoleNames.DISPATCHER)) {
            //     let selectedPlayer = this.board.players[state.phase.selectedPlayerIndex];
            //     phase.selectedPlayer = selectedPlayer;
            // }
        } else if (phaseName == 'ShareActionPhase') {
            phase = new ShareActionPhase(activePlayer, this.board);
        } else if (phaseName == 'DrawPhase') {
            phase = new DrawPhase(activePlayer, this.board);
        } else if (phaseName == 'EpidemicPhase') {
            phase = new EpidemicPhase(activePlayer, this.board);
        } else if (phaseName == 'InfectPhase') {
            phase = new InfectPhase(activePlayer, this.board);
        } else if (phaseName == 'EventPhase') {
            phase = new EventPhase(activePlayer, this.board);
        } else if (phaseName == 'DiscardPhase') {
            phase = new DiscardPhase(activePlayer, this.board);
        } else if (phaseName == 'SetupPhase') {
            phase = new SetupPhase(activePlayer, this.board);
        }
        return phase;
    }
    
    loadPhase() {
        phaseController.phase = this.initPhase(state.phase.name);
        phaseController.phase.init();
        Object.assign(phaseController.phase, { ...state.phase });
        if (state.phase.name == 'ActionPhase' || state.phase.name == 'EventPhase') {
            phaseController.phase.initSelected();
        }

        phaseController.prevPhase = this.initPhase(state.prevPhase.name);
        Object.assign(phaseController.prevPhase, { ...state.prevPhase });
    }
}