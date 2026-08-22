# PennyPilot — Tech Stack (Version 1)

## Core Expense Tracker

**Document Type:** Tech Stack Specification
**Product:** PennyPilot
**Version:** V1
**Status:** Draft

---

## 1. Scope Reference

This tech stack covers the engineering scope defined for **V1 — Core Expense Tracker**:

- Expense CRUD (create, view all, view by ID, update, delete)
- Category-based and date-based filtering
- Basic summary (total amount, count)
- REST APIs, DTOs, validation, global exception handling
- API documentation
- Automated tests
- Git/GitHub, CI pipeline, production deployment
- Responsive frontend (dashboard, list, add/edit/delete, summary)

No authentication, analytics, or multi-user concerns exist in V1 — those arrive in later versions and are intentionally excluded here.

---

## 2. Backend

| Component | Technology | Version | Purpose |
|---|---|---|---|
| Language | Java | 21 (LTS) | Core backend language |
| Framework | Spring Boot | 3.3.x | REST API, dependency injection, application bootstrap |
| Web Layer | Spring Web (MVC) | (bundled with Spring Boot) | REST controllers |
| ORM | Spring Data JPA | 3.3.x | Repository abstraction over Hibernate |
| ORM Provider | Hibernate | 6.5.x | Entity-to-table mapping |
| Validation | Jakarta Bean Validation + Hibernate Validator | 8.x | Request DTO validation (`@NotNull`, `@Positive`, etc.) |
| Build Tool | Maven | 3.9.x | Dependency management, build lifecycle |
| API Documentation | springdoc-openapi (Swagger UI) | 2.5.x | Auto-generated API docs |
| Exception Handling | `@ControllerAdvice` + `@ExceptionHandler` | Spring Boot built-in | Global exception handling, consistent error responses |
| Logging | SLF4J + Logback | (bundled with Spring Boot) | Application logging |
| Testing | JUnit 5 | 5.10.x | Unit and integration tests |
| Testing | Mockito | 5.x | Mocking dependencies in unit tests |
| Testing | Spring Boot Test + MockMvc | (bundled with Spring Boot) | Controller/integration testing |

---

## 3. Database

| Component | Technology | Version | Purpose |
|---|---|---|---|
| Database | PostgreSQL | 16.x | Primary relational data store (explicitly required by PRD) |
| Migration Tool | Flyway | 10.x | Version-controlled schema migrations |
| Connection Pool | HikariCP | (bundled with Spring Boot) | Efficient DB connection pooling |
| Driver | PostgreSQL JDBC Driver | 42.7.x | JDBC connectivity |

**V1 Schema (single entity):**

```
expenses
├── id (PK, bigint/UUID)
├── title (varchar, not null)
├── amount (numeric, not null)
├── category (varchar, not null)
├── expense_date (date, not null)
├── description (text, nullable)
├── created_at (timestamp, not null)
└── updated_at (timestamp, not null)
```

Categories (`Food`, `Transport`, `Shopping`, `Bills`, `Health`, `Entertainment`, `Other`) can be modeled as an enum column or a lookup table — enum is sufficient for V1 given the fixed, small set.

---

## 4. Frontend

| Component | Technology | Version | Purpose |
|---|---|---|---|
| Framework | React | 18.3.x | UI library |
| Build Tool | Vite | 5.x | Dev server and bundler |
| Language | TypeScript | 5.5.x | Type safety across components/API calls |
| Routing | React Router | 6.x | Dashboard, list, add/edit page navigation |
| Data Fetching | TanStack Query (React Query) | 5.x | API calls, caching, loading/error states |
| HTTP Client | Axios | 1.7.x | REST API communication |
| Styling | Tailwind CSS | 3.4.x | Responsive layout, utility-first styling |
| Forms | React Hook Form + Zod | RHF 7.x / Zod 3.x | Add/edit expense form handling and validation |
| Icons | Lucide React | 0.4xx.x | UI icons |

---

## 5. DevOps & Tooling

| Component | Technology | Version | Purpose |
|---|---|---|---|
| Version Control | Git + GitHub | — | Feature branches, PRs, protected main branch |
| CI Pipeline | GitHub Actions | — | Build → Test → Package on push/PR |
| Containerization | Docker | 26.x | Consistent backend/frontend build artifacts |
| Backend Hosting (V1) | Render / Railway / AWS EC2 | — | Simple production deployment for a single-service app |
| Frontend Hosting (V1) | Vercel / Netlify | — | Static React build hosting with CI integration |
| DB Hosting (V1) | Managed PostgreSQL (Render/Neon/AWS RDS) | 16.x | Production database instance |

---

## 6. Explicitly Out of Scope for V1

To keep this version focused and avoid over-engineering (per PRD Guiding Principle 4: *"Do not add technology without a product or engineering reason"*):

- ❌ Spring Security / JWT / Auth (arrives V5)
- ❌ Redis / caching (arrives V9)
- ❌ Message queues (arrives V9)
- ❌ File/object storage (arrives V8)
- ❌ AI/LLM integrations (arrives V11+)
- ❌ Mobile app (arrives V7)
- ❌ pgvector / vector DB (arrives V12)

---

## 7. Version Summary Table

| Layer | Choice |
|---|---|
| Backend | Java 21 + Spring Boot 3.3.x |
| ORM | Spring Data JPA 3.3.x + Hibernate 6.5.x |
| Database | PostgreSQL 16.x |
| Migrations | Flyway 10.x |
| Frontend | React 18.3.x + TypeScript 5.5.x + Vite 5.x |
| Styling | Tailwind CSS 3.4.x |
| API Docs | springdoc-openapi 2.5.x |
| Testing | JUnit 5 + Mockito + MockMvc |
| CI/CD | GitHub Actions |
| Containerization | Docker 26.x |

---

**Note:** Exact patch versions should be confirmed at project init time (`spring init` / `npm create vite@latest`), since minor releases update frequently. This document should be revisited and extended at the start of V2.
