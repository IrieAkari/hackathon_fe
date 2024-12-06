import { Post } from '../types';

const API_BASE_URL = 'https://hackathon-be-509846548823.us-central1.run.app';

export const fetchPost = async (postId: string, setPost: React.Dispatch<React.SetStateAction<Post | null>>, setError: React.Dispatch<React.SetStateAction<string>>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/postget?postid=${postId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data);
    } catch (error: any) {
        setError(error.message);
    }
};