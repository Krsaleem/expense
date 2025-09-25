import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
    setIsLoggedIn: (val: boolean) => void;
    setUserRole: (role: 'employee' | 'employer') => void;
}

function LoginPage({ setIsLoggedIn, setUserRole }: LoginPageProps) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const res = await fetch('http://127.0.0.1:8000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            const data = await res.json();
            setIsLoggedIn(true); // ✅ update App state
            setUserRole(data.user.role); // ✅ set role
            navigate(data.user.role === 'employee' ? '/tickets' : '/employees'); // navigate
        } else {
            alert('Login failed');
        }
    };

    return (
        

         <div style={{ padding: 20 }}>
            <h1>Login / Register</h1>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>Login</button> 
        </div>
    );
}

export default LoginPage;
