export function heuristic(board,state) {
    return Math.abs(state[0] - board.objective[0]) + Math.abs(state[0] - board.objective[0]);
}

export default class IDAStar{
    board;
    heuristic;
    states;

    constructor(board,heuristic){
        this.board = board;
        this.heuristic = heuristic;
        this.states = []
        this.repeated_states = {}
        this.frontier_nodes = []
        this.frontier_nodes.push([this.f(this.board.saveState(),0), this.board.saveState(), []])
        this._sortFrontier()
        this.solution = null
    }

    f(state,cost) {
       return this.heuristic(this.board,state) + cost; 
    }
    _sortFrontier(){
        this.frontier_nodes.sort((a,b)=> a[0] < b[0])
    }


    _DLS( node, limit){
        // Initiate stack
        let node_stack = []
        node_stack.push(node)
        // While there are elements in the stack
        while(node_stack.length > 0){
            // Get last and load it
            let current_node = node_stack.pop()
            this.board.loadState(current_node[1])
            this.states.push(current_node)
            // If won return it
            if(this.board.gameWon()){
                return current_node
            }
            // Else get possible movemnets and test them
            let possibleMoves = this.board.getPossibleMoves();
            for(const m of possibleMoves){
                // move and save state
                this.board.move(m)
                let new_state = this.board.saveState()
                let new_node = [this.f(new_state,current_node[2].length + 1), new_state, [...current_node[2],m]]
                let repKey = new_state.join(",");
                // If state is not repeated or, if repeated, has less cost
                if(!(typeof this.repeated_states[repKey] !== 'undefined' && this.repeated_states[new_state] <= new_node[0])){
                    // If it's not in deadlock or we arent testing for deadlocks save it
                    // if over limit save it in frontier, else save it in stack
                    this.repeated_states[repKey] = new_node[0]
                    if(new_node[0] > limit){
                        this.frontier_nodes.push(new_node)
                        this._sortFrontier()
                    }
                    else{
                        node_stack.push(new_node)
                    }
                }
                // Reload state to make moves again
                this.board.loadState(current_node[1])
            }
        }
        return []
    }

    _IDAStar(){
        let solution_node;
        // While elements in frontier
        while(this.frontier_nodes.length > 0){
            // Get the one with least f value
            let current_node = this.frontier_nodes.shift()
            // Run limited depth search
            solution_node = this._DLS(current_node, current_node[0])
            // If solution found set statistics and return it
            if(solution_node.length > 0){
                return solution_node[2]
            }
        }
        return false
    }

    run(){
        if(this.solution != null){
            return this.solution
        }
        let initial_state = this.board.saveState()
        this.solution = this._IDAStar()
        this.board.loadState(initial_state)
        return this.solution
    }
    
}