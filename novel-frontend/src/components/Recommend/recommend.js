import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { fetchNovels } from '../../services/apiService'; // import API mới

export default function Recommend({ customStyle, excludeNovelId }) {
  const { isDarkMode } = useContext(UserContext);
  const [topNovels, setTopNovels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNovels = async () => {
      try {
        const novels = await fetchNovels();
        const filteredNovels = excludeNovelId
          ? novels.filter((novel) => novel._id !== excludeNovelId)
          : novels;
        const sorted = filteredNovels
          .sort((a, b) => b.view - a.view)
          .slice(0, 6);
        setTopNovels(sorted);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch novels:', error);
        setLoading(false);
      }
    };

    loadNovels();
  }, [excludeNovelId]);

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen`}>
      <div className="flex flex-col items-center md:flex-row md:justify-center md:ml-36 mb-10">
        <div className="flex-1">
          <h2 className={`text-xl font-bold mb-4 text-center md:text-left md:ml-5 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            SÁCH ĐỀ XUẤT
          </h2>

          {loading ? (
            <p className="text-center">Đang tải...</p>
          ) : (
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: customStyle?.gridTemplateColumns || 'repeat(3, 1fr)',
              }}
            >
              {topNovels
                .slice(0, customStyle?.maxItems || topNovels.length)
                .map((novel) => (
                  <div key={novel._id} className="text-center">
                    <Link to={`/novelDetail/${novel._id}`}>
                      <img 
                        src={novel.imageUrl} 
                        style={{ width: '180px', height: '250px' }} 
                        alt={`Bìa sách ${novel.title}`} 
                        className="mx-auto mb-2 object-cover"
                      />
                      <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>{novel.title}</p>
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
