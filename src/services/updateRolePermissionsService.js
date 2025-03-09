const API_URL = import.meta.env.VITE_APP_API_URL

const updateRolePermissionsService = async (role_id, permissions) => {
    try {
        const response = await fetch(`${API_URL}/roles/assign-permissions/${role_id}`, {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                permissions : permissions
            }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Error updating role permissions: ${error.message}`);
    }
}

export default updateRolePermissionsService;