const API_URL = import.meta.env.VITE_APP_API_URL;

const getEmployeeAttendanceService = async () => {
    try {
        const response = await fetch(`${API_URL}/attendances/employee-all`, {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
            }
        });

        const data = await response.json();
        if (!data?.success) {
            throw new Error(data?.message || 'Something Went Wrong');
        }

        return data?.data;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
}

export default getEmployeeAttendanceService;
