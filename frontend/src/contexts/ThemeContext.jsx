import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [sector, setSector] = useState('hiring'); // 'generic', 'finance', 'healthcare', 'hiring'
  const [laymanMode, setLaymanMode] = useState(false);

  const getTerminology = () => {
    switch(sector) {
      case 'finance':
        return {
          outcome: laymanMode ? 'Approval Rate' : 'Loan Approval Rate',
          positive: 'Approved',
          negative: 'Denied',
          risk: laymanMode ? 'Bias Risk' : 'Credit Risk',
          population: laymanMode ? 'People' : 'Applicants'
        };
      case 'healthcare':
        return {
          outcome: laymanMode ? 'Cleared Rate' : 'Discharge Rate',
          positive: laymanMode ? 'Cleared' : 'Cleared',
          negative: laymanMode ? 'At Risk' : 'At Risk',
          risk: laymanMode ? 'Bias Risk' : 'Complication Risk',
          population: laymanMode ? 'People' : 'Patients'
        };
      case 'hiring':
        return {
          outcome: laymanMode ? 'Hire Rate' : 'Interview Rate',
          positive: laymanMode ? 'Hired' : 'Selected',
          negative: laymanMode ? 'Rejected' : 'Rejected',
          risk: laymanMode ? 'Bias Risk' : 'Attrition Risk',
          population: laymanMode ? 'People' : 'Candidates'
        };
      default: // generic
        return {
          outcome: laymanMode ? 'Selection Rate' : 'Positive Outcome Rate',
          positive: laymanMode ? 'Selected' : 'Positive',
          negative: laymanMode ? 'Rejected' : 'Negative',
          risk: laymanMode ? 'Bias Risk' : 'Prediction Error',
          population: laymanMode ? 'People' : 'Records'
        };
    }
  };

  return (
    <ThemeContext.Provider value={{ sector, setSector, terms: getTerminology(), laymanMode, setLaymanMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
