const Footer = () => {
  return (
    <footer className="w-full text-white mt-24 border-t border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-xl font-bold mb-4 text-center">CropYieldX</h3>
          <p className="text-sm text-gray-200 text-center">
            Empowering farmers with AI-driven crop yield predictions and insights to build a smarter, sustainable future.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <h4 className="text-lg font-semibold mb-3">Navigation</h4>
          <ul className="space-y-2 text-sm text-gray-300 text-center">
            <li><a href="/home" className="hover:text-white transition">Home</a></li>
            <li><a href="/about" className="hover:text-white transition">About</a></li>
            <li><a href="/leaderboard" className="hover:text-white transition">Leaderboard</a></li>
            <li><a href="/predict" className="hover:text-white transition">Predict</a></li>
          </ul>
        </div>
      <div>
          <h4 className="text-lg font-semibold text-center">Contact</h4>
          <p className="text-sm text-gray-300 text-center ">Email: bishtshiwang6@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
