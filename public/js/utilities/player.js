class Player {
    constructor(role, index, handCont) {
        this.role = role;
        this.index = index;
        this.color = this.initColor(this.role);
        this.location = StartLocation;
        this.highlighted = false;
        this.shareHighlighted = false;
        this.applyHighlight();

        let handEl = $('.clonables .hand').clone();
        handEl.addClass('player-' + index.toString());
        handEl.addClass(this.color);
        $(handCont).append(handEl);

        Object.defineProperty(this, 'isOwnPlayer', {
            value: false,
            writable: true,
        });
        Object.defineProperty(this, 'handEl', {
            value: handEl[0],
        });
        Object.defineProperty(this, 'element', {
            value: this.initElement(this.role),
        });
        Object.defineProperty(this, 'piece', {
            value: $(this.element).find('.piece'),
        });
        this.setPieceImg();
        this.setListeners();
        
        this.cards = [];
    }

    setOwnPlayer(setting) {
        this.isOwnPlayer = setting;
    }

    setOwnHand(handCont) {
        Object.defineProperty(this, 'ownHand', {
            value: handCont,
        });
    }

    drawCards(n, playerDeck) {
        let drawnCards = playerDeck.yield(n);
        this.cards.unshift(...drawnCards);
        this.displayHand();
    }

    drawCard(playerDeck) {
        let card = playerDeck.yield(1)[0];
        this.cards.unshift(card);
        this.displayHand();
    }

    takeCard(card, player) {
        let cards = player.cards;
        let ind;
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].name == card.name) {
                ind = i;
                break;
            }
        }
        cards.splice(ind, 1)[0];
        this.cards.push(card);
        player.displayHand();
        this.displayHand();
    }

    discard(discard) {
        this.removeCard(discard);
        this.displayHand();
    }

    discardByLocation(location) {
        let cards = this.cards;
        for (let card of cards) {
            if (card.name == location) {
                this.discard(card);
                break;
            }
        }
    }

    removeCard(card) {
        let ind = this.cards.findIndex(function(val) {
            if (val.name == card.name) {
                return true;
            } else {
                return false;
            }
        });
        this.cards.splice(ind, 1);
    }

    setLocation(location) {
        this.location = location;
    }

    initColor(role) {
        let color = RoleColors[role];
        return color;
    }

    initElement(role) {
        let element = $('.clonables .player').clone();
        let piece = element.find('.piece');
        piece.attr('id', 'piece' + this.index.toString());
        return element[0];
    }

    setPieceImg() {
        $(this.piece).attr('src', RoleImgFPs[this.role]);
    }

    setClickable() {
        $(this.element).addClass('clickable');
    }

    setEventCardsClickable() {
        let cards = this.cards;
        let N = cards.length;

        for (let i = 0; i < N; i++) {
            let card = cards[i];
            if (card.type == PCType.EVENT) {
                let ind = N - 1 - i;
                let cardEl = $(this.handEl).find('.player-hand-card')[ind];
                $(cardEl).find('.symbol').addClass('clickable');
            }
        }
    }

    setPlayerCardsClickable() {
        $(this.handEl).find('.player-hand-card').addClass('clickable');
    }

    setListeners() {
        let piece = $(this.piece);
        let playerEl = $(this.element);
        let actionCont = playerEl.find('.action-button-cont');
        piece.on('mouseenter', function(e) {
            playerEl.parents('.city').addClass('front');
            if (playerEl.hasClass('acting')) {
                actionCont.addClass('show');
            }
        });
        actionCont.on('mouseleave', function(e) {
            playerEl.parents('.city').removeClass('front');
            actionCont.removeClass('show');
        });
    }

    enableActions() {
        $(this.element).addClass('acting');
    }

    disableActions() {
        $(this.element).removeClass('acting');
    }

    tooManyCards() {
        if (this.cards.length > MaxNoCards) {
            return true;
        } else  {
            return false;
        }
    }

    applyHighlight() {
        if (this.highlighted) {
            this.addHighlight();
        } else {
            this.removeHighlight();
        }
    }

    addHighlight() {
        $(this.element).find('.piece-outline').addClass('show');
        this.highlighted = true;
    }

    removeHighlight() {
        $(this.element).find('.piece-outline').removeClass('show');
        this.highlighted = false;
    }

    applyShareHighlight() {
        if (this.shareHighlighted) {
            this.addShareHighlight();
        } else {
            this.removeShareHighlight();
        }
    }

    addShareHighlight() {
        $(this.element).find('#' + ElementIDs.ACTIONS.SHARE).addClass('highlight');
        this.shareHighlighted = true;
    }

    removeShareHighlight() {
        $(this.element).find('#' + ElementIDs.ACTIONS.SHARE).removeClass('highlight');
        this.shareHighlighted = false;
    }

    displayOwnHand() {
        $(this.ownHand).html('');
        for (let card of this.cards) {
            let cardEl = this.createCardElement(card);
            $(cardEl).addClass('own-card');
            $(this.ownHand).prepend(cardEl);
        }
    }

    createCardElement(card) {
        let cardEl = $('.clonables .player-hand-card').clone();
        let symbol = cardEl.find('.symbol');
        if (card.type == PCType.CITY) {
            symbol.text(card.name.toUpperCase());
            symbol.css('background-color', card.color);
            if (card.color == Colors.YELLOW) {
                symbol.css('color', 'black');
            }
            symbol.data('type', PCType.CITY);
        } else if (card.type == PCType.EVENT) {
            symbol.text(card.name.toUpperCase());
            symbol.css('background-color', EventCardColor);
            symbol.data('type', PCType.EVENT);
        }
        if (card.highlighted) {
            symbol.addClass('highlighted');
        }
        return cardEl;
    }

    displayHand() {
        let handCont = $(this.handEl);
        handCont.find('.player-hand-card').remove();
        for (let card of this.cards) {
            let cardEl = this.createCardElement(card);
            let background = $(this.handEl).find('.background');
            background.css('background-color', this.color);

            // let cardObj = $(".clonables .player-card").clone();
            // if (card.type == PCType.CITY) {
            //     imgFP = PlayerCardImageFP.CITY[card.color.toUpperCase()];
            //     cardObj.find('.label').text(card.name.toUpperCase());
            // } else if (card.type == PCType.EPIDEMIC) {
            //     imgFP = PlayerCardImageFP.EPIDEMIC;
            // } else if (card.type == PCType.EVENT) {
            //     imgFP = PlayerCardImageFP.EVENT[card.name.toUpperCase()];
            // }
            
            // cardObj.find('.background').css('background-color', this.color);
            // cardObj.find('.image').attr('src', imgFP);
            handCont.prepend(cardEl);
        }

        if (this.isOwnPlayer) {
            this.displayOwnHand();
        }
    }

    clearCardHighlights() {
        for (let card of this.cards) {
            card.highlighted = false;
        }
    }

    hasRole(role) {
        return this.role == role;
    }

    curableColor() {
        let colorCount = {};
        let colors = Object.values(Colors);
        for (let color of colors) {
            colorCount[color] = 0;
        }
        for (let card of this.cards) {
            colorCount[card.color] += 1;
        }
        for (let color of colors) {
            if (colorCount[color] >= 5) {
                return color;
            }
        }
        return false;
    }

    isSamePlayer(player) {
        return this.index == player.index;
    }

    hasCityCard(location) {
        for (let card of this.cards) {
            if (card.name == location) {
                return true;
            }
        }
        return false;
    }

    getCityCard(location) {
        for (let card of this.cards) {
            if (card.name == location) {
                return card;
            }
        }
        return false;
    }

    shareablePlayers(players) {
        let location = this.location;
        let sharePlayers = [];
        for (let other of players) {
            if (other.location == location) {
                if (this.hasCityCard(location)) {
                    sharePlayers.append(other);
                } else if (other.hasCityCard(location)) {
                    sharePlayers.append(other);
                }
            }
        }

        if (sharePlayers.length) {
            return sharePlayers;
        } else {
            return false;
        }
    }

    countCardColors() {
        let colorCount = {};
        for (let color of Object.values(Colors)) {
            colorCount[color] = 0;
        }
        for (let card of this.cards) {
            if (card.type == PCType.CITY) {
                colorCount[card.color] += 1;
            }
        }
        return colorCount;
    }

    clearElements() {
        $(this.handEl).remove();
        $(this.element).remove();
        $(this.piece).remove();
    }
}