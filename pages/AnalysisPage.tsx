import React from 'react';
import { BarChart3 } from 'lucide-react';

const AnalysisPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Market Intelligence Module</h2>
        <p className="text-slate-500 dark:text-slate-400">
          This advanced module will provide heatmaps, saturation analysis, and competitive density charts based on your collected data.
        </p>
        <button className="mt-6 px-6 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 cursor-not-allowed opacity-70">
          Coming Soon
        </button>
      </div>
    </div>
  );
};

export default AnalysisPage;