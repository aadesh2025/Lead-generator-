import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { SearchResponse, Lead } from '../types';
import { ExternalLink, Star, Download, Phone, Mail, Globe, MapPin, ChevronDown, ChevronUp, Copy, Check, Sparkles, Linkedin, Facebook, Twitter, Instagram, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface LeadListProps {
  data: SearchResponse;
  onBack?: () => void;
}

const LeadList: React.FC<LeadListProps> = ({ data, onBack }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Lead | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

  const toggleExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  const handleSort = (key: keyof Lead) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedLeads = useMemo(() => {
    let sortableItems = [...data.leads];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        // Handle Rating extraction specifically
        if (sortConfig.key === 'rating') {
            const getRating = (str?: string) => {
                if (!str || str === 'N/A') return -1;
                const match = str.match(/[\d.]+/);
                return match ? parseFloat(match[0]) : -1;
            };
            const aVal = getRating(a.rating);
            const bVal = getRating(b.rating);
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        }

        // Generic sort
        let aValue: any = a[sortConfig.key as keyof Lead];
        let bValue: any = b[sortConfig.key as keyof Lead];

        // Null/Undefined/'N/A' handling to put them at the bottom
        const isInvalid = (val: any) => !val || val === 'N/A';
        
        if (isInvalid(aValue) && isInvalid(bValue)) return 0;
        if (isInvalid(aValue)) return 1;
        if (isInvalid(bValue)) return -1;
        
        // Convert to string for comparison if not number
        if (typeof aValue !== 'number') aValue = aValue.toString().toLowerCase();
        if (typeof bValue !== 'number') bValue = bValue.toString().toLowerCase();

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data.leads, sortConfig]);
  
  const handleExportCSV = () => {
    if (!sortedLeads.length) return;
    
    const headers = [
      'Business Name', 
      'Address', 
      'Phone', 
      'Email', 
      'Website', 
      'Social Media',
      'Rating', 
      'AI Analysis', 
      'Source Link'
    ];
    
    const rows = sortedLeads.map(lead => {
      const sanitize = (str?: string) => `"${(str || '').replace(/"/g, '""')}"`;
      return [
        sanitize(lead.name),
        sanitize(lead.address),
        sanitize(lead.phone),
        sanitize(lead.email),
        sanitize(lead.website),
        sanitize(lead.socialMedia),
        sanitize(lead.rating),
        sanitize(lead.analysis),
        sanitize(lead.sourceUrl)
      ].join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leadgen_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSocialIcons = (socialStr?: string) => {
    if (!socialStr || socialStr === 'N/A') return <span className="text-slate-400 dark:text-slate-600 text-xs">-</span>;
    
    const lower = socialStr.toLowerCase();
    const icons = [];

    if (lower.includes('linkedin')) icons.push(<Linkedin key="li" className="w-4 h-4 text-blue-700 dark:text-blue-500" />);
    if (lower.includes('facebook') || lower.includes('fb')) icons.push(<Facebook key="fb" className="w-4 h-4 text-blue-600 dark:text-blue-500" />);
    if (lower.includes('instagram') || lower.includes('insta')) icons.push(<Instagram key="ig" className="w-4 h-4 text-pink-600 dark:text-pink-500" />);
    if (lower.includes('twitter') || lower.includes('x.com')) icons.push(<Twitter key="tw" className="w-4 h-4 text-sky-500 dark:text-sky-400" />);
    
    if (icons.length > 0) {
      return <div className="flex gap-2" title={socialStr}>{icons}</div>;
    }
    
    return <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[100px] block" title={socialStr}>{socialStr}</span>;
  };

  const renderSortHeader = (label: string, key: keyof Lead) => (
      <th 
        className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors select-none group"
        onClick={() => handleSort(key)}
      >
        <div className="flex items-center gap-1">
          {label}
          <div className="flex flex-col">
            {sortConfig.key === key ? (
               sortConfig.direction === 'asc' ? 
                 <ArrowUp className="w-3 h-3 text-blue-600 dark:text-blue-400" /> : 
                 <ArrowDown className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            ) : (
               <ArrowUpDown className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-slate-400" />
            )}
          </div>
        </div>
      </th>
  );

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
        <div className="flex items-center gap-4">
           {onBack && (
            <button onClick={onBack} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium text-sm">
              &larr; Back
            </button>
           )}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Extraction Results</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Found {data.leads.length} leads</p>
          </div>
        </div>
        
        {data.leads.length > 0 && (
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-white text-sm font-semibold rounded-lg transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                {renderSortHeader("Business", "name")}
                {renderSortHeader("Contacts", "email")}
                {renderSortHeader("Social", "socialMedia")}
                {renderSortHeader("Rating", "rating")}
                {renderSortHeader("Location", "address")}
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {sortedLeads.map((lead) => {
                 const isGmail = lead.email?.toLowerCase().includes('@gmail.com');
                 return (
                <React.Fragment key={lead.id}>
                  <tr className={`hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors group ${expandedRow === lead.id ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                    {/* Business Name */}
                    <td className="p-4 align-top">
                      <div className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {lead.name}
                      </div>
                      {lead.website && lead.website !== 'N/A' && (
                        <a href={lead.website} target="_blank" rel="noreferrer" className="text-xs text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1 font-medium">
                          <Globe className="w-3 h-3" />
                          Visit Website
                        </a>
                      )}
                    </td>

                    {/* Contacts */}
                    <td className="p-4 align-top space-y-2">
                       {lead.email && lead.email !== 'N/A' ? (
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                             <Mail className={`w-3.5 h-3.5 ${isGmail ? 'text-red-500 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'}`} />
                             <span className="truncate max-w-[180px] font-medium" title={lead.email}>
                               {lead.email}
                             </span>
                             <button onClick={() => copyToClipboard(lead.email!, `email-${lead.id}`)} className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                {copiedId === `email-${lead.id}` ? <Check className="w-3 h-3 text-green-600 dark:text-green-400" /> : <Copy className="w-3 h-3" />}
                             </button>
                          </div>
                       ) : (
                         <div className="text-xs text-slate-400 dark:text-slate-500 italic flex items-center gap-2">
                           <Mail className="w-3 h-3 opacity-50" /> No email
                         </div>
                       )}

                       {lead.phone && lead.phone !== 'N/A' ? (
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                             <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                             <span>{lead.phone}</span>
                          </div>
                       ) : (
                          <div className="text-xs text-slate-400 dark:text-slate-500 italic flex items-center gap-2">
                             <Phone className="w-3 h-3 opacity-50" /> No phone
                          </div>
                       )}
                    </td>

                    {/* Social */}
                    <td className="p-4 align-top">
                       {renderSocialIcons(lead.socialMedia)}
                    </td>

                    {/* Rating */}
                    <td className="p-4 align-top">
                      {lead.rating ? (
                        <div className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-1 rounded text-xs font-bold border border-amber-100 dark:border-amber-800">
                          <Star className="w-3 h-3 fill-current" />
                          {lead.rating}
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600 text-xs">-</span>
                      )}
                    </td>

                    {/* Address */}
                    <td className="p-4 align-top">
                      <div className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400 max-w-[160px]">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400 dark:text-slate-500" />
                        <span className="line-clamp-2">{lead.address || "N/A"}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 align-top text-right">
                       <div className="flex justify-end items-center gap-2">
                          <a 
                            href={lead.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Open Source"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => toggleExpand(lead.id)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 ${expandedRow === lead.id ? 'bg-blue-600 text-white border-blue-600 dark:border-blue-500' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                          >
                            AI Analysis
                            {expandedRow === lead.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                       </div>
                    </td>
                  </tr>

                  {/* Expanded Analysis */}
                  {expandedRow === lead.id && (
                    <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                      <td colSpan={6} className="p-0">
                        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-700">
                           <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-900 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 shadow-md">
                             {/* Decorative background element */}
                             <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
                             
                             <h4 className="relative text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                               <Sparkles className="w-4 h-4" /> 
                               Gemini Intelligence Analysis
                             </h4>
                             
                             <div className="relative text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                               {lead.analysis ? (
                                 <ReactMarkdown components={{
                                   p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                                 }}>
                                   {lead.analysis}
                                 </ReactMarkdown>
                               ) : (
                                 <p className="italic opacity-60">No detailed analysis available for this lead.</p>
                               )}
                             </div>
                           </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )}})}

              {sortedLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full mb-3">
                        <Search className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                      </div>
                      <p className="font-medium text-slate-600 dark:text-slate-300">No matching leads found</p>
                      <p className="text-sm">Try broadening your search criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       {/* Debug Log (Collapsed) */}
      <div className="mt-8">
        <details className="group">
          <summary className="list-none flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-xs font-medium">
             <ChevronDown className="w-3 h-3 group-open:rotate-180 transition-transform" />
             View Raw AI Response
          </summary>
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono overflow-auto max-h-60">
            <ReactMarkdown>{data.summary}</ReactMarkdown>
          </div>
        </details>
      </div>
    </div>
  );
};

export default LeadList;