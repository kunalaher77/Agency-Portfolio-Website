import type { StateCreator } from 'zustand';

export interface LayoutSlice {
  isCollapsed: boolean;
  activeKey: string;
  toggleSidebar: () => void;
  setSidebarCollapse: (collapsed: boolean) => void;
  setActiveKey: (key: string) => void;
}

export const createLayoutSlice: StateCreator<LayoutSlice, [], [], LayoutSlice> = (set) => ({
  isCollapsed: false,
  activeKey: 'dashboard',
  toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setSidebarCollapse: (collapsed) => set({ isCollapsed: collapsed }),
  setActiveKey: (key) => set({ activeKey: key }),
});