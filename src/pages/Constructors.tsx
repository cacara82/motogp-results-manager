import { useEffect, useState } from "react";
import {
  FlagOutlined,
  LoadingOutlined,
  LeftOutlined,
  RightOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import Navbar from "../components/navbar.tsx";
import Footer from "../components/footer.tsx";

interface Constructor {
    name: string;
    motClass: string;
    constructor_championships: number;
    victories: number;
    image: string;
    id: string;
}

export default function Constructors() {

  // useStates - CORREGIDO: cambiado de circuits a constructors
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Navigation
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetch("https://motogp-results-manager-server.onrender.com/api/constructors")
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch constructors")))
      .then((data: Constructor[]) => {
        const constructorData = Array.isArray(data) ? data : [];
        setConstructors(constructorData);
        setTotalPages(Math.ceil(constructorData.length / itemsPerPage));
      })
      .catch(() => setError("Error loading data, please try again later."))
      .finally(() => setLoading(false));
  }, []);

  const getCurrentPageConstructors = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return constructors.slice(startIndex, endIndex);
  };

  const getPageNumbers = () => {
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

  const handlePageChange = (pageNumber: number) => {
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
            <h1 className="text-3xl font-bold text-gray-800">All Constructors</h1>
            <a href="/pilots" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-90 transition-all duration-300 text-white font-medium rounded-lg shadow-md">
              Switch to riders
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingOutlined className="text-4xl text-red-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 font-bold text-lg">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCurrentPageConstructors().map((constructor, index) => (
                  <a 
                    key={index} 
                    href={`/constructor/${constructor.name.replace(/ /g, "_")}/${constructor.motClass.replace(/ /g, "_")}`} 
                    className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg overflow-hidden border-t-4 border-emerald-600"
                  >
                    <div className="flex flex-col">
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xl font-semibold text-gray-800">{constructor.name}</h4>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {constructor.motClass}
                          </span>
                        </div>
                        
                        <div className="flex justify-center mb-4">
                          <img 
                            src={constructor.image} 
                            alt={`${constructor.name} logo`} 
                            className="h-24 w-24 object-contain"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-gray-600 flex items-center">
                            <TrophyOutlined className="mr-2 text-amber-500" /> 
                            <span className="font-medium">{constructor.constructor_championships}</span>
                            <span className="ml-1 text-sm">Championships</span>
                          </p>
                          <p className="text-gray-600 flex items-center">
                            <FlagOutlined className="mr-2 text-green-500" /> 
                            <span className="font-medium">{constructor.victories}</span>
                            <span className="ml-1 text-sm">Victories</span>
                          </p>
                        </div>
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
                              : 'text-emerald-600 hover:bg-indigo-100'
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
                                  ? 'bg-emerald-600 text-white'
                                  : 'hover:bg-emerald-100 text-gray-700'
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