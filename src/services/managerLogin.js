
const API_URL = import.meta.env.VITE_APP_API_URL
const login = async (formData) => {
    try {
      const registerRequest = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await registerRequest.json();
      console.log(data);
      return data;
    } catch (err) {
      return err;
    }
  };
  
  export default login;
  