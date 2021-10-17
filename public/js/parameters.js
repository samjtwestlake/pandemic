const CityIconSize = 26;

const InfectRateStages = [2, 2, 2, 3, 3, 4, 4];

const MapImageSize = {
    width: 2500,
    height: 1385,
};

const MaxNoCards = 7;
const MaxNoOutbreaks = 7;
const NoDiseaseCubes = 24;
const NoStartCards = {
    2: 4,
    3: 3,
    4: 2,
};

const NoStations = 6;

const ImgFPHead = "../img/";

const InfectCardImageFP = {
    BLACK: ImgFPHead + "infectCards/BlackInfectCard.png",
    BLUE: ImgFPHead + "infectCards/BlueInfectCard.png",
    RED: ImgFPHead + "infectCards/RedInfectCard.png",
    YELLOW: ImgFPHead + "infectCards/YellowInfectCard.png",
};

const InfectDeckDisplayState = {
    TOPDISCARD: 'top discard',
    ALLDISCARDS: 'all discards',
    TOPSIX: 'top six',
};

const EventCardNames = {
    ONEQUIETNIGHT: 'One Q. Night',
    RESILIENTPOP: 'Resilient Pop.',
    AIRLIFT: 'Airlift',
    GOVGRANT: 'Gov. Grant',
    FORECAST: 'Forecast',
};

const EventCardColor = 'orange';

const PlayerCardImageFP = {
    CITY: {
        BLACK: ImgFPHead + "playerCards/BlackCityPlayerCard.png",
        BLUE: ImgFPHead + "playerCards/BlueCityPlayerCard.png",
        RED: ImgFPHead + "playerCards/RedCityPlayerCard.png",
        YELLOW: ImgFPHead + "playerCards/YellowCityPlayerCard.png",
        // BLACK: ImgFPHead + "playerCards/cardSymbols/BlackCardSymbol.png",
        // BLUE: ImgFPHead + "playerCards/cardSymbols/BlueCardSymbol.png",
        // RED: ImgFPHead + "playerCards/cardSymbols/RedCardSymbol.png",
        // YELLOW: ImgFPHead + "playerCards/cardSymbols/YellowCardSymbol.png",
    },
    EPIDEMIC: ImgFPHead + "playerCards/Epidemic.png",
    EVENT: {
        [EventCardNames.ONEQUIETNIGHT.toUpperCase()]: ImgFPHead + "playerCards/EventOneQuietNight.png",
        [EventCardNames.RESILIENTPOP.toUpperCase()]: ImgFPHead + "playerCards/EventResilientPop.png",
        [EventCardNames.AIRLIFT.toUpperCase()]: ImgFPHead + "playerCards/EventAirlift.png",
        [EventCardNames.GOVGRANT.toUpperCase()]: ImgFPHead + "playerCards/EventGovGrant.png",
        [EventCardNames.FORECAST.toUpperCase()]: ImgFPHead + "playerCards/EventForecast.png",
    },
}

// const VirusCubeImageFP = {
//     BLUE: ImgFPHead + "cubes/BlueCube.png",
//     BLACK: ImgFPHead + "cubes/BlackCube.png",
//     RED: ImgFPHead + "cubes/RedCube.png",
//     YELLOW: ImgFPHead + "cubes/YellowCube.png",
// };

const WrapLineOffsetX = {
    BLUE: -200,
    YELLOW: -200,
    BLACK: 200,
    RED: 200,
}

// const ResearchStationImageFP = ImgFPHead + "pieces/Research Stations.png";
// const OutbreaksMarkerImageFP = ImgFPHead + "pieces/Outbreaks Marker.png";
// const InfectRateMarkerImageFP = ImgFPHead + "pieces/Infect Rate Marker.png";

