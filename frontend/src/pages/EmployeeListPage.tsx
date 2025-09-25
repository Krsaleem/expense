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

    const tableHeaderStyle: React.CSSProperties = {
        textAlign: 'left',
        padding: '10px',
        borderBottom: '2px solid #333',
    };

    const tableCellStyle: React.CSSProperties = {
        padding: '10px',
        textAlign: 'left',

    };
    return (
        <div style={{ padding: 20 }}>
            <h1>My Employees</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={tableHeaderStyle}>Username</th>
                        <th style={tableHeaderStyle}>Email</th>
                        <th style={tableHeaderStyle}>Status</th>
                        <th style={tableHeaderStyle}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={tableCellStyle}>{emp.username}</td>
                            <td style={tableCellStyle}>{emp.email}</td>
                            <td style={tableCellStyle}>
                                <span style={{ color: emp.suspended ? 'red' : 'green' }}>
                                    {emp.suspended ? 'Suspended' : 'Active'}
                                </span>
                            </td>
                            <td style={tableCellStyle}>
                                <button
                                    style={{
                                        padding: '5px 10px',
                                        borderRadius: 5,
                                        border: 'none',
                                        backgroundColor: '#007bff',
                                        color: '#fff',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => toggleSuspend(emp.id)}
                                >
                                    Toggle
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ); 

}

export default EmployeeListPage;
