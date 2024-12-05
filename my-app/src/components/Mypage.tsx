import React, { useEffect, useState } from 'react';
import { getAuth, signOut, deleteUser } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000';

const Mypage: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [error, setError] = useState<string>('');
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

        fetchUserName();
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

    const handleDeleteAccount = () => {
        const user = getAuth().currentUser;
        if (user) {
            deleteUser(user)
                .then(() => {
                    alert('アカウントが削除されました');
                    navigate('/');
                })
                .catch((error) => {
                    alert(error.message);
                });
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
            <div style={{ position: 'fixed', bottom: 10, right: 10 }}>
                <Link to="/createpost" style={{ color: 'white', marginRight: '10px' }}>新規投稿</Link>
                <br />
                <Link to="/" style={{ color: 'white' }}>ログインページに戻る</Link>
            </div>
        </div>
    );
};

export default Mypage;