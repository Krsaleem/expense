import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import TicketListPage from './pages/TicketListPage';
import EmployeeListPage from './pages/EmployeeListPage';
import TicketCreatePage from './pages/TicketCreatePage' 
import Header from './pages/Header';
import { getUserFromToken } from './utils/token';
import type { User } from './types';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
    const [userRole, setUserRole] = useState<'E' | 'R' | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (isLoggedIn) {
            const currentUser = getUserFromToken();
             
            if (currentUser) {
                setUser(currentUser);
                setUserRole(currentUser.role);
            } else {
                setIsLoggedIn(false); // invalid token
            }
        }
    }, [isLoggedIn]);

    return (
        <Router>
            {isLoggedIn && user && <Header setIsLoggedIn={setIsLoggedIn} userRole={userRole} user={user} />}
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route
                    path="/login"
                    element={
                        <LoginPage
                            setIsLoggedIn={setIsLoggedIn}
                            setUserRole={setUserRole}
                        />
                    }
                />
                <Route
                    path="/tickets"
                    element={isLoggedIn && userRole === 'E' ? <TicketListPage userRole={userRole} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/employees"
                    element={isLoggedIn && userRole === 'R' ? <EmployeeListPage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/tickets/create"
                    element={isLoggedIn && userRole === 'E' ? <TicketCreatePage /> : <Navigate to="/login" />}
                />
            </Routes>
        </Router>
    );
}

export default App;
