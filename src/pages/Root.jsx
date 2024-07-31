import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';

import WorldMap from '../assets/world-map.svg';
import R2R from '../assets/r2r-image.svg';

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
    "Amazon LQ": `Amazon LQ brings its advanced generative AI technology to Amazon QuickSight,
    the AWS unified business intelligence (BI) service built for the cloud.
    .`,
    "Client to Region": `This tool provides latency data for Client to Region communication,
    ensuring minimal delay and optimized performance for user-to-data-center interactions.`,
    "Region to Region": `Analyze the latency between AWS regions, helping you design
    efficient multi-region applications and improve cross-region network performance.`,
    "Region to Client": `Get detailed insights into the network performance from AWS regions to clients,
    helping you maintain reliable connectivity and fast data delivery.`,
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
        <div className="">
          <img src={WorldMap} alt="World Map" />
        </div>
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
        <p className="font-ember pt-8 w-3/4 text-gray-600">
        
            {infoContent[infoHighlighted]} {/* Display the content based on the selected option */}
          </p>
        </div>
        <div>
          <img src={R2R} alt="R2R Diagram" />
        </div>
      </div>

    </div>
  );
}
