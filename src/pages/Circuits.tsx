import { useEffect, useState } from "react";
import {
  FlagOutlined,
  HistoryOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Navbar from "../components/navbar.tsx";
import Footer from "../components/footer.tsx";

interface Circuit {
  name: string;
  country: string;
  gps_held: number;
}

export default function Circuits() {
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/circuits")
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch circuits")))
      .then((data: Circuit[]) => setCircuits(Array.isArray(data) ? data : []))
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
            <h1 className="text-3xl font-bold text-gray-800">All MotoGP Circuits</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {circuits.map((circuit, index) => (
                <a
                  key={index}
                  href={`/circuit/${circuit.name.replace(/ /g, "_")}`}
                  className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-red-600 rounded-lg"
                >
                  <div className="flex flex-row">
                    <div className="card-body p-4 flex-1">
                      <h4 className="text-xl font-semibold mb-2 text-gray-800">{circuit.name}</h4>
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
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}