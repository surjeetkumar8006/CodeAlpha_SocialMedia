import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            alert('Registration failed.');
        }
    };

    return (
        <div className="card" style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--primary-color)' }}>Join Connect</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>Register</button>
            </form>
        </div>
    );
};

export default Register;
