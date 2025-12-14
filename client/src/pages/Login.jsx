import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('userType', res.data.userType);
      
      // Redirect based on user type
      if (res.data.userType === 'restaurant') {
        navigate('/dashboard');
      } else {
        navigate('/home');
      }
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    // The 'container' class here centers it and applies general padding
    <div className="container" style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* This inline style makes it look like a card */}
      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <h1 style={{ marginTop: 0, fontSize: '2rem' }}>Welcome Back 👋</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Login to continue</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
        </div>

        <button type="submit" style={{ marginTop: '20px', width: '100%', padding: '12px', backgroundColor: '#2e7d32', color: 'white', fontSize: '1.1rem' }}>
          Login
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          New user? <Link to="/register" style={{ color: '#2e7d32', fontWeight: 'bold', textDecoration: 'none' }}>Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;