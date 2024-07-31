import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';

import WorldMap from '../assets/world-map.svg'
import C2R_Image from '../assets/c2r-image.svg'
import R2R_Image from '../assets/r2r-image.svg'
import R2C_Image from '../assets/r2c-image.svg'
import Chatbox_Image from '../assets/chatbot-image.svg'

import '../assets/fonts.css';

// InfoButton Component
const InfoButton = ({ text, infoHighlighted, setInfoHighlighted, gradientClass }) => {
  const isSelected = infoHighlighted === text; // Check if the button is currently selected

  return (
    <button
      className={`flex-grow p-3 mx-0.4 rounded-full text-gray-800 transition-colors duration-300 ease-in-out ${
        isSelected ? gradientClass : 'hover:bg-gradient-to-r from-indigo-400 to-blue-200'
      } ${isSelected ? "shadow-lg" : ""}`}
      onClick={() => setInfoHighlighted(text)} // Update the selected option
    >
      {text}
    </button>
  );
};

export function Root() {
  // State to track which option is highlighted
  const [infoHighlighted, setInfoHighlighted] = useState("Amazon LQ");

  // Information corresponding to each option
  const infoContent = {
    "Amazon LQ": `Amazon LQ is a streamlined tool for querying latency information.
    Users are provided with several services that provide latency times between different locations.`,
    "Client to Region": `By selecting AWS regions, our system displays latency times from those regions directly to your location.`,
    "Region to Region": `View latency times and latency history between any two regions.
    Change region locations at any time and with ease.`,
    "Region to Client": `Users can view latency times not only from their location,
    but from any location by providing a URL. Latencies from unique locations can connect to any region.`,
    "AI Chatbot": `Interact with a friendly chat bot that provides information about several AWS services.
    Furthermore, the chat bot allows users to view and delete chat history.`
  };

  return (
    <div className="bg-white min-h-screen ">
      <NavBar page="YYC Portal" />

      <div className="flex justify-center mt-32 ml-20 mr-20 pb-32">
        <div className="p-5 ml-8 mt-32">
          <span className="m-3 mt-40 text-5xl text-sky-950 font-bold font-ember">YYC Portal</span>
          <p className="m-4 w-96 font-sans text-customText font-ember">
            Our tools provide precise latency data for location-to-region, <span className="text-customBtn">region-to-region</span>, <span className="text-customBtn">region-to-client</span>, and <span className="text-customBtn">client-to-region</span> testing, helping
            you ensure efficient and reliable network performance.
          </p>
          <button
            className="p-3 pr-10 pl-10 m-3 rounded-full text-white bg-gradient-to-r from-violet-700 to-indigo-700 font-ember text-base"
            style={{ boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)" }}
          >
            <Link to="/latency">Get Started</Link>
          </button>
        </div>
        <img src={WorldMap} alt="World Map" className='w-2/3'/>
          
      </div>

      <div className="flex justify-center mt-0">
        <div className="flex justify-evenly w-3/4 p-0.5 border border-gray-500 rounded-full">
          <InfoButton
            gradientClass="bg-gradient-to-r from-violet-400 to-indigo-500" // Gradient color for selected button
            text="Amazon LQ"
            infoHighlighted={infoHighlighted}
            setInfoHighlighted={setInfoHighlighted}
          />
          <InfoButton
            gradientClass="bg-gradient-to-r from-violet-400 to-indigo-500" // Gradient color for selected button
            text="Client to Region"
            infoHighlighted={infoHighlighted}
            setInfoHighlighted={setInfoHighlighted}
          />
          <InfoButton
            gradientClass="bg-gradient-to-r from-violet-400 to-indigo-500" // Gradient color for selected button
            text="Region to Region"
            infoHighlighted={infoHighlighted}
            setInfoHighlighted={setInfoHighlighted}
          />
          <InfoButton
            gradientClass="bg-gradient-to-r from-violet-400 to-indigo-500" // Gradient color for selected button
            text="Region to Client"
            infoHighlighted={infoHighlighted}
            setInfoHighlighted={setInfoHighlighted}
          />
          <InfoButton
            gradientClass="bg-gradient-to-r from-violet-400 to-indigo-500" // Gradient color for selected button
            text="AI Chatbot"
            infoHighlighted={infoHighlighted}
            setInfoHighlighted={setInfoHighlighted}
          />
        </div>
      </div>

      <div className="flex justify-center mt-32 ml-20 mr-20 pb-32">
        <div>
          <span className='text-3xl font-bold font-ember text-sky-950'>{infoHighlighted}</span>
          <p className="pt-8 w-3/4 text-gray-600">  
            {infoContent[infoHighlighted]} {/* Display the content based on the selected option */}
          </p>
        </div>
        <div>
          <img className='h-64' src={
            infoHighlighted == "Amazon LQ" ? R2C_Image
              : infoHighlighted == "Client to Region" ? C2R_Image
              : infoHighlighted == "Region to Region" ? R2R_Image
              : infoHighlighted == "Region to Client" ? R2C_Image
              : infoHighlighted == "AI Chatbot" ? Chatbox_Image
              : Chatbox_Image
          }
          ></img>
        </div>
      </div>
    </div>
  );
}
