import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function Index() {
    const [user, setUser] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/')
        .then(response => response.json())
        .then(data => setUsers(data))
        .catch(error => console.error('Error fetching users:', error));
    }, []);

    return (
        <div>
            <h1>Portal</h1>
            <h2>Welcome {user.username}</h2>
            <Link to="/latency">Latency</Link>
            <br></br>
            <Link to="/logout">Logout</Link>
        </div>
    )
}
