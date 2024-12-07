import { Post } from '../../types';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * 指定された親投稿に対するリプライを取得し、セットする関数。
 * 
 * @param parentId - 親投稿のID。
 * @param setReplies - 取得したリプライをセットするための関数。
 * @param setError - エラーメッセージをセットするための関数。
 */
export const fetchReplies = async (parentId: string, setReplies: React.Dispatch<React.SetStateAction<Post[]>>, setError: React.Dispatch<React.SetStateAction<string>>) => {
    try {
        // APIエンドポイントにリクエストを送信して、指定された親投稿に対するリプライを取得
        const response = await fetch(`${API_BASE_URL}/replys?parentid=${parentId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch replies');
        }
        const data = await response.json();
        // 取得したリプライをセット
        setReplies(data);
    } catch (error: any) {
        // エラーメッセージをセット
        setError(error.message);
    }
};