import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  ShieldCheck,
  AlertCircle,
  CornerDownLeft,
} from 'lucide-react';
import { LanguageCode } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  isSimulatedFallback?: boolean;
  timestamp: string;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, currentUser, farms, crops, tasks, sensors, t } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text:
        language === 'kn'
          ? `ನಮಸ್ಕಾರ ${currentUser.name}! ನಾನು ರೈತ ಸಾಥಿ AI ಸಹಾಯಕ. ನಿಮ್ಮ ಕೃಷಿ, ಬೆಳೆ ರಕ್ಷಣೆ, ಹನಿ ನೀರಾವರಿ, ರಸಗೊಬ್ಬರ ನಿರ್ವಹಣೆ ಅಥವಾ ಮಂಡಿ ಬೆಲೆಗಳ ಕುರಿತು ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ. ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ.`
          : language === 'hi'
          ? `नमस्ते ${currentUser.name}! मैं किसान साथी AI सहायक हूँ। आपकी फसल, जैविक खाद, सिंचाई या मंडी भाव से जुड़े सवालों के लिए मैं हमेशा तैयार हूँ।`
          : `Hello ${currentUser.name}! I am Farmer Saathi AI. I can guide you on crop management, organic Jeevamrutha, irrigation schedules, or government schemes based on your active plots in Mandya. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Suggested quick prompts
  const suggestedQueries = [
    { en: 'When should I irrigate my crops?', kn: 'ನನ್ನ ಬೆಳೆಗೆ ನೀರು ಯಾವಾಗ ಹಾಯಿಸಬೇಕು?', hi: 'फसल को पानी कब देना चाहिए?' },
    { en: 'How to prepare Jeevamrutha organic fertilizer?', kn: 'ಜೀವಾಮೃತ ಸಾವಯವ ಗೊಬ್ಬರ ತಯಾರಿಸುವುದು ಹೇಗೆ?', hi: 'जीवामृत जैविक खाद कैसे बनाएं?' },
    { en: 'How can I reduce chemical fertilizer expenses?', kn: 'ರಸಗೊಬ್ಬರದ ವೆಚ್ಚವನ್ನು ಹೇಗೆ ಕಡಿಮೆ ಮಾಡುವುದು?', hi: 'रासायनिक खाद का खर्च कैसे घटाएं?' },
    { en: 'Explain Karnataka Raitha Siri scheme in simple terms.', kn: 'ಕರ್ನಾಟಕ ರೈತ ಸಿರಿ ಯೋಜನೆಯನ್ನು ಸರಳವಾಗಿ ವಿವರಿಸಿ.', hi: 'कर्नाटक रैथा सिरी योजना के बारे में बताएं।' },
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Speech Recognition initialization
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
        setIsListening(false);
      }
    }
  };

  const handleSpeak = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown asterisks for natural reading
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Attempt to match language
    utterance.lang = language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    // Build context
    const farm = farms[0];
    const farmContext = {
      farmerName: currentUser.name,
      location: `${farm?.village || 'Keragodu'}, ${currentUser.district}`,
      totalLandAcres: farm?.totalAreaAcres || 5.5,
      currentCrops: crops.map(c => `${c.cropName} (${c.variety}, ${c.currentStage})`).join(', '),
      soilTypes: farm?.plots.map(p => `${p.name}: ${p.soilType}`).join(', '),
      irrigationMethods: farm?.plots.map(p => `${p.name}: ${p.irrigationType}`).join(', '),
      moistureTelemetry: sensors.map(s => `${s.plotName}: ${s.soilMoisturePercent}%`).join(', '),
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          farmContext,
        }),
      });

      const data = await response.json();

      const assistantMsg: Message = {
        id: `msg-reply-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Could not process agricultural response.',
        isSimulatedFallback: Boolean(data.isSimulatedFallback),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          text: '🌾 I experienced a temporary network hiccup. Please ask again or consult your local Krishi Vigyan Kendra.',
          isSimulatedFallback: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-stone-900/40 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-xl h-full sm:h-[92vh] sm:rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-4 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/20">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">Farmer Saathi AI</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  Agri Advisor
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                Grounding in {currentUser.district} soil & crop context
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switch */}
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as LanguageCode)}
              className="bg-white/15 text-white text-xs font-bold py-1 px-2 rounded-lg border border-white/20 focus:outline-hidden cursor-pointer"
            >
              <option value="en" className="text-stone-900">EN</option>
              <option value="kn" className="text-stone-900">ಕನ್ನಡ</option>
              <option value="hi" className="text-stone-900">हिंदी</option>
            </select>

            <button
              onClick={() => {
                if (speakingMessageId) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Advisory Safety Disclaimer */}
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-200/60 text-[11px] text-amber-900 flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Educational agronomic guidance. Distinguishes estimates from verified facts.</span>
          </span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                  🌾
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-tr-none'
                    : 'bg-white text-stone-800 rounded-tl-none border border-stone-200/80'
                }`}
              >
                <div className="space-y-1">
                  {msg.text.split('\n').map((line, lIdx) => {
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={lIdx} className="leading-relaxed">
                        {parts.map((part, pIdx) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return (
                              <strong key={pIdx} className={msg.sender === 'user' ? 'font-bold text-white' : 'font-bold text-stone-900'}>
                                {part.slice(2, -2)}
                              </strong>
                            );
                          }
                          return part;
                        })}
                      </p>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-stone-100/60 text-[10px] text-stone-400">
                  <span>{msg.timestamp}</span>

                  {msg.sender === 'assistant' && (
                    <div className="flex items-center gap-2">
                      {msg.isSimulatedFallback && (
                        <span className="text-stone-400 italic font-medium">
                          Simulated Agro-Domain
                        </span>
                      )}
                      <button
                        onClick={() => handleSpeak(msg.text, msg.id)}
                        className={`p-1 rounded-md transition-colors ${
                          speakingMessageId === msg.id
                            ? 'text-emerald-700 bg-emerald-100'
                            : 'hover:text-stone-700'
                        }`}
                        title="Read aloud"
                      >
                        {speakingMessageId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                  {currentUser.name.charAt(0)}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 text-xs shadow-xs animate-pulse">
                🌾
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-stone-200 shadow-xs text-xs text-stone-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 font-medium">Farmer Saathi is consulting agronomic data...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        <div className="p-3 bg-white border-t border-stone-100 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {suggestedQueries.map((q, idx) => {
            const queryLabel = language === 'kn' ? q.kn : language === 'hi' ? q.hi : q.en;
            return (
              <button
                key={idx}
                onClick={() => handleSend(queryLabel)}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-stone-200 text-[11px] font-medium text-stone-700 whitespace-nowrap transition-colors shrink-0"
              >
                {queryLabel}
              </button>
            );
          })}
        </div>

        {/* Input Footer */}
        <div className="p-3.5 bg-white border-t border-stone-200 shrink-0">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-md ring-2 ring-rose-300'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Click to speak your farming query'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              placeholder={
                isListening
                  ? t('speechListening')
                  : language === 'kn'
                  ? 'ಕೃಷಿ ಪ್ರಶ್ನೆ ಕೇಳಿ...'
                  : language === 'hi'
                  ? 'कृषि सवाल यहाँ लिखें...'
                  : 'Ask about irrigation, organic compost, pest shields...'
              }
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
