# Mortar CMS Base Images

This document describes the baseline Docker images for websites hosted by Mortar CMS. These images provide extensible foundations that users can customize for their specific needs.

## Overview

- **api-base**: Django-based API foundation with Celery support
- **web-base**: Next.js-based frontend foundation with modern design

## Images

### API Base (`mortarcms/api-base`)

**Location**: `/api-base/`

A complete Django application with:
- Django 4.2 + REST Framework
- Celery for background tasks
- Celery Beat for scheduled tasks
- PostgreSQL support
- Redis integration
- Extensible architecture

**Extensibility**:
- `/api/` - Custom API endpoints
- `/models/` - Custom Django models  
- `/tasks/` - Custom Celery tasks
- `custom_settings.py` - Settings overrides

### Web Base (`mortarcms/web-base`)

**Location**: `/web-base/`

A modern Next.js application with:
- Next.js 14 with App Router
- TypeScript support
- Tailwind CSS styling
- Responsive design
- SEO optimization
- Built-in pages (home, privacy, terms)

**Extensibility**:
- `/blocks/` - Custom reusable components
- `/templates/` - Custom page templates
- Standard Next.js app structure

## Build Process

### Automated Building

Images are automatically built via GitHub Actions when changes are detected:

**Workflow**: `.github/workflows/build-base-images.yml`

**Triggers**:
- Changes to `api-base/**` → builds `mortarcms/api-base`
- Changes to `web-base/**` → builds `mortarcms/web-base`

**Versioning**:
- Semantic versioning (MAJOR.MINOR.PATCH)
- Git tags: `api-base-1.0.0`, `web-base-1.0.0`
- Docker tags: version + `latest`

### Manual Building

```bash
# API Base
cd api-base
docker build -t mortarcms/api-base:latest .

# Web Base  
cd web-base
docker build -t mortarcms/web-base:latest .
```

## Usage Examples

### Extending API Base

```dockerfile
FROM mortarcms/api-base:latest

# Add custom code
COPY ./api /app/api/
COPY ./models /app/models/
COPY ./tasks /app/tasks/

# Custom settings
COPY ./custom_settings.py /app/mortarcms_base/

# Additional dependencies
COPY requirements-custom.txt /app/
RUN pip install -r requirements-custom.txt

# Apply migrations
RUN python manage.py makemigrations
RUN python manage.py migrate
```

### Extending Web Base

```dockerfile
FROM mortarcms/web-base:latest

# Add custom content
COPY ./blocks /app/blocks/
COPY ./templates /app/templates/
COPY ./public /app/public/

# Custom pages
COPY ./app /app/app/

# Additional dependencies
COPY package-custom.json /app/
RUN npm install
```

## Docker Compose Example

```yaml
version: '3.8'
services:
  # Frontend
  web:
    image: mortarcms/web-base:latest
    ports:
      - "3000:3000"
    environment:
      - API_URL=http://api:8000/api
    depends_on:
      - api

  # Backend API
  api:
    image: mortarcms/api-base:latest
    ports:
      - "8000:8000"
    environment:
      - SECRET_KEY=your-secret-key
      - DB_HOST=postgres
      - DB_NAME=mortarcms
      - CELERY_BROKER_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - redis

  # Background Workers
  celery-worker:
    image: mortarcms/api-base:latest
    command: celery -A mortarcms_base worker -l info
    environment:
      - SECRET_KEY=your-secret-key
      - DB_HOST=postgres
      - CELERY_BROKER_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - redis

  celery-beat:
    image: mortarcms/api-base:latest
    command: celery -A mortarcms_base beat -l info
    environment:
      - SECRET_KEY=your-secret-key
      - DB_HOST=postgres
      - CELERY_BROKER_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - redis

  # Database
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=mortarcms
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Cache/Message Broker
  redis:
    image: redis:7-alpine

volumes:
  postgres_data:
```

## Development Workflow

1. **Make changes** to `api-base/` or `web-base/`
2. **Commit and push** to main branch
3. **GitHub Actions** automatically:
   - Detects changes
   - Calculates new version
   - Builds Docker image
   - Pushes to Docker Hub
   - Creates Git tag

## Registry Information

**Docker Hub Registry**: `docker.io`
- `mortarcms/api-base:latest`
- `mortarcms/api-base:1.0.0`
- `mortarcms/web-base:latest` 
- `mortarcms/web-base:1.0.0`

## Required Secrets

For GitHub Actions to work, set these repository secrets:

- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password/token

## Monitoring

Both images include health checks:

**API Base**: `GET /api/health/`
**Web Base**: `GET /` (homepage)

## Security

- Non-root users in containers
- Minimal attack surface
- Security headers configured
- Environment-based configuration
- No hardcoded secrets

## Support

For issues or questions:
1. Check the README files in each base directory
2. Review the example configurations
3. Test locally before deployment
4. Monitor build logs in GitHub Actions

## Future Enhancements

Planned improvements:
- Multi-architecture builds (ARM64)
- Additional base variants
- Enhanced monitoring
- Performance optimizations
- Security scanning integration
