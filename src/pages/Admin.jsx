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
    const idToken = JSON.parse(jwtDecode(token));
    return idToken["cognito:groups"] && idToken["cognito:groups"].includes("admin");
}