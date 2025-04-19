import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, fetchNovelsByCategory } from '../../services/apiService'; // Adjusted import
import { UserContext } from '../../context/UserContext';

export default function PlaylistByCategory() {
  const { isDarkMode } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [randomPhrases, setRandomPhrases] = useState({});
  const [categoryImages, setCategoryImages] = useState({});

  const phrases = ['Hay Nhất', 'Xuất Sắc', 'Hấp Dẫn', 'Tiềm Năng', 'Đáng Đọc', 'Thú Vị', 'Kinh Điển', 'Mới Nhất', 'Hot Nhất'];

  useEffect(() => {
    // Fetch categories
    fetchCategories()
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  useEffect(() => {
    // Generate random phrases and fetch one novel image per category
    const phrasesForCategories = {};
    const imagesForCategories = {};
    const usedImages = new Set(); // Track used images

    const fetchImagesForCategories = async () => {
      for (const category of categories) {
        phrasesForCategories[category._id] = phrases[Math.floor(Math.random() * phrases.length)];

        try {
          const novels = await fetchNovelsByCategory(category._id); // Fetch novels by category
          const availableNovels = novels.filter((novel) => !usedImages.has(novel.imageUrl)); // Exclude used images

          if (availableNovels.length > 0) {
            const randomNovel = availableNovels[Math.floor(Math.random() * availableNovels.length)];
            const selectedImage = randomNovel.imageUrl || 'https://via.placeholder.com/150';

            if (usedImages.has(selectedImage)) {
              imagesForCategories[category._id] = 'https://via.placeholder.com/150'; // Assign placeholder for duplicates
            } else {
              imagesForCategories[category._id] = selectedImage;
              usedImages.add(selectedImage); // Mark image as used
            }
          } else {
            imagesForCategories[category._id] = 'https://via.placeholder.com/150';
          }
        } catch (error) {
          console.error(`Error fetching novels for category ${category._id}:`, error);
          imagesForCategories[category._id] = 'https://via.placeholder.com/150';
        }
      }

      setRandomPhrases(phrasesForCategories);
      setCategoryImages(imagesForCategories);
    };

    if (categories.length > 0) {
      fetchImagesForCategories();
    }
  }, [categories]);

  return (
    <div
      className={`ml-14 w-3/4 h-[500px] mt-20 overflow-y-scroll border rounded-lg p-10 ${
        isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'
      } sm:ml-auto sm:mr-auto sm:w-11/12 sm:mt-4 lg:ml-28 lg:w-3/4 lg:mt-20`}
    >
      <h2 className="text-xl font-bold mb-4 text-center sm:text-lg lg:text-xl">PLAYLIST</h2>
      <ul className="space-y-4 sm:space-y-2 lg:space-y-4">
        {categories.map((category) => (
          <li
            key={category._id}
            className="border-b pb-2 flex items-center sm:flex-col sm:items-center lg:flex-row lg:items-center"
          >
            <img
              src={categoryImages[category._id]}
              alt={`Cover for ${category.titleCategory}`}
              className="rounded"
              style={{
                width: '100px', // Fixed width
                height: '100px', // Fixed height
                objectFit: 'cover', // Ensures the image fills the area while maintaining aspect ratio
                marginRight: '16px', // Spacing between image and content
              }}
              onError={(e) =>
                (e.target.src =
                  'https://plus.unsplash.com/premium_photo-1669652639337-c513cc42ead6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGJvb2tzfGVufDB8fDB8fHww')
              }
            />
            <Link
              to={{
                pathname: `/playlist/${category._id}`,
                state: { playlistName: `Tuyển tập sách ${category.titleCategory} ${randomPhrases[category._id] || 'Mới Nhất'}` },
              }} // Pass full playlist name as state
              className={`text-lg font-semibold hover:underline sm:text-base lg:text-lg ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}
            >
              Tuyển tập sách {category.titleCategory} {randomPhrases[category._id] || 'Mới Nhất'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
