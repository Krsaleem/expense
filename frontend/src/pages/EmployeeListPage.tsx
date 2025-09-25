import React, { useEffect, useState } from 'react';
import { getEmployees, updateEmployee } from '../api/api';
import { type Employee } from '../types';

function EmployeeListPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getEmployees();
            setEmployees(data);
        };
        fetchData();
    }, []);

    const toggleSuspend = async (id: number) => {
        const emp = employees.find(e => e.id === id);
        if (!emp) return;
        const updated = await updateEmployee(id, { suspended: !emp.suspended });
        setEmployees(prev =>
            prev.map(e => (e.id === id ? { ...e, suspended: updated.suspended } : e))
        );
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Employees</h1>
            <ul>
                {employees.map(emp => (
                    <li key={emp.id}>
                        {emp.username} ({emp.email}) - {emp.suspended ? 'Suspended' : 'Active'}{' '}
                        <button onClick={() => toggleSuspend(emp.id)}>Toggle</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default EmployeeListPage;
