import { Link } from 'react-router-dom'

import AWS_Logo from "@/AWS_Logo.png"
import { ProfileLogin } from './ui/ProfileLogin'

export function NavBar({ page }) {
    return (
        <div className="flex justify-between py-3 bg-sky-950">
            <div className="flex text-sm text-white">
                <img
                    alt="AWS"
                    src={AWS_Logo}
                    className="mx-5 h-6"
                />
                <Link className="mx-5" to="/">
                    YYC Portal
                    {page == "YYC Portal" && <div className="py-1 bg-orange-500"></div>}
                </Link>
                <Link className="mx-5" to="/latency">
                    Dashboard
                    {page == "Dashboard" && <div className="py-1 bg-orange-500"></div>}
                </Link>
                <Link className="mx-5" to="/latency">
                    Service Availability
                    {page == "Service Availability" && <div className="py-1 bg-orange-500"></div>}
                </Link>
                <Link className="mx-5" to="/latency">
                    Latency History
                    {page == "Latency History" && <div className="py-1 bg-orange-500"></div>}
                </Link>
                <Link className="mx-5" to="/chatbox">
                    Chatbox
                    {page == "Chatbox" && <div className="py-1 bg-orange-500"></div>}
                </Link>
            </div>

            <ProfileLogin />
        </div>
    )
}