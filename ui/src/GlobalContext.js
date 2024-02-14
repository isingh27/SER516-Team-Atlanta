// File: src/contexts/GlobalContext.js
import React, { useContext, useState } from 'react';

const GlobalContext = React.createContext();

const GlobalProvider = ({ children }) => {
  // State Elements - Modify as needed
  const [metricInput, setMetricInput] = useState("");


  // Update functions - Modify as needed

  // Global state object
  const globalState = {
    // State
    metricInput,
    setMetricInput,

    // ... add more variables and functions as needed
  };

  return (
    <GlobalContext.Provider value={globalState}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
