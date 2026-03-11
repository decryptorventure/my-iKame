import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useAppStore } from '../store';
import { Trophy, Star, TrendingUp, Clock, Heart, MessageCircle, Share2, Image as ImageIcon, Smile, Send, Calendar, Award, MoreHorizontal, Zap, ArrowUpRight, Coins, Flame, Sparkles, ChevronRight, CheckCircle2, Users, Cake, Medal, PartyPopper, Rocket, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import { Modal } from '../components/UI';
import { PublicProfileModal } from '../components/PublicProfileModal';
import { AIAssistantWidget } from '../components/AIAssistantWidget';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const {
    addExp, addToast, checkIn, todayCheckedIn, celebrations, sendWish, quests,
    attendanceRecords, posts, addPost, toggleLikePost, users, badges
  } = useAppStore();
  const [newPostContent, setNewPostContent] = useState('');
  const [leaderboardType, setLeaderboardType] = useState<'personal' | 'team'>('personal');
  const [leaderboardTab, setLeaderboardTab] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [feedFilter, setFeedFilter] = useState<'all' | 'pnod' | 'kudos' | 'ai'>('all');

  const [showKudosModal, setShowKudosModal] = useState(false);
  const [kudosRecipient, setKudosRecipient] = useState('');
  const [kudosMessage, setKudosMessage] = useState('');

  const isNewEmployee = currentUser?.role === 'new_employee';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  const leaderboardData = {
    weekly: [
      { name: 'Trần Thị B', level: 12, exp: 820, avatar: 'https://picsum.photos/seed/manager1/150/150' },
      { name: currentUser?.name || 'Nguyễn Văn A', level: currentUser?.level || 5, exp: 650, avatar: currentUser?.avatar || '' },
      { name: 'Lê Văn C', level: 4, exp: 480, avatar: 'https://picsum.photos/seed/user3/150/150' },
      { name: 'Phạm Thị D', level: 7, exp: 420, avatar: 'https://picsum.photos/seed/user4/150/150' },
      { name: 'Hoàng Văn E', level: 3, exp: 310, avatar: 'https://picsum.photos/seed/user5/150/150' },
    ],
    monthly: [
      { name: 'Trần Thị B', level: 12, exp: 8200, avatar: 'https://picsum.photos/seed/manager1/150/150' },
      { name: currentUser?.name || 'Nguyễn Văn A', level: currentUser?.level || 5, exp: 2450, avatar: currentUser?.avatar || '' },
      { name: 'Phạm Thị D', level: 7, exp: 2100, avatar: 'https://picsum.photos/seed/user4/150/150' },
      { name: 'Lê Văn C', level: 4, exp: 1800, avatar: 'https://picsum.photos/seed/user3/150/150' },
      { name: 'Hoàng Văn E', level: 3, exp: 1200, avatar: 'https://picsum.photos/seed/user5/150/150' },
    ],
  };

  const teamLeaderboardData = {
    weekly: [
      { name: 'Engineering', exp: 12500, avatar: 'https://ui-avatars.com/api/?name=EN&background=0ea5e9&color=fff', memberCount: 24 },
      { name: 'Marketing', exp: 8200, avatar: 'https://ui-avatars.com/api/?name=MK&background=f43f5e&color=fff', memberCount: 15 },
      { name: 'Product', exp: 7100, avatar: 'https://ui-avatars.com/api/?name=PR&background=10b981&color=fff', memberCount: 8 },
      { name: 'HR & Admin', exp: 4500, avatar: 'https://ui-avatars.com/api/?name=HR&background=8b5cf6&color=fff', memberCount: 6 },
    ],
    monthly: [
      { name: 'Engineering', exp: 52000, avatar: 'https://ui-avatars.com/api/?name=EN&background=0ea5e9&color=fff', memberCount: 24 },
      { name: 'Product', exp: 31000, avatar: 'https://ui-avatars.com/api/?name=PR&background=10b981&color=fff', memberCount: 8 },
      { name: 'Marketing', exp: 28500, avatar: 'https://ui-avatars.com/api/?name=MK&background=f43f5e&color=fff', memberCount: 15 },
      { name: 'HR & Admin', exp: 19000, avatar: 'https://ui-avatars.com/api/?name=HR&background=8b5cf6&color=fff', memberCount: 6 },
    ]
  };

  const currentLeaderboard = leaderboardType === 'personal' ? leaderboardData[leaderboardTab] : teamLeaderboardData[leaderboardTab];
  const medals = ['🥇', '🥈', '🥉', '4', '5'];

  const [wishInputs, setWishInputs] = useState<Record<number, string>>({});

  const sortedPosts = [...posts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const filteredPosts = sortedPosts.filter(post => {
    if (feedFilter === 'all') return true;
    if (feedFilter === 'pnod') return post.author.name.includes('PnOD') || post.author.name.includes('HR');
    if (feedFilter === 'kudos') return post.type === 'kudos';
    if (feedFilter === 'ai') return post.type === 'ai_update';
    return true;
  });

  const handleLike = (id: number) => {
    toggleLikePost(id);
    // Track official onboarding quest (ID 27 - Tương tác Newsfeed)
    const quest27 = quests.find(q => q.id === 27);
    if (quest27 && quest27.status === 'pending') {
      useAppStore.getState().approveQuest(27, true);
    }
  };
  const handlePost = () => {
    if (!newPostContent.trim()) return;
    addPost({
      author: { name: currentUser?.name || '', avatar: currentUser?.avatar || '', title: currentUser?.title || '' },
      content: newPostContent,
      type: 'update'
    });
    setNewPostContent('');
    addExp(5, 'Đăng bài viết mới');
  };

  const handleSendKudos = () => {
    if (!kudosRecipient.trim() || !kudosMessage.trim()) return;

    addPost({
      author: { name: currentUser?.name || '', avatar: currentUser?.avatar || '', title: currentUser?.title || '' },
      content: `Thật tuyệt vời, vinh danh **${kudosRecipient}**! \n\n${kudosMessage}`,
      type: 'kudos',
      badge: 'Kudos Sent'
    });

    addToast({ type: 'success', title: 'Đã gửi Kudos!', message: `Bạn đã gửi lời cảm ơn tới ${kudosRecipient}` });
    addExp(10, 'Gửi Kudos cho đồng nghiệp');

    setShowKudosModal(false);
    setKudosRecipient('');
    setKudosMessage('');
  };

  const handleSendCustomWish = (celebrationId: number) => {
    const wish = wishInputs[celebrationId] || 'Chúc mừng ngày đặc biệt của bạn nhé! 🎉';
    sendWish(celebrationId);
    setWishInputs(prev => ({ ...prev, [celebrationId]: '' }));
    addToast({ type: 'success', title: 'Đã gửi lời chúc', message: `"${wish}"` });
  };

  const handleCheckIn = () => {
    if (todayCheckedIn) { addToast({ type: 'info', title: 'Bạn đã iCheck hôm nay rồi!' }); return; }
    checkIn();
  };

  const onboardingTabId = currentUser?.role === 'new_employee' ? 'onboarding' : 'onboarding_official';
  const onboardingQuests = quests.filter(q => q.tabId === onboardingTabId);
  const completedOnboarding = onboardingQuests.filter(q => q.status === 'completed').length;
  const totalOnboarding = onboardingQuests.length;
  const onboardingPercent = totalOnboarding > 0 ? Math.round((completedOnboarding / totalOnboarding) * 100) : 0;
  const showOnboarding = onboardingPercent < 100 && (currentUser?.role === 'new_employee' || currentUser?.role === 'employee' || currentUser?.role === 'manager');

  // Check for onboarding completion on mount & Ensure quests exist
  React.useEffect(() => {
    const role = currentUser?.role;
    if (role === 'new_employee' || role === 'employee' || role === 'manager') {
      const store = useAppStore.getState();
      
      // Auto-inject missing system quests if they don't exist
      const INITIAL_SYSTEM_QUESTS = [
        { id: 24, title: 'iCheck đầu tiên', desc: 'Thực hiện chấm công lần đầu trên hệ thống My iKame.', exp: 50, credits: 10, progress: 0, target: 1, status: 'pending', subCategory: 'Hệ thống', rarity: 'common', tabId: 'onboarding_official', howToComplete: 'Sử dụng tính năng iCheck trên Dashboard hoặc App mobile để ghi nhận ngày công.' },
        { id: 25, title: 'Đạt mốc Level 2', desc: 'Tích lũy EXP từ các hoạt động để thăng cấp lên Level 2.', exp: 100, credits: 20, progress: 0, target: 2, status: 'pending', subCategory: 'Cá nhân', rarity: 'rare', tabId: 'onboarding_official', howToComplete: 'Tham gia các hoạt động như iCheck, tương tác bải viết để nhận EXP và thăng cấp.' },
        { id: 26, title: 'Gửi lời chúc mừng', desc: 'Gửi lời chúc Sinh nhật hoặc Thâm niên đến đồng nghiệp.', exp: 30, credits: 5, progress: 0, target: 1, status: 'pending', subCategory: 'Tương tác', rarity: 'common', tabId: 'onboarding_official', howToComplete: 'Tìm các mục Sinh nhật/Thâm niên trên Dashboard và nhấn gửi lời chúc.' },
        { id: 27, title: 'Tương tác Newsfeed', desc: 'Like hoặc bình luận vào bài viết của đồng nghiệp.', exp: 20, credits: 5, progress: 0, target: 1, status: 'pending', subCategory: 'Tương tác', rarity: 'common', tabId: 'onboarding_official', howToComplete: 'Dạo một vòng quanh Newsfeed và để lại tim hoặc bình luận cho một bài viết bất kỳ.' },
        { id: 28, title: 'Hoàn thiện Profile', desc: 'Cập nhật đầy đủ thông tin cá nhân và ảnh đại diện.', exp: 50, credits: 10, progress: 0, target: 1, status: 'pending', subCategory: 'Cá nhân', rarity: 'common', tabId: 'onboarding_official', howToComplete: 'Truy cập trang Cá nhân và cập nhật các thông tin còn thiếu.' },
      ];

      const missingQuests = INITIAL_SYSTEM_QUESTS.filter(sysQ => !store.quests.find(q => q.id === sysQ.id));
      if (missingQuests.length > 0) {
        useAppStore.setState({ quests: [...store.quests, ...missingQuests as any] });
        store.addToast({ 
          type: 'info', 
          title: 'Hệ thống đã cập nhật', 
          message: 'Dành riêng cho iKamer cũ: Chuỗi nhiệm vụ "Khám phá My iKame" đã sẵn sàng!',
          duration: 5000
        });
      }

      store.checkOnboardingCompletion();
    }
  }, [currentUser, quests.length, onboardingPercent]); 

  // birthday & anniversary lists
  const birthdayCelebrations = celebrations.filter(c => c.type === 'birthday');
  const anniversaryCelebrations = celebrations.filter(c => c.type === 'anniversary');

  const computeStreak = () => {
    let streak = 0;
    for (let i = 0; i < attendanceRecords.length; i++) {
      const r = attendanceRecords[i];
      if (r.status === 'on_time' || r.status === 'late') streak++;
      else if (r.status !== 'holiday' && r.status !== 'wfh' && r.status !== 'ot') break;
    }
    return streak;
  };

  const statCards = [
    { label: 'Streak Check-in', value: `${computeStreak()} ngày`, sub: 'Liên tục', icon: Flame, gradient: 'from-orange-500 to-amber-600' },
    { label: 'Credits', value: currentUser?.credits?.toString() || '0', sub: 'iKame Coin', icon: Coins, gradient: 'from-amber-500 to-orange-600' },
    { label: 'Level', value: `Lv. ${currentUser?.level || 1}`, sub: `${currentUser?.exp || 0}/${currentUser?.maxExp || 1000} XP`, icon: Star, gradient: 'from-emerald-500 to-teal-600' },
    { label: 'Quest Progress', value: `${quests.filter(q => q.status === 'completed').length}/${quests.length}`, sub: 'Nhiệm vụ', icon: Award, gradient: 'from-brand-500 to-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-[1400px] mx-auto">
        {/* ---------------- LEFT COLUMN: MAIN FEED (65%) ---------------- */}
        <div id="tour-feed" className="lg:col-span-8 space-y-6 scroll-mt-28">
          {/* Compact Lời Chào (Mini Hero) */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-brand-50 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">{greeting}, {currentUser?.name?.split(' ').pop() || 'bạn'} 👋</h1>
              <p className="text-slate-500 text-sm mt-1">{format(new Date(), 'EEEE, dd/MM/yyyy')} · Chia sẻ cập nhật mới nhất của bạn!</p>
            </div>
            <div className="hidden sm:flex items-center gap-3 relative z-10">
              <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 shadow-sm">
                <Coins className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-amber-700 text-sm">{currentUser?.credits} xu</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 shadow-sm">
                <Flame className="w-4 h-4 text-emerald-500" />
                <span className="font-bold text-emerald-700 text-sm">{computeStreak()} ngày</span>
              </div>
            </div>
          </motion.div>

        {/* Onboarding Guide in Feed - Compacted version */}
        {showOnboarding && onboardingQuests.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-brand-50 border border-brand-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-white text-brand-600 rounded-xl flex items-center justify-center shadow-sm border border-brand-100">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-[15px] leading-tight uppercase tracking-tight">
                      {currentUser?.role === 'new_employee' ? 'Hành trình Tân thủ 🚀' : 'Khám phá Hệ thống My iKame 🚀'}
                    </h3>
                    <p className="text-[10px] text-brand-600 font-medium uppercase tracking-wider">
                      {currentUser?.role === 'new_employee' ? 'Hướng dẫn:' : 'Gợi ý hành động:'}
                    </p>
                    <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
                      {onboardingPercent === 0 
                        ? (currentUser?.role === 'new_employee' ? 'Bắt đầu bằng cách tham gia Day One Tour cùng HR nhé!' : 'Thử nhấn "iCheck" ngay trên Dashboard để bắt đầu trải nghiệm!')
                        : `Bạn đã hoàn thành ${completedOnboarding}/${totalOnboarding} nhiệm vụ. Tiếp tục nào!`}
                    </p>
                    <div className="flex gap-2 mt-2">
                       <button onClick={() => navigate('/iquest')} className="text-[11px] font-bold text-brand-600 bg-brand-100/50 px-2 py-1 rounded-lg hover:bg-brand-100 transition-colors">Xem chi tiết nhiệm vụ</button>
                    </div>
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 bg-white/60 px-2 py-0.5 rounded-lg border border-brand-100">
                   <span className="text-xs font-semibold text-brand-700">{onboardingPercent}%</span>
                   <span className="text-[9px] font-medium text-slate-500 uppercase">Hoàn thành</span>
                </div>
              </div>

              {/* Progress Bar - Thinner */}
              <div className="w-full bg-white/60 rounded-full h-2 mb-4 overflow-hidden border border-brand-100 p-0.5">
                <motion.div initial={{ width: 0 }} animate={{ width: `${onboardingPercent}%` }} transition={{ duration: 1, delay: 0.5 }} className="bg-brand-gradient h-full rounded-full shadow-sm shadow-brand/40" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {onboardingQuests.slice(0, 4).map(q => (
                  <button key={q.id} onClick={() => window.location.href=`/iquest?questId=${q.id}`}
                    className="flex bg-white/80 hover:bg-white p-2.5 rounded-xl border border-brand-100 items-center justify-between transition-all hover:shadow-sm active:scale-[0.98] group">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors", q.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-100 group-hover:text-brand-600')}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <h4 className={cn("text-xs font-semibold truncate transition-colors text-left", q.status === 'completed' ? 'text-emerald-700' : 'text-slate-700 group-hover:text-brand-700')}>
                        {q.title}
                      </h4>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Post Creator */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm relative z-20">
          <div className="flex gap-3">
            <img src={currentUser?.avatar} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm bg-slate-50" referrerPolicy="no-referrer" />
            <div className="flex-1">
              <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} placeholder="Chia sẻ cập nhật, thành tích..."
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 rounded-xl p-3 resize-none transition-all text-sm font-medium" rows={2} />
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-1">
                  <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"><ImageIcon className="w-4 h-4" /></button>
                  <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"><Smile className="w-4 h-4" /></button>
                  <button onClick={() => setShowKudosModal(true)} className="flex items-center gap-1 p-2 text-amber-500 hover:bg-amber-50 rounded-lg text-xs font-bold transition-colors ml-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Gửi Kudos
                  </button>
                </div>
                <button onClick={handlePost} disabled={!newPostContent.trim()} className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 transition-colors disabled:opacity-40 active:scale-95 shadow-sm">
                  <Send className="w-4 h-4" /> Đăng
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feed Filters */}
        <div className="flex gap-2 p-1.5 bg-slate-50 border border-slate-200/60 rounded-xl overflow-x-auto no-scrollbar bg-white/80">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'pnod', label: 'Thông báo PnOD' },
            { id: 'kudos', label: 'Vinh danh' },
            { id: 'ai', label: 'Em Sen iKame' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFeedFilter(tab.id as any)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all",
                feedFilter === tab.id
                  ? "bg-white text-brand-600 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/80"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

          {filteredPosts.map((post, idx) => {
            const postUser = users.find(u => u.name === post.author.name);
            const userBadge = postUser?.equippedBadge ? badges.find(b => b.id === postUser.equippedBadge) : null;
            const isAiPost = post.type === 'ai_update';
            const isPnodPost = post.author.name.includes('PnOD');

            return (
              <motion.div key={post.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
                className={cn(
                  "rounded-2xl p-5 border shadow-sm card-hover relative overflow-hidden",
                  post.isPinned ? "border-brand-300 ring-2 ring-brand-500/10 bg-white" :
                    isAiPost ? "bg-gradient-to-br from-indigo-50/50 to-white border-indigo-100/60" :
                      isPnodPost ? "bg-gradient-to-br from-purple-50/50 to-white border-purple-100/60" :
                        "bg-white border-slate-200/60"
                )}>

                {/* Background Decoration for AI Posts */}
                {isAiPost && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/40 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                )}

                {/* Background Decoration for PnOD Posts */}
                {isPnodPost && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/40 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                )}

                {post.isPinned && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 bg-brand-50 text-brand-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-brand-100">
                    <TrendingUp className="w-3 h-3" /> Được ghim
                  </div>
                )}
                <div className="flex items-start justify-between mb-3 relative z-10">
                  <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setSelectedUserId(post.author.name)}>
                    <img src={post.author.avatar} alt="" className={cn("w-10 h-10 rounded-full object-cover", isAiPost ? "border-2 border-indigo-200 p-0.5" : isPnodPost ? "border-2 border-purple-200" : "")} referrerPolicy="no-referrer" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={cn("text-sm font-extrabold transition-colors", isAiPost ? "text-indigo-900 group-hover:text-indigo-600" : isPnodPost ? "text-purple-900 group-hover:text-purple-600" : "text-slate-900 group-hover:text-brand-600")}>{post.author.name}</span>
                        {isAiPost && <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[9px] font-black uppercase tracking-wider border border-indigo-200">✨ AI Assistant</span>}
                        {isPnodPost && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-black uppercase tracking-wider border border-purple-200">Chính thức</span>}
                        {post.badge && !isAiPost && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold border border-blue-100">{post.badge}</span>}

                        {userBadge && <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-bold border", userBadge.color)} title={userBadge.name}>{userBadge.icon} {userBadge.name}</span>}
                        {post.type === 'event' && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded text-[9px] font-bold border border-amber-100 uppercase">Sự kiện</span>}
                      </div>
                      <p className="text-[11px] text-slate-400">{post.author.title} · {post.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.type === 'achievement' && 'expEarned' in post && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-200">
                        <Zap className="w-3 h-3" /> +{post.expEarned} XP
                      </div>
                    )}
                    <button className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg"><MoreHorizontal className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {post.content.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                </p>

                {post.featuredUser && (
                  <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setSelectedUserId(post.featuredUser?.name || null)}>
                    <img src={post.featuredUser.avatar} alt="" className="w-12 h-12 rounded-full object-cover shadow-sm" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-sm text-slate-900">{post.featuredUser.name}</h5>
                      <p className="text-xs text-slate-500">{post.featuredUser.title}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors pointer-events-none">
                      Xem Profile
                    </button>
                  </div>
                )}

                {post.image && <img src={post.image} alt="" className="mt-4 rounded-2xl w-full h-auto object-cover border border-slate-100" referrerPolicy="no-referrer" />}

                {post.type === 'achievement' && post.expEarned && (
                  <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-bold">
                    <Trophy className="w-4 h-4" /> Hoàn thành mục tiêu: +{post.expEarned} EXP
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-slate-500 py-2 border-y border-slate-100 mb-2 mt-4">
                  <span className="font-medium">{post.likes} lượt thích</span>
                  <span>{post.comments} bình luận</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleLike(post.id)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${post.isLiked ? 'text-rose-600 bg-rose-50' : 'text-slate-600 hover:bg-slate-50'}`}>
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500' : ''}`} /> {post.isLiked ? 'Đã thích' : 'Thích'}
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium"><MessageCircle className="w-4 h-4" /> Bình luận</button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium"><Share2 className="w-4 h-4" /> Chia sẻ</button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* ---------------- RIGHT COLUMN: SIDEBAR WIDGETS (35%) ---------------- */}
        <div className="lg:col-span-4 space-y-5">
          {/* Compact Profile Card */}
          <motion.div id="tour-profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full pointer-events-none -mr-10 -mt-10" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <img src={currentUser?.avatar} alt="" className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md bg-slate-50" referrerPolicy="no-referrer" />
                  <div className="absolute -bottom-1 -right-1 bg-brand-gradient text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg border-2 border-white flex items-center shadow-sm">
                    Lv.{currentUser?.level}
                  </div>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{currentUser?.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">{currentUser?.title}</p>
                  {isNewEmployee && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-bold shadow-sm">🌱 Nhân viên mới</span>
                  )}
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-100/60">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5"><Star className="w-4 h-4 text-emerald-500" /> Kinh nghiệm</span>
                  <span className="font-bold text-emerald-700">{currentUser?.exp} / {currentUser?.maxExp}</span>
                </div>
                <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${((currentUser?.exp || 0) / (currentUser?.maxExp || 1)) * 100}%` }} transition={{ duration: 1.5, ease: 'easeOut' }} className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full" />
                </div>
                
                <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5"><Coins className="w-4 h-4 text-amber-500" /> iKame Coin</span>
                  <span className="font-bold text-amber-600">{currentUser?.credits}</span>
                </div>
              </div>

              <button onClick={handleCheckIn} className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-extrabold text-[15px] text-white transition-all shadow-md active:scale-95 ${todayCheckedIn ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-brand-gradient hover:opacity-90 animate-pulse-glow'}`}>
                <Clock className="w-5 h-5" /> {todayCheckedIn ? '✅ Đã iCheck hôm nay' : 'iCheck Ngay'}
              </button>
            </div>
          </motion.div>

          {/* AI Assistant Widget */}
          <AIAssistantWidget />

          {/* Birthday Section */}
          {!isNewEmployee && birthdayCelebrations.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden relative">
              <div className="absolute -right-2 top-0 text-5xl opacity-5 pointer-events-none">🎂</div>
              <div className="px-5 py-3 border-b border-rose-100 flex items-center gap-2 bg-rose-50/50">
                <Cake className="w-4 h-4 text-rose-500" />
                <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Sinh nhật hôm nay</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {birthdayCelebrations.map(c => (
                  <div key={c.id} className="px-5 py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={c.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-100" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-slate-900">{c.user.name}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{c.user.department}</p>
                      </div>
                    </div>
                    {!c.hasWished ? (
                      <div className="flex gap-2">
                        <input
                          value={wishInputs[c.id] || ''}
                          onChange={e => setWishInputs(prev => ({ ...prev, [c.id]: e.target.value }))}
                          placeholder="Gửi lời chúc mừng..."
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20 transition-all"
                        />
                        <button onClick={() => handleSendCustomWish(c.id)}
                          className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition-colors shadow-sm active:scale-95 flex-shrink-0">
                          Gửi
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 py-1.5 justify-center rounded-xl shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã gửi lời chúc
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Anniversary Section */}
          {!isNewEmployee && anniversaryCelebrations.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden relative">
              <div className="absolute -right-2 top-0 text-5xl opacity-5 pointer-events-none">🏅</div>
              <div className="px-5 py-3 border-b border-amber-100 flex items-center gap-2 bg-amber-50/50">
                <Medal className="w-4 h-4 text-amber-500" />
                <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">Chúc mừng thâm niên</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {anniversaryCelebrations.map(c => (
                  <div key={c.id} className="px-5 py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={c.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-100" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          {c.user.name} 
                          <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md">{c.years} năm</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{c.user.department}</p>
                      </div>
                    </div>
                    {!c.hasWished ? (
                      <div className="flex gap-2">
                        <input
                          value={wishInputs[c.id] || ''}
                          onChange={e => setWishInputs(prev => ({ ...prev, [c.id]: e.target.value }))}
                          placeholder="Chia sẻ niềm vui..."
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        />
                        <button onClick={() => handleSendCustomWish(c.id)}
                          className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors shadow-sm active:scale-95 flex-shrink-0">
                          Gửi
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 py-1.5 justify-center rounded-xl shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã gửi lời chúc
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Leaderboard - Tucked into Sidebar */}
          <motion.div id="tour-leaderboard" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-[12px] uppercase tracking-[0.1em] text-slate-900 flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" /> Bảng xếp hạng</h3>
            </div>

            <div className="flex gap-1 mb-3 bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button onClick={() => setLeaderboardType('personal')} className={cn("flex-1 py-1.5 text-xs font-bold rounded-lg transition-all", leaderboardType === 'personal' ? 'bg-white text-brand-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700')}>Cá nhân</button>
              <button onClick={() => setLeaderboardType('team')} className={cn("flex-1 py-1.5 text-xs font-bold rounded-lg transition-all", leaderboardType === 'team' ? 'bg-white text-brand-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700')}>Phòng ban</button>
            </div>
            <div className="flex gap-1 mb-4">
              {(['weekly', 'monthly'] as const).map(tab => (
                <button key={tab} onClick={() => setLeaderboardTab(tab)} className={cn("flex-1 py-1 text-[11px] font-bold rounded-lg transition-all", leaderboardTab === tab ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100")}>{tab === 'weekly' ? 'Tuần' : 'Tháng'}</button>
              ))}
            </div>

            <div className="space-y-2">
              {currentLeaderboard.slice(0, 5).map((u: any, i) => (
                <div key={i} onClick={() => leaderboardType === 'personal' && setSelectedUserId(u.name)} className={cn("flex items-center gap-3 p-2 rounded-xl transition-colors -mx-2", leaderboardType === 'personal' ? "hover:bg-slate-50 cursor-pointer group" : "")}>
                  <span className={cn("text-center w-6 font-bold flex-shrink-0", i < 3 ? "text-lg" : "text-xs text-slate-400 mt-1")}>{i < 3 ? medals[i] : `#${i + 1}`}</span>
                  <img src={u.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-100 shadow-sm" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-bold text-[13px] text-slate-900 truncate transition-colors", leaderboardType === 'personal' && "group-hover:text-brand-600")}>{u.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {leaderboardType === 'personal' ? (
                        <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-100">Lv.{u.level}</span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">{u.memberCount} người</span>
                      )}
                      <span className="text-[10px] text-slate-500 font-medium tracking-wide">{u.exp} XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-2 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors">Xem toàn bộ bảng xếp hạng</button>
          </motion.div>

          {/* Events */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
            <h3 className="font-extrabold mb-4 text-[12px] uppercase tracking-[0.1em] text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-500" /> Sự kiện sắp tới
            </h3>
            <div className="space-y-3">
              {[
                { day: 'Th 4', date: '25', title: 'Townhall Q1', time: '14:00 - 16:00', color: 'text-brand-500' },
                { day: 'Th 6', date: '27', title: 'Happy Hour', time: '16:30 - 18:00', color: 'text-amber-500' },
              ].map((evt, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:bg-white transition-all cursor-pointer group shadow-sm">
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-white rounded-xl border border-slate-100 flex-shrink-0 shadow-sm">
                    <span className={`text-[9px] font-black ${evt.color} uppercase tracking-wider`}>{evt.day}</span>
                    <span className="text-lg font-black text-slate-900 leading-none mt-0.5">{evt.date}</span>
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <h4 className="font-bold text-[14px] text-slate-900 group-hover:text-brand-600 transition-colors truncate">{evt.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" /> {evt.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Online colleagues */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
            <h3 className="font-extrabold mb-4 text-[12px] uppercase tracking-[0.1em] text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" /> Đồng nghiệp Online
            </h3>
            <div className="flex -space-x-2.5 mb-3 px-2 mt-1">
              {['https://picsum.photos/seed/manager1/150/150', 'https://picsum.photos/seed/user3/150/150', 'https://picsum.photos/seed/user4/150/150', 'https://picsum.photos/seed/user5/150/150', 'https://picsum.photos/seed/user6/150/150'].map((avatar, i) => (
                <img key={i} src={avatar} alt="" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm ring-1 ring-slate-100" referrerPolicy="no-referrer" />
              ))}
              <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-600 ring-1 ring-slate-100 shadow-sm z-10">+12</div>
            </div>
            <p className="text-xs text-slate-500 font-medium">Có <strong>17</strong> nhân viên đang hoạt động</p>
          </motion.div>
        </div>
      </div>

      <Modal isOpen={showKudosModal} onClose={() => setShowKudosModal(false)} title="Vinh danh & Ghi nhận" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Đồng nghiệp</label>
            <input value={kudosRecipient} onChange={e => setKudosRecipient(e.target.value)} placeholder="Tên đồng nghiệp..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Lời cảm ơn</label>
            <textarea value={kudosMessage} onChange={e => setKudosMessage(e.target.value)} placeholder="Chia sẻ lý do bạn biết ơn họ..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 resize-none h-24" />
          </div>
          <button onClick={handleSendKudos} disabled={!kudosRecipient.trim() || !kudosMessage.trim()} className="w-full py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 disabled:opacity-50">Gửi Kudos</button>
        </div>
      </Modal>

      <PublicProfileModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
    </div>
  );
};

