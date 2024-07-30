import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'

import WorldMap from '../assets/world-map.svg'
import R2R from '../assets/r2r-image.svg'

import '../assets/fonts.css'
import { Info } from 'lucide-react'
import { info } from 'autoprefixer'

const InfoButton = ({ text, infoHighlighted, setInfoHighlighted }) => {
  return (
    <button onClick={() => setInfoHighlighted(text)} className={infoHighlighted == text ? 'p-4 bg-blue-500 rounded-full' : 'p-4'}>
      {text}
    </button>
  )
}

export function Root() {
  const [infoHighlighted, setInfoHighlighted] = useState("Amazon LQ")

  return (
    <div className="bg-sky-50 min-h-screen">
      <NavBar page="YYC Portal"/>
      <div className='flex justify-end'>
        <button className='p-1 px-3 m-4 border-4 border-blue-500 rounded-full text-blue-900'>client-to-region</button>
        <button className='p-1 px-3 m-4 border-4 border-blue-500 rounded-full text-blue-500'>region-to-region</button>
        <button className='p-1 px-3 m-4 border-4 border-blue-500 rounded-full text-blue-500'>region-to-client</button>
      </div>
      <div className='flex justify-evenly'>
        <div className='p-5'>
          <span className='m-3 text-5xl font-bold'>YYC Portal</span>
          <p className='m-4'>
            Our tools provide precise latency data for location-to-region,<br></br>
            region-to-region, and region-to-location testing, helping you ensure<br></br>
            efficient and reliable network performance.
          </p>
          <button className='p-4 m-3 rounded-full text-white bg-blue-700'>
            <Link to="/latency">Get Started</Link>
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
        </div>
      </div>
      <div className='flex justify-center mt-10'>
        <div>
          <span className='text-2xl font-bold'>{infoHighlighted}</span>
          <p>
            Amazon Q brings its advanced generative AI technology to Amazon QuickSight,<br></br>
            the AWS unified business intelligence (BI) service built for the cloud.<br></br>
            With Amazon Q in QuickSight, customers get a generative BI assistant that allows<br></br>
            analysts to use natural language to build BI dashboards in minutes and easily<br></br>
            create visualizations and complex calculations.
          </p>
        </div>
        <div>
          <img src={R2R}></img>
        </div>
      </div>
    </div>
  )
}
