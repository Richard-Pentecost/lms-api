# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LMS API — a Node.js/Express REST API for a livestock management system, backed by PostgreSQL via Sequelize ORM.

## Common Commands

- **Start dev server:** `npm run server` (uses nodemon with dotenv)
- **Start production:** `npm start`
- **Run all tests:** `npm test` (automatically runs migrations against test DB first)
- **Run a single test:** `npx mocha tests/farms/createFarm.test.js --exit --timeout 60000 --file ./tests/test-setup.js`
- **DB migrate:** `npm run db:migrate`
- **DB seed:** `npm run db:seed:all`
- **Generate migration:** `npm run migration:generate -- <migration-name>`

## Architecture

### Entry Point & Routing

`index.js` → `src/app.js` (Express app setup) → `src/routes/*.js` → `src/controllers/<domain>/*.js`

Six route domains: auth (`/login`), farms (`/farms`), users (`/users`), data (`/farms/:farmId/data`), regions (`/regions`), products (`/products`).

### Auth

JWT-based authentication via `src/middlewares/auth.js`. Two middleware levels:
- `auth` — requires valid JWT token in `Authorization` header
- `admin` — requires valid JWT + `isAdmin` claim

### Models & Database

Sequelize models in `src/models/`. Auto-loaded by `src/models/index.js` which scans the directory. Models use the factory pattern: `module.exports = (sequelize, DataTypes) => { ... }`.

Key models and relationships:
- **Farm** belongsTo Region, belongsToMany Product (through FarmProduct), hasMany Data
- **Data** records are linked to farms via `farmFk` (UUID foreign key)
- Models use UUID as public identifier; integer `id` is excluded from default scope

### Database Configuration

- Config: `src/config/config.js`, paths configured in `.sequelizerc`
- Dev DB defaults to port 5432 (`lms-dev-db`), test DB to port 5433 (`lms-test-db`)
- Docker: `docker-compose up -d` to start PostgreSQL instances
- Env files: `.env` for dev, `.env.test` for test (loaded by `tests/test-setup.js`)

### Controllers

One function per file in `src/controllers/<domain>/`. Each exports an Express route handler. Naming convention matches the operation (e.g., `createFarm.js`, `getFarmByUuid.js`, `deleteFarmByUuid.js`).

### Tests

Mocha + Chai + Supertest + Sinon. Tests mirror controller structure in `tests/<domain>/`. Test helpers in `tests/helpers/` (e.g., `data-factory.js`). Tests run against a real test database (not mocked).
