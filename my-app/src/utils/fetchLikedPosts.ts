import { getAuth } from 'firebase/auth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchLikedPosts = async (setLikedPosts: React.Dispatch<React.SetStateAction<Set<string>>>, setError: React.Dispatch<React.SetStateAction<string>>) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        try {
            const response = await fetch(`${API_BASE_URL}/likeget?email=${user.email}`);
            if (!response.ok) {
                throw new Error('Failed to fetch liked posts');
            }
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                const likedPostIds = new Set<string>(data.map((like: { post_id: string }) => like.post_id));
                setLikedPosts(likedPostIds);
            }
        } catch (error: any) {
            setError(error.message);
        }
    }
};