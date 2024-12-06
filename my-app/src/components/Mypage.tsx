import React, { useEffect, useState } from 'react';

import { getAuth, signOut, deleteUser } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserName } from '../utils/fetchUserName';
import { fetchUserPosts } from '../utils/fetchUserPosts';
import { fetchLikedPosts } from '../utils/fetchLikedPosts';
import { Post } from '../types';

//import { API_BASE_URL } from '../config';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Mypage: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set<string>());
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserName(setName, setError);
        fetchUserPosts(setPosts, setError);
        fetchLikedPosts(setLikedPosts, setError);
    }, []);

    const handleLogout = () => {
        signOut(getAuth())
            .then(() => {
                alert('ログアウトしました');
                navigate('/');
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    const handleDeleteAccount = async () => {
        const user = getAuth().currentUser;
        if (user) {
            try {
                // Firebase アカウントの削除
                await deleteUser(user);

                // ユーザーを削除
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

    const isLiked = (postId: string) => likedPosts.has(postId);

    return (
        <div>
            <div style={{ position: 'fixed', top: 10, right: 10 }}>
                <button onClick={handleLogout} style={{ marginRight: '10px' }}>Logout</button>
                <button onClick={handleDeleteAccount}>Delete Account</button>
            </div>
            <h1>{name}</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                {Array.isArray(posts) && posts.length > 0 ? (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            style={{
                                border: '1px solid #ccc',
                                padding: '20px',
                                margin: '10px 0',
                                width: '800px',
                                cursor: 'pointer',
                                position: 'relative',
                            }}
                            onClick={() => handlePostClick(post.id)}
                        >
                            {post.parent_id && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        color: 'yellow',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    リプライ
                                </span>
                            )}
                            <h3>
                                {post.user_name}{' '}
                                <span style={{ fontSize: '0.8em', color: '#888' }}>
                                    {new Date(post.created_at).toLocaleString()}
                                </span>
                            </h3>
                            <p>{post.content}</p>
                            <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
                                <span style={{ color: isLiked(post.id) ? 'pink' : 'inherit' }}>
                                    いいね {post.likes_count}
                                </span>
                                　リプライ {post.replys_count}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>投稿がありません。</p>
                )}
            </div>

            <div style={{ position: 'fixed', bottom: 10, left: 10 }}>
                <Link to="/top" style={{ color: 'white', marginRight: '10px' }}>ホーム</Link>
            </div>
            <div style={{ position: 'fixed', bottom: 10, right: 10 }}>
                <Link to="/createpost" style={{ color: 'white', marginRight: '10px' }}>新規投稿</Link>
            </div>
        </div>
    );
};

export default Mypage;