import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchPosts } from '../../utils/API/fetchPosts';
import { fetchLikedPosts } from '../../utils/API/fetchLikedPosts';
import { toggleLike } from '../../utils/API/toggleLike';
import { handleUserNameClick } from '../../utils/auth/handleUserNameClick';
import { showTooltip, hideTooltip } from '../../utils/ui/tooltipUtils'; // 新しい関数をインポート
import { Post } from '../../types';
import './TopPage.css'; // カスタムツールチップのスタイルを追加

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
                            cursor: 'pointer',
                            position: 'relative' // 追加
                        }}
                        onClick={() => handlePostClick(post.id)}
                    >
                        <h3>
                            <span 
                                style={{ cursor: 'pointer', color: 'blue' }} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUserNameClick(post.user_id, setError, navigate);
                                }}
                            >
                                {post.user_name}
                            </span> 
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
                            </span>　リプライ {post.replys_count}
                        </div>
                        {post.trust_score >= 0 && post.trust_score <= 49 && (
                            <span 
                                className="warning-text"
                                onMouseEnter={(e) => showTooltip(post.trust_description || '', e, setTooltip, setTooltipPosition)} // 追加
                                onMouseLeave={() => hideTooltip(setTooltip, setTooltipPosition)} // 追加
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
            <div style={{ position: 'fixed', bottom: 10, right: 10 }}>
                <Link to="/createpost" style={{ color: 'white', marginRight: '10px' }}>新規投稿</Link>
                <br />
                <Link to="/mypage" style={{ color: 'white' }}>マイページ</Link>
            </div>
        </div>
    );
};

export default TopPage;