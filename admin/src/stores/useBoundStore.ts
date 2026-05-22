


import { create } from 'zustand';
import { createLayoutSlice, type LayoutSlice } from './slices/layoutSlice';
import { createCMSSlice, type CMSSlice } from './slices/cmsSlice';
import { createMenuSlice, type MenuSlice } from './slices/menuSlice';

export const useBoundStore = create<LayoutSlice & CMSSlice & MenuSlice>()((set, get, store) => ({
  ...createLayoutSlice(set, get, store),
  ...createCMSSlice(set, get, store),
    ...createMenuSlice(set, get, store),
}));

