# Website Base Architecture

This document describes the architecture and structure of the Mortar CMS website base template.

## Overview

The website base is a template for creating new websites on the Mortar CMS platform. It consists of two main components:

1. **Web (Frontend)** - Next.js/React application
2. **API (Backend)** - Django/Python application with Celery for background tasks

## Network Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    bndventures-network                      │
│                     (Docker Network)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐            │
│  │  Nginx   │───▶│ example- │───▶│ example- │            │
│  │  Proxy   │    │   web    │    │   api    │            │
│  │  :443    │    │  :3000   │    │  :8000   │            │
│  └──────────┘    └──────────┘    └──────────┘            │
│       │               │                │                   │
│       │               │                ├──────────────────▶│
│       │               │                │  PostgreSQL      │
│       │               │                │  (shared)        │
│       │               │                │                   │
│       │               │                ├──────────────────▶│
│       │               │                │  Redis           │
│       │               │                │  (shared)        │
│       │               │                │                   │
│       │               │           ┌────▼─────┐            │
│       │               │           │ Celery   │            │
│       │               │           │ Worker   │            │
│       │               │           └──────────┘            │
│       │               │                │                   │
│       │               │           ┌────▼─────┐            │
│       │               │           │ Celery   │            │
│       │               │           │ Beat     │            │
│       │               │           └──────────┘            │
│       │               │                                    │
└───────┼───────────────┼────────────────────────────────────┘
        │               │
        ▼               ▼
   lcl.example.com  (Browser)
```

## Components

### 1. Nginx (Shared)

- Runs in the root docker-compose.yml
- Routes traffic based on `server_name`
- Handles SSL termination
- Routes:
  - `lcl.example.com/` → `example-web:3000`
  - `lcl.example.com/api/` → `example-api:8000`
  - `lcl.example.com/admin/` → `example-api:8000`
  - `lcl.example.com/media/` → `example-api:8000`
  - `lcl.example.com/static/` → `example-api:8000`

### 2. PostgreSQL (Shared)

- Runs in the root docker-compose.yml
- Shared database server for all Mortar CMS services
- Database: `example_db`
- Connection: `postgresql://mortarcms:mortarcms_password@postgres:5432/example_db`

### 3. Redis (Shared)

- Runs in the root docker-compose.yml
- Used for:
  - Celery message broker
  - Django cache backend
  - Session storage
- Connection: `redis://redis:6379/1` (database 1)

### 4. Example Web (Frontend)

**Technology Stack:**
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS

**Container:**
- Name: `example-web`
- Internal Port: 3000
- External Port: 3010
- Base Image: `mortarcms/web-base:1.0.0`

**Environment:**
- `NODE_ENV=development`
- `NEXT_PUBLIC_API_URL=https://lcl.example.com/api`
- `NEXT_PUBLIC_SITE_URL=https://lcl.example.com`

**Volumes:**
- `./web:/app` - Source code
- `/app/node_modules` - Dependencies (cached)
- `/app/.next` - Build artifacts (cached)

### 5. Example API (Backend)

**Technology Stack:**
- Django 4.2+
- Django REST Framework
- Python 3.11
- PostgreSQL driver (psycopg2)
- Gunicorn (production server)

**Container:**
- Name: `example-api`
- Internal Port: 8000
- External Port: 8010
- Base Image: `mortarcms/api-base:1.0.0`

**Environment:**
- `DEBUG=True` (development only)
- `DATABASE_URL=postgresql://...`
- `CELERY_BROKER_URL=redis://...`
- `ALLOWED_HOSTS=lcl.example.com,...`

**Volumes:**
- `./api:/app` - Source code
- `example-media:/app/media` - Uploaded files
- `example-static:/app/staticfiles` - Static assets

**Command:**
```bash
python manage.py migrate &&
python manage.py collectstatic --noinput &&
gunicorn --bind 0.0.0.0:8000 --workers 3 mortarcms_base.wsgi:application
```

### 6. Celery Worker

**Purpose:**
- Process background tasks asynchronously
- Handle long-running operations
- Send emails
- Process media files
- Generate reports

**Container:**
- Name: `example-celery-worker`
- Base Image: `mortarcms/api-base:1.0.0`

**Command:**
```bash
celery -A mortarcms_base worker -l info
```

### 7. Celery Beat

**Purpose:**
- Schedule periodic tasks
- Trigger recurring jobs
- Cleanup operations
- Maintenance tasks

**Container:**
- Name: `example-celery-beat`
- Base Image: `mortarcms/api-base:1.0.0`

