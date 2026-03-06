import React, { useState } from 'react';
import { useAuthStore, useAppStore } from '../store';
import { Star, CheckCircle2, ArrowRight, Plus, Clock, Trophy, Gift, Target, PlayCircle, Zap, Users, Flame, Crown, Gem, AlertCircle, GraduationCap, Calendar, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader, Modal, Field, inputClass, StatusBadge, EmptyState } from '../components/UI';
import { cn } from '../utils';

type TabId = 'daily' | 'weekly' | 'monthly' | 'onboarding' | 'events';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'onboarding', label: 'Onboarding', icon: '🎓' },
  { id: 'daily', label: 'Hàng ngày', icon: '☀️' },
  { id: 'weekly', label: 'Hàng tuần', icon: '📅' },
  { id: 'monthly', label: 'Hàng tháng', icon: '🗓️' },
  { id: 'events', label: 'Sự kiện', icon: '⭐' },
];

const RARITY_CONFIG = {
  common: { label: 'Common', icon: '🔵', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', extra: '' },
  rare: { label: 'Hiếm', icon: '🔥', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', extra: '' },
  epic: { label: 'Sử thi', icon: '👑', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', extra: '' },
  legendary: { label: 'Huyền thoại', icon: '💎', color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-200', extra: 'shadow-brand' },
};

export const Contributions = () => {
  const { currentUser } = useAuthStore();
  const { quests, submitQuestReport, approveQuest, addToast } = useAppStore();
  const isNewEmployee = currentUser?.role === 'new_employee';
  const defaultTab: TabId = isNewEmployee ? 'onboarding' : 'daily';
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<typeof quests[0] | null>(null);
  const [reportTitle, setReportTitle] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [showIntro, setShowIntro] = useState(true);

  const isManager = currentUser?.role === 'manager' || currentUser?.role === 'admin';
  const filtered = quests.filter(q => q.tabId === activeTab);
  const pendingApproval = quests.filter(q => q.status === 'submitted');

  const completedCount = quests.filter(q => q.status === 'completed').length;
  const milestoneTarget = quests.length;
  const completedEXP = quests.filter(q => q.status === 'completed').reduce((a, q) => a + q.exp, 0);

  // Onboarding progress
  const onboardingQuests = quests.filter(q => q.tabId === 'onboarding');
  const completedOnboarding = onboardingQuests.filter(q => q.status === 'completed').length;
  const totalOnboarding = onboardingQuests.length;
  const onboardingPercent = totalOnboarding > 0 ? Math.round((completedOnboarding / totalOnboarding) * 100) : 0;
  const allOnboardingDone = completedOnboarding === totalOnboarding && totalOnboarding > 0;

  const handleOpenSubmit = (quest: typeof quests[0]) => {
    setSelectedQuest(quest);
    setReportTitle(quest.title);
    setReportDesc('');
    setShowSubmitModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDesc.trim()) { addToast({ type: 'error', title: 'Mô tả không được để trống!' }); return; }
    if (selectedQuest) submitQuestReport(selectedQuest.id, reportTitle, reportDesc);
    setShowSubmitModal(false);
    setSelectedQuest(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={<Star className="w-6 h-6 text-white" />} title="iQuest"
        subtitle="Nhiệm vụ Gamification — Hoàn thành để nhận EXP & Credits"
        gradient="bg-brand-gradient"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-bold">
              <Zap className="w-4 h-4" /> {completedEXP} EXP kiếm được
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 bg-brand-50 border border-brand-200 text-brand-700 rounded-xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" /> {completedCount}/{milestoneTarget} quest
            </div>
          </div>
        }
      />

      {/* Manager Approve Panel */}
      {isManager && pendingApproval.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-3"><AlertCircle className="w-5 h-5" /> {pendingApproval.length} báo cáo chờ duyệt</h3>
          <div className="space-y-3">
            {pendingApproval.map(q => (
              <div key={q.id} className="bg-white rounded-xl p-4 border border-amber-200 flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm">{q.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">+{q.exp} EXP · +{q.credits} Credits</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approveQuest(q.id, true)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700">✅ Duyệt</button>
                  <button onClick={() => approveQuest(q.id, false)} className="px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold hover:bg-rose-200">❌ Từ chối</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Milestone */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="relative bg-gradient-to-r from-brand-600 via-purple-600 to-pink-600 rounded-2xl p-5 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-amber-300" />
              <span className="font-bold text-white/90 text-sm">Milestone tiến độ</span>
            </div>
            <p className="text-2xl font-extrabold">{completedCount} / {milestoneTarget} quests</p>
            <p className="text-brand-100 text-xs mt-0.5">Hoàn thành tất cả để nhận 500 Credits bonus!</p>
          </div>
          <div className="flex-1 max-w-xs">
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(completedCount / milestoneTarget) * 100}%` }}
                transition={{ duration: 1.5 }} className="h-full bg-white rounded-full shadow-sm" />
            </div>
            <p className="text-right text-brand-100 text-xs mt-1 font-bold">{Math.round((completedCount / milestoneTarget) * 100)}%</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(tab => {
          const isLocked = isNewEmployee && !allOnboardingDone && tab.id !== 'onboarding';
          return (
            <button key={tab.id}
              onClick={() => {
                if (isLocked) {
                  addToast({ type: 'warning', title: '🔒 Tab bị khóa', message: 'Hoàn thành tất cả nhiệm vụ onboarding để mở khóa!' });
                  return;
                }
                setActiveTab(tab.id);
              }}
              className={cn("flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all relative",
                activeTab === tab.id ? 'bg-brand-gradient text-white shadow-brand' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-300',
                tab.id === 'onboarding' && activeTab !== tab.id && isNewEmployee && 'border-amber-300 bg-amber-50 text-amber-700',
                isLocked && 'opacity-50 cursor-not-allowed')}>
              {isLocked && <Lock className="w-3 h-3" />}
              {tab.icon} {tab.label}
              {tab.id === 'onboarding' && isNewEmployee && activeTab !== tab.id && (
                <span className="ml-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Lock Banner for new employees */}
      {isNewEmployee && !allOnboardingDone && activeTab !== 'onboarding' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
          <Lock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h3 className="font-bold text-amber-900 mb-1">Tính năng đang bị khóa</h3>
          <p className="text-sm text-amber-700">Hoàn thành tất cả <strong>{totalOnboarding}</strong> nhiệm vụ onboarding để mở khóa hệ thống nhiệm vụ đầy đủ.</p>
          <button onClick={() => setActiveTab('onboarding')}
            className="mt-3 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors">
            Quay về Onboarding
          </button>
        </motion.div>
      )}

      {/* Onboarding Journey Banner */}
      {activeTab === 'onboarding' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-brand-50 via-violet-50 to-fuchsia-50 rounded-2xl p-6 border border-brand-200/60">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-brand-gradient rounded-2xl flex items-center justify-center shadow-brand">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Hành trình Tân thủ 🚀</h3>
              <p className="text-sm text-slate-500">Hoàn thành tất cả nhiệm vụ để bắt đầu hành trình tuyệt vời tại iKame!</p>
            </div>
          </div>

          {/* Step tracker */}
          <div className="flex items-center gap-1 mb-3">
            {onboardingQuests.map((q, i) => (
              <React.Fragment key={q.id}>
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-all",
                  q.status === 'completed' ? 'bg-emerald-500 text-white' :
                    q.status === 'in-progress' ? 'bg-brand-500 text-white animate-pulse' :
                      'bg-slate-200 text-slate-500')}>
                  {q.status === 'completed' ? '✓' : i + 1}
                </div>
                {i < onboardingQuests.length - 1 && (
                  <div className={cn("flex-1 h-0.5 rounded-full min-w-[8px]",
                    q.status === 'completed' ? 'bg-emerald-400' : 'bg-slate-200')} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-brand-600">{onboardingPercent}% hoàn thành</span>
              <span className="text-xs text-slate-500">({completedOnboarding}/{totalOnboarding} nhiệm vụ)</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
              <Zap className="w-3.5 h-3.5" /> +{onboardingQuests.reduce((a, q) => a + q.exp, 0)} EXP có thể kiếm
            </div>
          </div>
          <div className="mt-2 w-full bg-white rounded-full h-2.5 overflow-hidden border border-brand-100">
            <motion.div initial={{ width: 0 }} animate={{ width: `${onboardingPercent}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="bg-brand-gradient h-full rounded-full" />
          </div>
        </motion.div>
      )}

      {/* Quest Cards */}
      {filtered.length === 0 ? (
        <EmptyState icon={<Star className="w-8 h-8" />} title="Không có quest nào" description={`Tab "${TABS.find(t => t.id === activeTab)?.label}" hiện chưa có nhiệm vụ.`} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((quest, i) => {
            const rarity = RARITY_CONFIG[quest.rarity];
            const pct = quest.target > 0 ? Math.round((quest.progress / quest.target) * 100) : 0;
            const canSubmit = quest.status === 'pending' || quest.status === 'in-progress';
            const canRetry = quest.status === 'rejected';
            return (
              <motion.div key={quest.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className={cn("bg-white rounded-2xl p-5 border card-hover relative overflow-hidden", rarity.border, rarity.extra)}>
                {/* Rarity badge */}
                <div className={cn("absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold", rarity.bg, rarity.color)}>
                  {rarity.icon} {rarity.label}
                </div>

                <div className="mb-3 pr-20">
                  <h3 className="font-bold text-slate-900">{quest.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{quest.desc}</p>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-500">Tiến độ</span>
                    <span className="font-extrabold text-brand-600">{quest.progress}/{quest.target}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }}
                      className={cn("h-full rounded-full", quest.status === 'completed' ? 'bg-emerald-500' : 'bg-brand-500')} />
                  </div>
                </div>

                {/* Rewards + Deadline */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="flex items-center gap-1 px-2 py-1 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold"><Zap className="w-3 h-3" /> +{quest.exp} EXP</span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold"><Star className="w-3 h-3 fill-amber-500" /> +{quest.credits} Credits</span>
                  {quest.deadline && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold ml-auto"><Calendar className="w-3 h-3" /> {quest.deadline}</span>
                  )}
                </div>

                {/* Action */}
                <div className="flex items-center justify-between">
                  <StatusBadge status={quest.status as any} />
                  {(canSubmit || canRetry) && (
                    <button onClick={() => handleOpenSubmit(quest)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors active:scale-95">
                      <PlayCircle className="w-3.5 h-3.5" /> {canRetry ? 'Nộp lại' : 'Nộp báo cáo'}
                    </button>
                  )}
                  {quest.status === 'completed' && (
                    <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold"><CheckCircle2 className="w-4 h-4" /> Hoàn thành</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Submit Modal */}
      <Modal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="Nộp báo cáo quest" size="md">
        {selectedQuest && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl">
              <p className="font-bold text-brand-800 text-sm">{selectedQuest.title}</p>
              <p className="text-xs text-brand-600 mt-0.5">{selectedQuest.desc}</p>
            </div>
            <Field label="Tiêu đề báo cáo" required>
              <input value={reportTitle} onChange={e => setReportTitle(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Mô tả chi tiết kết quả" required>
              <textarea value={reportDesc} onChange={e => setReportDesc(e.target.value)} rows={4} className={inputClass}
                placeholder="Mô tả những gì bạn đã làm, kết quả đạt được, bằng chứng..." />
            </Field>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowSubmitModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200">Hủy</button>
              <button type="submit" className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-brand">Gửi báo cáo</button>
            </div>
          </form>
        )}
      </Modal>

      {/* Intro Modal */}
      <Modal isOpen={showIntro} onClose={() => setShowIntro(false)} title="Chào mừng đến với iQuest! ⚔️" size="md">
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-brand rotate-3">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Hệ thống Nhiệm vụ & Phần thưởng</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Hoàn thành các nhiệm vụ trong iQuest để giúp bạn phát triển, kết nối và nhận được những phần thưởng xứng đáng.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start gap-4 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
                ⚡
              </div>
              <div>
                <h4 className="font-bold text-orange-900 text-sm">Điểm EXP (Kinh nhiệm)</h4>
                <p className="text-xs text-orange-700/80 mt-1 leading-relaxed">
                  Dùng để tăng Level nhân vật của bạn. Level càng cao, bạn càng mở khóa được nhiều đặc quyền, skin hiếm và vị trí cao trên Bảng xếp hạng icheck-in.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-brand-50 border border-brand-100 rounded-2xl">
              <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
                💰
              </div>
              <div>
                <h4 className="font-bold text-brand-900 text-sm">iKame Coin (Credits)</h4>
                <p className="text-xs text-brand-700/80 mt-1 leading-relaxed">
                  Đồng tiền ảo dùng để mua sắm trong <strong>iReward</strong>. Bạn có thể đổi lấy voucher GotIt, quà tặng thương hiệu iKame, hoặc các vật phẩm hữu ích khác.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3">Làm sao để kiếm được?</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Hoàn thành iQuest hàng ngày, tuần, tháng
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tham gia các sự kiện nội bộ công ty
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tương tác và tích cực trên News Feed
              </li>
            </ul>
          </div>

          <button onClick={() => setShowIntro(false)}
            className="w-full py-4 bg-brand-gradient text-white rounded-2xl font-bold hover:shadow-brand transition-all active:scale-95">
            Bắt đầu khám phá ngay!
          </button>
        </div>
      </Modal>
    </div>
  );
};
