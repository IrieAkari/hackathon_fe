import React, { useEffect, useState } from 'react';
import { getAuth, deleteUser } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserName } from '../../utils/API/fetchUserName';
import { fetchUserPosts } from '../../utils/API/fetchUserPosts';
import { fetchLikedPosts } from '../../utils/API/fetchLikedPosts';
import { toggleLike } from '../../utils/API/toggleLike';
import { showTooltip, hideTooltip } from '../../utils/ui/tooltipUtils';
import { Post } from '../../types';
import './Mypage.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Mypage: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set<string>());
    const [tooltip, setTooltip] = useState<string | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserName(setName, setError);
        fetchUserPosts(setPosts, setError);
        fetchLikedPosts(setLikedPosts, setError);
    }, []);

    const handleDeleteAccount = async () => {
        const user = getAuth().currentUser;
        if (user) {
            try {
                await deleteUser(user);
                const response = await fetch(`${API_BASE_URL}/userdelete?email=${user.email}`, {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete user from database');
                }
                alert('アカウントが削除されました');
                navigate('/');
            } catch (error: any) {
                alert(error.message);
            }
        } else {
            alert('ユーザーが見つかりません');
        }
    };

    const handlePostClick = (id: string) => {
        navigate(`/posts/${id}`);
    };

    const handleLikeClick = (postId: string) => {
        const isLiked = likedPosts.has(postId);
        toggleLike(postId, isLiked, setLikedPosts, setPosts, setError);
    };

    const isLiked = (postId: string) => likedPosts.has(postId);

    return (
        <div>
            <div style={{ position: 'fixed', top: 10, right: 10 }}>
                <button onClick={handleDeleteAccount}>Delete Account</button>
            </div>
            <h1>{name}</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                {Array.isArray(posts) && posts.length > 0 ? (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className="post-container"
                            onClick={() => handlePostClick(post.id)}
                        >
                            {post.parent_id && <span className="reply-label">リプライ</span>}
                            <h3>
                                {post.user_name}{' '}
                                <span style={{ fontSize: '0.8em', color: '#888' }}>
                                    {new Date(post.created_at).toLocaleString()}
                                </span>
                            </h3>
                            <p>{post.content}</p>
                            <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
                                <span
                                    style={{ color: isLiked(post.id) ? 'pink' : 'inherit', cursor: 'pointer' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLikeClick(post.id);
                                    }}
                                >
                                    いいね {post.likes_count}
                                </span>{' '}
                                リプライ {post.replys_count}
                            </div>
                            {post.trust_score >= 0 && post.trust_score <= 49 && (
                                <span
                                    className="warning-text"
                                    onMouseEnter={(e) =>
                                        showTooltip(
                                            post.trust_description || '',
                                            e,
                                            setTooltip,
                                            setTooltipPosition
                                        )
                                    }
                                    onMouseLeave={() => hideTooltip(setTooltip, setTooltipPosition)}
                                >
                                    注意：信頼度の低い投稿
                                </span>
                            )}
                        </div>
                    ))
                ) : (
                    <p>投稿がありません。</p>
                )}
            </div>
            {tooltip && tooltipPosition && (
                <div
                    className="tooltip"
                    style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
                >
                    {tooltip}
                </div>
            )}
            <div className="fixed-bottom-left">
                <Link to="/top" style={{ color: 'white', marginRight: '10px' }}>
                    ホーム
                </Link>
            </div>
            <div className="fixed-bottom-right">
                <Link to="/createpost" style={{ color: 'white', marginRight: '10px' }}>
                    新規投稿
                </Link>
            </div>
        </div>
    );
};

export default Mypage;