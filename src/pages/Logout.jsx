import React, { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export function Logout() {
    console.log("Logging Out");
    const navigate = useNavigate()
    useEffect(() => {
        axios.get(`http://localhost:8080/test/logout`, { withCredentials: true })
            .then(response => {
                Cookies.remove('access_token');
                Cookies.remove('id_token');
                Cookies.remove('refresh_token');
                navigate('/')
            }).catch(error => {
                console.error("logout error", error);
                navigate('/logout?error=true');
            });
    }, [navigate]);

    return <div>Loading...</div>;
};

