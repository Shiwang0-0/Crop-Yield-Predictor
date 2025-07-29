import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../constants/interfaces/user";
type AuthContextType={
    user:User | null;
    setUser:(user: User|null)=>void;
}

const AuthContext= createContext<AuthContextType | undefined>(undefined);

export const AuthProvider=({children}:{children:ReactNode})=>{
    const [user, setUser]= useState<User | null>(null);
    return (
        <AuthContext.Provider value={{user,setUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export const UseAuth=()=>{
    const context= useContext(AuthContext);
    if(!context)
        throw new Error("useAuthContext Error");
    return context;
}