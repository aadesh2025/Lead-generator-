import React, { useEffect, useState } from 'react';
import { db } from '../services/database';
import { BarChart3, Users, Search, ArrowUpRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState(db.getStats());

  useEffect(() => {
    setStats(db.getStats());
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        <Icon className="w-24 h-24 transform rotate-12 -translate-y-4 translate-x-4" />
      </div>
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} bg-opacity-20 text-current`}>
          <Icon className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{value}</h3>
        {trend && (
           <div className="flex items-center gap-1 mt-2 text-xs font-bold text-green-600 dark:text-green-400">
             <ArrowUpRight className="w-3 h-3" /> {trend}
           </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Command Center</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time intelligence overview.</p>
        </div>
        <Link to="/search" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all hover:translate-y-[-2px]">
          <Plus className="w-5 h-5" /> New Intelligence Sweep
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Leads Discovered" value={stats.totalLeads} icon={Users} color="text-blue-600 bg-blue-600" trend="+12% this week" />
        <StatCard title="Total Sweeps Run" value={stats.totalSearches} icon={Search} color="text-purple-600 bg-purple-600" />
        <StatCard title="Average Lead Score" value={stats.avgScore} icon={BarChart3} color="text-amber-500 bg-amber-500" trend="High Quality" />
        <StatCard title="Active Pipeline" value={stats.leadsByStatus.new + stats.leadsByStatus.contacted} icon={ArrowUpRight} color="text-green-600 bg-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6 rounded-2xl">
           <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Pipeline Velocity</h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/20 dark:border-white/5">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                   <span className="font-medium text-slate-700 dark:text-slate-300">New Leads</span>
                 </div>
                 <span className="font-bold text-slate-900 dark:text-white">{stats.leadsByStatus.new}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/20 dark:border-white/5">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                   <span className="font-medium text-slate-700 dark:text-slate-300">Contacted</span>
                 </div>
                 <span className="font-bold text-slate-900 dark:text-white">{stats.leadsByStatus.contacted}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/20 dark:border-white/5">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                   <span className="font-medium text-slate-700 dark:text-slate-300">Closed / Won</span>
                 </div>
                 <span className="font-bold text-slate-900 dark:text-white">{stats.leadsByStatus.closed}</span>
              </div>
           </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
             <BarChart3 className="w-8 h-8 text-white" />
           </div>
           <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Market Saturation Analysis</h3>
           <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
             Your latest sweeps indicate a high density of underserved businesses in the <strong>Dentist</strong> sector in <strong>New York</strong>.
           </p>
           <button className="px-6 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
             View Full Report
           </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;