'use client'
import React, { useState, useEffect } from 'react'
import styles from './page.module.scss'

type Cell = {
    row: number
    col: number
    isStart: boolean
    isFinish: boolean
    isWall: boolean
    distance: number
    isVisited: boolean
    previousNode: Cell | null
}

const ROWS = 100
const COLS = 100

const PathfindingApp = () => {
    const [grid, setGrid] = useState<Cell[]>([])
    const [startNode, setStartNode] = useState(0)
    const [finishNode, setFinishNode] = useState(9999)
    const [isRunning, setIsRunning] = useState(false)
    const [executionTime, setExecutionTime] = useState(0)
    const [startSeting, setStartSeting] = useState(false)
    const [finishSeting, setFinishSeting] = useState(false)
    useEffect(() => {
        initializeGrid()
    }, [])

    const initializeGrid = () => {
        const grid = new Array(ROWS * COLS).fill([]).map((el, index) => {
            return {
                row: Math.floor(index / ROWS),
                col: index % ROWS,
                isStart: index === 0 ? true : false,
                isFinish: index === 9999 ? true : false,
                isWall: false,
                distance: Infinity,
                isVisited: false,
                previousNode: null,
            }
        })
        setGrid(grid)
    }

    const getNeighbors = (node: Cell) => {
        const { row, col } = node
        const neighbors = []
        if (row > 0) neighbors.push(grid[(row - 1) * COLS + col])
        if (row < ROWS - 1) neighbors.push(grid[(row + 1) * COLS + col])
        if (col > 0) neighbors.push(grid[row * COLS + col - 1])
        if (col < COLS - 1) neighbors.push(grid[row * COLS + col + 1])
        return neighbors.filter((neighbor) => !neighbor.isWall)
    }

    const visualizePath = (path: Cell[]) => {
        path.forEach((node) => {
            node.isVisited = true
        })
        setGrid([...grid])
    }

    const findPath = () => {
        if (!isRunning) {
            const startTime = performance.now()

            const start = grid[startNode]
            const finish = grid[finishNode]
            const openSet: Cell[] = [start]
            const closedSet: Cell[] = []

            start.distance = 0 

            while (openSet.length > 0) {
                let currentNode = openSet[0]
                let currentIndex = 0

                openSet.forEach((node, index) => {
                    if (
                        node.distance + heuristic(node, finish) <
                        currentNode.distance + heuristic(currentNode, finish)
                    ) {
                        currentNode = node
                        currentIndex = index
                    }
                })

                if (
                    currentNode.row === finish.row &&
                    currentNode.col === finish.col
                ) {
                    const path = []
                    let current = currentNode
                    while (current !== start) {
                        path.unshift(current)
                        current = current.previousNode!
                    }
                    const endTime = performance.now()
                    const timeElapsed = endTime - startTime
                    setExecutionTime(timeElapsed)
                    visualizePath(path)
                    return path
                }

                openSet.splice(currentIndex, 1)
                closedSet.push(currentNode)

                const neighbors = getNeighbors(currentNode)
                neighbors.forEach((neighbor) => {
                    if (!closedSet.includes(neighbor) && !neighbor.isWall) {
                        const tempDistance = currentNode.distance + 1
                        if (tempDistance < neighbor.distance) {
                            neighbor.distance = tempDistance
                            neighbor.previousNode = currentNode
                            if (!openSet.includes(neighbor))
                                openSet.push(neighbor)
                        }
                    }
                })
            }
           
            const endTime = performance.now()
            const timeElapsed = endTime - startTime
            setExecutionTime(timeElapsed)
            return []
        }
    }

    const heuristic = (nodeA: Cell, nodeB: Cell) => {
        return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col)
    }

    const toggleWall = (ind: number) => {
        if (!isRunning) {
            const newGrid = grid.slice()
            if (startSeting) {
                newGrid[startNode].isStart = false
                newGrid[ind].isStart = !newGrid[ind].isStart
                setStartSeting(false)
                setStartNode(ind)
            }
            if (finishSeting) {
                newGrid[finishNode].isFinish = false
                newGrid[ind].isFinish = !newGrid[ind].isFinish
                setFinishSeting(false)
                setFinishNode(ind)
            }
            if (!newGrid[ind].isStart && !newGrid[ind].isFinish)
                newGrid[ind].isWall = !newGrid[ind].isWall
            setGrid(newGrid)
        }
    }

    const setStart = () => {
        setStartSeting(!startSeting)
        if (finishSeting) setFinishSeting(false)
    }
    const setEnd = () => {
        setFinishSeting(!finishSeting)
        if (startSeting) setStartSeting(false)
    }

    return (
        <div className={styles['main-container']}>
            <h1>Pathfinding Visualizer</h1>
            <div className={styles['main-btns-container']}>
                <button onClick={findPath}>
                    Построить маршрут
                </button>
                <button
                    className={`${startSeting && styles.active}`}
                    onClick={setStart}
                >
                    Поставить старт
                </button>
                <button
                    className={`${finishSeting && styles.active}`}
                    onClick={setEnd}
                >
                    Поставить финиш
                </button>
            </div>

            <div className={styles['grid-container']}>
                {grid.map((el, index) => {
                    return (
                        <div
                            key={index}
                            className={`${styles['grid-cell']} ${
                                el.isWall && styles.wall
                            } ${el.isStart && styles.start} ${
                                el.isFinish && styles.finish
                            } ${el.isVisited && !el.isFinish && styles.visited}`}
                            onClick={() => toggleWall(index)}
                        ></div>
                    )
                })}
            </div>

            <div>Время выполнения: {executionTime}ms</div>
        </div>
    )
}

export default PathfindingApp
