import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fireAuth } from '../firebase';
import { fetchParentPost } from '../utils/fetchParentPost';
import { fetchLikedPosts } from '../utils/fetchLikedPosts';
import { Post } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const CreateReply: React.FC = () => {
    const { parentId } = useParams<{ parentId: string }>();
    const [content, setContent] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [parentPost, setParentPost] = useState<Post | null>(null);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set<string>());
    const navigate = useNavigate();

    useEffect(() => {
        if (parentId) {
            fetchParentPost(parentId, setParentPost, setError);
            fetchLikedPosts(setLikedPosts, setError);
        }
    }, [parentId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (content.length > 200) {
            setError('リプライ内容は200文字以内にしてください');
            return;
        }
        const user = fireAuth.currentUser;
        if (user) {
            try {
                const response = await fetch(`${API_BASE_URL}/replycreate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ parent_id: parentId, email: user.email, content }),
                });
                if (!response.ok) {
                    throw new Error('Failed to create reply');
                }
                alert('リプライが作成されました');
                navigate(`/posts/${parentId}`); // リプライ成功後に親投稿の投稿詳細ページに遷移
            } catch (error: any) {
                setError(error.message);
            }
        } else {
            setError('ユーザーが見つかりません');
        }
    };

    const isLiked = (postId: string) => likedPosts.has(postId);

    return (
        <div>
            <h2>リプライ作成</h2>
            {parentPost && (
                <div className="post-container">
                    {parentPost.parent_id && (
                        <button 
                            onClick={() => navigate(`/posts/${parentPost.parent_id!}`)} 
                            className="parent-post-button"
                        >
                            親投稿
                        </button>
                    )}
                    <h3>{parentPost.user_name} <span style={{ fontSize: '0.8em', color: '#888' }}>{new Date(parentPost.created_at).toLocaleString()}</span></h3>
                    <p>{parentPost.content}</p>
                    <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
                        <span style={{ color: isLiked(parentPost.id) ? 'pink' : 'inherit' }}>いいね {parentPost.likes_count}</span>　リプライ {parentPost.replys_count}
                    </div>
                </div>
            )}
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
                        placeholder="リプライ内容を入力してください"
                        rows={5}
                        cols={40}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">リプライ</button>
            </form>
            <button onClick={() => navigate(`/posts/${parentId}`)} style={{ marginTop: '10px' }}>戻る</button>
            <div style={{ position: 'fixed', bottom: 10, left: 10 }}>
                <Link to="/top" style={{ color: 'white', marginRight: '10px' }}>ホーム</Link>
            </div>
            <div style={{ position: 'fixed', bottom: 10, right: 10 }}>
                <Link to="/mypage" style={{ color: 'white' }}>マイページ</Link>
            </div>
        </div>
    );
};

export default CreateReply;