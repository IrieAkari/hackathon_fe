import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import TopPage from './components/TopPage';
import Mypage from './components/Mypage';
import CreatePost from './components/CreatePost';
import PostDetail from './components/PostDetail';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 style={{ position: 'absolute', top: 10, left: 10 }}>Hackathon X</h1>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/top" element={<TopPage />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/posts/:id" element={<PostDetail />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;