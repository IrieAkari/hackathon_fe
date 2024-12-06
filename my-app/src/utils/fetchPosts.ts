import { Post } from '../types';

const API_BASE_URL = 'https://hackathon-be-509846548823.us-central1.run.app';

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