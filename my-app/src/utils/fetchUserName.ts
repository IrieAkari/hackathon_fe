import { getAuth } from 'firebase/auth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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