import { type ReactNode } from 'react'
import { UseAuth } from '../context/auth'
// import Loader from './Loader';
import { Navigate, useLocation } from 'react-router-dom';

const PublicRoute = ({children}:{children:ReactNode}) => {
    
    const { user }= UseAuth();
    const location = useLocation();
    // if(isLoading)  
        // return <Loader/>

    if (location.pathname === "/") {
        return children;
    }
    
    return !user ? children : <Navigate to="/home"/>
}

export default PublicRoute