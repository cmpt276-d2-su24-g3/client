import React, { useEffect, useState } from 'react';
import { NavBar } from '@/components/NavBar'
import { v4 as uuidv4 } from 'uuid';
import SendIcon from '@/src/assets/send-icon.svg'
import { LoginRedirectPopup } from '@/components/LoginRedirectPopup';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"

export function Chatbox() {
  const [input, setInput] = useState('');
  const [uuid, setUuid] = useState('');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ username: ''})

  useEffect(() => {
    const existingUuid = localStorage.getItem('userUuid')
    if (existingUuid) {
      setUuid(existingUuid)
    } else {
      const newUuid = uuidv4()
      localStorage.setItem('userUuid', newUuid)
      setUuid(newUuid)
    }
  }, [])

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleUuidChange = (event) => {
    setUuid(event.target.value);
  };

  const handleButtonClick = async () => {
    setData('');
    const requestData = {
      input: input,
      session_id: uuid,  // UUID v4
      time: new Date().toISOString()  // ISO 8601
    };

    const response = await fetch('http://zefta.catalpa.pw:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': import.meta.env.VITE_CHATBOT_API_KEY,
      },
      body: JSON.stringify(requestData),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let chunk;
    let text = '';

    while (!(chunk = await reader.read()).done) {
      const chunkText = decoder.decode(chunk.value, { stream: true });
      const tool_call = chunkText.includes('<|tool_call|>');
      if (!tool_call) {
        text += chunkText;
      }
      setData(text);
      setLoading(tool_call);
    }

    setLoading(false);
  };

  const handleGetHistory = async () => {
    setData('');
    const response = await fetch(`http://zefta.catalpa.pw:8000/get-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: uuid }),
    });

    if (response.status === 404) {
      setData('History not found.');
    } else {
      const history = await response.json();
      setData(JSON.stringify(history, null, 2));
    }
  };

  const handleDeleteHistory = async () => {
    setData('');
    const response = await fetch(`http://zefta.catalpa.pw:8000/delete-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: uuid }),
    });

    if (response.status === 204) {
      setData('History not found.');
    } else if (response.status === 409) {
      setData('Deletion not successful')
    } else {
      setData('History deleted successfully.');
    }
  };

  return (
    <div>
      <NavBar page="Chatbox" />
      <LoginRedirectPopup mode="authorize"/>
      <div className="flex justify-center items-center h-screen bg-white">
        <div className='flex flex-col justify-between items-center w-2/3 h-4/5'>
        <h1 className="text-4xl font-bold bg-gradient-to-br from-indigo-500 to-white text-transparent bg-clip-text mb-2">Welcome to AWS LQ AI</h1>
        <h2 className="text-lg text-semibold font-ember text-customPurple mb-6">How can I help you today?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-6">
            <div className="p-10 bg-slate-100 hover:bg-gradient-to-br from-indigo-100 to-white-100 rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer text-center">
              <p className="text-sm text-slate-500 font-ember font-medium">What region will provide the optimal latency to Vancouver?</p>
            </div>
            <div className="p-10 bg-slate-100 rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer hover:bg-gradient-to-br from-indigo-100 to-white-100 text-center">
              <p className="text-sm text-slate-500 font-ember font-medium">What is the live ping between ca-central-1 and ap-south-2?</p>
            </div>
            <div className="p-10 bg-slate-100 rounded-lg hover:shadow-lg transition-shadow hover:bg-gradient-to-br from-indigo-100 to-white-100 duration-300 cursor-pointer text-center">
              <p className="text-sm text-slate-500 font-ember font-medium">What was the latency between Ohio and Mumbai last Sunday?</p>
            </div>
            <div className="p-10 bg-slate-100 rounded-lg hover:shadow-lg hover:bg-gradient-to-br from-indigo-100 to-white-100 transition-shadow duration-300 cursor-pointer text-center">
              <p className="text-sm text-slate-500 font-ember font-medium">What are the available services at the East Canada Data Center?</p>
            </div>
          </div>
          <p className='w-full h-40 p-4 bg-gray-50 rounded-lg shadow-inner text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300'>
            {data}
            {loading && <span className='bg-slate-100 rounded-full pl-5 pr-5'>analyzing prompt</span>}
          </p>
          <div className='flex w-full'>
            {/* <input
              type="text"
              value={uuid}
              onChange={handleUuidChange}
              placeholder="Enter your UUID v4"
              className='p-2 m-2 rounded-full bg-sky-900 text-center text-white'
            /> */}
            <div className='flex items-center w-full'>
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Enter a prompt"
                className='pl-8 pr-15 pt-4 pb-4 bg-gradient-to-br from-slate-100 to-indigo-50 rounded-full w-full bg-slate-100 text-customMauve'
              />
              <button
                onClick={handleButtonClick}
                className="px-2.5 mx-2 py-3 text-white rounded-full hover:bg-purple-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <img src={SendIcon} alt="Home" className="mr-2 h-5" /> 
              </button>
            </div>
            <Menubar className='mt-2'>
              <MenubarMenu>
                <MenubarTrigger>...</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <button onClick={handleGetHistory}>Get History</button>
                  </MenubarItem>
                  <MenubarItem>
                    <button onClick={handleDeleteHistory}>Delete History</button>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>
    </div>
  );
}
