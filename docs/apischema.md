# PennyPilot V1 — API Schema

## 1. Version

**API Version:** V1  
**Product:** PennyPilot — Core Expense Tracker  
**Base URL:**

```text
/api/v1
```

V1 requires APIs for creating, viewing, updating, and deleting expenses, along with category/date filtering and basic expense summaries.

> **Note:** The PRD does not define exact endpoint URLs, HTTP methods, JSON formats, or status codes. The API contract below is the proposed V1 design based on the stated requirements.

---

# 2. API Structure

```text
/api/v1
│
├── /expenses
│   ├── POST    /
│   ├── GET     /
│   ├── GET     /{id}
│   ├── PUT     /{id}
│   └── DELETE  /{id}
│
└── /expenses/summary
    └── GET     /
```

---

# 3. Expense API

## 3.1 Create Expense

```http
POST /api/v1/expenses
```

### Request

```json
{
  "title": "Lunch",
  "amount": 250.00,
  "category": "FOOD",
  "expenseDate": "2026-08-22",
  "description": "Lunch at restaurant"
}
```

### Response

```http
201 Created
```

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

---

# 4. Get All Expenses

```http
GET /api/v1/expenses
```

### Response

```http
200 OK
```

```json
[
  {
    "id": 1,
    "title": "Lunch",
    "amount": 250.00,
    "category": "FOOD",
    "expenseDate": "2026-08-22",
    "description": "Lunch at restaurant",
    "createdAt": "2026-08-22T10:30:00Z",
    "updatedAt": "2026-08-22T10:30:00Z"
  },
  {
    "id": 2,
    "title": "Bus Ticket",
    "amount": 50.00,
    "category": "TRANSPORT",
    "expenseDate": "2026-08-22",
    "description": "Daily commute",
    "createdAt": "2026-08-22T11:00:00Z",
    "updatedAt": "2026-08-22T11:00:00Z"
  }
]
```

---

# 5. Get Expense By ID

```http
GET /api/v1/expenses/{id}
```

### Example

```http
GET /api/v1/expenses/1
```

### Response

```http
200 OK
```

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

---

# 6. Update Expense

```http
PUT /api/v1/expenses/{id}
```

### Example

```http
PUT /api/v1/expenses/1
```

### Request

```json
{
  "title": "Dinner",
  "amount": 500.00,
  "category": "FOOD",
  "expenseDate": "2026-08-22",
  "description": "Dinner at restaurant"
}
```

### Response

```http
200 OK
```

```json
{
  "id": 1,
  "title": "Dinner",
  "amount": 500.00,
  "category": "FOOD",
  "expenseDate": "2026-08-22",
  "description": "Dinner at restaurant",
  "createdAt": "2026-08-22T10:30:00Z",
  "updatedAt": "2026-08-22T12:00:00Z"
}
```

---

# 7. Delete Expense

```http
DELETE /api/v1/expenses/{id}
```

### Example

```http
DELETE /api/v1/expenses/1
```

### Response

```http
204 No Content
```

No response body is required.

---

# 8. Filter Expenses

V1 supports filtering by **category** and **date**.

## 8.1 Filter By Category

```http
GET /api/v1/expenses?category=FOOD
```

---

## 8.2 Filter By Date

```http
GET /api/v1/expenses?date=2026-08-22
```

---

## 8.3 Filter By Date Range

```http
GET /api/v1/expenses?startDate=2026-08-01&endDate=2026-08-22
```

---

## 8.4 Combined Filters

```http
GET /api/v1/expenses?category=FOOD&startDate=2026-08-01&endDate=2026-08-22
```

### Response

```http
200 OK
```

```json
[
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
]
```

---

# 9. Expense Summary

V1 requires two basic summary values:

- Total expense amount
- Number of expenses

```http
GET /api/v1/expenses/summary
```

### Response

```http
200 OK
```

```json
{
  "totalAmount": 12500.00,
  "expenseCount": 42
}
```

---

# 10. Filtered Expense Summary

The same category/date filters can optionally be applied to the summary.

```http
GET /api/v1/expenses/summary?category=FOOD
```

```http
GET /api/v1/expenses/summary?startDate=2026-08-01&endDate=2026-08-22
```

```http
GET /api/v1/expenses/summary?category=FOOD&startDate=2026-08-01&endDate=2026-08-22
```

### Response

```json
{
  "totalAmount": 4250.00,
  "expenseCount": 12
}
```

---

# 11. Expense Categories

```text
FOOD
TRANSPORT
SHOPPING
BILLS
HEALTH
ENTERTAINMENT
OTHER
```

These are the V1 categories defined in the product roadmap.

---

# 12. Validation

## Create / Update Expense

```text
title
    → Required
    → Maximum 255 characters

amount
    → Required
    → Must be greater than 0

category
    → Required
    → Must be a valid ExpenseCategory

expenseDate
    → Required
    → Valid date

description
    → Optional
```

The PRD requires backend validation as part of the V1 engineering scope.

---

# 13. Error Response

All API errors should use a consistent response structure.

### Example

```json
{
  "timestamp": "2026-08-22T12:30:00Z",
  "status": 404,
  "error": "NOT_FOUND",
  "message": "Expense not found",
  "path": "/api/v1/expenses/100"
}
```

---

# 14. HTTP Status Codes

```text
POST /expenses
    → 201 Created

GET /expenses
    → 200 OK

GET /expenses/{id}
    → 200 OK
    → 404 Not Found

PUT /expenses/{id}
    → 200 OK
    → 404 Not Found
    → 400 Bad Request

DELETE /expenses/{id}
    → 204 No Content
    → 404 Not Found

Invalid request
    → 400 Bad Request

Unexpected server error
    → 500 Internal Server Error
```

The V1 roadmap explicitly requires HTTP status code standards and global exception handling.

---

# 15. Complete V1 API List

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/expenses` | Create expense |
| `GET` | `/api/v1/expenses` | Get all expenses |
| `GET` | `/api/v1/expenses/{id}` | Get expense by ID |
| `PUT` | `/api/v1/expenses/{id}` | Update expense |
| `DELETE` | `/api/v1/expenses/{id}` | Delete expense |
| `GET` | `/api/v1/expenses?category={category}` | Filter by category |
| `GET` | `/api/v1/expenses?date={date}` | Filter by date |
| `GET` | `/api/v1/expenses?startDate={date}&endDate={date}` | Filter by date range |
| `GET` | `/api/v1/expenses/summary` | Get expense summary |
| `GET` | `/api/v1/expenses/summary?...` | Get filtered summary |

---

# 16. V1 API Scope

```text
                    API V1
                       │
              ┌────────┴────────┐
              │                 │
           Expenses          Summary
              │                 │
       ┌──────┼──────┐          │
       ↓      ↓      ↓          ↓
     Create  Read   Update    Total
                    Delete    Count
              │
              ↓
          Filtering
              │
       ┌──────┴──────┐
       ↓             ↓
   Category         Date
```

No authentication, users, budgets, income, accounts, payment methods, recurring transactions, notifications, or AI APIs are included in V1 because those capabilities are introduced in later roadmap versions.