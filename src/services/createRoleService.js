
const API_URL = import.meta.env.VITE_APP_API_URL

const createRoleService = async (roleName) => {
    try {
        const response = await fetch(`${API_URL}/roles/create`, {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role_name : roleName }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to create role');
    }
}

export default createRoleService;