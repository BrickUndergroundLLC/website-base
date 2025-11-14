# Custom Page Templates

This directory contains custom page templates that extend or override the default templates.

## What are Templates?

Templates define the layout and structure for different content types:

- **Article Templates** - For blog posts and articles
- **Category Templates** - For category listing pages
- **Author Templates** - For author profile pages
- **Page Templates** - For custom pages
- **Landing Page Templates** - For marketing/landing pages

## Creating a Template

### Example: Custom Article Template

Create `templates/Article/Article.tsx`:

```tsx
import React from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export interface ArticleData {
  title: string
  slug: string
  content: any[] // Array of content blocks
  author: {
    name: string
    slug: string
    avatar?: string
  }
  category: {
    name: string
    slug: string
  }
  publishedAt: string
  featuredImage?: string
  excerpt?: string
}

interface ArticleTemplateProps {
  article: ArticleData
}

export default function ArticleTemplate({ article }: ArticleTemplateProps) {
  return (
    <>
      <Header />
      
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={article.featuredImage} 
              alt={article.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-4 text-gray-600">
            <a 
              href={`/authors/${article.author.slug}`}
              className="flex items-center gap-2 hover:text-primary-600"
            >
              {article.author.avatar && (
                <img 
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <span>{article.author.name}</span>
            </a>
            
            <span>•</span>
            
            <a 
              href={`/categories/${article.category.slug}`}
              className="hover:text-primary-600"
            >
              {article.category.name}
            </a>
            
            <span>•</span>
            
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {article.content.map((block, index) => (
            <BlockRenderer key={index} block={block} />
          ))}
        </div>
      </article>
      
      <Footer />
    </>
  )
}

// Helper component to render content blocks
function BlockRenderer({ block }: { block: any }) {
  // This would dynamically load the appropriate block component
  // based on block.type and render it with block.data
  return null // Placeholder
}
```

## Template Types

### 1. Article Template
Override: `templates/Article/Article.tsx`

Used for blog posts and articles. Receives article data including content blocks, author, category, and metadata.

### 2. Category Template
Override: `templates/Category/Category.tsx`

Used for category pages. Displays a list of articles in that category with filtering and pagination.

### 3. Author Template
Override: `templates/Author/Author.tsx`

Used for author profile pages. Shows author bio and their articles.

### 4. Page Template
Override: `templates/Page/Page.tsx`

Used for custom pages. Flexible template for any content type.

### 5. Landing Page Template
Create: `templates/LandingPage/LandingPage.tsx`

Custom template for marketing pages with hero sections, features, etc.

## Template Props

Each template receives props specific to its content type:

```typescript
// Article Template
interface ArticleTemplateProps {
  article: ArticleData
  relatedArticles?: ArticleData[]
}

// Category Template
interface CategoryTemplateProps {
  category: CategoryData
  articles: ArticleData[]
  pagination: PaginationData
}

// Author Template
interface AuthorTemplateProps {
  author: AuthorData
  articles: ArticleData[]
}
```

## Using Templates

Templates are automatically selected based on:

1. Content type (article, category, author, page)
2. Custom template assignment in CMS
3. Fallback to default templates

## Best Practices

- Use TypeScript for type safety
- Include proper SEO meta tags
- Make templates responsive
- Use semantic HTML
- Follow accessibility guidelines
- Leverage shared components (Header, Footer, etc.)
- Handle loading and error states
- Support dynamic content blocks

