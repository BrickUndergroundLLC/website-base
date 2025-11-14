# Extend the Mortar CMS Web Base Image
# This Dockerfile layers custom templates, blocks, and components on top of the base

FROM mortarcms/web-base:1.0.3 AS base

# Switch to root to copy files
USER root

# Copy custom components
# These will be available at /app/custom/components
COPY --chown=nextjs:nodejs ./components /app/custom/components

# Copy custom blocks
# These will be available at /app/custom/blocks
COPY --chown=nextjs:nodejs ./blocks /app/custom/blocks

# Copy custom templates
# These will be available at /app/custom/templates
COPY --chown=nextjs:nodejs ./templates /app/custom/templates

# Switch back to nextjs user
USER nextjs

# The base image already defines CMD ["node", "server.js"]
# The application will dynamically load custom components, blocks, and templates
# from /app/custom/* directories at runtime
