import React, { useContext } from 'react';
import Banner from '../Banner';
import TopRanking from '../topRanking/topRanking';
import Recommend from '../Recommend/recommend';
import Released from '../released/released';
import PlaylistByCategory from '../playlistByCategory/playlistByCategory';
import { UserContext } from '../../context/UserContext'; // Corrected the import path

export default function Home() {
  const { isDarkMode } = useContext(UserContext);

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} min-h-screen`}>
      <div className="container mx-auto py-8">
        <Banner />
        <TopRanking />
      </div>
      <div className="container mx-auto flex flex-col md:flex-row mt-8 md:mt-0 space-y-8 md:space-y-0 md:gap-2">
        <div className="flex-1">
          <Recommend className={`${isDarkMode ? 'text-white' : 'text-black'}`} />
        </div>
        <div className="flex-1">
          <PlaylistByCategory />
        </div>
      </div>
      <div className="container mx-auto mt-8 pb-10 md:mt-0">
        <Released className={`${isDarkMode ? 'text-white' : 'text-black'}`} />
      </div>
    </div>
  );
}
