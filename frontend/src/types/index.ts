export interface User {
    id: number;
    email: string;
    username: string;
    role: 'R' | 'E';
    suspended: boolean;
}

export interface Ticket {
    id: number;
    description: string;
    amount: number;
    created_at: string;
    approved?: boolean;
    owner: User;
    link?: string;   
}

export interface Employee {
    id: number;
    email: string;
    username: string;
    suspended: boolean;
}

export interface TicketCreate {
    description: string;
    amount: number;
    link?: string; // optional
} 