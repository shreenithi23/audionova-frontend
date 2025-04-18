import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search); // Fixed typo
    const code = urlParams.get("code");

    if (!code) {
      console.error("No authorization code found in URL.");
      return;
    }

    const backendUrl = "http://localhost:9090/callback";

    fetch(`${backendUrl}?code=${code}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Expecting JSON response
      })
      .then((data) => {
        console.log("Authentication successful:", data);
        
        // Assuming backend returns { access_token: "your_token_here" }
        if (data.access_token) {
          localStorage.setItem("spotify_access_token", data.access_token);
        } else {
          console.error("Access token missing from response.");
        }

        navigate("/dashboard"); // Redirect user to the dashboard
      })
      .catch((error) => {
        console.error("Error during Spotify authentication:", error);
        alert("Authentication failed. Check console for details.");
      });
  }, [navigate]); // Added `navigate` as a dependency

  return <p>Authenticating with Spotify...</p>;
};

export default Callback;
