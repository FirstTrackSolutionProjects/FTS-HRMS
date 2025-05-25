const API_URL = import.meta.env.VITE_APP_API_URL;

const endOfficialBreakService = async () => {
    try {
        const response = await fetch(`${API_URL}/attendances/end-official-break`, {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
            }
        });

        const data = await response.json();
        if (!data?.success) {
            throw new Error(data?.message || 'Failed to end official break');
        }

        return data?.data;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error('Failed to end official break');
    }
}

export default endOfficialBreakService;
