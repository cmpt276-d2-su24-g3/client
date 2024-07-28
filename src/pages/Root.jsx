import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'

import WorldMap from '../assets/world-map.svg'
import C2R_Image from '../assets/c2r-image.svg'
import R2R_Image from '../assets/r2r-image.svg'
import R2C_Image from '../assets/r2c-image.svg'
import Chatbox_Image from '../assets/chatbot-image.svg'

import '../assets/fonts.css'
import { Info } from 'lucide-react'
import { info } from 'autoprefixer'

const Descriptions = {
  "Amazon LQ": `Amazon Q brings its advanced generative AI technology to Amazon QuickSight,
                the AWS unified business intelligence (BI) service built for the cloud.
                With Amazon Q in QuickSight, customers get a generative BI assistant that allows
                analysts to use natural language to build BI dashboards in minutes and easily
                create visualizations and complex calculations.`,
  "Client to Region": `Amazon Q brings its advanced generative AI technology to Amazon QuickSight,
                       the AWS unified business intelligence (BI) service built for the cloud.
                       With Amazon Q in QuickSight, customers get a generative BI assistant that allows
                       analysts to use natural language to build BI dashboards in minutes and easily
                       create visualizations and complex calculations.`,
  "Region to Region": `Amazon Q brings its advanced generative AI technology to Amazon QuickSight,
                       the AWS unified business intelligence (BI) service built for the cloud.
                       With Amazon Q in QuickSight, customers get a generative BI assistant that allows
                       analysts to use natural language to build BI dashboards in minutes and easily
                       create visualizations and complex calculations.`,
  "Region to Client": `Amazon Q brings its advanced generative AI technology to Amazon QuickSight,
                       the AWS unified business intelligence (BI) service built for the cloud.
                       With Amazon Q in QuickSight, customers get a generative BI assistant that allows
                       analysts to use natural language to build BI dashboards in minutes and easily
                       create visualizations and complex calculations.`,
  "Chatbot": `Amazon Q brings its advanced generative AI technology to Amazon QuickSight,
                       the AWS unified business intelligence (BI) service built for the cloud.
                       With Amazon Q in QuickSight, customers get a generative BI assistant that allows
                       analysts to use natural language to build BI dashboards in minutes and easily
                       create visualizations and complex calculations.`,
}

const InfoButton = ({ text, infoHighlighted, setInfoHighlighted }) => {
  return (
    <button onClick={() => setInfoHighlighted(text)} className={infoHighlighted == text ? 'p-4 bg-blue-400 rounded-full' : 'p-4'}>
      {text}
    </button>
  )
}

export function Root() {
  const [infoHighlighted, setInfoHighlighted] = useState("Amazon LQ")

  return (
    <div className="bg-sky-50 min-h-screen">
      <NavBar page="YYC Portal"/>
      <div className='flex justify-evenly items-center mt-10'>
        <div className='p-5'>
          <span className='m-3 text-5xl font-bold'>YYC Portal</span>
          <p className='m-4'>
            Our tools provide precise latency data for location-to-region,<br></br>
            region-to-region, and region-to-location testing, helping you ensure<br></br>
            efficient and reliable network performance.
          </p>
          <button className='p-4 m-3 rounded-full text-white bg-blue-700'>
            <a href="https://yyc-portal.auth.us-west-2.amazoncognito.com/login?client_id=481g1a0ridauh779f34tvsti05&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2Fdd06gmwf4nvya.cloudfront.net%2Flogin">Get Started</a>
          </button>
        </div>
        <div className='w-1/2'>
          <img src={WorldMap}></img>
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='flex justify-evenly w-1/2 p-1 border-4 rounded-full'>
            <InfoButton text="Amazon LQ" infoHighlighted={infoHighlighted} setInfoHighlighted={setInfoHighlighted}/>
            <InfoButton text="Client to Region" infoHighlighted={infoHighlighted} setInfoHighlighted={setInfoHighlighted}/>
            <InfoButton text="Region to Region" infoHighlighted={infoHighlighted} setInfoHighlighted={setInfoHighlighted}/>
            <InfoButton text="Region to Client" infoHighlighted={infoHighlighted} setInfoHighlighted={setInfoHighlighted}/>
            <InfoButton text="Chatbot" infoHighlighted={infoHighlighted} setInfoHighlighted={setInfoHighlighted}/>
        </div>
      </div>
      <div className='flex justify-center mt-10'>
        <div className='m-4'>
          <span className='text-2xl font-bold'>{infoHighlighted}</span>
          <p
            dangerouslySetInnerHTML={{
              __html: Descriptions[infoHighlighted].replace(/\n/g, '<br>')
            }}
          ></p>
        </div>
        <div>
          <img className='h-64' src={
            infoHighlighted == "Amazon LQ" ? C2R_Image
              : infoHighlighted == "Client to Region" ? C2R_Image
              : infoHighlighted == "Region to Region" ? R2R_Image
              : infoHighlighted == "Region to Client" ? R2C_Image
              : infoHighlighted == "Chatbot" ? Chatbox_Image
              : Chatbox_Image
          }
          ></img>
        </div>
      </div>
      <Link to="/admin">Admin</Link>
    </div>
  )
}
