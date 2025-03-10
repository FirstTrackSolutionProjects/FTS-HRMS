const API_URL = import.meta.env.VITE_APP_API_URL
const getAllRoles = async () => {
    try {
        const response = await fetch(`${API_URL}/roles/all`,{
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
            }
        });
        const data = await response.json();
        return data?.roles;
    } catch (error) {
        console.error('Error:', error);
    }
}

export default getAllRoles;