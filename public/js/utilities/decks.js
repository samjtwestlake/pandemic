class Deck {
    constructor() {
        this.cards = [];
        this.discards = [];
    }

    shuffle() {
        let { cards } = this;
        let N = cards.length;
        for (let x = 0; x < N; x++) {
            let y = Math.floor(Math.random() * N);
            [cards[x], cards[y]] = [cards[y], cards[x]];
        }
        this.cards = cards;
    }
}

class InfectDeck extends Deck {
    constructor(cities) {
        super();
        this.cities = cities;
        this.cards = this.initCards(cities);
        super.shuffle();
        this.id = ElementIDs.INFECTDECK;
        this.displayState = InfectDeckDisplayState.TOPDISCARD;

        Object.defineProperty(this, 'element', {
            value: $('#' + this.id)[0],
        });
        Object.defineProperties(this, {
            drawPile: {
                value: $(this.element).find('.draw-pile')[0],
            },
            discardPile: {
                value: $(this.element).find('.discard-pile')[0],
            },
            discardTop: {
                value: {
                    image: $(this.element).find('.discard-pile .top-card-image')[0],
                    label: $(this.element).find('.discard-pile .top-card-label')[0],
                },
            },
            display: {
                value: $('.infect-card-display')[0],
            },
            cardCont: {
                value: $('.infect-card-display .infect-card-cont')[0],
            },
        });
    }

    reset() {
        this.cards = this.initCards(this.cities);
        this.discards = [];
        super.shuffle();
    }

    setClickable() {
        $(this.drawPile).addClass('clickable');
    }

    setDisplayCardsClickable() {
        $(this.cardCont).find('.infect-card').addClass('clickable');
    }

    initCards(cities) {
        let cards = [];
        for (let city of Object.values(cities)) {
            let card = {
                name: city.name,
                color: city.color
            };
            cards.push(card);
        }
        return cards;
    }

    discardCard() {
        let card = this.cards.shift();
        this.discards.unshift(card);
        this.displayDiscardTop();
    }

    discardBottomCard() {
        let card = this.cards.pop();
        this.discards.unshift(card);
        this.displayDiscardTop();
    }

    displayDiscardTop() {
        this.displayState = InfectDeckDisplayState.TOPDISCARD;

        $(this.display).hide();
        $(this.cardCont).html('');
        if (this.discards.length) {
            let card = this.discards[0];
            let imgFP = InfectCardImageFP[card.color.toUpperCase()];
            let name = card.name;
            $(this.discardPile).removeClass('empty');
            $(this.discardTop.image).attr('src', imgFP);
            $(this.discardTop.label).text(name.toUpperCase());
        } else {
            $(this.discardPile).addClass('empty');
        }
    }

    displayByState() {
        if (this.displayState == InfectDeckDisplayState.TOPDISCARD) {
            this.displayDiscardTop();
        } else if (this.displayState == InfectDeckDisplayState.ALLDISCARDS) {
            this.displayDiscards();
        } else if (this.displayState == InfectDeckDisplayState.TOPSIX) {
            this.displayDiscardTop();
            this.displayTopSix();
        }
    }

    displayDiscards() {
        this.displayState = InfectDeckDisplayState.ALLDISCARDS;

        $(this.discardPile).addClass('empty');
        $(this.display).show();
        $(this.cardCont).html('');
        for (let card of this.discards) {
            let imgFP = InfectCardImageFP[card.color.toUpperCase()];
            let name = card.name;
            let cardObj = $('.clonables .infect-card').clone();
            cardObj.find('.image').attr('src', imgFP);
            cardObj.find('.label').text(name.toUpperCase());
            $(this.cardCont).append(cardObj);
        }
    }

    displayTopSix() {
        this.displayState = InfectDeckDisplayState.TOPSIX;

        $(this.display).show();
        $(this.cardCont).html('');
        let topSix = this.cards.slice(0, 6);
        for (let card of topSix) {
            let imgFP = InfectCardImageFP[card.color.toUpperCase()];
            let name = card.name;
            let cardObj = $('.clonables .infect-card').clone();
            cardObj.find('.image').attr('src', imgFP);
            cardObj.find('.label').text(name.toUpperCase());
            $(this.cardCont).append(cardObj);
        }
    }

