import { isAuthorized } from "@/lib/utils";

export function ProfileLogin() {
    if(isAuthorized()) {
        // TODO: Create a dropdown of profile stuff
        return (
            <span className="mx-5 text-white" >Profile</span>
        )
    } else {
        return (
            <span className="mx-5 text-white" >
                <a href="https://yyc-portal.auth.us-west-2.amazoncognito.com/login?client_id=481g1a0ridauh779f34tvsti05&response_type=code&scope=email+openid&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Flogin">Login</a>
            </span>
        )
    }
    
}