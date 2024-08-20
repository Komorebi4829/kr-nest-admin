import type { ButtonProps } from 'antd'
import clsx from 'clsx'
import { CSSProperties, ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  style?: CSSProperties
} & ButtonProps
export default function IconButton({ children, className, style, onClick, disabled }: Props) {
  return (
    <button
      style={style}
      className={clsx(
        `flex items-center justify-center rounded-full p-2 hover:bg-hover`,
        className,
        disabled ? 'cursor-no-drop' : 'cursor-pointer',
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
