import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Space, Tabs, Divider, Alert, Empty } from 'antd';
// Replace ShieldCheckOutlined with SafetyCertificateOutlined
import { ArrowLeftOutlined, SaveOutlined, AppstoreAddOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useBoundStore } from '../../stores/useBoundStore';

const { TextArea } = Input;

export const CmsFullEditor: React.FC = () => {
  const [form] = Form.useForm();
  
  const activePageId = useBoundStore((state) => state.activePageId);
  const pages = useBoundStore((state) => state.pages);
  const exitEditor = useBoundStore((state) => state.exitEditor);
  const savePageChanges = useBoundStore((state) => state.savePageChanges);

  const targetPage = pages.find((p) => p.id === activePageId);

  useEffect(() => {
    if (targetPage) {
      form.setFieldsValue(targetPage);
    } else {
      form.resetFields();
      form.setFieldsValue({ status: 'draft', locale: 'en', components: [] });
    }
  }, [targetPage, form]);

  const handleCommit = () => {
    form.validateFields().then((values) => {
      if (activePageId) {
        savePageChanges(activePageId, values);
      }
    });
  };

  const tabItems = [
    {
      key: 'content',
      label: 'Core Layout Document',
      children: (
        <Form.Item name="contentMarkdown" noStyle>
          <TextArea 
            placeholder="# Initialize Layout Structure Context..." 
            style={{ 
              height: 'calc(100vh - 320px)', 
              fontFamily: 'monospace', 
              fontSize: '12px',
              borderRadius: '12px',
              padding: '16px',
              background: '#fafafa',
              border: '1px solid rgba(0,0,0,0.05)',
              resize: 'none'
            }} 
          />
        </Form.Item>
      )
    },
    {
      key: 'components',
      label: 'Modular Block Schema Array',
      children: (
        <div style={{ 
          background: '#fafafa', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)',
          padding: '32px', textAlign: 'center', height: 'calc(100vh - 320px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span style={{ fontSize: '11px', color: '#94a3b8' }}>No layout component schemas injected</span>}
          >
            <Button size="small" type="dashed" icon={<AppstoreAddOutlined />} style={{ fontSize: '11px', borderRadius: '6px' }}>
              Append Element Node
            </Button>
          </Empty>
        </div>
      )
    }
  ];

  return (
    <Form form={form} layout="vertical" requiredMark={false} style={{ height: '100%' }}>
      {/* Structural Workflow Header Command Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <Space size={12}>
          <Button 
            type="text" 
            shape="circle" 
            icon={<ArrowLeftOutlined style={{ fontSize: '12px', color: '#64748b' }} />} 
            onClick={exitEditor}
          />
          <Space direction="vertical" size={0}>
            <h4 style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>
              {targetPage ? `Architecture Context / ${targetPage.title}` : 'Initialize New Routing Tree Structure'}
            </h4>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
              ID STATE: {activePageId}
            </span>
          </Space>
        </Space>

        <Space size={8}>
          <Button size="small" onClick={exitEditor} style={{ fontSize: '11px', height: '30px', borderRadius: '6px' }}>
            Discard Changes
          </Button>
          <Button 
            type="primary" 
            icon={<SaveOutlined style={{ fontSize: '11px' }} />}
            onClick={handleCommit}
            style={{ fontSize: '11px', height: '30px', borderRadius: '6px', background: '#1d4ed8' }}
          >
            Compile & Commit Node
          </Button>
        </Space>
      </div>

      {/* Modern Split-Pane Canvas Interface */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', marginTop: '20px' }}>
        
        {/* LEFT COMPOSITION VIEWPORT */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
            <Form.Item 
              name="title" 
              label={<span style={{ fontSize: '10px', fontWeight: 700, color: '#475569' }}>PAGE ROUTE TITLE</span>}
              rules={[{ required: true, message: 'Identity required' }]}
            >
              <Input placeholder="e.g., Enterprise Ledger Analytics" style={{ fontSize: '12px', height: '32px', borderRadius: '6px' }} />
            </Form.Item>

            <Form.Item 
              name="slug" 
              label={<span style={{ fontSize: '10px', fontWeight: 700, color: '#475569' }}>URI DESTINATION LOCATOR PATH</span>}
              rules={[{ required: true, message: 'Slug configuration required' }]}
            >
              <Input placeholder="/analytics/ledger" style={{ fontSize: '12px', height: '32px', borderRadius: '6px', fontFamily: 'monospace' }} />
            </Form.Item>
          </div>

          <Tabs defaultActiveKey="content" items={tabItems} className="editor-subtabs" />
        </div>

        {/* RIGHT CONTROL METADATA CONFIGURATION PANEL */}
        <div style={{ 
          borderLeft: '1px solid rgba(0,0,0,0.04)', 
          paddingLeft: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>WORKFLOW STATE</span>
            <Divider style={{ margin: '6px 0 12px 0' }} />
            
            <Form.Item name="status" label={<span style={{ fontSize: '10px', fontWeight: 600 }}>INDEX DEPLOYMENT MODE</span>}>
              <Select style={{ width: '100%' }} size="small" options={[
                { value: 'draft', label: 'Local Draft Copy' },
                { value: 'review', label: 'Pipeline Validation Check' },
                { value: 'published', label: 'Live Global Production' }
              ]} />
            </Form.Item>

            <Form.Item name="locale" label={<span style={{ fontSize: '10px', fontWeight: 600 }}>LOCALIZATION TRACK</span>}>
              <Select style={{ width: '100%' }} size="small" options={[
                { value: 'en', label: 'Global English (EN)' },
                { value: 'ko', label: 'South Korea (KO)' },
                { value: 'ja', label: 'Japan (JA)' }
              ]} />
            </Form.Item>
          </div>

          <div>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>SEO METADATA SCHEMAS</span>
            <Divider style={{ margin: '6px 0 12px 0' }} />

            <Form.Item name={['seo', 'metaTitle']} label={<span style={{ fontSize: '10px', fontWeight: 600 }}>META TITLE TARGET</span>}>
              <Input placeholder="Engine Header Index Tag" style={{ fontSize: '11px', borderRadius: '4px' }} />
            </Form.Item>

            <Form.Item name={['seo', 'metaDescription']} label={<span style={{ fontSize: '10px', fontWeight: 600 }}>META DESCRIPTION GRAPH</span>}>
              <TextArea rows={3} placeholder="Summarize layout properties for indexing algorithms..." style={{ fontSize: '11px', borderRadius: '4px', resize: 'none' }} />
            </Form.Item>

            <Form.Item name={['seo', 'keywords']} label={<span style={{ fontSize: '10px', fontWeight: 600 }}>KEYWORD REGISTER SIGNALS</span>}>
              <Input placeholder="node, cluster, asset" style={{ fontSize: '11px', borderRadius: '4px' }} />
            </Form.Item>
          </div>

          <Alert
            message={<span style={{ fontSize: '10px', fontWeight: 600, color: '#0f172a' }}>Pipeline Engine Secure</span>}
            description={<span style={{ fontSize: '9px', color: '#64748b' }}>Every commit increments schema build logs. Verify runtime components before saving.</span>}
            type="info"
            showIcon
            icon={<SafetyCertificateOutlined style={{ fontSize: '12px' }} />}
            style={{ borderRadius: '8px', padding: '8px 12px' }}
          />
        </div>

      </div>

      <style>{`
        .editor-subtabs .ant-tabs-nav { margin-bottom: 12px !important; }
        .editor-subtabs .ant-tabs-tab { padding: 6px 4px !important; font-size: 11px !important; font-weight: 500; }
        .editor-subtabs .ant-tabs-tab-active .ant-tabs-tab-btn { font-weight: 700 !important; color: #1d4ed8 !important; }
        .ant-form-item { margin-bottom: 12px !important; }
        .ant-form-item-label { padding: 0 0 4px 0 !important; }
        .ant-select-selector { border-radius: 6px !important; height: 30px !important; font-size: 11px !important; display: flex; alignItems: center; }
      `}</style>
    </Form>
  );
};