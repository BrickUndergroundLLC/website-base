# Mortar CMS - Website Base
This is the foundation of any website running on the Mortar CMS platform.

Note: When a new Website is created within Mortar, it will create a new Github repository for that website as a private copy of this repository. We cannot use a fork of this repository because we keep this repository private, but inside of locally setup environments, this one should be added as the "upstream" remote repository to allow for easy application of version updates.

You can do this manually with:

```bash
git remote add upstream git@github.com/mortarcms/website-base.git
git fetch upstream
```

and then, anytime you want to or need to update the foundation of your website-specific repository, you can do so with:

```bash
git fetch upstream main
git rebase upstream/main
```

And after you resolve any conflicts (we try to keep the commits to this repo low-conflict inducing) you can commit the changes to your own website-specific repository and push them up as well.

## Quick Start

1. **Start the shared services** (from the root directory):
   ```bash
   cd ..
   docker compose up -d postgres redis nginx
   ```

2. **Start this website** (from this directory):
   ```bash
   docker compose up -d
   ```

3. **Access the site**:
   - Website: https://lcl.example.com
   - API: https://lcl.example.com/api
   - Django Admin: https://lcl.example.com/admin

4. **Create a superuser** (first time setup):
   ```bash
   docker compose exec example-api python manage.py createsuperuser
   ```

## Architecture

This website extends the `mortarcms/web-base` Docker image with custom components, blocks, and templates.

### Web
The `/web` directory contains **only customizations** for the website. The base Next.js application comes from `mortarcms/web-base`.

- **Port**: 3010 (internal: 3000)
- **URL**: https://lcl.example.com
- **Base Image**: `mortarcms/web-base:1.0.3`
- **Customizations**: 
  - `web/components/` - Custom React components (mounted to `/app/components/custom`)
  - `web/blocks/` - Custom CMS content blocks (mounted to `/app/blocks/custom`)
  - `web/templates/` - Custom page templates (mounted to `/app/templates/custom`)

The base image provides default templates, components, and blocks in `/app/templates/base`, `/app/components/base`, and `/app/blocks/base`. Your custom additions are automatically discovered and merged with the base items via the API endpoints at `/mortarcms-api/templates`, `/mortarcms-api/components`, and `/mortarcms-api/blocks`.

### API
The `/api` directory extends the `mortarcms/api-base` Docker image with custom models, views, and tasks.

- **Port**: 8010 (internal: 8000)
- **URL**: https://lcl.example.com/api
- **Admin**: https://lcl.example.com/admin
- **Base Image**: `mortarcms/api-base:1.0.1`
- **Database**: Uses shared PostgreSQL (database: `example_db`)
- **Cache**: Uses shared Redis (database: 1)

### Services

- **example-web**: Next.js frontend
- **example-api**: Django API and admin
- **example-celery-worker**: Background task processor
- **example-celery-beat**: Scheduled task scheduler

All services connect to the shared `bndventures-network` created by the root docker-compose.yml.

**Note**: All service names are prefixed with `example-` to avoid conflicts with other projects on the same Docker network. When creating a new website instance, replace `example-` with your project name (e.g., `mysite-web`, `mysite-api`). See [DOCKER_SERVICE_NAMING.md](DOCKER_SERVICE_NAMING.md) for details.

## Development

### Environment Variables

Create a `.env` file in this directory for any custom environment variables:

```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_STORAGE_BUCKET_NAME=your-bucket
```

### Database Migrations

```bash
docker compose exec example-api python manage.py makemigrations
docker compose exec example-api python manage.py migrate
```

### Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f example-api
```

### Rebuild

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

## Customizing Your Website

### Adding Custom Components

1. Create your component in `web/components/`:
   ```typescript
   // web/components/MyButton.tsx
   export const MyButton = ({ label }: { label: string }) => {
     return <button className="...">{label}</button>
   }
   ```

2. Export it from `web/components/index.ts`:
   ```typescript
   export { MyButton } from './MyButton'
   ```

3. Rebuild and use it in your templates or blocks

### Adding Custom Blocks

1. Create a folder: `web/blocks/MyBlock/`
2. Add the component: `web/blocks/MyBlock/MyBlock.tsx`
3. Add the schema: `web/blocks/MyBlock/schema.json`
4. Export from `web/blocks/index.ts`
5. Rebuild - the block is now available in the CMS editor

See `web/blocks/README.md` for detailed instructions.

### Adding Custom Templates

1. Create a folder: `web/templates/CustomArticle/`
2. Add your template: `web/templates/CustomArticle/CustomArticle.tsx`
3. Rebuild and assign the template in the CMS

See `web/templates/README.md` for detailed instructions.

## Base Images

This project uses two base images:

- **`mortarcms/web-base:1.1.0`** - Complete Next.js application
- **`mortarcms/api-base:1.0.1`** - Complete Django application

Your customizations layer on top of these bases. See [ARCHITECTURE_WEB_BASE.md](../ARCHITECTURE_WEB_BASE.md) for details.
