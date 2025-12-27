import React, { useState, useEffect } from 'react';
import { db } from '../services/database';
import { Lead } from '../types';
import LeadList from '../components/LeadList';
import { RefreshCw, Download, Trash2 } from 'lucide-react';

const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  
  const refresh = () => setLeads(db.getLeads());

  useEffect(() => {
    refresh();
  }, []);

  const clearAll = () => {
    if(confirm("Clear all data?")) {
      localStorage.clear(); // Simple nuke for demo
      refresh();
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
           <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Lead Database</h2>
           <p className="text-slate-500 dark:text-slate-400">Manage and analyze your discovered opportunities.</p>
         </div>
         <div className="flex gap-2">
           <button onClick={refresh} className="p-2 glass-card rounded-lg hover:bg-white/50 text-slate-600 dark:text-slate-300"><RefreshCw className="w-5 h-5" /></button>
           <button onClick={clearAll} className="p-2 glass-card rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-5 h-5" /></button>
         </div>
       </div>

       {leads.length > 0 ? (
          <LeadList data={{ summary: '', leads }} />
       ) : (
          <div className="glass-panel p-16 text-center rounded-2xl">
            <p className="text-slate-500 dark:text-slate-400">No leads found. Run a search to populate the database.</p>
          </div>
       )}
    </div>
  );
};

export default LeadsPage;