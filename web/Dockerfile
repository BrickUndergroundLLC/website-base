# Extend the Mortar CMS Web Base Image
# This Dockerfile layers custom templates, blocks, and components on top of the base

FROM mortarcms/web-base:1.0.3 AS base

# Switch to root to copy files
USER root

# Copy custom components into the components/custom directory
# These will be available at /app/components/custom
COPY --chown=nextjs:nodejs ./components /app/components/custom

# Copy custom blocks into the blocks/custom directory
# These will be available at /app/blocks/custom
COPY --chown=nextjs:nodejs ./blocks /app/blocks/custom

# Copy custom templates into the templates/custom directory
# These will be available at /app/templates/custom
COPY --chown=nextjs:nodejs ./templates /app/templates/custom

# Switch back to nextjs user
USER nextjs

# The base image already defines CMD ["node", "server.js"]
# The application will dynamically load custom components, blocks, and templates
# from /app/components/custom, /app/blocks/custom, /app/templates/custom directories at runtime
