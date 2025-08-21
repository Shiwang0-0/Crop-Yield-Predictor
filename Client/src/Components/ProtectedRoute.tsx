    import { type ReactNode, useEffect } from 'react'
    import { UseAuth } from '../context/auth'
    // import Loader from './Loader';
    import { Navigate } from 'react-router-dom';
    import axios from 'axios';
    import { extractError } from '../utils/extractError';
    import { type ProfileResponseInterface } from "../constants/interfaces/user";
    import toast from 'react-hot-toast';
    import { server } from '../constants/configServer';

    const ProtectedRoute = ({children}:{children:ReactNode}) => {
        // const [isLoading, setIsLoading] = useState(true);
        const { user, setUser }= UseAuth();

        useEffect(()=>{(async()=>{
                try{
                    const response=await axios.get<ProfileResponseInterface>(`${server}/user/getProfile`,{
                        withCredentials:true
                    });
                    const payload = response.data;
                    setUser(payload.user);
                }catch(err:unknown){
                    setUser(null);
                    toast.error(extractError(err));
                }finally{
                    // setIsLoading(false);
                }
            })();
        },[setUser]);


        // if(isLoading)  
        //     return <Loader/>
        return user ? children : <Navigate to="/login"/>
    }

    export default ProtectedRoute;