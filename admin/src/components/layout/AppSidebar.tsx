import React from 'react';
import { Layout, Menu } from 'antd';
import type { GetProp, MenuProps } from 'antd';
import { DashboardOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useBoundStore } from '../../stores/useBoundStore';

const { Sider } = Layout;
type MenuItem = GetProp<MenuProps, 'items'>[number];

const menuItems: MenuItem[] = [
  { key: 'dashboard', icon: <DashboardOutlined style={{ fontSize: '14px' }} />, label: 'Dashboard' },
 { key: 'page', icon: <DashboardOutlined style={{ fontSize: '14px' }} />, label: 'Page' },
 { key: 'menus', icon: <DashboardOutlined style={{ fontSize: '14px' }} />, label: 'Menus' },
  { key: 'users', icon: <UserOutlined style={{ fontSize: '14px' }} />, label: 'User Management' },
  { key: 'settings', icon: <SettingOutlined style={{ fontSize: '14px' }} />, label: 'Settings' },
];

export const AppSidebar: React.FC = () => {
  const isCollapsed = useBoundStore((state) => state.isCollapsed);
  const activeKey = useBoundStore((state) => state.activeKey);
  const setActiveKey = useBoundStore((state) => state.setActiveKey);
  const setSidebarCollapse = useBoundStore((state) => state.setSidebarCollapse);

  return (
    <Sider
      collapsible
      collapsed={isCollapsed}
      onCollapse={(value) => setSidebarCollapse(value)}
      breakpoint="lg"
      width={220} // Slightly narrower for a more compact structural look
      collapsedWidth={68}
      trigger={null}
      style={{
        overflow: 'hidden',
        height: '96vh',
        position: 'sticky',
        top: '2vh',
        left: '12px',
        margin: '2vh 0 2vh 12px',
        borderRadius: '16px', 
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}
    >
      {/* Brand Identity Header */}
      <div style={{
        height: 52,
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: '8px',
      }}>
        <div style={{
          width: 24,
          height: 24,
          borderRadius: '7px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 800,
          fontSize: '11px',
          boxShadow: '0 4px 10px rgba(29, 78, 216, 0.2)'
        }}>
          Ω
        </div>
        {!isCollapsed && (
          <span style={{
            fontWeight: 700,
            fontSize: '12px', // Compact title text
            color: '#1e293b',
            letterSpacing: '-0.3px',
            animation: 'fadeIn 0.2s ease-in-out'
          }}>
            Core System
          </span>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[activeKey]}
        onClick={(e) => setActiveKey(e.key)}
        items={menuItems}
        style={{
          background: 'transparent',
          borderRight: 'none',
          padding: '0 8px',
        }}
        styles={{
          item: {
            borderRadius: '10px',
            height: '38px', // Shorter, tighter clickable elements
            lineHeight: '38px',
            margin: '2px 0',
            color: '#64748b',
            fontSize: '12px', // Compact menu links
            transition: 'all 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
          }
        }}
      />
      
      <style>{`
        .ant-menu-item-selected {
          background: #ffffff !important;
          color: #1d4ed8 !important;
          font-weight: 600 !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02) !important;
          transform: scale(1.01);
        }
        .ant-menu-item:not(.ant-menu-item-selected):hover {
          background: rgba(0, 0, 0, 0.02) !important;
          color: #1e293b !important;
        }
        .ant-menu-inline-collapsed > .ant-menu-item {
          padding: 0 calc((68px - 20px) / 2) !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-4px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </Sider>
  );
};