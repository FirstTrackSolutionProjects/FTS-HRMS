const API_URL = import.meta.env.VITE_APP_API_URL

const createShiftService = async (shift_data, process_id) => {
    try {
        const response = await fetch(`${API_URL}/shifts/create/${process_id}`, {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(shift_data),
        });
        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error("Something went wrong");
        }

        if (!data?.success) {
            throw new Error(data?.message);
        }

        return data?.data;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error?.message : new Error("An unexpected error occurred");
    }
}

export default createShiftService;