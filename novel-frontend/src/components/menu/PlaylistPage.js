import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom'; // Import useLocation
import { fetchNovelsByCategory, fetchCategoryDetails } from '../../services/apiService'; // Import fetchCategoryDetails
import { UserContext } from '../../context/UserContext';

export default function PlaylistPage() {
  const { categoryID } = useParams();
  const location = useLocation(); // Access location to retrieve state
  const { isDarkMode } = useContext(UserContext);
  const [novels, setNovels] = useState([]);
  const [playlistName, setPlaylistName] = useState(location.state?.playlistName || 'Unknown Playlist'); // Retrieve full playlist name from state

  useEffect(() => {
    // Fetch novels by category and sort by views
    fetchNovelsByCategory(categoryID)
      .then((data) => {
        if (Array.isArray(data)) {
          setNovels(data.sort((a, b) => b.view - a.view)); // Sort novels by views in descending order
        } else {
          setNovels([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching novels:', error);
        setNovels([]);
      });
  }, [categoryID]);

  useEffect(() => {
    // If the playlist name is not available in state, fetch it from the category details as a fallback
    if (!location.state?.playlistName) {
      fetchCategoryDetails(categoryID)
        .then((data) => {
          if (data && data.titleCategory) {
            setPlaylistName(`Tuyển tập sách ${data.titleCategory}`); // Fallback to category name without random phrase
          }
        })
        .catch((error) => {
          console.error('Error fetching category details:', error);
          setPlaylistName('Unknown Playlist');
        });
    }
  }, [categoryID, location.state]);

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <div className="max-w-4xl mx-auto p-9">
        <h1 className="text-center text-3xl font-bold mb-6 mt-10">{playlistName}</h1> {/* Display playlist name */}
        <div className="grid grid-cols-2 gap-6 mb-10 sm:grid-cols-1 lg:grid-cols-3">
          {novels.map((novel) => (
            <div
              key={novel._id || novel.NovelID}
              className="text-center flex flex-col items-center sm:mb-4 lg:mb-6"
            >
              <Link to={`/novelDetail/${novel._id || novel.NovelID}`}>
                <img
                  src={novel.imageUrl}
                  alt={novel.title}
                  className="rounded mb-4"
                  style={{
                    width: '150px', // Fixed width
                    height: '200px', // Fixed height
                    objectFit: 'cover', // Ensures the image fills the area while maintaining aspect ratio
                  }}
                />
                <p
                  className={`text-base sm:text-sm lg:text-base ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}
                >
                  {novel.title}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
