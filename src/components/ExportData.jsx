import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';
import { Download, FileText, Database, BarChart3, Calendar, TrendingUp, CheckCircle, Clock, Users, Shield } from 'lucide-react';
import { format } from 'date-fns';

function ExportData() {
  const { transactions, totalIncome, totalExpenses, budget } = useFinance();
  const { showSuccess, showError } = useToast();
  const [exportStats, setExportStats] = useState({
    totalExports: 0,
    lastExport: null
  });

  useEffect(() => {
    // Load export statistics from localStorage
    const stats = localStorage.getItem('exportStats');
    if (stats) {
      setExportStats(JSON.parse(stats));
    }
  }, []);

  const updateExportStats = () => {
    const newStats = {
      totalExports: exportStats.totalExports + 1,
      lastExport: new Date().toISOString()
    };
    setExportStats(newStats);
    localStorage.setItem('exportStats', JSON.stringify(newStats));
  };

  const exportInsights = {
    dataSize: transactions.length,
    dateRange: transactions.length > 0 ? {
      start: format(new Date(Math.min(...transactions.map(t => new Date(t.date)))), 'MMM dd, yyyy'),
      end: format(new Date(Math.max(...transactions.map(t => new Date(t.date)))), 'MMM dd, yyyy')
    } : null,
    categories: [...new Set(transactions.map(t => t.category))].length,
    avgTransactionValue: transactions.length > 0 ?
      transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length : 0
  };

  const exportToCSV = () => {
    if (transactions.length === 0) {
      showError('No transactions to export');
      return;
    }

    try {
      const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      const fileName = `Personal-Finance-Transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;

      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const netBalance = totalIncome - totalExpenses;

      const csvContent = [
        ['PERSONAL FINANCE TRACKER - TRANSACTION REPORT'],
        [''],
        ['Report Generated:', currentDate],
        ['Total Transactions:', transactions.length],
        ['Date Range:', `${format(new Date(Math.min(...transactions.map(t => new Date(t.date)))), 'MMM dd, yyyy')} to ${format(new Date(Math.max(...transactions.map(t => new Date(t.date)))), 'MMM dd, yyyy')}`],
        [''],
        ['FINANCIAL SUMMARY'],
        ['Total Income:', `$${totalIncome.toFixed(2)}`],
        ['Total Expenses:', `$${totalExpenses.toFixed(2)}`],
        ['Net Balance:', `$${netBalance.toFixed(2)}`],
        [''],
        [''],
        ['TRANSACTION DETAILS'],
        ['Date', 'Day of Week', 'Type', 'Category', 'Description', 'Amount', 'Running Balance'],
        [''],
      ];

      const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

      let runningBalance = 0;
      const transactionRows = sortedTransactions.map(transaction => {
        const transactionDate = new Date(transaction.date);
        const dayOfWeek = format(transactionDate, 'EEEE');
        const formattedDate = format(transactionDate, 'MMM dd, yyyy');

        if (transaction.type === 'income') {
          runningBalance += transaction.amount;
        } else {
          runningBalance -= transaction.amount;
        }

        return [
          formattedDate,
          dayOfWeek,
          transaction.type.toUpperCase(),
          transaction.category,
          `"${transaction.description.replace(/"/g, '""')}"`,
          `${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}`,
          `$${runningBalance.toFixed(2)}`
        ];
      });

      const finalContent = [...csvContent, ...transactionRows]
        .map(row => row.join(','))
        .join('\n');

      const blob = new Blob([finalContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        updateExportStats();
        showSuccess(`Professional transaction report exported! Downloaded as ${fileName}`);
      }
    } catch (error) {
      showError('Failed to export transaction data. Please try again.');
      console.error('Export error:', error);
    }
  };

  const exportSummaryToCSV = () => {
    if (transactions.length === 0) {
      showError('No transactions to export');
      return;
    }

    try {
      const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      const fileName = `Personal-Finance-Summary-Report-${format(new Date(), 'yyyy-MM-dd')}.csv`;

      const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const netBalance = totalIncome - totalExpenses;

      const dates = transactions.map(t => new Date(t.date));
      const startDate = format(new Date(Math.min(...dates)), 'MMM dd, yyyy');
      const endDate = format(new Date(Math.max(...dates)), 'MMM dd, yyyy');

      const incomeByCategory = {};
      const expensesByCategory = {};

      transactions.forEach(transaction => {
        if (transaction.type === 'income') {
          incomeByCategory[transaction.category] = (incomeByCategory[transaction.category] || 0) + transaction.amount;
        } else {
          expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
        }
      });

      const avgIncome = totalIncome / Object.keys(incomeByCategory).length || 0;
      const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100) : 0;

      const topIncomeCategory = Object.entries(incomeByCategory).sort(([,a], [,b]) => b - a)[0];
      const topExpenseCategory = Object.entries(expensesByCategory).sort(([,a], [,b]) => b - a)[0];

      const summaryData = [
        ['PERSONAL FINANCE TRACKER - COMPREHENSIVE SUMMARY REPORT'],
        [''],
        ['Report Details'],
        ['Generated On:', currentDate],
        ['Report Period:', `${startDate} to ${endDate}`],
        ['Total Transactions:', transactions.length],
        [''],
        [''],

        ['FINANCIAL OVERVIEW'],
        ['Metric', 'Amount', 'Percentage'],
        ['Total Income', `$${totalIncome.toFixed(2)}`, '100.00%'],
        ['Total Expenses', `$${totalExpenses.toFixed(2)}`, `${totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(2) : '0.00'}%`],
        ['Net Balance', `$${netBalance.toFixed(2)}`, `${totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(2) : '0.00'}%`],
        ['Savings Rate', `${savingsRate.toFixed(2)}%`, savingsRate >= 20 ? 'Excellent' : savingsRate >= 10 ? 'Good' : 'Needs Improvement'],
        [''],
        [''],

        ['INCOME ANALYSIS'],
        ['Category', 'Amount', 'Percentage of Total Income', 'Average per Category'],
        ...Object.entries(incomeByCategory)
          .sort(([,a], [,b]) => b - a)
          .map(([category, amount]) => [
            category,
            `$${amount.toFixed(2)}`,
            `${totalIncome > 0 ? ((amount / totalIncome) * 100).toFixed(2) : '0.00'}%`,
            `$${avgIncome.toFixed(2)}`
          ]),
        [''],
        ['Top Income Source:', topIncomeCategory ? topIncomeCategory[0] : 'N/A', topIncomeCategory ? `$${topIncomeCategory[1].toFixed(2)}` : '$0.00'],
        [''],
        [''],

        ['EXPENSE ANALYSIS'],
        ['Category', 'Amount', 'Percentage of Total Expenses', 'Percentage of Income'],
        ...Object.entries(expensesByCategory)
          .sort(([,a], [,b]) => b - a)
          .map(([category, amount]) => [
            category,
            `$${amount.toFixed(2)}`,
            `${totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(2) : '0.00'}%`,
            `${totalIncome > 0 ? ((amount / totalIncome) * 100).toFixed(2) : '0.00'}%`
          ]),
        [''],
        ['Top Expense Category:', topExpenseCategory ? topExpenseCategory[0] : 'N/A', topExpenseCategory ? `$${topExpenseCategory[1].toFixed(2)}` : '$0.00'],
        [''],
        [''],

        ['FINANCIAL HEALTH INDICATORS'],
        ['Indicator', 'Value', 'Status'],
        ['Income Diversity', `${Object.keys(incomeByCategory).length} sources`, Object.keys(incomeByCategory).length > 1 ? 'Good' : 'Consider diversifying'],
        ['Expense Categories', `${Object.keys(expensesByCategory).length} categories`, ''],
        ['Largest Expense %', topExpenseCategory ? `${((topExpenseCategory[1] / totalIncome) * 100).toFixed(2)}%` : '0%', topExpenseCategory && (topExpenseCategory[1] / totalIncome) > 0.3 ? 'High - Review' : 'Reasonable'],
        ['Monthly Savings Rate', `${savingsRate.toFixed(2)}%`, savingsRate >= 20 ? 'Excellent' : savingsRate >= 10 ? 'Good' : 'Needs Improvement'],
        [''],
        [''],

        ['FINANCIAL RECOMMENDATIONS'],
        ['Area', 'Recommendation'],
        ['Savings', savingsRate < 10 ? 'Increase savings rate to at least 10% of income' : savingsRate < 20 ? 'Consider increasing savings to 20% for better financial security' : 'Excellent savings rate! Keep it up!'],
        ['Expenses', topExpenseCategory && (topExpenseCategory[1] / totalIncome) > 0.3 ? `Review ${topExpenseCategory[0]} expenses - they represent ${((topExpenseCategory[1] / totalIncome) * 100).toFixed(1)}% of income` : 'Expense distribution looks reasonable'],
        ['Income', Object.keys(incomeByCategory).length === 1 ? 'Consider diversifying income sources for better financial stability' : 'Good income diversification'],
        [''],
        [''],

        ['Report generated by Personal Finance Tracker'],
        [`© ${new Date().getFullYear()} - For personal use only`]
      ];

      const csvContent = summaryData
        .map(row => row.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        updateExportStats();
        showSuccess(`Professional summary report exported! Downloaded as ${fileName}`);
      }
    } catch (error) {
      showError('Failed to export summary report. Please try again.');
      console.error('Export summary error:', error);
    }
  };

  return (
    <div className="export-container">
      {/* Enhanced Header */}
      <div className="export-header animate-fade-in">
        <div className="header-content">
          <div className="header-icon">
            <Download size={28} />
          </div>
          <div className="header-text">
            <h2>Data Export Center</h2>
            <p>Professional reports and comprehensive data exports</p>
          </div>
        </div>

        <div className="export-stats-card">
          <div className="stat-item">
            <Clock size={16} />
            <div>
              <span className="stat-label">Last Export</span>
              <span className="stat-value">
                {exportStats.lastExport ?
                  format(new Date(exportStats.lastExport), 'MMM dd, yyyy') :
                  'Never'
                }
              </span>
            </div>
          </div>
          <div className="stat-item">
            <CheckCircle size={16} />
            <div>
              <span className="stat-label">Total Exports</span>
              <span className="stat-value">{exportStats.totalExports}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="data-overview animate-slide-up">
        <div className="overview-card" style={{ animationDelay: '0.1s' }}>
          <div className="overview-icon">
            <Database size={24} />
          </div>
          <div className="overview-content">
            <h3>Available Data</h3>
            <div className="overview-value">{transactions.length}</div>
            <div className="overview-subtitle">transactions ready for export</div>
          </div>
        </div>

        <div className="overview-card" style={{ animationDelay: '0.2s' }}>
          <div className="overview-icon">
            <Calendar size={24} />
          </div>
          <div className="overview-content">
            <h3>Date Range</h3>
            <div className="overview-value">
              {exportInsights.dateRange ?
                `${exportInsights.dateRange.start} - ${exportInsights.dateRange.end}` :
                'No data'
              }
            </div>
            <div className="overview-subtitle">complete transaction history</div>
          </div>
        </div>

        <div className="overview-card" style={{ animationDelay: '0.3s' }}>
          <div className="overview-icon">
            <BarChart3 size={24} />
          </div>
          <div className="overview-content">
            <h3>Categories</h3>
            <div className="overview-value">{exportInsights.categories}</div>
            <div className="overview-subtitle">unique transaction categories</div>
          </div>
        </div>

        <div className="overview-card" style={{ animationDelay: '0.4s' }}>
          <div className="overview-icon">
            <TrendingUp size={24} />
          </div>
          <div className="overview-content">
            <h3>Average Value</h3>
            <div className="overview-value">${exportInsights.avgTransactionValue.toFixed(2)}</div>
            <div className="overview-subtitle">per transaction</div>
          </div>
        </div>
      </div>

      <div className="export-options animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="export-option">
          <div className="export-card">
            <div className="export-icon">
              <FileText size={32} />
            </div>
            <div className="export-content">
              <h3>Professional Transaction Report</h3>
              <p>Comprehensive transaction report with financial summary, running balance, and professional formatting. Perfect for record-keeping and analysis.</p>
              <div className="export-features">
                <span>✓ Running balance tracking</span>
                <span>✓ Professional formatting</span>
                <span>✓ Date intelligence</span>
                <span>✓ Excel compatible</span>
              </div>
            </div>
            <button
              onClick={exportToCSV}
              className="export-action-btn primary"
              disabled={transactions.length === 0}
            >
              <Download size={20} />
              Export Report
            </button>
          </div>
        </div>

        <div className="export-option">
          <div className="export-card">
            <div className="export-icon">
              <BarChart3 size={32} />
            </div>
            <div className="export-content">
              <h3>Executive Summary Report</h3>
              <p>Comprehensive financial analysis with insights, recommendations, and health indicators. Includes category breakdowns and actionable financial advice.</p>
              <div className="export-features">
                <span>✓ Financial insights</span>
                <span>✓ Health indicators</span>
                <span>✓ Recommendations</span>
                <span>✓ Category analysis</span>
              </div>
            </div>
            <button
              onClick={exportSummaryToCSV}
              className="export-action-btn secondary"
              disabled={transactions.length === 0}
            >
              <Download size={20} />
              Export Summary
            </button>
          </div>
        </div>
      </div>

      {transactions.length === 0 && (
        <div className="no-data-export animate-fade-in">
          <div className="no-data-icon">
            <Database size={48} />
          </div>
          <h3>No Data Available</h3>
          <p>Add some transactions to start exporting your financial data</p>
        </div>
      )}

      <div className="security-info animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="security-header">
          <Shield size={20} />
          <h3>Security & Privacy</h3>
        </div>
        <div className="security-features">
          <div className="security-item">
            <CheckCircle size={16} />
            <span>All data stays on your device</span>
          </div>
          <div className="security-item">
            <CheckCircle size={16} />
            <span>No cloud storage or external servers</span>
          </div>
          <div className="security-item">
            <CheckCircle size={16} />
            <span>Professional-grade CSV formatting</span>
          </div>
          <div className="security-item">
            <CheckCircle size={16} />
            <span>Compatible with all major spreadsheet apps</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportData;
