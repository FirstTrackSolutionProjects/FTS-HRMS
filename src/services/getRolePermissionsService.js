const API_URL = import.meta.env.VITE_APP_API_URL

const getRolePermissionsService = async (role_id)=>{
    try{
        const response = await fetch(`${API_URL}/roles/permissions/${role_id}`,{
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
            }
        });
        const data = await response.json();
        return data;
    }catch(error){
        console.error(error);
        throw new Error('Unable to fetch permissions for role')
    }
 }

 export default getRolePermissionsService;