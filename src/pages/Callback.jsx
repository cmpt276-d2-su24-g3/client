import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function Callback() {
    const navigate = useNavigate()
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            const tokenUrl = `https://yyc-portal.auth.us-west-2.amazoncognito.com/oauth2/token`;
            const data = {
                grant_type: 'authorization_code',
                client_id: '481g1a0ridauh779f34tvsti05',
                redirect_uri: 'http://localhost:5173/callback',
                code: code
            };

            axios.post(tokenUrl, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => {
                const { access_token, id_token, refresh_token } = response.data;
                // Store tokens in local storage or context
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('id_token', id_token);
                localStorage.setItem('refresh_token', refresh_token);
                navigate('/')
            }).catch(error => {
                console.error("Token exchange error", error);
                navigate('/login?error=true');
            });
        }
    }, [navigate]);

    return <div>Loading...</div>;
};

