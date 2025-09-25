import { useEffect, useState } from 'react';
import { getTickets } from '../api/ticketService';
import { type Ticket } from '../types';

function TicketListPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTickets();
                setTickets(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch tickets');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading tickets...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: 20 }}>
            <h1>Tickets</h1>
            <ul>
                {tickets.map((ticket) => (
                    <li key={ticket.id}>
                        {ticket.description} - ${ticket.amount} by {ticket.created_by} -{' '}
                        {ticket.approved === undefined
                            ? 'Pending'
                            : ticket.approved
                                ? 'Approved'
                                : 'Denied'}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TicketListPage;
