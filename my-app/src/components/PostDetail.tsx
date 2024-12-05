import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000';

interface Post {
    id: string;
    user_id: string;
    user_name: string;
    content: string;
    created_at: string;
    parent_id: string | null;
}

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [replies, setReplies] = useState<Post[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/postget?postid=${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch post');
                }
                const data = await response.json();
                setPost(data);
            } catch (error: any) {
                setError(error.message);
            }
        };

        const fetchReplies = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/replys?parentid=${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch replies');
                }
                const data = await response.json();
                setReplies(data);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchPost();
        fetchReplies();
    }, [id]);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!post) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>投稿詳細</h2>
            <h3>{post.user_name}</h3>
            <p>{post.content}</p>
            <p><small>{new Date(post.created_at).toLocaleString()}</small></p>
            <h3>リプライ</h3>
            {replies && replies.length > 0 ? (
                replies.map(reply => (
                    <div 
                        key={reply.id} 
                        style={{ 
                            border: '1px solid #ccc', 
                            padding: '20px', 
                            margin: '10px 0', 
                            width: '800px',
                            position: 'relative'
                        }}
                    >
                        <span style={{ 
                            position: 'absolute', 
                            top: '10px', 
                            right: '10px', 
                            color: 'yellow', 
                            fontWeight: 'bold' 
                        }}>
                            リプライ
                        </span>
                        <h3>{reply.user_name} <span style={{ fontSize: '0.8em', color: '#888' }}>{new Date(reply.created_at).toLocaleString()}</span></h3>
                        <p>{reply.content}</p>
                    </div>
                ))
            ) : (
                <p>リプライはありません</p>
            )}
            <div style={{ position: 'fixed', bottom: 10, left: 10 }}>
                <Link to="/top" style={{ color: 'white', marginRight: '10px' }}>ホーム</Link>
            </div>
            <div style={{ position: 'fixed', bottom: 10, right: 10 }}>
                <Link to="/mypage" style={{ color: 'white' }}>マイページ</Link>
            </div>
        </div>
    );
};

export default PostDetail;