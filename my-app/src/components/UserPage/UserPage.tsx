import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchPosts } from '../../utils/API/fetchPosts';
import { fetchLikedPosts } from '../../utils/API/fetchLikedPosts';
import { fetchUserNameById } from '../../utils/API/fetchUserNameById';
import { toggleLike } from '../../utils/API/toggleLike'; // 追加
import { showTooltip, hideTooltip } from '../../utils/ui/tooltipUtils';
import { Post } from '../../types';
import './UserPage.css';

const UserPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set<string>());
    const [error, setError] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [tooltip, setTooltip] = useState<string | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number, left: number } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            fetchPosts(setPosts, setError, userId);
            fetchLikedPosts(setLikedPosts, setError);
            fetchUserNameById(userId, setUserName, setError);
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

    /**
     * 「いいね」ボタンをクリックしたときの処理。
     * 
     * @param postId - 投稿のID。
     */
    const handleLikeClick = (postId: string) => {
        const isLiked = likedPosts.has(postId);
        toggleLike(postId, isLiked, setLikedPosts, setPosts, setError);
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
                            cursor: 'pointer',
                            position: 'relative'
                        }}
                        onClick={() => handlePostClick(post.id)}
                    >
                        {post.parent_id && (
                            <span className="reply-label">
                                リプライ
                            </span>
                        )}
                        <h3>{post.user_name} <span style={{ fontSize: '0.8em', color: '#888' }}>{new Date(post.created_at).toLocaleString()}</span></h3>
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
                            </span>　リプライ {post.replys_count}
                        </div>
                        {post.trust_score >= 0 && post.trust_score <= 49 && (
                            <span 
                                className="warning-text"
                                onMouseEnter={(e) => showTooltip(post.trust_description || '', e, setTooltip, setTooltipPosition)}
                                onMouseLeave={() => hideTooltip(setTooltip, setTooltipPosition)}
                            >
                                注意：信頼度の低い投稿
                            </span>
                        )}
                    </div>
                ))}
            </div>
            {tooltip && tooltipPosition && (
                <div className="tooltip" style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
                    {tooltip}
                </div>
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

export default UserPage;