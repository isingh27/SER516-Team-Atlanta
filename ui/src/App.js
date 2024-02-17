import './App.css';
import React, { useState, useEffect } from 'react';
import UserCredentials from './Components/UserCredentials';
import ProjectSlugInput from './Components/ProjectSlugInput';
import {
  BrowserRouter as Router,
  Routes, 
  Route,
  Navigate, 
  useLocation,
  useNavigate
} from "react-router-dom";
// import MetricInput from './Components/MetricInput';
import NavBar from './Components/NavBar';
import { GlobalProvider } from './GlobalContext';
import Dashboard from './Components/Dashboard';

function App() {

  const ConditionalRoute = ({ component: Component }) => {
    return localStorage.getItem('taigaToken') ? <Component /> : <Navigate to="/" replace />;
  };


  return (
    <GlobalProvider>
      <Router>
        <div className="App">
        <NavBar />
          <header className="App-header">
            <Routes> 
              <Route exact path="/" element={<UserCredentials />} />
              <Route path="/project-slug" element={
                <ConditionalRoute component={ProjectSlugInput} />
              } />
              <Route path="/dashboard" element={
                <ConditionalRoute component={Dashboard} />}
              />
              </Routes>
          </header>
        </div>
      </Router>
    </GlobalProvider>
  );
}
export default App;
