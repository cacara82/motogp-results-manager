import { useState, useEffect, useRef } from 'react';
import { FaHome, FaInfoCircle, FaSearch, FaBars, FaTimes, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

interface Rider {
  name: string;
  world_championships: number;
  victories: number;
}

interface Circuit {
  name: string;
  country: string;
  gps_held: number;
}

// Unión de tipos para los resultados de búsqueda
interface RiderSearchResult extends Rider {
  type: 'rider';
}

interface CircuitSearchResult extends Circuit {
  type: 'circuit';
}

type SearchResult = RiderSearchResult | CircuitSearchResult;

export default function Navbar() {

  // useStates
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => { // useEffect to fetch search results when searchTerm changes
    const fetchSearchResults = async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try { // try to fetch riders and circuits
        const [ridersResponse, circuitsResponse] = await Promise.all([ 
          fetch('http://127.0.0.1:8000/api/riders'),
          fetch('http://127.0.0.1:8000/api/circuits')
        ]);
        const riders: Rider[] = await ridersResponse.json();
        const circuits: Circuit[] = await circuitsResponse.json();
        const filteredRiders: RiderSearchResult[] = riders // filter based on search term and add type property
          .filter(rider => rider.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(rider => ({ ...rider, type: 'rider' as const }));
        const filteredCircuits: CircuitSearchResult[] = circuits
          .filter(circuit => circuit.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(circuit => ({ ...circuit, type: 'circuit' as const }));
        const combinedResults: SearchResult[] = [...filteredRiders, ...filteredCircuits].slice(0, 5); // combine and limit results
        setSearchResults(combinedResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    };
    const timer = setTimeout(fetchSearchResults, 300); // timer to limit nº of searches and not overload the API
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => { // useEffect to handle click outside to close search results
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => { // handle search input change
    setSearchTerm(e.target.value);
  };

  const renderResultContent = (result: SearchResult) => { // render different content based on result type (pilot/track)
    if (result.type === 'rider') {
      return (
        <>
          <FaUser className="mr-3 text-blue-600" />
          <div>
            <div className="font-medium">{result.name}</div>
            <div className="text-sm text-gray-500">
              Rider - {result.world_championships} Championships
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <FaMapMarkerAlt className="mr-3 text-rose-600" />
          <div>
            <div className="font-medium">{result.name}</div>
            <div className="text-sm text-gray-500">
              Circuit - {result.country}
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#D50000] to-[#FF1744] shadow-lg">

      {/* Desktop menu */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
    
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-xs">LOGO</span>
              </div>
              <span className="ml-3 text-xl font-bold text-white tracking-wider hidden sm:block">MotoGP Results Manager</span>
            </div>
          </div>

          <div className="hidden md:block flex-1 max-w-md mx-6">
            <div className="relative" ref={searchRef}>
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
                onChange={handleSearchChange}
                value={searchTerm}
              />
              
              {searchResults.length > 0 && searchFocused && (
                <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-50 overflow-hidden">
                  <ul className="max-h-60 overflow-y-auto">
                    {isLoading ? (
                      <li className="px-4 py-2 text-gray-500">Loading...</li>
                    ) : (
                      searchResults.map((result, index) => (
                        <li key={`${result.type}-${index}`}>
                          <a
                            href={`/${result.type === 'rider' ? 'pilot' : 'circuit'}/${result.name.replace(/ /g, '_')}`}
                            className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100 transition duration-150"
                          >
                            <div className="flex items-center">
                              {renderResultContent(result)}
                            </div>
                          </a>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
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

          <div className="md:hidden flex items-center">
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

      {/* Mobile menu */}
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
            
            <div className="relative mt-3" ref={searchRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 rounded-full bg-white bg-opacity-20 border border-transparent focus:bg-white focus:text-gray-900 focus:border-white focus:ring-white focus:outline-none transition duration-200 text-white placeholder-gray-300"
                placeholder="Search for riders, tracks..."
                onChange={handleSearchChange}
                value={searchTerm}
              />
              
              {searchResults.length > 0 && (
                <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-50 overflow-hidden">
                  <ul className="max-h-60 overflow-y-auto">
                    {isLoading ? (
                      <li className="px-4 py-2 text-gray-500">Loading...</li>
                    ) : (
                      searchResults.map((result, index) => (
                        <li key={`mobile-${result.type}-${index}`}>
                          <a
                            href={`/${result.type === 'rider' ? 'pilot' : 'circuit'}/${result.name.replace(/ /g, '_')}`}
                            className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100 transition duration-150"
                          >
                            <div className="flex items-center">
                              {renderResultContent(result)}
                            </div>
                          </a>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
    </nav>
  );
}