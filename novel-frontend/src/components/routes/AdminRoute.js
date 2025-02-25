import React from 'react';
import AdminSidebar from '../sidebar/AdminSidebar';

function AdminRoute({ children }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-8">
      <AdminSidebar />
      {children}
    </div>
  );
}

export default AdminRoute;
