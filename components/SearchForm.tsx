import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Settings2, X, Sparkles, Mail, Phone, Share2, AlertCircle, Filter, CheckCircle2 } from 'lucide-react';
import { SearchState } from '../types';

interface SearchFormProps {
  onSearch: (params: SearchState) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [niche, setNiche] = useState('');
  const [location, setLocation] = useState('');
  const [count, setCount] = useState(10);
  
  // Advanced state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche || !location || isLoading) return;

    const lat = manualLat ? parseFloat(manualLat) : undefined;
    const lng = manualLng ? parseFloat(manualLng) : undefined;

    onSearch({ 
      niche, 
      location, 
      count,
      userLat: lat,
      userLng: lng
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
        
        {/* Header Section */}
        <div className="bg-slate-50/50 dark:bg-slate-900/50 px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between transition-colors">
           <div>
             <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Lead Search</h2>
             <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">AI-powered discovery engine</p>
           </div>
           <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-800">
             <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
             <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wide">Strict Mode Active</span>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            
            {/* Niche Input */}
            <div className="flex-1 space-y-2 group">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" />
                Business Type / Niche
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder={isLoading ? "Processing..." : "e.g. Dental Clinics"}
                  disabled={isLoading}
                  className={`w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all ${
                    isLoading 
                      ? 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed text-slate-400 dark:text-slate-500 animate-pulse' 
                      : 'bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Location Input */}
            <div className="flex-1 space-y-2 group">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                Target Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={isLoading ? "Processing..." : "e.g. San Francisco, CA"}
                  disabled={isLoading}
                  className={`w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 text-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all ${
                    isLoading 
                      ? 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed text-slate-400 dark:text-slate-500 animate-pulse' 
                      : 'bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                  required
                />
              </div>
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-3 rounded-xl flex items-center gap-3 transition-opacity ${isLoading ? 'opacity-50' : ''}`}>
               <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg"><Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" /></div>
               <div className="flex flex-col">
                 <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Emails</span>
                 <span className="text-[10px] text-slate-500 dark:text-slate-500">Gmail Priority</span>
               </div>
            </div>
            <div className={`bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-3 rounded-xl flex items-center gap-3 transition-opacity ${isLoading ? 'opacity-50' : ''}`}>
               <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg"><Phone className="w-4 h-4 text-green-600 dark:text-green-400" /></div>
               <div className="flex flex-col">
                 <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Phones</span>
                 <span className="text-[10px] text-slate-500 dark:text-slate-500">Verified</span>
               </div>
            </div>
            <div className={`bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-3 rounded-xl flex items-center gap-3 transition-opacity ${isLoading ? 'opacity-50' : ''}`}>
               <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-lg"><Share2 className="w-4 h-4 text-pink-600 dark:text-pink-400" /></div>
               <div className="flex flex-col">
                 <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Social</span>
                 <span className="text-[10px] text-slate-500 dark:text-slate-500">Profile Links</span>
               </div>
            </div>
            <div className={`bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-3 rounded-xl flex items-center gap-3 transition-opacity ${isLoading ? 'opacity-50' : ''}`}>
               <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg"><Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" /></div>
               <div className="flex flex-col">
                 <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Audit</span>
                 <span className="text-[10px] text-slate-500 dark:text-slate-500">Insight</span>
               </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col lg:flex-row items-end lg:items-center justify-between gap-6 pt-6 border-t border-slate-100 dark:border-slate-700">
            
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
               <div className={`w-full sm:w-64 space-y-2 transition-opacity ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                 <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                   <span>Max Results</span>
                   <span className="text-blue-600 dark:text-blue-400">{count}</span>
                 </div>
                 <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  disabled={isLoading}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                 />
                 <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                   <span>10</span>
                   <span>1000</span>
                 </div>
               </div>
               
               <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                disabled={isLoading}
                className={`flex items-center gap-2 text-xs font-bold transition-colors py-2 px-4 rounded-lg border ${showAdvanced ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600' : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Settings2 className="w-3.5 h-3.5" />
                Filters
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full lg:w-auto py-4 px-8 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all transform shadow-lg shadow-blue-500/20 ${
                isLoading
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Start Extraction
                </>
              )}
            </button>
          </div>

          {/* Advanced Panel */}
          {showAdvanced && (
            <div className="mt-6 p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Geolocation Override
                  </h3>
                  <button type="button" onClick={() => setShowAdvanced(false)} disabled={isLoading} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <X className="w-4 h-4" />
                  </button>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={manualLat}
                      onChange={(e) => setManualLat(e.target.value)}
                      placeholder="34.0522"
                      disabled={isLoading}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:text-slate-400"
                    />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Longitude</label>
                     <input
                      type="number"
                      step="any"
                      value={manualLng}
                      onChange={(e) => setManualLng(e.target.value)}
                      placeholder="-118.2437"
                      disabled={isLoading}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:text-slate-400"
                    />
                  </div>
               </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SearchForm;