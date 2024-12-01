import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, deleteUser } from 'firebase/auth';
import { fireAuth } from '../firebase';

const SuccessPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(fireAuth)
        .then(() => {
            alert('ログアウトしました');
            navigate('/');
        })
        .catch((error) => {
            alert(error.message);
        });
    };

    const handleDeleteAccount = () => {
        const user = fireAuth.currentUser;
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
        <h2>ログイン成功</h2>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={handleDeleteAccount}>Delete Account</button>
        </div>
    );
};

export default SuccessPage;