var Cities = [
    {
        name: 'San Francisco',
        color: Colors.BLUE,
        coords: {
            x: 176,
            y: 468,
        },
        connections: [
            'Chicago',
            'Los Angeles'
        ],
        wrapConnections: [
            'Tokyo',
            'Manila'
        ],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Chicago',
        color: Colors.BLUE,
        coords: {
            x: 430,
            y: 380,
        },
        connections: [
            'Montreal',
            'Atlanta',
            'Mexico City',
            'Los Angeles',
            'San Francisco'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Montreal',
        color: Colors.BLUE,
        coords: {
            x: 602,
            y: 350,
        },
        connections: [
            'New York',
            'Washington',
            'Chicago'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'New York',
        color: Colors.BLUE,
        coords: {
            x: 775,
            y: 378,
        },
        connections: [
            'London',
            'Madrid',
            'Washington',
            'Montreal'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'London',
        color: Colors.BLUE,
        coords: {
            x: 1100,
            y: 312,
        },
        connections: [
            'Essen',
            'Paris',
            'Madrid',
            'New York'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Essen',
        color: Colors.BLUE,
        coords: {
            x: 1270,
            y: 288,
        },
        connections: [
            'St. Petersburg',
            'Milan',
            'Paris',
            'London'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'St. Petersburg',
        color: Colors.BLUE,
        coords: {
            x: 1430,
            y: 275,
        },
        connections: [
            'Moscow',
            'Istanbul',
            'Essen'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Milan',
        color: Colors.BLUE,
        coords: {
            x: 1350,
            y: 390,
        },
        connections: [
            'Istanbul',
            'Paris',
            'Essen'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Paris',
        color: Colors.BLUE,
        coords: {
            x: 1210,
            y: 398,
        },
        connections: [
            'Essen',
            'Milan',
            'Algiers',
            'Madrid',
            'London'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Madrid',
        color: Colors.BLUE,
        coords: {
            x: 1035,
            y: 464,
        },
        connections: [
            'London',
            'Paris',
            'Algiers',
            'Sao Paulo',
            'New York'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Washington',
        color: Colors.BLUE,
        coords: {
            x: 652,
            y: 502,
        },
        connections: [
            'New York',
            'Miami',
            'Atlanta',
            'Montreal'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Atlanta',
        color: Colors.BLUE,
        coords: {
            x: 444,
            y: 524,
        },
        connections: [
            'Washington',
            'Miami',
            'Chicago'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Algiers',
        color: Colors.BLACK,
        coords: {
            x: 1220,
            y: 580,
        },
        connections: [
            'Istanbul',
            'Cairo',
            'Madrid',
            'Paris'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Istanbul',
        color: Colors.BLACK,
        coords: {
            x: 1440,
            y: 485,
        },
        connections: [
            'St. Petersburg',
            'Moscow',
            'Baghdad',
            'Cairo',
            'Algiers',
            'Milan'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Moscow',
        color: Colors.BLACK,
        coords: {
            x: 1540,
            y: 380,
        },
        connections: [
            'Tehran',
            'Istanbul',
            'St. Petersburg'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Tehran',
        color: Colors.BLACK,
        coords: {
            x: 1690,
            y: 440,
        },
        connections: [
            'Delhi',
            'Karachi',
            'Baghdad',
            'Moscow'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Delhi',
        color: Colors.BLACK,
        coords: {
            x: 1845,
            y: 520,
        },
        connections: [
            'Kolkata',
            'Chennai',
            'Mumbai',
            'Karachi',
            'Tehran'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Kolkata',
        color: Colors.BLACK,
        coords: {
            x: 1985,
            y: 565,
        },
        connections: [
            'Hong Kong',
            'Bangkok',
            'Chennai',
            'Delhi'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Chennai',
        color: Colors.BLACK,
        coords: {
            x: 1900,
            y: 680,
        },
        connections: [
            'Kolkata',
            'Bangkok',
            'Jakarta',
            'Mumbai',
            'Delhi'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Mumbai',
        color: Colors.BLACK,
        coords: {
            x: 1790,
            y: 770,
        },
        connections: [
            'Delhi',
            'Chennai',
            'Karachi'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Karachi',
        color: Colors.BLACK,
        coords: {
            x: 1730,
            y: 610,
        },
        connections: [
            'Delhi',
            'Mumbai',
            'Riyadh',
            'Baghdad',
            'Tehran'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Baghdad',
        color: Colors.BLACK,
        coords: {
            x: 1575,
            y: 560,
        },
        connections: [
            'Tehran',
            'Karachi',
            'Riyadh',
            'Cairo',
            'Istanbul'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Riyadh',
        color: Colors.BLACK,
        coords: {
            x: 1550,
            y: 700,
        },
        connections: [
            'Karachi',
            'Cairo',
            'Baghdad'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Cairo',
        color: Colors.BLACK,
        coords: {
            x: 1370,
            y: 600,
        },
        connections: [
            'Istanbul',
            'Baghdad',
            'Riyadh',
            'Khartoum',
            'Algiers',
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Los Angeles',
        color: Colors.YELLOW,
        coords: {
            x: 190,
            y: 610,
        },
        connections: [
            'Chicago',
            'Mexico City',
            'San Francisco'
        ],
        wrapConnections: [
            'Sydney'
        ],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Mexico City',
        color: Colors.YELLOW,
        coords: {
            x: 380,
            y: 680,
        },
        connections: [
            'Chicago',
            'Miami',
            'Bogota',
            'Lima',
            'Los Angeles'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Miami',
        color: Colors.YELLOW,
        coords: {
            x: 560,
            y: 675,
        },
        connections: [
            'Washington',
            'Bogota',
            'Mexico City',
            'Atlanta'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Bogota',
        color: Colors.YELLOW,
        coords: {
            x: 520,
            y: 835,
        },
        connections: [
            'Miami',
            'Sao Paulo',
            'Buenos Aires',
            'Lima',
            'Mexico City'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Sao Paulo',
        color: Colors.YELLOW,
        coords: {
            x: 810,
            y: 1030,
        },
        connections: [
            'Madrid',
            'Lagos',
            'Buenos Aires',
            'Bogota'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Lagos',
        color: Colors.YELLOW,
        coords: {
            x: 1160,
            y: 800,
        },
        connections: [
            'Khartoum',
            'Kinshasa',
            'Sao Paulo'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Khartoum',
        color: Colors.YELLOW,
        coords: {
            x: 1440,
            y: 760,
        },
        connections: [
            'Johannesburg',
            'Kinshasa',
            'Lagos',
            'Cairo'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Johannesburg',
        color: Colors.YELLOW,
        coords: {
            x: 1400,
            y: 1150,
        },
        connections: [
            'Khartoum',
            'Kinshasa'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Kinshasa',
        color: Colors.YELLOW,
        coords: {
            x: 1300,
            y: 950,
        },
        connections: [
            'Khartoum',
            'Johannesburg',
            'Lagos'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Buenos Aires',
        color: Colors.YELLOW,
        coords: {
            x: 715,
            y: 1190,
        },
        connections: [
            'Sao Paulo',
            'Bogota'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Lima',
        color: Colors.YELLOW,
        coords: {
            x: 510,
            y: 1065,
        },
        connections: [
            'Bogota',
            'Santiago',
            'Mexico City'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Santiago',
        color: Colors.YELLOW,
        coords: {
            x: 530,
            y: 1290,
        },
        connections: [
            'Lima'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Bangkok',
        color: Colors.RED,
        coords: {
            x: 2015,
            y: 750,
        },
        connections: [
            'Hong Kong',
            'Ho Chi Minh',
            'Jakarta',
            'Chennai',
            'Kolkata'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Hong Kong',
        color: Colors.RED,
        coords: {
            x: 2115,
            y: 650,
        },
        connections: [
            'Taipei',
            'Manila',
            'Ho Chi Minh',
            'Bangkok',
            'Kolkata',
            'Shanghai'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Shanghai',
        color: Colors.RED,
        coords: {
            x: 2050,
            y: 450,
        },
        connections: [
            'Seoul',
            'Tokyo',
            'Taipei',
            'Hong Kong',
            'Beijing'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Beijing',
        color: Colors.RED,
        coords: {
            x: 1990,
            y: 310,
        },
        connections: [
            'Seoul',
            'Shanghai'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Seoul',
        color: Colors.RED,
        coords: {
            x: 2200,
            y: 350,
        },
        connections: [
            'Tokyo',
            'Shanghai',
            'Beijing'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Tokyo',
        color: Colors.RED,
        coords: {
            x: 2340,
            y: 480,
        },
        connections: [
            'Osaka',
            'Shanghai',
            'Seoul'
        ],
        wrapConnections: [
            'San Francisco'
        ],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Osaka',
        color: Colors.RED,
        coords: {
            x: 2370,
            y: 610,
        },
        connections: [
            'Taipei',
            'Tokyo'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Taipei',
        color: Colors.RED,
        coords: {
            x: 2225,
            y: 550,
        },
        connections: [
            'Osaka',
            'Manila',
            'Hong Kong',
            'Shanghai'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Manila',
        color: Colors.RED,
        coords: {
            x: 2320,
            y: 865,
        },
        connections: [
            'Sydney',
            'Ho Chi Minh',
            'Hong Kong',
            'Taipei'
        ],
        wrapConnections: [
            'San Francisco'
        ],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Ho Chi Minh',
        color: Colors.RED,
        coords: {
            x: 2140,
            y: 870,
        },
        connections: [
            'Hong Kong',
            'Manila',
            'Jakarta',
            'Bangkok'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Jakarta',
        color: Colors.RED,
        coords: {
            x: 2045,
            y: 980,
        },
        connections: [
            'Bangkok',
            'Ho Chi Minh',
            'Sydney',
            'Chennai'
        ],
        wrapConnections: [],
        labelPos: Direction.NORTH,
    },
    {
        name: 'Sydney',
        color: Colors.RED,
        coords: {
            x: 2400,
            y: 1200,
        },
        connections: [
            'Jakarta',
            'Manila'
        ],
        wrapConnections: [
            'Los Angeles'
        ],
        labelPos: Direction.NORTH,
    },
];