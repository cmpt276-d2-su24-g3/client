import { useState } from 'react'

export function LoginForm() {
    const [user, setUser] = useState({username: '', password: ''});

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('https://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
        })
        .then(response => response.json())
        .then(data => console.log('User created:', data))
        .catch(error => console.error('Error creating user:', error));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser(prevUser => ({ ...prevUser, [name]: value}));
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={user.username}
                    placeholder="Username"
                    onChange={handleChange}
                />
                <br></br><br></br>
                <input
                    type="text"
                    name="password"
                    value={user.password}
                    placeholder="Password"
                    onChange={handleChange}
                />
                <br></br><br></br>
                <button type="submit">Submit</button>
            </form>
            <a href="/register">Register</a>
        </div>
    )
}