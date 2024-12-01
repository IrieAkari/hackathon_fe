import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailLink, isSignInWithEmailLink } from 'firebase/auth';
import { fireAuth } from '../firebase';

const CompleteSignUpForm = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = window.localStorage.getItem('emailForSignIn');
        if (storedEmail) {
        setEmail(storedEmail);
        } else {
        alert('メールアドレスが見つかりません。');
        navigate('/');
        }
    }, [navigate]);

    const handleCompleteSignUp = async (e) => {
        e.preventDefault();
        if (isSignInWithEmailLink(fireAuth, window.location.href)) {
        try {
            const emailLink = window.localStorage.getItem('emailForSignIn');
            if (emailLink) {
            await signInWithEmailLink(fireAuth, emailLink, window.location.href);
            await createUserWithEmailAndPassword(fireAuth, emailLink, password);
            alert('アカウントが作成されました: ' + emailLink);
            window.localStorage.removeItem('emailForSignIn');
            navigate('/success');
            } else {
            alert('メールアドレスが見つかりません。');
            }
        } catch (error) {
            if (error.code === 'auth/invalid-action-code') {
            alert('無効なリンクです。リンクが既に使用されたか、期限切れです。');
            } else {
            alert(error.message);
            }
        }
        } else {
        alert('無効なリンクです。');
        }
    };

    return (
        <div>
        <form onSubmit={handleCompleteSignUp}>
            <h2>パスワード設定</h2>
            <div>
            <label>Email:</label>
            <input
                type="email"
                value={email}
                readOnly
            />
            </div>
            <div>
            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <button type="submit">Complete Sign Up</button>
        </form>
        <p>
            既にアカウントをお持ちですか？ <Link to="/">ログインページに戻る</Link>
        </p>
        </div>
    );
};

export default CompleteSignUpForm;