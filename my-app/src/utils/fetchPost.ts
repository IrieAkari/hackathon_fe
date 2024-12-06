import { Post } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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