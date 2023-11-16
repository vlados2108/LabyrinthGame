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
    const [startNode, setStartNode] = useState({ row: 5, col: 5 })
    const [finishNode, setFinishNode] = useState({ row: 15, col: 15 })
    const [isRunning, setIsRunning] = useState(false)
    const [executionTime, setExecutionTime] = useState(0)

    useEffect(() => {
        initializeGrid()
    }, [])

    const initializeGrid = () => {
        const grid = new Array(ROWS * COLS).fill([]).map((el, index) => {
            return {
                row: Math.floor(index / ROWS),
                col: index % ROWS,
                isStart: false,
                isFinish: false,
                isWall: false,
                distance: Infinity,
                isVisited: false,
                previousNode: null,
            }
        })
        setGrid(grid)
    }

    const visualizePathfinding = () => {
        if (!isRunning) {
            const startTime = performance.now()

            const endTime = performance.now()
            const timeElapsed = endTime - startTime
            setExecutionTime(timeElapsed)
        }
    }

    const toggleWall = (ind: number) => {
        if (!isRunning) {
            const newGrid = grid.slice()
            //if (!newGrid[row][col].isStart && !newGrid[row][col].isFinish)
            newGrid[ind].isWall = !newGrid[ind].isWall
            console.log(newGrid[ind])
            setGrid(newGrid)
        }
    }

    return (
        <div className={styles['main-container']}>
            <h1>Pathfinding Visualizer</h1>
            <button onClick={visualizePathfinding}>Построить маршрут</button>

            <div className={styles['grid-container']}>
                {grid.map((el, index) => {
                    return (
                        <div
                            key={index}
                            className={`${styles['grid-cell']} ${
                                el.isWall && styles.wall
                            } ${el.isStart && styles.start} ${
                                el.isFinish && styles.finish
                            }`}
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
