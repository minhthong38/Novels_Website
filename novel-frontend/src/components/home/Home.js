import React from 'react';
import Banner from '../Banner';
import TopRanking from '../topRanking/topRanking';
import Recommend from '../Recommend/recommend';
import Discussion from '../discussion/discussion';
import Released from '../released/released';
// import UserStickyNote from '../UserStickyNote'; 

export default function Home() {
  return (
    <div>
      <div className="container mx-auto py-8">
        <Banner />
        <TopRanking />
      </div>
      <div className="container mx-auto flex flex-col md:flex-row mt-8 md:mt-0 space-y-8 md:space-y-0 md:gap-2">
        <div className="flex-1">
          <Recommend />
        </div>
        <div className="flex-1">
          <Discussion />
        </div>
      </div>
      <div className="container mx-auto mt-8 md:mt-0">
        <Released />
      </div>
      {/* <UserStickyNote />  */}
    </div>
  );
}
