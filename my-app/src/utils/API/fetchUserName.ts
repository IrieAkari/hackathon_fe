import { getAuth } from 'firebase/auth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * 現在のユーザーの名前を取得し、セットする関数。
 * 
 * @param setName - ユーザーの名前をセットするための関数。
 * @param setError - エラーメッセージをセットするための関数。
 */
export const fetchUserName = async (setName: React.Dispatch<React.SetStateAction<string>>, setError: React.Dispatch<React.SetStateAction<string>>) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        try {
            // APIエンドポイントにリクエストを送信して、ユーザーの名前を取得
            const response = await fetch(`${API_BASE_URL}/user?email=${user.email}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user name');
            }
            const data = await response.json();
            // 取得したデータが配列であり、かつ空でない場合
            if (data.length > 0) {
                // ユーザーの名前をセット
                setName(data[0].name);
            } else {
                // 名前が見つからない場合は 'No Name' をセット
                setName('No Name');
            }
        } catch (error: any) {
            // エラーメッセージをセット
            setError(error.message);
        }
    }
};