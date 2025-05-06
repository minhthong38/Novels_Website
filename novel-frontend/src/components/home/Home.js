import React, { useContext, useEffect, useState } from 'react';
import Banner from '../Banner';
import TopRanking from '../topRanking/topRanking';
import Recommend from '../Recommend/recommend';
import Released from '../released/released';
import PlaylistByCategory from '../playlistByCategory/playlistByCategory';
import { UserContext } from '../../context/UserContext'; // Corrected the import path

export default function Home() {
  const { isDarkMode } = useContext(UserContext);
  const [petals, setPetals] = useState([]);

  // Function to generate a random petal
  const generatePetal = () => {
    const petal = {
      id: Math.random(),
      left: `${Math.random() * 100}%`, // Random horizontal position
      animationDuration: `${Math.random() * 4 + 3}s`, // Random duration between 3s and 7s
      opacity: Math.random() + 0.2, // Random opacity between 0.2 and 1
      size: `${Math.random() * 10 + 10}px`, // Random size between 10px and 20px
    };
    return petal;
  };

  // Generate petals at intervals
  useEffect(() => {
    const petalInterval = setInterval(() => {
      setPetals((prevPetals) => [...prevPetals, generatePetal()]);
    }, 100); // Add a new petal every 100ms

    // Clean up the interval on component unmount
    return () => clearInterval(petalInterval);
  }, []);

  // Function to remove petal once it has finished animation
  const handlePetalAnimationEnd = (id) => {
    setPetals((prevPetals) => prevPetals.filter((petal) => petal.id !== id));
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} min-h-screen relative`}>
      {/* Falling Petals */}
      <div className="falling-petals">
        {petals.map((petal) => (
          <div
            key={petal.id}
            style={{
              position: 'absolute',
              left: petal.left,
              top: '-10%',
              width: petal.size,
              height: petal.size,
              backgroundColor: 'pink',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              opacity: petal.opacity,
              animation: `fall ${petal.animationDuration} linear forwards`,
            }}
            onAnimationEnd={() => handlePetalAnimationEnd(petal.id)}
          ></div>
        ))}
      </div>

      <div className="container mx-auto py-8">
        <Banner />
        <TopRanking />
      </div>
      <div className="container mx-auto flex flex-col md:flex-row mt-8 md:mt-0 space-y-8 md:space-y-0 md:gap-2">
        <div className="flex-1 order-1 md:order-none">
          <Recommend className={`${isDarkMode ? 'text-white' : 'text-black'}`} />
        </div>
        <div className="flex-1 order-2 md:order-none sm:order-2 lg:order-none">
          <PlaylistByCategory />
        </div>
      </div>
      <div className="container mx-auto mt-8 pb-10 md:mt-0">
        <Released className={`${isDarkMode ? 'text-white' : 'text-black'}`} />
      </div>

      {/* MessageAI Chat Box */}
    
    </div>
  );
}
