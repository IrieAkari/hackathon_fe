import { Post } from '../types';

const API_BASE_URL = 'https://hackathon-be-509846548823.us-central1.run.app';

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