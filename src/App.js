import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import InventoryList from './components/InventoryCard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar className="w-64 flex-shrink-0 border-r hidden md:block" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 border-b">
            <h1 className="text-xl font-semibold">Automotive Parts</h1>
            <div className="flex items-center space-x-4">
              {/* call  GET http://localhost:8080/parts/{sku} */}
              <input
                type="search"
                placeholder="Search products..."
                className="px-3 py-2 border rounded-md"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                + new part
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<InventoryList />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