    shuffleDiscards() {
        let cards = this.discards;
        let N = cards.length;
        for (let x = 0; x < N; x++) {
            let y = Math.floor(Math.random() * N);
            [cards[x], cards[y]] = [cards[y], cards[x]];
        }
        this.discards = cards;
        this.displayDiscardTop();
    }

    replaceDiscards() {
        this.cards = this.discards.concat(this.cards);
        this.discards = [];
        this.displayDiscardTop();
    }
}

class PlayerDeck extends Deck {
    constructor(cities) {
        super();
        this.cards = this.initCards(cities);
        super.shuffle();
        this.id = ElementIDs.PLAYERDECK;
        this.cities = cities;

        Object.defineProperty(this, 'element', {
            value: $('#' + this.id)[0],
        });
        Object.defineProperties(this, {
            discardPile: {
                value: $(this.element).find('.discard-pile')[0],
            },
            drawPile: {
                value: $(this.element).find('.draw-pile')[0],
            },
        });
    }

    reset() {
        this.cards = this.initCards(this.cities);
        this.discards = [];
        super.shuffle();
    }

    setClickable() {
        $(this.drawPile).addClass('clickable');
    }

    initCards(cities) {
        let cards = [];
        for (let city of Object.values(cities)) {
            let card = {
                type: PCType.CITY,
                name: city.name,
                color: city.color,
                highlighted: false,
            };
            cards.push(card);
        }
        for (let eventName of Object.values(EventCardNames)) {
            let card = {
                type: PCType.EVENT,
                name: eventName,
            };
            cards.push(card);
        }
        return cards;
    }

    addEpidemicCards(n) {
        let cards = this.cards;

        let separation = Math.floor(cards.length / n);
        let defaultPos = separation;
        for (let i = 0; i < n; i++) {
            let pos = defaultPos - Math.floor(Math.random() * EpidemicPosRandomiser);
            let card = {
                type: PCType.EPIDEMIC,
                name: EpidemicCardName + (i+1).toString(),
            };
            cards.splice(pos, 0, card);
            defaultPos += separation + 1;
        }
    }

    yield(n=1) {
        let { cards } = this;
        let drawnCards = [];
        for (let i = 0; i < n; i++) {
            let card = cards.shift();
            drawnCards.push(card);
        }
        return drawnCards;
    }

    yieldCityCards(n) {
        let { cards } = this;
        let drawnCards = [];
        for (let i = 0; i < n; i++) {
            let j = 0;
            while(j < cards.length) {
                let card = cards[j];
                if (card.type == PCType.CITY) {
                    cards.splice(j, 1);
                    drawnCards.push(card);
                    break;
                }
                j++;
            }
        }
        return drawnCards;
    }
    
    discard(card) {
        this.discards.unshift(card);
        this.displayDiscardTop();
    }

    displayDiscardTop() {
        let discardPile = $(this.discardPile);
        if (this.discards.length) {
            let card = this.discards[0];
            discardPile.html('');
            discardPile.removeClass('empty');
    
            let cardEl = $(".clonables .player-card").clone();
            let imgFP;
            if (card.type == PCType.CITY) {
                imgFP = PlayerCardImageFP.CITY[card.color.toUpperCase()];
                cardEl.find('.label').text(card.name.toUpperCase());
            } else if (card.type == PCType.EPIDEMIC) {
                imgFP = PlayerCardImageFP.EPIDEMIC;
            } else if (card.type == PCType.EVENT) {
                imgFP = PlayerCardImageFP.EVENT[card.name.toUpperCase()];
            }
            cardEl.find('.image').attr('src', imgFP);
            discardPile.append(cardEl);
        } else {
            discardPile.addClass('empty');
        }
        
    }
}