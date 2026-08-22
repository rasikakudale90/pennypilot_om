package com.pennypilot.backend.service;

import com.pennypilot.backend.dto.request.CreateExpenseRequest;
import com.pennypilot.backend.dto.request.UpdateExpenseRequest;
import com.pennypilot.backend.dto.response.ExpenseResponse;
import com.pennypilot.backend.dto.response.ExpenseSummaryResponse;
import com.pennypilot.backend.entity.Expense;
import com.pennypilot.backend.enums.ExpenseCategory;
import com.pennypilot.backend.exception.ResourceNotFoundException;
import com.pennypilot.backend.repository.ExpenseRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public ExpenseResponse createExpense(CreateExpenseRequest request) {
        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setDescription(request.getDescription());

        Expense savedExpense = expenseRepository.save(expense);
        return new ExpenseResponse(savedExpense);
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getAllExpenses(ExpenseCategory category, LocalDate date, LocalDate startDate, LocalDate endDate) {
        Specification<Expense> spec = createSpecification(category, date, startDate, endDate);
        return expenseRepository.findAll(spec).stream()
                .map(ExpenseResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id " + id));
        return new ExpenseResponse(expense);
    }

    public ExpenseResponse updateExpense(Long id, UpdateExpenseRequest request) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id " + id));

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setDescription(request.getDescription());

        Expense updatedExpense = expenseRepository.save(expense);
        return new ExpenseResponse(updatedExpense);
    }

    public void deleteExpense(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id " + id));
        expenseRepository.delete(expense);
    }

    @Transactional(readOnly = true)
    public ExpenseSummaryResponse getExpenseSummary(ExpenseCategory category, LocalDate date, LocalDate startDate, LocalDate endDate) {
        Specification<Expense> spec = createSpecification(category, date, startDate, endDate);
        List<Expense> expenses = expenseRepository.findAll(spec);

        BigDecimal totalAmount = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long count = expenses.size();

        return new ExpenseSummaryResponse(totalAmount, count);
    }

    private Specification<Expense> createSpecification(ExpenseCategory category, LocalDate date, LocalDate startDate, LocalDate endDate) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (category != null) {
                predicates.add(criteriaBuilder.equal(root.get("category"), category));
            }

            if (date != null) {
                predicates.add(criteriaBuilder.equal(root.get("expenseDate"), date));
            }

            if (startDate != null && endDate != null) {
                predicates.add(criteriaBuilder.between(root.get("expenseDate"), startDate, endDate));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
