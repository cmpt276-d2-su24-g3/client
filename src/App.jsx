import { Root } from './pages/Root'
import { Login } from './pages/Login'
import { Logout } from './pages/Logout'
import { Register } from './pages/Register'
import { Latency } from './pages/Latency'
import { Admin } from './pages/Admin'
import { Chatbox } from './pages/Chatbox'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/latency" element={<Latency />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/chatbox" element={<Chatbox />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
