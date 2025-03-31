import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TopTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("spotify_access_token"); // Match key from Callback.jsx

    if (!accessToken) {
      console.error("No access token found. Redirecting to login.");
      navigate("/login");
      return;
    }

    fetch("http://localhost:3000/spotify/top-tracks", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 401) {
          console.error("Token expired or invalid. Redirecting to login.");
          localStorage.removeItem("spotify_access_token"); // Remove expired token
          navigate("/login");
          return Promise.reject("Unauthorized");
        }
        if (!response.ok) {
          throw new Error(`Failed to fetch tracks: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format from API");
        }
        setTracks(data);
      })
      .catch((error) => {
        console.error("Error fetching top tracks:", error);
        setError("Failed to load top tracks.");
      })
      .finally(() => setLoading(false));
  }, [navigate]); // Ensure `navigate` is included in dependencies

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Your Top Tracks</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="mt-4">
        {tracks.length > 0 ? (
          tracks.map((track, index) => (
            <li key={index} className="p-2 border-b">
              <strong>{track.name}</strong> by {track.artists?.[0]?.name}
            </li>
          ))
        ) : (
          !loading && <p>No tracks found.</p>
        )}
      </ul>
    </div>
  );
};

export default TopTracks;
