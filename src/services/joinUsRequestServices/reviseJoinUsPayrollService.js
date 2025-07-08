const API_URL = import.meta.env.VITE_APP_API_URL

const reviseJoinUsPayrollService = async (payroll_data, formData ,join_us_request_id) => {
    try {
        const response = await fetch(`${API_URL}/onboarding/join-us-requests/revise-payroll/${join_us_request_id}`, {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({payrollData: payroll_data, reason: formData?.reason}),
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

export default reviseJoinUsPayrollService;