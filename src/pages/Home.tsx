import {
  TrophyOutlined,
  FlagOutlined,
  TeamOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Home() {
    return (

      <div className="min-h-screen bg-gray-100 flex flex-col">
        
        <header className="p-0 bg-gradient-to-r from-red-700 to-red-500 sticky top-0 z-50">
          <Navbar />
        </header>
  
        <main className="w-full flex-grow">
          <div className="w-full h-[300px] bg-cover bg-center flex items-center justify-center text-center" 
               style={{ backgroundImage: "url('https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}>
            <div className="bg-black bg-opacity-60 rounded-lg p-6 backdrop-blur-sm">
              <h1 className="text-white text-4xl font-bold mb-2">Temporada 2025 MotoGP</h1>
              <p className="text-white text-base mb-5">Administra y analiza los resultados de todas las carreras en un solo lugar</p>
              <button className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700">Ver última carrera</button>
            </div>
          </div>
  
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-4">Top Drivers (MotoGP era)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card bg-gradient-to-br from-red-600 to-red-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="card-body">
                  <h2 className="card-title text-white font-bold">Valentino Rossi</h2>
                  <div className="flex items-baseline">
                    <FlagOutlined className="mr-2 text-xl" />
                    <span className="text-4xl font-semibold">8</span>
                    <span className="ml-1 text-sm">/ 20</span>
                  </div>
                </div>
              </div>
              
              <div className="card bg-gradient-to-br from-purple-800 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="card-body">
                  <h2 className="card-title text-white font-bold">Marc Márquez</h2>
                  <div className="flex items-baseline">
                    <TeamOutlined className="mr-2 text-xl" />
                    <span className="text-4xl font-semibold">22</span>
                  </div>
                </div>
              </div>
              
              <div className="card bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="card-body">
                  <h2 className="card-title text-white font-bold">Ángel Nieto</h2>
                  <div className="flex items-baseline">
                    <TeamOutlined className="mr-2 text-xl" />
                    <span className="text-4xl font-semibold">11</span>
                  </div>
                </div>
              </div>
              
              <div className="card bg-gradient-to-br from-green-700 to-green-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="card-body">
                  <h2 className="card-title text-white font-bold">Jorge Lorenzo</h2>
                  <div className="flex items-baseline">
                    <TrophyOutlined className="mr-2 text-xl" />
                    <span className="text-4xl font-semibold">186</span>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Next Races Section */}
            <h3 className="text-2xl font-bold mt-8 mb-4">Tracks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { 
                  title: "Catalan GP", 
                  date: "12 Mar 2025", 
                  location: "Circuit de Barcelona-Catalunya",
                  image: "https://images.unsplash.com/photo-1621360241219-e75757e5eafe?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                },
                { 
                  title: "GP de Francia", 
                  date: "26 Mar 2025", 
                  location: "Le Mans",
                  image: "https://images.unsplash.com/photo-1575472487159-57f5db982be1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                },
                { 
                  title: "GP de Italia", 
                  date: "9 Abr 2025", 
                  location: "Mugello",
                  image: "https://images.unsplash.com/photo-1532191343192-0e4f9fd4771e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                },
              ].map((race, index) => (
                <div key={index} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-red-600">
                  <div className="flex flex-row">
                    <div className="card-body p-4 flex-1">
                      <h4 className="text-xl font-semibold mb-2">{race.title}</h4>
                      <div className="flex flex-col gap-1">
                        <p className="text-gray-500">
                          <HistoryOutlined className="mr-1" /> {race.date}
                        </p>
                        <p>{race.location}</p>
                      </div>
                    </div>
                    <div className="w-24 h-auto">
                      <img src={race.image} alt={race.title} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
  
            {/* Quick Actions */}
            <div className="divider mt-6"></div>
            <div className="flex justify-center mt-6 flex-wrap gap-3">
              <button className="btn bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white border-none shadow-md hover:shadow-lg transition-all duration-300">
                <TrophyOutlined className="mr-2" /> Clasificación
              </button>
              <button className="btn bg-gradient-to-r from-red-700 to-red-500 text-white hover:opacity-90 border-none shadow-md hover:shadow-lg transition-all duration-300">
                <TeamOutlined className="mr-2" /> Pilotos
              </button>
              <button className="btn bg-gradient-to-r from-red-700 to-red-500 text-white hover:opacity-90 border-none shadow-md hover:shadow-lg transition-all duration-300">
                <FlagOutlined className="mr-2" /> Calendario
              </button>
            </div>
          </div>
  
          <Footer />
        </main>
      </div>
    );
  }
  