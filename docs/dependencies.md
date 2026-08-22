# PennyPilot — Docker-Only Development Setup

This document describes how to configure PennyPilot so that **Docker Desktop is the only
software required on the host machine**. No local JDK, Maven, Node.js, npm, PostgreSQL,
or Flyway installation is needed — everything runs inside containers, orchestrated by
Docker Compose.

---

## 1. Architecture

```
Windows Machine
      │
Docker Desktop
      │
Docker Compose
      ├── Frontend Container
      │     ├── Node.js
      │     ├── npm
      │     └── Vite
      │
      ├── Backend Container
      │     ├── JDK
      │     ├── Maven
      │     └── Spring Boot
      │
      └── PostgreSQL Container
            └── Persistent Volume
```

### Startup flow

```
Docker Compose
      ↓
PostgreSQL
      ↓
Health Check
      ↓
Backend
      ↓
Flyway Migration
      ↓
Spring Boot
      ↓
Frontend
      ↓
Browser
```

---

## 2. Final Folder Structure

```
PennyPilot/
├── docker-compose.yml
├── .env
├── .env.example
├── .gitignore
│
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── pom.xml
│   └── src/
│       └── main/
│           └── resources/
│               └── application.yml
│
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── .env (optional, for Vite dev vars)
│
└── database/
    └── migrations/
        └── V1__initial_schema.sql
```

> Flyway is configured to read migrations from `database/migrations`, which is mounted
> (or copied) into the backend container — no local Flyway CLI is ever needed.

---

## 3. `docker-compose.yml`

```yaml
name: pennypilot

services:
  postgres:
    image: postgres:16-alpine
    container_name: pennypilot-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - pennypilot-postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 10
      start_period: 10s
    networks:
      - pennypilot-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: pennypilot-backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/${POSTGRES_DB}
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD}
      SERVER_PORT: ${SERVER_PORT}
      CORS_ALLOWED_ORIGINS: ${CORS_ALLOWED_ORIGINS}
      SPRING_FLYWAY_LOCATIONS: filesystem:/flyway/migrations
    ports:
      - "${SERVER_PORT}:${SERVER_PORT}"
    volumes:
      - ./database/migrations:/flyway/migrations:ro
    networks:
      - pennypilot-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: pennypilot-frontend
    restart: unless-stopped
    depends_on:
      - backend
    environment:
      VITE_API_BASE_URL: http://localhost:${SERVER_PORT}/api/v1
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - pennypilot-frontend-node-modules:/app/node_modules
    networks:
      - pennypilot-network

networks:
  pennypilot-network:
    driver: bridge

volumes:
  pennypilot-postgres-data:
  pennypilot-frontend-node-modules:
```

**Notes**

- `postgres` uses a named volume (`pennypilot-postgres-data`) so data survives
  `docker compose down` (but not `docker compose down -v`).
- `backend` uses `depends_on: condition: service_healthy` so it only starts once
  PostgreSQL's healthcheck passes.
- Backend talks to Postgres via the Compose service name `postgres`, never `localhost`.
- Frontend talks to the backend via the **browser**, using `http://localhost:8080/api/v1`
  — not the internal Docker network — because the browser runs on the host, not inside
  the Docker network.
- The frontend container mounts the local `./frontend` folder as a volume, enabling hot
  reload; `node_modules` is kept in a separate anonymous/named volume so the host's
  (nonexistent) `node_modules` never overwrites the container's installed packages.

---

## 4. Environment Variables

### `.env.example` (committed to Git — no real secrets)

```env
# PostgreSQL
POSTGRES_DB=pennypilot
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_database_password

# Backend
SERVER_PORT=8080

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### `.env` (real values — NOT committed)

Copy `.env.example` to `.env` and fill in real values:

```bash
cp .env.example .env
```

```env
POSTGRES_DB=pennypilot
POSTGRES_USER=postgres
POSTGRES_PASSWORD=change_me_locally

SERVER_PORT=8080

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

---

## 5. `.gitignore`

```gitignore
# Environment
.env

# Backend
backend/target/
backend/.mvn/
backend/*.class

# Frontend
frontend/node_modules/
frontend/dist/

# IDE
.idea/
.vscode/
*.iml

# OS
.DS_Store
Thumbs.db

# Docker
docker-compose.override.yml
```

