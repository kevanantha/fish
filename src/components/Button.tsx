import React from 'react'
import cls from './Button.module.scss'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'solid' | 'outline'
  type?: 'button' | 'submit' | 'reset'
  isDisabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  style?: React.CSSProperties
}

const Button = ({ children, type = 'button', variant = 'solid', isDisabled = false, style, onClick }: ButtonProps) => {
  if (!children) {
    console.error('Button component requires children')
  }

  const vari = variant === 'solid' ? cls.btnSolid : cls.btnOutline

  return (
    <button type={type} className={vari} disabled={isDisabled} onClick={onClick} style={style}>
      {children}
    </button>
  )

}

export default Button
