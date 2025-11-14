# Use the Mortar CMS API base image which includes Django, models, and all core functionality
FROM mortarcms/api-base:1.0.1

# The base image already includes:
# - Django project structure (mortarcms_base)
# - Core models and APIs
# - Celery configuration
# - manage.py and all necessary files
# - Python dependencies

# Optionally add custom models, views, or tasks here by copying them
# For example:
# COPY ./custom_models/ /app/models/
# COPY ./custom_api/ /app/api/
# COPY ./custom_tasks/ /app/tasks/

# The base image already exposes port 8000 and has health checks configured
# Default CMD is already set to run gunicorn
