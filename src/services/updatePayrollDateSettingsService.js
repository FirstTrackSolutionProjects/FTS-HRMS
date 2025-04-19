const API_URL = import.meta.env.VITE_APP_API_URL;

const updatePayrollDateSettingsService = async ({ cycle_day, verification_days }) => {
    try {
        const response = await fetch(`${API_URL}/payrolls/date-settings`, {
            method: 'PUT',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cycle_day, verification_days })
        });
        
        const data = await response.json();
        
        if (!data?.success) {
            throw new Error(data?.message || 'Failed to update payroll date settings');
        }

        return data;
    } catch (error) {
        console.error('Error in updatePayrollDateSettingsService:', error);
        throw error instanceof Error ? error : new Error('Failed to update payroll date settings');
    }
};

export default updatePayrollDateSettingsService;