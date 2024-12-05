import React, { useEffect, useState } from 'react';
import { getAuth, signOut, deleteUser } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000';

interface Post {
    id: string;
    user_id: string;
    user_name: string;
    content: string;
    created_at: string;
    parent_id: string | null;
    likes_count: number;
    replys_count: number;
}

const Mypage: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [posts, setPosts] = useState<Post[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserName = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                try {
                    const response = await fetch(`${API_BASE_URL}/useremail?email=${user.email}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch user name');
                    }
                    const data = await response.json();
                    if (data.length > 0) {
                        setName(data[0].name);
                    } else {
                        setName('No Name');
                    }
                } catch (error: any) {
                    setError(error.message);
                }
            }
        };

        const fetchUserPosts = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                try {
                    const response = await fetch(`${API_BASE_URL}/posts?email=${user.email}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch user posts');
                    }
                    const data = await response.json();
                    setPosts(data);
                } catch (error: any) {
                    setError(error.message);
                }
            }
        };

        fetchUserName();
        fetchUserPosts();
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

    return (
        <div>
            <div style={{ position: 'fixed', top: 10, right: 10 }}>
                <button onClick={handleLogout} style={{ marginRight: '10px' }}>Logout</button>
                <button onClick={handleDeleteAccount}>Delete Account</button>
            </div>
            <h1>{name}</h1>
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
                            <span style={{ 
                                position: 'absolute', 
                                top: '10px', 
                                right: '10px', 
                                color: 'yellow', 
                                fontWeight: 'bold' 
                            }}>
                                リプライ
                            </span>
                        )}
                        <h3>{post.user_name} <span style={{ fontSize: '0.8em', color: '#888' }}>{new Date(post.created_at).toLocaleString()}</span></h3>
                        <p>{post.content}</p>
                        <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
                            いいね {post.likes_count}　リプライ {post.replys_count}
                        </div>
                    </div>
                ))}
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