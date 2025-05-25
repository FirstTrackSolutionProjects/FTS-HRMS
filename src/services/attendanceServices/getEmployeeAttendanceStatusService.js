const API_URL = import.meta.env.VITE_APP_API_URL;

const getEmployeeAttendanceStatusService = async () => {
    try {
        const response = await fetch(`${API_URL}/attendances/employee-status`, {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
            }
        });

        const data = await response.json();
        if (!data?.success) {
            throw new Error(data?.message || 'Failed to get attendance status');
        }

        return data?.data;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error('Failed to get attendance status');
    }
}

export default getEmployeeAttendanceStatusService;
