class Cell {
    walls: boolean[]
    visited: boolean

    constructor() {
        this.walls = [true, true, true, true]
        this.visited = false;
    }
}

export default Cell;