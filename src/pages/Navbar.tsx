import React from 'react';
import { Layout, Button, Space } from 'antd';
import { HomeOutlined, InfoCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Header } = Layout;

const Navbar = () => {
  return (
    <Header style={{ 
      padding: '0 16px',
      background: 'linear-gradient(90deg, #D50000 0%, #FF1744 100%)',
      position: 'sticky', 
      top: 0, 
      zIndex: 100, 
      width: '100%',
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Logo y título */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ThunderboltOutlined style={{ fontSize: '24px', color: 'white', marginRight: '8px' }} />
        <h1 style={{ color: 'white', margin: 0, fontSize: '18px' }}>MotoGP Manager</h1>
      </div>

      {/* Menú simplificado con botones */}
      <Space>
        <Button 
          type="text" 
          icon={<HomeOutlined />} 
          style={{ color: 'white' }}
          className="nav-button"
        >
          Home
        </Button>
        <Button 
          type="text" 
          icon={<InfoCircleOutlined />} 
          style={{ color: 'white' }}
          className="nav-button"
        >
          About
        </Button>
      </Space>

      {/* Estilos para el hover */}
      <style>{`
        .nav-button:hover {
          background-color: #0077CC !important;
          color: white !important;
        }
        
        @media (max-width: 576px) {
          .nav-button {
            padding: 4px 8px;
          }
          .nav-button .anticon + span {
            display: none;
          }
        }
      `}</style>
    </Header>
  );
};

export default Navbar;