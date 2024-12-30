import React from 'react';
import { Link } from 'react-router-dom';

export function Sidebar({ className }) {
  return (
    <div className={`flex flex-col h-full bg-gray-100 ${className}`}>
      <div className="px-3 py-4">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Vebo Inventory System</h2>
        <div className="space-y-1">
          <Link to="/" className="flex items-center rounded-lg px-3 py-2 bg-gray-200 text-gray-900">
            Dashboard
          </Link>
          <Link to="#" className="flex items-center rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900">
            Products
          </Link>
          <Link to="#" className="flex items-center rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900">
            Orders
          </Link>
          <Link to="#" className="flex items-center rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900">
            Inventory
          </Link>
          <Link to="#" className="flex items-center rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900">
            Reports
          </Link>
          <Link to="#" className="flex items-center rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900">
            Analytics
          </Link>
          <Link to="#" className="flex items-center rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900">
            Settings
          </Link>
          <Link to="http://localhost:8080/home-page" className="flex items-center rounded-lg px-3 py-10 text-gray-700 hover:bg-gray-200 hover:text-gray-900">
            Log Out
          </Link>
        </div>
      </div>
    </div>
  );
}

