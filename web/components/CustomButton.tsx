import React from 'react'

export interface CustomButtonProps {
  label: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  href?: string
  className?: string
}

export const CustomButton: React.FC<CustomButtonProps> = ({ 
  label, 
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all rounded-lg'
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
  }
  
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`
  
  if (href) {
    return (
      <a href={href} className={classes}>
        {label}
      </a>
    )
  }
  
  return (
    <button className={classes} onClick={onClick}>
      {label}
    </button>
  )
}

