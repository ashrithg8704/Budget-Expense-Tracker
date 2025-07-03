import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';
import { Calendar, CalendarDays } from 'lucide-react';

function ViewToggle() {
  const { viewPeriod, setViewPeriod } = useFinance();
  const { showInfo } = useToast();

  const handleViewChange = (period) => {
    setViewPeriod(period);
    showInfo(`View changed to ${period} period`);
  };

  return (
    <div className="view-toggle">
      <div className="toggle-label">
        <Calendar size={16} />
        <span>View Period:</span>
      </div>
      
      <div className="toggle-buttons">
        <button
          className={`toggle-btn ${viewPeriod === 'weekly' ? 'active' : ''}`}
          onClick={() => handleViewChange('weekly')}
        >
          <CalendarDays size={16} />
          Weekly
        </button>
        
        <button
          className={`toggle-btn ${viewPeriod === 'monthly' ? 'active' : ''}`}
          onClick={() => handleViewChange('monthly')}
        >
          <Calendar size={16} />
          Monthly
        </button>
      </div>
    </div>
  );
}

export default ViewToggle;
