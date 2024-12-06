import { Post } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchParentPost = async (parentId: string, setParentPost: React.Dispatch<React.SetStateAction<Post | null>>, setError: React.Dispatch<React.SetStateAction<string>>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/postget?postid=${parentId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch parent post');
        }
        const data = await response.json();
        setParentPost(data);
    } catch (error: any) {
        setError(error.message);
    }
};