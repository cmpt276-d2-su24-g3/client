import React, { useEffect, useState } from 'react';
import { NavBar } from '@/components/NavBar'
import { v4 as uuidv4 } from 'uuid';

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
      <div className="flex justify-center items-center h-screen bg-sky-950">
        <div className='flex flex-col justify-between items-center w-2/3 h-4/5'>
          <span className="text-6xl font-bold text-sky-500">
              Chatbot
          </span>
          <p className='p-5 m-10 w-full h-full bg-sky-900 text-white'>
            {data}
            {loading && <span className='text-orange-500'>Processing</span>}
          </p>
          <div className='flex w-full'>
            {/* <input
              type="text"
              value={uuid}
              onChange={handleUuidChange}
              placeholder="Enter your UUID v4"
              className='p-2 m-2 rounded-full bg-sky-900 text-center text-white'
            /> */}
            <div className='flex flex-1 p-2 m-2 rounded-full bg-sky-900'>
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Enter your input"
                className='pl-4 w-3/4 bg-transparent text-white'
              />
              <button className='flex-1 text-white' onClick={handleButtonClick}>Send</button>
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
