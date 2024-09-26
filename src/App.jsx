import { Root } from './pages/Root'
import { Latency } from './pages/Latency'
import { History } from './pages/History'
import { Chatbox } from './pages/Chatbox'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import { loadConfig } from '@/lib/utils'


export default function App() {
  const [chatbotApiUrl, setChatbotApiUrl] = useState(null);

  useEffect(() => {
    async function fetchConfig() {
      const config = await loadConfig();
      setChatbotApiUrl(config.VITE_CHATBOT_API_URL);
    }

    fetchConfig();
  }, []);  // The empty array ensures this runs once after the component mounts

  console.log("Chatbot Api Url: ", chatbotApiUrl)
  if (chatbotApiUrl === null) {
    console.log("ERROR: failed to fetch chatbot api url in App")
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Root />} />
          <Route path="/latency" element={<Latency />} />
          <Route path="/history" element={<History />}/>
          <Route path="/chatbox" element={<Chatbox apiUrl={chatbotApiUrl}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
