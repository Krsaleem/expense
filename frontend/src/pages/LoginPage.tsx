import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/userService';

interface LoginPageProps {
    setIsLoggedIn: (val: boolean) => void;
    setUserRole: (role: 'E' | 'R') => void;
}

function LoginPage({ setIsLoggedIn, setUserRole }: LoginPageProps) {
    const navigate = useNavigate();
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const data = await loginUser(usernameOrEmail, password);

            // Save token and update state
            localStorage.setItem('access_token', data.access_token);
            setIsLoggedIn(true);
            setUserRole(data.user.role as 'E' | 'R');

            // Navigate based on role
            if (data.user.role === 'E') navigate('/tickets');
            else if (data.user.role === 'R') navigate('/employees');
        } catch (err: any) {
            alert(err.message || 'Login failed');
        }
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
