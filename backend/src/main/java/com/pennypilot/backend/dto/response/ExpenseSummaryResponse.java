package com.pennypilot.backend.dto.response;

import java.math.BigDecimal;

public class ExpenseSummaryResponse {

    private BigDecimal totalAmount;
    private long expenseCount;

    // Constructors
    public ExpenseSummaryResponse() {
    }

    public ExpenseSummaryResponse(BigDecimal totalAmount, long expenseCount) {
        this.totalAmount = totalAmount;
        this.expenseCount = expenseCount;
    }

    // Getters and Setters
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public long getExpenseCount() {
        return expenseCount;
    }

    public void setExpenseCount(long expenseCount) {
        this.expenseCount = expenseCount;
    }
}
