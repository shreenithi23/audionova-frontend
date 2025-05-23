import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Mainpage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    // if (accessToken) {
    //   navigate("/dashboard"); // Redirect if already logged in
    // }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-white text-blue-800 px-6">
      {/* Main Content */}
      <main className="text-center mt-10 max-w-3xl">
        <h1 className="text-5xl font-bold leading-tight">
          Discover Your <span className="text-blue-700">Music Taste</span> & Explore New Sounds
        </h1>
        <p className="mt-4 text-lg text-blue-700">
          AudioNova helps you track your listening habits, analyze your top tracks, and find new music curated just for you.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col items-center space-y-3">
          <button 
            onClick={() => navigate("/login")} 
            className="px-6 py-3 bg-blue-700 text-white text-lg rounded-lg hover:bg-blue-600 transition-shadow shadow-md">
            Get Started for Free
          </button>
        </div>
      </main>
    </div>
  );
};

export default Mainpage;
