import { API_URL } from '../config';
import { getAuthHeaders } from './authService';
  

// Get tickets (authenticated)
export const getTickets = async () => {
    const res = await fetch(`${API_URL}/tickets/`, {
        headers: getAuthHeaders(),
    });

    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to fetch tickets');
    }

    return res.json();
};
 