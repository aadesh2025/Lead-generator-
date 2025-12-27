export type LeadStatus = 'new' | 'contacted' | 'follow_up' | 'qualified' | 'closed' | 'disqualified';

export interface LeadScore {
  total: number; // 0-100
  label: 'Cold' | 'Warm' | 'Hot';
  breakdown: {
    digitalPresence: number;
    reputation: number;
    accessibility: number;
  };
  opportunitySignal: string;
}

export interface Lead {
  id: string;
  name: string;
  category: string;
  address?: string;
  city?: string;
  country?: string;
  rating?: string;
  reviews?: number;
  website?: string;
  email?: string;
  phone?: string;
  socialMedia?: string; 
  status: LeadStatus;
  score: LeadScore;
  analysis?: string;
  notes?: string;
  sourceUrl?: string;
  source: 'map' | 'web' | 'hybrid';
  createdAt: number;
  updatedAt: number;
}

export interface SearchState {
  niche: string;
  location: string;
  count: number;
  radius: number; // km
  userLat?: number;
  userLng?: number;
}

export interface GroundingChunk {
  web?: { uri: string; title: string; };
  maps?: { placeId: string; uri: string; title: string; };
}

export interface SearchResponse {
  summary: string;
  leads: Lead[];
  groundingChunks?: GroundingChunk[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  searchParams: SearchState;
  resultCount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  isFunctionCall?: boolean;
}