'use client'
import React, { useState, useEffect } from 'react'
import Modal from './Components/Modal'
import ColorCell from './Components/ColorCell'
import { Cell } from './Shared/types'
import styles from './page.module.scss'
import Grid from './Components/Grid'

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
    const [resultModalActive, setResultModalActive] = useState(false)
    const [noPathtModalActive, setNoPathModalActive] = useState(false)
    const [modalWidth, setModalWidth] = useState(20)

    useEffect(() => {
        initializeGrid()
        if (typeof window !== 'undefined') {
            setModalWidth(window.innerWidth < 480 ? 70 : 20)
        }
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
                    setResultModalActive(true)
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

            setNoPathModalActive(true)
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

    const clearfield = () => {
        initializeGrid()
        setStartNode(0)
        setFinishNode(9999)
        setExecutionTime(0)
    }
    return (
        <div className={styles['main-container']}>
            <div className={styles['main-header']}>Поиск пути</div>
            <div className={styles['main-btns-container']}>
                <button onClick={findPath}>Построить маршрут</button>
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
                <button onClick={clearfield}>Очистить поле</button>
            </div>
            <div className={styles['colors-container']}>
                <ColorCell color="#401bf7;" cellName="Старт" />
                <ColorCell color="#29253a" cellName="Финиш" />
                <ColorCell color="red" cellName="Препятсвие" />
                <ColorCell color="green" cellName="Путь" />
            </div>
            <Grid gridArray={grid} toggleWall={toggleWall} />

            <Modal
                active={resultModalActive}
                setActive={setResultModalActive}
                width={modalWidth}
            >
                <div className={styles['modal-content-res']}>
                    Время выполнения: {executionTime.toFixed(2)}ms
                </div>
            </Modal>
            <Modal
                active={noPathtModalActive}
                setActive={setNoPathModalActive}
                width={modalWidth}
            >
                <div className={styles['modal-content-res']}>
                    Ошибка: невозможно достигнуть конечной точки!
                </div>
            </Modal>
        </div>
    )
}

export default PathfindingApp
