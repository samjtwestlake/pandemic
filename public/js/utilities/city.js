class City {
    constructor(element, data) {
        this.name = data.name;
        this.color = data.color;
        this.coords = data.coords;
        this.conns = data.connections;
        this.wrapConns = data.wrapConnections;
        this.infect = {
            [Colors.BLUE]: 0,
            [Colors.RED]: 0,
            [Colors.BLACK]: 0,
            [Colors.YELLOW]: 0,
        };
        this.station = false;

        Object.defineProperty(this, 'element', {
            value: element,
        });
        Object.defineProperty(this, 'label', {
            value: this.initLabel(data.labelPos),
        });
        Object.defineProperty(this, 'playerCont', {
            value: $(this.element).find('.player-cont')[0],
        });
        Object.defineProperty(this, 'infectCont', {
            value: $(this.element).find('.infect-cont')[0],
        });
        Object.defineProperty(this, 'stationEl', {
            value: this.initStationEl(),
        });

        this.displayInfect();
    }

    initLabel(position) {
        let label = $(this.element).find('.label');
        label.addClass(position);
        label.text(this.name.toUpperCase());
        return label[0];
    }

    setClickable() {
        $(this.element).addClass('clickable');
    }

    initStationEl() {
        return $(this.element).find('.station')[0];
    }

    addPlayer(player) {
        $(this.playerCont).append(player.element);
    }

    incrInfect(color) {
        this.infect[color] = Math.floor(this.infect[color] + 1, 3);
        this.displayInfect();
    }

    setInfect(color, infection) {
        this.infect[color] = infection;
        this.displayInfect();
    }

    displayInfect() {
        let infectCont = $(this.infectCont);
        infectCont.find('.infect-ring').hide();
        if (this.infect[this.color] == 1) {
            infectCont.find('.infect-1').show();
        } else if (this.infect[this.color] == 2) {
            infectCont.find('.infect-2').show();
        } else if (this.infect[this.color] == 3) {
            infectCont.find('.infect-3').show();
        }

        for (let color of Object.values(Colors)) {
            if (color != this.color) {
                let infectCont = $(this.element).find('.cube-cont .infect-cont.' + color);
                infectCont.removeClass('show');
                infectCont.find('.infect-ring').hide();

                if (this.infect[color] > 0) {
                    infectCont.addClass('show');
                    
                    if (this.infect[color] == 1) {
                        infectCont.find('.infect-1').show();
                    } else if (this.infect[color] == 2) {
                        infectCont.find('.infect-2').show();
                    } else if (this.infect[color] == 3) {
                        infectCont.find('.infect-3').show();
                    }
                }
            }
        }
    }

    hasStation() {
        return this.station;
    }

    buildStation() {
        this.station = true;
        this.displayStation();
    }

    displayStation() {
        if (this.station) {
            $(this.stationEl).show();
        } else {
            $(this.stationEl).hide();
        }
    }
}