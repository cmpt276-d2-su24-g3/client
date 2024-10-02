import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';

import WorldMap from '../assets/world-map.svg';
import C2R_Image from '../assets/c2r-image.svg';
import R2R_Image from '../assets/r2r-image.svg';
import R2C_Image from '../assets/r2c-image.svg';
import Chatbox_Image from '../assets/chatbot-image.svg';
import heroheader from '../assets/Hero-Header.svg';
import Descriptions from '../assets/hero-descriptions.svg';
import Footer from '../assets/hero-footer.svg';

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

export function Root() {
  const [infoHighlighted, setInfoHighlighted] = useState("Amazon LQ");

  return (
    <div className="bg-white min-h-screen pt-12">
      <NavBar page="YYC Portal" />

      {/* Hero Section */}
      <div className="flex justify-center">
        <div className="w-full relative">
          <img src={heroheader} alt="HeroHeader" className="w-full max-w-none" />
          <button
            className="absolute p-3 px-14 mb-0 rounded-lg text-white hover:bg-customNav hover:shadow-xl bg-gradient-to-r from-violet-600 to-indigo-500 font-ember text-base shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ bottom: '22%', left: '48%', transform: 'translateX(-50%)' }}
          >
            <Link to="/latency">Get Started</Link>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="ml-32 mr-32 p-10">
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          {/* Section Heading */}
          <div className="mb-10 md:mb-10 text-left">
            <h2 className="text-5xl font-bold pt-2 font-ember text-sky-950 mb-7">
              How to measure latency?
            </h2>
            <p className="text-customGray font-ember md:text-semi">
            Leverage real-time and historical latency data to make informed decisions about AWS regions. Our platform offers powerful tools to help you choose the best regions for your infrastructure, ensuring optimal network performance and faster application response times.
              </p>
            </div>

            {/* Cards Section */}
            <div className="flex justify-center">
              <img src={Descriptions} alt="Descriptions" className="w-full max-w-none"></img>
            </div>
          </div> 
            </div>
          </div>
          

          <div className="flex justify-center">
        <div className="w-full relative">
          <img src={Footer} alt="HeroFooter" className="w-full max-w-none" />
        </div>
      </div>
      

          
        </div>

        



  

  );
}
