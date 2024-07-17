import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import { ServiceDesc } from '@/components/ServiceDesc'

export function Root() {
  /*const [user, setUser] = useState([])

  useEffect(() => {
    fetch('http://localhost:8080/api/')
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error('Error fetching users:', error))
  }, [])*/

  return (
    <div className="bg-sky-100 min-h-screen">
      <NavBar page="Dashboard"/>
      <Link to="/admin">Admin</Link>
      <div>
        <div className="text-center my-16">
          <h1 className="text-2xl">Our services</h1>
          <p className="text-lg mt-4">Our tools provide precise latency data for location-to-region, region-to-location, and region-to-region testing,
            <br></br>helping you ensure efficient and reliable network performance.</p>
        </div>
        <div className="flex justify-center gap-8">
          <ServiceDesc card_title={"Location to Region"} description={"View ping times from your location to selected AWS regions"}/>
          <ServiceDesc card_title={"Region to Region"} description={"View ping times from selected AWS regions to other AWS regions"}/>
          <ServiceDesc card_title={"Region to Location"} description={"View ping times from selected AWS regions to an address"}/>
        </div>
      </div>
    </div>
  )
}
