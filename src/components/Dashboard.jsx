import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tracks, setTracks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("spotify_access_token"); // Ensure key matches Callback.jsx

    if (!accessToken) {
      console.error("No access token found. Redirecting to login.");
      navigate("/login");
      return;
    }

    fetch("http://localhost:3000/spotify/top-tracks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 401) {
          console.error("Token expired or invalid. Redirecting to login.");
          localStorage.removeItem("spotify_access_token"); // Clear invalid token
          navigate("/login");
          return Promise.reject("Unauthorized"); // Stop further execution
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
      .catch((error) => console.error("Error fetching top tracks:", error));
  }, [navigate]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Your Top Tracks</h2>
      <ul className="mt-4">
        {tracks.length > 0 ? (
          tracks.map((track, index) => (
            <li key={index} className="p-2 border-b">
              {track.name} - {track.artists?.[0]?.name}
            </li>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
