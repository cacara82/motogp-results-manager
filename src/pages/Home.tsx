import { useEffect, useState } from "react";
import {
  TrophyOutlined,
  FlagOutlined,
  TeamOutlined,
  HistoryOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Navbar from "../components/navbar.tsx";
import Footer from "../components/footer.tsx";
import RotatingBanner from "../components/rotating-banner.tsx";

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

export default function Home() {
  
  const [riders, setRiders] = useState<Rider[]>([]);
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:8000/api/riders?limit=4")
        .then((res) => res.ok ? res.json() : Promise.reject("Failed to fetch riders"))
        .then((data: Rider[]) => setRiders(Array.isArray(data) ? data : [])),
      fetch("http://127.0.0.1:8000/api/circuits?limit=3")
        .then((res) => res.ok ? res.json() : Promise.reject("Failed to fetch circuits"))
        .then((data: Circuit[]) => setCircuits(Array.isArray(data) ? data : [])),
    ])
      .catch(() => setError("Error loading data, please try again later."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="p-0 bg-gradient-to-r from-red-700 to-red-500 sticky top-0 z-50">
        <Navbar />
      </header>

      <RotatingBanner />

      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <LoadingOutlined className="text-4xl text-red-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 font-bold text-lg">{error}</div>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-4">Top Riders</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {riders.map((rider, index) => (
                <a
                  key={index}
                  href={`/pilot/${rider.name.replace(/ /g, "_")}`}
                  className="card bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="card-body">
                    <h2 className="card-title text-white font-bold">{rider.name}</h2>
                    <div className="flex items-center">
                      <TrophyOutlined className="mr-2 text-xl" />
                      <span>{rider.victories} Victories</span>
                    </div>
                    <div className="flex items-center">
                      <TeamOutlined className="mr-2 text-xl" />
                      <span>{rider.world_championships} Championships</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">Top Circuits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {circuits.map((circuit, index) => (
                <a
                  key={index}
                  href={`/circuit/${circuit.name.replace(/ /g, "_")}`}
                  className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-red-600"
                >
                  <div className="flex flex-row">
                    <div className="card-body p-4 flex-1">
                      <h4 className="text-xl font-semibold mb-2">{circuit.name}</h4>
                      <p className="text-gray-500">
                        <FlagOutlined className="mr-1" /> {circuit.country}
                      </p>
                      <p>
                        <HistoryOutlined className="mr-1" /> {circuit.gps_held} GPs Held
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
