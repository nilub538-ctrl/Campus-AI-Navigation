import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Navigation, 
  Sparkles, 
  MapPin, 
  Clock, 
  HelpCircle, 
  X, 
  Volume2 
} from 'lucide-react';
import { ChatMessage, CampusLocation } from '../types/campus';
import { askCampusAssistant } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface AIAssistantDrawerProps {
  onStartNavigation: (location: CampusLocation) => void;
  userLocationNodeId: string;
  allLocations: CampusLocation[];
  onClose?: () => void;
  isFullPage?: boolean;
  isSatelliteTheme?: boolean;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  onStartNavigation,
  userLocationNodeId,
  allLocations,
  onClose,
  isFullPage = false,
  isSatelliteTheme = true,
}) => {
  const { t, language, locName, floorLabel } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'assistant',
      text: t.aiWelcomeMessage,
      timestamp: 'Just now',
    },
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Update initial welcome message when language changes if only welcome is present
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [{
          id: 'welcome',
          sender: 'assistant',
          text: t.aiWelcomeMessage,
          timestamp: 'Just now',
        }];
      }
      return prev;
    });
  }, [language, t.aiWelcomeMessage]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQueries = t.aiSuggestedQueries;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || query).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const response = await askCampusAssistant(q, userLocationNodeId);
      
      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        locationCard: response.matchedLocation || undefined,
        suggestedAction: response.matchedLocation ? {
          type: 'navigate',
          label: `Navigate to ${response.matchedLocation.name}`,
          locationId: response.matchedLocation.id,
        } : undefined,
        routePreview: response.matchedLocation ? {
          destinationName: response.matchedLocation.name,
          building: response.matchedLocation.building,
          floor: response.matchedLocation.floor,
          distance: response.distanceMeters || 380,
          walkingTimeMinutes: response.walkingTimeMinutes || 5,
        } : undefined,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'assistant',
          text: 'I could not connect to the campus assistant service right now. Please try asking again or browse the campus map directly.',
          timestamp: 'Now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Voice Speech Recognition Handler
  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
          setIsListening(false);
          handleSend(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
      } catch {
        setIsListening(false);
      }
    } else {
      setQuery('Where is the MCA classroom?');
      setIsListening(false);
    }
  };

  const isSat = isSatelliteTheme;

  return (
    <div 
      className={`flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
        isSat
          ? 'bg-[#121924] border-white/10 text-slate-100'
          : 'bg-white border-[#dadce0] text-[#202124]'
      } ${
        isFullPage ? 'h-full min-h-[600px]' : 'h-[600px] max-h-[85vh]'
      }`}
    >
      {/* Header */}
      <div 
        className={`px-4 py-3.5 flex items-center justify-between border-b ${
          isSat
            ? 'bg-[#182332] border-white/10'
            : 'bg-[#f8f9fa] border-[#dadce0]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1a73e8] to-[#059669] flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-xs font-bold font-['Google_Sans',sans-serif] flex items-center gap-1.5 ${
              isSat ? 'text-white' : 'text-[#202124]'
            }`}>
              CampusNav AI Assistant
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                isSat ? 'bg-blue-500/20 text-[#38bdf8]' : 'bg-[#e8f0fe] text-[#1967d2]'
              }`}>
                Satellite AI
              </span>
            </h3>
            <p className={`text-[11px] ${isSat ? 'text-slate-400' : 'text-[#5f6368]'}`}>
              Natural language campus navigation & finder
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className={`p-1 rounded-full transition-colors ${
              isSat ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-[#5f6368] hover:text-[#202124] hover:bg-[#e8eaed]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggested Chips Bar */}
      <div 
        className={`px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-b ${
          isSat
            ? 'bg-[#10151f] border-white/10'
            : 'bg-[#ffffff] border-[#f1f3f4]'
        }`}
      >
        <span className={`text-[10px] font-semibold uppercase shrink-0 flex items-center gap-1 ${
          isSat ? 'text-slate-400' : 'text-[#5f6368]'
        }`}>
          <Sparkles className="w-3 h-3 text-[#38bdf8]" /> Try:
        </span>
        {suggestedQueries.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(item)}
            className={`text-[11px] px-2.5 py-1 rounded-full border whitespace-nowrap transition-colors shrink-0 ${
              isSat
                ? 'text-slate-300 bg-white/5 border-white/10 hover:bg-white/15 hover:text-white'
                : 'text-[#3c4043] bg-[#f8f9fa] hover:bg-[#e8f0fe] hover:text-[#1a73e8] border-[#dadce0]'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#1a73e8] text-white rounded-br-xs shadow-md'
                  : isSat
                    ? 'bg-[#182332] text-slate-100 border border-white/10 rounded-bl-xs'
                    : 'bg-[#f1f3f4] text-[#202124] rounded-bl-xs'
              }`}
            >
              <p className="whitespace-pre-line font-medium">{msg.text}</p>
            </div>

            {/* Structured Location Card Attachment if found */}
            {msg.locationCard && (
              <div 
                className={`mt-2 w-full max-w-[85%] rounded-xl border p-3 space-y-2 shadow-lg ${
                  isSat
                    ? 'bg-[#10151f] border-white/15 text-slate-100'
                    : 'bg-white border-[#dadce0] text-[#202124]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isSat ? 'bg-blue-500/20 text-[#38bdf8]' : 'bg-[#e8f0fe] text-[#1a73e8]'
                  }`}>
                    {msg.locationCard.category}
                  </span>
                  <span className={`text-[10px] font-mono ${isSat ? 'text-slate-400' : 'text-[#5f6368]'}`}>
                    {msg.locationCard.room || msg.locationCard.code}
                  </span>
                </div>

                <div>
                  <h4 className={`text-xs font-bold ${isSat ? 'text-white' : 'text-[#202124]'}`}>
                    {msg.locationCard.name}
                  </h4>
                  <p className={`text-[11px] ${isSat ? 'text-slate-400' : 'text-[#5f6368]'}`}>
                    {msg.locationCard.building} · Floor {msg.locationCard.floor === 0 ? 'Ground' : msg.locationCard.floor}
                  </p>
                </div>

                {msg.routePreview && (
                  <div 
                    className={`flex items-center justify-between text-[11px] p-2 rounded-lg border ${
                      isSat
                        ? 'bg-[#182332] border-white/10 text-slate-200'
                        : 'bg-[#f8f9fa] border-[#e8eaed] text-[#3c4043]'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#ef4444]" />
                      {t.distance}: <strong className={isSat ? 'text-white' : ''}>{msg.routePreview.distance}m</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#38bdf8]" />
                      {t.walk}: <strong className={isSat ? 'text-white' : ''}>{msg.routePreview.walkingTimeMinutes} {t.minWalk}</strong>
                    </span>
                  </div>
                )}

                <button
                  onClick={() => onStartNavigation(msg.locationCard!)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#1a73e8] hover:bg-[#155724] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{t.navigateHere}</span>
                </button>
              </div>
            )}

            <span className={`text-[10px] mt-1 px-1 ${isSat ? 'text-slate-500' : 'text-[#80868b]'}`}>
              {msg.timestamp}
            </span>
          </div>
        ))}

        {loading && (
          <div 
            className={`flex items-center gap-2 text-xs p-3 rounded-2xl w-fit ${
              isSat ? 'bg-[#182332] text-slate-300 border border-white/10' : 'bg-[#f8f9fa] text-[#5f6368]'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38bdf8]"></span>
            </span>
            <span>CampusNav AI is analyzing satellite paths & classrooms...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div 
        className={`p-3 border-t ${
          isSat ? 'bg-[#10151f] border-white/10' : 'bg-white border-[#dadce0]'
        }`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.aiInputPlaceholder}
              className={`w-full pl-3 pr-10 py-2.5 text-xs rounded-full border focus:outline-none transition-colors ${
                isSat
                  ? 'bg-[#182332] text-slate-100 placeholder-slate-400 border-white/10 focus:border-[#38bdf8]'
                  : 'bg-[#f1f3f4] text-[#202124] placeholder-[#5f6368] border-transparent focus:bg-white focus:border-[#1a73e8]'
              }`}
            />

            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${
                isListening
                  ? 'bg-[#ea4335] text-white animate-pulse'
                  : isSat
                    ? 'text-slate-400 hover:text-white'
                    : 'text-[#5f6368] hover:text-[#202124]'
              }`}
              title="Speak query"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="w-9 h-9 rounded-full bg-[#1a73e8] hover:bg-[#155724] disabled:opacity-50 text-white flex items-center justify-center shrink-0 shadow-md transition-colors"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
