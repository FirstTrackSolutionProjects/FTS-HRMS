const API_URL = import.meta.env.VITE_APP_API_URL

const deleteRoleService = async (role_id) => {
    try {
        const response = await fetch(`${API_URL}/roles/${role_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to delete role')
    }
}

export default deleteRoleService;