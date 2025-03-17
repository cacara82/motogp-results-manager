import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FlagOutlined,
  HistoryOutlined,
  LoadingOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Navbar from "../components/navbar.tsx";
import Footer from "../components/footer.tsx";

interface Circuit {
  name: string;
  country: string;
  gps_held: number;
}

export default function CircuitDetail() {
  const { name } = useParams<{ name: string }>();
  
  const [circuit, setCircuit] = useState<Circuit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar que name exista y no esté vacío
    if (!name || name.trim() === "") {
      setError("No circuit name provided");
      setLoading(false);
      return;
    }

    console.log(`Fetching details for circuit: ${name}`);
    
    fetch(`http://127.0.0.1:8000/api/circuits/${name}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch circuit details: ${res.status}`);
        }
        return res.json();
      })
      .then((data: Circuit) => {
        console.log("Circuit data received:", data);
        setCircuit(data);
      })
      .catch((err) => {
        console.error("Error loading circuit data:", err);
        setError(`Error loading circuit data: ${err.message}`);
      })
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
              href="/circuits" 
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-all duration-300 text-gray-800 font-medium rounded-lg shadow-md flex items-center"
            >
              ← Back to Circuits
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
          ) : circuit ? (
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-red-700 to-red-500 p-6 text-white">
                <h1 className="text-3xl font-bold flex items-center">
                  <EnvironmentOutlined className="mr-3 text-4xl" />
                  {circuit.name}
                </h1>
                <div className="mt-2 flex items-center">
                  <FlagOutlined className="mr-2" />
                  <span>{circuit.country}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4 shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Circuit Statistics</h2>
                    
                    <div className="flex items-center py-3 border-b border-gray-200">
                      <HistoryOutlined className="text-2xl text-red-500 mr-3" />
                      <div>
                        <div className="text-lg font-medium">{circuit.gps_held}</div>
                        <div className="text-gray-500">Grand Prix Events Held</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center py-3">
                      <FlagOutlined className="text-2xl text-blue-600 mr-3" />
                      <div>
                        <div className="text-lg font-medium">{circuit.country}</div>
                        <div className="text-gray-500">Country</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">About {circuit.name}</h2>
                    <p className="text-gray-600">
                      {circuit.name} is a renowned circuit located in {circuit.country} 
                      that has hosted {circuit.gps_held} Grand Prix events throughout 
                      MotoGP history, making it one of the {circuit.gps_held > 30 ? 'most iconic' : 'notable'} 
                      tracks in the championship.
                    </p>
                    <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                      <p>
                        This circuit has been a staple in the MotoGP calendar, providing 
                        fans with thrilling races and memorable moments.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-500 italic">
                    Further circuit details, track layout, and race records will be available soon.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-600 font-bold text-lg">Circuit not found</div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}