import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { fireAuth } from '../firebase';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import './LoginForm.css'; // CSSファイルをインポート

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    /**
     * ログインフォームの送信を処理する関数。
     * 
     * @param e - フォームイベント。
     */
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        signInWithEmailAndPassword(fireAuth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert('ログインユーザー: ' + user.email);
            navigate('/top');
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
        <Container maxWidth="xs" className="login-container">
            <Box
                sx={{
                    mt: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h4" className="login-title">
                    Trust X
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleLogin}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        ログイン
                    </Typography>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                    />
                    <Button 
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="login-button"
                    >
                        Login
                    </Button>
                    {error && <Alert severity="error">{error}</Alert>}
                </Box>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                    アカウントをお持ちでないですか？ <Link to="/signup">新規登録</Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default LoginForm;