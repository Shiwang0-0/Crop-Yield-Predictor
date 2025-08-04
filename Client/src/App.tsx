import { Routes, Route } from "react-router-dom"
import { Toaster } from 'react-hot-toast';
import LandingPage from "./Pages/LandingPage"
import Home from "./Pages/Home"
import Predict from "./Pages/Predict"
import Login from "./Pages/Login"
import Leaderboard from "./Pages/Leaderboard";
import SupportBoard from "./Pages/SupportBoard";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import Profile from "./Components/Profile";
import { AuthProvider } from "./context/auth";

const App = () => {

  return (
    
    <AuthProvider>
    <Routes>
      <Route path="/" element={<PublicRoute> <LandingPage/> </PublicRoute>} />
      <Route path="/home" element={<ProtectedRoute> <Home/> </ProtectedRoute>} />
      <Route path="/predict" element={<ProtectedRoute> <Predict/> </ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute> <SupportBoard/> </ProtectedRoute>} />
      <Route path="/myprofile" element={<ProtectedRoute> <Profile/> </ProtectedRoute>} />
      <Route path="/leaderboard" element={<Leaderboard/>} />
      <Route path="/:mode" element={<PublicRoute> <Login/> </PublicRoute>} />
    </Routes>
    <Toaster position='top-right'/>
    </AuthProvider>
  )
}

export default App