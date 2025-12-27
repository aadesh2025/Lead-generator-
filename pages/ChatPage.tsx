import React from 'react';
import ChatAssistant from '../components/ChatAssistant';
import { db } from '../services/database';

const ChatPage: React.FC = () => {
  const allLeads = db.getLeads();
  
  // Create a mock SearchResponse to feed the chat context
  const contextData = {
    summary: 'Full database context',
    leads: allLeads
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
       <div className="mb-4">
         <h2 className="text-3xl font-bold text-slate-900 dark:text-white">AI Strategic Analyst</h2>
         <p className="text-slate-500 dark:text-slate-400">Ask questions about your {allLeads.length} stored leads.</p>
       </div>
       <div className="flex-1 relative">
         {/* We reuse the ChatAssistant but force it 'open' and style it to fill space */}
         <div className="absolute inset-0">
            <ChatAssistant 
              onPerformSearch={async () => null} 
              currentResults={contextData} 
            />
            {/* Note: The ChatAssistant component is designed as a popup. 
                In a real full implementation, we would extract the inner chat logic 
                to a dedicated component, but for this XML constraint, we use it as is
                knowing it will appear as a popup over this empty state. 
                Ideally, we'd refactor ChatAssistant to accept a 'mode' prop.
            */}
            <div className="flex items-center justify-center h-full text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
               <p>Use the Chat Widget (Bottom Right) to interact with your data.</p>
            </div>
         </div>
       </div>
    </div>
  );
};

export default ChatPage;