const API_URL = import.meta.env.VITE_APP_API_URL;

const updatePayrollComponentPolicyService = async (components) => {
    try {
        const response = await fetch(`${API_URL}/payrolls/components/policies`, {
            method: 'PUT',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ components })
        });
        
        const data = await response.json();
        
        if (!data?.success) {
            throw new Error(data?.message || 'Failed to update payroll components');
        }

        return data;
    } catch (error) {
        console.error('Error in updatePayrollComponentPolicyService:', error);
        throw error instanceof Error ? error : new Error('Failed to update payroll components');
    }
};

export default updatePayrollComponentPolicyService;