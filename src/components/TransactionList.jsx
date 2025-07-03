import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';
import { Edit3, Trash2, Search, Filter, Calendar, TrendingUp, TrendingDown, X, CheckCircle, AlertCircle, BarChart3, SlidersHorizontal } from 'lucide-react';
import { format, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

function TransactionList({ onEditTransaction }) {
  const {
    transactions,
    deleteTransaction,
    filter,
    setFilter,
    viewPeriod,
    categories
  } = useFinance();
  const { showSuccess, showError } = useToast();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (filter.searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(filter.searchTerm.toLowerCase())
      );
    }

    if (filter.category) {
      filtered = filtered.filter(transaction => transaction.category === filter.category);
    }

    if (filter.type) {
      filtered = filtered.filter(transaction => transaction.type === filter.type);
    }

    const now = new Date();
    let dateRange;

    if (viewPeriod === 'weekly') {
      dateRange = {
        start: startOfWeek(now),
        end: endOfWeek(now)
      };
    } else if (viewPeriod === 'monthly') {
      dateRange = {
        start: startOfMonth(now),
        end: endOfMonth(now)
      };
    }

    if (dateRange) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return isWithinInterval(transactionDate, dateRange);
      });
    }

    if (filter.dateRange && filter.dateRange.start && filter.dateRange.end) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return isWithinInterval(transactionDate, {
          start: new Date(filter.dateRange.start),
          end: new Date(filter.dateRange.end)
        });
      });
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, filter, viewPeriod]);

  const handleDeleteClick = (id) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = (id) => {
    try {
      const transaction = transactions.find(t => t.id === id);
      deleteTransaction(id);
      setShowDeleteConfirm(null);

      if (transaction) {
        showSuccess(`Transaction deleted: ${transaction.description} (${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)})`);
      } else {
        showSuccess('Transaction deleted successfully');
      }
    } catch (error) {
      showError('Failed to delete transaction. Please try again.');
      console.error('Delete transaction error:', error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilter({ [filterType]: value });
  };

  const clearFilters = () => {
    setFilter({
      category: '',
      type: '',
      dateRange: null,
      searchTerm: ''
    });
    showInfo('All filters cleared');
  };

  const allCategories = [...categories.income, ...categories.expense];

  return (
    <div className="transaction-list-container">
      <div className="transaction-list">
        {/* Header Section */}
        <div className="list-header">
          <div className="header-content">
            <div className="header-icon">
              <BarChart3 size={24} />
            </div>
            <div className="header-text">
              <h2>Transaction History</h2>
              <p>Manage and review your financial transactions</p>
            </div>
          </div>
          <div className="transaction-stats">
            <div className="stat-item">
              <span className="stat-number">{filteredTransactions.length}</span>
              <span className="stat-label">Transaction{filteredTransactions.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        <div className="filters-section">
          <div className="filters-header">
            <div className="filters-title">
              <SlidersHorizontal size={18} />
              <h3>Filters & Search</h3>
            </div>
            <button onClick={clearFilters} className="clear-filters-btn">
              <X size={16} />
              Clear All
            </button>
          </div>

          <div className="filters-content">
            {/* Search Bar */}
            <div className="search-container">
              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search by description or category..."
                  value={filter.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                />
              </div>
            </div>

            <div className="filter-controls">
              <div className="filter-group">
                <label>Transaction Type</label>
                <div className="type-filter-buttons">
                  <button
                    className={`type-filter-btn ${filter.type === '' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('type', '')}
                  >
                    All Types
                  </button>
                  <button
                    className={`type-filter-btn income ${filter.type === 'income' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('type', 'income')}
                  >
                    <TrendingUp size={16} />
                    Income
                  </button>
                  <button
                    className={`type-filter-btn expense ${filter.type === 'expense' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('type', 'expense')}
                  >
                    <TrendingDown size={16} />
                    Expense
                  </button>
                </div>
              </div>

              <div className="filter-group">
                <label>Category</label>
                <select
                  value={filter.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="category-select"
                >
                  <option value="">All Categories</option>
                  {allCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Date Range</label>
                <div className="date-range-inputs">
                  <input
                    type="date"
                    placeholder="Start date"
                    value={filter.dateRange?.start || ''}
                    onChange={(e) => handleFilterChange('dateRange', {
                      ...filter.dateRange,
                      start: e.target.value
                    })}
                  />
                  <span className="date-separator">to</span>
                  <input
                    type="date"
                    placeholder="End date"
                    value={filter.dateRange?.end || ''}
                    onChange={(e) => handleFilterChange('dateRange', {
                      ...filter.dateRange,
                      end: e.target.value
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="transactions-section">
          {filteredTransactions.length === 0 ? (
            <div className="no-transactions">
              <div className="no-transactions-icon">
                <AlertCircle size={48} />
              </div>
              <h3>No transactions found</h3>
              <p>
                {(filter.searchTerm || filter.category || filter.type || filter.dateRange)
                  ? 'Try adjusting your filters to see more results'
                  : 'Start by adding your first transaction'
                }
              </p>
              {(filter.searchTerm || filter.category || filter.type || filter.dateRange) && (
                <button onClick={clearFilters} className="clear-filters-action">
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="transactions-grid">
              {filteredTransactions.map(transaction => (
                <div key={transaction.id} className={`transaction-card ${transaction.type}`}>
                  <div className="transaction-header">
                    <div className="transaction-type-icon">
                      {transaction.type === 'income' ?
                        <TrendingUp size={20} /> :
                        <TrendingDown size={20} />
                      }
                    </div>
                    <div className="transaction-amount">
                      <span className={`amount ${transaction.type}`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="transaction-actions">
                      <button
                        onClick={() => onEditTransaction(transaction)}
                        className="action-btn edit-btn"
                        title="Edit transaction"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(transaction.id)}
                        className="action-btn delete-btn"
                        title="Delete transaction"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="transaction-body">
                    <h4 className="transaction-description">{transaction.description}</h4>
                    <div className="transaction-meta">
                      <span className="transaction-category">
                        <span className="category-dot"></span>
                        {transaction.category}
                      </span>
                      <span className="transaction-date">
                        <Calendar size={14} />
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>

                  {showDeleteConfirm === transaction.id && (
                    <div className="delete-confirmation-overlay">
                      <div className="delete-confirmation">
                        <div className="confirmation-icon">
                          <AlertCircle size={24} />
                        </div>
                        <h4>Delete Transaction?</h4>
                        <p>This action cannot be undone.</p>
                        <div className="confirmation-actions">
                          <button
                            onClick={() => confirmDelete(transaction.id)}
                            className="confirm-delete-btn"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="cancel-delete-btn"
                          >
                            <X size={16} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionList;
