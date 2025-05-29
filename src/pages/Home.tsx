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

interface Rider { // interface for Riders
  name: string;
  world_championships: number;
  victories: number;
  image: string;
}

interface Circuit { // interface for Circuits
  name: string;
  country: string;
  gps_held: number;
  image: string;
}

interface Constructor {
    name: string;
    motClass: string;
    constructor_championships: number;
    victories: number;
    image: string;
    id: string;
}

export default function Home() {
  
  const [riders, setRiders] = useState<Rider[]>([]);
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("https://motogp-results-manager-server.onrender.com/api/riders?limit=4")
        .then((res) => res.ok ? res.json() : Promise.reject("Failed to fetch riders"))
        .then((data: Rider[]) => setRiders(Array.isArray(data) ? data : [])),
      fetch("https://motogp-results-manager-server.onrender.com/api/circuits?limit=3")
        .then((res) => res.ok ? res.json() : Promise.reject("Failed to fetch circuits"))
        .then((data: Circuit[]) => setCircuits(Array.isArray(data) ? data : [])),
      fetch("https://motogp-results-manager-server.onrender.com/api/constructors?limit=6")
        .then((res) => res.ok ? res.json() : Promise.reject("Failed to fetch constructors"))
        .then((data: Constructor[]) => setConstructors(Array.isArray(data) ? data : []))
    ])
      .catch(() => setError("Error loading data, please try again later."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Navbar */}
      <header className="p-0 bg-gradient-to-r from-red-700 to-red-500 sticky top-0 z-50">
        <Navbar />
      </header>

      {/* Rotating Banner */}
      <RotatingBanner />

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <LoadingOutlined className="text-4xl text-red-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 font-bold text-lg">{error}</div>
        ) : (
          <div id="content">

            <h3 className="text-2xl font-bold mb-4">Top Riders</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {riders.map((rider, index) => (
                <a key={index} href={`/pilot/${rider.name.replace(/ /g, "_")}`} className="card bg-base-100 p-3 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-blue-600">
                  <div className="card-body">
                    <h2 className="text-xl font-semibold mb-2">{rider.name}</h2>
                    <img src={rider.image} alt="image" height={100} width={100}></img>
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
            <div className="flex justify-center pt-8">
                <a href="/pilots" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-90 hover:scale-105 transition-all duration-300 text-white font-medium rounded-full shadow-lg">
                  See all riders
                </a>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">Top Circuits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {circuits.map((circuit, index) => (
                <a key={index} href={`/circuit/${circuit.name.replace(/ /g, "_")}`} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-indigo-600">
                  <div className="flex flex-row">
                    <div className="card-body p-4 flex-1">
                      <h4 className="text-xl font-semibold mb-2">{circuit.name}</h4>
                      <img src={circuit.image} alt="image" height={150} width={150}></img>
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
            <div className="flex justify-center pt-8 pb-4">
                <a href="/circuits" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 hover:scale-105 transition-all duration-300 text-white font-medium rounded-full shadow-lg">
                  See all tracks
                </a>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">Top Constructors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {constructors.map((constructor, index) => (
                <a key={index} href={`/constructor/${constructor.name.replace(/ /g, "_")}/${constructor.motClass}`} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-emerald-600">
                  <div className="flex flex-row">
                    <div className="card-body p-4 flex-1">
                      <h4 className="text-xl font-semibold mb-2">{constructor.name}
                        <span className="bg-emerald-100 text-emerald-800 text-xs ms-3 font-medium px-2.5 py-0.5 rounded">
                            {constructor.motClass}
                        </span>
                      </h4>
                      <img src={constructor.image} alt="image" height={100} width={100}></img>
                      <p className="text-gray-500">
                        <FlagOutlined className="mr-1" /> {constructor.constructor_championships} Constructor Championships
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <div className="flex justify-center pt-8 pb-8">
                <a href="/constructors" className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:opacity-90 hover:scale-105 transition-all duration-300 text-white font-medium rounded-full shadow-lg">
                  See all constructors
                </a>
            </div>

          </div>
        )}
      </div>
      
      {/* Footer */}
      <Footer />
      
    </div>
  );
}