import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // state for error messaging
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login handler called");
    try {
      const res = await axios.post('http://127.0.0.1:8000/test/api/token/', { username, password });
      localStorage.setItem('access_token', res.data.access);
      setAuth(true);
      navigate('/clients');
    } catch (error) { setError('Invalid credentials'); } //set error message on failure
  };

  //This helps in clearing the error when I modify the input fields
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setError(''); //reset error on input change
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              value={username}
              onChange={handleInputChange(setUsername)}
              placeholder="Username"
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={handleInputChange(setPassword)}
              placeholder="Password"
            />
          </div>
          <button className={styles.button} onClick={handleLogin}>Login</button>
          {error && <span className={styles.error}>{error}</span>}
        </form>
      </div>
    </div>
  );
};

export default Login;