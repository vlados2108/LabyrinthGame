import React from 'react'
import styles from './ColorCell.module.scss'

interface ColorCellProps{
    color:string,
    cellName:string
}

export default function ColorCell({color,cellName}:ColorCellProps) {
  return (
    <div className={styles['color-container']}>
        <div className={styles['color']} style={{backgroundColor:color}}/>
        <div className={styles['color-cell-name']}>{cellName}</div>
    </div>
  )
}
