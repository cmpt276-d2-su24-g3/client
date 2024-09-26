import React, { useEffect, useState, useRef, useCallback } from 'react';
import { NavBar } from '@/components/NavBar';
import { v4 as uuidv4 } from 'uuid';
import SendIcon from '@/src/assets/send-icon.svg';
import ChatIcon from '@/src/assets/chatbot-icon.svg';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";
import ReactMarkdown from 'react-markdown';

const ChatConversations = ({ conversations, chatConversationsContainerRef }) => {
    useEffect(() => {
        const chatConversationsContainer = chatConversationsContainerRef?.current;
        if (chatConversationsContainer) {
            chatConversationsContainer.scrollTo(0, chatConversationsContainer.scrollHeight);
        }
    }, [conversations]);

    return (
        <div className="w-full">
            {conversations && conversations.map((chatEntry, index) => (
                <ChatMessage key={`chatbot-message-${index}`} message={chatEntry} />
            ))}
        </div>
    );
};

const ChatInput = ({ disabled, onSubmit, placeholder, customSubmitIcon }) => {
    const textAreaRef = useRef(null);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            const textArea = textAreaRef?.current;
            if (textArea && textArea.value.trim().length > 0) {
                if (onSubmit) {
                    onSubmit(textArea.value);
                }
                textArea.value = "";
            }
        },
        [onSubmit]
    );

    const handleEnterKey = useCallback(
        (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                handleSubmit(e);
            }
        },
        [handleSubmit]
    );

    return (
        <div className="flex items-center flex-1">
            <textarea
                ref={textAreaRef}
                className="w-full pl-8 pr-15 pt-4 mb-4 pb-0 bg-gradient-to-br from-slate-100 to-indigo-100 rounded-full"
                onKeyUp={handleEnterKey}
                placeholder={placeholder ? placeholder : "Type here to chat"}
                disabled={disabled}
            ></textarea>
            <button
                disabled={disabled}
                onClick={handleSubmit}
                className="px-2.5 mx-2 py-3 text-white rounded-full hover:bg-indigo-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
                {customSubmitIcon ? customSubmitIcon : <img src={SendIcon} alt="Send" className="h-5" />}
            </button>
        </div>
    );
};

const ChatMessage = ({ message }) => {
    const isBot = message.type !== 'human';

    return (
        <div className="mt-4 mr-52 ml-52 flex">
            <div className="bg-neutral text-neutral-content h-10 w-10 rounded-full flex items-center justify-center mr-4">
                {isBot ? (
                    <img
                        src={ChatIcon}
                        alt="AI-Chatbot"
                        className="h-10 "
                    />
                ) : ''}
            </div>

            <div className="flex flex-col">
                <h4 className="font-semibold select-none">{isBot ? "LQ AI" : ""}</h4>
                <p className={isBot ? "bg-white font-ember text-sky-950" : "font-ember bg-gradient-to-br text- from-purple-100 to-indigo-300 rounded-full pl-5 pr-5 pt-2 pb-2 m-2"}><ReactMarkdown>{message.content}</ReactMarkdown></p>
            </div>
        </div>
    );
};

export function Chatbox({ apiUrl }) {
    const [input, setInput] = useState('');
    const [uuid, setUuid] = useState('');
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatConversationsContainerRef = useRef(null);
    console.log(apiUrl)

    useEffect(() => {
        const initializeUuid = () => {
            const existingUuid = localStorage.getItem('userUuid');
            if (existingUuid) {
                setUuid(existingUuid);
            } else {
                const newUuid = uuidv4();
                localStorage.setItem('userUuid', newUuid);
                setUuid(newUuid);
            }
        };
        initializeUuid();
    }, []);

    useEffect(() => {
        if (uuid) {
            fetchHistory();
        }
    }, [uuid]);

    const fetchHistory = async () => {
        const response = await fetch(`${import.meta.env.VITE_CHATBOT_API_URL}get-history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': import.meta.env.VITE_CHATBOT_API_KEY,
            },
            body: JSON.stringify({ session_id: uuid }),
        });

        if (response.status === 200) {
            const history = await response.json();
            const filteredHistory = history.filter(entry => entry.type !== 'tool');
            setConversations(filteredHistory);
        }
    };

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleButtonClick = async (message) => {
        setLoading(true);
        const requestData = {
            input: message,
            session_id: uuid,
            time: new Date().toISOString()
        };
        console.log(import.meta.env.VITE_CHATBOT_API_URL)
        const response = await fetch(`${import.meta.env.VITE_CHATBOT_API_URL}chat`, {
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
        const newConvoId = uuidv4();
        const newBotConvo = { id: newConvoId, type: 'AIMessageChunk', content: '' };
        setConversations(prev => [...prev, { id: uuidv4(), type: 'human', content: message }, newBotConvo]);

        let analyzingMessageAdded = false;

        while (!(chunk = await reader.read()).done) {
            const chunkText = decoder.decode(chunk.value, { stream: true });
            if (chunkText === '<|tool_call|>' || chunkText === '<|message_received|>') {
                if (!analyzingMessageAdded) {
                    text += '\nAnalyzing...\n';
                    analyzingMessageAdded = true;
                }
            } else {
                if (analyzingMessageAdded) {
                    text = text.replace('\nAnalyzing...\n', '');
                    analyzingMessageAdded = false;
                }
                text += chunkText;
            }
            setConversations(prev =>
                prev.map(convo =>
                    convo.id === newConvoId ? { ...convo, content: text } : convo
                )
            );
        }

        setLoading(false);
    };

    const handleDeleteHistory = async () => {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_CHATBOT_API_URL}delete-history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': import.meta.env.VITE_CHATBOT_API_KEY,
            },
            body: JSON.stringify({ session_id: uuid }),
        });

        if (response.status === 409) {
            setConversations([{ id: uuidv4(), type: 'AIMessageChunk', content: 'Deletion not successful' }]);
        } else {
            setConversations([]);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-screen bg-white mt-16">
            <NavBar page="Chatbox" />
            <div className='flex flex-col justify-between items-center w-full h-full p-4'>
                {conversations.length === 0 ? (
                    <>
                        <h1 className="text-4xl font-bold bg-gradient-to-br from-indigo-700 to-blue-400 text-transparent bg-clip-text mt-48">Welcome to AWS LQ AI</h1>
                        <h2 className="text-lg text-semibold font-ember text-customPurple -mt-12">How can I help you today?</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 w-3/5 mb-6 -mt-10 ml-20 mr-20 ">
                            <div className="p-10 bg-slate-100 hover:bg-gradient-to-br from-indigo-100 to-white-100 rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer text-center">
                                <p className="text-sm text-slate-500 font-ember font-medium">What region will provide the optimal latency to AWS Origon?</p>
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
                    </>
                ) : (
                    <div ref={chatConversationsContainerRef} className="flex-grow w-full overflow-y-auto">
                        <ChatConversations conversations={conversations} chatConversationsContainerRef={chatConversationsContainerRef} />
                    </div>
                )}
                <div className='flex w-3/5 mt-2'>
                    <ChatInput
                        disabled={loading}
                        onSubmit={handleButtonClick}
                        placeholder="Enter a prompt"
                        customSubmitIcon={<img src={SendIcon} alt="Send" className="mr-1  mb-2 ml-1 h-6" />}
                    />
                    <Menubar className='mt-2 ml-4'>
                        <MenubarMenu>
                            <MenubarTrigger>...</MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem>
                                    <button onClick={handleDeleteHistory}>Delete History</button>
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </div>
            </div>
        </div>
    );
}