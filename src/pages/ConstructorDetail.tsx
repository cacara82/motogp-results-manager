import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {TrophyOutlined, LoadingOutlined, FlagOutlined} from "@ant-design/icons";
import Navbar from "../components/navbar.tsx";
import Footer from "../components/footer.tsx";

interface Constructor {
    name: string;
    class: string;
    constructor_championships: number;
    victories: number;
    image: string;
    id: string;
}

export default function ConstructorDetail() {
  
  // useStates - CORREGIDO: ahora captura ambos parámetros correctamente
  const { name, motClass } = useParams<{ name: string; motClass: string }>();
  const [constructor, setConstructor] = useState<Constructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect
  useEffect(() => {
    if (!name || !motClass) {
      setError("No constructor name or class provided");
      setLoading(false);
      return;
    }

    fetch(`https://motogp-results-manager-server.onrender.com/api/constructor/${name}/${motClass}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 204) {
            throw new Error("Constructor not found for the specified class");
          }
          throw new Error(`Failed to fetch constructor details`);
        }
        return res.json();
      })
      .then(setConstructor)
      .catch((err) => setError(`Error loading constructor data: ${err.message}`))
      .finally(() => setLoading(false));
  }, [name, motClass]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Navbar */}
      <header className="p-0 bg-gradient-to-r from-red-700 to-red-500 sticky top-0 z-50">
        <Navbar />
      </header>

      {/* Content */}
      <div className="p-6 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <a href="/constructors" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-all duration-300 text-gray-800 font-medium rounded-lg shadow-md flex items-center">
              ← Back to Constructors
            </a>
            <a href="/" className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:opacity-90 transition-all duration-300 text-white font-medium rounded-lg shadow-md">
              Home
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingOutlined className="text-4xl text-red-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 font-bold text-lg">{error}</div>
          ) : constructor ? (
            <div className="space-y-6">
              
              {/* Constructor Info Card */}
              <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center md:flex-row md:items-center md:space-x-6">
                <img 
                  src={constructor.image} 
                  alt={constructor.name} 
                  className="w-48 h-48 object-contain border-4 border-emerald-500 mb-4 md:mb-0"
                />
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {constructor.name} 
                    <span className="bg-blue-100 text-blue-800 text-lg ms-4 font-medium px-3 py-1 rounded-full">
                      {constructor.class}
                    </span>
                  </h1>
                  <div className="text-gray-600 mt-2 italic">
                    Motocycling Constructor
                  </div>
                </div>
              </div>

              {/* Statistics Card */}
              <div className="bg-white rounded-lg shadow-xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2 border-red-200">
                  Statistics
                </h2>
                <div className="space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <TrophyOutlined className="text-3xl text-amber-500 mr-4" />
                      <div>
                        <div className="text-2xl font-bold text-gray-700">{constructor.constructor_championships}</div>
                        <div className="text-gray-500">Constructor Championships</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FlagOutlined className="text-3xl text-green-500 mr-4" />
                      <div>
                        <div className="text-2xl font-bold text-gray-700">{constructor.victories}</div>
                        <div className="text-gray-500">Total Victories</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info Card */}
              {constructor.victories > 50 && constructor.constructor_championships > 0 && (
                <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
                  <div className="p-4 bg-emerald-50 border-t-4 border-emerald-600 text-emerald-700 rounded-lg shadow">
                    <p>
                        <strong>{constructor.name}</strong> is one of the top <strong>{constructor.class}</strong> constructors in the history of the category. 
                        It holds <strong>{constructor.constructor_championships}</strong> Constructor Championship/s and <strong>{constructor.victories}</strong> victories
                        registered as of today.
                    </p>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center text-red-600 font-bold text-lg">Constructor not found</div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <Footer />

    </div>
  );
}