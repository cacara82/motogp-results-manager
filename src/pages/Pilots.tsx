import { useEffect, useState } from "react";
import {
  TrophyOutlined,
  TeamOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Navbar from "../components/navbar.tsx";
import Footer from "../components/footer.tsx";

interface Rider {
  name: string;
  world_championships: number;
  victories: number;
}

export default function Pilots() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/riders")
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch riders")))
      .then((data: Rider[]) => setRiders(Array.isArray(data) ? data : []))
      .catch(() => setError("Error loading data, please try again later."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="p-0 bg-gradient-to-r from-red-700 to-red-500 sticky top-0 z-50">
        <Navbar />
      </header>

      <div className="p-6 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">All MotoGP Riders</h1>
            <a 
              href="/" 
              className="px-4 py-2 bg-gradient-to-r from-[#D50000] to-[#FF1744] hover:opacity-90 transition-all duration-300 text-white font-medium rounded-lg shadow-md"
            >
              Back to Home
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingOutlined className="text-4xl text-red-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 font-bold text-lg">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {riders.map((rider, index) => (
                <a
                  key={index}
                  href={`/pilot/${rider.name.replace(/ /g, "_")}`}
                  className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg overflow-hidden border-t-4 border-blue-600"
                >
                  <div className="card-body p-4">
                    <h2 className="text-xl font-bold text-gray-800">{rider.name}</h2>
                    <div className="flex items-center mt-2 text-gray-700">
                      <TrophyOutlined className="mr-2 text-amber-500" />
                      <span>{rider.victories} Victories</span>
                    </div>
                    <div className="flex items-center mt-1 text-gray-700">
                      <TeamOutlined className="mr-2 text-blue-600" />
                      <span>{rider.world_championships} Championships</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}