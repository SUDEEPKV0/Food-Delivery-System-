import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Mic, MicOff, Home, ShoppingCart, ChevronLeft, Star, Sparkles, Zap, Heart } from 'lucide-react';
import Header from './Header';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FoodItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  tags: string[];
  cuisine: string;
  lang?: string;
  location?: { lat: number; lng: number };
  heatLevel?: 'mild'|'medium'|'hot'|'extra';
  veg?: boolean;
  deliveryMins?: number;
  popularity?: number;
  seasonal?: string[];
  region?: string;
  nutrition?: string[];
}

interface VoiceSearchPageProps {
  addToCart: (item: any) => void;
  cartCount: number;
  onCartClick: () => void;
  removeFromCart?: (item: any) => void;
  clearCart?: () => void;
  checkout?: () => void;
  showCart?: () => void;
  removeLast?: () => void;
}

// Larger enriched dataset used by the assistant
const searchResults: FoodItem[] = [
  { id: 'f1', name: 'Paneer Butter Masala', price: 180, rating: 4.8, image: 'https://images.unsplash.com/photo-1714611626323-5ba6204453be?w=800', tags: ['buttery','rich','comfort'], cuisine: 'North Indian', lang: 'hi', location: { lat: 12.9716, lng: 77.5946 }, heatLevel: 'mild', veg: true, deliveryMins: 30, popularity: 92, seasonal: ['winter'], region: 'North', nutrition: ['protein','carbs'] },
  { id: 'f2', name: 'Chicken Biryani', price: 260, rating: 4.9, image: 'https://images.unsplash.com/photo-1608032040435-28f8f7b4b37b?w=800', tags: ['spicy','rice','popular'], cuisine: 'Hyderabadi', lang: 'en', location: { lat: 17.3850, lng: 78.4867 }, heatLevel: 'hot', veg: false, deliveryMins: 35, popularity: 98, seasonal: ['all'], region: 'South', nutrition: ['protein'] },
  { id: 'f3', name: 'Dal Tadka', price: 140, rating: 4.5, image: 'https://images.unsplash.com/photo-1605475128701-bd2f5c5b6b1e?w=800', tags: ['light','comfort'], cuisine: 'North Indian', lang: 'en', location: { lat: 13.0827, lng: 80.2707 }, heatLevel: 'mild', veg: true, deliveryMins: 25, popularity: 75, seasonal: ['all'], region: 'South', nutrition: ['protein','fiber'] },
  { id: 'f4', name: 'Gulab Jamun', price: 120, rating: 4.6, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', tags: ['sweet','dessert'], cuisine: 'Indian', lang: 'hi', location: { lat: 28.7041, lng: 77.1025 }, heatLevel: 'mild', veg: true, deliveryMins: 15, popularity: 88, seasonal: ['festive'], region: 'North', nutrition: ['carbs'] },
  { id: 'f5', name: 'Baklava', price: 220, rating: 4.4, image: 'https://images.unsplash.com/photo-1604908177522-9e5a6b8c7f5f?w=800', tags: ['sweet','nuts'], cuisine: 'Middle Eastern', lang: 'ar', location: { lat: 25.276987, lng: 55.296249 }, heatLevel: 'mild', veg: true, deliveryMins: 40, popularity: 70, seasonal: ['all'], region: 'Middle East', nutrition: ['carbs','fat'] },
  { id: 'f6', name: 'Paneer Butter Fry', price: 200, rating: 4.5, image: 'https://images.unsplash.com/photo-1543353071-087092ec3930?w=800', tags: ['buttery','paneer'], cuisine: 'North Indian', lang: 'hi', location: { lat: 19.0760, lng: 72.8777 }, heatLevel: 'medium', veg: true, deliveryMins: 28, popularity: 85, seasonal: ['all'], region: 'West', nutrition: ['protein'] },
  { id: 'f7', name: 'Hyderabadi Dum Biryani', price: 300, rating: 4.95, image: 'https://images.unsplash.com/photo-1604908177422-abcdef?w=800', tags: ['spicy','dum','rice','popular'], cuisine: 'Hyderabadi', lang: 'en', location: { lat: 17.3850, lng: 78.4867 }, heatLevel: 'hot', veg: false, deliveryMins: 45, popularity: 99, seasonal: ['all'], region: 'South', nutrition: ['protein'] },
  { id: 'f8', name: 'Masala Dosa', price: 120, rating: 4.7, image: 'https://images.unsplash.com/photo-1604908177123-xyz?w=800', tags: ['crispy','savory','south indian'], cuisine: 'South Indian', lang: 'ta', location: { lat: 13.0827, lng: 80.2707 }, heatLevel: 'medium', veg: true, deliveryMins: 20, popularity: 90, seasonal: ['all'], region: 'South', nutrition: ['carbs'] },
  { id: 'f9', name: 'Jalebi', price: 90, rating: 4.3, image: 'https://images.unsplash.com/photo-1544025162-jalebi?w=800', tags: ['sweet','dessert'], cuisine: 'Indian', lang: 'hi', location: { lat: 22.5726, lng: 88.3639 }, heatLevel: 'mild', veg: true, deliveryMins: 10, popularity: 80, seasonal: ['festive'], region: 'East', nutrition: ['carbs'] },
  { id: 'f10', name: 'Falafel Wrap', price: 160, rating: 4.2, image: 'https://images.unsplash.com/photo-1544025162-falafel?w=800', tags: ['vegan','wrap','middle eastern'], cuisine: 'Middle Eastern', lang: 'ar', location: { lat: 25.276987, lng: 55.296249 }, heatLevel: 'mild', veg: true, deliveryMins: 30, popularity: 65, seasonal: ['all'], region: 'Middle East', nutrition: ['protein','fiber'] },
];

export default function VoiceSearchPage({ addToCart, cartCount, onCartClick, removeFromCart, clearCart, checkout, showCart, removeLast }: VoiceSearchPageProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [detectedLang, setDetectedLang] = useState<string>('en');
  const [intent, setIntent] = useState<string | null>(null);
  const [tone, setTone] = useState<string | null>(null);
  const [commandCategory, setCommandCategory] = useState<string | null>(null);
  const [conversationPrompt, setConversationPrompt] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [autoListen, setAutoListen] = useState(false);
  const [themeMode, setThemeMode] = useState<'light'|'dark'|'gold'|'neon'>('light');
  const [history, setHistory] = useState<Array<{from:'user'|'assistant', text:string}>>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => JSON.parse(localStorage.getItem('yumm_recent') || '[]'));
  const [analyserData, setAnalyserData] = useState<number[]>(Array.from({length:12}).map(()=>0));
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [sheetItem, setSheetItem] = useState<FoodItem | null>(null);
  const [filters, setFilters] = useState<Record<string,boolean>>({ spicy:false, sweets:false, breakfast:false, vegOnly:false });
  const [suggestionsVisible, setSuggestionsVisible] = useState(true);
  const recognitionRef = useRef<any>(null);
  const pendingRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const autoListenTimer = useRef<number | null>(null);
  const [emotionState, setEmotionState] = useState<'happy'|'confused'|'thinking'|'warning'|'neutral'>('neutral');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [recentCommands, setRecentCommands] = useState<string[]>(() => JSON.parse(localStorage.getItem('yumm_commands') || '[]'));
  const [navCards, setNavCards] = useState<Array<{label:string, icon:string}>>([]);
  const mediaPermissionRef = useRef<boolean>(false);
  const [micHintIndex, setMicHintIndex] = useState(0);

  const toggleListening = () => {
    if (!isListening) startRecognition();
    else stopRecognition();
  };

  /* ---------------------- Helper components (in-file) ---------------------- */
  const AssistantAvatar: React.FC<{ emotion: string; speaking?: boolean }> = ({ emotion, speaking }) => {
    const emoji = emotion === 'happy' ? '😊' : emotion === 'confused' ? '🤔' : emotion === 'thinking' ? '💭' : emotion === 'warning' ? '⚠️' : '🙂';
    return (
      <div className="fixed right-6 bottom-6 z-50">
        <motion.div animate={speaking ? { scale: [1, 1.06, 1] } : { scale: 1 }} transition={{ duration: 0.9, repeat: Infinity }} className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center">
          <div className="text-2xl">{emoji}</div>
        </motion.div>
        <div className="mt-2 text-sm text-[#5E5E5E] text-right">Assistant</div>
      </div>
    );
  };

  const WaveformBars: React.FC<{ bars: number[] }> = ({ bars }) => {
    return (
      <div className="flex items-end gap-1 w-full max-w-xs mx-auto mt-4">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 h-12 flex items-end">
            <motion.div
              initial={{ scaleY: 0.12 }}
              animate={{ scaleY: Math.max(0.12, b * 1.2) }}
              transition={{ ease: 'easeOut', duration: 0.12 }}
              className="w-full rounded-full bg-gradient-to-b from-[#FF5200] to-[#FF7A33] origin-bottom"
              style={{ transformOrigin: 'bottom' }}
            />
          </div>
        ))}
      </div>
    );
  };

  const SuggestionsCarousel: React.FC<{ items: string[] }> = ({ items }) => {
    return (
      <div className="overflow-x-auto py-3">
        <div className="flex gap-3 px-2 snap-x snap-mandatory overflow-x-auto">
          {items.map((it, idx) => {
            const img = searchResults[idx % searchResults.length]?.image;
            return (
              <motion.button key={idx} onClick={() => handleTextQuery(it)} whileHover={{ scale: 1.03 }} aria-label={`Suggestion ${it}`} className="min-w-[170px] p-3 rounded-xl bg-white shadow-md border-0 flex flex-col items-start snap-start">
                <div className="w-full h-24 rounded-md overflow-hidden mb-2">
                  <ImageWithFallback src={img} alt={it} className="w-full h-full object-cover" />
                </div>
                <div className="text-sm font-semibold text-[#1C1C1C]">{it}</div>
                <div className="text-xs text-[#5E5E5E] mt-1">Recommended</div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  const FilterPills: React.FC<{ filters: string[]; onRemove: (f:string)=>void }> = ({ filters, onRemove }) => (
    <div className="flex gap-2 flex-wrap">
      {filters.map(f => (
        <div key={f} className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FF5200] to-[#FF7A33] text-white text-sm flex items-center gap-2">
          <span>{f}</span>
          <button aria-label={`remove ${f}`} onClick={() => onRemove(f)} className="text-xs">✕</button>
        </div>
      ))}
    </div>
  );

  const ResponseBubble: React.FC<{ title?: string; children?: any; onMore?: ()=>void }> = ({ title, children, onMore }) => (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-white border shadow-sm">
      {title && <div className="text-sm font-semibold mb-2">{title}</div>}
      <div className="text-sm text-[#5E5E5E]">{children}</div>
      {onMore && <div className="mt-3 flex justify-end"><Button size="sm" onClick={onMore} className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33]">More Info</Button></div>}
    </motion.div>
  );

  const BottomSheet: React.FC<{ item: FoodItem | null; onClose: ()=>void; onAdd: (i:FoodItem)=>void }> = ({ item, onClose, onAdd }) => {
    if (!item) return null;
    return (
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed left-0 right-0 bottom-0 z-40 bg-white border-t rounded-t-xl p-4 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex gap-4">
          <div className="w-28 h-28 rounded-lg overflow-hidden"><ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover"/></div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{item.name}</div>
                <div className="text-sm text-[#5E5E5E]">{item.cuisine} · {item.region}</div>
              </div>
              <div className="text-xl text-[#FF5200]">₹{item.price}</div>
            </div>
            <div className="mt-2 text-sm">Calories: approx. {(item.price * 4).toFixed(0)} kcal • Spiciness: {item.heatLevel}</div>
            <div className="mt-3 flex gap-2">
              <Button onClick={() => { onAdd(item); onClose(); }} className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33]">Add to Cart</Button>
              <Button variant="ghost" onClick={onClose}>Close</Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const QuickActions: React.FC = () => (
    <div className="flex gap-2 flex-wrap mt-3">
      {['Search Nearby Restaurants','Open Favourites','Order Again','Clear Cart','Show My Orders'].map((q) => (
        <Button key={q} size="sm" onClick={() => {
          if (q === 'Clear Cart') { if (clearCart) { try { clearCart(); toast.success('Cart cleared'); } catch(e){ toast.error('Clear cart failed'); } } else { toast('Clear cart (simulated)'); } return; }
          if (q === 'Open Favourites') { toast('Opening favourites (simulated)'); return; }
          if (q === 'Search Nearby Restaurants') {
            if (location) {
              setConversationPrompt('Searching nearby restaurants...');
              const nearby = searchResults
                .map(s => ({ s, d: s.location ? distanceBetween(location, s.location) ?? 9999 : 9999 }))
                .filter(x => x.d <= 50)
                .map(x => x.s);
              setResults(nearby.slice(0,8));
            } else { toast('Location not available'); }
            return;
          }
          if (q === 'Order Again') { toast('Re-ordering last order (simulated)'); return; }
          if (q === 'Show My Orders') { toast('Opening orders (simulated)'); return; }
        }} className="rounded-full bg-gradient-to-r from-[#FF5200] to-[#FF7A33]">{q}</Button>
      ))}
    </div>
  );

  // persist recent searches/commands
  useEffect(() => { localStorage.setItem('yumm_recent', JSON.stringify(recentSearches)); }, [recentSearches]);
  useEffect(() => { localStorage.setItem('yumm_commands', JSON.stringify(recentCommands)); }, [recentCommands]);

  // Cycle floating mic hint messages
  useEffect(() => {
    const msgs = [
      "Say 'Hey YummPort' to start",
      "Try: Order 2 biryani",
      "Ask: Show spicy foods",
      "Try: What’s trending today?",
    ];
    const id = setInterval(() => setMicHintIndex(i => (i + 1) % msgs.length), 3500);
    return () => clearInterval(id);
  }, []);

  // Initialize geolocation (for location-aware responses)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation(null),
        { timeout: 5000 }
      );
    }
  }, []);

  // Start SpeechRecognition (with cross-browser checks)
  const startRecognition = async () => {
    // Prefer browser SpeechRecognition for lower latency; fallback to MediaRecorder+remote STT
    const SpeechRecognition: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recognitionRef.current = recog;
      recog.lang = 'en-US';
      recog.interimResults = true;
      recog.maxAlternatives = 3;

      recog.onstart = () => {
        setIsListening(true);
        setTranscript('');
        toast.success('Listening... Speak now!');
      };

      // try to start analyser for visual waveform (separate stream)
      try {
        const astream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // keep small separate stream solely for analyser
        startAnalyser(astream);
        // do not close astream here; store to mediaStreamRef so stop can clean
        mediaStreamRef.current = astream;
      } catch (e) {
        // ignore if user denies
      }

      recog.onerror = (e: any) => {
        setIsListening(false);
        toast.error('Voice recognition error');
      };

      recog.onresult = (event: any) => {
        // build interim & final transcript
        const parts: string[] = [];
        for (let i = 0; i < event.results.length; i++) {
          const alt = event.results[i][0];
          parts.push(alt.transcript);
          // capture confidence if available
          if (typeof alt.confidence === 'number') setConfidence(Math.round(alt.confidence * 100));
        }
        const text = parts.join(' ');
        setTranscript(text);
        const dt = detectTone(text);
        setDetectedLang(detectLanguage(text));
        setTone(dt);
        setEmotionState(detectEmotionFromTone(dt));
        setCommandCategory(guessCommandCategory(text));
        // if final, process
        const last = event.results[event.results.length - 1];
        if (last.isFinal) {
          setHistory(h => [...h, { from: 'user', text }]);
          setRecentSearches(rs => [text, ...rs.filter(r=>r!==text)].slice(0,10));
          setRecentCommands(rc => [text, ...rc.filter(c=>c!==text)].slice(0,12));
          // auto-wake on wake phrase
          if (/hey yummport/i.test(text)) {
            setConversationPrompt('Yes? How can I help?');
            pendingRef.current = { type: 'wake' };
            setIsListening(true);
            return;
          }
          const parsed = parseIntent(text.toLowerCase());
          setIntent(parsed.intent);
          handleParsedIntent(parsed, text);
          setIsListening(false);
        }
      };

      recog.onend = () => setIsListening(false);
      try { recog.start(); } catch (e) {}
      return;
    }

    // Fallback: MediaRecorder -> send to server STT endpoint (if configured)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mr = new (window as any).MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      const chunks: Blob[] = [];
      mr.ondataavailable = (ev: any) => chunks.push(ev.data);
      mr.onstart = () => {
        setIsListening(true);
        setTranscript('');
        toast.success('Listening... (recording)');
      };
      mr.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        // send to STT endpoint if available
        const sttUrl = (import.meta as any).env?.VITE_STT_URL;
        if (sttUrl) {
          try {
            const form = new FormData();
            form.append('file', blob, 'voice.webm');
            const r = await fetch(sttUrl, { method: 'POST', body: form });
            const json = await r.json();
            const text = json?.text || json?.transcript || '';
            // record recent searches
            setRecentSearches(rs => [text, ...rs.filter(r=>r!==text)].slice(0,10));
            setTranscript(text);
            const dt = detectTone(text);
            setDetectedLang(detectLanguage(text));
            setTone(dt);
            setEmotionState(detectEmotionFromTone(dt));
            setHistory(h => [...h, { from: 'user', text }]);
            const parsed = parseIntent(text.toLowerCase());
            setIntent(parsed.intent);
            handleParsedIntent(parsed, text);
          } catch (err) {
            toast.error('STT request failed');
          }
        } else {
          toast('No STT endpoint configured. Enable `VITE_STT_URL` to use remote STT.');
        }
        // stop tracks
        mediaStreamRef.current?.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
        setIsListening(false);
      };
      mr.start();
      // stop after 4s by default to get a short sample
      setTimeout(() => { try { mr.stop(); } catch (e) {} }, 4000);
    } catch (err) {
      toast.error('Unable to access microphone');
    }
  };

  const stopRecognition = () => {
    const r = recognitionRef.current;
    if (r) {
      try { r.stop(); } catch (e) {}
    }
    // stop visual analyser and any temporary media streams
    try { stopAnalyser(); } catch (e) {}
    if (mediaStreamRef.current) {
      try { mediaStreamRef.current.getTracks().forEach(t => t.stop()); } catch(e) {}
      mediaStreamRef.current = null;
    }
    setIsListening(false);
  };

  // Audio analyser for waveform bars (uses WebAudio API)
  const startAnalyser = async (stream: MediaStream) => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current!;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        // reduce to 12 bars
        const step = Math.floor(dataArray.length / 12) || 1;
        const bars = Array.from({length:12}).map((_,i) => {
          const start = i*step;
          const slice = dataArray.slice(start, start+step);
          const avg = slice.reduce((a,b)=>a+b,0)/slice.length/255;
          return avg;
        });
        setAnalyserData(bars);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      // ignore analyser failures
    }
  };

  const stopAnalyser = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (analyserRef.current) { try { analyserRef.current.disconnect(); } catch (e) {} analyserRef.current = null; }
    if (audioCtxRef.current) { try { audioCtxRef.current.close(); } catch (e) {} audioCtxRef.current = null; }
    setAnalyserData(Array.from({length:12}).map(()=>0));
  };

  // Basic language detection via keywords — keeps it client-side
  const detectLanguage = (text: string) => {
    const t = text.toLowerCase();
    if (/\b(है|मैं|चाहिए|पानी|नमक)\b/.test(t)) return 'hi';
    if (/\b(அது|நான்|உங்களுக்கு|இது)\b/.test(t)) return 'ta';
    if (/\b(నేను|మీకు|ఇది)\b/.test(t)) return 'te';
    if (/[\u0600-\u06FF]/.test(t)) return 'ar';
    return 'en';
  };

  const detectTone = (text: string) => {
    const t = text.toLowerCase();
    if (/\b(hungry|starving|eat)\b/.test(t)) return 'hungry';
    if (/\b(confused|which|where)\b/.test(t)) return 'confused';
    if (/\b(angry|now|fast|hurry|urgent)\b/.test(t)) return 'urgent';
    return 'neutral';
  };

  const detectEmotionFromTone = (toneStr: string) => {
    if (toneStr === 'hungry') return 'happy';
    if (toneStr === 'confused') return 'confused';
    if (toneStr === 'urgent') return 'warning';
    return 'neutral';
  };

  // Parse intent from a transcript with simple patterns
  // Enhanced intent parsing supporting many conversational cases
  const parseIntent = (text: string) => {
    const t = text.toLowerCase();
    const out: any = { intent: 'search' };
    // special commands
    if (/\b(enable dark mode|dark mode|enable dark)\b/.test(t)) return { intent: 'theme', theme: 'dark' };
    if (/\b(gold theme|premium gold)\b/.test(t)) return { intent: 'theme', theme: 'gold' };
    if (/\b(neon mode|neon)\b/.test(t)) return { intent: 'theme', theme: 'neon' };
    if (/\b(scroll down|show more|next)\b/.test(t)) return { intent: 'scroll' };
    if (/\b(show|open) (beverages|drinks)\b/.test(t)) return { intent: 'category', category: 'beverages' };
    if (/\b(biryani|biryani section)\b/.test(t)) return { intent: 'category', category: 'biryani' };
    if (/\b(dessert|desserts)\b/.test(t)) return { intent: 'category', category: 'desserts' };

    // cart actions
    if (/\b(increase|add one|add another)\b/.test(t)) return { intent: 'increase' };
    if (/\b(remove last|remove last added|undo)\b/.test(t)) return { intent: 'remove_last' };
    if (/\b(show my cart|open cart|view cart)\b/.test(t)) return { intent: 'show_cart' };
    if (/\b(clear my cart|empty cart)\b/.test(t)) return { intent: 'clear_cart' };
    if (/\b(checkout now|checkout|place order now)\b/.test(t)) return { intent: 'checkout' };

    // order / quantity extraction
    if (/\b(order|add|place order|i want|i'd like|i want to order)\b/.test(t)) {
      out.intent = 'order';
      const qty = t.match(/(\d+)\s*(pieces|plate|plates|pcs|orders|x)?/);
      if (qty) out.quantity = parseInt(qty[1], 10);
    }

    // remove specific
    if (/\b(remove|delete)\b/.test(t) && /cart|item|pizza|biryani|paneer/.test(t)) {
      out.intent = 'remove';
    }

    // allergies
    const allergy = t.match(/allergic to ([a-zA-Z]+)/i);
    if (allergy) { out.intent = 'allergy'; out.allergen = allergy[1]; }

    // shipping/packaging
    if (/\b(ship to|shipping|pack|packaging|international)\b/.test(t)) { out.intent = 'shipping'; }

    // repeat/track/favorites
    if (/\brepeat my last order|repeat\b/.test(t)) return { intent: 'repeat' };
    if (/\btrack my order|track\b/.test(t)) return { intent: 'track' };
    if (/\bfavorites|favourite|favs\b/.test(t)) return { intent: 'favorites' };

    // price range
    const pr = t.match(/(under|below|less than)\s*₹?(\d+)/i);
    if (pr) { out.priceRange = { type: pr[1], amount: parseInt(pr[2], 10) }; }

    // categories & synonyms
    if (/\b(healthy|low calorie|high protein|protein)\b/.test(t)) out.category = 'healthy';
    if (/\bbreakfast\b/.test(t)) out.category = 'breakfast';
    if (/\b(cheat meal|treat)\b/.test(t)) out.category = 'cheat';
    if (/\bbudget|cheap|affordable\b/.test(t)) out.category = 'budget';
    if (/\b(spicy|hot|masaledar)\b/.test(t)) { out.preference = 'spicy'; }
    if (/\b(sweet|dessert)\b/.test(t)) { out.preference = 'sweet'; }

    return out;
  };

  const guessCommandCategory = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes('order') || t.includes('add')) return 'order';
    if (t.includes('find') || t.includes('show') || t.includes('search')) return 'search';
    if (t.includes('checkout') || t.includes('upi')) return 'checkout';
    return 'general';
  };

  // Very small fuzzy match using normalized includes + Levenshtein
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const levenshtein = (a: string, b: string) => {
    const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] = Math.min(
          dp[i-1][j] + 1,
          dp[i][j-1] + 1,
          dp[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1)
        );
      }
    }
    return dp[a.length][b.length];
  };

  const fuzzyFind = (query: string, items: any[]) => {
    const q = normalize(query);
    // synonyms map
    const synonyms: Record<string,string[]> = {
      biryani: ['biryani','pulao','rice','dum biryani'],
      dessert: ['gulab','jalebi','gulaab','dessert','sweet','baklava'],
      paneer: ['paneer','cheese']
    };
    const scored = items.map((it) => {
      const name = normalize(it.name + ' ' + (it.cuisine || ''));
      let include = name.includes(q) ? 0 : levenshtein(q, name);
      // boost synonyms
      Object.keys(synonyms).forEach(k => {
        if (synonyms[k].some(s => q.includes(s))) {
          if (name.includes(k)) include -= 1;
        }
      });
      return { item: it, score: include };
    }).sort((a,b) => a.score - b.score);
    return scored.map(s => s.item);
  };

  // Simple autocorrect suggestion using fuzzyFind
  const suggestCorrection = (text: string) => {
    const candidates = fuzzyFind(text, searchResults).slice(0,3);
    if (!candidates.length) return [];
    // if top candidate is similar by levenshtein threshold, suggest
    const norm = normalize(text);
    return candidates.filter(c=> levenshtein(norm, normalize(c.name)) < Math.max(3, norm.length * 0.4));
  };

  // handle parsed intent
  const handleParsedIntent = (parsed: any, rawText: string) => {
    const t = rawText.toLowerCase();
    setHistory(h => [...h, { from: 'assistant', text: `Processing intent: ${parsed.intent || 'search'}` }]);
    if (parsed.intent === 'theme') {
      setThemeMode(parsed.theme);
      toast.success(`Switched theme to ${parsed.theme}`);
      return;
    }

    if (parsed.intent === 'scroll') {
      window.scrollBy({ top: 600, behavior: 'smooth' });
      return;
    }

    if (parsed.intent === 'category') {
      setConversationPrompt(`Showing category: ${parsed.category}`);
      setNavCards(s => [{ label: `Open ${parsed.category}`, icon: 'Home' }, ...s].slice(0,4));
      // filter results by category
      const filtered = searchResults.filter(r => (r.tags||[]).includes(parsed.category) || (r.cuisine||'').toLowerCase().includes(parsed.category));
      setResults(filtered);
      return;
    }

    if (parsed.intent === 'show_cart') {
      setNavCards(s => [{ label: `Open Cart`, icon: 'ShoppingCart' }, ...s].slice(0,4));
      if (showCart) { try { showCart(); return; } catch(e) {} }
      toast.success('Opening cart (simulated)');
      return;
    }
    if (parsed.intent === 'clear_cart') {
      if (clearCart) { try { clearCart(); return; } catch(e) {} }
      toast.success('Cart cleared (simulated)');
      return;
    }
    if (parsed.intent === 'remove_last') {
      if (removeLast) { try { removeLast(); return; } catch(e) {} }
      if (removeFromCart) { try { removeFromCart('last'); return; } catch(e) {} }
      toast.success('Removed last item from cart (simulated)');
      return;
    }
    if (parsed.intent === 'increase') {
      toast.success('Increased item quantity (simulated)');
      return;
    }

    if (parsed.intent === 'checkout') { toast.success('Checkout started (simulated)'); return; }

    if (parsed.intent === 'search' || parsed.intent === 'preference') {
      // filter by preference or keywords
      let filtered = searchResults.slice();
      // category preference
      if (parsed.category) filtered = filtered.filter(r => (r.tags||[]).includes(parsed.category));
      if (parsed.preference === 'spicy') { filtered = filtered.filter(r => r.tags?.includes('spicy') || r.name.toLowerCase().includes('biryani')); setActiveFilters(f=>Array.from(new Set([...f,'Spicy']))); }
      if (parsed.preference === 'sweet') { filtered = filtered.filter(r => r.tags?.includes('sweet')); setActiveFilters(f=>Array.from(new Set([...f,'Sweet']))); }
      if (parsed.preference === 'light') { filtered = filtered.filter(r => r.tags?.includes('light')); setActiveFilters(f=>Array.from(new Set([...f,'Light']))); }

      // allergy filter
      const allergyMatch = rawText.match(/allergic to ([a-zA-Z]+)/i);
      if (allergyMatch) {
        const allergen = allergyMatch[1].toLowerCase();
        filtered = filtered.filter(r => !(r.tags || []).includes(allergen) && !r.name.toLowerCase().includes(allergen));
        toast.success(`Filtering out items with ${allergen}`);
      }

      // location-aware sorting if location available
      if (location) {
        filtered = filtered.map(r => ({...r, distance: distanceBetween(location, r.location) || 9999})).sort((a,b) => a.distance - b.distance);
      }

      // apply price range filter
      if (parsed.priceRange) {
        filtered = filtered.filter(r => parsed.priceRange.type.includes('under') ? r.price <= parsed.priceRange.amount : r.price >= parsed.priceRange.amount);
      }

      // fuzzy matching for dish names
      const fuzzy = fuzzyFind(rawText, filtered);
      if (fuzzy.length > 0) {
        // Recommendation engine: reorder based on tone & history
        const scored = fuzzy.map(it => ({ it, score: 0 }));
        scored.forEach(s => {
          if (tone === 'hungry' && (s.it.tags || []).includes('rice')) s.score -= 1;
          if (tone === 'urgent' && (s.it.tags || []).includes('popular')) s.score -= 1;
          if (parsed.preference === 'spicy' && (s.it.tags || []).includes('spicy')) s.score -= 1;
          if (parsed.preference === 'sweet' && (s.it.tags || []).includes('sweet')) s.score -= 1;
        });
        scored.sort((a,b) => a.score - b.score);
        setResults(scored.map(s => s.it).slice(0, 8));
        toast.success('Found matches');
      } else {
        setConversationPrompt('I could not find exact matches — did you mean one of these?');
        setResults(filtered.slice(0,6));
      }
    }

    if (parsed.intent === 'order') {
      // simple order flow: ask for quantity/restaurant if missing
      const qtyMatch = rawText.match(/(\d+)\s*(plates|pieces|pcs|orders|plates of)/i);
      const dishMatch = rawText.match(/order\s+(\d+\s*)?(plates of )?([a-zA-Z ]+)/i);
      pendingRef.current = { type: 'order', raw: rawText };
      if (!qtyMatch) {
        setConversationPrompt('How many plates/quantity would you like?');
        pendingRef.current.await = 'quantity';
        toast('How many would you like?');
      } else {
        // immediate add: find fuzzy dish and add
        const q = qtyMatch[1] ? parseInt(qtyMatch[1],10) : 1;
        const dish = fuzzyFind(rawText, searchResults)[0];
        if (dish) {
          // create cart-like item
          for (let i=0;i<q;i++) addToCart({ ...dish, quantity: 1 });
          toast.success(`Added ${q} × ${dish.name} to cart`);
        } else {
          toast('Could not identify the dish to order — please specify');
          setConversationPrompt('Which dish did you mean?');
          pendingRef.current.await = 'dish';
        }
      }
    }

    // show did-you-mean suggestions
    const corrections = suggestCorrection(rawText);
    if (corrections.length > 0) {
      setConversationPrompt(`Did you mean: ${corrections[0].name}?`);
      pendingRef.current = { type: 'correction', suggestions: corrections };
    }

    if (parsed.intent === 'remove') {
      const name = rawText.replace(/remove|delete|from cart/gi, '').trim();
      const matches = fuzzyFind(name, searchResults);
      if (matches && matches[0]) {
        // call addToCart with negative or instruct the host app via callback — we'll simulate via toast
        toast.success(`Removed ${matches[0].name} from cart (simulated)`);
      } else {
        toast('Which item shall I remove?');
        pendingRef.current = { type: 'remove', await: 'item' };
      }
    }

    if (parsed.intent === 'shipping') {
      // detect country/location in text
      const countryMatch = rawText.match(/to ([A-Za-z ]+)/i);
      setConversationPrompt('For international shipping, I recommend airtight + insulated packaging. Proceed?');
      pendingRef.current = { type: 'packaging', country: countryMatch ? countryMatch[1] : undefined };
      toast('I recommend airtight + insulated packaging — confirm to add to order');
    }

    if (parsed.intent === 'repeat') {
      // this would normally re-run last order; we'll simulate
      toast('Repeating your last order (simulated)');
    }

    if (parsed.intent === 'track') {
      toast('Tracking your order... (simulated)');
    }
  };

  // Auto-listen every 10 seconds while enabled
  useEffect(() => {
    if (!autoListen) {
      if (autoListenTimer.current) { window.clearInterval(autoListenTimer.current); autoListenTimer.current = null; }
      return;
    }
    autoListenTimer.current = window.setInterval(() => {
      if (!isListening) startRecognition();
    }, 10000);
    return () => { if (autoListenTimer.current) { window.clearInterval(autoListenTimer.current); autoListenTimer.current = null; } };
  }, [autoListen, isListening]);

  const distanceBetween = (a: any, b: any) => {
    if (!a || !b) return undefined;
    // Haversine formula (approx)
    const toRad = (v: number) => v * Math.PI / 180;
    const R = 6371; // km
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const sinDLat = Math.sin(dLat/2);
    const sinDLon = Math.sin(dLon/2);
    const aa = sinDLat*sinDLat + Math.cos(lat1)*Math.cos(lat2)*sinDLon*sinDLon;
    const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1-aa));
    return R * c;
  };

  const navigateAction = (label: string) => {
    if (/cart/i.test(label)) {
      if (showCart) { try { showCart(); } catch(e){} }
      toast.success('Opening cart');
      return;
    }
    if (/home/i.test(label)) { window.location.href = '/'; return; }
    if (/back/i.test(label)) { window.history.back(); return; }
    toast(`${label} (navigation simulated)`);
  };

  const handleAddToCart = (item: any) => {
    addToCart(item);
    toast.success(`${item.name} added to cart! 🛒`);
  };

  // Handle interactions when the assistant asked a follow-up (pendingRef)
  const handlePendingResponse = (text: string) => {
    if (!pendingRef.current) return;
    const p = pendingRef.current;
    if (p.type === 'order' && p.await === 'quantity') {
      const qty = parseInt(text, 10) || 1;
      const dish = fuzzyFind(p.raw, searchResults)[0];
      if (dish) {
        for (let i = 0; i < qty; i++) addToCart({ ...dish, quantity: 1 });
        toast.success(`Added ${qty} × ${dish.name} to cart`);
        pendingRef.current = null;
        setConversationPrompt(null);
        return;
      }
    }
    if (p.type === 'order' && p.await === 'dish') {
      const dish = fuzzyFind(text, searchResults)[0];
      if (dish) {
        addToCart({ ...dish, quantity: 1 });
        toast.success(`Added 1 × ${dish.name} to cart`);
        pendingRef.current = null;
        setConversationPrompt(null);
        return;
      }
      toast.error('Could not identify the dish');
      return;
    }
    if (p.type === 'remove' && p.await === 'item') {
      // simulate removal
      const dish = fuzzyFind(text, searchResults)[0];
      if (dish) {
        toast.success(`Removed ${dish.name} from cart (simulated)`);
        pendingRef.current = null;
        setConversationPrompt(null);
      }
    }
  };

  // Manual text search (same flow as voice search)
  const handleTextQuery = (q: string) => {
    if (!q.trim()) return;
    const parsed = parseIntent(q.toLowerCase());
    setTranscript(q);
    const dt = detectTone(q);
    setDetectedLang(detectLanguage(q));
    setTone(dt);
    setEmotionState(detectEmotionFromTone(dt));
    handleParsedIntent(parsed, q);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF3E6] to-[#FFFFFF]">
      <Header cartCount={cartCount} onCartClick={onCartClick} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl text-[#1C1C1C] mb-4">🎤 Voice-Controlled Search</h1>
          <p className="text-[#5E5E5E]">Tap the mic or say "Hey YummPort" to begin</p>
        </motion.div>

        <div className="flex flex-col items-center mb-12">
          <div className="w-full max-w-3xl">
            <SuggestionsCarousel items={[
              'Recommended For You','Trending Now','Chef Specials','Budget Meals','Nearby Popular','Rainy Day Foods','Dessert Mood','High-Protein Picks'
            ]} />
          </div>

          <motion.button onClick={toggleListening} whileTap={{ scale: 0.95 }} aria-label="Toggle microphone" className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full flex items-center justify-center my-6 transition-all ${isListening ? 'bg-gradient-to-r from-[#FF5200] to-[#FF7A33] shadow-2xl' : 'bg-gradient-to-br from-[#FFF3E6] to-white border-4 border-[#FF5200]'}`}>
            <div className="absolute -inset-10 rounded-full pointer-events-none">
              <div className="w-full h-full rounded-full shadow-[0_30px_70px_rgba(255,82,0,0.10)]" />
            </div>
            <div className="absolute rounded-full w-[220px] h-[220px]" aria-hidden>
              <div className="w-full h-full rounded-full bg-[#FF5200] blur-[18px] opacity-20" />
            </div>
            <div className="absolute rounded-full w-[180px] h-[180px]" aria-hidden>
              <div className="w-full h-full rounded-full bg-[#FF7A33] blur-[12px] opacity-18" />
            </div>
            <div className="absolute rounded-full w-[140px] h-[140px]" aria-hidden>
              <div className="w-full h-full rounded-full bg-[#FF5200] blur-[6px] opacity-30" />
            </div>

            <div className="relative z-10 flex items-center justify-center">
              {isListening ? <Mic className="w-16 h-16 text-white" /> : <MicOff className="w-16 h-16 text-[#FF5200]" />}
            </div>
          </motion.button>

          <div className="text-center">
            <div className="text-sm text-[#5E5E5E]">{/* language / tone / intent badges */}</div>
            <div className="mt-2">
              <span className="px-3 py-1 rounded-full bg-[#F4F4F4] text-sm mr-2">Auto-detected: {detectedLang === 'hi' ? 'Hindi 🇮🇳' : detectedLang === 'ta' ? 'Tamil 🇮🇳' : detectedLang === 'te' ? 'Telugu 🇮🇳' : detectedLang === 'ar' ? 'Arabic' : 'English'}</span>
              <span className="px-3 py-1 rounded-full bg-[#F4F4F4] text-sm mr-2">Tone: {tone || 'neutral'}</span>
              <span className="px-3 py-1 rounded-full bg-[#F4F4F4] text-sm">Intent: {intent || '—'}</span>
            </div>
            <div className="mt-2 text-sm text-[#FF5200]">{['Say "Hey YummPort" to start', 'Try: Order 2 biryani', 'Ask: Show spicy foods', 'Try: What\'s trending today?'][micHintIndex]}</div>
          </div>

          <WaveformBars bars={analyserData} />

          <div className="w-full max-w-2xl mt-4">
            <QuickActions />
            <div className="mt-4">
              {activeFilters.length > 0 ? <FilterPills filters={activeFilters} onRemove={(f)=>setActiveFilters(fs => fs.filter(x=>x!==f))} /> : <div className="text-sm text-[#5E5E5E]">No active voice filters</div>}
            </div>

            <div className="mt-4 overflow-x-auto flex gap-2 py-2">
              {recentCommands.map((c, idx) => (
                <button key={idx} onClick={() => handleTextQuery(c)} className="px-3 py-1 rounded-full bg-white border shadow-sm text-sm">{c}</button>
              ))}
            </div>
          </div>

          <div className="mt-6 w-full max-w-3xl flex gap-3 flex-wrap justify-center">
            {navCards.map((n, i) => (
              <motion.button key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-lg bg-white shadow-md flex items-center gap-2" onClick={() => navigateAction(n.label)} aria-label={`Navigate ${n.label}`}>
                <div className="text-sm font-semibold">{n.label}</div>
              </motion.button>
            ))}
          </div>

          {conversationPrompt && (
            <div className="mt-6 w-full max-w-2xl">
              <ResponseBubble title="Assistant" onMore={() => { setSheetItem(results[0] || null); setShowBottomSheet(true); }}>{conversationPrompt}</ResponseBubble>
            </div>
          )}

          <AssistantAvatar emotion={emotionState} speaking={isListening} />
          {showBottomSheet && (
            <BottomSheet item={sheetItem} onClose={() => { setSheetItem(null); setShowBottomSheet(false); }} onAdd={(it)=>{ handleAddToCart(it); setSheetItem(null); setShowBottomSheet(false); }} />
          )}
        </div>

        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl text-[#1C1C1C] mb-6">Here are your best matches:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {results.map((item) => (
                  <Card key={item.id} className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow">
                    <div className="relative cursor-pointer" onClick={() => { setSheetItem(item); setShowBottomSheet(true); }}>
                      <ImageWithFallback src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                      <div className="absolute left-3 top-3 px-2 py-1 rounded-full bg-white/80 text-xs">{item.veg ? 'Veg' : 'Non-veg'}</div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-[#1C1C1C] mb-2">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-[#5E5E5E]">{item.cuisine} • {item.deliveryMins} mins</div>
                          <div className="text-lg text-[#FF5200]">₹{item.price}</div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Button onClick={() => handleAddToCart(item)} size="sm" className="bg-gradient-to-r from-[#FF5200] to-[#FF7A33]">Add</Button>
                          <Button variant="ghost" size="sm" onClick={() => { setSheetItem(item); setShowBottomSheet(true); }}>More Info</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
