export type Cell = {
    row: number
    col: number
    isStart: boolean
    isFinish: boolean
    isWall: boolean
    distance: number
    isVisited: boolean
    previousNode: Cell | null
}