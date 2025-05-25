const API_URL = import.meta.env.VITE_APP_API_URL;

const checkInService = async (selfie_doc) => {
    try {
        const response = await fetch(`${API_URL}/attendances/check-in`, {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selfie_doc })
        });

        const data = await response.json();
        if (!data?.success) {
            throw new Error(data?.message || 'Failed to check in');
        }

        return data?.data;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error('Failed to check in');
    }
}

export default checkInService;
