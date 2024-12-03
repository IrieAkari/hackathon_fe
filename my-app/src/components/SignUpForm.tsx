import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { fireAuth } from '../firebase';

const SignUpForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
        const signInMethods = await fetchSignInMethodsForEmail(fireAuth, email);
        if (signInMethods.length > 0) {
            setError('このメールアドレスは既に使用されています。');
        } else {
            await createUserWithEmailAndPassword(fireAuth, email, password);
            alert('アカウントが作成されました: ' + email);
        }
        } catch (error: any) {
        setError(error.message);
        }
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
            <div>
            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <button type="submit">Sign Up</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
        <p>
            既にアカウントをお持ちですか？ <Link to="/">ログインページに戻る</Link>
        </p>
        </div>
    );
};

export default SignUpForm;