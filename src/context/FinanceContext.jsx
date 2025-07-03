import React, { createContext, useContext, useReducer, useEffect } from 'react';

const FinanceContext = createContext();

const ACTIONS = {
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  SET_BUDGET: 'SET_BUDGET',
  SET_VIEW_PERIOD: 'SET_VIEW_PERIOD',
  SET_FILTER: 'SET_FILTER'
};

const DEFAULT_CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'],
  expense: ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Education', 'Other Expense']
};

const initialState = {
  transactions: [],
  budget: 0,
  viewPeriod: 'monthly', // 'monthly' or 'weekly'
  filter: {
    category: '',
    type: '', // 'income' or 'expense'
    dateRange: null,
    searchTerm: ''
  },
  categories: DEFAULT_CATEGORIES
};

function financeReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [...state.transactions, { ...action.payload, id: Date.now().toString() }]
      };
    
    case ACTIONS.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction.id === action.payload.id ? action.payload : transaction
        )
      };
    
    case ACTIONS.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload)
      };
    
    case ACTIONS.SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload
      };
    
    case ACTIONS.SET_BUDGET:
      return {
        ...state,
        budget: action.payload
      };
    
    case ACTIONS.SET_VIEW_PERIOD:
      return {
        ...state,
        viewPeriod: action.payload
      };
    
    case ACTIONS.SET_FILTER:
      return {
        ...state,
        filter: { ...state.filter, ...action.payload }
      };
    
    default:
      return state;
  }
}
export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem('financeTrackerData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: ACTIONS.SET_TRANSACTIONS, payload: parsedData.transactions || [] });
        dispatch({ type: ACTIONS.SET_BUDGET, payload: parsedData.budget || 0 });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      transactions: state.transactions,
      budget: state.budget
    };
    localStorage.setItem('financeTrackerData', JSON.stringify(dataToSave));
  }, [state.transactions, state.budget]);

  const addTransaction = (transaction) => {
    dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: transaction });
  };

  const updateTransaction = (transaction) => {
    dispatch({ type: ACTIONS.UPDATE_TRANSACTION, payload: transaction });
  };

  const deleteTransaction = (id) => {
    dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id });
  };

  const setBudget = (budget) => {
    dispatch({ type: ACTIONS.SET_BUDGET, payload: budget });
  };

  const setViewPeriod = (period) => {
    dispatch({ type: ACTIONS.SET_VIEW_PERIOD, payload: period });
  };

  const setFilter = (filterUpdates) => {
    dispatch({ type: ACTIONS.SET_FILTER, payload: filterUpdates });
  };

  const totalIncome = state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const remainingBudget = state.budget - totalExpenses;
  const netBalance = totalIncome - totalExpenses;

  const value = {
    ...state,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setBudget,
    setViewPeriod,
    setFilter,
    totalIncome,
    totalExpenses,
    remainingBudget,
    netBalance
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}

export { ACTIONS };
