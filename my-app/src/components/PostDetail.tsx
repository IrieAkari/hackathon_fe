import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './PostDetail.css';
import { fetchPost } from '../utils/fetchPost';
import { fetchReplies } from '../utils/fetchReplies';
import { fetchLikedPosts } from '../utils/fetchLikedPosts';
import { handleUserNameClick } from '../utils/handleUserNameClick';
import { Post } from '../types';

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [replies, setReplies] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set<string>());
    const [error, setError] = useState<string>('');
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
        navigate(`/posts/${parentId}`);
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
     * 投稿が「いいね」されているかどうかを確認する関数。
     * 
     * @param postId - 投稿のID。
     * @returns 投稿が「いいね」されている場合は true、それ以外の場合は false。
     */
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
                <h3>
                    <span 
                        style={{ cursor: 'pointer', color: 'blue' }} 
                        onClick={() => handleUserNameClick(post.user_id, setError, navigate)}
                    >
                        {post.user_name}
                    </span> 
                    <span style={{ fontSize: '0.8em', color: '#888' }}>
                        {new Date(post.created_at).toLocaleString()}
                    </span>
                </h3>
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
                        <h3>
                            <span 
                                style={{ cursor: 'pointer', color: 'blue' }} 
                                onClick={() => handleUserNameClick(reply.user_id, setError, navigate)}
                            >
                                {reply.user_name}
                            </span> 
                            <span style={{ fontSize: '0.8em', color: '#888' }}>
                                {new Date(reply.created_at).toLocaleString()}
                            </span>
                        </h3>
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