import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, ShoppingBag, Utensils, Car, Zap, Heart, Film, CircleEllipsis } from 'lucide-react';
import { expenseApi } from '../api/expenseApi';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner, ErrorBanner } from '../components/common/States';
import { ExpenseCard } from '../components/expense/ExpenseCard';
import { Expense } from '../types/expense';

// Safe animated count-up
function useCountUp(targetInput: number | string, duration = 800) {
  const target = Math.max(0, Number(targetInput) || 0);
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!target) {
      setValue(0);
      return;
    }
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return value;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  FOOD: <Utensils className="w-3.5 h-3.5" />,
  TRANSPORT: <Car className="w-3.5 h-3.5" />,
  SHOPPING: <ShoppingBag className="w-3.5 h-3.5" />,
  BILLS: <Zap className="w-3.5 h-3.5" />,
  HEALTH: <Heart className="w-3.5 h-3.5" />,
  ENTERTAINMENT: <Film className="w-3.5 h-3.5" />,
  OTHER: <CircleEllipsis className="w-3.5 h-3.5" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  FOOD: '#84cc16',
  TRANSPORT: '#7c3aed',
  SHOPPING: '#ec4899',
  BILLS: '#06b6d4',
  HEALTH: '#f43f5e',
  ENTERTAINMENT: '#f59e0b',
  OTHER: '#94a3b8',
};

const DonutChart: React.FC<{ expenses: Expense[] }> = ({ expenses }) => {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const R = 64;
  const strokeWidth = 18;

  const totals: Record<string, number> = {};
  expenses.forEach((e) => {
    const num = Number(e.amount) || 0;
    totals[e.category] = (totals[e.category] || 0) + num;
  });

  const grand = Object.values(totals).reduce((a, b) => a + b, 0);
  if (!grand || grand <= 0) {
    return <p className="text-xs text-slate-400 py-8 text-center">No categorized data yet.</p>;
  }

  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const top = entries[0];

  // If only 1 category, draw a single full circle
  const isSingle = entries.length === 1;

  let cumulativeAngle = -90;
  const polarToXY = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const segments = entries.map(([cat, amt]) => {
    const fraction = amt / grand;
    // Cap sweep to 359.99 degrees to avoid SVG arc endpoint collision
    const sweep = Math.min(359.99, fraction * 360);
    const startAngle = cumulativeAngle;
    cumulativeAngle += fraction * 360;
    return { cat, amt, startAngle, sweep, fraction };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative flex-shrink-0">
        <svg width={size} height={size}>
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-white/5"
          />

          {isSingle ? (
            <circle
              cx={cx}
              cy={cy}
              r={R}
              fill="none"
              stroke={CATEGORY_COLORS[top[0]] || '#7c3aed'}
              strokeWidth={strokeWidth}
            />
          ) : (
            segments.map(({ cat, startAngle, sweep }) => {
              const start = polarToXY(startAngle, R);
              const end = polarToXY(startAngle + sweep, R);
              const largeArc = sweep > 180 ? 1 : 0;
              const d = `M ${start.x} ${start.y} A ${R} ${R} 0 ${largeArc} 1 ${end.x} ${end.y}`;
              return (
                <path
                  key={cat}
                  d={d}
                  fill="none"
                  stroke={CATEGORY_COLORS[cat] || '#94a3b8'}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
              );
            })
          )}

          <text
            x={cx}
            y={cy - 5}
            textAnchor="middle"
            className="fill-slate-400 dark:fill-slate-500 font-sans text-[10px] font-medium"
          >
            Top Spend
          </text>
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            className="fill-brand-600 dark:fill-brand-400 font-heading text-xs font-bold"
          >
            {top ? top[0] : '—'}
          </text>
        </svg>
      </div>

      {/* Legend list */}
      <div className="flex flex-col gap-2 w-full">
        {entries.slice(0, 5).map(([cat, amt]) => (
          <div key={cat} className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: CATEGORY_COLORS[cat] || '#94a3b8' }}
              />
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium truncate">
                {CATEGORY_ICONS[cat]} {cat}
              </span>
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 flex-shrink-0">
              ₹{Number(amt).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    error: summaryError,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ['expenseSummary'],
    queryFn: () => expenseApi.getExpenseSummary(),
  });

  const {
    data: expenses,
    isLoading: isExpensesLoading,
    isError: isExpensesError,
    error: expensesError,
    refetch: refetchExpenses,
  } = useQuery({
    queryKey: ['recentExpenses'],
    queryFn: () => expenseApi.getExpenses(),
    select: (data) => data.slice(0, 6),
  });

  const rawTotal = Number(summary?.totalAmount) || 0;
  const count = Number(summary?.expenseCount) || 0;
  const avgPerTx = count > 0 ? rawTotal / count : 0;
  const animatedTotal = useCountUp(rawTotal);

  const handleRetry = () => {
    refetchSummary();
    refetchExpenses();
  };

  if (isSummaryLoading || isExpensesLoading) return <LoadingSpinner />;
  if (isSummaryError || isExpensesError) {
    const errorMsg =
      (summaryError as any)?.message ||
      (expensesError as any)?.message ||
      'Failed to connect to the backend server.';
    return <ErrorBanner message={errorMsg} onRetry={handleRetry} />;
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(val) || 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Hero Balance Card ── */}
      <Card glass="lg" className="p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Total Outflow
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
              {formatCurrency(animatedTotal)}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {count} transaction{count !== 1 ? 's' : ''} logged
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/expenses/add')}
            leftIcon={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Add Expense
          </Button>
        </div>
      </Card>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 gap-4">
        <Card glass="sm" className="p-4 space-y-1">
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Total Entries
          </p>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">{count}</p>
        </Card>
        <Card glass="sm" className="p-4 space-y-1">
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Avg / Transaction
          </p>
          <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
            {formatCurrency(avgPerTx)}
          </p>
        </Card>
      </div>

      {/* ── Spending Breakdown Chart ── */}
      {expenses && expenses.length > 0 && (
        <Card glass="md" className="p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">
            Spending Breakdown
          </h3>
          <DonutChart expenses={expenses} />
        </Card>
      )}

      {/* ── Recent Transactions ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Recent Transactions
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/expenses')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs text-slate-500 dark:text-slate-400"
          >
            View All
          </Button>
        </div>

        {expenses && expenses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {expenses.map((exp) => (
              <ExpenseCard
                key={exp.id}
                expense={exp}
                onEdit={(id) => navigate(`/expenses/edit/${id}`)}
                onDelete={() => {
                  refetchExpenses();
                  refetchSummary();
                }}
              />
            ))}
          </div>
        ) : (
          <Card glass="sm" className="p-8 text-center border border-dashed border-slate-200 dark:border-white/8">
            <p className="text-sm text-slate-400">No expenses recorded yet. Click Add Expense to start.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
export default DashboardPage;
