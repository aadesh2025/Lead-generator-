import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { MessageSquare, X, Send, Sparkles, Paperclip, Loader2, Bot } from 'lucide-react';
import { SearchState, ChatMessage, SearchResponse } from '../types';

interface ChatAssistantProps {
  onPerformSearch: (params: SearchState) => Promise<SearchResponse | null>;
  currentResults: SearchResponse | null;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ onPerformSearch, currentResults }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: "Hello! I'm your LeadGen Assistant. I can find business leads for you, analyze them, and help you email the reports. What are we looking for today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize AI
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Define Tools
  const searchTool: FunctionDeclaration = {
    name: 'search_business_leads',
    description: 'Search for business leads in a specific location and niche. Use this when the user asks to find, get, or search for leads.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        niche: { type: Type.STRING, description: 'The type of business (e.g., Dentist, Plumber)' },
        location: { type: Type.STRING, description: 'The city and state/country (e.g., New York, NY)' },
        count: { type: Type.NUMBER, description: 'Number of leads to fetch (default to 10 if not specified)' }
      },
      required: ['niche', 'location']
    }
  };

  const emailTool: FunctionDeclaration = {
    name: 'email_report',
    description: 'Generate a report and prepare an email draft with the lead details. Use this when the user asks to send, email, or share the results.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        recipient: { type: Type.STRING, description: 'The email address to send to.' },
      },
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // System Instruction
      const systemInstruction = `
        You are an advanced Lead Generation Assistant embedded in a web app.
        
        Your Capabilities:
        1. You can control the app to search for leads using 'search_business_leads'.
        2. You can help email reports using 'email_report'.
        3. You have full access to analyze the lead data found.
        
        Specific Rules:
        - If the user asks to email the report, ALWAYS use the 'email_report' tool.
        - The default "From" email is 'aadesh202316@gamil.com' and "To" is 'aadeshworkplace@gmail.com' unless specified otherwise.
        - When a search is done, summarize the results briefly.
        - Be professional, concise, and helpful.
      `;

      // Build History
      const history = messages.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      // Call Gemini
      // Using gemini-3-flash-preview for better reasoning
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: [
            ...history, 
            { role: 'user', parts: [{ text: userMsg.text }]} 
        ],
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: [searchTool, emailTool] }]
        }
      });

      const call = response.functionCalls?.[0];

      if (call) {
        setIsTyping(false); // Temporary pause for action
        
        if (call.name === 'search_business_leads') {
          const args = call.args as any;
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: `Searching for ${args.count || 10} ${args.niche} in ${args.location}...`, isFunctionCall: true }]);
          
          // Execute App Logic
          const results = await onPerformSearch({
            niche: args.niche,
            location: args.location,
            count: args.count || 10
          });

          // Feed result back to AI
          const resultText = results ? `Found ${results.leads.length} leads. Top result: ${results.leads[0]?.name}.` : "No leads found.";
          
          // Second turn to summarize
          const followUp = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [
                ...history, 
                { role: 'user', parts: [{ text: userMsg.text }]},
                { role: 'model', parts: [{ functionCall: call }]},
                { role: 'function', parts: [{ functionResponse: { name: call.name, response: { result: resultText } } }]}
            ],
            config: { systemInstruction }
          });
          
          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: followUp.text || "Search complete." }]);

        } else if (call.name === 'email_report') {
            const recipient = (call.args as any).recipient || 'aadeshworkplace@gmail.com';
            
            // Generate CSV Data
            let csvContent = "Name,Phone,Email,Address,Rating\n";
            if (currentResults && currentResults.leads.length > 0) {
                currentResults.leads.forEach(l => {
                    csvContent += `"${l.name}","${l.phone}","${l.email}","${l.address}","${l.rating}"\n`;
                });
            } else {
                csvContent += "No active search results to export.\n";
            }
            
            const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
            const body = `Here is the lead generation report for ${currentResults?.leads.length || 0} businesses.\n\n(See attached CSV data generation in app).`;
            
            // Open Mail Client
            window.location.href = `mailto:${recipient}?subject=Lead Generation Report&body=${encodeURIComponent(body)}&cc=aadesh202316@gamil.com`;
            
            // Also trigger download because mailto can't attach files directly from client
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "leads_report.csv");
            document.body.appendChild(link);
            link.click();

            setMessages(prev => [...prev, { 
                id: Date.now().toString(), 
                role: 'model', 
                text: `I've drafted the email to ${recipient} (cc: aadesh202316@gamil.com). I also downloaded the CSV file to your device so you can attach it to the email.` 
            }]);
        }
      } else {
        // Normal text response
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: response.text || "I didn't understand that." }]);
      }

    } catch (error) {
      console.error("Chat Error", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Sorry, I encountered an error processing your request." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl shadow-blue-500/40 hover:scale-110 transition-transform group"
        >
          <MessageSquare className="w-8 h-8" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Ask AI Assistant
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-[400px] h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-slate-50 dark:bg-slate-900 p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">LeadGen Assistant</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Gemini 3.0 Flash
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.isFunctionCall ? (
                     <div className="flex items-center gap-2 text-xs italic opacity-90">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        {msg.text}
                     </div>
                  ) : (
                      msg.text
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 p-3 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 transition-colors">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask to search or email leads..."
                className="w-full bg-slate-100 dark:bg-slate-700 border-none rounded-xl pl-4 pr-12 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none"
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="absolute right-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2">
              AI can make mistakes. Review generated leads.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;