import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fireAuth } from '../../firebase';
import { fetchParentPost } from '../../utils/API/fetchParentPost';
import { fetchLikedPosts } from '../../utils/API/fetchLikedPosts';
import { showTooltip, hideTooltip } from '../../utils/ui/tooltipUtils'; // 新しい関数をインポート
import { Post } from '../../types';
import './CreateReply.css'; // カスタムツールチップのスタイルを追加

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CreateReply: React.FC = () => {
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

    const isLiked = (postId: string) => likedPosts.has(postId);

    return (
        <div>
            <h2>リプライ作成</h2>
            {parentPost && (
                <div className="post-container">
                    {parentPost.parent_id && (
                        <button 
                            onClick={() => navigate(`/posts/${parentPost.parent_id!}`)} 
                            className="parent-post-button"
                        >
                            親投稿
                        </button>
                    )}
                    <h3>{parentPost.user_name} <span style={{ fontSize: '0.8em', color: '#888' }}>{new Date(parentPost.created_at).toLocaleString()}</span></h3>
                    <p>{parentPost.content}</p>
                    <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
                        <span style={{ color: isLiked(parentPost.id) ? 'pink' : 'inherit' }}>いいね {parentPost.likes_count}</span>　リプライ {parentPost.replys_count}
                    </div>
                    {parentPost.trust_score >= 0 && parentPost.trust_score <= 49 && (
                        <span 
                            className="warning-text"
                            onMouseEnter={(e) => showTooltip(parentPost.trust_description || '', e, setTooltip, setTooltipPosition)} // 追加
                            onMouseLeave={() => hideTooltip(setTooltip, setTooltipPosition)} // 追加
                        >
                            注意：信頼度の低い投稿
                        </span>
                    )}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <textarea
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            if (e.target.value.length <= 200) {
                                setError('');
                            }
                        }}
                        placeholder="リプライ内容を入力してください"
                        rows={5}
                        cols={40}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">リプライ</button>
            </form>
            <button onClick={() => navigate(`/posts/${parentId}`)} style={{ marginTop: '10px' }}>戻る</button>
            {tooltip && tooltipPosition && (
                <div className="tooltip" style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
                    {tooltip}
                </div>
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

export default CreateReply;