import { type ReactNode } from 'react'
import { UseAuth } from '../context/auth'
// import Loader from './Loader';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({children}:{children:ReactNode}) => {
    
    const { user }= UseAuth();
    // if(isLoading)  
        // return <Loader/>
    
    return !user ? children : <Navigate to="/home"/>
}

export default PublicRoute