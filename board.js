export default class Board {
    board;
    playerPosition;
    objective;
    static BLOCKS = {
        PLAYER: "@",
        WALL: "#",
        OBJECTIVE: ".",
        EMPTY: " ",
    };
    static MOVES = {
        UP: [-1, 0],
        RIGHT: [0, 1],
        DOWN: [1, 0],
        LEFT: [0, -1],
    };
    /**
     * @param code {String}
     */
    constructor(code) {
        let maxline = 0;
        let board = code.split("\n").map((v) => {
            let line = v.split("");
            if (line.length > maxline) maxline = line.length;
            return line;
        });
        if (board.length > maxline) maxline = board.length;
        
        for (let i = 0; i < board.length; i++) {
            if (board[i].length < maxline) {
                board[i].push(
                    ...(new Array(maxline - board[i].length).fill(Board.BLOCKS.EMPTY))
                );
            }
        }
        for (let i = 0; board.length < maxline; i++) {
            board.push(new Array(maxline).fill(Board.BLOCKS.EMPTY));
        }
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] == Board.BLOCKS.PLAYER) {
                    board[i][j] = Board.BLOCKS.EMPTY;
                    this.playerPosition = [i, j];
                } else if (board[i][j] == Board.BLOCKS.OBJECTIVE) {
                    board[i][j] = Board.BLOCKS.EMPTY;
                    this.objective = [i, j];
                }
            }
        }
        this.board = board;
        this.size = [board.length, maxline];
    }
    getNewPosition(move) {
        return [
            this.playerPosition[0] + move[0],
            this.playerPosition[1] + move[1],
        ];
    }
    isValidPosition(newPosition) {
        if (
            newPosition[0] > 0 &&
            newPosition[0] < this.size[0] &&
            newPosition[1] > 0 &&
            newPosition[1] < this.size[1] &&
            this.board[newPosition[0]][newPosition[1]] != Board.BLOCKS.WALL
        ) {
            return true;
        } else {
            return false;
        }
    }
    isValidMove(move) {
        return this.isValidPosition(this.getNewPosition(move));
    }
    move(move) {
        let newPosition = this.getNewPosition(move);
        if (this.isValidPosition(newPosition)) {
            this.playerPosition = newPosition;
        }
    }

    getPossibleMoves() {
        let possibleMoves = [];
        for (const move in Board.MOVES) {
            if (this.isValidMove(Board.MOVES[move])) {
                possibleMoves.push(Board.MOVES[move]);
            }
        }
        return possibleMoves;
    }
    gameWon() {
        return (
            this.playerPosition[0] == this.objective[0] &&
            this.playerPosition[1] == this.objective[1]
        );
    }
    saveState() {
        return this.playerPosition;
    }
    loadState(state) {
        this.playerPosition = state;
    }


    /**
     * @param ctx {CanvasRenderingContext2D}
     */
    drawStaticBoard(ctx){
        const BLOCK_HEIGHT = Math.floor(ctx.canvas.height / this.size[0] )
        const BLOCK_WIDTH = Math.floor(ctx.canvas.width / this.size[1])
        ctx.fillStyle = "brown"
        ctx.strokeStyle = "black"
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if(this.board[i][j] == Board.BLOCKS.EMPTY){
                    ctx.strokeRect(
                        j * BLOCK_WIDTH,
                        i * BLOCK_HEIGHT,
                        BLOCK_WIDTH,
                        BLOCK_HEIGHT );
                }else{
                    ctx.fillRect(
                        j * BLOCK_WIDTH,
                        i * BLOCK_HEIGHT,
                        BLOCK_WIDTH,
                        BLOCK_HEIGHT );
                }
            }
        }
        ctx.fillStyle = "red"
        ctx.fillRect(
            this.objective[1] * BLOCK_WIDTH,
            this.objective[0] * BLOCK_HEIGHT,
            BLOCK_WIDTH,
            BLOCK_HEIGHT 
        );
    }
    /**
     * @param ctx {CanvasRenderingContext2D}
     */
    drawDynamicBoard(ctx){
        const BLOCK_HEIGHT = Math.floor(ctx.canvas.height / this.size[0] )
        const BLOCK_WIDTH = Math.floor(ctx.canvas.width / this.size[1])
        ctx.fillStyle = "blue"
        ctx.fillRect(
            this.playerPosition[1] * BLOCK_WIDTH,
            this.playerPosition[0] * BLOCK_HEIGHT,
            BLOCK_WIDTH,
            BLOCK_HEIGHT)
    }
    /**
     * @param ctx {CanvasRenderingContext2D}
     */
    draw(ctx){
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
        this.drawStaticBoard(ctx)
        this.drawDynamicBoard(ctx)
    }
}
