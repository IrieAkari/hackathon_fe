import { Post } from '../../types';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const toggleLikeDetail = async (
    postId: string,
    isLiked: boolean,
    setLikedPosts: React.Dispatch<React.SetStateAction<Set<string>>>,
    setPost: React.Dispatch<React.SetStateAction<Post | null>>,
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
                setPost(prev => prev ? { ...prev, likes_count: prev.likes_count - 1 } : prev);
                const response = await fetch(`${API_BASE_URL}/likedelete?postid=${postId}&email=${user.email}`, {
                    method: 'GET',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete like');
                }
            } else {
                // いいねを登録
                setLikedPosts(prev => new Set(prev).add(postId));
                setPost(prev => prev ? { ...prev, likes_count: prev.likes_count + 1 } : prev);
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