import { Root } from './pages/Root'
import { Latency } from './pages/Latency'
import { History } from './pages/History'
import { Chatbox } from './pages/Chatbox'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { useEffect, useState, createContext } from 'react';
import { loadConfig } from '@/lib/utils'

export const ConfigContext = createContext(null);

export default function App() {
  const [config, setConfig] = useState({
    chatbotApiUrl: null,
    chatbotApiKey: null,
    R2RApiUrl: null,
    R2CUrls: {}, // Object to hold R2C URLs by region
  });

  useEffect(() => {
    async function fetchConfig() {
      const loadedConfig = await loadConfig();
      setConfig({
        chatbotApiUrl: loadedConfig.CHATBOT_API_URL,
        chatbotApiKey: loadedConfig.CHATBOT_API_KEY,
        R2RApiUrl: loadedConfig.R2R_URL,
        R2CUrls: extractR2CUrls(loadedConfig),
      });
    }

    fetchConfig();
  }, []);

  // Helper function to extract R2C URLs based on region
  const extractR2CUrls = (config) => {
    const prefix = 'R2C_URL-';
    const R2CUrls = {};
    Object.keys(config).forEach((key) => {
      if (key.startsWith(prefix)) {
        const region = key.substring(prefix.length).toLowerCase().replace(/_/g, '-');
        R2CUrls[region] = config[key];
      }
    });
    return R2CUrls;
  };

  return (
    <div>
      <ConfigContext.Provider value={config}>
        <BrowserRouter>
          <Routes>
            <Route index element={<Root />} />
            <Route path="/latency" element={<Latency />} />
            <Route path="/history" element={<History />}/>
            <Route path="/chatbox" element={<Chatbox />}/>
          </Routes>
        </BrowserRouter>
      </ConfigContext.Provider> 
    </div>
  )
}
