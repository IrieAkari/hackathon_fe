import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Page.css';
import { fetchPost } from '../utils/API/fetchPost';
import { toggleLike } from '../utils/API/toggleLike';
import { fetchReplies } from '../utils/API/fetchReplies';
import { fetchLikedPosts } from '../utils/API/fetchLikedPosts';
import { handleUserNameClick } from '../utils/auth/handleUserNameClick';
import { showTooltip, hideTooltip } from '../utils/ui/tooltipUtils'; // 新しい関数をインポート
import { Post } from '../types';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [replies, setReplies] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set<string>());
    const [error, setError] = useState<string>('');
    const [tooltip, setTooltip] = useState<string | null>(null); // ツールチップの状態を追加
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number, left: number } | null>(null); // ツールチップの位置を追加
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            // 投稿、リプライ、および「いいね」した投稿を取得
            fetchPost(id, setPost, setError);
            fetchReplies(id, setReplies, setError);
            fetchLikedPosts(setLikedPosts, setError);
        }
    }, [id]);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!post) {
        return <p>Loading...</p>;
    }

    /**
     * 親投稿をクリックしたときの処理。
     * 
     * @param parentId - 親投稿のID。
     */
    const handleParentPostClick = (parentId: string) => {
        if (post?.is_parent_deleted) {
            alert('親投稿は削除されました');
        } else {
            navigate(`/posts/${parentId}`);
        }
    };

    /**
     * リプライをクリックしたときの処理。
     * 
     * @param replyId - リプライのID。
     */
    const handleReplyClick = (replyId: string) => {
        navigate(`/posts/${replyId}`);
    };

    /**
     * リプライ作成ボタンをクリックしたときの処理。
     */
    const handleCreateReplyClick = () => {
        navigate(`/createreply/${id}`);
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
            <div className="post-container-detail">
                {post.parent_id && (
                    <button 
                        onClick={() => handleParentPostClick(post.parent_id!)} 
                        className="parent-post-button"
                    >
                        親投稿
                    </button>
                )}
                <div className="post-header">
                    <span 
                        className="user-name"
                        onClick={() => handleUserNameClick(post.user_id, setError, navigate)}
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
                        <div className="post-header">
                            <span 
                                className="user-name"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUserNameClick(reply.user_id, setError, navigate);
                                }}
                            >
                                {reply.user_name}
                            </span> 
                            <span className="post-date">
                                {new Date(reply.created_at).toLocaleString()}
                            </span>
                        </div>
                        <p className="post-content">{reply.content}</p>
                        <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
                            {isLiked(reply.id) ? (
                                <span
                                    style={{ color: 'pink', cursor: 'pointer' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLikeClick(reply.id);
                                    }}
                                >
                                    <FavoriteIcon style={{fontSize:20,color:'pink'}}/>
                                    {reply.likes_count}
                                </span>
                            ) : (
                                <span
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLikeClick(reply.id);
                                    }}
                                >
                                    <FavoriteBorderIcon  style={{fontSize:20,color:'gray'}}/>
                                    {reply.likes_count}
                                </span>
                            )}
                            リプライ {reply.replys_count}
                        </div>
                        {reply.trust_score >= 0 && reply.trust_score <= 49 && (
                            <span 
                                className="warning-text"
                                onMouseEnter={(e) => showTooltip(reply.trust_description || '', e, setTooltip, setTooltipPosition)} // 追加
                                onMouseLeave={() => hideTooltip(setTooltip, setTooltipPosition)} // 追加
                            >
                                <AnnouncementIcon style={{fontSize:30,color:'red'}}/>
                            </span>
                        )}
                    </div>
                ))
            ) : (
                <p>リプライはありません</p>
            )}
            {tooltip && tooltipPosition && (
                <div className="tooltip" style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
                    {tooltip}
                </div>
            )}
        </div>
    );
};

export default PostDetail;