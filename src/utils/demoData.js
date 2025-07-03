// Demo data for testing the Personal Finance Tracker
export const demoTransactions = [
  {
    id: "demo-1",
    type: "income",
    amount: 5000,
    category: "Salary",
    description: "Monthly salary",
    date: "2025-07-01",
    timestamp: "2025-07-01T09:00:00.000Z"
  },
  {
    id: "demo-2",
    type: "expense",
    amount: 1200,
    category: "Housing",
    description: "Monthly rent",
    date: "2025-07-01",
    timestamp: "2025-07-01T10:00:00.000Z"
  },
  {
    id: "demo-3",
    type: "expense",
    amount: 300,
    category: "Food",
    description: "Groceries",
    date: "2025-07-02",
    timestamp: "2025-07-02T14:30:00.000Z"
  },
  {
    id: "demo-4",
    type: "expense",
    amount: 150,
    category: "Transportation",
    description: "Gas and parking",
    date: "2025-07-02",
    timestamp: "2025-07-02T16:00:00.000Z"
  },
  {
    id: "demo-5",
    type: "income",
    amount: 800,
    category: "Freelance",
    description: "Web development project",
    date: "2025-07-03",
    timestamp: "2025-07-03T11:00:00.000Z"
  },
  {
    id: "demo-6",
    type: "expense",
    amount: 80,
    category: "Utilities",
    description: "Electricity bill",
    date: "2025-07-03",
    timestamp: "2025-07-03T13:00:00.000Z"
  },
  {
    id: "demo-7",
    type: "expense",
    amount: 45,
    category: "Entertainment",
    description: "Movie tickets",
    date: "2025-06-30",
    timestamp: "2025-06-30T19:00:00.000Z"
  },
  {
    id: "demo-8",
    type: "expense",
    amount: 120,
    category: "Shopping",
    description: "Clothing",
    date: "2025-06-29",
    timestamp: "2025-06-29T15:30:00.000Z"
  },
  {
    id: "demo-9",
    type: "income",
    amount: 200,
    category: "Gift",
    description: "Birthday gift from family",
    date: "2025-06-28",
    timestamp: "2025-06-28T12:00:00.000Z"
  },
  {
    id: "demo-10",
    type: "expense",
    amount: 60,
    category: "Healthcare",
    description: "Pharmacy",
    date: "2025-06-27",
    timestamp: "2025-06-27T10:15:00.000Z"
  }
];

export const demoBudget = 3000;

// Function to load demo data into the application
export const loadDemoData = () => {
  const demoData = {
    transactions: demoTransactions,
    budget: demoBudget
  };
  
  localStorage.setItem('financeTrackerData', JSON.stringify(demoData));
  
  // Reload the page to reflect the changes
  window.location.reload();
};

// Function to clear all data
export const clearAllData = () => {
  localStorage.removeItem('financeTrackerData');
  window.location.reload();
};

// Add demo data loader to window for easy access in browser console
if (typeof window !== 'undefined') {
  window.loadDemoData = () => {
    loadDemoData();
    console.log('✅ Demo data loaded successfully!');
  };

  window.clearAllData = () => {
    clearAllData();
    console.log('🗑️ All data cleared successfully!');
  };

  console.log('Demo data functions available:');
  console.log('- loadDemoData(): Load sample transactions and budget');
  console.log('- clearAllData(): Clear all saved data');
}
