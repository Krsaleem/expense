import React from 'react';
import { useNavigate } from 'react-router-dom';
import { type User } from '../types';

interface HeaderProps {
    setIsLoggedIn: (val: boolean) => void;
    userRole: 'E' | 'R' | null;
    user?: User; // add user prop
}

const Header: React.FC<HeaderProps> = ({ setIsLoggedIn, userRole, user }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <header
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 20px',
                background: '#eee',
            }}
        >
            {/* Left section: App name + buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <strong>My App</strong>

                {userRole === 'R' && (
                    <>
                        <button onClick={() => navigate('/employees')}>Employees</button>
                        <button onClick={() => navigate('/tickets', { state: { userRole } }) }>Tickets</button>
                    </>
                )}
            </div>

            {/* Right section: User info + logout */}
            {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span>
                        {user.username} ({user.email}) - {user.role === 'R' ? 'Employer' : 'Employee'}
                    </span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </header>
    );
};

export default Header;
