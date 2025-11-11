# Mortar CMS - Website Base
This is the foundation of any website running on the Mortar CMS platform.

Note: When a new Website is created within Mortar, it will create a new Github repository for that website as a private copy of this repository. We cannot use a fork of this repository because we keep this repository private, but inside of locally setup environments, this one should be added as the "upstream" remote repository to allow for easy application of version updates.

You can do this with:

```
git remote add upstream git@github.com/mortarcms/website-base.git
```

# Web
The /web directory contains the Docker images and custom code foundation for the React + NextJS frontend of the website.

# API
The /api directory contains the Docker images and custom code foundation for the Python + Django API and Celery jobs of the website.
