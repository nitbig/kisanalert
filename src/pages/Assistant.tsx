import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Loader2, Mic, Square, Search, Globe, ExternalLink, Headset } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  isAudio?: boolean;
  audioDuration?: string;
  groundingMetadata?: {
    webSearchQueries?: string[];
    groundingChunks?: Array<{
      web?: {
        uri?: string;
        title?: string;
      };
    }>;
  };
};

const voiceQueries: Record<string, string[]> = {
  en: [
    "Is it safe to irrigate my crops today?",
    "How can I treat yellow leaves on wheat?",
    "What is the best fertilizer for 2 acres of paddy?",
    "Show me the latest mandi prices of wheat."
  ],
  hi: [
    "क्या आज मेरी फसलों की सिंचाई करना सुरक्षित है?",
    "गेहूं के पीले पत्तों का इलाज कैसे करें?",
    "2 एकड़ धान के लिए सबसे अच्छा उर्वरक कौन सा है?",
    "मुझे गेहूं के ताजा मंडी भाव दिखाएं।"
  ],
  te: [
    "ఈ రోజు నా పంటలకు నీరు పెట్టడం మంచిదేనా?",
    "గోధుమ ఆకులు పసుపు రంగులోకి మారడానికి నివారణ ఏమిటి?",
    "2 ఎకరాల వరి పంటకు ఏ ఎరువులు వాడాలి?",
    "గోధుమల తాజా మండి ధరలను చూపించండి."
  ],
  pa: [
    "ਕੀ ਅੱਜ ਮੇਰੀਆਂ ਫਸਲਾਂ ਨੂੰ ਪਾਣੀ ਦੇਣਾ ਸੁਰੱਖਿਅਤ ਹੈ?",
    "ਕਣਕ ਦੇ ਪੀਲੇ ਪੱਤਿਆਂ ਦਾ ਇਲਾਜ ਕਿਵੇਂ ਕਰੀਏ?",
    "2 ਏਕੜ ਝੋਨੇ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਖਾਦ ਕਿਹੜੀ ਹੈ?",
    "ਮੈਨੂੰ ਕਣਕ ਦੇ ਤਾਜ਼ਾ ਮੰਡੀ ਦੇ ਭਾਅ ਦਿਖਾਓ।"
  ]
};

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hello! I am your Kisan Assistant. How can I help you with your farm today? You can ask me about crop diseases, fertilizers, weather, upload a photo, or send a voice message.'
    }
  ]);
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioInput, setIsAudioInput] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [isSimulatedVoice, setIsSimulatedVoice] = useState(false);
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [expertIssue, setExpertIssue] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<string>('');
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordingTimerRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if ((window as any)._voiceTypingIntervals) {
        (window as any)._voiceTypingIntervals.forEach((intervalId: any) => clearInterval(intervalId));
        (window as any)._voiceTypingIntervals = null;
      }
    };
  }, []);

  const startAudioVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.max(0, (average / 128) * 100)));
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (err) {
      console.warn("Could not start audio visualizer:", err);
      let level = 10;
      const interval = setInterval(() => {
        if (!isRecording) {
          clearInterval(interval);
          return;
        }
        setAudioLevel(10 + Math.random() * 60);
      }, 100);
    }
  };

  const stopAudioVisualizer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const stopSimulatedVoice = () => {
    if ((window as any)._voiceTypingIntervals) {
      (window as any)._voiceTypingIntervals.forEach((intervalId: any) => clearInterval(intervalId));
      (window as any)._voiceTypingIntervals = null;
    }
    setIsRecording(false);
    setIsSimulatedVoice(false);
    setAudioLevel(0);
  };

  const simulateVoiceTyping = (text: string) => {
    setIsRecording(true);
    setIsAudioInput(true);
    setRecordingSeconds(0);
    setInput('');
    setShowVoiceAssistant(false);
    setIsSimulatedVoice(true);

    // Start bouncing visualizer
    const visualizerInterval = setInterval(() => {
      setAudioLevel(15 + Math.random() * 70);
    }, 100);

    // Timer
    const timerInterval = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);

    // Type letter by letter
    let currentIdx = 0;
    const typingInterval = setInterval(() => {
      if (currentIdx < text.length) {
        setInput(text.slice(0, currentIdx + 1));
        currentIdx += 2; // Type 2 characters at a time for natural speed
      } else {
        setInput(text);
        // Done typing!
        clearInterval(typingInterval);
        clearInterval(visualizerInterval);
        clearInterval(timerInterval);
        setIsRecording(false);
        setIsSimulatedVoice(false);
        setAudioLevel(0);
        sendMessage(text);
      }
    }, 50);

    // Save references to clear if they cancel or exit
    (window as any)._voiceTypingIntervals = [typingInterval, visualizerInterval, timerInterval];
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (isSimulatedVoice) {
        stopSimulatedVoice();
        return;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsRecording(false);
      stopAudioVisualizer();
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    } else {
      stopSimulatedVoice();
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsRecording(true);
        setIsAudioInput(true);
        setRecordingSeconds(0);
        
        startAudioVisualizer();
        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds(prev => prev + 1);
        }, 1000);

        // Start initial silence timer of 3 seconds
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          console.log("No speech detected for 3 seconds. Automatically stopping mic.");
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch (e) {}
          }
        }, 3000);

        try {
          const recognition = new SpeechRecognition();
          recognitionRef.current = recognition;
          recognition.continuous = true;
          recognition.interimResults = true;
          
          const storedLang = localStorage.getItem('kisan_language') || 'en';
          const langMap: Record<string, string> = {
            en: 'en-US',
            hi: 'hi-IN',
            te: 'te-IN',
            pa: 'pa-IN'
          };
          recognition.lang = langMap[storedLang] || 'en-US';

          recognition.onresult = (event: any) => {
            // Reset our 3-second silence timer because we just received speech input!
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = setTimeout(() => {
              console.log("Speech silence detected for 3 seconds. Automatically stopping mic.");
              if (recognitionRef.current) {
                try {
                  recognitionRef.current.stop();
                } catch (e) {}
              }
            }, 3000);

            let finalTranscript = '';
            let interimTranscript = '';
            for (let i = 0; i < event.results.length; ++i) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript;
              } else {
                interimTranscript += transcript;
              }
            }
            const fullTranscript = (finalTranscript + interimTranscript).trim();
            if (fullTranscript) {
              setInput(fullTranscript);
              inputRef.current = fullTranscript;
            }
          };

          recognition.onerror = (event: any) => {
            console.log("Speech recognition error", event.error);
            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
              silenceTimerRef.current = null;
            }
            setIsRecording(false);
            stopAudioVisualizer();
            if (recordingTimerRef.current) {
              clearInterval(recordingTimerRef.current);
              recordingTimerRef.current = null;
            }
            setShowVoiceAssistant(true);
          };

          recognition.onend = () => {
            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
              silenceTimerRef.current = null;
            }
            setIsRecording(false);
            stopAudioVisualizer();
            if (recordingTimerRef.current) {
              clearInterval(recordingTimerRef.current);
              recordingTimerRef.current = null;
            }
            recognitionRef.current = null;
            if (inputRef.current) {
              sendMessage(inputRef.current);
            }
          };

          recognition.start();
        } catch (err) {
          console.log("Failed to start SpeechRecognition", err);
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
          setIsRecording(false);
          stopAudioVisualizer();
          setShowVoiceAssistant(true);
        }
      } else {
        setShowVoiceAssistant(true);
      }
    }
  };

  const sendMessage = async (textOverride?: string) => {
    const textToSend = textOverride !== undefined ? textOverride : input;
    if ((!textToSend.trim() && !imagePreview) || isLoading) return;

    const isSimulatedAudio = isAudioInput || (textToSend.startsWith('"') && textToSend.endsWith('"'));

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      image: imagePreview || undefined,
      isAudio: isSimulatedAudio,
      audioDuration: isSimulatedAudio ? formatDuration(recordingSeconds || 12) : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    inputRef.current = '';
    setImagePreview(null);
    setIsAudioInput(false);
    setIsLoading(true);

    // Create a placeholder model message
    const modelMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: modelMessageId, role: 'model', text: '' }]);

    try {
      const storedLang = localStorage.getItem('kisan_language') || 'en';

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            text: m.text,
            image: m.image
          })),
          language: storedLang,
          location: localStorage.getItem('kisan_location') || 'Punjab, India',
          soilType: localStorage.getItem('kisan_soilType') || 'Loamy',
          rainfall: localStorage.getItem('kisan_rainfall') || 'Average (auto)',
          groundwater: localStorage.getItem('kisan_groundwater') || 'Medium',
          season: localStorage.getItem('kisan_season') || 'Rabi (auto)',
          farmSize: Number(localStorage.getItem('kisan_farmSize')) || 2,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      let textBuffer = '';
      let streamBuffer = '';
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          streamBuffer += decoder.decode(value, { stream: true });
          const lines = streamBuffer.split('\n');
          streamBuffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            if (trimmed.startsWith('data: ')) {
              const dataStr = trimmed.slice(6).trim();
              if (dataStr === '[DONE]') break;
              try {
                const data = JSON.parse(dataStr);
                if (data.text || data.groundingMetadata) {
                  textBuffer += data.text || '';
                  setMessages(prev => prev.map(m => {
                    if (m.id === modelMessageId) {
                      const updatedMetadata = data.groundingMetadata 
                        ? {
                            webSearchQueries: data.groundingMetadata.webSearchQueries || m.groundingMetadata?.webSearchQueries,
                            groundingChunks: data.groundingMetadata.groundingChunks || m.groundingMetadata?.groundingChunks
                          }
                        : m.groundingMetadata;
                      return { 
                        ...m, 
                        text: textBuffer,
                        groundingMetadata: updatedMetadata
                      };
                    }
                    return m;
                  }));
                }
              } catch (e) {
                // Ignore parsing errors of partial chunks
              }
            }
          }
        }
      }

      if (textBuffer.includes('[CONFIDENCE: LOW]')) {
        const storedCasesStr = localStorage.getItem('kisan_expert_cases');
        let currentCases = [];
        try {
          if (storedCasesStr) currentCases = JSON.parse(storedCasesStr);
        } catch (e) {
          currentCases = [];
        }
        
        const imageObj = userMessage.image ? { type: 'photo' as const, url: userMessage.image } : undefined;
        const voiceObj = userMessage.isAudio ? { type: 'audio' as const, transcript: userMessage.text } : undefined;
        
        const lang = localStorage.getItem('kisan_language') || 'en';
        const langMap: Record<string, string> = { en: 'English', hi: 'Hindi', te: 'Telugu', pa: 'Punjabi' };
        
        const newCase = {
          id: `CASE-${Math.floor(Math.random() * 9000) + 1000}`,
          status: 'open',
          date: 'Just now',
          farmer: {
            name: 'Sukhdev Singh (You)',
            village: 'Sangrur, Punjab',
            contact: '+91 94172 00000',
            preferredChannel: 'SMS',
            language: langMap[lang] || 'English',
          },
          input: imageObj || voiceObj || { type: 'audio' as const, transcript: userMessage.text },
          aiGuess: {
            issue: 'Escalated Crop Health Issue',
            confidence: 'Low',
            crop: 'Wheat',
          },
          description: userMessage.text
        };
        
        currentCases.unshift(newCase);
        localStorage.setItem('kisan_expert_cases', JSON.stringify(currentCases));
      }
    } catch (error) {
      // Ignore network errors silently to avoid platform warnings
      setMessages(prev => prev.map(m => m.id === modelMessageId ? { ...m, text: 'Sorry, I encountered an error connecting to the intelligence server.' } : m));
    } finally {
      setIsLoading(false);
    }
  };

  const submitExpertCase = () => {
    if (!expertIssue.trim()) return;
    
    const storedCasesStr = localStorage.getItem('kisan_expert_cases');
    let currentCases = [];
    try {
      if (storedCasesStr) currentCases = JSON.parse(storedCasesStr);
    } catch (e) {
      currentCases = [];
    }
    
    const lang = localStorage.getItem('kisan_language') || 'en';
    const langMap: Record<string, string> = { en: 'English', hi: 'Hindi', te: 'Telugu', pa: 'Punjabi' };
    
    const newCase = {
      id: `CASE-${Math.floor(Math.random() * 9000) + 1000}`,
      status: 'open',
      date: 'Just now',
      farmer: {
        name: 'Sukhdev Singh (You)',
        village: 'Sangrur, Punjab',
        contact: '+91 94172 00000',
        preferredChannel: 'SMS',
        language: langMap[lang] || 'English',
      },
      input: { type: 'audio', transcript: expertIssue },
      aiGuess: {
        issue: 'Manual Expert Consultation Request',
        confidence: 'Low',
        crop: 'Unknown',
      },
      description: expertIssue
    };
    
    currentCases.unshift(newCase);
    localStorage.setItem('kisan_expert_cases', JSON.stringify(currentCases));
    
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user',
        text: `Consult Expert: ${expertIssue}`,
      },
      {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: `I have forwarded your request to our agricultural experts. Your case number is **${newCase.id}**. You can track the status in the Kendra tab. They will get back to you shortly.`,
      }
    ]);
    
    setExpertIssue('');
    setShowExpertModal(false);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto md:p-4">
      
      {/* Header */}
      <header className="p-4 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md md:rounded-t-3xl border-b border-[#6B7268]/10 dark:border-[#FAFAF7]/10 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold text-[#1E2320] dark:text-[#FAFAF7]">Kisan Assistant</h1>
          <p className="text-sm text-[#3C8B5C] dark:text-[#6EE7B7] flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#3C8B5C] dark:bg-[#6EE7B7] animate-pulse"></span>
            Online
          </p>
        </div>
        <button
          onClick={() => setShowExpertModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl text-sm font-medium text-[#3C8B5C] dark:text-[#6EE7B7] shadow-sm hover:bg-[#3C8B5C]/5 dark:hover:bg-[#6EE7B7]/5 transition-colors"
        >
          <Headset className="w-4 h-4" />
          <span className="hidden sm:inline">Consult Expert</span>
        </button>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-white/40 dark:bg-[#121212]/40 md:border-x border-[#6B7268]/10 dark:border-[#FAFAF7]/10 scroll-smooth"
      >
        {messages.map((m) => {
          let displayText = m.text;
          let isLowConfidence = false;
          
          if (m.role === 'model') {
            if (displayText.includes('[CONFIDENCE: LOW]')) {
              isLowConfidence = true;
              displayText = displayText.replace(/\[CONFIDENCE: LOW\]\s*/i, '');
            } else if (displayText.includes('[CONFIDENCE: MEDIUM]')) {
              displayText = displayText.replace(/\[CONFIDENCE: MEDIUM\]\s*/i, '');
            } else if (displayText.includes('[CONFIDENCE: HIGH]')) {
              displayText = displayText.replace(/\[CONFIDENCE: HIGH\]\s*/i, '');
            }
          }

          return (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 ${
                  m.role === 'user' 
                    ? 'bg-[#3C8B5C] dark:bg-[#6EE7B7] text-white dark:text-[#121212] rounded-tr-sm' 
                    : 'bg-white dark:bg-[#1E1E1E] text-[#1E2320] dark:text-[#FAFAF7] border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 rounded-tl-sm shadow-sm'
                }`}
              >
                {m.image && (
                  <img src={m.image} alt="Uploaded crop" className="w-full max-w-xs rounded-xl mb-3 object-cover shadow-sm" />
                )}
                {m.isAudio && m.role === 'user' && (
                  <div className="flex items-center gap-2 mb-2 bg-white/20 dark:bg-black/20 p-2 rounded-xl">
                    <div className="p-2 bg-white dark:bg-[#121212] rounded-full text-[#3C8B5C] dark:text-[#6EE7B7]">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                       <div className="h-1.5 bg-white/30 dark:bg-black/30 rounded-full w-full overflow-hidden">
                         <div className="h-full bg-white dark:bg-[#121212] w-2/3 rounded-full"></div>
                       </div>
                    </div>
                    <span className="text-xs font-medium">{m.audioDuration || '0:12'}</span>
                  </div>
                )}
                {m.role === 'model' ? (
                  <div className="flex flex-col gap-3">
                    {isLowConfidence && (
                      <div className="flex items-center gap-1.5 self-start bg-[#E0A93A]/10 text-[#E0A93A] px-2.5 py-1 rounded-full text-xs font-medium border border-[#E0A93A]/20">
                        <span className="w-1.5 h-1.5 bg-[#E0A93A] rounded-full animate-pulse"></span>
                        Forwarded to expert — awaiting response
                      </div>
                    )}
                    <div className="prose prose-sm md:prose-base prose-emerald dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-[#FAFAF7] dark:prose-pre:bg-[#121212] prose-pre:border prose-pre:border-[#6B7268]/10 dark:prose-pre:border-[#FAFAF7]/10 prose-pre:text-[#1E2320] dark:prose-pre:text-[#FAFAF7]">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkMath]} 
                        rehypePlugins={[rehypeKatex]}
                      >
                        {displayText || '...'}
                      </ReactMarkdown>
                    </div>
                    {m.groundingMetadata && (
                      <div className="mt-2 pt-3 border-t border-[#6B7268]/10 dark:border-[#FAFAF7]/10 flex flex-col gap-2">
                        {m.groundingMetadata.webSearchQueries && m.groundingMetadata.webSearchQueries.length > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-[#6B7268] dark:text-[#9CA3AF] font-medium">
                            <Search className="w-3.5 h-3.5 text-[#3C8B5C] dark:text-[#6EE7B7]" />
                            <span>Searched: "{m.groundingMetadata.webSearchQueries[0]}"</span>
                          </div>
                        )}
                        {m.groundingMetadata.groundingChunks && m.groundingMetadata.groundingChunks.length > 0 && (
                          <div className="flex flex-col gap-1.5 mt-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7268] dark:text-[#9CA3AF]">
                              Verified Sources
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {m.groundingMetadata.groundingChunks.map((chunk, idx) => {
                                const web = chunk.web;
                                if (!web || !web.uri) return null;
                                return (
                                  <a
                                    key={idx}
                                    href={web.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-2 py-0.5 bg-[#FAFAF7] dark:bg-[#1E1E1E] hover:bg-[#3C8B5C]/10 dark:hover:bg-[#6EE7B7]/10 border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-md text-[11px] text-[#3C8B5C] dark:text-[#6EE7B7] font-medium transition-all max-w-[200px] truncate"
                                    title={web.title || web.uri}
                                  >
                                    <Globe className="w-2.5 h-2.5 shrink-0" />
                                    <span className="truncate">{web.title || web.uri}</span>
                                    <ExternalLink className="w-2 h-2 shrink-0 opacity-60" />
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="leading-relaxed whitespace-pre-wrap">{displayText}</p>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && messages[messages.length-1]?.role !== 'model' && (
          <div className="flex justify-start">
             <div className="bg-white dark:bg-[#1E1E1E] border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 rounded-2xl rounded-tl-sm p-4 shadow-sm flex gap-2 items-center text-[#6B7268] dark:text-[#9CA3AF]">
               <Loader2 className="w-4 h-4 animate-spin" />
               <span className="text-sm">Analyzing...</span>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-[#1E1E1E] md:rounded-b-3xl border-t border-[#6B7268]/10 dark:border-[#FAFAF7]/10 shrink-0">
        
        {/* Quick Replies */}
        {messages.length < 3 && (
           <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
             {["Is it safe to irrigate today?", "What's causing yellow leaves?", "Fertilizer dosage for wheat?"].map(qr => (
               <button 
                 key={qr} 
                 onClick={() => { setInput(qr); setTimeout(() => sendMessage(qr), 100); }}
                 className="shrink-0 px-4 py-2 bg-[#FAFAF7] dark:bg-[#121212] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-full text-sm text-[#3C8B5C] dark:text-[#6EE7B7] hover:bg-[#3C8B5C]/5 dark:hover:bg-[#6EE7B7]/5 whitespace-nowrap transition-colors"
               >
                 {qr}
               </button>
             ))}
           </div>
        )}

        {imagePreview && (
          <div className="relative inline-block mb-4">
            <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-xl border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 shadow-sm" />
            <button 
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-white dark:bg-[#1E1E1E] text-[#D95F4B] dark:text-[#F87171] p-1 rounded-full shadow-md hover:bg-[#FAFAF7] dark:hover:bg-[#121212]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Voice suggestions overlay if mic blocked or unsupported */}
        {showVoiceAssistant && (
          <div className="p-4 bg-[#FAFAF7] dark:bg-[#121212] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-2xl mb-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex justify-between items-center mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#3C8B5C] dark:text-[#6EE7B7] flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" />
                Kisan Voice Suggestions
              </h3>
              <button 
                onClick={() => setShowVoiceAssistant(false)}
                className="text-[#6B7268] dark:text-[#9CA3AF] hover:text-[#D95F4B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#6B7268] dark:text-[#9CA3AF] mb-3">
              Voice input is currently unavailable, unsupported, or experiencing connection issues on this device. You can easily click any of the common voice queries below to simulate instant dictation-typing:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {(voiceQueries[localStorage.getItem('kisan_language') || 'en'] || voiceQueries.en).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => simulateVoiceTyping(q)}
                  className="p-2.5 text-left text-xs md:text-sm bg-white dark:bg-[#1E1E1E] border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 rounded-xl hover:border-[#3C8B5C] dark:hover:border-[#6EE7B7] hover:bg-[#3C8B5C]/5 dark:hover:bg-[#6EE7B7]/5 text-[#1E2320] dark:text-[#FAFAF7] transition-all"
                >
                  🎙️ "{q}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Voice Recording / Listening Visualizer */}
        {isRecording && (
          <div className="flex items-center justify-between px-4 py-2 bg-[#3C8B5C]/5 dark:bg-[#6EE7B7]/5 border border-[#3C8B5C]/20 dark:border-[#6EE7B7]/20 rounded-2xl mb-4 animate-pulse">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D95F4B] dark:bg-[#F87171] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D95F4B] dark:bg-[#F87171]"></span>
              </span>
              <span className="text-xs font-semibold text-[#3C8B5C] dark:text-[#6EE7B7]">
                {isSimulatedVoice ? "Typing speech query" : "Listening"} ({formatDuration(recordingSeconds)})
              </span>
            </div>
            {/* Audio Bouncing Waveform */}
            <div className="flex items-center gap-1 h-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => {
                const waveFactor = Math.sin((bar * 0.4) + (audioLevel * 0.15)) * 0.5 + 0.5;
                const minH = 4;
                const maxH = 16;
                const height = minH + (maxH - minH) * waveFactor * (audioLevel > 5 ? (audioLevel / 100) : 0.4);
                return (
                  <span
                    key={bar}
                    style={{ height: `${height}px` }}
                    className="w-1 bg-[#3C8B5C] dark:bg-[#6EE7B7] rounded-full transition-all duration-75"
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-end gap-2 relative">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-[#6B7268] dark:text-[#9CA3AF] hover:text-[#3C8B5C] dark:hover:text-[#6EE7B7] hover:bg-[#3C8B5C]/5 dark:hover:bg-[#6EE7B7]/5 rounded-xl transition-colors shrink-0"
            title="Attach photo"
          >
            <ImageIcon className="w-6 h-6" />
          </button>
          <button 
            onClick={toggleRecording}
            className={`p-3 rounded-xl transition-colors shrink-0 ${isRecording ? 'text-[#D95F4B] dark:text-[#F87171] bg-[#D95F4B]/10 dark:bg-[#F87171]/10 animate-pulse' : 'text-[#6B7268] dark:text-[#9CA3AF] hover:text-[#3C8B5C] dark:hover:text-[#6EE7B7] hover:bg-[#3C8B5C]/5 dark:hover:bg-[#6EE7B7]/5'}`}
            title={isRecording ? "Stop recording" : "Record voice message"}
          >
            {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <div className="flex-1 bg-[#FAFAF7] dark:bg-[#121212] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-2xl overflow-hidden focus-within:border-[#3C8B5C] dark:focus-within:border-[#6EE7B7] focus-within:ring-1 focus-within:ring-[#3C8B5C] dark:focus-within:ring-[#6EE7B7] transition-all relative">
            <textarea 
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (!e.target.value) setIsAudioInput(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about your crops..."
              className="w-full max-h-32 min-h-[52px] bg-transparent p-3 resize-none focus:outline-none dark:text-[#FAFAF7] dark:placeholder-[#9CA3AF]"
              rows={1}
            />
          </div>
          <button 
            onClick={() => sendMessage()}
            disabled={(!input.trim() && !imagePreview) || isLoading}
            className="p-3 bg-[#3C8B5C] dark:bg-[#6EE7B7] text-white dark:text-[#121212] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2c6b45] dark:hover:bg-[#34D399] transition-colors shrink-0 shadow-sm shadow-[#3C8B5C]/20 dark:shadow-[#6EE7B7]/10"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Expert Consultation Modal */}
      {showExpertModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl w-full max-w-md p-6 shadow-xl border border-[#6B7268]/10 dark:border-[#FAFAF7]/10 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-[#1E2320] dark:text-[#FAFAF7]">
                <Headset className="w-6 h-6 text-[#3C8B5C] dark:text-[#6EE7B7]" />
                Consult Expert
              </h2>
              <button 
                onClick={() => setShowExpertModal(false)}
                className="text-[#6B7268] dark:text-[#9CA3AF] hover:text-[#D95F4B] p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-[#6B7268] dark:text-[#9CA3AF] mb-4">
              Describe your issue or question in detail. This will be sent directly to our agricultural experts at the Kendra for review.
            </p>
            <textarea
              value={expertIssue}
              onChange={(e) => setExpertIssue(e.target.value)}
              placeholder="e.g. The leaves of my wheat crop are turning yellow, and I see small spots..."
              className="w-full bg-[#FAFAF7] dark:bg-[#121212] border border-[#6B7268]/20 dark:border-[#FAFAF7]/20 rounded-xl px-4 py-3 focus:outline-none focus:border-[#3C8B5C] dark:focus:border-[#6EE7B7] dark:text-[#FAFAF7] resize-none h-32 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowExpertModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-[#6B7268] dark:text-[#9CA3AF] hover:bg-[#6B7268]/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitExpertCase}
                disabled={!expertIssue.trim()}
                className="px-6 py-2 bg-[#3C8B5C] dark:bg-[#6EE7B7] text-white dark:text-[#121212] rounded-xl font-medium hover:bg-[#2c6b45] dark:hover:bg-[#34D399] transition-colors disabled:opacity-50"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
