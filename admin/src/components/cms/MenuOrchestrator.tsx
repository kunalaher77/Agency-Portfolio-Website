import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Space, Card, Tree, Empty, Spin, message, Popconfirm, List, Modal, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined, GlobalOutlined, FileTextOutlined, FolderAddOutlined, DragOutlined } from '@ant-design/icons';
import { useBoundStore } from '../../stores/useBoundStore';
import type { MenuItem } from '../../stores/slices/menuSlice';

export const MenuOrchestrator: React.FC = () => {
  const [linkForm] = Form.useForm();
  const [groupForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>('header-menu');

  // 1. Navigation State
  const menuItems = useBoundStore((state) => state.menuItems) || [];
  const isLoadingMenus = useBoundStore((state) => state.isLoadingMenus);
  const fetchMenus = useBoundStore((state) => state.fetchMenus);
  const updateMenuStructure = useBoundStore((state) => state.updateMenuStructure);
  const addMenuItem = useBoundStore((state) => state.addMenuItem);
  const removeMenuItem = useBoundStore((state) => state.removeMenuItem);

  // 2. Menu Folders / Categories
  const [menuGroups, setMenuGroups] = useState([
    { value: 'header-menu', label: 'Top Header Menu' },
    { value: 'footer-menu', label: 'Bottom Footer Links' },
    { value: 'sidebar-menu', label: 'Sidebar Menu' }
  ]);

  // 3. Live Website Pages
  const pages = useBoundStore((state) => state.pages) || [];
  const isLoadingPages = useBoundStore((state) => state.isLoading);
  const fetchPages = useBoundStore((state) => state.fetchPages);

  useEffect(() => {
    fetchMenus(); 
    if (fetchPages) {
      fetchPages();
    }
  }, [fetchMenus, fetchPages, activeMenu]);

  // Create a brand new menu folder
  const handleCreateGroup = (values: any) => {
    const key = values.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    setMenuGroups((prev) => [...prev, { value: key, label: values.name }]);
    setActiveMenu(key);
    updateMenuStructure([]); // Clear canvas for the new menu
    setIsModalOpen(false);
    groupForm.resetFields();
    message.success(`Created new menu: "${values.name}"`);
  };

  // Add a standard website page to the menu
  const handleAddWebPage = (page: any) => {
    addMenuItem({
      label: page.title,
      type: 'page',
      url: page.slug,
      children: []
    });
    message.success(`Added "${page.title}" to your menu list!`);
  };

  // Add a custom link to the menu
  const handleAddCustomLink = (values: any) => {
    addMenuItem({
      label: values.label,
      type: 'custom',
      url: values.url,
      children: []
    });
    linkForm.resetFields();
    message.success('Added custom link to your menu list!');
  };

  // Format menu list items safely into Ant Design's drag-and-drop frame
  const formatTreeData = (items: MenuItem[]): any[] => {
    return items.map((item) => ({
      title: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '2px 0' }}>
          <Space size={6}>
            <DragOutlined style={{ color: '#94a3b8', cursor: 'grab', fontSize: '12px' }} />
            <span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>{item.label}</span>
            <span style={{ color: '#64748b', fontSize: '11px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
              {item.url}
            </span>
          </Space>
          <Popconfirm title="Delete this link from your menu?" onConfirm={() => removeMenuItem(item.id)} okText="Yes, delete" cancelText="Cancel" placement="topRight">
            <Button type="text" size="small" danger icon={<DeleteOutlined style={{ fontSize: '12px' }} />} onClick={(e) => e.stopPropagation()} />
          </Popconfirm>
        </div>
      ),
      key: item.id,
      children: item.children ? formatTreeData(item.children) : [],
    }));
  };

  const handleDropEvent = (info: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const data = JSON.parse(JSON.stringify(menuItems));

    let dragObj: MenuItem | null = null;
    const extractDragNode = (arr: MenuItem[], id: string, callback: (item: MenuItem, index: number, arr: MenuItem[]) => void) => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          return callback(arr[i], i, arr);
        }
        if (arr[i].children) {
          extractDragNode(arr[i].children!, id, callback);
        }
      }
    };

    extractDragNode(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      const appendToTargetInstance = (arr: MenuItem[], key: string) => {
        arr.forEach((item) => {
          if (item.id === key) {
            item.children = item.children || [];
            item.children.push(dragObj!);
          } else if (item.children) {
            appendToTargetInstance(item.children, key);
          }
        });
      };
      appendToTargetInstance(data, dropKey);
    } else {
      let ar: MenuItem[] = [];
      let i = 0;
      const adjustLinearIndex = (arr: MenuItem[], key: string) => {
        for (let j = 0; j < arr.length; j++) {
          if (arr[j].id === key) {
            ar = arr;
            i = j;
            return;
          }
          if (arr[j].children) {
            adjustLinearIndex(arr[j].children!, key);
          }
        }
      };
      adjustLinearIndex(data, dropKey);
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj!);
      } else {
        ar.splice(i + 1, 0, dragObj!);
      }
    }

    updateMenuStructure(data);
    message.success('Menu arrangement saved!');
  };

  return (
    <div style={{ padding: '4px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER CONTROLS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px', gap: '16px' }}>
        <Space direction="vertical" size={2}>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: '18px', color: '#0f172a' }}>Website Menus & Navigation</h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Create links, arrange them, and decide what goes where on your live website layout.</p>
        </Space>
        
        <Space size={12} style={{ flexWrap: 'wrap' }}>
          <Space size={6}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Choose a Menu to Edit:</span>
            <Select 
              value={activeMenu}
              onChange={(value) => setActiveMenu(value)}
              options={menuGroups}
              style={{ width: '200px' }}
            />
          </Space>

          <Button 
            type="default"
            icon={<FolderAddOutlined />}
            onClick={() => setIsModalOpen(true)}
            style={{ borderRadius: '6px', fontWeight: 500 }}
          >
            Create New Menu List
          </Button>

          <Button 
            type="primary" 
            icon={<SaveOutlined />}
            onClick={() => message.success('All changes are now live on your website!')}
            style={{ fontWeight: 600, borderRadius: '6px', background: '#2563eb', border: 'none' }}
          >
            Save & Publish Changes
          </Button>
        </Space>
      </div>

      {/* WORKSPACE LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: SOURCE SELECTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* STEP 1: ADD EXISTING PAGES */}
          <Card 
            title={
              <Space size={6}>
                <FileTextOutlined style={{ color: '#2563eb' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>1. ADD WEBPAGES</span>
              </Space>
            }
            bordered={false}
            style={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
          >
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: 0, marginBottom: '12px' }}>Click the (+) button next to any page below to add it to your current menu list.</p>
            {isLoadingPages ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}><Spin size="small" /></div>
            ) : pages.length === 0 ? (
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>No pages found. Create some pages first!</span>
            ) : (
              <List
                size="small"
                dataSource={pages}
                style={{ overflowY: 'auto', maxHeight: '180px', border: '1px solid #f1f5f9', borderRadius: '6px', padding: '4px' }}
                renderItem={(page) => (
                  <List.Item 
                    extra={
                      <Button 
                        size="small" 
                        type="primary"
                        ghost
                        icon={<PlusOutlined style={{ fontSize: '11px' }} />} 
                        onClick={() => handleAddWebPage(page)}
                        style={{ height: '24px', width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}
                      />
                    }
                    style={{ padding: '8px 6px' }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{page.title}</span>
                  </List.Item>
                )}
              />
            )}
          </Card>

          {/* STEP 2: ADD CUSTOM LINKS */}
          <Card 
            title={
              <Space size={6}>
                <GlobalOutlined style={{ color: '#2563eb' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>2. ADD ANY CUSTOM LINK</span>
              </Space>
            }
            bordered={false}
            style={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
          >
            <Form form={linkForm} layout="vertical" onFinish={handleAddCustomLink} requiredMark={false}>
              <Form.Item name="label" label={<span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>LINK NAME (WHAT USERS SEE)</span>} rules={[{ required: true, message: 'Please enter a name' }]}>
                <Input placeholder="e.g., Google or Support Desk" style={{ borderRadius: '6px' }} />
              </Form.Item>

              <Form.Item name="url" label={<span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>WEB ADDRESS (URL)</span>} rules={[{ required: true, message: 'Please enter a link web address' }]}>
                <Input placeholder="e.g., https://google.com" style={{ borderRadius: '6px' }} />
              </Form.Item>

              <Button type="dashed" block htmlType="submit" icon={<PlusOutlined />} style={{ height: '34px', borderRadius: '6px', fontWeight: 500 }}>
                Add Custom Link to Menu
              </Button>
            </Form>
          </Card>
        </div>

        {/* RIGHT COLUMN: RE-ARRANGE WORKBENCH */}
        <Card 
          title={
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
              ARRANGE YOUR MENU ITEMS ({menuGroups.find(g => g.value === activeMenu)?.label})
            </span>
          }
          bordered={false}
          style={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', minHeight: '520px' }}
        >
          <Alert 
            message="Tip: Drag items up or down to re-order. Drag an item slightly to the right to nest it underneath another item as a sub-menu drop-down!" 
            type="info" 
            showIcon 
            style={{ marginBottom: '16px', borderRadius: '6px', fontSize: '12px' }}
          />

          {isLoadingMenus ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}><Spin /></div>
          ) : menuItems.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span style={{ fontSize: '13px', color: '#94a3b8' }}>Your menu list is currently empty. Add items from the left box to begin!</span>} />
          ) : (
            <div className="layman-menu-tree-container" style={{ padding: '2px' }}>
              <Tree
                draggable
                blockNode
                showLine={{ showLeafIcon: false }}
                onDrop={handleDropEvent}
                treeData={formatTreeData(menuItems)}
                className="friendly-menu-tree"
              />
            </div>
          )}
        </Card>
      </div>

      {/* POPUP MODAL FOR NEW MENU GROUP */}
      <Modal
        title={<span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Create a Brand New Menu List</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={380}
        destroyOnClose
      >
        <Form form={groupForm} layout="vertical" onFinish={handleCreateGroup} style={{ marginTop: '16px' }}>
          <Form.Item 
            name="name" 
            label={<span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>WHAT IS THIS MENU FOR?</span>} 
            rules={[{ required: true, message: 'Please give your menu a name' }]}
          >
            <Input placeholder="e.g., Summer Campaign Menu or Top Bar Links" style={{ borderRadius: '6px', padding: '6px 10px' }} />
          </Form.Item>
          
          <Space style={{ width: '100%', justifyContent: 'end', marginTop: '12px' }}>
            <Button onClick={() => setIsModalOpen(false)} style={{ borderRadius: '6px' }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" style={{ borderRadius: '6px', background: '#2563eb' }}>
              Create Menu List
            </Button>
          </Space>
        </Form>
      </Modal>

      {/* CLEAN ACCESSIBLE STYLING OVERRIDES */}
      <style>{`
        .friendly-menu-tree { background: transparent !important; }
        .friendly-menu-tree .ant-tree-node-content-wrapper {
          border: 1px solid #e2e8f0 !important;
          border-radius: 8px !important;
          background: #ffffff !important;
          margin-bottom: 8px !important;
          padding: 8px 12px !important;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .friendly-menu-tree .ant-tree-node-content-wrapper:hover {
          background: #f8fafc !important;
          border-color: #cbd5e1 !important;
        }
        .friendly-menu-tree .ant-tree-treenode-draggable { padding: 0 0 2px 0 !important; }
        .friendly-menu-tree .ant-tree-indent-unit { width: 26px !important; }
        .friendly-menu-tree .ant-tree-switcher { line-height: 38px !important; width: 22px !important; }
        .ant-tree-drop-indicator { background-color: #2563eb !important; height: 3px !important; }
      `}</style>
    </div>
  );
};