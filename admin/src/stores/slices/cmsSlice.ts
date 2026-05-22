import type { StateCreator } from 'zustand';
import { getAll } from '../../api/api.service';

export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
}

export interface PageComponent {
  id: string;
  type: 'hero' | 'features' | 'cta' | 'pricing';
  configJson: string;
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'review' | 'published';
  locale: 'en' | 'ko' | 'ja';
  version: number;
  updatedAt: string;
  author: string;
  contentMarkdown: string;
  seo: SEOData;
  components: PageComponent[];
}

export interface CMSSlice {
  pages: CMSPage[];
  currentView: 'list' | 'editor';
  activePageId: string | null;
  isLoading: boolean; // Tracking status flags keeps UI snappy
  fetchPages: () => Promise<void>; // The dedicated async action handler
  setPageActive: (id: string) => void;
  initNewPage: () => void;
  exitEditor: () => void;
  savePageChanges: (id: string, records: Partial<CMSPage>) => void;
  purgePageRecord: (id: string) => void;
}

export const createCMSSlice: StateCreator<CMSSlice, [], [], CMSSlice> = (set) => ({
  pages: [], // Initialize empty; wait for data to stream in
  currentView: 'list',
  activePageId: null,
  isLoading: false,

  // Dedicated Async Request Processor
  fetchPages: async () => {
    set({ isLoading: true });
    try {
      const data = await getAll("pages");
      set({ pages: data || [], isLoading: false });
    } catch (error) {
      console.error("Failed executing engine data lookup:", error);
      set({ isLoading: false });
    }
  },

  setPageActive: (id) => set({ currentView: 'editor', activePageId: id }),
  initNewPage: () => set({ currentView: 'editor', activePageId: 'NEW_SCHEMA' }),
  exitEditor: () => set({ currentView: 'list', activePageId: null }),
  
  savePageChanges: (id, records) => set((state) => {
    if (id === 'NEW_SCHEMA') {
      const generatedId = `page-${crypto.randomUUID().slice(0, 8)}`;
      const newEntity: CMSPage = {
        id: generatedId,
        title: records.title || 'Untitled Workspace',
        slug: records.slug || '/untitled',
        status: records.status || 'draft',
        locale: records.locale || 'en',
        version: 1,
        updatedAt: new Date().toISOString().split('T')[0],
        author: 'System Root',
        contentMarkdown: records.contentMarkdown || '',
        seo: records.seo || { metaTitle: '', metaDescription: '', keywords: '', ogImage: '' },
        components: records.components || []
      };
      return { pages: [...state.pages, newEntity], currentView: 'list', activePageId: null };
    }
    return {
      pages: state.pages.map((p) => p.id === id ? { 
        ...p, 
        ...records, 
        version: p.version + 1,
        updatedAt: new Date().toISOString().split('T')[0] 
      } : p),
      currentView: 'list',
      activePageId: null
    };
  }),
  
  purgePageRecord: (id) => set((state) => ({ pages: state.pages.filter((p) => p.id !== id) }))
});