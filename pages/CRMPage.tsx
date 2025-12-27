import React, { useState, useEffect } from 'react';
import { db } from '../services/database';
import { Lead } from '../types';
import { MoreHorizontal, Phone, Mail, CheckCircle } from 'lucide-react';

const CRMPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    setLeads(db.getLeads());
  }, []);

  const updateStatus = (id: string, newStatus: any) => {
    db.updateLead(id, { status: newStatus });
    setLeads(db.getLeads());
  };

  const columns = [
    { id: 'new', label: 'New Leads', color: 'bg-blue-500' },
    { id: 'contacted', label: 'Contacted', color: 'bg-yellow-500' },
    { id: 'qualified', label: 'Qualified', color: 'bg-purple-500' },
    { id: 'closed', label: 'Closed / Won', color: 'bg-green-500' },
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
       <div className="mb-6">
         <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Pipeline</h2>
         <p className="text-slate-500 dark:text-slate-400">Drag and drop features coming soon. Click to move.</p>
       </div>
       
       <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
         {columns.map(col => {
            const colLeads = leads.filter(l => l.status === col.id);
            return (
              <div key={col.id} className="min-w-[300px] w-[350px] flex flex-col glass-panel rounded-xl border-t-4" style={{ borderColor: col.color.replace('bg-', '') }}>
                <div className="p-4 border-b border-white/20 dark:border-white/5 flex justify-between items-center">
                   <h3 className="font-bold text-slate-700 dark:text-slate-200">{col.label}</h3>
                   <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">{colLeads.length}</span>
                </div>
                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                   {colLeads.map(lead => (
                     <div key={lead.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[200px]">{lead.name}</h4>
                           <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${lead.score.total > 70 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                             {lead.score.total} Score
                           </div>
                        </div>
                        <p className="text-xs text-slate-500 mb-3 truncate">{lead.city || lead.address}</p>
                        <div className="flex items-center gap-2 mb-3">
                           {lead.phone && <Phone className="w-3 h-3 text-slate-400" />}
                           {lead.email && <Mail className="w-3 h-3 text-slate-400" />}
                        </div>
                        
                        <div className="flex gap-1 pt-2 border-t border-slate-100 dark:border-slate-700">
                           {/* Quick Actions (Simulated) */}
                           <button onClick={() => updateStatus(lead.id, 'contacted')} className="flex-1 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                             Move Next
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            );
         })}
       </div>
    </div>
  );
};

export default CRMPage;