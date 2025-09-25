import { API_URL } from '../config';
import { getAuthHeaders } from './authService';
import axios from 'axios'; 
import type { User } from '../types';
 
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

export const getCurrentUser = async (): Promise<User> => {
    const res = await fetch(`${API_URL}/users/me`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        throw new Error('Failed to fetch current user');
    }
    return res.json();
};