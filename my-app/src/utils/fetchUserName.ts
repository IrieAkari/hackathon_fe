import { getAuth } from 'firebase/auth';

const API_BASE_URL = 'https://hackathon-be-509846548823.us-central1.run.app';

export const fetchUserName = async (setName: React.Dispatch<React.SetStateAction<string>>, setError: React.Dispatch<React.SetStateAction<string>>) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        try {
            const response = await fetch(`${API_BASE_URL}/useremail?email=${user.email}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user name');
            }
            const data = await response.json();
            if (data.length > 0) {
                setName(data[0].name);
            } else {
                setName('No Name');
            }
        } catch (error: any) {
            setError(error.message);
        }
    }
};