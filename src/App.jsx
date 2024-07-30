import { Root } from './pages/Root'
import { Login } from './pages/Login'
import { Logout } from './pages/Logout'
import { Register } from './pages/Register'
import { Latency } from './pages/Latency'
import { Admin } from './pages/Admin'
import { History } from './pages/History'
import { Chatbot } from './pages/Chatbot' 
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
          <Route path="/history" element={<History />}/>
          <Route path="/chatbot" element={<Chatbot />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
