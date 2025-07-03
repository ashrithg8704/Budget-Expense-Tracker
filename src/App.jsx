import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { ToastProvider } from './context/ToastContext';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BudgetCalculator from './components/BudgetCalculator';
import Charts from './components/Charts';
import ExportData from './components/ExportData';
import ViewToggle from './components/ViewToggle';
import ToastContainer from './components/Toast';
import { Wallet, Plus, List, BarChart3, Download } from 'lucide-react';
import './utils/demoData';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setActiveTab('add');
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Wallet },
    { id: 'add', label: 'Add Transaction', icon: Plus },
    { id: 'transactions', label: 'Transactions', icon: List },
    { id: 'charts', label: 'Analytics', icon: BarChart3 },
    { id: 'export', label: 'Export', icon: Download }
  ];

  return (
    <ToastProvider>
      <FinanceProvider>
        <div className="app">
          <header className="app-header">
            <div className="header-content">
              <div className="logo">
                <div className="logo-icon">
                  <Wallet size={28} />
                </div>
                <div className="logo-text">
                  <h1>Personal Finance Tracker</h1>
                  <p>Your complete financial management solution</p>
                </div>
              </div>
              <div className="header-actions">
                <ViewToggle />
              </div>
            </div>
          </header>

          <nav className="app-nav">
            <div className="nav-container">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <div className="nav-icon">
                      <Icon size={20} />
                    </div>
                    <span className="nav-label">{tab.label}</span>
                    {activeTab === tab.id && <div className="nav-indicator"></div>}
                  </button>
                );
              })}
            </div>
          </nav>

          <main className="app-main">
            <div className="page-container">
              {activeTab === 'dashboard' && (
                <div className="page-content dashboard animate-page-enter">
                  <BudgetCalculator />
                </div>
              )}

              {activeTab === 'add' && (
                <div className="page-content add-transaction animate-page-enter">
                  <TransactionForm
                    editingTransaction={editingTransaction}
                    onCancel={handleCancelEdit}
                  />
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="page-content transactions-view animate-page-enter">
                  <TransactionList onEditTransaction={handleEditTransaction} />
                </div>
              )}

              {activeTab === 'charts' && (
                <div className="page-content charts-view animate-page-enter">
                  <Charts />
                </div>
              )}

              {activeTab === 'export' && (
                <div className="page-content export-view animate-page-enter">
                  <ExportData />
                </div>
              )}
            </div>
          </main>
        </div>
        <ToastContainer />
      </FinanceProvider>
    </ToastProvider>
  );
}

export default App;
