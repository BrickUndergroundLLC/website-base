# Custom Templates, Components, and Blocks

## Overview

This website extends the `mortarcms/web-base` Docker image, which comes with a set of default (base) templates, components, and blocks. Your custom additions are placed in the `web/` directory and automatically merged with the base items.

## Directory Structure

### In This Repository

```
git-website-base/
└── web/
    ├── templates/         # Your custom templates
    ├── components/        # Your custom components
    └── blocks/            # Your custom blocks
```

### Inside the Container

When the container runs, the structure looks like this:

```
/app/
├── templates/
│   ├── base/             # From web-base image (BlogPost, LandingPage, etc.)
│   └── custom/           # Mounted from web/templates/ (YOUR custom templates)
├── components/
│   ├── base/             # From web-base image (Header, Footer, Hero, etc.)
│   └── custom/           # Mounted from web/components/ (YOUR custom components)
└── blocks/
    ├── base/             # From web-base image (CallToAction, PricingTable, etc.)
    └── custom/           # Mounted from web/blocks/ (YOUR custom blocks)
```

## How It Works

### Development Mode (docker-compose.yml)

The docker-compose configuration uses volume mounts to overlay your custom items:

```yaml
volumes:
  - ./web/templates:/app/templates/custom
  - ./web/components:/app/components/custom
  - ./web/blocks:/app/blocks/custom
```

This means:
- ✅ Base items from the image remain untouched
- ✅ Your custom items are added alongside them
- ✅ Changes to your files are immediately reflected (hot reload)
- ✅ You can reference both base and custom items in your code

### Production Mode (Dockerfile)

For production builds, the Dockerfile copies your custom items into the image:

```dockerfile
COPY --chown=nextjs:nodejs ./components /app/components/custom
COPY --chown=nextjs:nodejs ./blocks /app/blocks/custom
COPY --chown=nextjs:nodejs ./templates /app/templates/custom
```

## Discovery API Endpoints

All templates, components, and blocks (both base and custom) are automatically discovered via API endpoints:

### Templates
**GET** `/mortarcms-api/templates`

Returns both base and custom templates:
```json
{
  "templates": [
    {"id": "base.BlogPost", "name": "Blog Post", "fileName": "BlogPost.tsx"},
    {"id": "custom.MyTemplate", "name": "My Template", "fileName": "MyTemplate.tsx"}
  ],
  "count": 2
}
```

### Components
**GET** `/mortarcms-api/components`

Returns both base and custom components:
```json
{
  "components": [
    {"id": "base.Header", "name": "Header", "fileName": "Header.tsx"},
    {"id": "custom.MyComponent", "name": "My Component", "fileName": "MyComponent.tsx"}
  ],
  "count": 2
}
```

### Blocks
**GET** `/mortarcms-api/blocks`

Returns both base and custom blocks:
```json
{
  "blocks": [
    {"id": "base.CallToAction", "name": "Call To Action", "fileName": "CallToAction.tsx"},
    {"id": "custom.MyBlock", "name": "My Block", "fileName": "MyBlock.tsx"}
  ],
  "count": 2
}
```

## Using Items in Your Code

### Importing Base Items

```tsx
// Use base templates
import BlogPost from '@/templates/base/BlogPost'

// Use base components
import Header from '@/components/base/Header'
import Footer from '@/components/base/Footer'

// Use base blocks
import CallToAction from '@/blocks/base/CallToAction'
```

### Importing Custom Items

```tsx
// Use your custom templates
import MyTemplate from '@/templates/custom/MyTemplate'

// Use your custom components
import MyComponent from '@/components/custom/MyComponent'

// Use your custom blocks
import MyBlock from '@/blocks/custom/MyBlock'
```

### Example Page

```tsx
// app/page.tsx
import Header from '@/components/base/Header'
import Footer from '@/components/base/Footer'
import MyHero from '@/components/custom/MyHero'
import CallToAction from '@/blocks/base/CallToAction'

export default function HomePage() {
  return (
    <>
      <Header />
      <MyHero />
      <CallToAction 
        title="Get Started Today"
        buttonText="Sign Up"
      />
      <Footer />
    </>
  )
}
```