**Command:**
```bash
celery -A mortarcms_base beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

## Directory Structure

```
git-website-base/
├── api/
│   ├── Dockerfile              # Extends mortarcms/api-base
│   ├── models/                 # Custom Django models
│   ├── api/                    # Custom API endpoints
│   └── tasks/                  # Custom Celery tasks
├── web/
│   ├── Dockerfile              # Extends mortarcms/web-base
│   ├── pages/                  # Next.js pages
│   ├── components/             # React components
│   ├── public/                 # Static assets
│   └── styles/                 # CSS/Tailwind styles
├── docker-compose.yml          # Service definitions
├── README.md                   # Overview and quick start
├── SETUP.md                    # Detailed setup instructions
└── ARCHITECTURE.md             # This file
```

## Data Flow

### User Request Flow

1. User accesses `https://lcl.example.com`
2. Request hits Nginx on port 443 (HTTPS)
3. Nginx routes to appropriate service:
   - `/` → `example-web` (Next.js)
   - `/api/` → `example-api` (Django)
   - `/admin/` → `example-api` (Django Admin)
4. Service processes request
5. Response returns through Nginx to user

### API Request Flow

1. Frontend makes API call to `/api/endpoint`
2. Nginx routes to `example-api:8000`
3. Django processes request
4. Django queries PostgreSQL if needed
5. Django checks/updates Redis cache if needed
6. JSON response returns to frontend

### Background Task Flow

1. API receives request requiring background processing
2. API enqueues task to Redis (Celery broker)
3. Celery Worker picks up task from queue
4. Worker processes task (may access DB, external APIs, etc.)
5. Worker updates task status in Redis
6. API can check task status via Celery result backend

### Scheduled Task Flow

1. Celery Beat checks DatabaseScheduler for due tasks
2. Beat enqueues tasks to Redis at scheduled times
3. Celery Worker picks up and processes tasks
4. Results stored in database/cache as needed

## Security Considerations

### Development Environment

- Self-signed SSL certificates
- Debug mode enabled
- Permissive CORS settings
- Default credentials (should be changed)

### Production Environment

**Required Changes:**
- `DEBUG=False` in Django
- Strong `SECRET_KEY` for Django
- Valid SSL certificates (Let's Encrypt)
- Restricted `ALLOWED_HOSTS`
- Restricted `CORS_ALLOWED_ORIGINS`
- Environment-specific database credentials
- Secure Redis (password-protected)
- AWS S3 for media storage (not local volumes)
- CDN for static assets
- Rate limiting on API endpoints
- Web Application Firewall (WAF)

## Scaling Considerations

### Horizontal Scaling

**Can be scaled horizontally:**
- `example-web` - Multiple Next.js instances
- `example-api` - Multiple Gunicorn instances
- `example-celery-worker` - Multiple worker instances

**Shared (single instance):**
- `example-celery-beat` - Only one beat scheduler needed
- PostgreSQL - Use managed service (RDS) for HA
- Redis - Use managed service (ElastiCache) for HA

### Load Balancing

For production with multiple instances:

```
               ┌──────────────┐
               │   AWS ALB    │
               │  (Load Bal)  │
               └───────┬──────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   ┌────────┐    ┌────────┐    ┌────────┐
   │  Web1  │    │  Web2  │    │  Web3  │
   └────────┘    └────────┘    └────────┘
        │              │              │
        └──────────────┼──────────────┘
                       ▼
               ┌──────────────┐
               │   API (ALB)  │
               └───────┬──────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   ┌────────┐    ┌────────┐    ┌────────┐
   │  API1  │    │  API2  │    │  API3  │
   └────────┘    └────────┘    └────────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
   ┌────────┐                    ┌────────┐
   │  RDS   │                    │ Redis  │
   │Postgres│                    │ElastiCache
   └────────┘                    └────────┘
```

## Monitoring and Logging

### Recommended Tools

- **Application Monitoring**: Sentry, New Relic, or DataDog
- **Log Aggregation**: CloudWatch, ELK Stack, or Papertrail
- **Uptime Monitoring**: Pingdom, UptimeRobot
- **Performance**: Google Lighthouse, WebPageTest

### Key Metrics to Monitor

- Response times (API and web)
- Error rates
- Database query performance
- Redis memory usage
- Celery queue length
- Worker processing time
- Server resource usage (CPU, memory, disk)

## Backup and Recovery

### Database Backups

- Automated daily backups of PostgreSQL
- Point-in-time recovery capability
- Test restore procedures regularly

### Media Files

- Sync to S3 with versioning enabled
- Cross-region replication for critical files

### Configuration

- Infrastructure as Code (Terraform)
- Version controlled environment configs
- Documented restore procedures

## Development Best Practices

1. **Use feature branches** for development
2. **Write tests** for API endpoints and components
3. **Document API endpoints** with OpenAPI/Swagger
4. **Use type hints** in Python code
5. **Use TypeScript** for frontend code
6. **Code review** before merging to main
7. **Run migrations** in CI/CD pipeline
8. **Test in staging** before production deploy
9. **Monitor logs** after deployment
10. **Have rollback plan** ready

