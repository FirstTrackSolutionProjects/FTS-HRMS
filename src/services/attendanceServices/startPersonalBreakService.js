const API_URL = import.meta.env.VITE_APP_API_URL;

const startPersonalBreakService = async () => {
    try {
        const response = await fetch(`${API_URL}/attendances/start-personal-break`, {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ break_name : "REFRESHMENT"})
        });

        const data = await response.json();
        if (!data?.success) {
            throw new Error(data?.message || 'Failed to start personal break');
        }

        return data?.data;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error('Failed to start personal break');
    }
}

export default startPersonalBreakService;
