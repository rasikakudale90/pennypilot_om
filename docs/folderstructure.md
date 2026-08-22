# PennyPilot — Folder Structure

```text
pennypilot/
│
├── README.md
├── .gitignore
│
├── backend/
│   ├── pom.xml
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env
│   ├── .env.example
│   ├── README.md
│   │
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/
│       │   │       └── pennypilot/
│       │   │           └── backend/
│       │   │               ├── PennyPilotApplication.java
│       │   │               │
│       │   │               ├── config/
│       │   │               │   └── OpenApiConfig.java
│       │   │               │
│       │   │               ├── controller/
│       │   │               │   └── ExpenseController.java
│       │   │               │
│       │   │               ├── dto/
│       │   │               │   ├── request/
│       │   │               │   │   ├── CreateExpenseRequest.java
│       │   │               │   │   └── UpdateExpenseRequest.java
│       │   │               │   │
│       │   │               │   └── response/
│       │   │               │       └── ExpenseResponse.java
│       │   │               │
│       │   │               ├── entity/
│       │   │               │   └── Expense.java
│       │   │               │
│       │   │               ├── enums/
│       │   │               │   └── ExpenseCategory.java
│       │   │               │
│       │   │               ├── exception/
│       │   │               │   ├── GlobalExceptionHandler.java
│       │   │               │   ├── ResourceNotFoundException.java
│       │   │               │   └── ErrorResponse.java
│       │   │               │
│       │   │               ├── mapper/
│       │   │               │   └── ExpenseMapper.java
│       │   │               │
│       │   │               ├── repository/
│       │   │               │   └── ExpenseRepository.java
│       │   │               │
│       │   │               └── service/
│       │   │                   └── ExpenseService.java
│       │   │
│       │   └── resources/
│       │       └── application.properties
│       │
│       └── test/
│           └── java/
│               └── com/
│                   └── pennypilot/
│                       └── backend/
│                           ├── controller/
│                           │   └── ExpenseControllerTest.java
│                           ├── service/
│                           │   └── ExpenseServiceTest.java
│                           └── repository/
│                               └── ExpenseRepositoryTest.java
│
│
├── frontend/
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env
│   ├── .env.example
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── README.md
│   │
│   ├── public/
│   │
│   └── src/
│       │
│       ├── main.tsx
│       ├── App.tsx
│       │
│       ├── assets/
│       │   └── images/
│       │
│       ├── api/
│       │   ├── axiosClient.ts
│       │   └── expenseApi.ts
│       │
│       ├── components/
│       │   │
│       │   ├── common/
│       │   │   ├── Button/
│       │   │   │   └── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Modal.tsx
│       │   │   ├── LoadingSpinner.tsx
│       │   │   ├── EmptyState.tsx
│       │   │   └── ErrorBanner.tsx
│       │   │
│       │   ├── layout/
│       │   │   ├── Navbar.tsx
│       │   │   └── Sidebar.tsx
│       │   │
│       │   ├── expense/
│       │   │   ├── ExpenseList.tsx
│       │   │   ├── ExpenseTable.tsx
│       │   │   ├── ExpenseCard.tsx
│       │   │   ├── ExpenseForm.tsx
│       │   │   └── ExpenseFilters.tsx
│       │   │
│       │   └── dashboard/
│       │       └── SummaryCards.tsx
│       │
│       ├── pages/
│       │   ├── DashboardPage.tsx
│       │   ├── ExpensesPage.tsx
│       │   ├── AddExpensePage.tsx
│       │   ├── EditExpensePage.tsx
│       │   └── NotFoundPage.tsx
│       │
│       ├── layouts/
│       │   └── MainLayout.tsx
│       │
│       ├── hooks/
│       │   └── useExpenses.ts
│       │
│       ├── context/
│       │   └── AppContext.tsx
│       │
│       ├── types/
│       │   └── expense.ts
│       │
│       ├── constants/
│       │   └── expenseConstants.ts
│       │
│       ├── utils/
│       │   ├── formatCurrency.ts
│       │   └── formatDate.ts
│       │
│       └── styles/
│           ├── index.css
│           ├── variables.css
│           └── components.css
│
│
├── database/
│   ├── README.md
│   └── migrations/
│       └── V1__initial_schema.sql
│
│
├── postman/
│   ├── PennyPilot.postman_collection.json
│   └── PennyPilot.postman_environment.json
│
│
└── .github/
    └── workflows/
        └── ci.yml
```

# Pending Project Requirements

```text
1. Root-level docker-compose.yml
   → Run frontend + backend + PostgreSQL together.

2. Database configuration
   → PostgreSQL setup and credentials in environment variables.

3. Database migration configuration
   → Add Flyway/Liquibase dependency and configuration if migrations are to
     be executed automatically by Spring Boot.

4. Frontend routing
   → React Router configuration for:
      /dashboard
      /expenses
      /expenses/add
      /expenses/edit/:id
      *

5. Backend API documentation
   → Swagger/OpenAPI dependency and configuration.

6. CORS configuration
   → Allow frontend origin to communicate with Spring Boot backend.

7. Environment configuration
   → Never commit real .env secrets.
   → Keep only .env.example in Git.

8. CI configuration
   → GitHub Actions should build/test backend and frontend.

9. API contract
   → Finalize endpoint paths, HTTP methods, request/response formats,
     validation rules, and error response format.

10. Testing
    → Backend unit/integration tests.
    → Frontend component/API tests if required.

11. Production deployment
    → Decide hosting for frontend, backend, and PostgreSQL.
```