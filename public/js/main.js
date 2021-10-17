let board = new Board();
// let state = new State();
var stateController = new StateController(board);
let phaseController = new PhaseController(board);
// stateController.saveState();
phaseController.setStaticListeners();