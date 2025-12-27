import { Lead, HistoryItem, SearchState } from '../types';

// Simulates a database using LocalStorage
const DB_KEYS = {
  LEADS: 'glis_leads',
  HISTORY: 'glis_history',
  SETTINGS: 'glis_settings'
};

export const db = {
  // --- Leads ---
  getLeads: (): Lead[] => {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.LEADS) || '[]');
    } catch { return []; }
  },

  getLead: (id: string): Lead | undefined => {
    const leads = db.getLeads();
    return leads.find(l => l.id === id);
  },

  saveLeads: (newLeads: Lead[]) => {
    const existing = db.getLeads();
    // De-duplicate based on Name + Address (simple heuristic)
    const uniqueNew = newLeads.filter(nl => 
      !existing.some(el => el.name === nl.name && el.address === nl.address)
    );
    const updated = [...uniqueNew, ...existing];
    localStorage.setItem(DB_KEYS.LEADS, JSON.stringify(updated));
    return uniqueNew.length;
  },

  updateLead: (id: string, updates: Partial<Lead>) => {
    const leads = db.getLeads();
    const index = leads.findIndex(l => l.id === id);
    if (index !== -1) {
      leads[index] = { ...leads[index], ...updates, updatedAt: Date.now() };
      localStorage.setItem(DB_KEYS.LEADS, JSON.stringify(leads));
    }
  },

  deleteLead: (id: string) => {
    const leads = db.getLeads().filter(l => l.id !== id);
    localStorage.setItem(DB_KEYS.LEADS, JSON.stringify(leads));
  },

  // --- History ---
  getHistory: (): HistoryItem[] => {
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.HISTORY) || '[]');
    } catch { return []; }
  },

  addHistory: (params: SearchState, count: number) => {
    const history = db.getHistory();
    const item: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      searchParams: params,
      resultCount: count
    };
    // Keep last 50
    const updated = [item, ...history].slice(0, 50);
    localStorage.setItem(DB_KEYS.HISTORY, JSON.stringify(updated));
  },

  // --- Stats ---
  getStats: () => {
    const leads = db.getLeads();
    const history = db.getHistory();
    return {
      totalLeads: leads.length,
      totalSearches: history.length,
      leadsByStatus: {
        new: leads.filter(l => l.status === 'new').length,
        contacted: leads.filter(l => l.status === 'contacted').length,
        qualified: leads.filter(l => l.status === 'qualified').length,
        closed: leads.filter(l => l.status === 'closed').length,
      },
      avgScore: leads.length ? Math.round(leads.reduce((a, b) => a + b.score.total, 0) / leads.length) : 0
    };
  }
};