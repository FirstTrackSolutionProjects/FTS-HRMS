
const API_URL = import.meta.env.VITE_APP_API_URL
const validateTokenService = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/validate`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem('token'),
      }
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

    return data?.data;
  } catch (error) {
    console.error(error);
    throw error instanceof Error ? error : new Error("An unexpected error occurred");
  }
};

export default validateTokenService;
