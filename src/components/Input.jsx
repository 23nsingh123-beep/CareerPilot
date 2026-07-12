import React from 'react'
import { cn } from '../utils/cn'

function Input({
  label,
  id,
  type = 'text',
  placeholder,
  error,
  className,
  required = false,
  icon: Icon,
  ...props
}) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <label 
          htmlFor={id} 
          className="text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-slate-500 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          required={required}
          className={cn(
            "w-full bg-slate-900/60 border border-slate-800 text-slate-100 rounded-xl py-3 px-4 transition-all duration-300 placeholder:text-slate-500",
            "focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-slate-900/90",
            "hover:border-slate-700",
            Icon ? "pl-11" : "",
            error ? "border-rose-500/80 focus:ring-rose-500 focus:border-rose-500" : ""
          )}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-rose-500 mt-0.5">{error}</span>
      )}
    </div>
  )
}

export default Input
