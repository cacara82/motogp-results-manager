import { FaInfo, FaExclamationTriangle, FaInfoCircle, FaChartLine } from 'react-icons/fa';
import Navbar from "../components/navbar.tsx";
import Footer from "../components/footer.tsx";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Navbar */}
      <header className="p-0 bg-gradient-to-r from-red-700 to-red-500 sticky top-0 z-50">
        <Navbar />
      </header>

      {/* Content */}
      <div className="p-6 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#D50000] to-[#FF1744] p-6 text-white">
              <h1 className="text-3xl font-bold flex items-center">
                <FaInfo className="mr-3 text-4xl" />
                About MotoGP Results Manager
              </h1>
            </div>
            
            <div className="p-6">
                
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">

              <div className="bg-gray-50 rounded-lg p-4 shadow">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                    <FaInfoCircle className="mr-3 text-red-600" />
                    What is this?
                  </h2>
                  <p className="text-gray-600">
                    MotoGP Results Manager is an open source, simple yet insightful tool built to help you explore different types of statistics.
                    Whether you're looking for specific rider data or just browsing out of curiosity, 
                    this platform offers an easy way to access and analyze MotoGP information.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 shadow">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                    <FaChartLine className="mr-3 text-red-600" />
                    What is the purpose of the app?
                  </h2>
                  <p className="text-gray-600 pb-2">
                    Even though this platform started as a personal project to practise web programming, 
                    over time, it has grown into being a fully-fledged comprehensive and structured MotoGP data repository.
                  </p>
                  <p className="text-gray-600 pb-2">
                    While there may be other sources with more in-depth statistics, the goal of this tool is to provide a centralized and continuously expanding database that makes it easy to explore rider stats, 
                    track records, and other information. 
                  </p>
                  <p className="text-gray-600">
                    As the project evolves, new content will be added periodically, 
                    making it a resource open to anyone—whether you're a dedicated fan, a casual follower, or just curious about the sport.
                  </p>
                </div>

              </div>

              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 rounded-lg shadow">
                <div className="flex items-center mb-3">
                  <FaExclamationTriangle className="mr-3 text-2xl" />
                  <h3 className="text-xl font-semibold">Data Accuracy Notice</h3>
                </div>
                <p>
                    Please note that this app is built on a KaggleHub dataset, which means it has inherent limitations and primarily includes information up to 2022.
                    This is a non-commercial project, created purely for fun. If you happen to know of a free-to-use API or dataset with more up-to-date information, 
                    we would greatly appreciate it if you could share it with us via email <a className="text-blue-500 underline" href="mailto:cacara890@gmail.com">here</a>.
                    Thank you!
                </p>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-600 text-blue-700 rounded-lg shadow">
                <p>
                    <li className='ml-5'>You can download the current version of the dataset used <a className="underline text-blue-500" href="https://www.kaggle.com/datasets/alrizacelk/moto-gp-world-championship19492022">here</a>.</li>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />

    </div>
  );
}