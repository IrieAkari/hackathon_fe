import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchPosts } from '../utils/fetchPosts';
import { fetchLikedPosts } from '../utils/fetchLikedPosts';
import { Post } from '../types';

const TopPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set<string>());
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts(setPosts, setError);
        fetchLikedPosts(setLikedPosts, setError);
    }, []);

    const handlePostClick = (id: string) => {
        navigate(`/posts/${id}`);
    };

    const isLiked = (postId: string) => likedPosts.has(postId);

    return (
        <div>
            <h2>最新の投稿</h2>
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
            <div style={{ position: 'fixed', bottom: 10, right: 10 }}>
                <Link to="/createpost" style={{ color: 'white', marginRight: '10px' }}>新規投稿</Link>
                <br />
                <Link to="/mypage" style={{ color: 'white' }}>マイページ</Link>
            </div>
        </div>
    );
};

export default TopPage;