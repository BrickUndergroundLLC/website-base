# Custom Content Blocks

This directory contains custom content blocks that can be used in the Mortar CMS editor.

## What are Blocks?

Blocks are reusable content components that editors can add, configure, and arrange within the CMS. Each block consists of:

1. **React Component** - The visual representation of the block
2. **Schema** - JSON definition of editable fields

## Creating a Block

### 1. Create the Block Component

Create `blocks/Testimonial/Testimonial.tsx`:

```tsx
import React from 'react'

export interface TestimonialBlockData {
  quote: string
  author: string
  role: string
  company: string
  image?: string
}

interface TestimonialBlockProps {
  data: TestimonialBlockData
}

export const TestimonialBlock: React.FC<TestimonialBlockProps> = ({ data }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-8 my-6">
      <blockquote className="text-xl italic text-gray-700 mb-4">
        "{data.quote}"
      </blockquote>
      <div className="flex items-center gap-4">
        {data.image && (
          <img 
            src={data.image} 
            alt={data.author}
            className="w-12 h-12 rounded-full"
          />
        )}
        <div>
          <div className="font-semibold text-gray-900">{data.author}</div>
          <div className="text-sm text-gray-600">
            {data.role} at {data.company}
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 2. Create the Block Schema

Create `blocks/Testimonial/schema.json`:

```json
{
  "type": "testimonial",
  "title": "Testimonial",
  "description": "Display a customer testimonial with quote and attribution",
  "icon": "quote",
  "category": "content",
  "fields": [
    {
      "name": "quote",
      "type": "text",
      "label": "Quote",
      "required": true,
      "placeholder": "Enter the testimonial quote..."
    },
    {
      "name": "author",
      "type": "string",
      "label": "Author Name",
      "required": true
    },
    {
      "name": "role",
      "type": "string",
      "label": "Role/Title",
      "required": true
    },
    {
      "name": "company",
      "type": "string",
      "label": "Company",
      "required": true
    },
    {
      "name": "image",
      "type": "image",
      "label": "Author Photo",
      "required": false
    }
  ]
}
```

### 3. Export the Block

Create `blocks/index.ts`:

```tsx
export { TestimonialBlock } from './Testimonial/Testimonial'
// Add more block exports here
```

## Block Structure

```
blocks/
├── Testimonial/
│   ├── Testimonial.tsx     # React component
│   └── schema.json         # Field definitions
├── PricingTable/
│   ├── PricingTable.tsx
│   └── schema.json
└── index.ts                # Export all blocks
```

## Schema Field Types

- `string` - Single line text
- `text` - Multi-line text
- `number` - Numeric input
- `boolean` - Checkbox
- `select` - Dropdown menu
- `image` - Image upload
- `url` - URL input
- `color` - Color picker
- `date` - Date picker

## Using Blocks in Content

Blocks are stored as JSON in the CMS and rendered dynamically:

```json
{
  "type": "testimonial",
  "data": {
    "quote": "This product changed my life!",
    "author": "Jane Doe",
    "role": "CEO",
    "company": "Acme Corp",
    "image": "/media/jane-doe.jpg"
  }
}
```

## Best Practices

- Keep blocks focused on a single purpose
- Provide clear field labels and placeholders
- Use appropriate field types
- Include helpful descriptions
- Handle optional fields gracefully
- Style with Tailwind CSS for consistency

