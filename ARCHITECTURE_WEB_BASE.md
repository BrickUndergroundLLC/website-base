# Mortar CMS Web Base Architecture

This document describes the layered architecture for Mortar CMS websites, where a base image provides the core Next.js application and individual projects extend it with customizations.

## Overview

The architecture consists of two layers:

1. **`mortarcms/web-base` (Base Layer)** - Complete Next.js application with default templates, blocks, and components
2. **Project Customizations** - Custom templates, blocks, and components that extend or override the base

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Project Container                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │           /app/custom/ (Customizations)           │  │
│  │  - custom/components/                             │  │
│  │  - custom/blocks/                                 │  │
│  │  - custom/templates/                              │  │
│  └───────────────────────────────────────────────────┘  │
│                           ▲                              │
│                           │ Extends                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │       mortarcms/web-base (Base Image)             │  │
│  │  - Complete Next.js app                           │  │
│  │  - Default templates/                             │  │
│  │  - Default blocks/                                │  │
│  │  - Default components/                            │  │
│  │  - Tailwind CSS, TypeScript, etc.                 │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Directory Structure

### Base Image (`web-base/`)

```
web-base/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   ├── articles/[slug]/     # Article pages
│   ├── categories/[slug]/   # Category pages
│   ├── authors/[slug]/      # Author pages (future)
│   └── api/                 # API routes
├── components/              # Default reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   └── Features.tsx
├── blocks/                  # Default CMS blocks
│   ├── CallToAction.tsx
│   └── README.md
├── templates/               # Default page templates
│   ├── BlogPost.tsx
│   └── README.md
├── public/                  # Static assets
├── Dockerfile               # Multi-stage build for production
└── package.json             # Dependencies
```

### Project Customizations (`git-website-base/web/`)

```
git-website-base/web/
├── components/              # Custom components
│   ├── CustomButton.tsx
│   ├── index.ts
│   └── README.md
├── blocks/                  # Custom CMS blocks
│   ├── Testimonial/
│   │   ├── Testimonial.tsx
│   │   └── schema.json
│   ├── index.ts
│   └── README.md
├── templates/               # Custom page templates
│   └── README.md
├── Dockerfile               # Extends web-base
└── README.md
```

## How It Works

### 1. Base Image Build

The `web-base` image contains the complete Next.js application:

```dockerfile
FROM node:20-alpine AS base
# ... build steps ...
RUN npm run build

# Copy built app, templates, blocks, and components
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/templates ./templates
COPY --from=builder /app/blocks ./blocks
COPY --from=builder /app/components ./components
```

Result: `mortarcms/web-base:1.1.0` with a working Next.js app

### 2. Project Customization Layer

Projects extend the base image by adding customizations:

```dockerfile
FROM mortarcms/web-base:latest

# Copy customizations to /app/custom/
COPY --chown=nextjs:nodejs ./components /app/custom/components
COPY --chown=nextjs:nodejs ./blocks /app/custom/blocks
COPY --chown=nextjs:nodejs ./templates /app/custom/templates
```

### 3. Runtime Resolution

At runtime, the application:

1. Checks `/app/custom/` for project-specific implementations
2. Falls back to `/app/` for base implementations
3. Dynamically loads blocks and components as needed

## File Locations

| Type | Base Location | Custom Location |
|------|--------------|----------------|
| Next.js App | `/app/` | N/A (uses base) |
| Components | `/app/components/` | `/app/custom/components/` |
| Blocks | `/app/blocks/` | `/app/custom/blocks/` |
| Templates | `/app/templates/` | `/app/custom/templates/` |
| Static Files | `/app/public/` | N/A (uses base) |

## Building Images

### Building the Base Image

```bash
cd web-base
docker build -t mortarcms/web-base:1.1.0 .
```

Or use the multi-platform build script:

```bash
cd web-base
./build-and-push.sh 1.1.0
```

This builds for both `linux/amd64` and `linux/arm64`.

### Building a Project Image

```bash
cd git-website-base
docker compose build web
```

This automatically extends `mortarcms/web-base:latest`.

## Customization Workflow

### Adding a Custom Component

1. Create `git-website-base/web/components/MyComponent.tsx`
2. Export it from `git-website-base/web/components/index.ts`
3. Rebuild: `docker compose build web`
4. Use it in templates or blocks

