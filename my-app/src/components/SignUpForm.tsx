import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { fireAuth } from '../firebase';
import { API_BASE_URL } from '../config';

const SignUpForm: React.FC = () => {
    const [name, setName] = useState<string>('');
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
                const userCredential = await createUserWithEmailAndPassword(fireAuth, email, password);
                const user = userCredential.user;
                alert('アカウントが作成されました: ' + email);

                // バックエンドにユーザー情報を送信
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'ユーザー情報の送信に失敗しました');
                }
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
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
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