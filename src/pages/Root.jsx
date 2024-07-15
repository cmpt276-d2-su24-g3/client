import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function Root() {
  const [user, setUser] = useState([])

  useEffect(() => {
    fetch('http://localhost:8080/api/')
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error('Error fetching users:', error))
  }, [])

  return (
    <div>
      <h1>Portal</h1>
      <h2>Welcome {user.username}</h2>
      <Link to="/latency">Latency</Link>
      <br></br>
      <a href="https://yyc-portal.auth.us-west-2.amazoncognito.com/login?client_id=481g1a0ridauh779f34tvsti05&response_type=code&scope=email+openid&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Flogin">Login</a>
      <br></br>
      <a href="https://yyc-portal.auth.us-west-2.amazoncognito.com/logout?client_id=481g1a0ridauh779f34tvsti05&response_type=code&scope=email+openid&logout_uri=http%3A%2F%2Flocalhost%3A5173%2Flogout">Logout</a>
      <br></br>
      <Link to="/admin">Admin</Link>
    </div>
  )
}
