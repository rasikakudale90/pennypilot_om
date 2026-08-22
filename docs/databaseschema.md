# PennyPilot V1 — Database Schema

## 1. Version

**Database Version:** V1  
**Product Version:** PennyPilot V1 — Core Expense Tracker  
**Database:** PostgreSQL  
**Migration File:** `V1__initial_schema.sql`

V1 focuses only on core expense management: creating, viewing, updating, deleting, and filtering expenses. The roadmap specifies the expense fields as ID, title, amount, category, expense date, description, created timestamp, and updated timestamp.

---

## 2. V1 Entities

```text
┌──────────────────────┐
│       expenses       │
├──────────────────────┤
│ id                   │
│ title                │
│ amount               │
│ category             │
│ expense_date         │
│ description          │
│ created_at           │
│ updated_at           │
└──────────────────────┘
```

V1 requires only **one database table: `expenses`**.

User, authentication, income, accounts, payment methods, budgets, recurring transactions, files, and notifications are intentionally not included because they belong to later product versions.

---

# 3. `expenses` Table

| Column | PostgreSQL Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGSERIAL` | `PRIMARY KEY` | Unique expense identifier |
| `title` | `VARCHAR(255)` | `NOT NULL` | Expense title |
| `amount` | `NUMERIC(12,2)` | `NOT NULL`, `> 0` | Expense amount |
| `category` | `VARCHAR(50)` | `NOT NULL` | Expense category |
| `expense_date` | `DATE` | `NOT NULL` | Date on which expense occurred |
| `description` | `TEXT` | `NULL` | Optional expense description |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL` | Record creation timestamp |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL` | Last update timestamp |

---

# 4. Expense Categories

V1 defines the following categories:

```text
FOOD
TRANSPORT
SHOPPING
BILLS
HEALTH
ENTERTAINMENT
OTHER
```

These categories are defined by the V1 product roadmap.

The backend should represent these categories using:

```text
ExpenseCategory.java
```

The database stores the category value in the `expenses.category` column.

---

# 5. Relationships

V1 has no foreign-key relationships.

```text
expenses
   │
   └── No relationships in V1
```

The database is intentionally kept simple because V1 is a single-user core expense tracker.

Future relationships will be introduced as new versions add:

```text
V3 → budgets
V4 → income, accounts, payment methods, transactions
V5 → users, roles, authentication
V8 → recurring transactions, files, notifications
```

---

# 6. Indexes

V1 supports filtering expenses by:

- Category
- Expense date

Therefore, indexes should be created for these fields.

```sql
CREATE INDEX idx_expenses_category
ON expenses(category);

CREATE INDEX idx_expenses_expense_date
ON expenses(expense_date);
```

A composite index is **not required for V1** unless query analysis later shows a need for it.

---

# 7. SQL Migration

**File:**

```text
database/migrations/V1__initial_schema.sql
```

```sql
CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    amount NUMERIC(12, 2) NOT NULL
        CHECK (amount > 0),

    category VARCHAR(50) NOT NULL,

    expense_date DATE NOT NULL,

    description TEXT,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expenses_category
    ON expenses(category);

CREATE INDEX idx_expenses_expense_date
    ON expenses(expense_date);
```

---

# 8. Sample Records

```sql
INSERT INTO expenses
    (title, amount, category, expense_date, description)
VALUES
    ('Lunch', 250.00, 'FOOD', '2026-08-22', 'Lunch at restaurant'),

    ('Bus Ticket', 50.00, 'TRANSPORT', '2026-08-22', 'Daily commute'),

    ('Movie', 400.00, 'ENTERTAINMENT', '2026-08-21', 'Movie ticket');
```

---

# 9. V1 CRUD Operations

The schema supports the following operations:

```text
CREATE
    ↓
INSERT expense

READ
    ↓
Get all expenses
Get expense by ID

UPDATE
    ↓
Update expense

DELETE
    ↓
Delete expense
```

These CRUD operations directly correspond to the V1 Expense Management requirements.

---

# 10. V1 Filtering

Supported database filters:

```text
Category
    ↓
WHERE category = ?

Date
    ↓
WHERE expense_date = ?

Date Range
    ↓
WHERE expense_date BETWEEN ? AND ?
```

V1 explicitly requires category and date filtering.

---

# 11. V1 Summary Queries

V1 requires:

- Total expense amount
- Number of expenses

### Total Expense

```sql
SELECT COALESCE(SUM(amount), 0)
FROM expenses;
```

### Number of Expenses

```sql
SELECT COUNT(*)
FROM expenses;
```

---

# 12. Schema Diagram

```text
                    ┌─────────────────────────────┐
                    │          expenses           │
                    ├─────────────────────────────┤
                    │ PK  id                      │
                    │     title                   │
                    │     amount                  │
                    │     category                │
                    │     expense_date            │
                    │     description             │
                    │     created_at              │
                    │     updated_at              │
                    └─────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
             Category Filter      Date Filter
                    │                   │
                    └─────────┬─────────┘
                              ↓
                       Expense Results
```

---

# 13. V1 Database Scope

```text
                    PennyPilot V1
                         │
                         ▼
                   PostgreSQL
                         │
                         ▼
                     expenses
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
      CRUD            Filters          Summary
        │                │                │
        ↓                ↓                ↓
 Create/Read       Category/Date    Total Amount
 Update/Delete                      Count
```

---

# 14. Not Included in V1

The following should **not** be added to the V1 database schema:

```text
❌ users
❌ roles
❌ authentication
❌ budgets
❌ income
❌ accounts
❌ payment_methods
❌ transactions
❌ recurring_transactions
❌ file_attachments
❌ notifications
❌ AI data
❌ vector embeddings
```

These capabilities are introduced in later versions of the product roadmap.

---

# 15. Final V1 Database Structure

```text
database/
│
├── README.md
│
└── migrations/
    └── V1__initial_schema.sql
```

```text
PostgreSQL
    │
    └── expenses
        ├── id
        ├── title
        ├── amount
        ├── category
        ├── expense_date
        ├── description
        ├── created_at
        └── updated_at
```

**V1 database principle:** keep the schema minimal and production-ready, and introduce new tables through future version migrations as the product capabilities expand.