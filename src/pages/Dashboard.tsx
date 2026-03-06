import React, { useState } from 'react';
import { useAuthStore, useAppStore } from '../store';
import { Trophy, Star, TrendingUp, Clock, Heart, MessageCircle, Share2, Image as ImageIcon, Smile, Send, Calendar, Award, MoreHorizontal, Zap, ArrowUpRight, Coins, Flame, Sparkles, ChevronRight, CheckCircle2, Users, Cake, Medal, PartyPopper, Rocket } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import { Modal } from '../components/UI';

export const Dashboard = () => {
  const { currentUser } = useAuthStore();
  const { addExp, addToast, checkIn, todayCheckedIn, celebrations, sendWish, quests, attendanceRecords, posts, addPost, toggleLikePost } = useAppStore();
  const [newPostContent, setNewPostContent] = useState('');
  const [leaderboardTab, setLeaderboardTab] = useState<'weekly' | 'monthly'>('weekly');

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
  const leaderboard = leaderboardData[leaderboardTab];
  const medals = ['🥇', '🥈', '🥉', '4', '5'];

  const [wishInputs, setWishInputs] = useState<Record<number, string>>({});

  const sortedPosts = [...posts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const handleLike = (id: number) => toggleLikePost(id);
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

  // birthday & anniversary lists
  const birthdayCelebrations = celebrations.filter(c => c.type === 'birthday');
  const anniversaryCelebrations = celebrations.filter(c => c.type === 'anniversary');

  // Onboarding progress
  const onboardingQuests = quests.filter(q => q.tabId === 'onboarding');
  const completedOnboarding = onboardingQuests.filter(q => q.status === 'completed').length;
  const totalOnboarding = onboardingQuests.length;
  const onboardingPercent = totalOnboarding > 0 ? Math.round((completedOnboarding / totalOnboarding) * 100) : 0;

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
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-brand-gradient rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 pointer-events-none" />
        <div className="relative z-10">
          <p className="text-orange-100 text-sm font-medium mb-1">{format(new Date(), 'EEEE, dd/MM/yyyy')}</p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">{greeting}, {currentUser?.name?.split(' ').pop() || 'bạn'} 👋</h1>
          <p className="text-orange-100 text-sm max-w-lg">Hãy bắt đầu một ngày làm việc hiệu quả và kiếm thêm EXP!</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 border border-slate-200/60 card-hover group cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition-colors" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{card.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{card.label} · <span className="text-slate-400">{card.sub}</span></p>
            </motion.div>
          );
        })}
      </div>

      {/* Main 3-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left */}
        <div className="lg:col-span-3 space-y-5 hidden lg:block">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
            <div className="text-center">
              <div className="relative inline-block mb-3">
                <img src={currentUser?.avatar} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" referrerPolicy="no-referrer" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-brand-gradient text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border-2 border-white whitespace-nowrap flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" /> Lv.{currentUser?.level}
                </div>
              </div>
              <h3 className="font-bold text-slate-900">{currentUser?.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{currentUser?.title}</p>
              {isNewEmployee && (
                <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold">🌱 Nhân viên mới</span>
              )}
            </div>
            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Kinh nghiệm</span><span className="text-brand-600 font-bold">{currentUser?.exp} / {currentUser?.maxExp}</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${((currentUser?.exp || 0) / (currentUser?.maxExp || 1)) * 100}%` }} transition={{ duration: 1.5, ease: 'easeOut' }} className="bg-brand-gradient h-full rounded-full" />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-slate-500 text-xs">Credits</span>
                <span className="font-bold text-amber-600 flex items-center gap-1 text-sm"><Star className="w-4 h-4 fill-amber-500" /> {currentUser?.credits}</span>
              </div>
            </div>
            <button onClick={handleCheckIn} className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-all active:scale-95 ${todayCheckedIn ? 'bg-emerald-500' : 'bg-brand-gradient shadow-brand animate-pulse-glow'}`}>
              <Clock className="w-4 h-4" /> {todayCheckedIn ? '✅ Đã iCheck hôm nay' : 'iCheck ngay'}
            </button>
          </motion.div>

          {/* Leaderboard */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" /> Bảng xếp hạng</h3>
            </div>
            <div className="flex gap-1 mb-3">
              {(['weekly', 'monthly'] as const).map(tab => (
                <button key={tab} onClick={() => setLeaderboardTab(tab)}
                  className={cn("flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all",
                    leaderboardTab === tab ? "bg-brand-gradient text-white shadow-sm" : "text-slate-500 hover:bg-slate-50")}>
                  {tab === 'weekly' ? 'Tuần' : 'Tháng'}
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              {leaderboard.map((u, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors -mx-2 cursor-pointer">
                  <span className={cn("text-center w-6 font-bold", i < 3 ? "text-lg" : "text-xs text-slate-400")}>{i < 3 ? medals[i] : `#${i + 1}`}</span>
                  <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[12px] text-slate-900 truncate">{u.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded">Lv.{u.level}</span>
                      <span className="text-[10px] text-slate-400">{u.exp} XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Feed */}
        <div className="lg:col-span-6 space-y-5">
          {/* New Employee Onboarding Guide in Feed */}
          {isNewEmployee && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-brand-50 border border-brand-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center shadow-sm">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900">Bắt đầu hành trình iKame! 🚀</h3>
                    <p className="text-xs text-brand-600 font-medium mt-0.5">Nhiệm vụ Onboarding dành riêng cho bạn</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  Chào mừng bạn gia nhập! Dưới đây là các bước tiếp theo để bạn làm quen với đồng nghiệp và hệ thống. Thực hiện ngay để tích lũy EXP nhé.
                </p>
                <div className="space-y-2 mb-4">
                  {onboardingQuests.slice(0, 3).map(q => (
                    <div key={q.id} className="bg-white p-3 rounded-xl border border-brand-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className={cn("w-5 h-5 flex-shrink-0", q.status === 'completed' ? 'text-emerald-500' : 'text-slate-300')} />
                        <div>
                          <p className={cn("text-sm font-bold", q.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-900')}>{q.title}</p>
                          <p className="text-xs text-slate-500">{q.desc}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 whitespace-nowrap">+{q.exp} EXP</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => window.location.href = '/iquest'} className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-brand-600 text-white font-bold text-sm rounded-xl hover:bg-brand-700 transition active:scale-95">
                  <Award className="w-4 h-4" /> Tham gia iQuest để xem chi tiết
                </button>
              </div>
            </motion.div>
          )}

          {/* Birthday Section */}
          {!isNewEmployee && birthdayCelebrations.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <Cake className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-sm text-slate-900">🎂 Chúc mừng sinh nhật</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {birthdayCelebrations.map(c => (
                  <div key={c.id} className="px-5 py-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="relative flex-shrink-0">
                        <img src={c.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                        <div className="absolute -bottom-1 -right-1 text-base">🎂</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-slate-900">{c.user.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{c.user.title} · {c.user.department}</p>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">Hôm nay</div>
                    </div>
                    {!c.hasWished ? (
                      <div className="flex gap-2">
                        <input
                          value={wishInputs[c.id] || ''}
                          onChange={e => setWishInputs(prev => ({ ...prev, [c.id]: e.target.value }))}
                          placeholder="Nhập lời chúc..."
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:border-brand-400"
                        />
                        <button onClick={() => handleSendCustomWish(c.id)}
                          className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-[11px] font-bold hover:bg-brand-700 transition-colors shadow-sm">
                          Gửi
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold bg-emerald-50 py-1.5 justify-center rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Bạn đã gửi lời chúc
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Anniversary Section */}
          {!isNewEmployee && anniversaryCelebrations.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <Medal className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900">🏅 Chúc mừng thâm niên</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {anniversaryCelebrations.map(c => (
                  <div key={c.id} className="px-5 py-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="relative flex-shrink-0">
                        <img src={c.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                        <div className="absolute -bottom-1 -right-1 text-base">🏅</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-slate-900">{c.user.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-200">{c.years} năm</span>
                          <p className="text-[10px] text-slate-500 truncate">{c.user.title}</p>
                        </div>
                      </div>
                    </div>
                    {!c.hasWished ? (
                      <div className="flex gap-2">
                        <input
                          value={wishInputs[c.id] || ''}
                          onChange={e => setWishInputs(prev => ({ ...prev, [c.id]: e.target.value }))}
                          placeholder="Chia sẻ niềm vui..."
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:border-brand-400"
                        />
                        <button onClick={() => handleSendCustomWish(c.id)}
                          className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-[11px] font-bold hover:bg-amber-700 transition-colors shadow-sm">
                          Gửi
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold bg-emerald-50 py-1.5 justify-center rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã gửi lời chúc
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Post Creator */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
            <div className="flex gap-3">
              <img src={currentUser?.avatar} alt="" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
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
                  <button onClick={handlePost} disabled={!newPostContent.trim()} className="flex items-center gap-2 px-5 py-2 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 transition-colors disabled:opacity-40 active:scale-95">
                    <Send className="w-4 h-4" /> Đăng
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {sortedPosts.map((post, idx) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
              className={cn("bg-white rounded-2xl p-5 border shadow-sm card-hover relative", post.isPinned ? "border-brand-300 ring-2 ring-brand-500/10" : "border-slate-200/60")}>
              {post.isPinned && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 bg-brand-50 text-brand-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-brand-100">
                  <TrendingUp className="w-3 h-3" /> Được ghim
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img src={post.author.avatar} alt="" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900">{post.author.name}</span>
                      {post.type?.startsWith('ai_') && <span className="px-1.5 py-0.5 bg-brand-50 text-brand-600 rounded text-[9px] font-black uppercase tracking-wider border border-brand-100">AI</span>}
                      {post.badge && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold border border-blue-100">{post.badge}</span>}
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
                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
                  <img src={post.featuredUser.avatar} alt="" className="w-12 h-12 rounded-full object-cover shadow-sm" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-sm text-slate-900">{post.featuredUser.name}</h5>
                    <p className="text-xs text-slate-500">{post.featuredUser.title}</p>
                  </div>
                  <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">
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
          ))}
        </div>

        {/* Right */}
        <div className="lg:col-span-3 space-y-5">
          {/* Onboarding Progress */}
          {isNewEmployee && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-brand-50 to-orange-50 rounded-2xl p-5 border border-brand-200/60 shadow-sm">
              <h3 className="font-bold mb-3 text-xs uppercase tracking-widest text-brand-500 flex items-center gap-2">
                <Award className="w-4 h-4" /> Onboarding
              </h3>
              <div className="text-center mb-3">
                <p className="text-3xl font-extrabold text-brand-600">{onboardingPercent}%</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{completedOnboarding}/{totalOnboarding} nhiệm vụ đã hoàn thành</p>
              </div>
              <div className="w-full bg-white rounded-full h-3 overflow-hidden border border-brand-100">
                <motion.div initial={{ width: 0 }} animate={{ width: `${onboardingPercent}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="bg-brand-gradient h-full rounded-full" />
              </div>
              <div className="mt-3 space-y-1.5">
                {onboardingQuests.slice(0, 4).map(q => (
                  <div key={q.id} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className={cn("w-3.5 h-3.5 flex-shrink-0", q.status === 'completed' ? 'text-emerald-500' : 'text-slate-300')} />
                    <span className={cn("truncate", q.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700 font-medium')}>{q.title}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <a href="/iquest" className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors shadow-brand active:scale-95">
                  Làm nhiệm vụ tiếp <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          )}

          {/* Events */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
            <h3 className="font-bold mb-4 text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2"><Calendar className="w-4 h-4 text-brand-500" /> Sự kiện sắp tới</h3>
            <div className="space-y-3">
              {[
                { day: 'Th 4', date: '25', title: 'Townhall Q1', time: '14:00-16:00', color: 'text-rose-500' },
                { day: 'Th 6', date: '27', title: 'Happy Hour', time: '16:30-18:00', color: 'text-brand-500' },
              ].map((evt, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all cursor-pointer group">
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-white rounded-xl border border-slate-200 flex-shrink-0 shadow-sm">
                    <span className={`text-[9px] font-bold ${evt.color} uppercase tracking-wider`}>{evt.day}</span>
                    <span className="text-lg font-extrabold text-slate-900 leading-none mt-0.5">{evt.date}</span>
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-brand-600">{evt.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {evt.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Online colleagues */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
            <h3 className="font-bold mb-3 text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" /> Đồng nghiệp online
            </h3>
            <div className="flex -space-x-2">
              {['https://picsum.photos/seed/manager1/150/150', 'https://picsum.photos/seed/user3/150/150', 'https://picsum.photos/seed/user4/150/150', 'https://picsum.photos/seed/user5/150/150', 'https://picsum.photos/seed/user6/150/150'].map((avatar, i) => (
                <img key={i} src={avatar} alt="" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" referrerPolicy="no-referrer" />
              ))}
              <div className="w-9 h-9 rounded-full bg-brand-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-brand-600">+12</div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">17 nhân viên đang hoạt động</p>
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

    </div>
  );
};
