import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [sector, setSector] = useState('generic'); // 'generic', 'finance', 'healthcare', 'hiring'

  const getTerminology = () => {
    switch(sector) {
      case 'finance':
        return {
          outcome: 'Loan Approval Rate',
          positive: 'Approved',
          negative: 'Denied',
          risk: 'Credit Risk',
          population: 'Applicants'
        };
      case 'healthcare':
        return {
          outcome: 'Discharge Rate',
          positive: 'Cleared',
          negative: 'At Risk',
          risk: 'Complication Risk',
          population: 'Patients'
        };
      case 'hiring':
        return {
          outcome: 'Interview Rate',
          positive: 'Selected',
          negative: 'Rejected',
          risk: 'Attrition Risk',
          population: 'Candidates'
        };
      default: // generic
        return {
          outcome: 'Positive Outcome Rate',
          positive: 'Positive',
          negative: 'Negative',
          risk: 'Prediction Error',
          population: 'Records'
        };
    }
  };

  return (
    <ThemeContext.Provider value={{ sector, setSector, terms: getTerminology() }}>
      {children}
    </ThemeContext.Provider>
  );
}
