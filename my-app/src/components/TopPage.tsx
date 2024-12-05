import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fireAuth } from '../firebase';

const API_BASE_URL = 'http://localhost:8000';

interface Post {
    id: string;
    user_id: string;
    user_name: string;
    content: string;
    created_at: string;
}

const TopPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_BASE_URL}/posts`)
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching posts:', error));
    }, []);

    const handlePostClick = (id: string) => {
        navigate(`/posts/${id}`);
    };

    return (
        <div>
            <h2>最新の投稿</h2>
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