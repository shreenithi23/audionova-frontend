import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  // ... (keep all your existing state and useEffect hooks)
  const [userId, setUserId] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState([]);
  const [selectedPlaylistName, setSelectedPlaylistName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromURL = urlParams.get("userId");

    if (userIdFromURL) {
      localStorage.setItem("userId", userIdFromURL);
      setUserId(userIdFromURL);
      window.history.replaceState({}, document.title, "/dashboard");
    } else {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) {
        navigate("/login");
        return;
      }
      setUserId(storedUserId);
    }
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    setIsLoading(true);

    Promise.all([
      fetch(`http://localhost:9090/users/${userId}/top-tracks`).then(res => res.json()),
      fetch(`http://localhost:9090/users/${userId}/top-artists`).then(res => res.json()),
      fetch(`http://localhost:9090/users/${userId}/playlists`).then(res => res.json()),
      fetch(`http://localhost:9090/users/${userId}/recently-played`).then(res => res.json()),
    ])
      .then(([tracks, artists, playlists, recent]) => {
        setTopTracks(tracks);
        setTopArtists(artists);
        setPlaylists(playlists);
        setRecentlyPlayed(recent);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading dashboard data:", err);
        navigate("/login");
      });
  }, [userId, navigate]);

    const handleBackClick = () => navigate("/login");

  const handlePlaylistClick = (playlistId, playlistName) => {
    fetch(`http://localhost:9090/users/${userId}/playlists/${playlistId}/tracks`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch playlist tracks");
        return res.json();
      })
      .then(data => {
        setSelectedPlaylistTracks(data);
        setSelectedPlaylistName(playlistName);
      })
      .catch(err => console.error("Error fetching playlist tracks:", err));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-blue-500 to-white">
        <div className="text-2xl text-blue-700">Loading your music data...</div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const cardHover = {
    scale: 1.03,
    boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
    transition: { type: "spring", stiffness: 300 }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-blue-500 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-t from-blue-500 to-white min-h-screen p-8">
      {/* Back button with animation */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBackClick}
        className="mb-6 bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Back to Login
      </motion.button>

      {/* Action buttons with animations */}
      <div className="flex justify-center gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#1d4ed8" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/recommend-artists")}
          className="bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Recommend Similar Artists
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#4338ca" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/recommend-song")}
          className="bg-indigo-700 text-white px-4 py-2 rounded-md"
        >
          Recommend Similar Songs
        </motion.button>
      </div>

      {/* Title with animation */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center text-blue-700 mb-10 no-scrollbar"
      >
        <h1 className="text-3xl font-bold mb-2">Your Music Dashboard</h1>
      </motion.div>

      {/* Horizontal Scroll Sections */}
      <HorizontalScrollSection 
        title="Top Tracks" 
        items={topTracks} 
        variants={containerVariants}
        itemVariants={itemVariants}
        cardHover={cardHover}
      />

      <HorizontalScrollSection 
        title="Top Artists" 
        items={topArtists} 
        variants={containerVariants}
        itemVariants={itemVariants}
        cardHover={cardHover}
      />

      {/* Playlists Section */}
<div className="relative mb-10">
  {selectedPlaylistTracks.length > 0 && (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setSelectedPlaylistTracks([])}
    >
      <motion.div 
        className="w-full max-w-3xl bg-white rounded-xl shadow-2xl mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-blue-700 text-white flex justify-between items-center rounded-t-xl">
          <h2 className="text-xl font-bold">Tracks in {selectedPlaylistName}</h2>
          <button
            onClick={() => setSelectedPlaylistTracks([])}
            className="text-white hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-3">
            {selectedPlaylistTracks.map((track) => (
              <div key={track.id} className="p-3 border-b border-gray-100 last:border-0">
                <h3 className="font-medium text-blue-800">{track.name}</h3>
                <p className="text-sm text-gray-600">Artist: {track.artist}</p>
                {track.duration && (
                  <p className="text-xs text-gray-500">Duration: {track.duration}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}

  <h2 className="text-2xl font-bold text-blue-700 mb-4">Playlists</h2>
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="flex overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar"
  >
    <div className="flex space-x-4">
      {playlists.length > 0 ? (
        playlists
          .map(playlistString => {
            const name = playlistString.split(" (ID: ")[0];
            const id = playlistString.match(/\(ID: (.+?)\)/)[1];
            return { name, id };
          })
          .map((playlist, index) => (
            <motion.div
              key={playlist.id}
              variants={itemVariants}
              whileHover={cardHover}
              className="flex-shrink-0 w-64 bg-white p-4 rounded-xl shadow-md cursor-pointer"
              onClick={() => handlePlaylistClick(playlist.id, playlist.name)}
            >
              <h3 className="text-xl font-semibold text-blue-700">
                {playlist.name}
              </h3>
            </motion.div>
          ))
      ) : (
        <p className="text-white">No playlists found</p>
      )}
    </div>
  </motion.div>
</div>

      {/* Recently Played */}
      <HorizontalScrollSection 
        title="Recently Played" 
        items={
          recentlyPlayed &&
          recentlyPlayed
            .filter((track, index, self) => {
              if (typeof track === "object") {
                return index === self.findIndex(t => t.id === track.id);
              } else {
                return index === self.indexOf(track);
              }
            })
            .map(track => (typeof track === "object" ? track.name : track))
        }
        variants={containerVariants}
        itemVariants={itemVariants}
        cardHover={cardHover}
      />
    </div>
  );
};

// New Horizontal Scroll Section Component
const HorizontalScrollSection = ({ title, items, variants, itemVariants, cardHover }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold text-blue-700 mb-4">{title}</h2>
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className="flex overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar"
    >
      <div className="flex space-x-4">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={cardHover}
              className="flex-shrink-0 w-64 bg-white p-4 rounded-xl shadow-md no-scrollbar"
            >
              <h3 className="text-xl font-semibold text-blue-700">{item}</h3>
            </motion.div>
          ))
        ) : (
          <p className="text-white">No {title.toLowerCase()} found</p>
        )}
      </div>
    </motion.div>
  </div>
);


  // const Section = ({ title, items }) => (
  //   <div className="mb-10">
  //     <h2 className="text-2xl font-bold text-blue-700 mb-4">{title}</h2>
  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //       {items && items.length > 0 ? (
  //         items.map((item, index) => (
  //           <div key={index} className="bg-white p-4 rounded-xl shadow-md">
  //             <h3 className="text-xl font-semibold text-blue-700">{item}</h3>
  //           </div>
  //         ))
  //       ) : (
  //         <p className="text-white">No {title.toLowerCase()} found</p>
  //       )}
  //     </div>
  //   </div>
// );

export default Dashboard;