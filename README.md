# Personal Finance Tracker

A comprehensive React-based personal finance tracker to manage income and expenses with advanced features for budgeting, analytics, and data export.

## 🚀 Features

### Core Functionality
- **Add Income/Expense Entries**: Easy-to-use form with category selection and validation
- **Transaction Management**: View, edit, and delete transactions with confirmation dialogs
- **Category Organization**: Pre-defined categories for both income and expenses
- **Budget Tracking**: Set monthly budgets and track spending progress
- **Data Persistence**: Automatic saving to browser's local storage

### Advanced Features
- **Filterable Transaction List**: Search by description, filter by category, type, and date range
- **Data Visualization**: Interactive charts showing spending by category and income vs expenses
- **Budget Calculator**: Real-time calculation of remaining budget, net balance, and spending progress
- **CSV Export**: Export transaction details and summary reports
- **Monthly/Weekly Views**: Toggle between different time periods for transaction filtering
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Analytics & Insights
- **Spending Analysis**: Pie charts and bar charts for visual spending breakdown
- **Budget Progress**: Visual progress bars with status indicators
- **Category Summaries**: Detailed breakdown of spending by category
- **Smart Tips**: Contextual budget advice based on spending patterns

## 🛠️ Technology Stack

- **Frontend**: React 18 with Hooks and Context API
- **Build Tool**: Vite for fast development and building
- **Charts**: Chart.js with react-chartjs-2 for data visualization
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation and formatting
- **Styling**: Custom CSS with responsive design
- **State Management**: React Context with useReducer for complex state logic

## 📦 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## 🎯 Usage Guide

### Getting Started
1. **Set Your Budget**: Click on the budget card in the dashboard to set your monthly budget
2. **Add Transactions**: Use the "Add Transaction" tab to record income and expenses
3. **View Analytics**: Check the "Analytics" tab for visual spending insights
4. **Export Data**: Use the "Export" tab to download your financial data

### Dashboard Overview
- **Total Income**: Sum of all income transactions
- **Total Expenses**: Sum of all expense transactions
- **Net Balance**: Income minus expenses
- **Budget Progress**: Visual indicator of budget utilization

### Transaction Management
- **Add**: Fill out the form with type, amount, category, description, and date
- **Edit**: Click the edit icon on any transaction to modify it
- **Delete**: Click the delete icon and confirm to remove a transaction
- **Filter**: Use search, category filters, and date ranges to find specific transactions

### Data Export
- **Transaction Details**: Export all transaction data as CSV
- **Summary Report**: Export aggregated data with category breakdowns

## 🏗️ Project Structure

```
src/
├── components/
│   ├── TransactionForm.jsx      # Form for adding/editing transactions
│   ├── TransactionList.jsx      # Filterable list of transactions
│   ├── BudgetCalculator.jsx     # Budget overview and progress
│   ├── Charts.jsx               # Data visualization components
│   ├── ExportData.jsx           # CSV export functionality
│   └── ViewToggle.jsx           # Monthly/weekly view toggle
├── context/
│   └── FinanceContext.jsx       # Global state management
├── App.jsx                      # Main application component
├── App.css                      # Application styles
└── main.jsx                     # Application entry point
```

## 🎨 Design Features

### User Experience
- **Intuitive Navigation**: Tab-based interface for easy access to features
- **Visual Feedback**: Color-coded transactions, progress bars, and status indicators
- **Responsive Layout**: Adapts to different screen sizes and devices
- **Accessibility**: Proper labeling and keyboard navigation support

### Data Visualization
- **Pie Charts**: Expense breakdown by category
- **Bar Charts**: Income vs expenses comparison
- **Progress Bars**: Budget utilization with color-coded status
- **Summary Statistics**: Key metrics and insights

## 💾 Data Management

### Local Storage
- Transactions and budget data are automatically saved to browser's local storage
- Data persists between browser sessions
- No server required for basic functionality

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Dependencies
- `react` & `react-dom` - Core React libraries
- `chart.js` & `react-chartjs-2` - Chart visualization
- `date-fns` - Date manipulation utilities
- `lucide-react` - Icon library
- `vite` - Build tool and dev server

Built with ❤️ using React and modern web technologies.
