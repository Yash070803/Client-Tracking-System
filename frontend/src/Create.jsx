// src/components/ClientCreate.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Create = () => {
  const [client, setClient] = useState({
    name_of_client: '',
    email: '',
    contact_no: '',
    address: '',
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await axios.post('http://127.0.0.1:8000/test/clients/create/', client, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    navigate('/clients');
  };

  return (
    <div>
      <h2>Add New Client</h2>
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

export default Create;