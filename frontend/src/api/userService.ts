import { API_URL } from '../config';
import { getAuthHeaders } from './authService';
import axios from 'axios'; 

 
// Login with form-data
export const loginUser = async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
    });

    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Login failed');
    }

    return res.json();
};

// Register
export const registerUser = async (data: any) => {
    const res = await axios.post(`${API_URL}/users/register`, data);
    return res.data;
};

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
