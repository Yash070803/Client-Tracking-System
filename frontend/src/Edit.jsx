import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Edit = () => {
  const [client, setClient] = useState({
    name_of_client: '',
    registered_date: '',
    email: '',
    contact_no: '',
    address: '',
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    axios.get('http://localhost:8000/test/clients/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        const clientData = res.data.find(c => c.id === parseInt(id));
        setClient(clientData);
      })
      .catch(() => navigate('/login'));
  }, [id, token, navigate]);

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log('Saving to:', `http://localhost:8000/test/clients/${id}/edit/`);
    console.log('Data:', client);
    const { registered_date, ...dataToSave } = client; // Exclude registered_date
    try{
        await axios.put(`http://localhost:8000/test/clients/${id}/edit/`, dataToSave, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        navigate('/clients');
    } catch(error){
        console.error('Error updating client:', error);
        alert('Failed to save. Check console for details.');
    }
  };

  return (
    <div>
      <h2>Edit Client</h2>
      <input
        name="name_of_client"
        value={client.name_of_client}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        name="email"
        value={client.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="contact_no"
        value={client.contact_no}
        onChange={handleChange}
        placeholder="Contact No"
      />
      <textarea
        name="address"
        value={client.address}
        onChange={handleChange}
        placeholder="Address"
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={() => navigate('/clients')}>Cancel</button>
    </div>
  );
};

export default Edit;