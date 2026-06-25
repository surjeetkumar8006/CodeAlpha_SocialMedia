import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('social_user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('http://localhost:5001/api/auth/login', { email, password });
        setUser(res.data.user);
        localStorage.setItem('social_user', JSON.stringify(res.data.user));
        localStorage.setItem('social_token', res.data.token);
    };

    const register = async (name, email, password) => {
        const res = await axios.post('http://localhost:5001/api/auth/register', { name, email, password });
        setUser(res.data.user);
        localStorage.setItem('social_user', JSON.stringify(res.data.user));
        localStorage.setItem('social_token', res.data.token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('social_user');
        localStorage.removeItem('social_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
