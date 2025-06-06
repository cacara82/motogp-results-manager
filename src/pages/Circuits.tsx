import { useEffect, useState } from "react";
import {
  FlagOutlined,
  HistoryOutlined,
  LoadingOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Navbar from "../components/navbar.tsx";
import Footer from "../components/footer.tsx";

interface Circuit { // interface for circuit
  name: string;
  country: string;
  gps_held: number;
  image: string;
}

export default function Circuits() {

  // useStates
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Navigation
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Ajusta según necesites
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => { // useEffect to fetch circuits
    fetch("https://motogp-results-manager-server.onrender.com/api/circuits")
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch circuits")))
      .then((data: Circuit[]) => {
        const circuitData = Array.isArray(data) ? data : [];
        setCircuits(circuitData);
        setTotalPages(Math.ceil(circuitData.length / itemsPerPage));
      })
      .catch(() => setError("Error loading data, please try again later."))
      .finally(() => setLoading(false));
  }, []);

  const getCurrentPageCircuits = () => { // obtain circuits for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return circuits.slice(startIndex, endIndex);
  };

  const getPageNumbers = () => { // generates navigation numbers
    const visiblePages = 5;
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = startPage + visiblePages - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - visiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    while (pageNumbers.length < visiblePages) {
      pageNumbers.push(null);
    }
    return pageNumbers;
  };

  const handlePageChange = (pageNumber: number) => { // handle for page change
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Navbar */}
      <header className="p-0 bg-gradient-to-r from-red-700 to-red-500 sticky top-0 z-50">
        <Navbar />
      </header>

      {/* Content */}
      <div className="p-6 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">All Circuits</h1>
            <div className="flex gap-3">
              <a href="/pilots" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-90 transition-all duration-300 text-white font-medium rounded-lg shadow-md">
                Switch to riders
              </a>
              <a href="/constructors" className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:opacity-90 transition-all duration-300 text-white font-medium rounded-lg shadow-md">
                Switch to constructors
              </a>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingOutlined className="text-4xl text-red-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 font-bold text-lg">{error}</div>
          ) : (
            <>
              <div className="pt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCurrentPageCircuits().map((circuit, index) => (
                  <a key={index} href={`/circuit/${circuit.name.replace(/ /g, "_")}`} className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg overflow-hidden border-t-4 border-indigo-600">
                    <div className="flex flex-row">
                      <div className="card-body p-4 flex-1">
                        <h4 className="text-xl font-semibold mb-2 text-gray-800">{circuit.name}</h4>
                        <img src={circuit.image} alt="image" height={125} width={125}></img>
                        <p className="text-gray-600 flex items-center">
                          <FlagOutlined className="mr-2 text-blue-500" /> {circuit.country}
                        </p>
                        <p className="text-gray-600 flex items-center mt-1">
                          <HistoryOutlined className="mr-2 text-red-500" /> {circuit.gps_held} GPs Held
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="inline-flex items-center">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            currentPage === 1 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-indigo-600 hover:bg-indigo-100'
                          }`}
                          aria-label="Previous page"
                        >
                          <LeftOutlined />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-center w-64">
                        {currentPage > 3 && totalPages > 5 && (
                          <>
                            <button onClick={() => handlePageChange(1)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-red-100 text-gray-700">
                              1
                            </button>
                            {currentPage > 4 && (
                              <span className="flex items-center justify-center w-10 h-10 text-gray-500">...</span>
                            )}
                          </>
                        )}
                        
                        {getPageNumbers().map((number, index) => (
                          number !== null ? (
                            <button
                              key={index}
                              onClick={() => handlePageChange(number)}
                              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                currentPage === number
                                  ? 'bg-indigo-600 text-white'
                                  : 'hover:bg-indigo-100 text-gray-700'
                              }`}
                            >
                              {number}
                            </button>
                          ) : (
                            <span key={index} className="flex items-center justify-center w-10 h-10"></span>
                          )
                        ))}
                        
                        {currentPage < totalPages - 2 && totalPages > 5 && (
                          <>
                            {currentPage < totalPages - 3 && (
                              <span className="flex items-center justify-center w-10 h-10 text-gray-500">...</span>
                            )}
                            <button onClick={() => handlePageChange(totalPages)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-red-100 text-gray-700">
                              {totalPages}
                            </button>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            currentPage === totalPages 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-indigo-600 hover:bg-indigo-100'
                          }`}
                          aria-label="Next page"
                        >
                          <RightOutlined />
                        </button>
                      </div>
                    </div>
                  </nav>
                </div>
              )}
              
            </>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <Footer />

    </div>
  );
}