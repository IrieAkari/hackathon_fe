import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPosts } from '../utils/API/fetchPosts';
import { fetchLikedPosts } from '../utils/API/fetchLikedPosts';
import { toggleLike } from '../utils/API/toggleLike';
import { handleUserNameClick } from '../utils/auth/handleUserNameClick';
import { showTooltip, hideTooltip } from '../utils/ui/tooltipUtils'; // 新しい関数をインポート
import { Post } from '../types';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import './Page.css'; 
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';


const TopPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set<string>());
    const [error, setError] = useState<string>('');
    const [tooltip, setTooltip] = useState<string | null>(null); // ツールチップの状態を追加
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number, left: number } | null>(null); // ツールチップの位置を追加
    const navigate = useNavigate();

    useEffect(() => {
        // 投稿と「いいね」した投稿を取得
        fetchPosts(setPosts, setError);
        fetchLikedPosts(setLikedPosts, setError);
    }, []);

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

    /**
     * 投稿が「いいね」されているかどうかを確認する関数。
     * 
     * @param postId - 投稿のID。
     * @returns 投稿が「いいね」されている場合は true、それ以外の場合は false。
     */
    const isLiked = (postId: string) => likedPosts.has(postId);

    return (
        <div className="top-page">
            {/* <h2>最新の投稿</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} */}
            <div>
                {posts.map(post => (
                    <div 
                        key={post.id} 
                        className="post-container"
                        onClick={() => handlePostClick(post.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="post-header">
                            <span 
                                className="user-name"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUserNameClick(post.user_id, setError, navigate);
                                }}
                            >
                                {post.user_name}
                            </span> 
                            <span className="post-date">
                                {new Date(post.created_at).toLocaleString()}
                            </span>
                        </div>
                        <p className="post-content">{post.content}</p>
                        <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
                            {isLiked(post.id) ? (
                                <span
                                    style={{ color: 'pink', cursor: 'pointer' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLikeClick(post.id);
                                    }}
                                >
                                    <FavoriteIcon style={{fontSize:20,color:'pink'}}/>
                                    {post.likes_count}
                                </span>
                            ) : (
                                <span
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLikeClick(post.id);
                                    }}
                                >
                                    <FavoriteBorderIcon  style={{fontSize:20,color:'gray'}}/>
                                    {post.likes_count}
                                </span>
                            )}
                            リプライ {post.replys_count}
                        </div>
                        {post.trust_score >= 0 && post.trust_score <= 49 && (
                            <span 
                                className="warning-text"
                                onMouseEnter={(e) => showTooltip(post.trust_description || '', e, setTooltip, setTooltipPosition)} // 追加
                                onMouseLeave={() => hideTooltip(setTooltip, setTooltipPosition)} // 追加
                            >
                                <AnnouncementIcon style={{fontSize:30,color:'red'}}/>
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
        </div>
    );
};

export default TopPage;