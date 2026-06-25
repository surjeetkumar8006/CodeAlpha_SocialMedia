import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="nav-brand">
                    Connect
                </Link>
                <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {user ? (
                        <>
                            <Link to={`/profile/${user.id}`} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <UserIcon size={20} /> Profile
                            </Link>
                            <button onClick={handleLogout} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register" className="btn">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