---

## 6. Backend

### `backend/Dockerfile` (multi-stage: Maven build → slim JRE runtime)

```dockerfile
# ---------- Stage 1: Build ----------
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Cache dependencies separately from source for faster rebuilds
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

# ---------- Stage 2: Runtime ----------
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Flyway migrations are mounted at runtime (see docker-compose.yml volume)
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

> The container includes the full JDK **only in the build stage**; the final runtime
> image ships a lean JRE. No JDK or Maven is ever required on the host.

### `backend/.dockerignore`

```
target/
.mvn/
*.class
.idea/
.vscode/
*.iml
.git/
```

### `backend/src/main/resources/application.yml`

```yaml
server:
  port: ${SERVER_PORT:8080}

spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:postgresql://postgres:5432/pennypilot}
    username: ${SPRING_DATASOURCE_USERNAME:postgres}
    password: ${SPRING_DATASOURCE_PASSWORD:postgres}
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: validate   # Flyway owns the schema, not Hibernate
    show-sql: false

  flyway:
    enabled: true
    locations: ${SPRING_FLYWAY_LOCATIONS:classpath:db/migration}
    baseline-on-migrate: true

cors:
  allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:5173}
```

Make sure `pom.xml` includes the Postgres driver and Flyway dependencies:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-database-postgresql</artifactId>
</dependency>
```

Flyway runs automatically on Spring Boot startup — no manual `flyway migrate` command
and no local Flyway CLI needed.

---

## 7. Frontend

### `frontend/Dockerfile` (dev image with hot reload)

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# --host is required so Vite's dev server is reachable from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
```

> For a production build you would add a second stage (`npm run build` + serve via
> nginx), but per the "no unnecessary production infra" requirement, this setup targets
> local development with hot reload as specified.

### `frontend/.dockerignore`

```
node_modules/
dist/
.git/
.env
```

### Frontend → Backend API base URL

In frontend code (e.g. `src/api/client.ts`), read the API base URL from the Vite env
variable injected via Compose:

```ts
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";
```

This resolves to `http://localhost:8080/api/v1`, matching the requirement — the browser
reaches the backend via the host's published port, not the internal Docker network.

---

## 8. Database Migrations

### `database/migrations/V1__initial_schema.sql`

```sql
CREATE TABLE IF NOT EXISTS users (
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount      NUMERIC(12, 2) NOT NULL,
    category    VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
```

This file is mounted read-only into the backend container at `/flyway/migrations` and
picked up automatically by Flyway on Spring Boot startup.

---

## 9. Networking Summary

| Communication path              | Address                              |
|----------------------------------|---------------------------------------|
| Backend → PostgreSQL (container) | `postgres:5432` (Docker network name) |
| Browser → Backend                | `http://localhost:8080`               |
| Browser → Frontend               | `http://localhost:5173`               |
| Frontend code → Backend API      | `http://localhost:8080/api/v1`        |

Backend and PostgreSQL communicate over the internal `pennypilot-network` bridge network
using the Compose service name `postgres` — `localhost` is never used for that link.
The browser, running on the host, reaches both frontend and backend through their
published ports.

---

## 10. Commands

```bash
# First run / after Dockerfile or dependency changes
docker compose up --build

# Subsequent runs
docker compose up

# Stop containers (keep volumes/data)
docker compose down

# View running containers
docker compose ps

# View logs
docker compose logs
docker compose logs -f
docker compose logs backend
docker compose logs frontend
docker compose logs postgres

# Stop and wipe volumes (resets the database)
docker compose down -v
```

---

## 11. Onboarding a New Machine

1. Install **Docker Desktop** (the only prerequisite).
2. Clone the repository.
3. `cp .env.example .env` and fill in local secret values.
4. Run:
   ```bash
   docker compose up --build
   ```
5. Access the app:
   - Frontend → http://localhost:5173
   - Backend → http://localhost:8080
   - Database → PostgreSQL, running only inside Docker (not exposed as a local install)

No JDK, Maven, Node.js, npm, PostgreSQL, or Flyway installation is required at any point.
