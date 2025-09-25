// src/utils/token.ts
import jwtDecode from 'jwt-decode';
import type { User } from '../types';

export const getUserFromToken = (): User | null => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
        const decoded: any = jwtDecode(token); // decode payload
        // payload should contain at least: id, email, username, role
        return {
            id: 0, // You don't have ID in token, optional: fetch from backend if needed
            email: decoded.sub, // 'sub' contains email
            username: decoded.sub.split('@')[0], // optional, generate from email
            role: decoded.role,
            suspended: false, 
        };
    } catch (err) {
        console.error('Invalid token', err);
        return null;
    }
};
