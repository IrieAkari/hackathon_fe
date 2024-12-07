const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * ユーザーIDからユーザー名を取得し、セットする関数。
 * 
 * @param userId - ユーザーのID。
 * @param setUserName - ユーザー名をセットするための関数。
 * @param setError - エラーメッセージをセットするための関数。
 */
export const fetchUserNameById = async (userId: string, setUserName: React.Dispatch<React.SetStateAction<string>>, setError: React.Dispatch<React.SetStateAction<string>>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/user?id=${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user name');
        }
        const data = await response.json();
        if (data.length > 0) {
            setUserName(data[0].name);
        } else {
            setUserName('Unknown User');
        }
    } catch (error: any) {
        setError(error.message);
    }
};