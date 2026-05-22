import React from 'react';
import { Layout } from 'antd';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { AppContent } from './AppContent';

const { Footer } = Layout;

export const AdminLayout: React.FC = () => {
  return (
    <Layout style={{ 
      minHeight: '100vh',
      background: 'radial-gradient(at 0% 0%, rgba(219, 234, 254, 0.25) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(243, 232, 255, 0.25) 0, transparent 50%), #f8fafc',
    }}>
      <AppSidebar />
      
      <Layout style={{ background: 'transparent' }}>
        <AppHeader />
        <AppContent />
        <Footer style={{ 
          textAlign: 'center', 
          background: 'transparent', 
          color: '#94a3b8',
          fontSize: '11px', // Clean micro signature text
          fontWeight: 500,
          padding: '16px 0' 
        }}>
          System Architecture Core • Designed with micro-spring dynamics
        </Footer>
      </Layout>
    </Layout>
  );
};