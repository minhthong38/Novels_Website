import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Navigate } from "react-router-dom";
import AuthorSidebar from "../sidebar/AuthorSidebar";

function AuthorRoute({ children }) {
  const { loggedInUser } = useContext(UserContext);

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
        <AuthorSidebar />
        <div className="w-full lg:w-3/4 pb-4 bg-white">{children}</div>
      </div>
    </div>
  );
}

export default AuthorRoute;
