import React, { useEffect, useState } from 'react';
import { getAuth, deleteUser } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { fetchUserName } from '../utils/API/fetchUserName';
import { fetchUserPosts } from '../utils/API/fetchUserPosts';
import { fetchLikedPosts } from '../utils/API/fetchLikedPosts';
import { toggleLike } from '../utils/API/toggleLike';
import { showTooltip, hideTooltip } from '../utils/ui/tooltipUtils';
import { Post } from '../types';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import './Page.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

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
        <div className="top-page">
            <div style={{ position: 'fixed', top: 10, right: 10 }}>
                <button onClick={handleDeleteAccount}>Delete Account</button>
            </div>
            <h1>マイページ</h1>
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

                            <div className="post-header">
                                <span className="user-name">
                                    {post.user_name}
                                </span>
                                <span className="post-date">
                                    {new Date(post.created_at).toLocaleString()}
                                </span>
                            </div>
                            <p className="post-content">{post.content}</p>
                            <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' , display: 'flex', alignItems: 'center'}}>
                            {isLiked(post.id) ? (
                                <span
                                    style={{ color: 'pink', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLikeClick(post.id);
                                    }}
                                >
                                    <FavoriteIcon style={{fontSize:20,color:'pink', marginLeft: '30px'}}/>
                                    {post.likes_count}
                                </span>
                            ) : (
                                <span
                                    style={{ cursor: 'pointer' , display: 'flex', alignItems: 'center'}}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLikeClick(post.id);
                                    }}
                                >
                                    <FavoriteBorderIcon  style={{fontSize:20,color:'gray', marginLeft: '30px'}}/>
                                    {post.likes_count}
                                </span>
                            )}
                            {post.replys_count > 0 ? (
                                <span style={{ marginLeft: '10px', color: '#555', display: 'flex', alignItems: 'center' }}>
                                    <ChatBubbleIcon  style={{fontSize:20,color:'MediumSeaGreen', marginLeft: '30px'}}/>
                                    {post.replys_count}
                                </span>
                            ) : (
                                <span style={{ marginLeft: '10px', color: '#555' , display: 'flex', alignItems: 'center'}}>
                                    <ChatBubbleOutlineIcon style={{fontSize:20,color:'grey', marginLeft: '30px'}}/>
                                    {post.replys_count}
                                </span>
                            )}
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
                                    <AnnouncementIcon style={{fontSize:30,color:'red'}}/>
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
        </div>
    );
};

export default Mypage;