import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { fireAuth } from '../firebase';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SignUpForm: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    /**
     * サインアップフォームの送信を処理する関数。
     * 
     * @param e - フォームイベント。
     */
    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        if (name.length > 15) {
            setError('ユーザー名は15文字以内にしてください。');
            return;
        }
        try {
            const signInMethods = await fetchSignInMethodsForEmail(fireAuth, email);
            if (signInMethods.length > 0) {
                setError('このメールアドレスは既に使用されています。');
            } else {
                await createUserWithEmailAndPassword(fireAuth, email, password);
                alert('アカウントが作成されました: ' + email);

                // バックエンドにユーザー情報を送信
                const response = await fetch(`${API_BASE_URL}/userregister`, {
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
                        maxLength={15} // ユーザー名の最大文字数を15に設定
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
            <p>API Base URL: {API_BASE_URL}</p>
        </div>
    );
};

export default SignUpForm;