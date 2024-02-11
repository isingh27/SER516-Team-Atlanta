import './App.css';
import UserCredentials from './Components/UserCredentials';
import ProjectSlugInput from './Components/ProjectSlugInput';
import {
  BrowserRouter as Router,
  Routes, 
  Route,
} from "react-router-dom";
import MetricInput from './Components/MetricInput';
import { GlobalProvider } from './GlobalContext';

function App() {
  return (
    <GlobalProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <Routes> 
              <Route exact path="/" element={<UserCredentials />} /> 
              <Route path="/project-slug" element={<ProjectSlugInput />} /> 
              <Route path="/metric-input" element={<MetricInput />} /> 
            </Routes>
          </header>
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;
