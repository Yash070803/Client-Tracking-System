import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './List.module.css';

const List = ({ isAdmin }) => {
    const [clients, setClients] = useState([]);
    //   const [refreshTrigger, setRefreshTrigger] = useState(0); // trigger to refetch
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/test/clients/', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                console.log('Fetched clients:', res.data);  // to verify data
                setClients(res.data);
            })
            .catch(() => {
                localStorage.removeItem('access_token');
                window.location.href = '/login';
            });
    }, [token]); // Add refreshTrigger as a dependency

    // Listen for a custom event to trigger refresh
    // useEffect(() => {
    //     const handleRefresh = () => setRefreshTrigger(prev => prev + 1);
    //     window.addEventListener('clientDeleted', handleRefresh);
    //     return () => window.removeEventListener('clientDeleted', handleRefresh);
    // }, []);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete the client ${name}?`)) {
            try {
                await axios.delete(`http://localhost:8000/test/clients/${id}/delete/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Update state directly by filtering out the deleted client
                setClients(prevClients => prevClients.filter(client => client.id !== id));
            } catch (error) {
                console.error('Delete error:', error.response?.status, error.response?.data || error.message);
                alert('Failed to delete client: ' + (error.response?.data?.error || 'Unknown error'));
            }
        }
    };

    console.log('isAdmin in Client List:', isAdmin); //

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.logout} id={styles.similar} onClick={() => {
                    localStorage.removeItem('access_token');
                    window.location.href = '/login';
                }}>Logout</button>
                <h2 className={styles.title}>Client List</h2>
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.table} border="1">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Registered Date</th>
                            <th>Address</th>
                            {isAdmin && (
                                <>
                                    <th>Email</th>
                                    <th>Contact No</th>
                                    <th>Actions</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.id}>
                                <td>{client.name_of_client}</td>
                                <td>{new Date(client.registered_date).toLocaleDateString()}</td>
                                <td>{client.address}</td>
                                {isAdmin && (
                                    <>
                                        <td>{client.email}</td>
                                        <td>{client.contact_no}</td>
                                        <td>
                                            <Link to={`/clients/${client.id}/edit`} className={styles.editLink}>Edit </Link>
                                            |
                                            <button onClick={() => handleDelete(client.id, client.name_of_client)}
                                                style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br /><br />
            {isAdmin && <Link to="/clients/create" style={{ textDecoration: "none" }}><button className={styles.addClient} >Add Client</button></Link>}
        </div>
    );
};

export default List;