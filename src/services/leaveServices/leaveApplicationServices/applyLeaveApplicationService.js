const API_URL = import.meta.env.VITE_APP_API_URL

const applyLeaveApplicationService = async (leave_application_data, leave_policy_id) => {
    try {
        const response = await fetch(`${API_URL}/leaves/apply-leave/${leave_policy_id}`, {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leave_application_data),
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

export default applyLeaveApplicationService;