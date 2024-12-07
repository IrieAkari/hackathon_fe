import { Post } from '../../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * 親投稿を取得し、セットする関数。
 * 
 * @param parentId - 親投稿のID。
 * @param setParentPost - 親投稿をセットするための関数。
 * @param setError - エラーメッセージをセットするための関数。
 */
export const fetchParentPost = async (parentId: string, setParentPost: React.Dispatch<React.SetStateAction<Post | null>>, setError: React.Dispatch<React.SetStateAction<string>>) => {
    try {
        // APIエンドポイントにリクエストを送信して、親投稿を取得
        const response = await fetch(`${API_BASE_URL}/postget?postid=${parentId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch parent post');
        }
        const data = await response.json();
        // 親投稿をセット
        setParentPost(data);
    } catch (error: any) {
        // エラーメッセージをセット
        setError(error.message);
    }
};