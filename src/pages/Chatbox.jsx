<<<<<<< Updated upstream
=======
import { NavBar } from '@/components/NavBar'
import { useEffect, useState } from 'react'
import axios from 'axios'

>>>>>>> Stashed changes
export function Chatbox() {
    const [data, setData] = useState(null)

    useEffect(() => {
        axios.get('http://zefta.catalpa.pw:8000/')
            .then(response => setData(response.data))
            .catch(error => console,error('Error fetching data', error))
    }, []);

    return (
        <div>
            hello
        </div>
    )
}