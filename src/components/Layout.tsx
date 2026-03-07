import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Clock, Target, BookOpen, Gift, Users, LogOut, Bell, Menu, X,
  Award, Send, Bot, Sparkles, Search, ChevronDown, FileText, Star,
  User, Settings as SettingsIcon, ExternalLink
} from 'lucide-react';
import { useAuthStore, useAppStore } from '../store';
import { cn } from '../utils';
import { translations } from '../i18n';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { WelcomeTour } from './WelcomeTour';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
});

/* ───── Nav Config ───── */
const CORE_NAV_ITEMS = [
  { id: 'dashboard', path: '/dashboard', label: 'Tổng quan', icon: Home },
  { id: 'contributions', path: '/iquest', label: 'iQuest', icon: Award },
  { id: 'rewards', path: '/ireward', label: 'iReward', icon: Gift },
];

const HUB_NAV_ITEMS = [
  { id: 'attendance', path: '/icheck', label: 'iCheck', icon: Clock, external: true },
  { id: 'okrs', path: '/igoal', label: 'iGoal', icon: Target, external: true },
  { id: 'documents', path: '/iwiki', label: 'iWiki', icon: BookOpen, external: true },
];

const MANAGER_ITEMS = [
  { id: 'team', path: '/hris', label: 'Hồ sơ nhân sự', icon: Users },
];

/* ───── Global Search ───── */
const SEARCH_INDEX = [
  { title: 'Tổng quan Dashboard', path: '/dashboard', category: 'Trang' },
  { title: 'iQuest — Nhiệm vụ hàng ngày', path: '/iquest', category: 'Trang' },
  { title: 'iQuest — Nhiệm vụ tân thủ', path: '/iquest', category: 'Trang' },
  { title: 'iReward — Đổi quà', path: '/ireward', category: 'Trang' },
  { title: 'iCheck — Chấm công (App riêng)', path: '/icheck', category: 'Ứng dụng' },
  { title: 'iGoal — OKR (App riêng)', path: '/igoal', category: 'Ứng dụng' },
  { title: 'iWiki — Tài liệu (App riêng)', path: '/iwiki', category: 'Ứng dụng' },
  { title: 'Hồ sơ nhân sự (Manager)', path: '/hris', category: 'Trang' },
];

const GlobalSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.length >= 1
    ? SEARCH_INDEX.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8)
    : [];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  const catColors: Record<string, string> = {
    'Trang': 'bg-brand-50 text-brand-700',
    'Ứng dụng': 'bg-emerald-50 text-emerald-700',
  };

  return (
    <div ref={containerRef} className="relative hidden md:block w-full max-w-sm">
      <div
        onClick={() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="flex items-center gap-2 pl-10 pr-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl cursor-text hover:border-brand-300 hover:bg-white transition-all"
      >
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-400 font-medium flex-1">{translations[useAppStore.getState().language].search_placeholder}</span>
        <kbd className="text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 hidden sm:block">Ctrl K</kbd>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            className="absolute top-full mt-2 left-0 w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200/60 z-[100] overflow-hidden"
          >
            <div className="relative border-b border-slate-100">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Tìm trang, tính năng, tài liệu..."
                className="w-full pl-11 pr-10 py-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {query.length === 0 && (
                <div className="px-4 py-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Truy cập nhanh</p>
                  {SEARCH_INDEX.slice(0, 5).map(item => (
                    <button key={item.path + item.title} onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                      <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-brand-100 transition-colors">
                        <Home className="w-3.5 h-3.5 text-brand-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{item.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {query.length > 0 && results.length === 0 && (
                <div className="px-4 py-8 text-center text-slate-500">
                  <p className="text-sm font-medium">Không tìm thấy kết quả cho "<strong>{query}</strong>"</p>
                  <p className="text-xs mt-1 text-slate-400">Thử hỏi AI Assistant bên dưới 💡</p>
                </div>
              )}

              {results.length > 0 && (
                <div className="p-2">
                  {results.map(item => (
                    <button key={item.path + item.title} onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 transition-colors text-left group">
                      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-brand-100 transition-colors">
                        <FileText className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-700 group-hover:text-brand-700 truncate">{item.title}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${catColors[item.category] || 'bg-slate-100 text-slate-600'}`}>
                        {item.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>↑↓ Điều hướng · Enter Chọn · Esc Đóng</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ───── Notification Dropdown ───── */
const NotificationDropdown = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { notifications, markNotificationRead, markAllRead } = useAppStore();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClick = (n: typeof notifications[0]) => {
    markNotificationRead(n.id);
    if (n.link) { navigate(n.link); onClose(); }
  };

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/60 z-50 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900">Thông báo</h3>
          {unread > 0 && <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">{unread} mới</span>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors">
            Đọc tất cả
          </button>
        )}
      </div>
      <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
        {notifications.map(n => (
          <div key={n.id} onClick={() => handleClick(n)}
            className={cn("flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors border-b border-slate-50 last:border-0",
              n.read ? 'bg-white hover:bg-slate-50/50' : 'bg-brand-50/30 hover:bg-brand-50/50')}>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-lg">{n.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={cn("text-sm font-bold truncate", n.read ? 'text-slate-500' : 'text-slate-900')}>{n.title}</p>
                {!n.read && <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
        <button className="w-full text-center text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors">
          Xem tất cả thông báo
        </button>
      </div>
    </motion.div>
  );
};

const UserMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { currentUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200/60 z-50 overflow-hidden">
      <div className="p-2 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 p-2">
          <img src={currentUser?.avatar} className="w-10 h-10 rounded-full border border-white" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{currentUser?.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{currentUser?.email}</p>
          </div>
        </div>
      </div>
      <div className="p-2">
        <button onClick={() => { navigate('/profile'); onClose(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-all text-left text-sm font-bold text-slate-600">
          <User className="w-4 h-4" /> {translations[useAppStore.getState().language].profile}
        </button>
        <button onClick={() => { navigate('/settings'); onClose(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-all text-left text-sm font-bold text-slate-600">
          <SettingsIcon className="w-4 h-4" /> {translations[useAppStore.getState().language].settings}
        </button>
      </div>
      <div className="p-2 border-t border-slate-100">
        <button onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all text-left text-sm font-bold text-slate-600">
          <LogOut className="w-4 h-4" /> {translations[useAppStore.getState().language].logout}
        </button>
      </div>
    </motion.div>
  );
};

/* ───── Toast Container ───── */
export const ToastContainer = () => {
  const { toasts, removeToast } = useAppStore();
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => removeToast(toast.id)}
            className={cn("flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg cursor-pointer min-w-[300px] max-w-[420px] border backdrop-blur-xl",
              toast.type === 'success' && "bg-emerald-50/95 border-emerald-200 text-emerald-800",
              toast.type === 'error' && "bg-rose-50/95 border-rose-200 text-rose-800",
              toast.type === 'warning' && "bg-amber-50/95 border-amber-200 text-amber-800",
              toast.type === 'info' && "bg-blue-50/95 border-blue-200 text-blue-800",
              toast.type === 'exp' && "bg-brand-50/95 border-brand-200 text-brand-800",
              toast.type === 'levelup' && "bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-amber-300 text-amber-900",
            )}>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg",
              toast.type === 'success' && "bg-emerald-100",
              toast.type === 'error' && "bg-rose-100",
              toast.type === 'warning' && "bg-amber-100",
              toast.type === 'info' && "bg-blue-100",
              toast.type === 'exp' && "bg-brand-100",
              toast.type === 'levelup' && "bg-amber-100",
            )}>
              {toast.type === 'success' && '✅'}{toast.type === 'error' && '❌'}
              {toast.type === 'warning' && '⚠️'}{toast.type === 'info' && 'ℹ️'}
              {toast.type === 'exp' && '⚡'}{toast.type === 'levelup' && '🏆'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{toast.title}</p>
              {toast.message && <p className="text-xs opacity-80 mt-0.5">{toast.message}</p>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/* ───── AI Mascot Chat ───── */
const AI_RESPONSES: Record<string, string> = {
  'default': 'Xin chào! Tôi là iKame Assistant 🤖. Hãy hỏi về quy trình, chính sách, OKR, hoặc bất cứ điều gì liên quan đến công việc!',
  'nghỉ phép': '📋 **Chính sách nghỉ phép:**\n- Phép năm: 12 ngày/năm\n- Phép ốm: có giấy BS, không giới hạn\n- Thai sản: 6 tháng (nữ), 5 ngày (nam)\n\n👉 Tạo đơn tại **iCheck > Tạo đơn nghỉ phép**.',
  'lương': '💰 Thông tin lương được mã hóa E2E. Xem phiếu lương tại **Dashboard > Widget Lương** (yêu cầu xác thực).',
  'okr': '🎯 **Hướng dẫn iGoal:**\n1. Vào **iGoal** → Tạo iGoal mới\n2. Thêm Key Results với mục tiêu cụ thể\n3. Cập nhật tiến độ hàng tuần\n4. OKR < 50% giữa quý sẽ nhận cảnh báo ⚠️',
  'exp': '⚡ **Cách kiếm EXP:**\n- iCheck đúng giờ: +10 EXP/ngày\n- Hoàn thành iQuest hàng ngày: +10-30 EXP\n- Cập nhật OKR: +50 EXP\n- Viết blog kỹ thuật: +300 EXP\n\nTích lũy EXP để lên Level và nhận Credits!',
  'credits': '💎 **Credits (iKame Coin):**\n- Kiếm từ: hoàn thành Quest, lên Level\n- Dùng để: đổi quà tại **iReward** (voucher, nghỉ phép, quà..)\n- Level up = +50 Credits bonus!',
};

const AIMascotChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant' as const, content: AI_RESPONSES['default'] }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const QUICK_CHIPS = ['Chính sách nghỉ phép?', 'Cách kiếm EXP?', 'Hướng dẫn OKR', 'Credits là gì?'];

  const { currentUser } = useAuthStore();
  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setMessages(prev => [...prev, { role: 'user' as const, content: msg }]);
    setInput('');
    setIsTyping(true);

    try {
      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
        systemInstruction: `Bạn là iKame Assistant, trợ lý ảo thông minh của My iKame.
        My iKame là hub kết nối nhân viên, tập trung vào truyền thông nội bộ, onboarding và gamification.
        Tính năng chính: iQuest (nhiệm vụ & onboarding), iReward (đổi quà), Kudos (ghi nhận), Leaderboard.
        Các app riêng: iCheck (chấm công), iGoal (OKRs), iWiki (tài liệu) - được điều hướng từ My iKame.
        Người dùng hiện tại: ${currentUser?.name}, Level: ${currentUser?.level}, Vai trò: ${currentUser?.role}.
        Hãy trả lời bằng tiếng Việt, thân thiện, sáng tạo và ngắn gọn.`
      });

      const result = await chat.sendMessage(msg);
      const response = result.response.text();
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Xin lỗi, tôi đang bận một chút. Bạn thử lại sau nhé! 🤖" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <motion.button onClick={() => setIsOpen(!isOpen)} whileTap={{ scale: 0.9 }}
        className={cn("fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300",
          isOpen ? "bg-slate-700 hover:bg-slate-800" : "bg-brand-gradient hover:scale-105 shadow-brand-lg animate-pulse-glow")}>
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Bot className="w-7 h-7 text-white" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[530px] bg-white rounded-2xl shadow-2xl border border-slate-200/60 flex flex-col overflow-hidden">
            <div className="bg-brand-gradient px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">iKame Assistant</h3>
                <p className="text-orange-100 text-[11px] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Trực tuyến
                </p>
              </div>
              <button onClick={() => setMessages([{ role: 'assistant', content: AI_RESPONSES['default'] }])}
                className="ml-auto text-orange-200 hover:text-white text-[10px] font-bold transition-colors">Xóa lịch sử</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/50">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn("max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                    msg.role === 'user'
                      ? "bg-brand-600 text-white rounded-br-md"
                      : "bg-white text-slate-700 rounded-bl-md shadow-sm border border-slate-100")}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex items-center gap-2">
                    {[0, 0.2, 0.4].map((d, i) => (
                      <motion.div key={i} className="w-1.5 h-1.5 bg-brand-400 rounded-full"
                        animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, delay: d, repeat: Infinity }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick chips */}
            <div className="px-3 py-2 flex gap-2 overflow-x-auto scrollbar-hide border-t border-slate-50">
              {QUICK_CHIPS.map(chip => (
                <button key={chip} onClick={() => handleSend(chip)}
                  className="flex-shrink-0 px-3 py-1.5 bg-brand-50 border border-brand-100 text-brand-600 text-[11px] font-bold rounded-lg hover:bg-brand-100 transition-colors">
                  {chip}
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Hỏi về chính sách, quy trình..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all font-medium" />
                <button onClick={() => handleSend()} disabled={!input.trim()}
                  className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center hover:bg-brand-700 transition-colors disabled:opacity-40 flex-shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ───── Main Layout ───── */
interface LayoutProps { children: React.ReactNode; }

export const Layout = ({ children }: LayoutProps) => {
  const { currentUser, logout } = useAuthStore();
  const { notifications, markNotificationRead, markAllRead, theme, language } = useAppStore();
  const unreadCount = notifications.filter(n => !n.read).length;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const t = translations[language];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const CORE_NAV_LOC = [
    { id: 'dashboard', path: '/dashboard', label: t.dashboard, icon: Home },
    { id: 'contributions', path: '/iquest', label: t.iquest, icon: Award },
    { id: 'events', path: '/events', label: 'Sự kiện', icon: Sparkles },
    { id: 'rewards', path: '/ireward', label: t.ireward, icon: Gift },
  ];

  const HUB_NAV_LOC = [
    { id: 'attendance', path: '/icheck', label: t.icheck, icon: Clock, external: true },
    { id: 'okrs', path: '/igoal', label: t.igoal, icon: Target, external: true },
    { id: 'documents', path: '/iwiki', label: t.iwiki, icon: BookOpen, external: true },
  ];

  const MANAGER_ITEMS_LOC = [
    { id: 'team', path: '/hris', label: t.hris, icon: Users },
  ];

  const managerItems = (currentUser?.role === 'manager' || currentUser?.role === 'admin') ? MANAGER_ITEMS_LOC : [];

  const handleLogout = () => { logout(); navigate('/login'); };

  const exp = currentUser?.exp || 0;
  const maxExp = currentUser?.maxExp || 1000;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)} />
        )}
      </AnimatePresence>

      {/* ─── Sidebar ─── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-slate-200/60 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col shadow-sm",
        isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center px-5 justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-brand-gradient rounded-xl flex items-center justify-center shadow-brand">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-gradient">iKame</span>
          </div>
          <button className="md:hidden p-2 text-slate-400 hover:bg-slate-100 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-3 px-3 custom-scrollbar">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tính năng chính</p>
          <nav className="space-y-0.5">
            {CORE_NAV_LOC.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button key={item.id} onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                  className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all group relative",
                    isActive ? "bg-brand-gradient text-white shadow-brand" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
                  <Icon className={cn("w-[18px] h-[18px]", isActive ? "text-white" : "text-slate-400 group-hover:text-brand-500")} />
                  {item.label}
                  {isActive && <motion.div layoutId="activeNav" className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full" />}
                </button>
              );
            })}
            {managerItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button key={item.id} onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                  className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all group relative",
                    isActive ? "bg-brand-gradient text-white shadow-brand" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
                  <Icon className={cn("w-[18px] h-[18px]", isActive ? "text-white" : "text-slate-400 group-hover:text-brand-500")} />
                  {item.label}
                  {isActive && <motion.div layoutId="activeNav" className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full" />}
                </button>
              );
            })}
          </nav>

          <div className="my-3 mx-3 border-t border-slate-100" />

          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <ExternalLink className="w-3 h-3" /> iKame Apps
          </p>
          <nav className="space-y-0.5">
            {HUB_NAV_LOC.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button key={item.id} onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                  className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all group relative",
                    isActive ? "bg-brand-gradient text-white shadow-brand" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900")}>
                  <Icon className={cn("w-[18px] h-[18px]", isActive ? "text-white" : "text-slate-400 group-hover:text-brand-500")} />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ExternalLink className={cn("w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity", isActive ? "text-white opacity-100" : "text-slate-300")} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* User card */}
        {currentUser && (
          <div className="p-3 border-t border-slate-100">
            <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="relative">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">Lv.{currentUser.level}</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(exp / maxExp) * 100}%` }}
                      transition={{ duration: 1 }} className="h-full bg-brand-600 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ─── Main ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-6 z-30 sticky top-0 gap-4">
          <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1"><GlobalSearch /></div>

          <div className="flex items-center gap-2">
            {(currentUser?.role === 'manager' || currentUser?.role === 'admin') && (
              <span className="px-2.5 py-1 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hidden sm:block">
                👑 Quản lý
              </span>
            )}

            <div className="h-5 w-px bg-slate-200 mx-1" />

            <div className="flex items-center gap-2">
              <div className="relative">
                <button onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2 text-slate-400 hover:text-brand-600 rounded-xl hover:bg-brand-50 relative transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white px-1">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
                </AnimatePresence>
              </div>

              <div className="relative ml-2">
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-xl transition-all group">
                  <div className="w-8 h-8 rounded-full border border-slate-100 overflow-hidden">
                    <img src={currentUser?.avatar} className="w-full h-full object-cover" />
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform", isUserMenuOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  <UserMenu isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar bg-slate-50/80">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={location.pathname}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}>
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <ToastContainer />
      <AIMascotChat />
      <WelcomeTour />
    </div>
  );
};
