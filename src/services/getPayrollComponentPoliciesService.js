const API_URL = import.meta.env.VITE_APP_API_URL;

const getPayrollComponentPoliciesService = async () => {
    try {
        const response = await fetch(`${API_URL}/payrolls/components/policies`, {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (!data?.success) {
            throw new Error(data?.message || 'Failed to fetch payroll policies');
        }

        return data?.data;
    } catch (error) {
        console.error('Error in getPayrollComponentPoliciesService:', error);
        throw error instanceof Error ? error : new Error('Failed to fetch payroll policies');
    }
};

export default getPayrollComponentPoliciesService;
