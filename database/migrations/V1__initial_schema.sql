CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL,
    expense_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);

-- Insert sample records
INSERT INTO expenses (title, amount, category, expense_date, description) VALUES
('Lunch', 250.00, 'FOOD', '2026-08-22', 'Lunch at restaurant'),
('Bus Ticket', 50.00, 'TRANSPORT', '2026-08-22', 'Daily commute'),
('Movie', 400.00, 'ENTERTAINMENT', '2026-08-21', 'Movie ticket');
