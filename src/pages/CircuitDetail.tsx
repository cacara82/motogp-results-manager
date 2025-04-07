import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  HistoryOutlined,
  LoadingOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
import Navbar from "../components/navbar.tsx";
import Footer from "../components/footer.tsx";

interface Circuit {
  name: string;
  country: string;
  gps_held: number;
  image: string;
}

export default function CircuitDetail() {

  // useStates
  const { name } = useParams<{ name: string }>();
  const [circuit, setCircuit] = useState<Circuit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect
  useEffect(() => {
    if (!name || name.trim() === "") {
      setError("No circuit name provided");
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/circuits/${name}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch circuit details: ${res.status}`);
        }
        return res.json();
      })
      .then(setCircuit)
      .catch((err) => setError(`Error loading circuit data: ${err.message}`))
      .finally(() => setLoading(false));
  }, [name]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Navbar */}
      <header className="p-0 bg-gradient-to-r from-indigo-700 to-indigo-500 sticky top-0 z-50">
        <Navbar />
      </header>

      {/* Content */}
      <div className="p-6 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <a href="/circuits" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-all duration-300 text-gray-800 font-medium rounded-lg shadow-md flex items-center">
              ← Back to Circuits
            </a>
            <a href="/" className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 transition-all duration-300 text-white font-medium rounded-lg shadow-md">
              Home
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingOutlined className="text-4xl text-indigo-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 font-bold text-lg">{error}</div>
          ) : circuit ? (
            <div className="space-y-6">
              
              <div className="bg-white rounded-lg shadow-xl p-6 flex items-center space-x-6">
              <img src={`${circuit.image}`} alt={circuit.name} className="w-48 h-48 object-cover border-4 border-indigo-500"/>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{circuit.name}</h1>
                  <div className="text-gray-600 mt-2 flex items-center italic">
                    MotoGP competition track
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2 border-indigo-200">
                  Circuit Statistics
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <HistoryOutlined className="text-2xl text-red-500 mr-3" />
                      <div>
                        <div className="text-lg font-medium text-gray-700">{circuit.gps_held}</div>
                        <div className="text-gray-500">Grand Prix Events Held</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <EnvironmentOutlined className="text-2xl text-green-600 mr-3" />
                      <div>
                        <div className="text-lg font-medium text-gray-700">{circuit.country}</div>
                        <div className="text-gray-500">Location</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {circuit.gps_held > 50 && (
                <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
                <div className="p-4 bg-indigo-50 border-t-4 border-indigo-600 text-indigo-700 rounded-lg shadow">
                  <p>
                    <strong>{circuit.name}</strong> is a legendary MotoGP circuit that has hosted some of the most thrilling races in the sport's history.  
                    With <strong>{circuit.gps_held}</strong> Grand Prix events held up to this day, it remains one of the most iconic and prestigious venues in MotoGP history.
                  </p>
                </div>
              </div>
              )}
            </div>           
          ) : (
            <div className="text-center text-red-600 font-bold text-lg">Circuit not found</div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}