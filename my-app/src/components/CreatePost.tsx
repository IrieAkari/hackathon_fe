import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fireAuth } from '../firebase';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import './Page.css'; 

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CreatePost: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    /**
     * フォームの送信を処理する関数。
     * 
     * @param e - フォームイベント。
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // 投稿内容が200文字を超える場合はエラーメッセージをセット
        if (content.length > 200) {
            setError('投稿内容は200文字以内にしてください');
            return;
        }
        if (content.length === 0) {
            setError('投稿内容を入力してください');
            return;
        }
        const user = fireAuth.currentUser;
        if (user) {
            try {
                // APIエンドポイントにリクエストを送信して、投稿を作成
                const response = await fetch(`${API_BASE_URL}/postcreate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: user.email, content }),
                });
                if (!response.ok) {
                    throw new Error('Failed to create post');
                }
                alert('投稿が作成されました');
                navigate('/mypage'); // 投稿成功後にMypageに遷移
            } catch (error: any) {
                // エラーメッセージをセット
                setError(error.message);
            }
        } else {
            setError('ユーザーが見つかりません');
        }
    };

    return (
        <Container maxWidth="sm">
            <h1 className='mypage'>
                新規投稿
            </h1>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                width="600px"
            >
                <TextField
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        if (e.target.value.length <= 200) {
                            setError('');
                        }
                    }}
                    placeholder="投稿内容を入力してください"
                    multiline
                    rows={5}
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mb: 2 }}
                    className='login-button'
                >
                    投稿
                </Button>
            </Box>
            <Box sx={{ position: 'fixed', bottom: 10, left: 10 }}>
                <Link to="/top" style={{ color: 'white', marginRight: '10px' }}>ホーム</Link>
            </Box>
            <Box sx={{ position: 'fixed', bottom: 10, right: 10 }}>
                <Link to="/mypage" style={{ color: 'white', marginRight: '10px' }}>マイページ</Link>
            </Box>
        </Container>
    );
};

export default CreatePost;