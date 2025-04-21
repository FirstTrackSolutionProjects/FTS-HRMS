const API_URL = import.meta.env.VITE_APP_API_URL;

const getPayrollDateSettingsService = async () => {
    try {
        const response = await fetch(`${API_URL}/payrolls/date-settings`, {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (!data?.success) {
            throw new Error(data?.message || 'Failed to fetch payroll date settings');
        }

        return data;
    } catch (error) {
        console.error('Error in getPayrollDateSettingsService:', error);
        throw error instanceof Error ? error : new Error('Failed to fetch payroll date settings');
    }
};

export default getPayrollDateSettingsService;