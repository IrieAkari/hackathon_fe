import { Post } from '../types';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchUserPosts = async (setPosts: React.Dispatch<React.SetStateAction<Post[]>>, setError: React.Dispatch<React.SetStateAction<string>>) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        try {
            const response = await fetch(`${API_BASE_URL}/posts?email=${user.email}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user posts');
            }
            const data = await response.json();
            setPosts(data);
        } catch (error: any) {
            setError(error.message);
        }
    }
};