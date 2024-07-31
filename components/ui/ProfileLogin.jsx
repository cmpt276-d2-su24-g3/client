import { isAuthorized } from "@/lib/utils";
import { Link } from 'react-router-dom'

export function ProfileLogin({prop}) {
    if(isAuthorized()) {
        // TODO: Create a dropdown of profile stuff
        return (
            <Link className="mx-5 flex items-center font-sans font-semibold text-sm mx-5 bg-white pl-7 pr-7 pt-1.5 pb-1.5 rounded-full" to="/logout">
                <span>Sign Out</span>
                {prop === "Logout" && <div className="py-1 bg-orange-500"></div>}
            </Link>
        )
    } else {
        return (
            <span className="mx-5 flex items-center font-sans font-semibold text-sm mx-5 bg-white pl-7 pr-7 pt-1.5 pb-1.5 rounded-full" >
                <a href="https://yyc-portal.auth.us-west-2.amazoncognito.com/login?client_id=481g1a0ridauh779f34tvsti05&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2Fcmpt276.bhavjit.com%2Flogin">Sign in to Console</a>
            </span>
        )
    }
    
}