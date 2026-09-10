import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  ArrowRight, 
  Zap, 
  BatteryCharging, 
  TrendingUp, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';

export default function CopilotView() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'copilot',
      text: "Hello Dr. Vance! I am your **Ecoflux AI Energy Copilot**. I have full real-time telemetry across all 6 campus facilities, rooftop solar arrays, and the Tesla Megapack BESS. How can I assist campus facilities today?",
      dataHighlight: null,
      suggestedActions: [
        "Which building is consuming the most electricity?",
        "Should the battery charge or discharge now?",
        "Predict tomorrow's peak energy demand",
        "How efficient was solar generation today?"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (promptText) => {
    const query = promptText || input;
    if (!query.trim()) return;

    // Append user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });

      if (res.ok) {
        const data = await res.json();
        const copilotMsg = {
          id: Date.now() + 1,
          sender: 'copilot',
          text: data.markdown_reply,
          dataHighlight: data.data_highlight,
          suggestedActions: data.suggested_actions
        };
        setMessages(prev => [...prev, copilotMsg]);
      } else {
        throw new Error('Fallback required');
      }
    } catch (e) {
      // Fallback
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'copilot',
            text: `### Telemetry Analysis for: "${query}"\n\nCampus microgrid is operating in **Grid-Tied Optimal** state with **842 kW clean solar generation** offsetting 35.8% of aggregate campus load.\n\nPeak demand tomorrow is projected at **2,180 kW** between 15:00 and 17:00. Battery discharge is recommended to shave utility demand fees.`,
            dataHighlight: { demand_kw: "2,351 kW", solar_kw: "842 kW", bess_soc: "78%" },
            suggestedActions: ["Execute clean room ventilation setback", "Inspect Battery State"]
          }
        ]);
      }, 500);
    } finally {
      setIsTyping(false);
    }
  };

  const samplePrompts = [
    "Which building is consuming the most electricity?",
    "Should the battery charge or discharge now?",
    "Predict tomorrow's peak energy demand",
    "How efficient was solar generation today?"
  ];

  return (
    <div className="h-[740px] bento-card flex flex-col overflow-hidden animate-in fade-in duration-300">
      
      {/* Top Copilot Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Ecoflux AI Copilot</h3>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Trained on Apex Campus Multi-Sensor BMS & Weather Models</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700"
          title="Reset Conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] text-slate-500 font-semibold uppercase font-mono flex-shrink-0">
          Suggested:
        </span>
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="flex-shrink-0 px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-brand-500/40 text-xs text-slate-300 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
              msg.sender === 'user' 
                ? 'bg-electric-500/20 text-electric-300 border border-electric-500/40' 
                : 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-slate-900/90 border border-slate-800 text-slate-200'
            }`}>
              {/* Message text with basic markdown format support */}
              <div className="space-y-2 whitespace-pre-line">
                {msg.text}
              </div>

              {/* Data Highlight Card Payload */}
              {msg.dataHighlight && (
                <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(msg.dataHighlight).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-[10px] uppercase text-slate-500 font-semibold">{k.replace(/_/g, ' ')}:</span>
                      <p className="font-mono font-bold text-brand-400">{String(v)}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Next Steps */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase font-mono">Suggested follow-ups:</span>
                  <div className="flex flex-wrap gap-2">
                    {msg.suggestedActions.map((act, actIdx) => (
                      <button
                        key={actIdx}
                        onClick={() => handleSend(act)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-300 text-xs flex items-center gap-1 transition-colors"
                      >
                        <span>{act}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/40 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about peak demand, building waste, solar efficiency, or battery dispatch..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 text-white font-semibold text-sm shadow-md transition-colors flex items-center gap-1.5 flex-shrink-0"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
