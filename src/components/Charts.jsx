import React, { useMemo, useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { BarChart3, PieChart, TrendingUp, TrendingDown, DollarSign, Target, Calendar, Activity, Award, AlertCircle } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Charts() {
  const { transactions, budget, totalIncome, totalExpenses } = useFinance();
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 500);
    return () => clearTimeout(timer);
  }, []);


  const filteredTransactions = useMemo(() => {
    if (selectedPeriod === 'all') return transactions;

    const now = new Date();
    const filterDate = new Date();

    switch (selectedPeriod) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        filterDate.setMonth(now.getMonth() - 6);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return transactions;
    }

    return transactions.filter(t => new Date(t.date) >= filterDate);
  }, [transactions, selectedPeriod]);

  const analyticsData = useMemo(() => {
    const expensesByCategory = {};
    const incomeByCategory = {};
    const monthlyData = {};
    const dailySpending = {};

    filteredTransactions.forEach(transaction => {
      const month = new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const day = transaction.date;

      if (transaction.type === 'expense') {
        expensesByCategory[transaction.category] =
          (expensesByCategory[transaction.category] || 0) + transaction.amount;
        dailySpending[day] = (dailySpending[day] || 0) + transaction.amount;
      } else {
        incomeByCategory[transaction.category] =
          (incomeByCategory[transaction.category] || 0) + transaction.amount;
      }

      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }
      monthlyData[month][transaction.type === 'income' ? 'income' : 'expenses'] += transaction.amount;
    });

    const periodIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const periodExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const avgDailySpending = Object.values(dailySpending).length > 0
      ? Object.values(dailySpending).reduce((a, b) => a + b, 0) / Object.values(dailySpending).length
      : 0;

    const topExpenseCategory = Object.entries(expensesByCategory)
      .sort(([,a], [,b]) => b - a)[0];

    const topIncomeCategory = Object.entries(incomeByCategory)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      expensesByCategory,
      incomeByCategory,
      monthlyData,
      periodIncome,
      periodExpenses,
      avgDailySpending,
      topExpenseCategory,
      topIncomeCategory,
      savingsRate: periodIncome > 0 ? ((periodIncome - periodExpenses) / periodIncome * 100) : 0
    };
  }, [filteredTransactions]);

  const expensePieData = useMemo(() => {
    const { expensesByCategory } = analyticsData;
    const categories = Object.keys(expensesByCategory);
    const amounts = Object.values(expensesByCategory);

    const colors = [
      '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
      '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
      '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'
    ];

    return {
      labels: categories,
      datasets: [
        {
          data: amounts,
          backgroundColor: colors.slice(0, categories.length),
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverBorderWidth: 4,
          hoverOffset: 8,
        },
      ],
    };
  }, [analyticsData]);

  const comparisonBarData = useMemo(() => {
    const { expensesByCategory, incomeByCategory } = analyticsData;

    const allCategories = new Set([
      ...Object.keys(expensesByCategory),
      ...Object.keys(incomeByCategory)
    ]);

    const categories = Array.from(allCategories);
    const expenseAmounts = categories.map(cat => expensesByCategory[cat] || 0);
    const incomeAmounts = categories.map(cat => incomeByCategory[cat] || 0);

    return {
      labels: categories,
      datasets: [
        {
          label: 'Income',
          data: incomeAmounts,
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: '#10b981',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: 'Expenses',
          data: expenseAmounts,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: '#ef4444',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };
  }, [analyticsData]);

  const monthlyTrendData = useMemo(() => {
    const { monthlyData } = analyticsData;
    const months = Object.keys(monthlyData).sort();

    return {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: months.map(month => monthlyData[month].income),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Expenses',
          data: months.map(month => monthlyData[month].expenses),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [analyticsData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || context.raw;
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      }
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0);
          }
        }
      }
    }
  };

  const pieChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  const hasExpenses = Object.keys(analyticsData.expensesByCategory).length > 0;
  const hasTransactions = filteredTransactions.length > 0;

  if (!hasTransactions) {
    return (
      <div className="analytics-container">
        <div className="analytics-header">
          <div className="header-content">
            <div className="header-icon">
              <BarChart3 size={28} />
            </div>
            <div className="header-text">
              <h2>Financial Analytics</h2>
              <p>Comprehensive insights into your financial patterns</p>
            </div>
          </div>
        </div>

        <div className="no-data-analytics">
          <div className="no-data-icon">
            <AlertCircle size={64} />
          </div>
          <h3>No Data Available</h3>
          <p>Start adding transactions to see detailed analytics and insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      {/* Enhanced Header */}
      <div className="analytics-header animate-fade-in">
        <div className="header-content">
          <div className="header-icon">
            <BarChart3 size={28} />
          </div>
          <div className="header-text">
            <h2>Financial Analytics</h2>
            <p>Comprehensive insights into your financial patterns</p>
          </div>
        </div>

        <div className="period-filter">
          <label>Time Period:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      <div className="metrics-cards animate-slide-up">
        <div className="metric-card income" style={{ animationDelay: '0.1s' }}>
          <div className="metric-icon">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <h3>Total Income</h3>
            <div className="metric-value">${analyticsData.periodIncome.toFixed(2)}</div>
            <div className="metric-subtitle">
              {Object.keys(analyticsData.incomeByCategory).length} sources
            </div>
          </div>
        </div>

        <div className="metric-card expense" style={{ animationDelay: '0.2s' }}>
          <div className="metric-icon">
            <TrendingDown size={24} />
          </div>
          <div className="metric-content">
            <h3>Total Expenses</h3>
            <div className="metric-value">${analyticsData.periodExpenses.toFixed(2)}</div>
            <div className="metric-subtitle">
              {Object.keys(analyticsData.expensesByCategory).length} categories
            </div>
          </div>
        </div>

        <div className="metric-card savings" style={{ animationDelay: '0.3s' }}>
          <div className="metric-icon">
            <Target size={24} />
          </div>
          <div className="metric-content">
            <h3>Savings Rate</h3>
            <div className="metric-value">{analyticsData.savingsRate.toFixed(1)}%</div>
            <div className="metric-subtitle">
              ${(analyticsData.periodIncome - analyticsData.periodExpenses).toFixed(2)} saved
            </div>
          </div>
        </div>

        <div className="metric-card average" style={{ animationDelay: '0.4s' }}>
          <div className="metric-icon">
            <Activity size={24} />
          </div>
          <div className="metric-content">
            <h3>Daily Average</h3>
            <div className="metric-value">${analyticsData.avgDailySpending.toFixed(2)}</div>
            <div className="metric-subtitle">spending per day</div>
          </div>
        </div>
      </div>

      <div className="charts-grid animate-fade-in" style={{ animationDelay: '0.5s' }}>
        {hasExpenses && (
          <div className="chart-container">
            <div className="chart-header">
              <PieChart size={20} />
              <h4>Expense Distribution</h4>
              <div className="chart-info">
                {Object.keys(analyticsData.expensesByCategory).length} categories
              </div>
            </div>
            <div className="chart-wrapper">
              <Doughnut data={expensePieData} options={pieChartOptions} />
            </div>
          </div>
        )}

        <div className="chart-container">
          <div className="chart-header">
            <BarChart3 size={20} />
            <h4>Income vs Expenses</h4>
            <div className="chart-info">by category</div>
          </div>
          <div className="chart-wrapper">
            <Bar data={comparisonBarData} options={barChartOptions} />
          </div>
        </div>
      </div>

      <div className="insights-section animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="section-header">
          <Award size={20} />
          <h3>Financial Insights</h3>
        </div>

        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-header">
              <TrendingDown size={18} />
              <h4>Top Expense Category</h4>
            </div>
            <div className="insight-content">
              {analyticsData.topExpenseCategory ? (
                <>
                  <div className="insight-value">{analyticsData.topExpenseCategory[0]}</div>
                  <div className="insight-amount">${analyticsData.topExpenseCategory[1].toFixed(2)}</div>
                  <div className="insight-percentage">
                    {((analyticsData.topExpenseCategory[1] / analyticsData.periodExpenses) * 100).toFixed(1)}% of total expenses
                  </div>
                </>
              ) : (
                <div className="insight-placeholder">No expenses recorded</div>
              )}
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-header">
              <TrendingUp size={18} />
              <h4>Top Income Source</h4>
            </div>
            <div className="insight-content">
              {analyticsData.topIncomeCategory ? (
                <>
                  <div className="insight-value">{analyticsData.topIncomeCategory[0]}</div>
                  <div className="insight-amount">${analyticsData.topIncomeCategory[1].toFixed(2)}</div>
                  <div className="insight-percentage">
                    {((analyticsData.topIncomeCategory[1] / analyticsData.periodIncome) * 100).toFixed(1)}% of total income
                  </div>
                </>
              ) : (
                <div className="insight-placeholder">No income recorded</div>
              )}
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-header">
              <Target size={18} />
              <h4>Financial Health</h4>
            </div>
            <div className="insight-content">
              <div className="insight-value">
                {analyticsData.savingsRate >= 20 ? 'Excellent' :
                 analyticsData.savingsRate >= 10 ? 'Good' :
                 analyticsData.savingsRate >= 0 ? 'Fair' : 'Needs Attention'}
              </div>
              <div className="insight-amount">{analyticsData.savingsRate.toFixed(1)}% savings rate</div>
              <div className="insight-percentage">
                {analyticsData.savingsRate >= 20 ? 'Great job saving!' :
                 analyticsData.savingsRate >= 10 ? 'Consider saving more' :
                 analyticsData.savingsRate >= 0 ? 'Try to save 10% minimum' : 'Review your expenses'}
              </div>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-header">
              <Calendar size={18} />
              <h4>Transaction Activity</h4>
            </div>
            <div className="insight-content">
              <div className="insight-value">{filteredTransactions.length} Transactions</div>
              <div className="insight-amount">
                {selectedPeriod === 'all' ? 'All time' : `Last ${selectedPeriod}`}
              </div>
              <div className="insight-percentage">
                {(filteredTransactions.length / (selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365)).toFixed(1)} per day average
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Charts;
