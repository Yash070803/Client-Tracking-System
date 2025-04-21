import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import styles from './List.module.css';

Modal.setAppElement('#root');

const List = ({ isAdmin }) => {
    const [clients, setClients] = useState([]);
    const [modalOpen, setModalOpen] = useState(null);
    const [editClient, setEditClient] = useState(null);
    const [newClient, setNewClient] = useState({
        name_of_client: '',
        email: '',
        contact_no: '',
        address: '',
    });
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

    const handleChange = (e, isEdit = false) => {
        const { name, value } = e.target;
        if (isEdit) setEditClient(prev => ({ ...prev, [name]: value }));
        else setNewClient(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/test/clients/create/', newClient, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const res = await axios.get('http://127.0.0.1:8000/test/clients/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClients(res.data);
            setNewClient({ name_of_client: '', email: '', contact_no: '', address: '' }); // Resetting the form
            setModalOpen(null); //closing the modal here
        } catch (error) { alert('Failed to create client: ' + (error.response?.data?.error || 'Unknown error')) };
    };

    const handleEditSubmit = async e => {
        e.preventDefault();
        try {
            const { registered_date, ...dataToSave } = editClient; // Exclude registered_date
            await axios.put(`http://localhost:8000/test/clients/${editClient.id}/edit/`, dataToSave, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // Refetch clients to update the list
            const res = await axios.get('http://127.0.0.1:8000/test/clients/', {
                headers: { Authorization: `Bearer ${token}` },
            });

            setClients(res.data);
            setModalOpen(null); // Closing the modal here

        } catch (error) {
            console.error('Error updating client:', error);
            alert('Failed to save. Check console for details.');
        }
    };

    //Edit modal with the client data
    const openEditModal = client => {
        setEditClient(client);
        setModalOpen('edit');
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
                                            <button
                                                onClick={() => openEditModal(client)}
                                                className={styles.editLink}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                            >
                                                Edit
                                            </button>
                                            |
                                            <button
                                                onClick={() => handleDelete(client.id, client.name_of_client)}
                                                style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
                                            >
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

            {isAdmin && (
                <button className={styles.addClient} onClick={() => setModalOpen('create')}>
                    Add Client
                </button>
            )}


            {/* Create Client Modal */}
            <Modal
                isOpen={modalOpen === 'create'}
                onRequestClose={() => setModalOpen(null)}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: '400px',
                        padding: '2rem',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
                    },
                }}
                shouldCloseOnOverlayClick={false} // Prevent closing on overlay click
            >
                <h2 style={{ textAlign: 'center' }}>Add New Client</h2>                
                <form onSubmit={handleCreateSubmit}>
                    <div className={styles.inputGroup}>
                        <input
                            name="name_of_client"
                            value={newClient.name_of_client}
                            onChange={e => handleChange(e)}
                            placeholder="Name"
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            name="email"
                            value={newClient.email}
                            onChange={e => handleChange(e)}
                            placeholder="Email"
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            name="contact_no"
                            value={newClient.contact_no}
                            onChange={e => handleChange(e)}
                            placeholder="Contact No"
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <textarea
                            name="address"
                            value={newClient.address}
                            onChange={e => handleChange(e)}
                            placeholder="Address"
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.saveButton}>
                            Save
                        </button>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={() => setModalOpen(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Client Modal */}
            <Modal
                isOpen={modalOpen === 'edit'}
                onRequestClose={() => setModalOpen(null)}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: '400px',
                        padding: '2rem',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                }}
                shouldCloseOnOverlayClick={false}
            >
                <h2 style={{ textAlign: 'center' }}>Edit Client</h2>
                <form onSubmit={handleEditSubmit}>
                    <div className={styles.inputGroup}>
                        <input
                            name="name_of_client"
                            value={editClient?.name_of_client || ''}
                            onChange={e => handleChange(e, true)}
                            placeholder="Name"
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            name="email"
                            value={editClient?.email || ''}
                            onChange={e => handleChange(e, true)}
                            placeholder="Email"
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            name="contact_no"
                            value={editClient?.contact_no || ''}
                            onChange={e => handleChange(e, true)}
                            placeholder="Contact No"
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <textarea
                            name="address"
                            value={editClient?.address || ''}
                            onChange={e => handleChange(e, true)}
                            placeholder="Address"
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.saveButton}>
                            Save
                        </button>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={() => setModalOpen(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

        </div>
    );
};

export default List;