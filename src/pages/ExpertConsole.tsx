import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, Clock, AlertTriangle, MessageCircle, Send, User, MapPin, Sprout, Smartphone, RefreshCw } from 'lucide-react';

const AnimatedCounter = ({ end, duration = 1500 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <>{count}</>;
};

const MOCK_CASES = [
  {
    id: 'CASE-1042',
    status: 'open',
    date: '2 hours ago',
    farmer: {
      name: 'Ramesh Kumar',
      village: 'Annavaram',
      contact: '+91 98765 43210',
      preferredChannel: 'Voice Call',
      language: 'Telugu',
    },
    input: {
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400',
    },
    aiGuess: {
      issue: 'Leaf Rust / Nitrogen Deficiency',
      confidence: 'Low',
      crop: 'Wheat',
    },
  },
  {
    id: 'CASE-1041',
    status: 'open',
    date: '5 hours ago',
    farmer: {
      name: 'Lakshmi Devi',
      village: 'Bheemili',
      contact: '+91 98765 12345',
      preferredChannel: 'WhatsApp',
      language: 'Telugu',
    },
    input: {
      type: 'audio',
      transcript: '"The leaves on my cotton plants are turning red at the edges and curling downwards. What should I spray?"',
    },
    aiGuess: {
      issue: 'Leaf Curl Virus / Magnesium Deficiency',
      confidence: 'Low',
      crop: 'Cotton',
    },
  },
  {
    id: 'CASE-1038',
    status: 'resolved',
    date: 'Yesterday',
    farmer: {
      name: 'Srinivas Rao',
      village: 'Annavaram',
      contact: '+91 91234 56789',
      preferredChannel: 'SMS',
      language: 'Telugu',
    },
    input: {
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?auto=format&fit=crop&q=80&w=400',
    },
    aiGuess: {
      issue: 'Red Rot Disease',
      confidence: 'Low',
      crop: 'Sugarcane',
    },
    resolution: 'Confirmed Red Rot. Recommended uprooting affected plants and applying Carbendazim 50% WP.',
  }
];

export default function ExpertConsole() {
  const [testFarmerId, setTestFarmerId] = useState('FARMER-01');
  const [isSendingTestAlert, setIsSendingTestAlert] = useState(false);
  const [testAlertStatus, setTestAlertStatus] = useState<string | null>(null);

  const handleSendTestAlert = async () => {
    setIsSendingTestAlert(true);
    setTestAlertStatus(null);
    try {
      const res = await fetch('/api/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: testFarmerId
        })
      });
      if (res.ok) {
        const data = await res.json();
        setTestAlertStatus(data.smsStatus === 'sent' ? 'Delivered' : 'Simulated');
      } else {
        setTestAlertStatus('Failed');
      }
    } catch (e) {
      setTestAlertStatus('Failed');
    } finally {
      setIsSendingTestAlert(false);
    }
  };

  const [cases, setCases] = useState<any[]>(() => {
    const stored = localStorage.getItem('kisan_expert_cases');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return MOCK_CASES;
      }
    }
    localStorage.setItem('kisan_expert_cases', JSON.stringify(MOCK_CASES));
    return MOCK_CASES;
  });

  const [activeTab, setActiveTab] = useState<'queue' | 'resolved'>('queue');
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');

  const displayCases = cases.filter(c => 
    activeTab === 'queue' ? c.status === 'open' : c.status === 'resolved'
  );

  const getCropIcon = (cropName: string) => {
    return <Sprout className="w-5 h-5" />;
  };

  const handleResolve = () => {
    if (!selectedCase) return;
    const updated = cases.map(c => {
      if (c.id === selectedCase.id) {
        return { ...c, status: 'resolved', resolution: replyText };
      }
      return c;
    });
    setCases(updated);
    localStorage.setItem('kisan_expert_cases', JSON.stringify(updated));
    alert(`Resolution sent via ${selectedCase.farmer.preferredChannel} in ${selectedCase.farmer.language}`);
    setSelectedCase(null);
    setReplyText('');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-[calc(100vh-80px)] md:h-[calc(100vh)] flex flex-col">
      <header className="mb-6 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1E2320] dark:text-[#FAFAF7]">Rythu Seva Kendra: Annavaram Hub</h1>
            <p className="text-[#6B7268] dark:text-[#9CA3AF] mt-2">Expert Console — Case Escalation Queue</p>
          </div>
          <div className="hidden sm:flex items-center gap-4 bg-white dark:bg-[#1E1E1E] p-3 rounded-2xl border border-[#6B7268]/10 shadow-sm">
             <div className="text-center px-4 border-r border-[#6B7268]/10">
               <div className="text-2xl font-bold text-[#D95F4B]"><AnimatedCounter end={12} /></div>
               <div className="text-xs text-[#6B7268] dark:text-[#9CA3AF] font-medium uppercase tracking-wider">Pending</div>
             </div>
             <div className="text-center px-4">
               <div className="text-2xl font-bold text-[#3C8B5C]"><AnimatedCounter end={48} /></div>
               <div className="text-xs text-[#6B7268] dark:text-[#9CA3AF] font-medium uppercase tracking-wider">Resolved</div>
             </div>
          </div>
        </div>
      </header>

      {/* Demo Alert Control Center */}
      <div className="mb-6 p-5 bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h3 className="text-base font-bold text-[#1E2320] dark:text-[#FAFAF7] flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#3C8B5C]" />
            Demo Alert Control Center
          </h3>
          <p className="text-xs text-[#6B7268] dark:text-[#9CA3AF] mt-1">
            Manually dispatch simulated or real dry-spell warnings to selected farmers on demand for demo purposes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-[#1E2320] dark:text-[#FAFAF7]">Target Farmer:</label>
            <select 
              value={testFarmerId} 
              onChange={(e) => setTestFarmerId(e.target.value)}
              className="bg-[#FAFAF7] dark:bg-[#121212] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#3C8B5C] dark:text-[#FAFAF7]"
            >
              <option value="FARMER-01">Ram Singh (Wheat - Tillering)</option>
              <option value="FARMER-02">Ramesh Kumar (Rice - Transplanting)</option>
              <option value="FARMER-03">Lakshmi Devi (Cotton - Vegetative)</option>
              <option value="FARMER-04">Srinivas Rao (Sugarcane - Grand Growth)</option>
            </select>
          </div>
          <button
            onClick={handleSendTestAlert}
            disabled={isSendingTestAlert}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all ${
              isSendingTestAlert
                ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 cursor-not-allowed'
                : 'bg-[#3C8B5C] text-white hover:bg-[#2c6b45] dark:bg-[#6EE7B7] dark:text-[#121212] dark:hover:bg-[#34D399]'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSendingTestAlert ? 'animate-spin' : ''}`} />
            {isSendingTestAlert ? 'Dispatching...' : 'Send Test Alert'}
          </button>
          {testAlertStatus && (
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1.5 rounded ${
              testAlertStatus === 'Simulated' 
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' 
                : testAlertStatus === 'Delivered'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/20'
            }`}>
              Status: {testAlertStatus}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        {/* Queue List */}
        <div className={`flex-1 flex flex-col bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#6B7268]/10 shadow-sm overflow-hidden ${selectedCase ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-[#6B7268]/10 flex items-center justify-between bg-[#FAFAF7]/50 dark:bg-[#121212]/50">
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('queue')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'queue' ? 'bg-[#3C8B5C] text-white' : 'text-[#6B7268] dark:text-[#9CA3AF] hover:bg-[#6B7268]/10'}`}
              >
                Queue
              </button>
              <button 
                onClick={() => setActiveTab('resolved')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'resolved' ? 'bg-white dark:bg-[#1E1E1E] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 text-[#1E2320] dark:text-[#FAFAF7]' : 'text-[#6B7268] dark:text-[#9CA3AF] hover:bg-[#6B7268]/10'}`}
              >
                Resolved
              </button>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-[#6B7268] dark:text-[#9CA3AF] hover:bg-[#6B7268]/10 rounded-lg"><Filter className="w-5 h-5" /></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {displayCases.map(c => (
              <div 
                key={c.id} 
                onClick={() => setSelectedCase(c)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${selectedCase?.id === c.id ? 'border-[#3C8B5C] bg-[#3C8B5C]/5' : 'border-[#6B7268]/10 hover:border-[#6B7268]/30 bg-white dark:bg-[#1E1E1E]'}`}
              >
                <div className="flex items-start justify-between mb-2">
                   <div className="flex items-center gap-2">
                     {c.status === 'open' ? (
                       <span className="w-2 h-2 rounded-full bg-[#D95F4B] animate-pulse"></span>
                     ) : (
                       <CheckCircle className="w-4 h-4 text-[#3C8B5C]" />
                     )}
                     <span className="text-sm font-bold text-[#1E2320] dark:text-[#FAFAF7]">{c.id}</span>
                   </div>
                   <span className="text-xs text-[#6B7268] dark:text-[#9CA3AF] flex items-center gap-1"><Clock className="w-3 h-3" /> {c.date}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAFAF7] dark:bg-[#121212] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-[#6B7268] dark:text-[#9CA3AF]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{c.farmer.name}</div>
                    <div className="text-xs text-[#6B7268] dark:text-[#9CA3AF] truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {c.farmer.village}
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAFAF7] dark:bg-[#121212] p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                     <span className="p-1 bg-white dark:bg-[#1E1E1E] rounded-md shadow-sm text-[#3C8B5C]">
                        {getCropIcon(c.aiGuess.crop)}
                     </span>
                     <span className="text-xs font-semibold">{c.aiGuess.crop}</span>
                     <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#E0A93A]/10 text-[#E0A93A] rounded">Low Confidence</span>
                  </div>
                  <div className="text-sm text-[#1E2320] dark:text-[#FAFAF7] line-clamp-1">{c.aiGuess.issue}</div>
                </div>
              </div>
            ))}
            {displayCases.length === 0 && (
              <div className="p-8 text-center text-[#6B7268] dark:text-[#9CA3AF]">
                No cases in this view.
              </div>
            )}
          </div>
        </div>

        {/* Case Detail Pane */}
        {selectedCase ? (
          <div className="flex-[2] flex flex-col bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#6B7268]/10 shadow-sm overflow-hidden h-full">
            <div className="p-4 border-b border-[#6B7268]/10 flex items-center gap-4 bg-[#FAFAF7]/50 dark:bg-[#121212]/50 shrink-0">
              <button onClick={() => setSelectedCase(null)} className="md:hidden p-2 -ml-2 text-[#6B7268] dark:text-[#9CA3AF]">←</button>
              <div>
                <h2 className="font-bold text-lg">{selectedCase.id}</h2>
                <div className="text-sm text-[#6B7268] dark:text-[#9CA3AF]">Submitted {selectedCase.date} via {selectedCase.farmer.preferredChannel}</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
               {/* Farmer Profile Snippet */}
               <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl border border-[#6B7268]/10 bg-[#FAFAF7] dark:bg-[#121212]">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-[#1E2320] dark:bg-[#FAFAF7] text-white dark:text-[#121212] flex items-center justify-center font-bold text-lg">
                     {selectedCase.farmer.name.charAt(0)}
                   </div>
                   <div>
                     <div className="font-semibold">{selectedCase.farmer.name}</div>
                     <div className="text-sm text-[#6B7268] dark:text-[#9CA3AF]">{selectedCase.farmer.contact}</div>
                   </div>
                 </div>
                 <div className="w-px h-8 bg-[#6B7268]/20 hidden sm:block"></div>
                 <div className="text-sm">
                   <div className="text-[#6B7268] dark:text-[#9CA3AF]">Village</div>
                   <div className="font-medium">{selectedCase.farmer.village}</div>
                 </div>
                 <div className="w-px h-8 bg-[#6B7268]/20 hidden sm:block"></div>
                 <div className="text-sm">
                   <div className="text-[#6B7268] dark:text-[#9CA3AF]">Language</div>
                   <div className="font-medium">{selectedCase.farmer.language}</div>
                 </div>
               </div>

               {/* Evidence */}
               <div>
                 <h3 className="text-sm font-semibold text-[#6B7268] dark:text-[#9CA3AF] uppercase tracking-wider mb-3">Farmer's Input</h3>
                 {selectedCase.input.type === 'photo' ? (
                   <img src={selectedCase.input.url} alt="Crop issue" className="w-full max-w-md rounded-2xl border border-[#6B7268]/10 shadow-sm" />
                 ) : (
                   <div className="bg-[#3C8B5C]/10 text-[#1E2320] dark:text-[#FAFAF7] p-4 rounded-2xl italic">
                     {selectedCase.input.transcript}
                     <div className="mt-2 text-xs text-[#3C8B5C] font-medium flex items-center gap-1">
                       <MessageCircle className="w-3 h-3" /> Transcribed from voice call
                     </div>
                   </div>
                 )}
               </div>

               {/* AI Guess */}
               <div>
                 <h3 className="text-sm font-semibold text-[#6B7268] dark:text-[#9CA3AF] uppercase tracking-wider mb-3">AI Preliminary Analysis</h3>
                 <div className="bg-white dark:bg-[#1E1E1E] border border-[#E0A93A]/30 rounded-2xl p-4 flex items-start gap-3">
                   <AlertTriangle className="w-5 h-5 text-[#E0A93A] shrink-0 mt-0.5" />
                   <div>
                     <div className="flex items-center gap-2 mb-1">
                       <span className="font-semibold text-[#1E2320] dark:text-[#FAFAF7]">{selectedCase.aiGuess.issue}</span>
                       <span className="text-xs bg-[#E0A93A]/10 text-[#E0A93A] px-2 py-0.5 rounded">Low Confidence</span>
                     </div>
                     <p className="text-sm text-[#6B7268] dark:text-[#9CA3AF]">Model could not definitively diagnose this issue. Routed to Kendra for manual review.</p>
                   </div>
                 </div>
               </div>

               {/* Resolution (if resolved) */}
               {selectedCase.status === 'resolved' && selectedCase.resolution && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#6B7268] dark:text-[#9CA3AF] uppercase tracking-wider mb-3">Expert Resolution</h3>
                    <div className="bg-[#3C8B5C]/5 border border-[#3C8B5C]/20 rounded-2xl p-4 text-[#1E2320] dark:text-[#FAFAF7]">
                      {selectedCase.resolution}
                    </div>
                  </div>
               )}
            </div>

            {/* Reply Bar */}
            {selectedCase.status === 'open' && (
              <div className="p-4 border-t border-[#6B7268]/10 bg-[#FAFAF7]/50 dark:bg-[#121212]/50 shrink-0">
                <div className="mb-2 flex items-center justify-between text-xs text-[#6B7268] dark:text-[#9CA3AF]">
                  <span>Reply will be sent via: <strong className="text-[#1E2320] dark:text-[#FAFAF7]">{selectedCase.farmer.preferredChannel}</strong></span>
                  <span>Language: <strong className="text-[#1E2320] dark:text-[#FAFAF7]">{selectedCase.farmer.language}</strong></span>
                </div>
                <div className="flex gap-2">
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your diagnosis and recommendation..."
                    className="flex-1 bg-white dark:bg-[#1E1E1E] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3C8B5C] dark:focus:border-[#6EE7B7] dark:text-[#FAFAF7] resize-none h-20"
                  />
                  <button 
                    onClick={handleResolve}
                    disabled={!replyText.trim()}
                    className="bg-[#3C8B5C] text-white px-6 rounded-xl font-medium hover:bg-[#2c6b45] transition-colors disabled:opacity-50 flex items-center justify-center shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                  <button onClick={() => setReplyText('Confirmed Leaf Rust. Apply Propiconazole 25% EC at 1ml/liter.')} className="shrink-0 text-xs px-3 py-1.5 bg-white dark:bg-[#1E1E1E] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-lg hover:border-[#3C8B5C] dark:hover:border-[#6EE7B7] dark:text-[#FAFAF7]">Leaf Rust Template</button>
                  <button onClick={() => setReplyText('Please bring a physical sample to the Kendra for microscopic inspection.')} className="shrink-0 text-xs px-3 py-1.5 bg-white dark:bg-[#1E1E1E] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-lg hover:border-[#3C8B5C] dark:hover:border-[#6EE7B7] dark:text-[#FAFAF7]">Request Sample</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex flex-[2] bg-[#FAFAF7]/50 dark:bg-[#121212]/50 rounded-3xl border border-[#6B7268]/10 items-center justify-center text-[#6B7268] dark:text-[#9CA3AF] flex-col gap-4">
             <div className="w-16 h-16 rounded-full bg-white dark:bg-[#1E1E1E] shadow-sm flex items-center justify-center">
               <MessageCircle className="w-8 h-8 text-[#6B7268] dark:text-[#9CA3AF]/50" />
             </div>
             <p>Select a case from the queue to review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
