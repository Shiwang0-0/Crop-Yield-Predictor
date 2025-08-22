// const [isLogin, setIsLogin] = useState(true);
import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import type { credentials, credentialErrors } from "../constants/interfaces/credentials";
import toast from "react-hot-toast";
import { validate } from "../utils/validation";
import axios from "axios"
import { server } from "../constants/configServer";
import { extractError } from "../utils/extractError";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../context/auth";
import { type User, type ProfileResponseInterface } from "../constants/interfaces/user";

const Login = () => {
    
    const navigate=useNavigate();
    const { setUser } =UseAuth();
    
    const {mode}=useParams();
    
    const [formData,setFormData]=useState<credentials>({
        email:"",
        username:"",
        password:"",
        confirmPassword:""
    })

    useEffect(() => {
        setFormData({
            email:"",
            username: "",
            password: "",
            confirmPassword: "",
        });
    }, [mode]);

    if (mode !== "login" && mode !== "register") {
        return <Navigate to="/login" />;
    }
    const isLogin=mode==="login";


    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setFormData((prev)=>({
            ...prev,
            [e.target.name]:e.target.value,
        }))
    }

    const handleSubmit=async (e:React.FormEvent)=>{
        e.preventDefault();
        const toastId = toast.loading(isLogin ? "Logging in..." : "Creating account...");
        const errors: credentialErrors = validate(formData, isLogin);

        if (Object.keys(errors).length > 0) {
            toast.dismiss(toastId);

            Object.values(errors).forEach((msg) => {
                if (msg) toast.error(msg);
            });
            return;
        }
        try{
            console.log(isLogin ? "Logging in..." : "Registering...");
            if(isLogin){
                await axios.post<User>(`${server}/api/user/login`,{
                        email:formData.email,
                        username:formData.username,
                        password:formData.password
                    },
                    {
                        withCredentials:true,
                        headers:{
                            "Content-Type":"application/json"
                        }
                    }
                )
            }else{
                await axios.post<User>(`${server}/api/user/register`,{
                        email:formData.email,
                        username:formData.username,
                        password:formData.password
                    },
                    {
                        withCredentials:true,
                        headers:{
                            "Content-Type":"application/json"
                        }
                    }
                );
            }

            try{
                const {data}= await axios.get<ProfileResponseInterface>(`${server}/api/user/myprofile`,{
                    withCredentials:true
                })
                if(data)
                    setUser(data.user);
            }catch(err:unknown){
                toast.error(extractError(err), { id: toastId });
            }

            toast.success(isLogin ? "Log in successfully!" : "Account created!", {id:toastId});
            navigate("/home");
        }
        catch (err:unknown) {
            toast.error(extractError(err), { id: toastId });
        }
    }

    return (
    <div className="min-h-screen flex font-sans bg-[#eaf4ec]">
        <div className="absolute top-12 left-12 z-50 bg-white rounded-full p-2 shadow hover:shadow-md transition cursor-pointer" onClick={()=>navigate("/")}>
        <img src="/home.png" alt="Home" className="w-8 h-8 object-contain" />
      </div>
        <div className="w-[30%] bg-[#1E4023] text-white flex flex-col justify-center items-center p-8 hidden md:flex">
        <h2 className="text-4xl font-bold mb-4">CropYieldX</h2>
        <p className="text-lg text-center leading-relaxed">Predict crop yields. Track insights. Empower farmers.</p>
        <img src="/password.png" alt="crop" className="w-32 mt-10 opacity-90" />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-white/60 backdrop-blur-md shadow-xl p-10 rounded-2xl w-full max-w-md border border-white/20">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {isLogin ? "Login to your account" : "Create an account"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm text-gray-700 font-semibold mb-1">Email</label>
                <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your email"
                />
            </div>
            <div>
                <label className="block text-sm text-gray-700 font-semibold mb-1">Username</label>
                <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your username"
                />
            </div>

            <div>
                <label className="block text-sm text-gray-700 font-semibold mb-1">Password</label>
                <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your password"
                />
            </div>

            {!isLogin && (
                <div>
                <label className="block text-sm text-gray-700 font-semibold mb-1">Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Re-enter your password"
                />
                </div>
            )}

            <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-full font-semibold hover:bg-green-700 transition-all duration-300"
            >
                {isLogin ? "Sign In" : "Sign Up"}
            </button>

            <p className="text-center text-sm mt-4 text-gray-600">
                {isLogin ? (
                <>New here? <Link to="/register" className="text-green-600 underline">Create an account</Link></>
                ) : (
                <>Already have an account? <Link to="/login" className="text-green-600 underline">Log in</Link></>
                )}
            </p>
            </form>
        </div>
        </div>
    </div>
);

}

export default Login