import './App.css';
import UserCredentials from './Components/UserCredentials';
import ProjectSlugInput from './Components/ProjectSlugInput';
import {
  BrowserRouter as Router,
  Routes, 
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes> 
            <Route exact path="/" element={<UserCredentials />} /> 
            <Route path="/project-slug" element={<ProjectSlugInput />} /> 
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
