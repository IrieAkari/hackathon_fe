import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchPosts } from '../utils/fetchPosts';
import { fetchLikedPosts } from '../utils/fetchLikedPosts';
import { fetchUserNameById } from '../utils/fetchUserNameById'; // 新しい関数をインポート
import { Post } from '../types';

const UserPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set<string>());
    const [error, setError] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            fetchPosts(setPosts, setError, userId);
            fetchLikedPosts(setLikedPosts, setError);
            fetchUserNameById(userId, setUserName, setError); // ユーザー名を取得
        }
    }, [userId]);

    const isLiked = (postId: string) => likedPosts.has(postId);

    /**
     * 投稿をクリックしたときの処理。
     * 
     * @param id - 投稿のID。
     */
    const handlePostClick = (id: string) => {
        navigate(`/posts/${id}`);
    };

    return (
        <div>
            <h2>{userName}の投稿</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                {posts.map(post => (
                    <div 
                        key={post.id} 
                        style={{ 
                            border: '1px solid #ccc', 
                            padding: '20px', 
                            margin: '10px 0', 
                            width: '800px',
                            cursor: 'pointer'
                        }}
                        onClick={() => handlePostClick(post.id)}
                    >
                        <h3>{post.user_name} <span style={{ fontSize: '0.8em', color: '#888' }}>{new Date(post.created_at).toLocaleString()}</span></h3>
                        <p>{post.content}</p>
                        <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
                            <span style={{ color: isLiked(post.id) ? 'pink' : 'inherit' }}>いいね {post.likes_count}</span>　リプライ {post.replys_count}
                        </div>
                    </div>
                ))}
            </div>
            <div className="fixed-bottom-left">
                <Link to="/top" style={{ color: 'white', marginRight: '10px' }}>ホーム</Link>
            </div>
            <div className="fixed-bottom-right">
                <Link to="/mypage" style={{ color: 'white' }}>マイページ</Link>
            </div>
        </div>
    );
};

export default UserPage;