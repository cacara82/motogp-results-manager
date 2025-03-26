import { GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-3 mt-auto">
      <div className="container mx-auto px-2 flex flex-col sm:flex-row justify-between items-center text-sm">
        <div className="mb-2 sm:mb-0">
          <p className="text-xs">Carlos Carvajal Ramos • {new Date().getFullYear()}</p>
        </div>
        
        <div className="mb-2 sm:mb-0 flex space-x-2">
          <a href="/" className="text-white hover:text-red-400 transition-colors text-xs">Home</a>
          <a href="/about" className="text-white hover:text-red-400 transition-colors text-xs">About</a>
        </div>
        
        <div>
          <div className="flex space-x-3 justify-center items-center">
            <p className="text-xs mr-3">Contact</p>
            <span>•</span>
            <a href="https://github.com/cacara82" target="_blank" rel="noreferrer" className="text-white hover:text-red-400 transition-colors">
              <span className="text-base"><GithubOutlined /></span>
            </a>
            <a href="https://www.linkedin.com/in/carlos-carvajal-ramos-709290213/" target="_blank" rel="noreferrer" className="text-white hover:text-red-400 transition-colors">
              <span className="text-base"><LinkedinOutlined /></span>
            </a>
            <a href="mailto:cacara890@gmail.com" target="_blank" rel="noreferrer" className="text-white hover:text-red-400 transition-colors">
              <span className="text-base"><MailOutlined /></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}