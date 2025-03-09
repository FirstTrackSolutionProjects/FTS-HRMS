const API_URL = import.meta.env.VITE_APP_API_URL

const updateRoleService = async (role_id, new_role_name) => {
    try {
        const response = await fetch(`${API_URL}/roles/update/${role_id}`, {
            method: 'PUT',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                role_name: new_role_name
            }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to update role');
    }
}

export default updateRoleService;