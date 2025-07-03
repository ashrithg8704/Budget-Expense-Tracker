import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('Personal Finance Tracker', () => {
  it('renders the main application', () => {
    render(<App />);
    
    // Check if the main title is present
    expect(screen.getByText('Personal Finance Tracker')).toBeInTheDocument();
    
    // Check if navigation tabs are present
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Add Transaction')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('displays budget overview by default', () => {
    render(<App />);
    
    // Check if budget overview elements are present
    expect(screen.getByText('Budget Overview')).toBeInTheDocument();
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('Net Balance')).toBeInTheDocument();
  });
});
