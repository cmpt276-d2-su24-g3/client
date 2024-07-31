import { Link } from 'react-router-dom'

import AWS_Logo from "@/AWS_Logo.png"
import { ProfileLogin } from './ui/ProfileLogin'
import { ConditionalAdmin } from './ui/conditionalAdmin'

export function NavBar({ page }) {
    return (
        <div className=" z-20 relative justify-between py-4 bg-sky-950 shadow-[0_4px_6px_-1px_rgba(255,255,255,0.2),0_2px_4px_-2px_rgba(255,255,255,0.8)]">
            <div className="flex text-sm text-white items-center">
                <img
                    alt="AWS"
                    src={AWS_Logo}
                    className="mx-5 h-6" // Adjusted size for AWS logo
                />
                <Link className="mx-5 flex items-center text-sm" to="/">
                    <span>YYC Portal</span>
                    {page === "YYC Portal" && <div className="py-1 bg-orange-500"></div>}
                </Link>
                <Link className="mx-5 flex items-center font-sans text-sm" to="/latency">
                    <img src="src/assets/home-icon.svg" alt="Home" className="mr-2 h-5" /> {/* Adjusted size for icon */}
                    <span>Dashboard</span>
                    {page === "Dashboard" && <div className="py-1 bg-orange-500"></div>}
                </Link>
                <Link className="mx-5 flex items-center text-sm font-sans" to="/history">
                    <img src="src/assets/history-icon.svg" alt="History" className="mr-2 h-5" /> {/* Adjusted size for icon */}
                    <span>Latency History</span>
                    {page === "Latency History" && <div className="py-1 bg-orange-500"></div>}
                </Link>
                <Link className="mx-5 flex items-center font-sans text-sm" to="/chatbox">
                    <img src="src/assets/ai-icon.svg" alt="Chatbox" className="mr-2 h-5" /> {/* Adjusted size for icon */}
                    <span>Chatbox</span>
                    {page === "Chatbox" && <div className="py-1 bg-orange-500"></div>}
                </Link>
                <ConditionalAdmin prop={page} />
                <div className="flex text-black w-full justify-end">
                    <ProfileLogin prop={page} />
                </div>
            </div>
            
        </div>
    )
}
