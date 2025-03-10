const API_URL = import.meta.env.VITE_APP_API_URL

const getPermissionsService = async () => {
    try {
        const response = await fetch(`${API_URL}/permissions/all`, {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching permissions:', error);
        throw new Error('Failed to fetch permissions')
    }
}

export default getPermissionsService;