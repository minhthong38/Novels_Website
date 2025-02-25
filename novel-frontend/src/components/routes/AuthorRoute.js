// AuthorRoute.js
import React from "react";
import AuthorSidebar from "../sidebar/AuthorSidebar";

function AuthorRoute({ children }) {
  return (
    <div className="container mx-auto mt-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
        {/* Sidebar */}
        <AuthorSidebar />
        {/* Main Content */}
        <div className="w-full lg:w-3/4 pb-4 bg-white">{children}</div>
      </div>
    </div>
  );
}

export default AuthorRoute;
