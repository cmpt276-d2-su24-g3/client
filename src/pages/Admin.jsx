import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'

export function Admin() {
    const navigate = useNavigate()
    if(isAdmin())
    return (
        <div>
            <h1>Portal</h1>
            <h2>You are an admin!</h2>
        </div>
    )
    navigate('/');
    return <div>Loading...</div>;
}

function isAdmin() {
    const token = localStorage.getItem('id_token');
    console.log(jwtDecode(token));
    const decoded = jwtDecode(token);
    console.log(decoded['cognito:groups'] && Array.isArray(decoded['cognito:groups']) && decoded['cognito:groups'].includes('admin'));
    return (decoded['cognito:groups'] && Array.isArray(decoded['cognito:groups']) && decoded['cognito:groups'].includes('admin'));
}