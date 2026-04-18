# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Udrama is a NestJS v11 backend API for managing dramas (TV series), genres, episodes, and users. It uses PostgreSQL with Drizzle ORM for database access, Zod for schema validation, JWT-based authentication, Redis for caching, and Winston for logging.

## Commands

```bash
npm run build              # Build the project
npm run start              # Start the app
npm run start:dev          # Start in watch mode for development
npm run lint               # Lint and auto-fix
npm run test               # Run unit tests (*.spec.ts in src/)
npm run test:watch         # Run unit tests in watch mode
npm run test:cov           # Run unit tests with coverage
npm run test:e2e           # Run end-to-end tests (in test/)
npm run db:generate        # Generate Drizzle migrations
npm run db:migrate         # Run Drizzle migrations
npm run db:seed            # Run database seeds
```

## Architecture

### Module Structure

- `src/modules/` - Feature modules
  - **auth** - JWT authentication (signin, token management)
  - **user** - User management (CRUD)
  - **dramas** - Drama content management
    - **series** - Series CRUD
    - **genres** - Genre management
- `src/core/` - Shared infrastructure
  - **database** - Drizzle ORM setup, schema definitions, seeding
  - **redis** - Redis connection service
- `src/common/` - Cross-cutting concerns
  - **guards** - `AuthGuard` (JWT) and `RoleGuard` (RBAC), applied globally in `AppModule`
  - **decorators** - `@Public()`, `@Roles()`, `@SkipResponse()`
  - **pipes** - `MyZodValidationPipe` (global Zod validation)
  - **filters** - Zod error formatting
  - **interceptors** - `ResponseInterceptor` (standardized response wrapping), `SnakeCaseInterceptor` (response key transformation)
  - **security** - Argon2 password hashing
  - **enums** - Role definitions

### Database Layer

- Schema files live in `src/core/database/schemas/` with subdirectories per domain (users, dramas, countries)
- `src/core/database/schemas/index.ts` re-exports all tables
- Drizzle Kit config: `drizzle.config.ts`, migrations output to `./drizzle/`
- Database connection via `DatabaseModule` + `DrizzleService`
- Seeds in `src/core/database/seeds/` (roles, country, users)

### Configuration

- NestJS ConfigModule with three config files:
  - `src/config/app.config.ts` - App-level settings
  - `src/config/database.config.ts` - Database connection
  - `src/config/jwt.config.ts` - JWT settings

### Key Patterns

- All routes are protected by default via global `AuthGuard` + `RoleGuard`
- Mark public routes with `@Public()` decorator
- Validation uses Zod schemas wrapped in `MyZodValidationPipe` (global)
- Response keys are auto-converted to snake_case via `SnakeCaseInterceptor`
- DTOs use Zod schemas defined in each module's `dto/` directory
