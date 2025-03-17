import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  TrophyOutlined,
  TeamOutlined,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Navbar from "../components/navbar.tsx";
import Footer from "../components/footer.tsx";

interface Rider {
  name: string;
  world_championships: number;
  victories: number;
}

export default function PilotDetail() {
  const { name } = useParams<{ name: string }>();
  
  const [rider, setRider] = useState<Rider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) {
      setError("No rider name provided");
      setLoading(false);
      return;
    }

    const encodedName = encodeURIComponent(name);

    fetch(`http://127.0.0.1:8000/api/riders/${encodedName}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch rider details`);
        return res.json();
      })
      .then(setRider)
      .catch((err) => setError(`Error loading rider data: ${err.message}`))
      .finally(() => setLoading(false));
  }, [name]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="p-0 bg-gradient-to-r from-red-700 to-red-500 sticky top-0 z-50">
        <Navbar />
      </header>

      <div className="p-6 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <a 
              href="/pilots" 
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-all duration-300 text-gray-800 font-medium rounded-lg shadow-md flex items-center"
            >
              ← Back to Riders
            </a>
            <a 
              href="/" 
              className="px-4 py-2 bg-gradient-to-r from-[#D50000] to-[#FF1744] hover:opacity-90 transition-all duration-300 text-white font-medium rounded-lg shadow-md"
            >
              Home
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingOutlined className="text-4xl text-red-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 font-bold text-lg">{error}</div>
          ) : rider ? (
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white">
                <h1 className="text-3xl font-bold flex items-center">
                  <UserOutlined className="mr-3 text-4xl" />
                  {rider.name}
                </h1>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4 shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Career Statistics</h2>
                    
                    <div className="flex items-center py-3 border-b border-gray-200">
                      <TrophyOutlined className="text-2xl text-amber-500 mr-3" />
                      <div>
                        <div className="text-lg font-medium">{rider.victories}</div>
                        <div className="text-gray-500">Total Victories</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center py-3">
                      <TeamOutlined className="text-2xl text-blue-600 mr-3" />
                      <div>
                        <div className="text-lg font-medium">{rider.world_championships}</div>
                        <div className="text-gray-500">World Championships</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">About {rider.name}</h2>
                    <p className="text-gray-600">
                      {rider.name} is a legendary MotoGP rider with an impressive career, 
                      having won {rider.world_championships} World Championships and 
                      securing {rider.victories} victories throughout their racing journey.
                    </p>
                    <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 text-blue-700 rounded">
                      <p>
                        This rider ranks among the most successful in MotoGP history 
                        with their impressive championship record.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-500 italic">
                    Further rider statistics and race results will be available soon.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-600 font-bold text-lg">Rider not found</div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
