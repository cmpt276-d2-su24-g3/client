import { NavBar } from '@/components/NavBar'
import { useEffect, useState } from 'react'
import axios from 'axios'

export function Chatbox() {
  const [input, setInput] = useState('');
  const [uuid, setUuid] = useState('');
  const [data, setData] = useState('');

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
      text += decoder.decode(chunk.value, { stream: true });
      setData(text);
    }
  };

  return (
    <div>
      <h1>Streamed Data</h1>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Enter your input"
      />
      <input
        type="text"
        value={uuid}
        onChange={handleUuidChange}
        placeholder="Enter your UUID v4"
      />
      <button onClick={handleButtonClick}>Send</button>
      <pre>{data}</pre>
    </div>
  );
}