## Creating Custom Items

### 1. Create a Custom Template

```tsx
// web/templates/ArticleTemplate.tsx
interface ArticleTemplateProps {
  title: string
  content: string
  author: string
}

export default function ArticleTemplate({ title, content, author }: ArticleTemplateProps) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-gray-600 mb-8">By {author}</p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  )
}
```

After creating this file, it will:
- Be available at `custom.ArticleTemplate` in the API
- Be importable as `@/templates/custom/ArticleTemplate`
- Appear in the Mortar CMS template selector

### 2. Create a Custom Component

```tsx
// web/components/Newsletter.tsx
export default function Newsletter() {
  return (
    <div className="bg-blue-600 text-white p-8 rounded-lg">
      <h3 className="text-2xl font-bold mb-4">Subscribe to our newsletter</h3>
      <form className="flex gap-2">
        <input 
          type="email" 
          placeholder="Your email"
          className="flex-1 px-4 py-2 rounded"
        />
        <button className="bg-white text-blue-600 px-6 py-2 rounded font-medium">
          Subscribe
        </button>
      </form>
    </div>
  )
}
```

### 3. Create a Custom Block

```tsx
// web/blocks/FeatureGrid.tsx
interface Feature {
  title: string
  description: string
  icon: string
}

interface FeatureGridProps {
  features: Feature[]
}

export default function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div key={index} className="text-center">
          <div className="text-4xl mb-4">{feature.icon}</div>
          <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}
```

## Best Practices

### 1. Don't Modify Base Items
- ❌ Never edit files in `/app/templates/base`, `/app/components/base`, or `/app/blocks/base`
- ✅ Create new custom items that extend or replace base functionality
- ✅ Base items will be updated when you upgrade the web-base image

### 2. Follow Naming Conventions
- Use PascalCase for file names: `MyTemplate.tsx`, `MyComponent.tsx`
- Export as default: `export default function MyComponent() { ... }`
- Use descriptive names that indicate purpose

### 3. Organize Your Custom Items
```
web/components/
├── forms/
│   ├── ContactForm.tsx
│   └── NewsletterForm.tsx
└── ui/
    ├── Card.tsx
    └── Badge.tsx
```

### 4. Document Your Custom Items
Add comments explaining props and usage:

```tsx
/**
 * CustomHero - A hero section with background image
 * 
 * @param {string} title - Main headline text
 * @param {string} subtitle - Supporting text below title
 * @param {string} backgroundImage - URL to background image
 * @param {string} ctaText - Call-to-action button text
 * @param {string} ctaLink - CTA button destination URL
 */
export default function CustomHero({ ... }) {
  // ...
}
```

## Upgrading the Base Image

When a new version of `mortarcms/web-base` is released:

1. Update the image version in `docker-compose.yml` and `web/Dockerfile`
2. Restart your containers: `docker compose up -d`
3. Your custom items remain untouched
4. New base items are available alongside your custom ones

```yaml
# docker-compose.yml
example-web:
  image: mortarcms/web-base:1.0.4  # Updated version
```

```dockerfile
# web/Dockerfile
FROM mortarcms/web-base:1.0.4 AS base  # Updated version
```

## Troubleshooting

### Custom items not showing in API
- Verify files are `.tsx` or `.jsx`
- Check file names use PascalCase
- Ensure default export exists
- Restart the container: `docker compose restart example-web`

### Import errors
- Use correct path: `@/templates/custom/MyTemplate` not `@/templates/MyTemplate`
- Check file name matches import
- Verify the file exists in the correct directory

### Hot reload not working
- Check volume mounts in docker-compose.yml
- Ensure you're editing files in `web/templates/`, `web/components/`, or `web/blocks/`
- Restart container if needed

## Summary

- ✅ Base items from `mortarcms/web-base` are preserved
- ✅ Your custom items are added in parallel
- ✅ Both are discoverable via API endpoints
- ✅ Import using `@/templates/custom/*`, `@/components/custom/*`, `@/blocks/custom/*`
- ✅ Hot reload works in development
- ✅ Safe to upgrade base image

