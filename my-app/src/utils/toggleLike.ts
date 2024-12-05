import { getAuth } from 'firebase/auth';
import { Post } from '../types';

const API_BASE_URL = 'http://localhost:8000';

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
            setError(error.message);
        }
    }
};