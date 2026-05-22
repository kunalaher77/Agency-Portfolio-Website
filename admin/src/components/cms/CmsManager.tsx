import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Popconfirm, Tooltip, Input, Select, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useBoundStore } from '../../stores/useBoundStore';
import { CmsFullEditor } from './CmsFullEditor';
import type { CMSPage } from '../../stores/slices/cmsSlice';

export const CmsManager: React.FC = () => {
  const currentView = useBoundStore((state) => state.currentView);
  const pages = useBoundStore((state) => state.pages) || [];
  const isLoading = useBoundStore((state) => state.isLoading);
  const fetchPages = useBoundStore((state) => state.fetchPages);
  
  const setPageActive = useBoundStore((state) => state.setPageActive);
  const initNewPage = useBoundStore((state) => state.initNewPage);
  const purgePageRecord = useBoundStore((state) => state.purgePageRecord);

  // Advanced Search & Filter States
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  if (currentView === 'editor') {
    return <CmsFullEditor />;
  }

  // Filter the list of pages based on user search text and selected status dropdown
  const filteredPages = pages.filter((page) => {
    const matchesSearch = 
      page.title?.toLowerCase().includes(searchText.toLowerCase()) || 
      page.slug?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Table Structure
  const columns = [
    {
      title: 'PAGE TITLE & LINK',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: CMSPage) => (
        <Space direction="vertical" size={2}>
          <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>{text || 'Untitled Page'}</span>
          <span style={{ color: '#64748b', fontSize: '11px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
            {record.slug}
          </span>
        </Space>
      ),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status: CMSPage['status'] = 'draft') => {
        const colors = { 
          published: { bg: '#bbf7d0', text: '#166534', label: 'LIVE / PUBLISHED' }, 
          review: { bg: '#fef08a', text: '#854d0e', label: 'IN REVIEW' }, 
          draft: { bg: '#e2e8f0', text: '#475569', label: 'DRAFT' } 
        };
        const currentStatus = colors[status] || colors.draft;
        return (
          <Tag color={currentStatus.bg} style={{ color: currentStatus.text, fontSize: '10px', fontWeight: 700, borderRadius: '4px', border: 'none', padding: '2px 6px' }}>
            {currentStatus.label}
          </Tag>
        );
      },
    },
    {
      title: 'LANGUAGE',
      dataIndex: 'locale',
      key: 'locale',
      render: (loc: string) => (
        <Tag style={{ fontSize: '11px', fontWeight: 600, borderRadius: '4px', color: '#334155', background: '#f8fafc' }}>
          {(loc || 'en').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'HISTORY',
      dataIndex: 'version',
      key: 'version',
      render: (ver: number) => (
        <Space size={4} style={{ color: '#64748b', fontSize: '12px' }}>
          <HistoryOutlined style={{ fontSize: '11px' }} />
          <span>Saved v{ver || 1}</span>
        </Space>
      ),
    },
    {
      title: 'LAST UPDATED',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => <span style={{ color: '#64748b', fontSize: '12px' }}>{date}</span>,
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: CMSPage) => (
        <Space size={8}>
          <Tooltip title="Edit Content" mouseEnterDelay={0.2}>
            <Button 
              type="default" 
              size="middle"
              icon={<EditOutlined style={{ fontSize: '13px', color: '#2563eb' }} />} 
              onClick={() => setPageActive(record.id)}
              style={{ borderRadius: '6px' }}
            >
              Edit
            </Button>
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to completely delete this webpage?"
            onConfirm={() => purgePageRecord(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            placement="topRight"
          >
            <Button type="text" size="middle" danger icon={<DeleteOutlined style={{ fontSize: '13px' }} />} style={{ borderRadius: '6px' }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '4px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '16px' }}>
        <Space direction="vertical" size={2}>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: '18px', color: '#0f172a' }}>Website Pages</h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>View, search, edit, or create new webpages for your live public website.</p>
        </Space>
        
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={initNewPage}
          style={{
            fontWeight: 600, height: '36px', borderRadius: '6px',
            background: '#2563eb', border: 'none', padding: '0 16px'
          }}
        >
          Create New Webpage
        </Button>
      </div>

      {/* ADVANCED SEARCH & FILTER PANEL */}
      <Card 
        style={{ marginBottom: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.01)' }}
        bodyStyle={{ padding: '12px' }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          
          {/* Search Box Inputs */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            <Input
              placeholder="Search by page title or link web address..."
              prefix={<SearchOutlined style={{ color: '#94a3b8', marginRight: '4px' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ borderRadius: '6px', width: '100%' }}
            />
          </div>

          {/* Status Dropdown Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center' }}>
              <FilterOutlined style={{ marginRight: '4px', color: '#64748b' }} /> Filter Status:
            </span>
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              style={{ width: '160px' }}
              options={[
                { value: 'all', label: 'Show All Pages' },
                { value: 'published', label: 'Live / Published Only' },
                { value: 'review', label: 'In Review Only' },
                { value: 'draft', label: 'Drafts Only' },
              ]}
            />
          </div>

        </div>
      </Card>

      {/* CORE DATA TABLE */}
      <Table 
        dataSource={filteredPages} 
        columns={columns} 
        rowKey="id"
        loading={isLoading} 
        className="friendly-cms-table"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} total pages`,
          position: ['bottomRight'],
          style: { marginTop: '16px' }
        }}
      />

      {/* CLEAN ACCESSIBLE STYLING OVERRIDES */}
      <style>{`
        .friendly-cms-table .ant-table { background: #ffffff !important; border: 1px solid #e2e8f0 !important; border-radius: 8px !important; overflow: hidden; }
        .friendly-cms-table .ant-table-thead > tr > th {
          background: #f8fafc !important; color: #475569 !important;
          font-size: 11px !important; font-weight: 700 !important;
          letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0 !important;
        }
        .friendly-cms-table .ant-table-tbody > tr > td {
          padding: 14px 12px !important; border-bottom: 1px solid #f1f5f9 !important;
        }
        .friendly-cms-table .ant-table-tbody > tr:hover > td { background: #f8fafc !important; }
        .friendly-cms-table .ant-pagination { font-size: 12px !important; }
        .friendly-cms-table .ant-pagination-total-text { color: #64748b !important; font-weight: 500; }
      `}</style>
    </div>
  );
};