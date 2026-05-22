import React from 'react';
import { Layout, Button, theme, Avatar, Space, Dropdown } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';
import { useBoundStore } from '../../stores/useBoundStore';

const { Header } = Layout;

export const AppHeader: React.FC = () => {
  const isCollapsed = useBoundStore((state) => state.isCollapsed);
  const toggleSidebar = useBoundStore((state) => state.toggleSidebar);

  const userMenu = {
    items: [
      { key: 'profile', label: <span style={{ fontSize: '11px' }}>My Profile</span> },
      { key: 'settings', label: <span style={{ fontSize: '11px' }}>Settings</span> },
      { type: 'divider' as const },
      { key: 'logout', label: <span style={{ fontSize: '11px' }}>Logout</span>, danger: true },
    ],
    style: {
      borderRadius: '12px',
      padding: '4px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
    }
  };

  return (
    <Header style={{ 
      padding: '0 16px', 
      background: 'rgba(255, 255, 255, 0.65)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: '2vh',
      zIndex: 100,
      height: '52px', // Thinner header height
      margin: '2vh 12px 0 12px',
      borderRadius: '14px',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.02)',
      transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <Button
        type="text"
        icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleSidebar}
        style={{ 
          fontSize: '13px', 
          width: 34, 
          height: 34,
          borderRadius: '9px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b'
        }}
        className="header-trigger-btn"
      />
      
      <Space size={12}>
        <Button 
          type="text" 
          icon={<BellOutlined style={{ fontSize: '15px', color: '#64748b' }} />} 
          style={{ width: 34, height: 34, borderRadius: '9px' }}
        />

        <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
          <Space style={{ 
            cursor: 'pointer', 
            padding: '3px 8px 3px 4px', 
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(0,0,0,0.02)',
          }} className="user-profile-badge">
            <Avatar 
              size={22} // Smaller profile avatar icon
              icon={<UserOutlined />} 
              style={{ 
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              }} 
            />
            <span style={{fontWeight: 600, color: '#1e293b', fontSize: '11px'}}>Operator</span>
          </Space>
        </Dropdown>
      </Space>

      <style>{`
        .header-trigger-btn:hover { background: rgba(0,0,0,0.03) !important; color: #1e293b !important; }
        .user-profile-badge:hover { background: #ffffff !important; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
      `}</style>
    </Header>
  );
};