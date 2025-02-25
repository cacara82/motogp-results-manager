import { Layout } from 'antd';
import { GithubOutlined, LinkedinOutlined, TwitterOutlined, MailOutlined } from '@ant-design/icons';
import './Footer.css';

const { Footer: AntFooter } = Layout;

export default function Footer() {
  return (
    <AntFooter className="app-footer">
      <div className="footer-container">
        {/* Bloque 1: Copyright */}
        <div className="footer-section footer-copyright">
          Carlos Carvajal Ramos ©2025 - Creado con React + Vite + Ant Design
        </div>

        {/* Bloque 2: Enlaces */}
        <div className="footer-section footer-links">
          <a href="#">Inicio</a>
          <a href="#">Servicios</a>
          <a href="#">Proyectos</a>
          <a href="#">Sobre mí</a>
        </div>

        {/* Bloque 3: Redes Sociales */}
        <div className="footer-section footer-social">
          <span>Contacto</span>
          <div className="social-icons">
            <a href="https://github.com/tucuenta" target="_blank" rel="noreferrer">
              <GithubOutlined />
            </a>
            <a href="https://linkedin.com/in/tucuenta" target="_blank" rel="noreferrer">
              <LinkedinOutlined />
            </a>
            <a href="https://twitter.com/tucuenta" target="_blank" rel="noreferrer">
              <TwitterOutlined />
            </a>
            <a href="mailto:tu@email.com">
              <MailOutlined />
            </a>
          </div>
        </div>
      </div>
    </AntFooter>
  );
}
