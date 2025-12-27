import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import { generateLeads } from '../services/geminiService';
import { db } from '../services/database';
import { SearchState } from '../types';
import { Loader2 } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSearch = async (params: SearchState) => {
    setLoading(true);
    setProgress(prev => [...prev, `Initializing search for ${params.count} ${params.niche} in ${params.location}...`]);
    
    try {
      // Simulate progressive updates
      setTimeout(() => setProgress(prev => [...prev, "Accessing Google Maps Platform..."]), 1000);
      setTimeout(() => setProgress(prev => [...prev, "Analyzing digital footprints..."]), 2500);
      setTimeout(() => setProgress(prev => [...prev, "Scoring opportunities..."]), 4000);

      const result = await generateLeads(
        params.niche, 
        params.location, 
        params.count,
        params.userLat,
        params.userLng
      );
      
      const count = db.saveLeads(result.leads);
      db.addHistory(params, result.leads.length);
      
      setProgress(prev => [...prev, `Complete. Saved ${count} new leads.`]);
      
      setTimeout(() => {
        navigate('/leads');
      }, 1000);

    } catch (error) {
      console.error(error);
      setProgress(prev => [...prev, "Error: Failed to complete search."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Discovery Engine</h2>
        <p className="text-slate-500 dark:text-slate-400">Configure your target parameters for deep market extraction.</p>
      </div>
      
      {loading ? (
        <div className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
            <div className="w-24 h-24 rounded-full border-4 border-blue-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Running Intelligence Sweep</h3>
          <div className="w-full max-w-md bg-slate-100 dark:bg-slate-800 rounded-xl p-4 font-mono text-xs text-slate-500 h-32 overflow-y-auto space-y-1">
             {progress.map((log, i) => (
               <div key={i} className="flex items-center gap-2">
                 <span className="text-green-500">➜</span> {log}
               </div>
             ))}
          </div>
        </div>
      ) : (
        <SearchForm onSearch={handleSearch} isLoading={loading} />
      )}
    </div>
  );
};

export default SearchPage;