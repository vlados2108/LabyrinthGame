import React from 'react'
import styles from './Grid.module.scss'
import { Cell } from '@/app/Shared/types'

interface GridProps {
    gridArray: Cell[]
    toggleWall: (index: number) => void
}

export default function Grid({ gridArray, toggleWall }: GridProps) {
    return (
        <div className={styles['grid-container']}>
            {gridArray.map((el, index) => {
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
    )
}
