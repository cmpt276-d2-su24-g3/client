import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';

import WorldMap from '../assets/world-map.svg';
import C2R_Image from '../assets/c2r-image.svg';
import R2R_Image from '../assets/r2r-image.svg';
import R2C_Image from '../assets/r2c-image.svg';
import Chatbox_Image from '../assets/chatbot-image.svg';

import '../assets/fonts.css';

// InfoButton Component
const InfoButton = ({ text, infoHighlighted, setInfoHighlighted, gradientClass }) => {
  const isSelected = infoHighlighted === text;

  return (
    <button
      className={`flex-grow p-3 mx-1 font-ember rounded-full text-gray-800 hover:text-white transition-colors duration-300 ease-in-out ${
        isSelected ? gradientClass : 'font-ember hover:bg-gradient-to-r from-indigo-400 to-blue-200'
      } ${isSelected ? 'shadow-lg text-white' : ''}`}
      onClick={() => setInfoHighlighted(text)}
    >
      {text}
    </button>
  );
};

const imageStyles = {
  "Amazon LQ": "h-112 w-full object-cover rounded-lg shadow-xl border border-gray-300 mt-4",
  "Client to Region": "h-112 w-full object-cover rounded-full shadow-md border border-gray-200 mb-4",
  "Region to Region": "h-112 w-full object-cover rounded-lg border-4 border-indigo-600 mt-6",
  "Region to Client": "h-112 w-full object-cover rounded-xl shadow-lg border border-gray-400 mb-6",
  "AI Chatbot": "h-80 w-full object-cover rounded-lg shadow-md border border-gray-300 mt-2"
};


export function Root() {
  const [infoHighlighted, setInfoHighlighted] = useState("Amazon LQ");

  const infoContent = {
    "Amazon LQ": `Amazon LQ is a streamlined tool for querying latency information. Users are provided with several services that provide latency times between different locations.`,
    "Client to Region": `By selecting AWS regions, our system displays latency times from those regions directly to your location.`,
    "Region to Region": `View latency times and latency history between any two regions. Change region locations at any time and with ease.`,
    "Region to Client": `Users can view latency times not only from their location, but from any location by providing a URL. Latencies from unique locations can connect to any region.`,
    "AI Chatbot": `Interact with a friendly chat bot that provides information about several AWS services. Furthermore, the chat bot allows users to view and delete chat history.`
  };

  return (
    <div className="bg-white min-h-screen pt-16">
      <NavBar page="YYC Portal" />

      <div className='flex justify-center'>
        <div className="flex justify-center items-center mx-20 py-16 w-3/4">
          <div className="pt-14">
            <h1 className="text-5xl text-sky-950 font-bold font-ember mb-6">AWS LQ</h1>
            <p className="text-normal font-sans text-gray-700 font-ember mb-8 leading-relaxed">
              Our tools provide precise latency data for location-to-region, <span className="text-customBtn">region-to-region</span>, <span className="text-customBtn">region-to-client</span>, and <span className="text-customBtn">client-to-region</span> testing, helping you ensure efficient and reliable network performance.
            </p>
            <button className="p-3 px-10 mb-6 rounded-full text-white bg-gradient-to-r from-violet-700 to-indigo-700 font-ember text-base shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link to="/latency">Get Started</Link>
            </button>
          </div>
          <img src={WorldMap} alt="World Map" className="w-2/3"/>
        </div>
      </div>
      

      <div className="flex justify-center mb-16">
        <div className="flex justify-evenly w-3/4 py-1 border border-gray-300 rounded-full shadow-sm bg-white">
          <InfoButton
            gradientClass="bg-gradient-to-r from-violet-400 to-indigo-500"
            text="Amazon LQ"
            infoHighlighted={infoHighlighted}
            setInfoHighlighted={setInfoHighlighted}
          />
          <InfoButton
            gradientClass="bg-gradient-to-r from-violet-400 to-indigo-500"
            text="Client to Region"
            infoHighlighted={infoHighlighted}
            setInfoHighlighted={setInfoHighlighted}
          />
          <InfoButton
            gradientClass="bg-gradient-to-r from-violet-400 to-indigo-500"
            text="Region to Region"
            infoHighlighted={infoHighlighted}
            setInfoHighlighted={setInfoHighlighted}
          />
          <InfoButton
            gradientClass="bg-gradient-to-r from-violet-400 to-indigo-500"
            text="Region to Client"
            infoHighlighted={infoHighlighted}
            setInfoHighlighted={setInfoHighlighted}
          />
          <InfoButton
            gradientClass="bg-gradient-to-r from-violet-400 to-indigo-500"
            text="AI Chatbot"
            infoHighlighted={infoHighlighted}
            setInfoHighlighted={setInfoHighlighted}
          />
        </div>
      </div>

      <div className='flex justify-center'>
        <div className="flex items-start w-3/4 mx-0 pb-32">
          <div className="w-2/5 pt-20">
            <h2 className="text-3xl font-bold font-ember text-sky-950 mb-6">{infoHighlighted}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">{infoContent[infoHighlighted]}</p>
          </div>
          <div className="flex-1 md:w-1/3 flex justify-center items-center">
              <img className="h-64 pl-20 pt-10 object-contain" src={
                infoHighlighted === "Amazon LQ" ? R2C_Image
                  : infoHighlighted === "Client to Region" ? C2R_Image
                  : infoHighlighted === "Region to Region" ? R2R_Image
                  : infoHighlighted === "Region to Client" ? R2C_Image
                  : Chatbox_Image
              } alt="Related Illustration"/>
            </div>
        </div>
      </div>
    </div>
  );
}