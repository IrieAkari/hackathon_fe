import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
//import { getAuth } from 'firebase/auth';
import './PostDetail.css';
import { fetchLikedPosts } from '../utils/fetchLikedPosts';

const API_BASE_URL = 'http://localhost:8000';

interface Post {
    id: string;
    user_id: string;
    user_name: string;
    content: string;
    created_at: string;
    parent_id: string | null;
    likes_count: number;
    replys_count: number;
}

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [replies, setReplies] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set<string>());
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

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
        fetchLikedPosts(setLikedPosts, setError);
    }, [id]);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!post) {
        return <p>Loading...</p>;
    }

    const handleParentPostClick = (parentId: string) => {
        navigate(`/posts/${parentId}`);
    };

    const handleReplyClick = (replyId: string) => {
        navigate(`/posts/${replyId}`);
    };

    const handleCreateReplyClick = () => {
        navigate(`/createreply/${id}`);
    };

    const isLiked = (postId: string) => likedPosts.has(postId);

    return (
        <div>
            <h2>投稿詳細</h2>
            <div className="post-container">
                {post.parent_id && (
                    <button 
                        onClick={() => handleParentPostClick(post.parent_id!)} 
                        className="parent-post-button"
                    >
                        親投稿
                    </button>
                )}
                <h3>{post.user_name} <span style={{ fontSize: '0.8em', color: '#888' }}>{new Date(post.created_at).toLocaleString()}</span></h3>
                <p>{post.content}</p>
                <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
                    <span style={{ color: isLiked(post.id) ? 'pink' : 'inherit' }}>いいね {post.likes_count}</span>　リプライ {post.replys_count}
                </div>
                <button 
                    onClick={handleCreateReplyClick} 
                    className="create-reply-button"
                >
                    リプライ
                </button>
            </div>
            <h3>リプライ</h3>
            {replies && replies.length > 0 ? (
                replies.map(reply => (
                    <div 
                        key={reply.id} 
                        className="reply-container"
                        onClick={() => handleReplyClick(reply.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className="reply-label">リプライ</span>
                        <h3>{reply.user_name} <span style={{ fontSize: '0.8em', color: '#888' }}>{new Date(reply.created_at).toLocaleString()}</span></h3>
                        <p>{reply.content}</p>
                        <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
                            <span style={{ color: isLiked(reply.id) ? 'pink' : 'inherit' }}>いいね {reply.likes_count}</span>　リプライ {reply.replys_count}
                        </div>
                    </div>
                ))
            ) : (
                <p>リプライはありません</p>
            )}
            <div className="fixed-bottom-left">
                <Link to="/top" style={{ color: 'white', marginRight: '10px' }}>ホーム</Link>
            </div>
            <div className="fixed-bottom-right">
                <Link to="/mypage" style={{ color: 'white' }}>マイページ</Link>
            </div>
        </div>
    );
};

export default PostDetail;