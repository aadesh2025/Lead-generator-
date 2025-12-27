import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, Search, Database, BarChart3, MessageSquare, 
  Menu, X, Sun, Moon, Radar, Briefcase, ChevronRight
} from 'lucide-react';

// Pages
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/SearchPage';
import LeadsPage from './pages/LeadsPage';
import CRMPage from './pages/CRMPage';
import ChatPage from './pages/ChatPage';
import AnalysisPage from './pages/AnalysisPage';

// --- Layout Component ---
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    if (saved) setTheme(saved);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  }, []);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const navItems = [
    { path: '/', label: 'Overview', icon: LayoutGrid },
    { path: '/search', label: 'Discovery Engine', icon: Search },
    { path: '/leads', label: 'Lead Database', icon: Database },
    { path: '/crm', label: 'Pipeline CRM', icon: Briefcase },
    { path: '/analysis', label: 'Market Intelligence', icon: BarChart3 },
    { path: '/chat', label: 'AI Analyst', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen overflow-hidden transition-all bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out glass-panel md:bg-white/40 md:dark:bg-slate-900/40 border-r border-white/20 dark:border-white/10 flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <Radar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 dark:text-white tracking-tight">LeadGen<span className="text-blue-600 dark:text-blue-400">IQ</span></h1>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Intelligence System</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500"><X className="w-6 h-6" /></button>
        </div>

        <nav className="flex-1 px-4 space-y-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-700 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-900/50' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                {item.label}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/20 dark:border-white/5 space-y-2">
           <div className="glass-card p-4 rounded-xl mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">System Status</span>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                API: Google Maps Platform<br/>
                AI: Gemini 2.0 Flash
              </div>
           </div>
           
           <button onClick={toggleTheme} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors">
              {theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-6 md:px-8 border-b border-white/20 dark:border-white/5 glass-panel md:bg-transparent md:border-none z-10">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-slate-600 dark:text-slate-300">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4 ml-auto">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-800">
               <Briefcase className="w-3.5 h-3.5" /> Workspace: Personal
             </div>
             <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white/50 dark:ring-white/10">
               AD
             </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- App Root ---
const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/crm" element={<CRMPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;