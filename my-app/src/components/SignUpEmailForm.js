import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendSignInLinkToEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
import { fireAuth } from '../firebase';

const SignUpEmailForm = () => {
    const [email, setEmail] = useState('');

    const handleSignUp = (e) => {
        e.preventDefault();
        const actionCodeSettings = {
        url: 'http://localhost:3000/complete-signup',
        handleCodeInApp: true,
        };

        fetchSignInMethodsForEmail(fireAuth, email)
        .then((signInMethods) => {
            if (signInMethods.length > 0) {
            alert('このメールアドレスは既に使用されています。');
            } else {
            sendSignInLinkToEmail(fireAuth, email, actionCodeSettings)
                .then(() => {
                alert('確認メールが送信されました: ' + email);
                window.localStorage.setItem('emailForSignIn', email);
                })
                .catch((error) => {
                alert(error.message);
                });
            }
        })
        .catch((error) => {
            alert(error.message);
        });
    };

    return (
        <div>
        <form onSubmit={handleSignUp}>
            <h2>新規ユーザー作成</h2>
            <div>
            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </div>
            <button type="submit">Send Email</button>
        </form>
        <p>
            既にアカウントをお持ちですか？ <Link to="/">ログインページに戻る</Link>
        </p>
        </div>
    );
};

export default SignUpEmailForm;