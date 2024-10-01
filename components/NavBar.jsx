import { Link } from 'react-router-dom';
import AWS_Logo from "@/AWS_Logo.png";

export function NavBar({ page }) {
    return (
        <div className="z-20 fixed overflow-hidden top-0 left-0 w-full flex justify-between py-4 bg-customNav shadow-[0_4px_6px_-1px_rgba(255,255,255,0.2),0_2px_4px_-2px_rgba(255,255,255,0.8)]">
            <div className="flex text-sm text-white items-center">
                <img
                    alt="AWS"
                    src={AWS_Logo}
                    className="mx-7 h-7" // Adjusted size for AWS logo
                />
                <Link className="mx-6 pl-2 whitespace-nowrap flex items-center text-sm" to="/">
                    <span>AWS LQ</span>
                    {page === "YYC Portal" && <div className="py-1 bg-orange-500"></div>}
                </Link>
                <Link className="mx-6 flex items-center font-ember text-sm" to="/latency">
                    <span>Dashboard</span>
                    {page === "Dashboard" && <div className="py-1 bg-orange-500"></div>}
                </Link>
                <Link className="mx-6 whitespace-nowrap flex items-center text-sm font-ember" to="/history">
                    <span>Latency History</span>
                    {page === "Latency History" && <div className="py-1 bg-orange-500"></div>}
                </Link>
                <Link className="mx-6 flex items-center font-ember text-sm" to="/chatbox">
                    <span>Chatbot</span>
                    {page === "Chatbox" && <div className="py-1 bg-orange-500"></div>}
                </Link>
            </div>

            {/* Button added at the end of the navbar */}
            <div className="mr-8 p-0 bg-white rounded-full font-ember">
                <button className="bg-white text-sm py-1.5 font-ember px-8 py-0 rounded-full transition-all duration-300 ease-in-out hover:shadow-[0_0_15px_5px_rgba(75,0,130,0.7)]">
                    documentation
                </button>
            </div>



            


        </div>
    );
}
