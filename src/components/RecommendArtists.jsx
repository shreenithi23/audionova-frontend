import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RecommendArtists = () => {
  const [searchType, setSearchType] = useState("name"); // "name" or "country"
  const [inputValue, setInputValue] = useState("");
  const [similarArtists, setSimilarArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSimilarArtists = () => {
    if (!inputValue) return;
    setLoading(true);

    const baseUrl = "http://localhost:9090/recommend";
    const endpoint =
      searchType === "name"
        ? `${baseUrl}/similar-artists?artistName=${encodeURIComponent(inputValue)}`
        : `${baseUrl}/top-artist?country=${encodeURIComponent(inputValue)}`; // Ensure this endpoint exists!

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setSimilarArtists(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching similar artists:", err);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-blue-400 to-white p-8">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Back to Dashboard
      </button>

      <div className="text-center text-blue-700 mb-6">
        <h1 className="text-3xl font-bold mb-4">Find Similar Artists</h1>

        {/* Search Type Selector */}
        <div className="mb-4">
          <label className="mr-4 font-medium">Search By:</label>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="px-3 py-2 rounded border border-blue-300"
          >
            <option value="name">Artist Name</option>
            <option value="country">Country</option>
          </select>
        </div>

        {/* Input Field */}
        <input
          type="text"
          placeholder={
            searchType === "name" ? "Enter artist name" : "Enter country name"
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchSimilarArtists();
          }}
          className="px-4 py-2 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={fetchSimilarArtists}
          className="ml-4 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Get Similar Artists
        </button>
      </div>

      {loading ? (
        <div className="text-center text-blue-700">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {similarArtists.length > 0 ? (
            similarArtists.map((artist, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-blue-700">{artist}</h3>
              </div>
            ))
          ) : (
            <div className="text-blue-700 text-center col-span-full">No similar artists to show yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendArtists;
