import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';
import { DollarSign, TrendingUp, TrendingDown, Target, Edit3, Check, X, Calendar, PieChart, BarChart3, Activity, Wallet, CreditCard, Banknote } from 'lucide-react';

function BudgetCalculator() {
  const {
    budget,
    setBudget,
    totalIncome,
    totalExpenses,
    remainingBudget,
    netBalance,
    transactions
  } = useFinance();
  const { showSuccess, showError } = useToast();

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budget.toString());
  const [animatedValues, setAnimatedValues] = useState({
    income: 0,
    expenses: 0,
    balance: 0
  });

  // Animate numbers on mount and when values change
  useEffect(() => {
    const animateValue = (start, end, duration, callback) => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOutQuart;
        callback(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    };

    animateValue(animatedValues.income, totalIncome, 1000, (value) => {
      setAnimatedValues(prev => ({ ...prev, income: value }));
    });

    animateValue(animatedValues.expenses, totalExpenses, 1200, (value) => {
      setAnimatedValues(prev => ({ ...prev, expenses: value }));
    });

    animateValue(animatedValues.balance, netBalance, 1400, (value) => {
      setAnimatedValues(prev => ({ ...prev, balance: value }));
    });
  }, [totalIncome, totalExpenses, netBalance]);

  // Calculate additional metrics
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  const thisMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const now = new Date();
    return transactionDate.getMonth() === now.getMonth() &&
           transactionDate.getFullYear() === now.getFullYear();
  });

  const avgDailySpending = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0) / new Date().getDate();

  const topExpenseCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const topCategory = Object.entries(topExpenseCategory)
    .sort(([,a], [,b]) => b - a)[0];

  const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100) : 0;

  const handleBudgetEdit = () => {
    setIsEditingBudget(true);
    setBudgetInput(budget.toString());
  };

  const handleBudgetSave = () => {
    const newBudget = parseFloat(budgetInput);
    if (!isNaN(newBudget) && newBudget >= 0) {
      try {
        setBudget(newBudget);
        setIsEditingBudget(false);
        showSuccess(`Budget updated to $${newBudget.toFixed(2)}`);
      } catch (error) {
        showError('Failed to update budget. Please try again.');
        console.error('Budget update error:', error);
      }
    } else {
      showError('Please enter a valid budget amount');
    }
  };

  const handleBudgetCancel = () => {
    setBudgetInput(budget.toString());
    setIsEditingBudget(false);
  };

  const budgetPercentage = budget > 0 ? (totalExpenses / budget) * 100 : 0;
  const isOverBudget = remainingBudget < 0;

  const getBudgetStatus = () => {
    if (budget === 0) return 'No budget set';
    if (budgetPercentage <= 50) return 'On track';
    if (budgetPercentage <= 80) return 'Caution';
    if (budgetPercentage <= 100) return 'Near limit';
    return 'Over budget';
  };

  const getBudgetStatusColor = () => {
    if (budget === 0) return 'gray';
    if (budgetPercentage <= 50) return 'green';
    if (budgetPercentage <= 80) return 'yellow';
    if (budgetPercentage <= 100) return 'orange';
    return 'red';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <Wallet size={28} />
          <div>
            <h2>Financial Dashboard</h2>
            <p>Your complete financial overview</p>
          </div>
        </div>
        <div className="dashboard-date">
          <Calendar size={16} />
          <span>{new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>
      </div>

      {/* Main Financial Cards */}
      <div className="financial-cards">
        <div className="financial-card income animate-slide-up">
          <div className="card-header">
            <div className="card-icon income">
              <TrendingUp size={24} />
            </div>
            <div className="card-info">
              <h3>Total Income</h3>
              <p>All time earnings</p>
            </div>
          </div>
          <div className="card-amount income">
            ${animatedValues.income.toFixed(2)}
          </div>
          <div className="card-trend positive">
            <TrendingUp size={16} />
            <span>+{thisMonthTransactions.filter(t => t.type === 'income').length} this month</span>
          </div>
        </div>

        <div className="financial-card expenses animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-header">
            <div className="card-icon expense">
              <TrendingDown size={24} />
            </div>
            <div className="card-info">
              <h3>Total Expenses</h3>
              <p>All time spending</p>
            </div>
          </div>
          <div className="card-amount expense">
            ${animatedValues.expenses.toFixed(2)}
          </div>
          <div className="card-trend negative">
            <TrendingDown size={16} />
            <span>{thisMonthTransactions.filter(t => t.type === 'expense').length} transactions this month</span>
          </div>
        </div>

        <div className="financial-card balance animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="card-header">
            <div className="card-icon balance">
              <DollarSign size={24} />
            </div>
            <div className="card-info">
              <h3>Net Balance</h3>
              <p>Income minus expenses</p>
            </div>
          </div>
          <div className={`card-amount ${netBalance >= 0 ? 'positive' : 'negative'}`}>
            ${animatedValues.balance.toFixed(2)}
          </div>
          <div className={`card-trend ${netBalance >= 0 ? 'positive' : 'negative'}`}>
            <Activity size={16} />
            <span>{savingsRate.toFixed(1)}% savings rate</span>
          </div>
        </div>

        <div className="financial-card budget animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="card-header">
            <div className="card-icon budget">
              <Target size={24} />
            </div>
            <div className="card-info">
              <h3>Monthly Budget</h3>
              <p>Spending limit</p>
            </div>
            {!isEditingBudget && (
              <button onClick={handleBudgetEdit} className="edit-budget-btn">
                <Edit3 size={16} />
              </button>
            )}
          </div>

          {isEditingBudget ? (
            <div className="budget-edit">
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="Enter budget"
                step="0.01"
                min="0"
                autoFocus
              />
              <div className="budget-edit-actions">
                <button onClick={handleBudgetSave} className="save-btn">
                  <Check size={16} />
                </button>
                <button onClick={handleBudgetCancel} className="cancel-btn">
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="card-amount">
                ${budget.toFixed(2)}
              </div>
              <div className="card-trend">
                <Banknote size={16} />
                <span>${remainingBudget.toFixed(2)} remaining</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Budget Progress Section */}
      {budget > 0 && (
        <div className="budget-progress-section animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="section-header">
            <BarChart3 size={20} />
            <h3>Budget Progress</h3>
            <span className={`budget-status ${getBudgetStatusColor()}`}>
              {getBudgetStatus()}
            </span>
          </div>

          <div className="progress-container">
            <div className="progress-bar">
              <div
                className={`progress-fill ${getBudgetStatusColor()}`}
                style={{
                  width: `${Math.min(budgetPercentage, 100)}%`,
                  animationDelay: '0.6s'
                }}
              />
              {budgetPercentage > 100 && (
                <div
                  className="progress-overflow"
                  style={{
                    width: `${Math.min(budgetPercentage - 100, 100)}%`,
                    animationDelay: '0.8s'
                  }}
                />
              )}
            </div>

            <div className="progress-details">
              <div className="progress-stat">
                <span className="stat-label">Spent</span>
                <span className="stat-value">${totalExpenses.toFixed(2)} ({budgetPercentage.toFixed(1)}%)</span>
              </div>
              <div className="progress-stat">
                <span className="stat-label">{isOverBudget ? 'Over by' : 'Remaining'}</span>
                <span className={`stat-value ${isOverBudget ? 'negative' : 'positive'}`}>
                  ${Math.abs(remainingBudget).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insights and Analytics */}
      <div className="dashboard-insights animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-header">
              <PieChart size={20} />
              <h4>Top Expense Category</h4>
            </div>
            <div className="insight-content">
              {topCategory ? (
                <>
                  <span className="insight-value">{topCategory[0]}</span>
                  <span className="insight-amount">${topCategory[1].toFixed(2)}</span>
                </>
              ) : (
                <span className="insight-placeholder">No expenses yet</span>
              )}
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-header">
              <Activity size={20} />
              <h4>Daily Average</h4>
            </div>
            <div className="insight-content">
              <span className="insight-value">Spending</span>
              <span className="insight-amount">${(avgDailySpending || 0).toFixed(2)}</span>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-header">
              <CreditCard size={20} />
              <h4>This Month</h4>
            </div>
            <div className="insight-content">
              <span className="insight-value">{thisMonthTransactions.length} Transactions</span>
              <span className="insight-amount">
                ${thisMonthTransactions.reduce((sum, t) =>
                  t.type === 'expense' ? sum + t.amount : sum, 0).toFixed(2)} spent
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentTransactions.length > 0 && (
        <div className="recent-activity animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="section-header">
            <Activity size={20} />
            <h3>Recent Activity</h3>
            <span className="activity-count">{recentTransactions.length} recent</span>
          </div>

          <div className="activity-list">
            {recentTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className={`activity-item ${transaction.type}`}
                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
              >
                <div className="activity-icon">
                  {transaction.type === 'income' ?
                    <TrendingUp size={16} /> :
                    <TrendingDown size={16} />
                  }
                </div>
                <div className="activity-details">
                  <span className="activity-description">{transaction.description}</span>
                  <span className="activity-category">{transaction.category}</span>
                </div>
                <div className={`activity-amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="budget-tips">
        {budget === 0 && (
          <div className="tip">
            💡 Set a monthly budget to track your spending progress
          </div>
        )}
        
        {budget > 0 && budgetPercentage > 80 && budgetPercentage <= 100 && (
          <div className="tip warning">
            ⚠️ You're approaching your budget limit. Consider reducing expenses.
          </div>
        )}
        
        {isOverBudget && (
          <div className="tip danger">
            🚨 You've exceeded your budget! Review your expenses and adjust your spending.
          </div>
        )}
        
        {budget > 0 && budgetPercentage <= 50 && (
          <div className="tip success">
            ✅ Great job! You're well within your budget.
          </div>
        )}
        
        {netBalance < 0 && (
          <div className="tip warning">
            📉 Your expenses exceed your income. Consider increasing income or reducing expenses.
          </div>
        )}
      </div>
    </div>
  );
}

export default BudgetCalculator;
