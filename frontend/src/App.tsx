import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import TicketListPage from './pages/TicketListPage';
import EmployeeListPage from './pages/EmployeeListPage';
import { useState } from 'react';
import Header from './pages/Header';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
    const [userRole, setUserRole] = useState<'E' | 'R' | null>(null);

    return (
        <Router>
            {isLoggedIn && <Header setIsLoggedIn={setIsLoggedIn} userRole={userRole} />}
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
                    element={isLoggedIn && userRole === 'E' ? <TicketListPage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/employees"
                    element={isLoggedIn && userRole === 'R' ? <EmployeeListPage /> : <Navigate to="/login" />}
                />
            </Routes>
        </Router>
    );
}

export default App;
