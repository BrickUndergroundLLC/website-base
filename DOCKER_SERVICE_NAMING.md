# Docker Service Naming Convention

## Overview
This docker-compose configuration uses the `example-` prefix for all service names to avoid conflicts with other projects running on the same Docker network.

## Service Names

### Before (Conflicting)
- `web` → conflicted with other projects
- `api` → **MAJOR CONFLICT** - caused DNS load balancing issues
- `celery-worker` → potential conflicts
- `celery-beat` → potential conflicts

### After (Namespaced)
- `example-web` ✅
- `example-api` ✅
- `example-celery-worker` ✅
- `example-celery-beat` ✅

## Why This Matters

When multiple docker-compose projects share the same network (e.g., `mortarcms` network), Docker's internal DNS will load-balance between services with the same name. 

**Problem Example:**
- Main project has service named `api` (mortarcms-api)
- Example project had service named `api` (example-api)
- Nginx trying to connect to `api:8000` would randomly get either container
- Result: 50% of requests succeeded, 50% failed with wrong settings

## Container Names vs Service Names

- **Container Name**: `example-web`, `example-api`, etc. (set via `container_name`)
- **Service Name**: `example-web`, `example-api`, etc. (the key in `services:`)
- **DNS Name**: Uses the **service name** (e.g., `example-api:8000`)

## Nginx Configuration

The nginx configuration already uses the correct upstream names:

```nginx
upstream example_web_upstream {
    server example-web:3000;
}

upstream example_api_upstream {
    server example-api:8000;
}
```

These match the service names defined in this docker-compose.yml.

## Usage

Start the example website:
```bash
cd git-website-base
docker compose up -d
```

The services will be available at:
- Frontend: https://lcl.example.com
- Admin: https://lcl.example.com/admin
- API: https://lcl.example.com/api

## Best Practices

When creating new website instances based on this template:
1. Replace `example-` with your project's prefix (e.g., `mysite-`)
2. Update the `container_name` values accordingly
3. Update `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `SITE_URL` environment variables
4. Update nginx configuration to add new upstream and server blocks

