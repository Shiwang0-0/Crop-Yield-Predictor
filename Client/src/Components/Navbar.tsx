import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="w-[60%] fixed top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md shadow-md rounded-xl z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <img src="/logo.png" alt="logo" className="h-12 w-12 sm:w-16 object-contain aspect-square hover:scale-110 transition-transform duration-500" />

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/home" className="text-white hover:text-gray-200 transform hover:scale-110 transition-transform duration-500">Home  </Link>
            <Link to="/leaderboard" className="text-white hover:text-gray-200 transform hover:scale-110 transition-transform duration-500">  Leaderboard</Link>
            <Link to="/predict" className="text-white hover:text-gray-200 transform hover:scale-110 transition-transform duration-500">  Predict</Link>
            <Link to="/support" className="text-white hover:text-gray-200 transform hover:scale-110 transition-transform duration-500">Support</Link>
            <button
              onClick={navigateToLogin}
              className="text-white border border-white/50 bg-white/10 hover:bg-white/20 transform hover:scale-110 transition-transform duration-500 font-medium rounded-lg text-sm px-4 py-[6px] backdrop-blur-sm transition-all"
            >
              Get Started
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden flex flex-col mt-2 space-y-2 pb-4">
            <Link to="/home" onClick={() => setIsOpen(false)}className="text-white hover:text-gray-200 transition">Home</Link>
            <Link to="/support" onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 transition">Support</Link>
            <Link to="/leaderboard" onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 transition">Leaderboard</Link>
            <Link to="/predict" onClick={() => setIsOpen(false)}className="text-white hover:text-gray-200 transition">Predict</Link>

            <button onClick={() => {setIsOpen(false); navigateToLogin();}} className="text-white border border-white/50 bg-white/10 hover:bg-white/20 font-medium rounded-lg text-sm px-4 py-2 backdrop-blur-sm transition-all">  Get Started</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
