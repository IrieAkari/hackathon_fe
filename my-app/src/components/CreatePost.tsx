import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fireAuth } from '../firebase';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CreatePost: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (content.length > 200) {
            setError('投稿内容は200文字以内にしてください');
            return;
        }
        const user = fireAuth.currentUser;
        if (user) {
            try {
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
                setError(error.message);
            }
        } else {
            setError('ユーザーが見つかりません');
        }
    };

    return (
        <div>
            <h2>新規投稿</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <textarea
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            if (e.target.value.length <= 200) {
                                setError('');
                            }
                        }}
                        placeholder="投稿内容を入力してください"
                        rows={5}
                        cols={40}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">投稿</button>
            </form>
            <div style={{ position: 'fixed', bottom: 10, left: 10 }}>
                <Link to="/top" style={{ color: 'white', marginRight: '10px' }}>ホーム</Link>
            </div>
            <div style={{ position: 'fixed', bottom: 10, right: 10 }}>
                <Link to="/mypage" style={{ color: 'white' }}>マイページ</Link>
            </div>
        </div>
    );
};

export default CreatePost;