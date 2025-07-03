import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';
import { Plus, Edit3, X, DollarSign, Calendar, Tag, FileText, TrendingUp, TrendingDown, Save, RotateCcw } from 'lucide-react';

function TransactionForm({ editingTransaction, onCancel }) {
  const { addTransaction, updateTransaction, categories } = useFinance();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        type: editingTransaction.type,
        amount: editingTransaction.amount.toString(),
        category: editingTransaction.category,
        description: editingTransaction.description,
        date: editingTransaction.date
      });
    }
  }, [editingTransaction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        category: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Please fix the form errors before submitting');
      return;
    }

    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        timestamp: new Date().toISOString()
      };

      if (editingTransaction) {
        updateTransaction({ ...transactionData, id: editingTransaction.id });
        showSuccess(`Transaction updated successfully! ${transactionData.type === 'income' ? '+' : '-'}$${transactionData.amount.toFixed(2)} for ${transactionData.description}`);
      } else {
        addTransaction(transactionData);
        showSuccess(`Transaction added successfully! ${transactionData.type === 'income' ? '+' : '-'}$${transactionData.amount.toFixed(2)} for ${transactionData.description}`);
      }

      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });

      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      showError('Failed to save transaction. Please try again.');
      console.error('Transaction save error:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setErrors({});
    if (onCancel) {
      onCancel();
    }
  };

  const currentCategories = categories[formData.type] || [];

  return (
    <div className="transaction-form-container">
      <div className="transaction-form">
        {/* Header Section */}
        <div className="form-header">
          <div className="header-content">
            <div className="header-icon">
              {editingTransaction ? <Edit3 size={24} /> : <Plus size={24} />}
            </div>
            <div className="header-text">
              <h2>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>
              <p>{editingTransaction ? 'Update your transaction details' : 'Record your income or expense'}</p>
            </div>
          </div>
          {editingTransaction && (
            <button type="button" onClick={handleCancel} className="close-btn">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="type-toggle-section">
          <div className="type-toggle">
            <button
              type="button"
              className={`type-btn ${formData.type === 'income' ? 'active income' : ''}`}
              onClick={() => handleInputChange({ target: { name: 'type', value: 'income' } })}
            >
              <TrendingUp size={20} />
              <span>Income</span>
            </button>
            <button
              type="button"
              className={`type-btn ${formData.type === 'expense' ? 'active expense' : ''}`}
              onClick={() => handleInputChange({ target: { name: 'type', value: 'expense' } })}
            >
              <TrendingDown size={20} />
              <span>Expense</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          {/* Amount Section */}
          <div className="form-section">
            <div className="section-header">
              <DollarSign size={18} />
              <h3>Amount</h3>
            </div>
            <div className="amount-input-container">
              <div className="currency-symbol">$</div>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`amount-input ${errors.amount ? 'error' : ''}`}
              />
            </div>
            {errors.amount && <span className="error-message">{errors.amount}</span>}
          </div>

          <div className="form-row">
            <div className="form-section">
              <div className="section-header">
                <Tag size={18} />
                <h3>Category</h3>
              </div>
              <div className="select-container">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Choose a category</option>
                  {currentCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-section">
              <div className="section-header">
                <FileText size={18} />
                <h3>Description</h3>
              </div>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="What was this for?"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <Calendar size={18} />
              <h3>Date</h3>
            </div>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={errors.date ? 'error' : ''}
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className={`submit-btn ${formData.type}`}>
              <Save size={18} />
              <span>{editingTransaction ? 'Update Transaction' : 'Save Transaction'}</span>
            </button>

            {editingTransaction ? (
              <button type="button" onClick={handleCancel} className="secondary-btn">
                <X size={18} />
                <span>Cancel</span>
              </button>
            ) : (
              <button type="button" onClick={() => {
                setFormData({
                  type: 'expense',
                  amount: '',
                  category: '',
                  description: '',
                  date: new Date().toISOString().split('T')[0]
                });
                setErrors({});
              }} className="secondary-btn">
                <RotateCcw size={18} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </form>

        <div className="form-tips">
          <h4>💡 Quick Tips</h4>
          <ul>
            <li>Use descriptive names to easily identify transactions later</li>
            <li>Choose the most specific category for better insights</li>
            <li>Set the correct date for accurate financial tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TransactionForm;
