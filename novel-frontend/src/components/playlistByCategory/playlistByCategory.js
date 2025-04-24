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
      className={`ml-14 w-3/4 h-[500px] mt-20 overflow-y-scroll border rounded-lg ${
        isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'
      } sm:ml-auto sm:mr-auto sm:w-11/12 sm:mt-4 lg:ml-28 lg:w-3/4 lg:mt-20 relative`}
    >
      <h2 className="text-2xl font-bold mb-6 text-center sticky top-0 bg-inherit z-10 p-4">
        Tuyển Tập Theo Thể Loại
      </h2>
      <ul className="space-y-4 p-4">
        {categories.map((category) => (
          <li
            key={category._id}
            className={`flex items-center bg-gray-100 rounded-lg shadow-md p-4 transition-transform duration-300 hover:scale-105 hover:shadow-lg ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'hover:bg-gray-200 text-black'
            }`}
          >
            <div className="relative w-24 h-24 flex-shrink-0">
              <img
                src={categoryImages[category._id]}
                alt={`Cover for ${category.titleCategory}`}
                className="w-full h-full object-cover rounded-lg border transition-transform duration-300 hover:scale-110"
                onError={(e) =>
                  (e.target.src =
                    'https://www.shutterstock.com/image-photo/black-book-isolated-on-white-600nw-2316218599.jpg')
                }
              />
            </div>
            <div className="ml-4 flex-1">
              <Link
                to={{
                  pathname: `/playlist/${category._id}`,
                  state: { playlistName: `Tuyển tập sách ${category.titleCategory} ${randomPhrases[category._id] || 'Mới Nhất'}` },
                }}
                className="block"
              >
                <h3 className="text-lg font-semibold hover:underline">
                  Tuyển tập sách {category.titleCategory} {randomPhrases[category._id] || 'Mới Nhất'}
                </h3>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
