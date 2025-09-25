import { useState } from 'react';
import { createTicket } from '../api/ticketService';
import { useNavigate } from 'react-router-dom';

function TicketCreatePage() {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [link, setLink] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await createTicket({
                description,
                amount: parseFloat(amount),
                link: link || undefined
            });
            navigate('/tickets'); // Go back to ticket list
        } catch (err: any) {
            setError(err.message || 'Failed to create ticket');
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Create Ticket</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Description:</label> <br />
                    <input value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div>
                    <label>Amount:</label> <br />
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Link (optional):</label> <br />
                    <input value={link} onChange={(e) => setLink(e.target.value)} />
                </div>
                <button type="submit" style={{ marginTop: 10 }}>Create Ticket</button>
            </form>
        </div>
    );
}

export default TicketCreatePage;
