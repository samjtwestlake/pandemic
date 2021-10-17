class ClickHandler {
    constructor(event) {
        this.element = event.currentTarget;
        this.target = event.target;
        this.event = event;
    }

    isCity() {
        return $(this.element).hasClass('city');
    }

    isActionButton() {
        return $(this.element).hasClass('action-button');
    }

    isStationButton() {
        return $(this.element).attr('id') == ElementIDs.ACTIONS.BUILD;
    }

    isShareButton() {
        return $(this.element).attr('id') == ElementIDs.ACTIONS.SHARE;
    }

    isTreatButton() {
        return $(this.element).attr('id') == ElementIDs.ACTIONS.TREAT;
    }

    isCureButton() {
        return $(this.element).attr('id') == ElementIDs.ACTIONS.CURE;
    }

    isPlayerDeck() {
        return $(this.element).attr('id') == ElementIDs.PLAYERDECK;
    }
    
    isInfectDeck() {
        return $(this.element).attr('id') == ElementIDs.INFECTDECK;
    }

    isPlayerPiece() {
        return $(this.element).hasClass('piece');
    }

    targetIsPlayerCard() {
        return $(this.target).hasClass('symbol');
    }

    targetIsCityCard() {
        return $(this.target).data('type') == PCType.CITY;
    }

    targetIsEventCard() {
        return $(this.target).data('type') == PCType.EVENT;
    }

    targetIsInfectCard() {
        return $(this.target).hasClass('infect-card');
    }

    isInfectDiscardPile() {
        return $(this.element).hasClass('discard-pile') && $(this.element).parent().hasClass('infect-deck');
    }
    
    isInfectCube() {
        return !!($(this.element).filter('.infect-cont:not(.own-color)').length);
    }

    isStartButton() {
        return $(this.element).hasClass('start');
    }

    isRandomiseButton() {
        return $(this.element).hasClass('randomise');
    }

    isResetButton() {
        return $(this.element).hasClass('reset');
    }

    isSkipButton() {
        return $(this.element).hasClass('skip');
    }

    isInfectHideButton() {
        return !!($(this.element).filter('.infect-card-display .button.hide').length);
    }

    isInfectShowButton() {
        return !!($(this.element).filter('.infect-card-display .button.show').length);
    }
}