export interface User {
    id: number;
    email: string;
    username: string;
    role: 'R' | 'E';
    suspended: boolean;
}

export interface Ticket {
    id: number;
    title: string;
    description:string
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
