import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fireAuth } from '../firebase';
import { fetchParentPost } from '../utils/API/fetchParentPost';
import { fetchLikedPosts } from '../utils/API/fetchLikedPosts';
import { toggleLike } from '../utils/API/toggleLike';
import { showTooltip, hideTooltip } from '../utils/ui/tooltipUtils'; // 新しい関数をインポート
import { Post } from '../types';
import { handleUserNameClick } from '../utils/auth/handleUserNameClick';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import './Page.css'; // カスタムツールチップのスタイルを追加
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ReplyIcon from '@mui/icons-material/Reply';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CreateReply: React.FC = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const { parentId } = useParams<{ parentId: string }>();
    const [content, setContent] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [parentPost, setParentPost] = useState<Post | null>(null);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set<string>());
    const [tooltip, setTooltip] = useState<string | null>(null); // ツールチップの状態を追加
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number, left: number } | null>(null); // ツールチップの位置を追加
    const navigate = useNavigate();

    useEffect(() => {
        if (parentId) {
            // 親投稿とユーザーが「いいね」した投稿を取得
            fetchParentPost(parentId, setParentPost, setError);
            fetchLikedPosts(setLikedPosts, setError);
        }
    }, [parentId]);

    /**
     * フォームの送信を処理する関数。
     * 
     * @param e - フォームイベント。
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // リプライ内容が200文字を超える場合はエラーメッセージをセット
        if (content.length > 200) {
            setError('リプライ内容は200文字以内にしてください');
            return;
        }
        if (content.length === 0) {
            setError('投稿内容を入力してください');
            return;
        }
        const user = fireAuth.currentUser;
        if (user) {
            try {
                // APIエンドポイントにリクエストを送信して、リプライを作成
                const response = await fetch(`${API_BASE_URL}/replycreate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ parent_id: parentId, email: user.email, content }),
                });
                if (!response.ok) {
                    throw new Error('Failed to create reply');
                }
                alert('リプライが作成されました');
                navigate(`/posts/${parentId}`); // リプライ成功後に親投稿の投稿詳細ページに遷移
            } catch (error: any) {
                // エラーメッセージをセット
                setError(error.message);
            }
        } else {
            setError('ユーザーが見つかりません');
        }
    };

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
     * 「いいね」ボタンをクリックしたときの処理。
     * 
     * @param postId - 投稿のID。
     */
    const handleLikeClick = (postId: string) => {
        const isLiked = likedPosts.has(postId);
        toggleLike(postId, isLiked, setLikedPosts, setPosts, setError);
    };

    const isLiked = (postId: string) => likedPosts.has(postId);

    return (
        <Container maxWidth="sm" className="top-page">
            <h1 className='mypage'>
                リプライ作成
            </h1>
            {parentPost && (
                <div className="post-container-detail">
                    <div className="post-header">
                        {parentPost.parent_id && (
                            <button 
                                onClick={() => handleParentPostClick(parentPost.parent_id!)} 
                                className="reply-label"
                            >
                                <ReplyIcon style={{fontSize:20,color:'#505b86'}}/>
                            </button>
                        )}
                        <span 
                            className="user-name" style={{ marginLeft: parentPost.parent_id ? '50px' : '0' }}
                            onClick={() => handleUserNameClick(parentPost.user_id, setError, navigate)}
                        >
                            {parentPost.user_name}
                        </span> 
                        <span className="post-date">
                            {new Date(parentPost.created_at).toLocaleString()}
                        </span>
                    </div>
                    <p className="post-content">{parentPost.content}</p>
                    <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555', display: 'flex', alignItems: 'center' }}>
                        {isLiked(parentPost.id) ? (
                            <span
                                style={{ color: 'pink', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                // onClick={(e) => {
                                //     e.stopPropagation();
                                //     handleLikeClick(parentPost.id);
                                // }}
                            >
                                <FavoriteIcon style={{fontSize:20,color:'pink', marginLeft: '30px'}}/>
                                {parentPost.likes_count}
                            </span>
                        ) : (
                            <span
                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                // onClick={(e) => {
                                //     e.stopPropagation();
                                //     handleLikeClick(parentPost.id);
                                // }}
                            >
                                <FavoriteBorderIcon style={{fontSize:20,color:'gray', marginLeft: '30px'}}/>
                                {parentPost.likes_count}
                            </span>
                        )}
                        {parentPost.replys_count > 0 ? (
                            <span style={{ marginLeft: '10px', color: '#555', display: 'flex', alignItems: 'center' }}>
                                <ChatBubbleIcon style={{fontSize:20,color:'MediumSeaGreen', marginLeft: '30px'}}/>
                                {parentPost.replys_count}
                            </span>
                        ) : (
                            <span style={{ marginLeft: '10px', color: '#555', display: 'flex', alignItems: 'center' }}>
                                <ChatBubbleOutlineIcon style={{fontSize:20,color:'grey', marginLeft: '30px'}}/>
                                {parentPost.replys_count}
                            </span>
                        )}
                    </div>
                    {parentPost.trust_score >= 0 && parentPost.trust_score <= 49 && (
                        <span 
                            className="warning-text"
                            onMouseEnter={(e) => showTooltip(parentPost.trust_description || '', e, setTooltip, setTooltipPosition)} // 追加
                            onMouseLeave={() => hideTooltip(setTooltip, setTooltipPosition)} // 追加
                        >
                            <AnnouncementIcon style={{fontSize:30,color:'red'}}/>
                        </span>
                    )}
                </div>
            )}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    mt: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <TextField
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        if (e.target.value.length <= 200) {
                            setError('');
                        }
                    }}
                    placeholder="リプライ内容を入力してください"
                    multiline
                    rows={5}
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                    className="login-input"
                />
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mb: 2 }}
                    className='login-button'
                >
                    リプライ
                </Button>
                <Button
                    onClick={() => navigate(`/posts/${parentId}`)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    className='login-button-back'
                >
                    戻る
                </Button>
            </Box>
            {tooltip && tooltipPosition && (
                <div className="tooltip" style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
                    {tooltip}
                </div>
            )}
        </Container>
    );
};

export default CreateReply;