// const CuredDiseasesImageFP = {
//     BLACK: ImgFPHead + "curedDiseases/Cure Marker - Black.png",
//     BLUE: ImgFPHead + "curedDiseases/Cure Marker - Blue.png",
//     RED: ImgFPHead + "curedDiseases/Cure Marker - Red.png",
//     YELLOW: ImgFPHead + "curedDiseases/Cure Marker - Yellow.png",
// };

// const EradicatedDiseasesImageFP = {
//     BLACK: ImgFPHead + "curedDiseases/Cure Marker - Black Eradicated.png",
//     BLUE: ImgFPHead + "curedDiseases/Cure Marker - Blue Eradicated.png",
//     RED: ImgFPHead + "curedDiseases/Cure Marker - Red Eradicated.png",
//     YELLOW: ImgFPHead + "curedDiseases/Cure Marker - Yellow Eradicated.png",
// };

const Direction = {
    NORTH: 'north',
    EAST: 'east',
    SOUTH: 'south',
    WEST: 'west',
}

const Colors = {
    BLUE: 'blue',
    BLACK: 'black',
    RED: 'red',
    YELLOW: 'yellow',
};

const NetworkLineStyle= {
    COLOR: 'white',
    LINEWIDTH: 3,
};

const InfectRingStyle= {
    LINEWIDTH: 2,
};

const StartLocation = 'Atlanta';

const RoleNames = {
    DISPATCHER: 'dispatcher',
    SCIENTIST: 'scientist',
    // PLANNER: 'planner',
    MEDIC: 'medic',
    RESEARCHER: 'researcher',
    OPERATIONS: 'operations',
    QUARANTINE: 'quarantine'
};

const RoleColors = {
    [RoleNames.DISPATCHER]: 'purple',
    [RoleNames.SCIENTIST]: 'white',
    [RoleNames.PLANNER]: 'cyan',
    [RoleNames.MEDIC]: 'orange',
    [RoleNames.RESEARCHER]: 'brown',
    [RoleNames.OPERATIONS]: 'palegreen',
    [RoleNames.QUARANTINE]: 'darkgreen',
};

const PhaseLabels = {
    ActionPhase: 'Action',
    DrawPhase: 'Draw',
    InfectPhase: 'Infect',
    EventPhase: 'Event',
    ShareActionPhase: 'Share',
    EpidemicPhase: 'Epidemic',
    DiscardPhase: 'Discard',
};

const RoleImgFPs = {
    [RoleNames.DISPATCHER]: ImgFPHead + 'pieces/dispatcher.png',
    [RoleNames.SCIENTIST]: ImgFPHead + 'pieces/scientist.png',
    [RoleNames.PLANNER]: ImgFPHead + 'pieces/planner.png',
    [RoleNames.MEDIC]: ImgFPHead + 'pieces/medic.png',
    [RoleNames.RESEARCHER]: ImgFPHead + 'pieces/researcher.png',
    [RoleNames.OPERATIONS]: ImgFPHead + 'pieces/operations.png',
    [RoleNames.QUARANTINE]: ImgFPHead + 'pieces/quarantine.png',
};

const ConnType = {
    WRAP: 'wrap',
    NOWRAP: 'no-wrap',
};

const EpidemicNo = 5;
const EpidemicPosRandomiser = 4;
const EpidemicCardName = 'epidemic';

const PCType = {
    CITY: 'city',
    EVENT: 'event',
    EPIDEMIC: 'epidemic',
}

const CityIconFPs = {
    [Colors.BLUE]: ImgFPHead + 'BlueVirusIcon.png',
    [Colors.BLACK]: ImgFPHead + 'BlackVirusIcon.png',
    [Colors.RED]: ImgFPHead + 'RedVirusIcon.png',
    [Colors.YELLOW]: ImgFPHead + 'YellowVirusIcon.png',
}

const ElementIDs = {
    PLAYERDECK: 'player-deck',
    INFECTDECK: 'infect-deck',
    ACTIONS: {
        BUILD: 'action-build',
        SHARE: 'action-share',
        TREAT: 'action-treat',
        CURE: 'action-cure',
    },
}