import { Post } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * 指定された投稿を取得し、セットする関数。
 * 
 * @param postId - 取得する投稿のID。
 * @param setPost - 取得した投稿をセットするための関数。
 * @param setError - エラーメッセージをセットするための関数。
 */
export const fetchPost = async (postId: string, setPost: React.Dispatch<React.SetStateAction<Post | null>>, setError: React.Dispatch<React.SetStateAction<string>>) => {
    try {
        // APIエンドポイントにリクエストを送信して、指定された投稿を取得
        const response = await fetch(`${API_BASE_URL}/postget?postid=${postId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        // 取得した投稿をセット
        setPost(data);
    } catch (error: any) {
        // エラーメッセージをセット
        setError(error.message);
    }
};