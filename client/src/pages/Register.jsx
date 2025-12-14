import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '', // <--- NEW STATE
    role: 'student'
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      alert("Registration failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleRegister} style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <h1 style={{ marginTop: 0, fontSize: '2rem' }}>Create Account 🚀</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input name="name" placeholder="Full Name (or Shop Name)" onChange={handleChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
            
            {/* NEW ADDRESS INPUT */}
            <input 
              name="address" 
              placeholder="Address (e.g. Block A, Shop 4)" 
              onChange={handleChange} 
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} 
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', color: '#333' }}>I am a:</label>
                <select name="role" onChange={handleChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'white' }}>
                    <option value="student">Buyer (Student/User)</option>
                    <option value="restaurant">Seller (Restaurant/Shop)</option>
                </select>
            </div>
        </div>

        <button type="submit" style={{ marginTop: '20px', width: '100%', padding: '12px', backgroundColor: '#2e7d32', color: 'white', fontSize: '1.1rem' }}>
          Register
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          Already have an account? <Link to="/login" style={{ color: '#2e7d32', fontWeight: 'bold', textDecoration: 'none' }}>Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;