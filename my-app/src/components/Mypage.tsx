import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
//import { API_BASE_URL } from '../config';
const API_BASE_URL = 'http://localhost:8000';

const Mypage: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchUserName = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                try {
                    //const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/useremail?email=${user.email}`);
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

    return (
        <div>
            <h2>マイページ</h2>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <p>ユーザー名: {name}</p>
            )}
        </div>
    );
};

export default Mypage;