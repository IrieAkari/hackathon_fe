import { Post } from '../types';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchReplies = async (parentId: string, setReplies: React.Dispatch<React.SetStateAction<Post[]>>, setError: React.Dispatch<React.SetStateAction<string>>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/replys?parentid=${parentId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch replies');
        }
        const data = await response.json();
        setReplies(data);
    } catch (error: any) {
        setError(error.message);
    }
};