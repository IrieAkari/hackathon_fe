import { getAuth } from 'firebase/auth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * ユーザー名をクリックしたときの処理。
 * 
 * @param userId - ユーザーのID。
 * @param setError - エラーメッセージをセットするための関数。
 * @param navigate - ナビゲートするための関数。
 */
export const handleUserNameClick = async (userId: string, setError: React.Dispatch<React.SetStateAction<string>>, navigate: (path: string) => void) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
        try {
            const response = await fetch(`${API_BASE_URL}/user?email=${currentUser.email}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            const data = await response.json();
            const currentUserId = data[0].id;
            if (currentUserId === userId) {
                navigate('/mypage');
            } else {
                navigate(`/user/${userId}`);
            }
        } catch (error: any) {
            setError(error.message);
        }
    } else {
        navigate(`/user/${userId}`);
    }
};