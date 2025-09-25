import { API_URL } from '../config';
import { getAuthHeaders } from './authService';
import type { Ticket, TicketCreate } from '../types/index';

// Get all tickets (employees see only own, employers see all)
export const getTickets = async (role: 'E' | 'R'): Promise<Ticket[]> => {
    const endpoint = role === 'E' ? 'tickets/me' : 'tickets';
    const res = await fetch(`${API_URL}/${endpoint}`, {
        headers: getAuthHeaders(),
    });

    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to fetch tickets');
    }

    return res.json();
};

// Create ticket (employees only)
export const createTicket = async (ticket: TicketCreate): Promise<Ticket> => {
    const res = await fetch(`${API_URL}/tickets/`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
    });

    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to create ticket');
    }

    return res.json();
};
