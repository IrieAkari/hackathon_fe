import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import SuccessPage from './components/SuccessPage';
import Mypage from './components/Mypage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to My App</h1>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/mypage" element={<Mypage />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;