import type { StateCreator } from 'zustand';

export interface MenuItem {
  id: string;
  label: string;
  type: 'custom' | 'page' | 'category';
  url: string;
  children?: MenuItem[];
}

export interface MenuSlice {
  menuItems: MenuItem[];
  isLoadingMenus: boolean;
  fetchMenus: () => Promise<void>;
  updateMenuStructure: (newTree: MenuItem[]) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  removeMenuItem: (id: string) => void;
}

export const createMenuSlice: StateCreator<MenuSlice, [], [], MenuSlice> = (set) => ({
  menuItems: [],
  isLoadingMenus: false,

  fetchMenus: async () => {
    set({ isLoadingMenus: true });
    try {
      // Mimicking real network streaming architecture delays
      await new Promise((resolve) => setTimeout(resolve, 600));
      const mockTree: MenuItem[] = [
        
      ];
      set({ menuItems: mockTree, isLoadingMenus: false });
    } catch (error) {
      console.error("Failed structural menu stream fetch:", error);
      set({ isLoadingMenus: false });
    }
  },

  updateMenuStructure: (newTree) => set({ menuItems: newTree }),

  addMenuItem: (newItem) => set((state) => ({
    menuItems: [...state.menuItems, { ...newItem, id: `menu-${crypto.randomUUID().slice(0,6)}` }]
  })),

  removeMenuItem: (id) => set((state) => {
    // Elegant deep search filter function to purge nested items
    const purgeNode = (list: MenuItem[]): MenuItem[] => {
      return list
        .filter((item) => item.id !== id)
        .map((item) => (item.children ? { ...item, children: purgeNode(item.children) } : item));
    };
    return { menuItems: purgeNode(state.menuItems) };
  })
});