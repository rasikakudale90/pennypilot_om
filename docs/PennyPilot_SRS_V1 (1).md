# PennyPilot — Software Requirements Specification

## Version 1 (V1) — Core Expense Tracker

| | |
|---|---|
| **Document Type** | Software Requirements Specification (SRS) |
| **Product** | PennyPilot — Personal Finance Management Platform |
| **Document Version** | 1.0 |
| **Covers Product Version** | V1 — Core Expense Tracker only |
| **Status** | Draft for Development |
| **Date** | 22 August 2026 |
| **Source Documents** | PRODUCT_ROADMAP.md, techstack.md, databaseschema.md, apischema.md, folderstructure.md, agents.md, dependencies.md |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features (Functional Requirements)](#3-system-features-functional-requirements)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Data Requirements](#6-data-requirements)
7. [Additional Requirements to Achieve a Stable, Production-Ready V1](#7-additional-requirements-to-achieve-a-stable-production-ready-v1)
8. [Development Constraints (Agent & Contributor Rules)](#8-development-constraints-agent--contributor-rules)
9. [Acceptance Criteria — Definition of "V1 Released"](#9-acceptance-criteria--definition-of-v1-released)
10. [Traceability & Appendix](#10-traceability--appendix)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the functional and non-functional requirements for PennyPilot Version 1 (V1) — the Core Expense Tracker. It translates the product intent captured in the PRODUCT_ROADMAP.md, together with the accompanying techstack.md, databaseschema.md, apischema.md, folderstructure.md, agents.md, and dependencies.md documents, into a single, unambiguous requirements baseline that the engineering team (human or AI agent) can build, test and deploy against.

This document is scoped to V1 only. Later versions (V2–V14) described in the roadmap — search/filter/pagination, analytics and budgeting, income/accounts, authentication, mobile, AI features, and so on — are explicitly out of scope and will each receive their own SRS when work on them begins.

### 1.2 Scope

PennyPilot V1 is a single-user, web-based expense tracking application. It allows a user to record, view, update, delete, filter and summarize personal expenses through a responsive web interface backed by a REST API and a PostgreSQL database. The roadmap states the outcome plainly:

> "A real user should be able to open the deployed application and manage expenses."

V1 deliberately excludes authentication, multi-user support, income tracking, accounts/payment methods, budgets, analytics, recurring transactions, file attachments, notifications, and any AI/ML capability. These are reserved for versions V2 through V14 as defined in the Product Roadmap.

### 1.3 Definitions, Acronyms and Abbreviations

| Term | Definition |
|---|---|
| SRS | Software Requirements Specification |
| PRD | Product Requirements Document (here: PRODUCT_ROADMAP.md) |
| CRUD | Create, Read, Update, Delete |
| DTO | Data Transfer Object |
| API | Application Programming Interface |
| REST | Representational State Transfer |
| JPA | Java Persistence API |
| CI/CD | Continuous Integration / Continuous Deployment |
| CORS | Cross-Origin Resource Sharing |
| OWASP | Open Web Application Security Project |
| RBAC | Role-Based Access Control (introduced V5, not in V1) |

### 1.4 References

- PRODUCT_ROADMAP.md — PennyPilot Product Roadmap, Version 1.0 (Sections 5 and 19–25 govern V1 scope and cross-version standards)
- techstack.md — PennyPilot Tech Stack (Version 1)
- databaseschema.md — PennyPilot V1 Database Schema
- apischema.md — PennyPilot V1 API Schema
- folderstructure.md — PennyPilot Folder Structure (including "Pending Project Requirements")
- agents.md — Rules for AI/engineering agents working on the repository
- dependencies.md — PennyPilot Dependencies: Docker-only local development setup requirements

### 1.5 Document Overview

Section 2 gives an overall description of the product and its context. Section 3 defines detailed functional requirements (system features). Section 4 defines external interface requirements (API, database, UI). Section 5 defines non-functional requirements. Section 6 covers data requirements. Section 7 lists additional requirements needed to reach a stable, production-ready V1 that are implied by the roadmap but not fully specified in the source documents. Section 8 defines constraints and development rules. Section 9 defines acceptance / release criteria, and Section 10 contains traceability and appendices.

---

## 2. Overall Description

### 2.1 Product Perspective

PennyPilot V1 is a new, standalone product — the first release in a fourteen-version roadmap. It is not a component of an existing system. V1 establishes the architectural foundation (backend, frontend, database, CI/CD, deployment) that every subsequent version will extend without breaking. Per the roadmap's Version Release Principle, V1 must ship as a complete, deployed, usable product, not merely as code.

```text
        ┌────────────┐        HTTPS/REST        ┌──────────────────┐
        │  Browser   │  ───────────────────────▶ │  Spring Boot API │
        │ (React SPA)│  ◀─────────────────────── │   /api/v1/...    │
        └────────────┘         JSON               └────────┬─────────┘
                                                             │ JDBC
                                                    ┌────────▼─────────┐
                                                    │   PostgreSQL 16   │
                                                    │  expenses table   │
                                                    └───────────────────┘
```

### 2.2 Product Functions (Summary)

- Create, read, update and delete individual expense records
- List all expenses
- Filter expenses by category, by a single date, or by a date range
- View a total-amount / expense-count summary, optionally filtered
- Present the above through a responsive web dashboard: expense list, add/edit forms, delete confirmation, and summary cards

### 2.3 User Classes and Characteristics

| User Class | Description | V1 Access |
|---|---|---|
| End User | A single individual tracking personal expenses through the web app | Full CRUD on their own expenses (no login concept exists yet in V1) |
| Developer / Agent | Engineer or AI coding agent implementing/maintaining the system | Source code, CI/CD, deployment configuration |

V1 has no authentication or user accounts (introduced in V5). The application is effectively single-tenant: every expense in the database is visible to anyone who can reach the deployed frontend. This is an accepted, deliberate limitation of V1 and must be communicated to real users of the deployed app (see Section 5.2, Security).

### 2.4 Operating Environment

| Layer | Environment |
|---|---|
| Backend runtime | Java 21 (LTS), Spring Boot 3.3.x, packaged as a Docker container |
| Frontend runtime | Modern evergreen browsers (Chrome, Edge, Firefox, Safari — latest two major versions); React 18.3 SPA built with Vite |
| Database | PostgreSQL 16.x, managed instance (Render / Neon / AWS RDS) in production |
| Hosting (V1) | Backend: Render / Railway / AWS EC2. Frontend: Vercel / Netlify. Both wired to CI/CD |
| Local development | Docker Compose running frontend + backend + PostgreSQL together (Docker-only — see Section 7.7) |

### 2.5 Design and Implementation Constraints

- Technology choices are fixed by techstack.md: Java 21 / Spring Boot 3.3.x / Spring Data JPA / Hibernate on the backend; React 18.3 / TypeScript 5.5 / Vite 5 / Tailwind CSS on the frontend; PostgreSQL 16 with Flyway migrations.
- Repository layout must follow folderstructure.md exactly; agents.md rule 2 ("Follow repository structure") and rule 1 ("Do not change approved architecture") are binding.
- API paths, methods, request/response payloads and status codes must follow apischema.md (agents.md rule 6: "Follow API specification").
- Database schema must follow databaseschema.md, delivered as the Flyway migration V1__initial_schema.sql; no additional tables (users, budgets, income, etc.) may be introduced in V1 (agents.md rule 1; databaseschema.md §14).
- No technology may be introduced without a product or engineering reason (Roadmap Principle 4); Redis, message queues, file storage, AI/LLM integrations, mobile app and vector DB are explicitly out of scope until later versions (techstack.md §6).

### 2.6 Assumptions and Dependencies

- A managed PostgreSQL instance and hosting accounts (backend + frontend) are available before deployment.
- GitHub is used for version control with a protected main/release branch and GitHub Actions for CI (agents.md rules 11–12; Roadmap §19).
- The product is used by a single user per deployed instance; concurrent-write conflict resolution beyond standard database transaction handling is not required in V1.
- Currency is assumed to be a single, implicit currency (e.g. INR, as shown in sample data) — multi-currency is not a V1 requirement and is not mentioned anywhere in the source documents.

---

## 3. System Features (Functional Requirements)

Each feature below is written as testable requirements using "shall" statements, with a stable ID for traceability (see Section 10.1).

### 3.1 FR-1 — Create Expense

**Description:** The system shall allow a user to create a new expense record.

1. **FR-1.1** — The system shall provide `POST /api/v1/expenses` accepting title, amount, category, expenseDate and an optional description, per apischema.md §3.1.
2. **FR-1.2** — The system shall validate all fields per the rules in Section 4.1.4 before persisting the record.
3. **FR-1.3** — On success the system shall persist the expense, auto-generate id, createdAt and updatedAt, and return HTTP 201 Created with the full expense representation.
4. **FR-1.4** — On validation failure the system shall return HTTP 400 Bad Request with a structured error body (Section 4.1.6) and shall not persist any record.
5. **FR-1.5** — The frontend shall provide an "Add Expense" form (React Hook Form + Zod) that calls FR-1.1 and shows inline field errors returned by the API.

### 3.2 FR-2 — View Expenses

**Description:** The system shall allow a user to view expenses, either as a full list or individually by ID.

1. **FR-2.1** — `GET /api/v1/expenses` shall return all expenses as a JSON array, HTTP 200.
2. **FR-2.2** — `GET /api/v1/expenses/{id}` shall return a single expense, HTTP 200 if found.
3. **FR-2.3** — `GET /api/v1/expenses/{id}` shall return HTTP 404 Not Found with a structured error body if no expense with that id exists.
4. **FR-2.4** — The frontend Expense List page shall render all expenses returned by FR-2.1 in a table/card view and shall show an empty state when no expenses exist.

### 3.3 FR-3 — Update Expense

1. **FR-3.1** — `PUT /api/v1/expenses/{id}` shall replace title, amount, category, expenseDate and description of an existing expense.
2. **FR-3.2** — The system shall re-validate all fields (Section 4.1.4) on update and return HTTP 400 on failure without modifying the stored record.
3. **FR-3.3** — The system shall return HTTP 404 if the target id does not exist.
4. **FR-3.4** — On success the system shall update updatedAt to the current server timestamp and return HTTP 200 with the updated representation; createdAt shall remain unchanged.
5. **FR-3.5** — The frontend Edit Expense page shall pre-populate the form with the existing expense and submit changes via FR-3.1.

### 3.4 FR-4 — Delete Expense

1. **FR-4.1** — `DELETE /api/v1/expenses/{id}` shall permanently remove the expense and return HTTP 204 No Content.
2. **FR-4.2** — The system shall return HTTP 404 if the target id does not exist.
3. **FR-4.3** — The frontend shall require an explicit confirmation (modal) before calling FR-4.1, to prevent accidental deletion.

### 3.5 FR-5 — Filter Expenses

1. **FR-5.1** — `GET /api/v1/expenses` shall accept an optional category query parameter and return only expenses matching that category.
2. **FR-5.2** — `GET /api/v1/expenses` shall accept an optional date query parameter and return only expenses on that exact date.
3. **FR-5.3** — `GET /api/v1/expenses` shall accept optional startDate and endDate query parameters and return expenses whose expenseDate falls within the inclusive range.
4. **FR-5.4** — Category and date/date-range filters shall be combinable in a single request (apischema.md §8.4).
5. **FR-5.5** — The frontend shall provide filter controls (category dropdown, date pickers) that drive FR-5.1–FR-5.4 without a full page reload.

### 3.6 FR-6 — Expense Summary

1. **FR-6.1** — `GET /api/v1/expenses/summary` shall return totalAmount (sum of amount) and expenseCount (record count), HTTP 200.
2. **FR-6.2** — `GET /api/v1/expenses/summary` shall accept the same category / date / date-range parameters as FR-5 and compute the summary over the filtered subset.
3. **FR-6.3** — When there are no matching expenses, totalAmount shall be 0 and expenseCount shall be 0 (not null and not an error).
4. **FR-6.4** — The frontend Dashboard shall display summary cards (total spent, number of expenses) sourced from FR-6.1.

### 3.7 FR-7 — Expense Categories

1. **FR-7.1** — The system shall support exactly seven categories: FOOD, TRANSPORT, SHOPPING, BILLS, HEALTH, ENTERTAINMENT, OTHER, represented as an ExpenseCategory enum on the backend.
2. **FR-7.2** — The system shall reject any create/update request whose category value is not one of the seven defined values, returning HTTP 400.
3. **FR-7.3** — The frontend shall present categories as a fixed dropdown/select, sourced from a shared constant (expenseConstants.ts), not free text.

---

## 4. External Interface Requirements

### 4.1 API Interface

The V1 API is a REST API rooted at `/api/v1`, fully specified in apischema.md. This SRS restates it as binding interface requirements; apischema.md remains the authoritative payload reference.

#### 4.1.1 Endpoint Summary

| Method | Endpoint | Purpose | Success |
|---|---|---|---|
| POST | `/api/v1/expenses` | Create expense | 201 |
| GET | `/api/v1/expenses` | List / filter expenses | 200 |
| GET | `/api/v1/expenses/{id}` | Get expense by id | 200 |
| PUT | `/api/v1/expenses/{id}` | Update expense | 200 |
| DELETE | `/api/v1/expenses/{id}` | Delete expense | 204 |
| GET | `/api/v1/expenses/summary` | Get (optionally filtered) summary | 200 |

#### 4.1.2 Query Parameters

| Parameter | Applies to | Type | Notes |
|---|---|---|---|
| category | GET list, GET summary | string (enum) | One of the seven ExpenseCategory values |
| date | GET list, GET summary | date (yyyy-MM-dd) | Exact-date match |
| startDate / endDate | GET list, GET summary | date (yyyy-MM-dd) | Inclusive range; used together |

#### 4.1.3 Expense Representation (JSON)

```json
{
  "id": 1,
  "title": "Lunch",
  "amount": 250.00,
  "category": "FOOD",
  "expenseDate": "2026-08-22",
  "description": "Lunch at restaurant",
  "createdAt": "2026-08-22T10:30:00Z",
  "updatedAt": "2026-08-22T10:30:00Z"
}
```

#### 4.1.4 Field Validation Rules

| Field | Rule |
|---|---|
| title | Required; string; maximum 255 characters |
| amount | Required; numeric(12,2); must be strictly greater than 0 |
| category | Required; must be one of the seven defined ExpenseCategory values |
| expenseDate | Required; valid ISO date (yyyy-MM-dd) |
| description | Optional; free text |

#### 4.1.5 HTTP Status Codes

| Scenario | Status |
|---|---|
| Resource created | 201 Created |
| Resource(s) retrieved | 200 OK |
| Resource deleted | 204 No Content |
| Resource not found | 404 Not Found |
| Validation / malformed request | 400 Bad Request |
| Unhandled server error | 500 Internal Server Error |

#### 4.1.6 Error Response Format

All error responses shall use the following consistent structure, produced by a global `@ControllerAdvice` exception handler (never a raw stack trace or framework default error page):

```json
{
  "timestamp": "2026-08-22T12:30:00Z",
  "status": 404,
  "error": "NOT_FOUND",
  "message": "Expense not found",
  "path": "/api/v1/expenses/100"
}
```

#### 4.1.7 API Documentation

The backend shall expose interactive API documentation via springdoc-openapi / Swagger UI, and a Postman collection (`postman/PennyPilot.postman_collection.json`) shall be kept in sync with the live API for manual and exploratory testing.

### 4.2 Database Interface

V1 uses a single table, `expenses`, defined in databaseschema.md and delivered via the Flyway migration `database/migrations/V1__initial_schema.sql`.

| Column | Type | Constraints |
|---|---|---|
| id | BIGSERIAL | PRIMARY KEY |
| title | VARCHAR(255) | NOT NULL |
| amount | NUMERIC(12,2) | NOT NULL, CHECK (amount > 0) |
| category | VARCHAR(50) | NOT NULL |
| expense_date | DATE | NOT NULL |
| description | TEXT | NULL |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT now() |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT now() |

Indexes `idx_expenses_category` and `idx_expenses_expense_date` shall exist to support FR-5 filtering. No foreign keys exist in V1; no other tables (users, budgets, income, accounts, etc.) shall be created (databaseschema.md §14).

### 4.3 User Interface

The V1 frontend is a React 18.3 + TypeScript single-page application, styled with Tailwind CSS, and shall provide the following screens (folderstructure.md, PRODUCT_ROADMAP.md §5):

| Route | Page | Purpose |
|---|---|---|
| /dashboard | DashboardPage | Summary cards (total, count) and recent expenses |
| /expenses | ExpensesPage | Full expense list with category/date filters |
| /expenses/add | AddExpensePage | Create-expense form |
| /expenses/edit/:id | EditExpensePage | Edit-expense form, pre-filled |
| * | NotFoundPage | 404 fallback for unmatched routes |

1. **UI-1** — The layout shall be responsive across common breakpoints (mobile, tablet, desktop).
2. **UI-2** — Loading states shall be shown while API requests are in flight (LoadingSpinner).
3. **UI-3** — API/network errors shall be surfaced via a visible, non-blocking error banner (ErrorBanner), not a silent failure.
4. **UI-4** — An empty state (EmptyState) shall be shown when there are no expenses to display.
5. **UI-5** — Currency and dates shall be formatted consistently via shared utilities (formatCurrency.ts, formatDate.ts).

---

## 5. Non-Functional Requirements

### 5.1 Performance

- **NFR-P1** — Standard CRUD and filter API calls should respond within 500 ms under normal load (single-user, low-volume V1 usage) on the target hosting tier.
- **NFR-P2** — Indexes on category and expense_date (Section 4.2) shall be in place before deployment so filtering does not require a full table scan as data grows.
- **NFR-P3** — The frontend shall avoid redundant API calls by using TanStack Query caching for list/summary data.

### 5.2 Security

- **NFR-S1** — V1 has no authentication; this shall be documented clearly to users of the deployed instance, and the deployment shall not be advertised or used for storing sensitive/real financial data by multiple untrusted parties.
- **NFR-S2** — All input shall be validated and parameterized (JPA/Hibernate) to prevent SQL injection; no raw string-concatenated queries are permitted.
- **NFR-S3** — Secrets (DB credentials, etc.) shall be supplied via environment variables only; `.env` files shall never be committed to Git (agents.md rules 3–5; folderstructure.md §7).
- **NFR-S4** — CORS shall be configured on the backend to allow only the known frontend origin(s), not a wildcard, in production.
- **NFR-S5** — Error responses (Section 4.1.6) shall never leak stack traces, SQL, or internal implementation details to the client.

### 5.3 Reliability & Availability

- **NFR-R1** — The backend shall fail fast and log clearly if it cannot connect to PostgreSQL at startup, rather than serving requests against a broken connection.
- **NFR-R2** — Database schema changes shall be applied only through versioned Flyway migrations, never manual/ad-hoc DDL against production.
- **NFR-R3** — A basic health-check endpoint (e.g. Spring Boot Actuator `/actuator/health`) shall be available for the hosting platform and CI/CD to verify a successful deployment.

### 5.4 Usability

- **NFR-U1** — A first-time user shall be able to add and view an expense without external instructions (self-explanatory UI).
- **NFR-U2** — Form validation errors shall be shown inline, next to the relevant field, in plain language.

### 5.5 Maintainability

- **NFR-M1** — The backend shall follow the layered structure in folderstructure.md (controller / service / repository / dto / entity / mapper / exception) to keep concerns separated.
- **NFR-M2** — DTOs shall be used for all request/response payloads; JPA entities shall never be returned directly from controllers.
- **NFR-M3** — No business data (e.g. category lists, validation limits) shall be hardcoded in multiple places; each shall have a single source of truth (enum on backend, constants file on frontend), per agents.md rule 9.

### 5.6 Testability

- **NFR-T1** — Every new backend feature shall include unit tests (service layer, JUnit 5 + Mockito) and integration tests (controller layer, MockMvc), per agents.md rule 10 and techstack.md §2.
- **NFR-T2** — A CI pipeline shall run the automated test suite on every push/PR and block merges on failure.

### 5.7 Portability / Deployability

- **NFR-D1** — Backend and frontend shall each build into a Docker image (Dockerfile provided for both) so that the application can run consistently in any Docker-capable environment.
- **NFR-D2** — A root-level docker-compose.yml shall allow running frontend, backend and PostgreSQL together for local development with a single command.

---

## 6. Data Requirements

### 6.1 Logical Data Model

V1 has a single entity, Expense, with no relationships to any other entity (databaseschema.md §5). This is intentional: V1 is scoped to single-table, single-user expense tracking, with richer relationships (budgets, income, accounts, users) introduced from V3 onward.

### 6.2 Data Retention

V1 defines no automatic data retention, archiving, or export/backup requirement beyond standard managed-PostgreSQL backups provided by the hosting platform. Explicit backup/retention policy is not specified in the source documents and is flagged as an open item in Section 7.

### 6.3 Data Integrity Rules

- amount must be strictly greater than 0 (enforced at both the database CHECK constraint and API validation layers).
- category must be one of the seven defined enum values (enforced at the API validation layer; consider a DB-level CHECK/enum as a defense-in-depth improvement — see Section 7).
- created_at is immutable after insert; updated_at changes on every successful update.

---

## 7. Additional Requirements to Achieve a Stable, Production-Ready V1

The source documents cover product features and the technical contract well, but folderstructure.md's own "Pending Project Requirements" section, dependencies.md's local-development mandate, and the roadmap's Production Release Criteria (§20), leave a number of engineering items still open. These are not new features — they are the remaining work needed for V1 to satisfy the roadmap's own definition of "released": deployed, tested, secure, documented, and verified in production. This SRS makes them explicit requirements.

### 7.1 Configuration & Environment

1. **CFG-1** — Provide a root-level docker-compose.yml that runs frontend + backend + PostgreSQL together for local development (folderstructure.md §1; elaborated fully in Section 7.7 per dependencies.md).
2. **CFG-2** — Externalize all database configuration (URL, username, password, pool size) via environment variables; provide .env.example for both backend and frontend with no real secrets (folderstructure.md §2, §7).
3. **CFG-3** — Configure Flyway to run automatically on Spring Boot startup in all environments (folderstructure.md §3).
4. **CFG-4** — Configure CORS explicitly to allow only the deployed frontend origin(s) (folderstructure.md §6; NFR-S4).

### 7.2 API Documentation & Contract Finalization

1. **DOC-1** — Add and configure springdoc-openapi so Swagger UI is available on the deployed backend (folderstructure.md §5).
2. **DOC-2** — Treat apischema.md as a draft contract (it is explicitly marked as a proposed design, not a PRD-mandated one) and finalize/freeze exact endpoint paths, methods, payloads, validation rules and error format before frontend integration begins (folderstructure.md §9).
3. **DOC-3** — Keep the Postman collection and environment file in the postman/ directory in sync with the finalized contract.

### 7.3 Testing

1. **TEST-1** — Backend: unit tests for ExpenseService, integration tests for ExpenseController (MockMvc), and repository tests for ExpenseRepository, matching the test tree already defined in folderstructure.md.
2. **TEST-2** — Frontend: at minimum, component tests for ExpenseForm and ExpenseFilters, and API-layer tests for expenseApi.ts (folderstructure.md §10).
3. **TEST-3** — End-to-end smoke test covering the full create → view → filter → update → delete flow against a running instance, to be re-run after each production deployment (Roadmap §20, "production smoke tests pass").

### 7.4 CI/CD & Git

1. **CI-1** — GitHub Actions workflow (.github/workflows/ci.yml) that builds and tests both backend and frontend on every push/PR (folderstructure.md §8; Roadmap §19).
2. **CI-2** — Protected main/release branch requiring passing CI and at least one review before merge (agents.md rule 12; Roadmap §19).
3. **CI-3** — Feature-branch workflow with meaningful commit messages and release tags for each deployed version (Roadmap §19).

### 7.5 Deployment

1. **DEP-1** — Decide and document the concrete hosting choice for backend, frontend and PostgreSQL from the options listed in techstack.md §5 (folderstructure.md §11).
2. **DEP-2** — Automate deployment from the CI pipeline (or a documented manual step) so a merge to the release branch reliably produces a new live version.
3. **DEP-3** — Verify production deployment with a smoke test and a health-check call before considering the release complete (Roadmap §20).

### 7.6 Observability

1. **OBS-1** — Structured application logging (SLF4J + Logback, already in the stack) for request handling, validation failures, and unhandled exceptions — no sensitive data in logs.
2. **OBS-2** — Expose a health endpoint (Spring Boot Actuator) for use by the hosting platform and CI/CD verification (NFR-R3).

### 7.7 Docker-Only Local Development Environment (dependencies.md)

dependencies.md requires that a developer be able to run PennyPilot V1 locally with no dependency installed on the host machine other than Docker Desktop — no local Java, Node.js, or PostgreSQL installation required. This elaborates CFG-1–CFG-3 into a complete, binding local-development specification.

#### 7.7.1 Required Services

| Service | Base Image / Runtime | Purpose |
|---|---|---|
| postgres | postgres:16 | PostgreSQL 16 database, matching techstack.md §3 |
| backend | eclipse-temurin:21-jdk (dev) → eclipse-temurin:21-jre (prod) | Spring Boot API, running Flyway migrations on startup |
| frontend | node:20-alpine | React + Vite dev server (hot reload) locally; Nginx-served static build in production |

#### 7.7.2 Functional Requirements — Docker Environment

1. **DEV-1** — A single root-level docker-compose.yml shall define and orchestrate all three services (postgres, backend, frontend) as one command: `docker compose up --build`.
2. **DEV-2** — The postgres service shall use a named Docker volume (e.g. pennypilot-db-data) so data persists across container restarts and `docker compose down` (without -v).
3. **DEV-3** — The postgres service shall define a healthcheck using `pg_isready`; the backend service shall declare `depends_on: postgres` with `condition: service_healthy` so it never starts against a database that is not yet ready.
4. **DEV-4** — The backend service shall define a healthcheck against Spring Boot Actuator (`GET /actuator/health`) so Compose, CI, and hosting platforms can determine readiness (ties to NFR-R3, OBS-2).
5. **DEV-5** — Flyway shall run automatically as part of backend container startup, applying `database/migrations/V1__initial_schema.sql` against the postgres service before the application accepts traffic (ties to CFG-3).
6. **DEV-6** — The backend container shall support hot reload in local development (e.g. Spring Boot DevTools plus a bind-mounted source volume, or an equivalent live-reload mechanism) so code changes are reflected without a full image rebuild.
7. **DEV-7** — The frontend container shall run the Vite dev server with the project source bind-mounted from the host, so changes are reflected via Hot Module Replacement (HMR) without a rebuild, and shall expose the dev server port to the host.
8. **DEV-8** — The frontend service shall define a lightweight healthcheck (e.g. curl against the dev server root) mirroring the backend's health-check pattern.
9. **DEV-9** — All services shall share a single user-defined Docker bridge network (e.g. pennypilot-network) so containers address each other by service name (backend → postgres, frontend → backend) rather than localhost or hard-coded IPs.
10. **DEV-10** — All environment-specific values (DB host/port/name/credentials, backend port, frontend API base URL, Spring profile) shall be supplied via environment variables, sourced from a root-level `.env` consumed by docker-compose.yml's env_file/environment blocks; a committed `.env.example` shall list every required variable with safe placeholder values, and the real `.env` shall remain untracked (ties to CFG-2, NFR-S3).
11. **DEV-11** — Running the entire stack locally shall require only Docker Desktop on the host — no local installation of Java, Maven, Node.js, npm, or PostgreSQL shall be necessary to develop or run PennyPilot V1.
12. **DEV-12** — Documented, working commands shall be provided for at least: starting the stack (`docker compose up --build`), running in the background (`-d`), stopping it (`docker compose down`), viewing logs (`docker compose logs -f <service>`), and a full reset including volumes (`docker compose down -v`).

#### 7.7.3 Required Docker Files

| File | Purpose |
|---|---|
| docker-compose.yml | Root-level orchestration of postgres, backend and frontend services, network and volumes (DEV-1, DEV-9, DEV-2) |
| backend/Dockerfile | Multi-stage build: a dev stage supporting hot reload (DEV-6) and a slim production stage (Maven build → JRE runtime) |
| backend/.dockerignore | Excludes target/, .git, local IDE files from the build context |
| frontend/Dockerfile | Multi-stage build: a dev stage running the Vite dev server (DEV-7) and a production stage serving the static build via Nginx |
| frontend/.dockerignore | Excludes node_modules/, dist/, .git from the build context |
| .env.example | Root-level template listing every environment variable required by docker-compose.yml (DEV-10) |

#### 7.7.4 Updated Folder Structure (Docker Additions)

The following files are added to the structure already defined in folderstructure.md; no other paths change:

```text
pennypilot/
├── docker-compose.yml            (new — orchestrates postgres, backend, frontend)
├── .env.example                  (new — root-level env var template)
├── .env                          (new, untracked — real local values)
│
├── backend/
│   ├── Dockerfile                (multi-stage: dev + production)
│   ├── .dockerignore
│   └── ...                       (unchanged from folderstructure.md)
│
├── frontend/
│   ├── Dockerfile                (multi-stage: dev + production)
│   ├── .dockerignore
│   └── ...                       (unchanged from folderstructure.md)
│
└── database/
    └── migrations/
        └── V1__initial_schema.sql   (applied automatically per DEV-5)
```

#### 7.7.5 Local Development Data Flow

```text
  docker compose up --build
          │
          ▼
  ┌──────────────┐   healthy    ┌──────────────┐   healthy   ┌──────────────┐
  │  postgres    │ ───────────▶ │   backend     │ ──────────▶ │  frontend     │
  │  (pg_isready)│              │ Flyway + API  │             │  Vite (HMR)   │
  │  :5432       │              │ /actuator/... │             │  :5173        │
  └──────────────┘              └──────────────┘             └──────────────┘
        ▲                              ▲                            ▲
        └────────── pennypilot-network (Docker bridge) ─────────────┘
```

### 7.8 Explicitly Deferred (Not Required for V1)

To avoid scope creep against Roadmap Principle 4 ("Do not add technology without a product or engineering reason"), the following are confirmed out of scope for V1 and should not be implemented now even though they are common production concerns:

- Authentication, sessions, JWT, RBAC — arrives V5
- Search, pagination, sorting — arrives V2
- Analytics, budgets — arrives V3
- Income, accounts, payment methods — arrives V4
- Caching (Redis), queues, rate limiting — arrives V9
- File attachments, notifications, recurring transactions — arrives V8
- Formal VAPT / penetration testing — arrives V10 (baseline OWASP hygiene from Section 5.2 still applies now)
- AI/LLM features, RAG, agents — arrive V11–V13

---

## 8. Development Constraints (Agent & Contributor Rules)

agents.md defines binding rules for anyone — human or AI agent — implementing PennyPilot. They are restated here as constraints on how Section 3–7 requirements may be implemented:

| # | Rule |
|---|---|
| 1 | Do not change approved architecture. |
| 2 | Follow repository structure (folderstructure.md). |
| 3 | Never request or expose secrets. |
| 4 | Use environment variables. |
| 5 | Never commit .env. |
| 6 | Follow API specification (apischema.md). |
| 7 | Follow UI design system. |
| 8 | Do not use inline styles. |
| 9 | Do not hardcode business data. |
| 10 | Write tests for new functionality. |
| 11 | Do not modify unrelated files. |
| 12 | Do not push directly to main. |
| 13 | Run required checks before completion. |
| 14 | Update documentation when architecture changes. |
| 15 | Ask for approval when requirements are ambiguous. |

---

## 9. Acceptance Criteria — Definition of "V1 Released"

Consistent with the roadmap's Production Release Criteria (§20), V1 shall not be considered complete until all of the following are true:

1. All functional requirements FR-1 through FR-7 (Section 3) are implemented and pass their tests.
2. All API endpoints match apischema.md / Section 4.1 exactly, including status codes and error format.
3. The database schema matches databaseschema.md / Section 4.2, applied via Flyway migration.
4. The five frontend routes (Section 4.3) are implemented, responsive, and handle loading/empty/error states.
5. Automated backend and frontend tests exist and pass in CI (Section 7.3).
6. docker-compose.yml brings up the full stack (postgres, backend, frontend) locally with one command, requiring only Docker Desktop on the host (CFG-1, Section 7.7).
7. CORS, environment variables, and secret handling meet Section 5.2 and Section 7.1.
8. CI pipeline (build → test → package) passes on the release branch (Section 7.4).
9. The application is deployed to production hosting and a post-deploy smoke test + health check succeed (Section 7.5).
10. API documentation (Swagger UI) and the Postman collection are available and accurate (Section 7.2).

Only when every item above is satisfied is PennyPilot V1 — Live Expense Tracker considered released, per the roadmap's principle: "A product is not finished when the code is written. It is finished when the software is working in production."

---

## 10. Traceability & Appendix

### 10.1 Requirement ID Scheme

| Prefix | Meaning |
|---|---|
| FR-n | Functional Requirement (Section 3) |
| UI-n | User Interface Requirement (Section 4.3) |
| NFR-Xn | Non-Functional Requirement, category X (Section 5): P=Performance, S=Security, R=Reliability, U=Usability, M=Maintainability, T=Testability, D=Deployability |
| CFG / DOC / TEST / CI / DEP / OBS / DEV | Additional stabilization requirements (Section 7) |

### 10.2 Source-to-Requirement Traceability (Summary)

| Source Document | Primary Sections Used |
|---|---|
| PRODUCT_ROADMAP.md | §5 (V1 scope), §19–25 (cross-version standards, release criteria) → Sections 1, 2, 3, 5, 9 |
| techstack.md | §2–7 (stack, scope, exclusions) → Sections 2.4, 2.5, 4.2, 5, 7.7 |
| databaseschema.md | Full document → Sections 4.2, 6 |
| apischema.md | Full document → Sections 3, 4.1 |
| folderstructure.md | Full document, incl. "Pending Project Requirements" → Sections 2.5, 4.3, 7 |
| agents.md | Full document → Section 8, and constraints throughout |
| dependencies.md | Full document (Docker-only local dev mandate) → Section 7.7 |

### 10.3 Open Questions for Product Owner

The following were not answered by the source documents and are flagged rather than assumed silently:

- Target currency / locale for amount formatting (assumed single implicit currency — Section 2.6).
- Concrete hosting provider selection among the options listed in techstack.md §5 (DEP-1).
- Backup/retention policy for the database beyond the hosting platform's defaults (Section 6.2).
- Whether a DB-level CHECK/enum constraint on category is desired in addition to API-level validation (Section 6.3).

---

*End of Document — PennyPilot SRS V1*
