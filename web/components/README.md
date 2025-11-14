# Custom Components

This directory contains custom React components that can be used throughout your website.

## Usage

Create reusable React components here that can be imported and used in your templates and blocks.

### Example Component

Create `components/CustomButton.tsx`:

```tsx
import React from 'react'

interface CustomButtonProps {
  label: string
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export const CustomButton: React.FC<CustomButtonProps> = ({ 
  label, 
  variant = 'primary',
  onClick 
}) => {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all'
  const variantClasses = variant === 'primary' 
    ? 'bg-blue-600 text-white hover:bg-blue-700' 
    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
```

### Using in Templates or Blocks

```tsx
import { CustomButton } from '@/components/CustomButton'

export default function MyTemplate() {
  return (
    <div>
      <CustomButton label="Click Me" variant="primary" />
    </div>
  )
}
```

## Component Guidelines

- Use TypeScript for type safety
- Follow React best practices
- Keep components focused and reusable
- Include proper prop types
- Document complex components
- Use Tailwind CSS for styling

