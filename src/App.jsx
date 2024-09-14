import { Root } from './pages/Root'
import { Latency } from './pages/Latency'
import { History } from './pages/History'
import { Chatbox } from './pages/Chatbox'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Root />} />
          <Route path="/latency" element={<Latency />} />
          <Route path="/history" element={<History />}/>
          <Route path="/chatbox" element={<Chatbox />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
