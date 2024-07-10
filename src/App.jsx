import { Root } from './pages/Root'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Latency } from './pages/Latency'
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
        </Routes>
      </BrowserRouter>
    </div>
  )
}
