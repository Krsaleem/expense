import { useEffect, useState } from 'react';
import { getTickets } from '../api/ticketService';
import type { Ticket } from '../types';
import { Link } from 'react-router-dom';

interface TicketListPageProps {
    userRole: 'E' | 'R';
}

function TicketListPage({ userRole }: TicketListPageProps) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTickets(userRole);
                setTickets(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch tickets');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userRole]);

    if (loading) return <div>Loading tickets...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: 20 }}>
            <h1>Tickets</h1>
            <div
                style={{
                    display: 'grid',
                    gap: 20,
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                }}
            >
                {tickets.map((ticket) => {
                    let bgColor = '#f9f9f9';
                    let textColor = '#000';

                    if (ticket.approved === null || ticket.approved === undefined) {
                        bgColor = '#fff8c4'; // light yellow for Pending
                        textColor = '#5a4d00';
                    } else if (ticket.approved) {
                        bgColor = '#d4edda'; // light green for Approved
                        textColor = '#155724';
                    } else {
                        bgColor = '#f8d7da'; // light red for Denied
                        textColor = '#721c24';
                    }

                    return (
                        <div
                            key={ticket.id}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: 8,
                                padding: 15,
                                backgroundColor: bgColor,
                                color: textColor,
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            }}
                        >
                            <h3 style={{ margin: '0 0 10px 0' }}>{ticket.description}</h3>
                            <p><strong>Amount:</strong> ${ticket.amount}</p>
                            <p><strong>By:</strong> {ticket.owner.username} ({ticket.owner.email})</p>
                            <p><strong>Created At:</strong> {new Date(ticket.created_at).toLocaleString()}</p>
                            <p>
                                <strong>Link:</strong>{' '}
                                {ticket.link ? (
                                    <a href={ticket.link} target="_blank" rel="noopener noreferrer">
                                        View
                                    </a>
                                ) : (
                                    'N/A'
                                )}
                            </p>
                            <p><strong>Status:</strong> {ticket.approved === null || ticket.approved === undefined
                                ? 'Pending'
                                : ticket.approved
                                    ? 'Approved'
                                    : 'Denied'}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );


}

export default TicketListPage;
