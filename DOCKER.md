# Docker Setup for Sahyog Jeevan

This document explains how to use Docker with the Sahyog Jeevan application.

## Prerequisites

- Docker and Docker Compose installed on your system
- Basic understanding of Docker concepts

## Configuration Files

1. **Dockerfile**: Multi-stage build for optimized production images
2. **docker-compose.yml**: Production setup with the application and database
3. **docker-compose.dev.yml**: Development setup with hot reloading

## Environment Variables

Before running the application with Docker, make sure to set up your environment variables. Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=postgresql://sahyog:sahyogpassword@db:5432/sahyog_jeevan?sslmode=prefer
POSTGRES_USER=sahyog
POSTGRES_PASSWORD=sahyogpassword
POSTGRES_DB=sahyog_jeevan
```

## Running in Production

To start the application in production mode:

```bash
docker-compose up -d
```

This will:
1. Build the application using the production target in the Dockerfile
2. Start a PostgreSQL database container
3. Run database migrations
4. Start the application

## Running in Development

For development with hot reloading:

```bash
docker-compose -f docker-compose.dev.yml up
```

This will:
1. Mount your local codebase into the container
2. Enable hot reloading for both client and server
3. Start a PostgreSQL database container

## Accessing the Application

- Production: http://localhost:5000
- Development: http://localhost:5000 (API) and http://localhost:5173 (Client dev server)

## Database Persistence

The database data is stored in Docker volumes:
- Production: `postgres_data`
- Development: `postgres_data_dev`

This ensures your data persists between container restarts.

## Troubleshooting

### Viewing Logs

```bash
# Production logs
docker-compose logs -f

# Development logs
docker-compose -f docker-compose.dev.yml logs -f
```

### Rebuilding Containers

If you make changes to the Dockerfile or need to rebuild:

```bash
# Production
docker-compose up -d --build

# Development
docker-compose -f docker-compose.dev.yml up --build
```

### Database Connection Issues

If the application cannot connect to the database, ensure:
1. The database container is running
2. The `DATABASE_URL` environment variable is correctly set
3. The database name, username, and password match the environment variables
