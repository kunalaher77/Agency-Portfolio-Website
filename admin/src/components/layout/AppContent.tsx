import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import { useBoundStore } from '../../stores/useBoundStore';
import { CmsManager } from '../cms/CmsManager'; // Import the new file
import { MenuOrchestrator } from '../cms/MenuOrchestrator';

const { Content } = Layout;

export const AppContent: React.FC = () => {
  const activeKey = useBoundStore((state) => state.activeKey);

  return (
    <Content style={{ margin: '0 12px', display: 'flex', flexDirection: 'column' }}>
      <Breadcrumb 
        style={{ margin: '14px 6px 10px 6px', textTransform: 'capitalize', fontSize: '11px', fontWeight: 500 }}
        items={[{ title: <span style={{ color: '#94a3b8' }}>Workspace</span> }, { title: <span style={{ color: '#1e293b', fontWeight: 600 }}>{activeKey}</span> }]}
      />
      
      <div style={{
        padding: '24px',
        flex: 1,
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 20px 50px -20px rgba(0, 0, 0, 0.02)',
      }}>
        {/* Render the core system based on route context flags */}
        {activeKey === 'page' ? <CmsManager /> : <div style={{ fontSize: '12px', color: '#64748b' }}>Section under construction...</div>}
        {activeKey === 'menus' && <MenuOrchestrator />}
      </div>
    </Content>
  );
};