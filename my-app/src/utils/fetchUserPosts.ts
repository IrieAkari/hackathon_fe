import { Post } from '../types';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * 現在のユーザーの全ての投稿を取得し、セットする関数。
 * 
 * @param setPosts - 取得した投稿をセットするための関数。
 * @param setError - エラーメッセージをセットするための関数。
 */
export const fetchUserPosts = async (setPosts: React.Dispatch<React.SetStateAction<Post[]>>, setError: React.Dispatch<React.SetStateAction<string>>) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        try {
            // APIエンドポイントにリクエストを送信して、ユーザーの投稿を取得
            const response = await fetch(`${API_BASE_URL}/posts?email=${user.email}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user posts');
            }
            const data = await response.json();
            // 取得した投稿をセット
            setPosts(data);
        } catch (error: any) {
            // エラーメッセージをセット
            setError(error.message);
        }
    }
};