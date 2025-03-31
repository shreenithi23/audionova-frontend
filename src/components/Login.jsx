import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import spotifyLogo from "../assets/spotify_logo.png";
import picture from "../assets/picture1.jpg";

const Login = () => {
  const CLIENT_ID = "45ddc73b5ac64b8b82c4df8c0976efd1";
  const REDIRECT_URI = "http://localhost:3000/callback"; // Match backend redirect URI
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "code";
  const SCOPE = "user-top-read";
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      navigate("/dashboard"); // Redirect if already logged in
    }
  }, []);

  const generateRandomState = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const handleSpotifyLogin = () => {
    const state = generateRandomState();
    localStorage.setItem("spotifyAuthState", state); // Store state for verification

    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&state=${state}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="flex w-3/4 max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Left Section */}
        <div className="w-1/2 bg-green-200 p-8 flex flex-col justify-center items-center">
          <img src={picture} alt="Bird Illustration" className="mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Look at your stats</h2>
          <p className="text-gray-600 text-center">Know your music taste</p>
        </div>

        {/* Right Section */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome to AudioNova</h2>
          <button 
            onClick={handleSpotifyLogin} 
            className="w-full bg-green-200 text-black py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center gap-2">
            <img src={spotifyLogo} alt="Spotify" className="w-5" />
            Sign in with Spotify
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
