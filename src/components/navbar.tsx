import { useState } from 'react';
import { FaHome, FaInfoCircle, FaSearch, FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {

  // Attributes
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#D50000] to-[#FF1744] shadow-lg">

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
    
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-xs">LOGO</span> {/* LOGO */}
              </div>
              <span className="ml-3 text-xl font-bold text-white tracking-wider hidden sm:block">MotoGP Results Manager</span>
            </div>
          </div>

          <div className="hidden md:block flex-1 max-w-md mx-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className={`block w-full pl-10 pr-3 py-2 rounded-full bg-white bg-opacity-20 border border-transparent focus:bg-white focus:text-gray-900 focus:border-white focus:ring-white focus:outline-none transition duration-200 ${
                  searchFocused ? 'text-gray-900' : 'text-white placeholder-gray-300'
                }`}
                placeholder="Search for riders, tracks..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <a href="/" className="px-4 py-2 rounded-md text-white font-medium flex items-center hover:bg-white hover:text-red-600 hover:shadow-md transition duration-200">
              <FaHome className="mr-2" /> Home
            </a>
            <a href="/about" className="px-4 py-2 rounded-md text-white font-medium flex items-center hover:bg-white hover:text-red-600 hover:shadow-md transition duration-200">
              <FaInfoCircle className="mr-2" /> About
            </a>
          </div>

          <div className="md:hidden flex items-center"> {/* MOBILE TOGGLER - hidden by default, only in small screens */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-red-600 focus:outline-none transition duration-200"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
          
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-red-800 shadow-inner">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="block px-3 py-2 rounded-md text-white font-medium hover:bg-white hover:text-red-600 transition duration-200">
              <div className="flex items-center">
                <FaHome className="mr-2" /> Home
              </div>
            </a>
            <a href="/about" className="block px-3 py-2 rounded-md text-white font-medium hover:bg-white hover:text-red-600 transition duration-200">
              <div className="flex items-center">
                <FaInfoCircle className="mr-2" /> About
              </div>
            </a>
            <div className="relative mt-3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 rounded-full bg-white bg-opacity-20 border border-transparent focus:bg-white focus:text-gray-900 focus:border-white focus:ring-white focus:outline-none transition duration-200 text-white placeholder-gray-300"
                placeholder="Search for riders, tracks..."
              />
            </div>
          </div>
        </div>
      )}

    </nav>
  );
}