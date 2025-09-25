import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export const loginUser = async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/users/login`, { email, password });
    return res.data;
};

export const registerUser = async (data: any) => {
    const res = await axios.post(`${API_URL}/users/register`, data);
    return res.data;
};

export const getTickets = async () => {
    const res = await axios.get(`${API_URL}/tickets`);
    return res.data;
};

export const getEmployees = async () => {
    const res = await axios.get(`${API_URL}/employees`);
    return res.data;
};

export const updateEmployee = async (id: number, data: any) => {
    const res = await axios.patch(`${API_URL}/employees/${id}`, data);
    return res.data;
};
