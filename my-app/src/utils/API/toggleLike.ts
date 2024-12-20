import { Post } from '../../types';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * 投稿の「いいね」を切り替える関数。
 * 
 * @param postId - 「いいね」をトグルする投稿のID。
 * @param isLiked - 現在の「いいね」状態。
 * @param setLikedPosts - ユーザーが「いいね」した投稿のIDをセットするための関数。
 * @param setPosts - 投稿のリストをセットするための関数。
 * @param setError - エラーメッセージをセットするための関数。
 */
export const toggleLike = async (
    postId: string,
    isLiked: boolean,
    setLikedPosts: React.Dispatch<React.SetStateAction<Set<string>>>,
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
    setError: React.Dispatch<React.SetStateAction<string>>
) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        try {
            if (isLiked) {
                // いいねを削除
                setLikedPosts(prev => {
                    const newLikedPosts = new Set(prev);
                    newLikedPosts.delete(postId);
                    return newLikedPosts;
                });
                setPosts(prev => prev.map(post => post.id === postId ? { ...post, likes_count: post.likes_count - 1 } : post));
                const response = await fetch(`${API_BASE_URL}/likedelete?postid=${postId}&email=${user.email}`, {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete like');
                }
            } else {
                // いいねを登録
                setLikedPosts(prev => new Set(prev).add(postId));
                setPosts(prev => prev.map(post => post.id === postId ? { ...post, likes_count: post.likes_count + 1 } : post));
                const response = await fetch(`${API_BASE_URL}/likecreate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: user.email, post_id: postId }),
                });
                if (!response.ok) {
                    throw new Error('Failed to create like');
                }
            }
        } catch (error: any) {
            // エラーメッセージをセット
            setError(error.message);
        }
    }
};
