import { API_URL } from '../config';
import { getAuthHeaders } from './authService';
 
 
// Get all employees (for admin/employer)
export const getEmployees = async () => {
    const res = await fetch(`${API_URL}/employers/employees`, {
        headers: getAuthHeaders(),
    });

    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to fetch employees');
    }

    return res.json();
};

// Get only employees of logged-in employer
export const getMyEmployees = async () => {
    const res = await fetch(`${API_URL}/employers/my-employees`, {
        headers: getAuthHeaders(),
    });

    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to fetch employees');
    }

    return res.json();
};

// Suspend/reactivate employee
export const updateEmployee = async (id: number, suspend: boolean) => {
    const res = await fetch(`${API_URL}/employers/${id}/suspend?suspend=${suspend}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
    });

    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to update employee');
    }

    return res.json();
};
