import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import spotifyLogo from "../assets/spotify_logo.png";
import picture from "../assets/picture1.jpg";

const Login = () => {
  const navigate = useNavigate();

  const handleSpotifyLogin = () => {
    window.location.href = "http://localhost:9090/spotify-login";
  };

  const handleBackClick = () => {
    navigate("/");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");

    if (userId) {
      localStorage.setItem("userId", userId);
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-400 to-white">
      <button 
        onClick={handleBackClick}
        className="absolute top-4 left-4 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 z-10"
      >
        Back
      </button>

      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="flex w-full md:w-3/4 max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="w-1/2 bg-blue-200 p-8 flex flex-col justify-center items-center">
            <img src={picture} alt="Illustration" className="mb-4 rounded-lg shadow-md" />
            <h2 className="text-xl font-bold text-blue-800 mb-2">Look at your stats</h2>
            <p className="text-blue-700 text-center">Know your music taste</p>
          </div>

          <div className="w-1/2 p-8 flex flex-col justify-center bg-white">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">Welcome to AudioNova</h2>
            <button 
              onClick={handleSpotifyLogin}
              className="w-full bg-blue-300 text-blue-800 font-bold py-2 rounded-lg hover:bg-blue-500 transition duration-300 flex items-center justify-center gap-2"
            >
              <img src={spotifyLogo} alt="Spotify" className="w-5" />
              Sign in with Spotify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
