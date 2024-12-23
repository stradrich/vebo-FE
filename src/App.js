import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import InventoryList from './components/InventoryCard';
import './App.css';
import PaginationRounded from './components/Pagination';
import PopupForm from './components/PopupForm'; // Import the PopupForm

function App() {
  const [isFormOpen, setFormOpen] = useState(false); // State to track form visibility

  const toggleForm = () => {
    console.log('Button clicked! Toggling form visibility...');
    setFormOpen(!isFormOpen); // Function to toggle form visibility
  };

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
            <PaginationRounded />
            <div className="flex items-center space-x-4">
              {/* Search */}
              <input
                type="search"
                placeholder="Search products..."
                className="px-3 py-2 border rounded-md"
              />
              {/* Button to toggle the popup form */}
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-md mb-3"
                onClick={toggleForm} // Trigger toggle on button click
              >
                + new part
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* PopupForm is conditionally rendered based on isFormOpen state */}
            {isFormOpen && <PopupForm onClose={toggleForm} />}
            
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
