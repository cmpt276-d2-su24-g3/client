import { isAuthorized } from "@/lib/utils";
import { isAdmin } from "@/lib/utils";
import { Link } from 'react-router-dom'

export function LoginRedirectPopup({mode}) {
    if(mode == "authorize") {
        if(isAuthorized()) {
            return (
                <></>
            )
        } else {
            return (
                <div className="z-1 fixed top-0 left-0 w-screen h-full backdrop-blur-sm bg-white/30">
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mx-5 flex items-center font-sans font-semibold text-sm mx-5 bg-white pl-7 pr-7 pt-1.5 pb-1.5 rounded-full" >
                        <a href="https://yyc-portal.auth.us-west-2.amazoncognito.com/login?client_id=481g1a0ridauh779f34tvsti05&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2Fcmpt276.bhavjit.com%2Flogin">Sign in for Access</a>
                    </span>
                </div>
            )
        }
    } else {
        if(isAdmin()) {
            return (
                <></>
            )
        } else {
            return (
                <div className="z-1 fixed top-0 left-0 w-screen h-full overflow-y-auto backdrop-blur-sm bg-white/30">
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 pr-10 pl-10 m-3 rounded-full text-white bg-gradient-to-r from-violet-700 to-indigo-700 font-ember text-base">
                        <a href="https://yyc-portal.auth.us-west-2.amazoncognito.com/login?client_id=481g1a0ridauh779f34tvsti05&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2Fcmpt276.bhavjit.com%2Flogin">Sign in with Employee Account</a>
                    </span>
                </div>
            )
        }
    }
}