### Adding a Custom Block

1. Create folder: `git-website-base/web/blocks/MyBlock/`
2. Add `MyBlock.tsx` with the React component
3. Add `schema.json` with field definitions
4. Export from `git-website-base/web/blocks/index.ts`
5. Rebuild and the block is available in CMS

### Overriding a Template

1. Create folder: `git-website-base/web/templates/Article/`
2. Add `Article.tsx` with custom implementation
3. Rebuild and articles use the new template

## Benefits

### For Base Image Maintainers

- **Single Source of Truth** - Core application in one place
- **Easy Updates** - Update base, all projects get improvements
- **Consistent Foundation** - All sites share the same base
- **Multi-Platform** - Build once, run on AMD64 and ARM64

### For Project Developers

- **Quick Start** - Working site with one `docker compose up`
- **Focused Customization** - Only modify what's unique
- **No Build Configuration** - Base handles Next.js setup
- **Type Safety** - TypeScript throughout
- **Hot Reload Ready** - Can mount source for development

## Development vs Production

### Production (Default)

```yaml
services:
  web:
    build:
      context: ./web
      dockerfile: Dockerfile
    # No volume mounts - uses built standalone app
```

### Development (Optional)

```yaml
services:
  web:
    build:
      context: ./web
      dockerfile: Dockerfile
    volumes:
      - ./web/components:/app/custom/components
      - ./web/blocks:/app/custom/blocks
      - ./web/templates:/app/custom/templates
    # Hot reload for customizations
```

## Deployment

### Docker Hub

Base images are published to Docker Hub:

```
mortarcms/web-base:latest
mortarcms/web-base:1.1.0
```

### GitHub Actions

Automated builds on push:

```yaml
- name: Build and push base image
  uses: docker/build-push-action@v5
  with:
    platforms: linux/amd64,linux/arm64
    push: true
    tags: mortarcms/web-base:${{ version }}
```

### Kubernetes

Deploy with standard Kubernetes manifests:

```yaml
spec:
  containers:
    - name: web
      image: your-registry/your-site:latest
      # Built from mortarcms/web-base + your customizations
```

## Version Management

- **Base Image**: Semantic versioning (1.0.0, 1.1.0, etc.)
- **Latest Tag**: Always points to most recent stable version
- **Lock Version**: Use specific version in production (`mortarcms/web-base:1.1.0`)
- **Upgrade**: Update base version, rebuild, test, deploy

## Migration Guide

### From Monolithic to Layered

If you have an existing monolithic Next.js app:

1. **Move core to web-base**: Copy `app/`, `components/`, `blocks/`, `templates/`
2. **Build new base**: `docker build -t mortarcms/web-base:1.1.0 .`
3. **Create customization layer**: Keep only custom files in project
4. **Update Dockerfile**: Change from full build to extension
5. **Test**: `docker compose build && docker compose up`
6. **Deploy**: Push new images

## Troubleshooting

### Custom files not found

```bash
# Check if files were copied
docker exec container-name ls -la /app/custom/
```

### Base image outdated

```bash
# Pull latest base
docker pull mortarcms/web-base:latest

# Rebuild project
docker compose build --no-cache web
```

### Build failures

```bash
# Build base image locally
cd web-base && docker build -t mortarcms/web-base:latest .

# Use local base in project Dockerfile
FROM mortarcms/web-base:latest
```

## Best Practices

1. **Version Everything** - Use specific base versions in production
2. **Test Locally** - Build base locally before pushing
3. **Document Customizations** - README in each custom directory
4. **Type Safety** - Export TypeScript interfaces for custom blocks
5. **Keep Base Minimal** - Only common functionality in base
6. **Test Upgrades** - Test new base versions before deploying
7. **Use Multi-Stage Builds** - Optimize image size
8. **Cache Dependencies** - Layer Docker builds efficiently

## Future Enhancements

- [ ] Dynamic block registration system
- [ ] Hot reload for development
- [ ] Theme system with CSS variables
- [ ] Plugin architecture for extending functionality
- [ ] Visual editor for block configuration
- [ ] A/B testing for templates
- [ ] Performance monitoring built-in

