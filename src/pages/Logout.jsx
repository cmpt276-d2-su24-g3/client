import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function Logout() {
    const navigate = useNavigate()
    const token = localStorage.getItem('refresh_token');
    useEffect(() => {
        axios.get(`http//localhost:8080/logout/${token}`)
            .then(response => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('id_token');
                localStorage.removeItem('refresh_token');
                navigate('/')
            }).catch(error => {
                console.error("logout error", error);
                navigate('/logout?error=true');
            });
    }, [navigate]);

    return <div>Loading...</div>;
};

