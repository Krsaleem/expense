import React, { useEffect, useState } from 'react';
import { getTickets } from '../api/api';
import { type Ticket } from '../types';

function TicketListPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getTickets();
            setTickets(data);
        };
        fetchData();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h1>Tickets</h1>
            <ul>
                {tickets.map(ticket => (
                    <li key={ticket.id}>
                        {ticket.title} - ${ticket.amount} by {ticket.created_by} -{' '}
                        {ticket.approved === undefined ? 'Pending' : ticket.approved ? 'Approved' : 'Denied'}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TicketListPage;
