import React from 'react'
import { cn } from '../utils/cn'

function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  disabled = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]'
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 border border-transparent',
    secondary: 'border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white bg-slate-900/40 hover:bg-slate-900/60',
    ghost: 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50',
    white: 'bg-white hover:bg-slate-100 text-slate-900 font-semibold shadow-md',
  }

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }

  return (
    <button
      type={type}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
