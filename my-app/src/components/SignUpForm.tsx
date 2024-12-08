import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { fireAuth } from '../firebase';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SignUpForm: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    /**
     * サインアップフォームの送信を処理する関数。
     * 
     * @param e - フォームイベント。
     */
    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        if (name.length > 15) {
            setError('ユーザー名は15文字以内にしてください。');
            return;
        }
        try {
            const signInMethods = await fetchSignInMethodsForEmail(fireAuth, email);
            if (signInMethods.length > 0) {
                setError('このメールアドレスは既に使用されています。');
            } else {
                await createUserWithEmailAndPassword(fireAuth, email, password);
                alert('アカウントが作成されました: ' + email);

                // バックエンドにユーザー情報を送信
                const response = await fetch(`${API_BASE_URL}/userregister`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'ユーザー情報の送信に失敗しました');
                }
            }
        } catch (error: any) {
            setError(error.message);
        }
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
                    onSubmit={handleSignUp}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        新規ユーザー作成
                    </Typography>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        inputProps={{ maxLength: 15 }} // ユーザー名の最大文字数を15に設定
                        className="login-input"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
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
                        Sign Up
                    </Button>
                    {error && <Alert severity="error">{error}</Alert>}
                </Box>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                    既にアカウントをお持ちですか？ <Link to="/">ログインページに戻る</Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default SignUpForm;