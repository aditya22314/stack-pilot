# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-07-18

### Added
- **Framework Scaffold**: Initial NestJS 11 structure with strict TypeScript compiling rules.
- **Dockerized Database**: Configuration of a PostgreSQL 16 database running in a Docker container (`docker-compose.yml`) with local data volume persistence.
- **Validated Config Module**: Integrated `@nestjs/config` and `joi` to parse and validate environment parameters (like `DATABASE_URL`) on server boot.
- **ORM Integration**: Configured Prisma v6 and built `PrismaService` with hook listeners to handle database connection/disconnection lifecycles.
- **Winston Logger**: Replaced default NestJS logger with Winston to support colorized logs in development and structured JSON output for production environments.
- **Swagger Documentation**: Integrated `@nestjs/swagger` and `swagger-ui-express` to auto-generate interactive API docs at `/api`.
- **System Health Checks**: Created `/health` endpoint checking API uptime, environment, and database connectivity.
