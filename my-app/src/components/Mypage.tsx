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

    return (
        <div>
            <h2>マイページ</h2>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <p>ユーザー名: {name}</p>
            )}
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleDeleteAccount}>Delete Account</button>
            <div>
                {posts.map(post => (
                    <div key={post.id} style={{ 
                        border: '1px solid #ccc', 
                        padding: '20px', 
                        margin: '10px 0', 
                        width: '800px'
                        }}>
                        <h3>{post.user_name} <span style={{ fontSize: '0.8em', color: '#888' }}>{new Date(post.created_at).toLocaleString()}</span></h3>
                        <p>{post.content}</p>
                    </div>
                ))}
            </div>
            <div style={{ position: 'fixed', bottom: 10, right: 10 }}>
                <Link to="/createpost" style={{ color: 'white', marginRight: '10px' }}>新規投稿</Link>
                <br />
                <Link to="/top" style={{ color: 'white' }}>ホーム</Link>
            </div>
        </div>
    );
};

export default Mypage;