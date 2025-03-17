import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WarningOutlined, HomeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Navbar from "../components/navbar.tsx";
import Footer from "../components/footer.tsx";

export default function NotFound() {
  const navigate = useNavigate();

  // Registrar la página no encontrada en consola
  useEffect(() => {
    console.log("404 Page Not Found");
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="p-0 bg-gradient-to-r from-red-700 to-red-500 sticky top-0 z-50">
        <Navbar />
      </header>

      <div className="p-6 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => navigate(-1)} 
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-all duration-300 text-gray-800 font-medium rounded-lg shadow-md flex items-center"
            >
              <ArrowLeftOutlined className="mr-2" /> Go Back
            </button>
            <a 
              href="/" 
              className="px-4 py-2 bg-gradient-to-r from-[#D50000] to-[#FF1744] hover:opacity-90 transition-all duration-300 text-white font-medium rounded-lg shadow-md flex items-center"
            >
              <HomeOutlined className="mr-2" /> Home
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-500 p-6 text-white">
              <h1 className="text-3xl font-bold flex items-center">
                <WarningOutlined className="mr-3 text-4xl" />
                Page Not Found
              </h1>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-8 shadow text-center">
                <div className="flex justify-center mb-6">
                  <WarningOutlined className="text-6xl text-red-500" />
                </div>
                
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Oops! This page doesn't exist
                </h2>
                
                <p className="text-gray-600 mb-6">
                  The page you're looking for might have been removed, had its name changed, 
                  or is temporarily unavailable.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <a 
                    href="/circuits" 
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white font-medium rounded-lg shadow-md flex items-center justify-center"
                  >
                    View Circuits
                  </a>
                  <a 
                    href="/pilots" 
                    className="px-4 py-3 bg-green-600 hover:bg-green-700 transition-all duration-300 text-white font-medium rounded-lg shadow-md flex items-center justify-center"
                  >
                    View Riders
                  </a>
                </div>
                
                <div className="mt-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-left">
                  <p>
                    If you think this is an error, please contact the site administrator or
                    try refreshing the page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}