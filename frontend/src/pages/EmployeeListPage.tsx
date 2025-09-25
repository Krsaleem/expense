import  { useEffect, useState } from 'react'; 
import { getMyEmployees, updateEmployee } from '../api/employerService';
import { type Employee } from '../types';

function EmployeeListPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getMyEmployees(); // fetch only employees of logged-in employer
                setEmployees(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch employees');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleSuspend = async (id: number) => {
        const emp = employees.find(e => e.id === id);
        if (!emp) return;

        try {
            const updated = await updateEmployee(id, !emp.suspended);
            setEmployees(prev =>
                prev.map(e => (e.id === id ? { ...e, suspended: updated.suspended } : e))
            );
        } catch (err: any) {
            alert(err.message || 'Failed to update employee');
        }
    };

    if (loading) return <div>Loading employees...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: 20 }}>
            <h1>My Employees</h1>
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
