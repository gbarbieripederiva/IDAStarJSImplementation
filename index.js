import Board from "./board.js";
import IDAStar,{heuristic} from "./IDAStar.js";

/**@type {HTMLCanvasElement} */
const canvas = document.querySelector("canvas.canvas")
const ctx = canvas.getContext("2d")
const board = new Board(
`########
#     .#
# ######
#      #
# ######
#     @#
########
########`
)
function setCanvasSize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    board.draw(ctx)
}
canvas.parentElement.onresize = setCanvasSize;
setCanvasSize();
const idastar = new IDAStar(board,heuristic);
let solution = idastar.run();
console.log(solution)
let initialState = board.saveState();
let i = 0;
board.draw(ctx)
// Draw solution
// setInterval(() => {
//     if(i == solution.length){
//         i = 0;
//         board.loadState(initialState)
//     }else{
//         board.move(solution[i])
//         i++;
//     }
//     board.draw(ctx);
// }, 1000);
// Draw solution
setInterval(() => {
    if(i == idastar.states.length){
        i = 0;
        board.draw(ctx)
    }else{
        const BLOCK_HEIGHT = Math.floor(ctx.canvas.height / board.size[0] )
        const BLOCK_WIDTH = Math.floor(ctx.canvas.width / board.size[1])
        ctx.fillStyle = "green"
        ctx.fillRect(
            idastar.states[i][1][1] * BLOCK_WIDTH,
            idastar.states[i][1][0] * BLOCK_HEIGHT,
            BLOCK_WIDTH,
            BLOCK_HEIGHT
        )
        i++;
    }
}, 1000);
