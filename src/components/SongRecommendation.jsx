import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SongRecommendation = ({ userId }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  // Fetch search suggestions
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(() => {
      fetch(
        `http://localhost:9090/search/track?userId=${userId}&query=${encodeURIComponent(query)}`
      )
        .then((res) => res.json())
        .then((data) => setSuggestions(data))
        .catch((err) => {
          console.error("Error fetching search suggestions:", err);
          setSuggestions([]);
        });
    }, 500);

    setDebounceTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleRecommendation = () => {
    if (!selectedTrack) return;

    const { name, artist } = selectedTrack;
    setLoading(true);
    fetch(
      `http://localhost:9090/recommend/song?userId=${userId}&artist=${encodeURIComponent(
        artist
      )}&track=${encodeURIComponent(name)}`
    )
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data);
        setVisibleStartIndex(0); // Reset to first page
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error getting recommendations:", err);
        setLoading(false);
      });
  };

  const handleRegenerate = () => {
    const nextIndex = visibleStartIndex + 7;
    setVisibleStartIndex(nextIndex >= recommendations.length ? 0 : nextIndex);
  };

  const visibleRecommendations = recommendations.slice(
    visibleStartIndex,
    visibleStartIndex + 7
  );

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 via-blue-200 to-white min-h-screen">
      <motion.h2
        className="text-2xl font-bold mb-4 text-blue-800 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Song Recommendations
      </motion.h2>

      {/* Search Input */}
      <motion.input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Start typing a song name..."
        className="w-full max-w-xl mx-auto px-4 py-2 border border-blue-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />

      {/* Suggestions List */}
      {suggestions.length > 0 && (
        <ul className="bg-white border border-gray-200 rounded-lg max-w-xl mx-auto max-h-60 overflow-y-auto mb-4 shadow-sm">
          {suggestions.map((s, index) => {
            const [name, artist] = s.split(" - ");
            return (
              <li
                key={index}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  setSelectedTrack({ name, artist });
                  setQuery(`${name} - ${artist}`);
                  setSuggestions([]);
                }}
              >
                {name} <span className="text-gray-500">by {artist}</span>
              </li>
            );
          })}
        </ul>
      )}

      {/* Recommendation Button */}
      {selectedTrack && (
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="mb-2 text-blue-700">
            Selected: <strong>{selectedTrack.name}</strong> by{" "}
            <strong>{selectedTrack.artist}</strong>
          </p>
          <button
            onClick={handleRecommendation}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            Get Similar Songs
          </button>
        </motion.div>
      )}

      {/* Recommendations Display */}
      {loading ? (
        <p className="text-blue-700 text-center">Loading recommendations...</p>
      ) : (
        recommendations.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl w-full mb-6">
              <AnimatePresence>
                {visibleRecommendations.map((track, index) => (
                  <motion.div
                    key={track.name + track.artist}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-4 border rounded shadow bg-white flex items-center"
                  >
                    {track.image && (
                      <img
                        src={track.image}
                        alt="album cover"
                        className="w-16 h-16 mr-4 rounded"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-blue-800">{track.name}</p>
                      <p className="text-sm text-gray-600">by {track.artist}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {recommendations.length > 7 && (
              <button
                onClick={handleRegenerate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Regenerate
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default SongRecommendation;
