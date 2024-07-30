import { useNavigate } from 'react-router-dom';
import { isAdmin } from '@/lib/utils';

export function Admin() {
    const navigate = useNavigate()
    if(isAdmin())
    return (
        <div>
            <h1>Portal</h1>
            <h2>You are an admin!</h2>
        </div>
    )
    navigate('/');
    return <div>Loading...</div>;
}