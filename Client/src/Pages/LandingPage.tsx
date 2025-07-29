import Navbar from "../Components/Navbar"
import Infobar from "../Components/Infobar"
import Footer from "../Components/Footer"

const LandingPage = () => {
  return (
   <div className="min-h-screen w-full radial-bg text-white font-sans">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <section className="relative w-full min-h-[65vh] pt-[4rem] flex flex-col items-center justify-center z-10">
          <div className="bg-black/60 text-white p-8 rounded-xl max-w-2xl text-center shadow-lg backdrop-blur-sm z-20 transform hover:scale-105 transition-transform duration-500 ">
            <h1 className="text-4xl font-bold mb-4 animate-fade-in-down">Welcome to CropYieldX</h1>
            <p className="text-lg leading-relaxed">
              Empowering farmers with AI-driven crop yield prediction. View and analyze real-time field data, support struggling farms, and connect with stakeholders to drive sustainable agriculture forward.
            </p>
          </div>
          <div className="mt-[3rem] flex justify-center items-center gap-32 z-20">
            <img src="/wheat.png" alt="Wheat" className="w-12 sm:w-16 transition-transform duration-300 hover:scale-110 drop-shadow-lg" />
            <img src="/harvester.png" alt="Corn" className="w-12 sm:w-16 transition-transform duration-300 hover:scale-110 drop-shadow-lg" />
            <img src="/crop.png" alt="Tomato" className="w-12 sm:w-16 transition-transform duration-300 hover:scale-110 drop-shadow-lg" />
            <img src="/carrots.png" alt="Rice" className="w-12 sm:w-16 transition-transform duration-300 hover:scale-110 drop-shadow-lg" />
          </div>

      </section>


      <section className="relative w-full min-h-[85vh] mt-[8vh]">
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Infobar />
        </div>
      </section>

      <section className="relative w-full min-h-[40vh] mt-[8vh]">
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Footer />
        </div>
      </section>
    </div>
  )
}

export default LandingPage
