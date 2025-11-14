# Setup Guide for Website Base

This guide will help you set up a new website using the Mortar CMS website base.

## Prerequisites

1. Docker and Docker Compose installed
2. The root `docker-compose.yml` services running (postgres, redis, nginx)
3. Local SSL certificates generated (from root directory)
4. `/etc/hosts` entry for `lcl.example.com` pointing to `127.0.0.1`

## Initial Setup

### 1. Configure /etc/hosts

Add this line to your `/etc/hosts` file:

```
127.0.0.1 lcl.example.com
```

### 2. Create Database

The database `example_db` will be created automatically when you first run migrations, but you can create it manually if needed:

```bash
# From the root directory
docker compose exec postgres psql -U mortarcms -c "CREATE DATABASE example_db;"
```

### 3. Environment Variables (Optional)

Create a `.env` file in this directory if you need custom environment variables:

```bash
# AWS S3 Configuration (optional - for media storage)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_STORAGE_BUCKET_NAME=your-bucket
```

### 4. Start Services

```bash
cd git-website-base
docker compose up -d
```

### 5. Run Migrations

```bash
docker compose exec example-api python manage.py migrate
```

### 6. Create Superuser

```bash
docker compose exec example-api python manage.py createsuperuser
```

Follow the prompts to create your admin user.

### 7. Collect Static Files

```bash
docker compose exec example-api python manage.py collectstatic --noinput
```

## Access the Site

- **Website**: https://lcl.example.com
- **API**: https://lcl.example.com/api
- **Django Admin**: https://lcl.example.com/admin

## Development Workflow

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f example-api
docker compose logs -f example-web
```

### Run Django Commands

```bash
docker compose exec example-api python manage.py <command>
```

Common commands:
- `makemigrations` - Create new migrations
- `migrate` - Apply migrations
- `createsuperuser` - Create admin user
- `shell` - Django shell
- `dbshell` - Database shell

### Restart Services

```bash
docker compose restart
```

### Rebuild Services

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

## Customization

### API (Django)

Add your custom Django apps, models, and API endpoints in the `api/` directory:

- `api/models/` - Django models
- `api/api/` - API views and serializers
- `api/tasks/` - Celery tasks

### Web (Next.js)

Add your custom React components and pages in the `web/` directory:

- `web/pages/` - Next.js pages
- `web/components/` - React components
- `web/public/` - Static assets

## Troubleshooting

### Port Already in Use

If ports 3010 or 8010 are already in use, modify the ports in `docker-compose.yml`:

```yaml
ports:
  - "3011:3000"  # Change 3010 to 3011
```

### Database Connection Issues

Ensure the postgres service is running:

```bash
cd ..  # Go to root directory
docker compose up -d postgres
```

### Nginx Not Routing Correctly

Restart the nginx service:

```bash
cd ..  # Go to root directory
docker compose restart nginx
```

Check nginx logs:

```bash
cd ..  # Go to root directory
docker compose logs nginx
```

### Clear Everything and Start Fresh

```bash
# Stop and remove containers
docker compose down -v

# Remove the database (from root directory)
cd ..
docker compose exec postgres psql -U mortarcms -c "DROP DATABASE IF EXISTS example_db;"
docker compose exec postgres psql -U mortarcms -c "CREATE DATABASE example_db;"

# Rebuild and restart
cd git-website-base
docker compose build --no-cache
docker compose up -d

# Run migrations again
docker compose exec example-api python manage.py migrate
```

## Production Deployment

For production deployment, you'll need to:

1. Update environment variables for production
2. Set `DEBUG=False` in the API
3. Configure proper domain names
4. Set up SSL certificates from Let's Encrypt or similar
5. Configure AWS S3 for media storage
6. Set up monitoring and logging
7. Configure backups for the database

See the main Mortar CMS documentation for detailed production deployment instructions.

