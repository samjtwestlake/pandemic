class DefeatChecker {
    constructor(board) {
        this.board = board;
    }

    playersDefeated() {
        let results = [];
        results.push(this.tooManyOutbreaks());
        results.push(this.runOutCards());
        results.push(this.runOutCubes());

        if (results.every(function(val) { return !val; })) {
            return false;
        } else {
            return true;
        }
    }

    tooManyOutbreaks() {
        let { board } = this;
        if (board.status.outbreaks > MaxNoOutbreaks) {
            return true;
        } else {
            return false;
        }
    }

    runOutCubes() {
        let { board } = this;
        for (let count of Object.values(board.status.cubes)) {
            if (count <= 0) {
                return true;
            }
        }
        return false;
    }

    runOutCards() {
        let { board } = this;
        if (!board.playerDeck.cards.length) {
            this.board.status.playerDeckEmpty = true;
            return true;
        } else {
            return false;
        }
    }
}