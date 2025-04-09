import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {TrophyOutlined, LoadingOutlined, FieldTimeOutlined, ThunderboltOutlined, StarOutlined, FireOutlined} from "@ant-design/icons";
import Navbar from "../components/navbar.tsx";
import Footer from "../components/footer.tsx";

interface Rider {
  name: string;
  world_championships: number;
  victories: number;
  second_places: number;
  third_places: number;
  poles: number;
  image: string;
}

export default function PilotDetail() {
  
  // useStates
  const { name } = useParams<{ name: string }>();
  const [rider, setRider] = useState<Rider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect
  useEffect(() => {
    if (!name) {
      setError("No rider name provided");
      setLoading(false);
      return;
    }

    fetch(`https://motogp-results-manager-server.onrender.com/api/riders/${name}`)
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

      {/* Navbar */}
      <header className="p-0 bg-gradient-to-r from-blue-700 to-blue-500 sticky top-0 z-50">
        <Navbar />
      </header>

      {/* Content */}
      <div className="p-6 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <a href="/pilots" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-all duration-300 text-gray-800 font-medium rounded-lg shadow-md flex items-center">
              ← Back to Riders
            </a>
            <a href="/" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-90 transition-all duration-300 text-white font-medium rounded-lg shadow-md">
              Home
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingOutlined className="text-4xl text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 font-bold text-lg">{error}</div>
          ) : rider ? (
            <div className="space-y-6">
              
              <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center md:flex-row md:items-center md:space-x-6">
                <img src={`${rider.image}`} alt={rider.name} className="w-48 h-48 object-cover border-4 border-blue-500 mb-4 md:mb-0"/>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-800">{rider.name}</h1>
                  <div className="text-gray-600 mt-2 flex justify-center md:justify-start items-center italic">
                    Professional MotoGP Rider
                  </div>
                </div>
              </div>

              
              <div className="bg-white rounded-lg shadow-xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2 border-blue-200">Career Statistics</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <TrophyOutlined className="text-2xl text-amber-500 mr-3" />
                      <div>
                        <div className="text-lg font-medium text-gray-700"><strong>{rider.victories}</strong></div>
                        <div className="text-gray-500">Total Victories</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ThunderboltOutlined className="text-2xl text-amber-500 mr-3" />
                      <div>
                        <div className="text-lg font-medium text-gray-700"><strong>{rider.second_places}</strong></div>
                        <div className="text-gray-500">2nd places</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <StarOutlined className="text-2xl text-amber-500 mr-3" />
                      <div>
                        <div className="text-lg font-medium text-gray-700"><strong>{rider.third_places}</strong></div>
                        <div className="text-gray-500">3rd places</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FieldTimeOutlined className="text-2xl text-amber-500 mr-3" />
                      <div>
                        <div className="text-lg font-medium text-gray-700"><strong>{rider.poles}</strong></div>
                        <div className="text-gray-500">Poles</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FireOutlined className="text-2xl text-blue-600 mr-3" />
                      <div>
                        <div className="text-lg font-medium text-gray-700"><strong>{rider.world_championships}</strong></div>
                        <div className="text-gray-500">World Championships</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {rider.world_championships > 3 && (
                <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
                  <div className="p-4 bg-blue-50 border-t-4 border-blue-600 text-blue-700 rounded-lg shadow">
                    <p>
                        <strong>{rider.name}</strong> is a legendary MotoGP rider who has left an indelible mark on the sport. 
                        With <strong>{rider.world_championships}</strong> World Championships and <strong>{rider.victories}</strong> victories, 
                        it has established itself as one of the most successful and iconic riders in MotoGP history.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-red-600 font-bold text-lg">Rider not found</div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <Footer />

    </div>
  );
}