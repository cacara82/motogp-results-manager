import { Layout } from 'antd';
import { GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0">
          <p>Carlos Carvajal Ramos © 2025</p>
        </div>
        
        <div className="mb-4 sm:mb-0 flex space-x-4">
          <a href="#" className="text-white hover:text-red-400 transition-colors">Home</a>
          <a href="#" className="text-white hover:text-red-400 transition-colors">About</a>
          <a href="#" className="text-white hover:text-red-400 transition-colors">Socials</a>
        </div>
        
        <div>
          <p className="mb-2 text-center">Contact</p>
          <div className="flex space-x-4 justify-center">
            <a href="https://github.com/cacara82" target="_blank" rel="noreferrer" className="text-white hover:text-red-400 transition-colors">
              <span className="text-xl"><GithubOutlined /></span>
            </a>
            <a href="https://www.linkedin.com/in/carlos-carvajal-ramos-709290213/" target="_blank" rel="noreferrer" className="text-white hover:text-red-400 transition-colors">
              <span className="text-xl"><LinkedinOutlined /></span>
            </a>
            <a href="mailto:cacara890@gmail.com" target="_blank" rel="noreferrer" className="text-white hover:text-red-400 transition-colors">
              <span className="text-xl"><MailOutlined /></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
