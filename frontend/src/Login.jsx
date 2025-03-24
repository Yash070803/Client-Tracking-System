import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login handler called");
    try {
      const res = await axios.post('http://127.0.0.1:8000/test/api/token/', {username, password});
      localStorage.setItem('access_token', res.data.access);
      setAuth(true);
      navigate('/clients');
    } catch (error) {alert('Login failed. Check credentials.');}
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Login</h2>
        <div className={styles.inputGroup}>
          <input
            className={styles.input}
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <button className={styles.button} onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;