import { Post } from '../types';

const API_BASE_URL = 'http://localhost:8000';

export const fetchPosts = async (setPosts: React.Dispatch<React.SetStateAction<Post[]>>, setError: React.Dispatch<React.SetStateAction<string>>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
    } catch (error: any) {
        setError(error.message);
    }
};