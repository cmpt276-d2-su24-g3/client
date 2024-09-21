import { Link } from 'react-router-dom'

import AWS_Logo from "@/AWS_Logo.png"

import ChatboxIcon from "@/src/assets/ai-icon.svg"
import HistoryIcon from "@/src/assets/history-icon.svg"
import HomeIcon from "@/src/assets/home-icon.svg"

export function NavBar({ page }) {
    return (
        <div className=" z-20 fixed overflow-hidden top-0 left-0 w-full justify-between py-4 bg-sky-950 shadow-[0_4px_6px_-1px_rgba(255,255,255,0.2),0_2px_4px_-2px_rgba(255,255,255,0.8)]">
            <div className="flex text-sm text-white items-center">
                <img
                    alt="AWS"
                    src={AWS_Logo}
                    className="mx-5 h-5" // Adjusted size for AWS logo
                />
                <Link className="mx-6 whitespace-nowrap flex items-center font-ember text-sm" to="/">
                    <span>AWS LQ</span>
                    {page === "YYC Portal" && <div className="py-1 bg-orange-500"></div>}
                </Link>
                <Link className="mx-6 flex items-center font-ember text-sm" to="/latency">
                    <img src={HomeIcon} alt="Home" className="mr-2 h-5" /> {/* Adjusted size for icon */}
                    <span>Dashboard</span>
                    {page === "Dashboard" && <div className="py-1 bg-orange-500"></div>}
                </Link>
                <Link className="mx-6 whitespace-nowrap flex items-center text-sm font-ember" to="/history">
                    <img src={HistoryIcon} alt="History" className="mr-2 h-5" /> {/* Adjusted size for icon */}
                    <span>Latency History</span>
                    {page === "Latency History" && <div className="py-1 bg-orange-500"></div>}
                </Link>
                <Link className="mx-6 flex items-center font-ember text-sm" to="/chatbox">
                    <img src={ChatboxIcon} alt="Chatbox" className="mr-2 h-5" /> {/* Adjusted size for icon */}
                    <span>Chatbot</span>
                    {page === "Chatbox" && <div className="py-1 bg-orange-500"></div>}
                </Link>
            </div>
            
        </div>




    )
}


