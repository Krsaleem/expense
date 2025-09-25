export interface User {
    id: number;
    email: string;
    username: string;
    role: 'employee' | 'employer';
    suspended: boolean;
}

export interface Ticket {
    id: number;
    title: string;
    amount: number;
    date: string;
    created_by: string; // user email
    approved?: boolean;
}

export interface Employee {
    id: number;
    email: string;
    username: string;
    suspended: boolean;
}
