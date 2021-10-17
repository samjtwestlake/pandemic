const StateChange = {
    MOVEPLAYER: 'move player',
    DRAWINFECTCARD: 'draw infect card',
    DRAWPLAYERCARD: 'draw player card',
}

var state = {
    players: [],
    infectDeck: {
        cards: [],
        discards: [],
    },
    playerDeck: {
        cards: [],
        discards: [],
    },
    cities: {},
    status: {},
    phaseController: {},
    phase: {},
    prevPhase: { name: undefined },
}