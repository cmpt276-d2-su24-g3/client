import { isAdmin} from "@/lib/utils";
import { Link } from 'react-router-dom'

export function ConditionalAdmin({prop}) {
    if(isAdmin()) {
        return (
            <Link className="mx-5" to="/admin">
                Admin
                {prop == "Admin" && <div className="py-1 bg-orange-500"></div>}
            </Link>
        )
    } else {
        return (
            <></>
        )
    }
    
}