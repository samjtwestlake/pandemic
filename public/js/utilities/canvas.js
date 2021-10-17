class Canvas {
    constructor(element) {
        this.element = element;
        this.nodes = {};
        this.ctx = this.element.getContext('2d');
    }

    drawNetwork(cities) {
        for (let city of Object.values(cities)) {
            let startX = city.coords.x;
            let startY = city.coords.y;
            
            let connNames = city.conns;
            for (let name of connNames) {
                if (cities[name]) {
                    let finalX = cities[name].coords.x;
                    let finalY = cities[name].coords.y;
    
                    this.drawLine(startX, startY, finalX, finalY);
                }
            }

            let wrapConnNames = city.wrapConns;
            let color = city.color;
            if (wrapConnNames.length) {
                for (let name of wrapConnNames) {
                    let finalX = startX + WrapLineOffsetX[color.toUpperCase()];
                    let finalY = startY + (cities[name].coords.y - startY)*0.5;

                    this.drawLine(startX, startY, finalX, finalY);
                }
            }
        }
    }

    drawLine(x1, y1, x2, y2) {
        let { ctx } = this;
        ctx.beginPath();
        ctx.strokeStyle = NetworkLineStyle.COLOR;
        ctx.lineWidth= NetworkLineStyle.LINEWIDTH;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    showInfectLevel(coords, level) {
        let colors = ['yellow', 'orange', 'red'];
        for (let i = 0; i < level; i++) {
            let margin = (i + 1)*0.2;
            let color = colors[i];
            let scale = this.element.width / this.element.offsetWidth;
            let rIcon = scale * CityIconSize;
            this.drawCircle(coords.x, coords.y, (rIcon * (1 + margin)) / 2, color);
        }
    }

    drawCircle(x, y, r, color) {
        let { ctx } = this;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.stokeStyle = InfectRingStyle.LINEWIDTH;
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.stroke();
    }

    // setNodes(cities) {
    //     let cityArr = Object.values(cities);
    //     for (let city of cityArr) {
    //         let node = new Node(city.name, city.coords);
    //         city.setNode(node);
    //         this.nodes[node.name] = node;
    //     }
    // }
}

// class Node {
//     constructor(name, coords) {
//         this.name = name;
//         this.coords = coords;
//     }
// }