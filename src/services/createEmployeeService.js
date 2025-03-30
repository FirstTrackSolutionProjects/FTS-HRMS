const API_URL = import.meta.env.VITE_APP_API_URL;

const createEmployeeService = async (employeeData, payrollData, roleIds) => {
    try {
        const response = await fetch(`${API_URL}/employees/create`, {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                employee_data: employeeData,
                payroll_data: payrollData,
                role_ids: roleIds
            }),
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
        
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error("An unexpected error occurred");
    }
};

export default createEmployeeService;
