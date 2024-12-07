import { getAuth } from 'firebase/auth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * ユーザーが「いいね」した投稿のIDを取得し、セットする関数。
 * 
 * @param setLikedPosts - ユーザーが「いいね」した投稿のIDをセットするための関数。
 * @param setError - エラーメッセージをセットするための関数。
 */
export const fetchLikedPosts = async (setLikedPosts: React.Dispatch<React.SetStateAction<Set<string>>>, setError: React.Dispatch<React.SetStateAction<string>>) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        try {
            // APIエンドポイントにリクエストを送信して、ユーザーが「いいね」した投稿を取得
            const response = await fetch(`${API_BASE_URL}/likeget?email=${user.email}`);
            if (!response.ok) {
                throw new Error('Failed to fetch liked posts');
            }
            const data = await response.json();
            // 取得したデータが配列であり、かつ空でない場合
            if (Array.isArray(data) && data.length > 0) {
                // 「いいね」した投稿のIDをセット
                const likedPostIds = new Set<string>(data.map((like: { post_id: string }) => like.post_id));
                setLikedPosts(likedPostIds);
            }
        } catch (error: any) {
            // エラーメッセージをセット
            setError(error.message);
        }
    }
};