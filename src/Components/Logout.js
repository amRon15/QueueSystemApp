import { Navigate, useNavigate } from "react-router-dom";
import './Logout.css'

export default function Logout(){
    const navigate = useNavigate()

    const handleLogout = () =>{
        localStorage.removeItem('token')
        navigate('/staff/login', {replace: true})
    }

    return (
        <button onClick={handleLogout}>登出</button>
    )
}