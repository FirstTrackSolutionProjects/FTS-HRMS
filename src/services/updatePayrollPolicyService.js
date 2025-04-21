const API_URL = import.meta.env.VITE_APP_API_URL;

const updatePayrollPolicyService = async (policyData) => {
    try {
        const response = await fetch(`${API_URL}/payroll-policy/update`, {
            method: 'PUT',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(policyData),
        });

        const data = await response.json();
        if (!data?.success) {
            throw new Error(data?.message || 'Failed to update payroll policy');
        }

        return data;
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error("An unexpected error occurred");
    }
};

export default updatePayrollPolicyService;