
const API_URL = import.meta.env.VITE_APP_API_URL;

const updateShiftService = async (shift_id, shift) => {
    try {
        const response = await fetch(`${API_URL}/shifts/update/${shift_id}`, {
            method: 'PUT',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(shift)
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
        throw error instanceof Error ? error : new Error("An unexpected error occurred");
    }
}

export default updateShiftService;