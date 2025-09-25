// Helper to get Authorization header
export  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('No access token found');
    return { Authorization: `Bearer ${token}` };
};

