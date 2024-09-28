import { Root } from './pages/Root'
import { Latency } from './pages/Latency'
import { History } from './pages/History'
import { Chatbox } from './pages/Chatbox'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import { loadConfig } from '@/lib/utils'


export default function App() {
  const [chatbotApiUrl, setChatbotApiUrl] = useState(null);
  const [chatbotApiKey, setChatbotApiKey] = useState(null);
  const [R2RApiUrl, setR2RApiUrl] = useState(null);
  const [R2CApiUrl, setR2CApiUrl] = useState(null);

  useEffect(() => {
    async function fetchConfig() {
      const config = await loadConfig();
      setChatbotApiUrl(config.VITE_CHATBOT_API_URL);
      setChatbotApiKey(config.VITE_CHATBOT_API_KEY)
      setR2RApiUrl(config.VITE_AWS_API_URL);
      setR2CApiUrl(config.VITE_AWS_R2C_URL);
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
          <Route path="/latency" element={<Latency R2RUrl={R2RApiUrl} R2CUrl={R2CApiUrl} />} />
          <Route path="/history" element={<History />}/>
          <Route path="/chatbox" element={<Chatbox apiUrl={chatbotApiUrl} apiKey={chatbotApiKey}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
