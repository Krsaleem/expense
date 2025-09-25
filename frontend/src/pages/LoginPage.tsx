import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
    setIsLoggedIn: (val: boolean) => void;
    setUserRole: (role: 'E' | 'R') => void;
}

function LoginPage({ setIsLoggedIn, setUserRole }: LoginPageProps) {
    const navigate = useNavigate();
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const formData = new URLSearchParams();
        formData.append('username', usernameOrEmail); // must match FastAPI Form parameter
        formData.append('password', password);

        const res = await fetch('http://127.0.0.1:8000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
        });

        if (!res.ok) {
            const errData = await res.json();
            alert(errData.detail || 'Login failed');
            return;
        }

        const data = await res.json();
        localStorage.setItem('access_token', data.access_token);
        setIsLoggedIn(true);
        setUserRole(data.user.role as 'E' | 'R');

        if (data.user.role === 'E') navigate('/tickets');
        else if (data.user.role === 'R') navigate('/employees');
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Login / Register</h1>
            <input
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Username or Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default LoginPage;
