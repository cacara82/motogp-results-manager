import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WarningOutlined, HomeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Navbar from "../components/navbar.tsx";
import Footer from "../components/footer.tsx";

export default function NotFound() {

  // Attributes and uses
  const navigate = useNavigate();
  useEffect(() => { // print not found error on console
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
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-all duration-300 text-gray-800 font-medium rounded-lg shadow-md flex items-center">
              <ArrowLeftOutlined className="mr-2" /> Go Back
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-xl overflow-hidden">

            <div className=" bg-gradient-to-r from-[#D50000] to-[#FF1744] p-6 text-white">
              <h1 className="text-3xl font-bold flex items-center">
                <WarningOutlined className="mr-3 text-4xl" /> 404: Page Not Found
              </h1>
            </div>
            
            <div className="p-6">

              <div className="bg-gray-50 rounded-lg p-8 shadow text-center">

                <div className="flex text-[#D50000] justify-center mb-6">
                  <WarningOutlined className="text-6xl text-red-500" />
                </div>
                
                <h2 className="text-2xl font-bold italic mb-4 text-gray-900"> Oops! This page doesn't exist </h2>
                <p className="text-gray-800 font mb-6">The page you're looking for might have been removed or does not exist.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 max-w-md mx-auto">
                  <a href="/" className="px-4 py-2 bg-gradient-to-r from-[#D50000] to-[#FF1744] hover:opacity-90 transition-all duration-300 text-white font-medium rounded-lg shadow-md justify-center flex items-center">
                    <HomeOutlined className="mr-2" /> Go Home
                  </a>
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