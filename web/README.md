# Website Customizations

This directory contains customizations for your Mortar CMS website. The base Next.js application comes from the `mortarcms/web-base` Docker image, and you can extend or override it here.

## Structure

- **`components/`** - Custom React components that can be used throughout your site
- **`blocks/`** - Content blocks that can be used in the CMS editor
- **`templates/`** - Page templates that extend or override the defaults

## How It Works

When you build your Docker image:

1. The `mortarcms/web-base` image provides the complete Next.js application with default templates, blocks, and components
2. Your customizations in this directory are copied into the image
3. Custom components can be imported and used in your templates and blocks
4. Custom templates can override the default article, category, author, and page templates
5. Custom blocks can be used in the CMS editor to create rich content

## Development Workflow

### Adding a Custom Component

1. Create your component in `components/`
2. Export it from `components/index.ts`
3. Use it in templates or blocks

### Adding a Custom Block

1. Create a folder in `blocks/` (e.g., `blocks/Testimonial/`)
2. Add `Testimonial.tsx` with your React component
3. Add `schema.json` defining the block's editable fields
4. The block will be available in the CMS editor

### Adding a Custom Template

1. Create a folder in `templates/` (e.g., `templates/Article/`)
2. Add `Article.tsx` with your custom page template
3. This will override the default article template

## Example Structure

```
web/
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   └── index.ts
├── blocks/
│   ├── Testimonial/
│   │   ├── Testimonial.tsx
│   │   └── schema.json
│   └── PricingTable/
│       ├── PricingTable.tsx
│       └── schema.json
└── templates/
    ├── Article/
    │   └── Article.tsx
    └── LandingPage/
        └── LandingPage.tsx
```

## Docker Build

The Dockerfile in this directory extends the `mortarcms/web-base` image and copies your customizations into the appropriate locations.

## Next Steps

1. Build your image: `docker compose build web`
2. Start your services: `docker compose up -d`
3. Access your site at https://lcl.example.com

