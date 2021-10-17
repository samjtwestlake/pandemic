class Board {
    constructor() {
        this.cities = this.initCities();
        this.infectDeck = this.initInfectDeck(this.cities);
        this.playerDeck = this.initPlayerDeck(this.cities);
        this.status = this.initStatus();
        this.canvas = this.initCanvas();
        this.canvas.drawNetwork(this.cities);
        this.defeatChecker = new DefeatChecker(this);
        this.availableRoles = Object.values(RoleNames);

        Object.defineProperty(this, 'ownIndex', {
            value: null,
            writable: true,
        });

        this.elements = {};
        Object.defineProperty(this.elements, 'hands', {
            value: $('.player-hands')[0],
        });
        Object.defineProperty(this.elements, 'infectRateDisplay', {
            value: $('.infect-rate-display')[0],
        });
        Object.defineProperty(this.elements, 'cureDisplay', {
            value: $('.cure-display')[0],
        });
        Object.defineProperty(this.elements, 'infectRateMarker', {
            value: $(this.elements.infectRateDisplay).find('.infect-marker')[0],
        });
        Object.defineProperty(this.elements, 'outbreakDisplay', {
            value: $('.outbreak-display')[0],
        });
        Object.defineProperty(this.elements, 'ownHand', {
            value: $('.own-hand')[0],
        });

        this.players = [];
        this.players = [this.genPlayer()];

        this.buildStation(this.cities['Atlanta']);
        this.initDisplay();
    }

    placePiece(player) {
        this.cities[player.location].addPlayer(player);
    }

    setPlayers(noPlayers) {
        this.availableRoles = Object.values(RoleNames);
        this.players = [];
        for (let i = 0; i < noPlayers; i++) {
            let player = this.genPlayer();
            this.players.push(player);
        }
    }

    genPlayer() {
        let roles = this.availableRoles;
        let ind = this.players.length;
        let x = Math.floor(Math.random() * roles.length);
        let player = this.initPlayer(roles[x], ind);
        this.availableRoles.splice(x, 1);
        this.placePiece(player, player.location);
        return player;
    }

    initPlayer(role, index) {
        let player = new Player(role, index, this.elements.hands);
        return player;
    }

    initPlayerDeck(cities) {
        let deck = new PlayerDeck(cities);
        return deck;
    }

    initInfectDeck(cities) {
        let deck = new InfectDeck(cities);
        return deck;
    }

    initStatus() {
        let status = {};
        status.cured = this.initCuredDiseases();
        status.eradicated = this.initCuredDiseases();
        status.infectStage = 0;
        status.outbreaks = 0;
        status.stations = NoStations;
        status.cubes = {};
        status.defeated = false;
        status.victory = false;
        status.playerDeckEmpty = false;
        for (let color of Object.values(Colors)) {
            status.cubes[color] = NoDiseaseCubes;
        }
        return status;
    }

    initCuredDiseases() {
        let cured = {};
        for (let color of Object.values(Colors)) {
            cured[color] = false;
        }
        return cured
    }

    initDisplay() {
        for (let city of Object.values(this.cities)) {
            city.displayStation();
        }
        this.infectDeck.displayByState();
        // this.playerDeck.displayDiscardTop();
        this.displayStatus();
    }

    cureDisease(color) {
        this.status.cured[color] = true;
        if (this.status.cubes[color] == NoDiseaseCubes) {
            this.eradicateDisease(color);
        }
        this.displayCures();
    }

    applyMedicOnCure(color) {
        for (let player of this.players) {
            if (player.hasRole(RoleNames.MEDIC)) {
                let city = this.cities[player.location];
                if (city.color == color) {
                    this.setInfect(city, color, 0);
                }
            }
        }
    }

    eradicateDisease(color) {
        this.status.eradicated[color] = true;
        this.displayCures();
    }

    discardPlayerCard(player, discard) {
        let cards = player.cards;
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            if (card.name == discard.name) {
                this.playerDeck.discard(card);
                player.discard(card);
            }
        }
    }

    discardCureCards(player, color, discardNo) {
        let cards = player.cards;
        let discardedNo = 0;
        while (discardedNo < discardNo) {
            for (let i = 0; i < cards.length; i++) {
                let card = cards[i];
                if (card.type == PCType.CITY && card.color == color) {
                    this.playerDeck.discard(card);
                    player.discard(card);
                    discardedNo++;
                }
            }
        }
    }

    displayOwnHand() {
        let ownPlayer = this.players[this.board.ownIndex];
        ownPlayer.displayOwnHand(this.elements.ownHand);
    }

    // discardCityCardByLocation(location, player) {
    //     let cards = player.cards;
    //     for (let i = 0; i < cards.length; i++) {
    //         let card = cards[i];
    //         if (card.name == location) {
    //             this.playerDeck.discard(card);
    //             player.cards.splice(i, 1);
    //         }
    //     }
    // }

    initCanvas() {
        let canvasEl = $('.canvas');
        canvasEl.attr({
            width: MapImageSize.width,
            height: MapImageSize.height,
        });
        let canvas = new Canvas(canvasEl[0]);
        return canvas;
    }

    initCities() {
        let cityCont = $('.board .cities');
        let cities = {};
        let clonable = $('.clonables .city');
        for (let cityData of Cities) {
            let cityEl = initCityEl(cityData, clonable);
            cityCont.append(cityEl);
            cities[cityData.name] = (new City(cityEl[0], cityData));
        }
        return cities;

        function initCityEl(data, clonable) {
            let cityEl = clonable.clone();
    
            let xPercent = (data.coords['x'] / MapImageSize.width) * 100;
            let yPercent = (data.coords['y'] / MapImageSize.height) * 100;
            cityEl.css({
                left: xPercent.toString() + '%',
                top: yPercent.toString() + '%',
            })
            let icon = cityEl.find('.city-icon');
            icon.attr('src', CityIconFPs[data.color]);

            return cityEl;
        }
    }

    disableStartButton() {
        $('.setup-display .start').attr('disabled', true);
        $('.setup-display .start').removeClass('enabled');
    }

    enableStartButton() {
        $('.setup-display .start').attr('disabled', false);
        $('.setup-display .start').addClass('enabled');
    }

    setup(noPlayers, noEpidemics) {
        this.playerDeck.reset();
        this.infectDeck.reset();
        this.clearInfections();
        this.clearPlayers();
        this.playerSetup(noPlayers);
        this.playerDeck.addEpidemicCards(noEpidemics);
        this.initialInfectDraw();
        phaseController.setSetupListeners();
    }

    clearInfections() {
        for (let city of Object.values(this.cities)) {
            for (let color of Object.values(Colors)) {
                let infect = city.infect[color];
                city.setInfect(color, 0);
                this.status.cubes[color] += infect;
            }
        }
    }

    initialInfectDraw() {
        for (let i = 3; i > 0; i--) {
            for (let j = 0; j < 3; j++) {
                this.infectDeck.discardCard();
                let card = this.infectDeck.discards[0];
                this.applyInfection(card.name, card.color, i);
            }
        }
    }
    
    disablePlayerActions() {
        for (let player of this.players) {
            player.disableActions();
        }
    }

    clearPlayers() {
        for (let player of this.players) {
            player.clearElements();
        }
        this.players = [];
    }

    setOwnIndex(ind) {
        this.ownIndex = ind;
    }

    playerSetup(n) {
        this.setPlayers(n);
        for (let player of this.players) {
            let noStartCards = NoStartCards[n];
            player.cards = this.playerDeck.yield(noStartCards);
            player.displayHand();
        }
        this.players[this.ownIndex].setOwnPlayer(true);
        this.players[this.ownIndex].setOwnHand(this.elements.ownHand);
        this.displayOwnHand();
    }

    displayOwnHand() {
        this.players[this.ownIndex].displayOwnHand();
    }

    buildStation(city) {
        city.buildStation();
        this.status.stations -= 1;
        this.displayStationCount();
    }

    movePlayer(player, city) {
        player.setLocation(city.name);
        city.addPlayer(player);
    }

    maxTreat(player, color) {
        let city = this.cities[player.location];
        this.setInfect(city, color, 0);
        this.displayCubeCounts();
    }

    treat(player, color) {
        let city = this.cities[player.location];
        let level = Math.max(city.infect[color] - 1, 0);
        this.setInfect(city, color, level);
        this.displayCubeCounts();
    }

    applyInfection(location, color, level=1) {
        for (let i = 0; i < level; i++) {
            let city = this.cities[location];
            if (!this.medicBlocks(city.name) && !this.quarantineBlocks(city.name) && !this.status.eradicated[color]) {
                if (city.infect[color] == 3) {
                    this.outbreak(city);
                } else {
                    this.incrInfect(city, color);
                }
            }
        }
    }

    applyMaxInfection(location, color) {
        let city = this.cities[location];
        if (!this.medicBlocks(city.name) && !this.quarantineBlocks(city.name) && !this.status.eradicated[color]) {
            if (city.infect[color] > 0) {
                this.setInfect(city, color, 3);
                this.outbreak(city);
            } else {
                this.setInfect(city, color, 3);
            }
        }
    }

    incrInfect(city, color) {
        this.status.cubes[color] -= 1;
        city.incrInfect(color);
        this.displayCubeCounts();
    }

    setInfect(city, color, x) {
        let orig = city.infect[color];
        let diff = x - orig;
        this.status.cubes[color] -= diff;
        city.setInfect(color, x);
        this.displayCubeCounts();

        if (x == 0) {
            if (this.status.cubes[color] == NoDiseaseCubes && this.status.cured[color]) {
                this.eradicateDisease(color);
            }
        }
    }

    quarantineBlocks(location) {
        let city = this.cities[location];
        let adjacents = city.conns.concat(city.wrapConns);
        adjacents.push(city.name);
        for (let player of this.players) {
            if (player.hasRole(RoleNames.QUARANTINE) && adjacents.includes(player.location)) {
                return true;
            }
        }
        return false;
    }

    medicBlocks(location) {
        let city = this.cities[location];
        for (let player of this.players) {
            if (this.status.cured[city.color] && player.hasRole(RoleNames.MEDIC) && player.location == city.name) {
                return true;
            }
        }
        return false;
    }

    coincidingPlayers(player) {
        let coPlayers = [];
        for (let other of this.players) {
            if (other.index != player.index) {
                if (other.location == player.location) {
                    coPlayers.push(other);
                }
            }
        }
        return coPlayers;
    }

    playerCanMoveToCity(player, city) {
        let loc = player.location;
        let locCity = this.cities[loc];
        let conns = locCity.conns.concat(locCity.wrapConns);
        
        if (city.name == loc || conns.includes(city.name)) {
            return true;
        } else  if (player.hasCityCard(city.name)) {
            return true;
        } else  if (player.hasCityCard(loc)) {
            return true;
        } else if (locCity.hasStation() && city.hasStation()) {
            return true;
        } else {
            return false;
        }
    }

    clearCityFronts() {
        $('.city').removeClass('front');
    }

    clearAllCardHighlights() {
        for (let player of this.players) {
            player.clearCardHighlights();
        }
    }

    applyPlayerHighlights() {
        for (let player of this.players) {
            player.applyHighlight();
            player.applyShareHighlight();
        }
    }

    setShareCityCardsClickable(player) {
        let location = player.location;
        for (let plyr of this.players) {
            let isResearcher = plyr.hasRole(RoleNames.RESEARCHER);
            let N = plyr.cards.length;
            for (let i = 0; i < N; i++) {
                let card = plyr.cards[i];
                if (card.name == location || isResearcher) {
                    if (card.type == PCType.CITY) {
                        let ind = N - 1 - i;
                        let cardEl = $(plyr.handEl).find('.player-hand-card')[ind];
                        $(cardEl).find('.symbol').addClass('clickable');
                    }
                }
            }
        }
    }

    clearPlayerHighlights() {
        for (let player of this.players) {
            player.removeHighlight();
        }
    }

    outbreak(city) {
        this.status.outbreaks++;
        this.chainOutbreak(city, [city.name]);
        this.displayOutbreaks();
    }

    chainOutbreak(city, prevCities) {
        let color = this.cities[prevCities[0]].color;
        let names = city.conns.concat(city.wrapConns);
        for (let name of names) {
            if(!prevCities.includes(name)) {
                let neighbour = this.cities[name];
                if (!this.medicBlocks(neighbour.name) && !this.quarantineBlocks(neighbour.name)) {
                    if (neighbour.infect[color] == 3) {
                        this.status.outbreaks++;
                        prevCities.push(neighbour.name);
                        this.chainOutbreak(neighbour, prevCities);
                    } else {
                        this.incrInfect(neighbour, color);
                    }
                }
            }
        }
    }

    incrInfectStage() {
        this.status.infectStage++;
        this.displayInfectRate();
    }

    allDiseasesCured() {
        return Object.values(this.status.cured).every(function(val) { return val; });
    }

    playersDefeated() {
        return this.defeatChecker.playersDefeated();
    }

    displayAll() {
        for (let player of this.players) {
            player.setPieceImg();
            player.displayHand();
            this.movePlayer(player, this.cities[player.location]);
            player.applyHighlight();
        }
        this.displayOwnHand();
        this.clearCityFronts();
        for (let city of Object.values(this.cities)) {
            city.displayInfect();
            city.displayStation();
        }
        this.infectDeck.displayByState();
        this.playerDeck.displayDiscardTop();
        this.displayStatus();
    }

    setEventCardsClickable() {
        for (let player of this.players) {
            player.setEventCardsClickable();
        }
    }

    displayOutbreaks() {
        let display = $(this.elements.outbreakDisplay);
        let marker = display.find('.outbreak-marker');
        let outbreakSteps = display.find('.outbreak-step');
        let ind = Math.min(this.status.outbreaks, MaxNoOutbreaks + 1);
        $(outbreakSteps[ind]).append(marker);
    }

    displayInfectRate() {
        $(this.elements.infectRateDisplay).find('.marker-holder')[this.status.infectStage].append(this.elements.infectRateMarker);
    }

    displayCures() {
        let cured = this.status.cured;
        let eradicated = this.status.eradicated;
        let cureDisplay = $(this.elements.cureDisplay);
        for (let color of Object.values(Colors)) {
            let markers = cureDisplay.find('.cure-holder.' + color).find('.cure-marker');
            markers.hide();
            if (eradicated[color]) {
                markers.filter('.eradicated').show();
            } else if (cured[color]) {
                markers.filter('.cured').show();
            }
        }
    }

    displayCubeCounts() {
        for (let color of Object.values(Colors)) {
            let count = this.status.cubes[color];
            $('.piece-count-display .cube.' + color).find('.label').text(count);
        }
    }

    displayStationCount() {
        $('.piece-count-display .stations .label').text(this.status.stations);  
    }

    displayPlayerCardCount() {
        $('.piece-count-display .player-cards .label').text(this.playerDeck.cards.length);  
    }

    displayEmptyPlayerDeck() {
        if(this.status.playerDeckEmpty) {
            $('#player-deck .draw-pile').addClass('empty');
        }
    }

    displayResult() {
        let message;
        if (this.status.defeated) {
            message = 'Defeat';
            $('.result-message').addClass('defeated').text(message);
        } else if (this.status.victory) {
            message = 'Victory!';
            $('.result-message').addClass('victory').text(message);
        }
    }

    displayStatus() {
        this.displayInfectRate();
        this.displayCures();
        this.displayOutbreaks();
        this.displayCubeCounts();
        this.displayStationCount();
        this.displayPlayerCardCount();
        this.displayResult();
        this.displayEmptyPlayerDeck();
    }
}