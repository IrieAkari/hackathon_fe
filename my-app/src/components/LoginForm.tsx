import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { fireAuth } from '../firebase';
const API_BASE_URL = 'http://localhost:8000';


const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        signInWithEmailAndPassword(fireAuth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert('ログインユーザー: ' + user.email);
            navigate('/success');
        })
        .catch((error) => {
            if (error.code === 'auth/user-not-found') {
            setError('未登録です');
            } else if (error.code === 'auth/wrong-password') {
            setError('パスワードが間違っています');
            } else {
            setError(error.message);
            }
        });
    };

    return (
        <div>
        <form onSubmit={handleLogin}>
            <h2>ログイン</h2>
            <div>
            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </div>
            <div>
            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <button type="submit">Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
        <p>
            アカウントをお持ちでないですか？ <Link to="/signup">新規登録</Link>
        </p>
        </div>
    );
};

export default LoginForm;