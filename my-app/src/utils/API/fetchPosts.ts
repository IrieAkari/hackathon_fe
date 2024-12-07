import { Post } from '../../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * 投稿を取得し、セットする関数。
 * 
 * @param setPosts - 取得した投稿をセットするための関数。
 * @param setError - エラーメッセージをセットするための関数。
 * @param userId - ユーザーID（オプション）。
 */
export const fetchPosts = async (setPosts: React.Dispatch<React.SetStateAction<Post[]>>, setError: React.Dispatch<React.SetStateAction<string>>, userId?: string) => {
    try {
        let url = `${API_BASE_URL}/posts`;
        if (userId) {
            url += `?userid=${userId}`;
        }
        // APIエンドポイントにリクエストを送信して、投稿を取得
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        // 取得した投稿をセット
        setPosts(data);
    } catch (error: any) {
        // エラーメッセージをセット
        setError(error.message);
    }
};