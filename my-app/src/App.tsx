import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import TopPage from './components/TopPage';
import Mypage from './components/Mypage';
import CreatePost from './components/CreatePost';
import PostDetail from './components/PostDetail';
import CreateReply from './components/CreateReply';
import UserPage from './components/UserPage'; 
import Sidebar from './components/Sidebar/Sidebar';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route
              path="*"
              element={
                <div style={{ display: 'flex' }}>
                  <Sidebar />
                  <div style={{ flexGrow: 1, padding: '10px', marginLeft: '250px' }}>
                    <Routes>
                      <Route path="/top" element={<TopPage />} />
                      <Route path="/mypage" element={<Mypage />} />
                      <Route path="/createpost" element={<CreatePost />} />
                      <Route path="/posts/:id" element={<PostDetail />} />
                      <Route path="/createreply/:parentId" element={<CreateReply />} />
                      <Route path="/user/:userId" element={<UserPage />} />
                    </Routes>
                  </div>
                </div>
              }
            />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;