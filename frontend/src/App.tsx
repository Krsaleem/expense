import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import LoginPage from './pages/LoginPage';
import TicketListPage from './pages/TicketListPage';
import EmployeeListPage from './pages/EmployeeListPage';
import { useState } from 'react';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<'employee' | 'employer' | null>(null);

    return (
        <Router>
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
                    element={isLoggedIn ? <TicketListPage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/employees"
                    element={
                        isLoggedIn && userRole === 'employer' ? <EmployeeListPage /> : <Navigate to="/login" />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
