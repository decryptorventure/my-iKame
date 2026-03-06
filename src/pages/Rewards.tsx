import React, { useState } from 'react';
import { useAuthStore, useAppStore } from '../store';
import { Gift, Star, Coffee, Plane, ShoppingBag, Ticket, Zap, X, ShieldCheck, Sparkles, Clock, Package, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader, Modal, StatusBadge, EmptyState } from '../components/UI';
import { cn } from '../utils';

const REWARDS = [
  { id: 1, title: 'Voucher Coffee Highlands', desc: '1 ly nước bất kỳ tại Highlands Coffee', cost: 50, icon: Coffee, gradient: 'from-amber-500 to-orange-600', tag: 'Hot', stock: 20, category: 'food' },
  { id: 2, title: 'iKame Remote Day', desc: '1 ngày WFH extra (áp dụng T2-T6)', cost: 80, icon: Plane, gradient: 'from-brand-500 to-purple-600', tag: 'Premium', stock: 5, category: 'benefit' },
  { id: 3, title: 'Grab Card 100K', desc: 'Thẻ Grab trị giá 100.000đ', cost: 120, icon: ShoppingBag, gradient: 'from-emerald-500 to-teal-600', tag: 'New', stock: 15, category: 'voucher' },
  { id: 4, title: 'Book Voucher 200K', desc: 'Mua sách tại Fahasa/Tiki, trị giá 200K', cost: 150, icon: Star, gradient: 'from-rose-500 to-pink-600', tag: null, stock: 8, category: 'learning' },
  { id: 5, title: 'Gaming Top-up 50K', desc: 'Nạp thẻ game bất kỳ 50.000đ', cost: 60, icon: Ticket, gradient: 'from-violet-500 to-purple-600', tag: 'Hot', stock: 30, category: 'entertainment' },
  { id: 6, title: 'Thêm 1 ngày phép năm', desc: 'Thêm 1 ngày nghỉ phép năm (áp dụng trong quý)', cost: 300, icon: Gift, gradient: 'from-brand-600 to-blue-600', tag: 'Premium', stock: 3, category: 'benefit' },
];

const TAG_STYLE: Record<string, string> = {
  Hot: 'bg-rose-100 text-rose-700 border-rose-200',
  Premium: 'bg-purple-100 text-purple-700 border-purple-200',
  New: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export const Rewards = () => {
  const { currentUser } = useAuthStore();
  const { spendCredits, addToast, addRewardHistory, rewardHistory, quests } = useAppStore();
  const [confirmReward, setConfirmReward] = useState<typeof REWARDS[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'store' | 'history'>('store');
  const [filter, setFilter] = useState('all');

  const isNewEmployee = currentUser?.role === 'new_employee';
  const onboardingQuests = quests.filter(q => q.tabId === 'onboarding');
  const allOnboardingDone = onboardingQuests.filter(q => q.status === 'completed').length === onboardingQuests.length && onboardingQuests.length > 0;
  const isLocked = isNewEmployee && !allOnboardingDone;

  const cantAfford = (cost: number) => (currentUser?.credits || 0) < cost;

  const handleRedeem = () => {
    if (!confirmReward) return;
    const success = spendCredits(confirmReward.cost);
    if (success) {
      addRewardHistory({ rewardId: confirmReward.id, rewardTitle: confirmReward.title, cost: confirmReward.cost, status: 'processing' });
      addToast({ type: 'success', title: `🎁 Đã đổi "${confirmReward.title}"!`, message: `Trừ ${confirmReward.cost} Credits. Đơn đang xử lý.` });
    } else {
      addToast({ type: 'error', title: 'Không đủ Credits!', message: `Cần ${confirmReward.cost} Credits để đổi phần quà này.` });
    }
    setConfirmReward(null);
  };

  const CATS = [
    { id: 'all', label: 'Tất cả' },
    { id: 'food', label: '🍵 F&B' },
    { id: 'benefit', label: '🎯 Phúc lợi' },
    { id: 'voucher', label: '🎟 Voucher' },
    { id: 'learning', label: '📚 Học thuật' },
    { id: 'entertainment', label: '🎮 Giải trí' },
  ];

  const filteredRewards = REWARDS.filter(r => filter === 'all' || r.category === filter);

  return (
    <div className="space-y-6">
      <PageHeader icon={<Gift className="w-6 h-6 text-white" />} title="iReward"
        subtitle="Đổi Credits lấy phần thưởng hấp dẫn"
        gradient="bg-brand-gradient"
        actions={
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-300 rounded-xl">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="font-extrabold text-amber-800 text-lg">{currentUser?.credits || 0}</span>
            <span className="text-amber-600 font-bold text-sm">Credits</span>
          </div>
        }
      />

      {/* Lock overlay for new employees */}
      {isLocked && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
          <Lock className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="font-extrabold text-amber-900 text-lg mb-2">iReward đang bị khóa</h3>
          <p className="text-sm text-amber-700 max-w-md mx-auto">Bạn cần hoàn thành tất cả nhiệm vụ onboarding để mở khóa cửa hàng đổi quà.</p>
          <div className="mt-4">
            <a href="/iquest" className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors">
              Quay về iQuest Onboarding
            </a>
          </div>
        </motion.div>
      )}

      {!isLocked && (<>

        {/* Tabs */}
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('store')} className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all", activeTab === 'store' ? 'bg-brand-600 text-white shadow-brand' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-300')}>
            🛍 Cửa hàng
          </button>
          <button onClick={() => setActiveTab('history')} className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all", activeTab === 'history' ? 'bg-brand-600 text-white shadow-brand' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-300')}>
            📋 Lịch sử đổi quà
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'store' && (
            <motion.div key="store" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              {/* Category filter */}
              <div className="flex gap-2 flex-wrap">
                {CATS.map(cat => (
                  <button key={cat.id} onClick={() => setFilter(cat.id)}
                    className={cn("px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                      filter === cat.id ? 'bg-brand-gradient text-white shadow-brand' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-300')}>
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRewards.map((reward, i) => {
                  const Icon = reward.icon;
                  const tooExpensive = cantAfford(reward.cost);
                  return (
                    <motion.div key={reward.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                      className={cn("bg-white rounded-2xl p-5 border card-hover relative", tooExpensive ? 'border-slate-200 opacity-70' : 'border-slate-200/60')}>
                      {reward.tag && (
                        <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${TAG_STYLE[reward.tag]}`}>{reward.tag}</span>
                      )}
                      {reward.stock <= 5 && (
                        <span className="absolute top-9 right-3 text-[10px] text-rose-600 font-bold">Còn {reward.stock}</span>
                      )}
                      <div className={`w-12 h-12 bg-gradient-to-br ${reward.gradient} rounded-xl flex items-center justify-center mb-3 shadow-sm`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-extrabold text-slate-900 mb-1">{reward.title}</h3>
                      <p className="text-xs text-slate-500 mb-4 leading-relaxed">{reward.desc}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                          <span className="font-extrabold text-amber-700 text-lg">{reward.cost}</span>
                          <span className="text-xs text-slate-400 mt-0.5">Credits</span>
                        </div>
                        <button
                          onClick={() => !tooExpensive && setConfirmReward(reward)}
                          disabled={tooExpensive}
                          className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95",
                            tooExpensive
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand')}>
                          {tooExpensive ? 'Không đủ' : 'Đổi ngay'}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* How to earn */}
              <div className="p-5 bg-brand-50 border border-brand-200 rounded-2xl">
                <h3 className="font-bold text-brand-900 mb-3 flex items-center gap-2"><Zap className="w-4 h-4" /> Cách kiếm thêm Credits</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'iCheck đúng giờ', value: '+2 Credits/ngày' },
                    { label: 'Hoàn thành Quest', value: '+2–100 Credits' },
                    { label: 'Lên Level', value: '+50 Credits' },
                    { label: 'Gửi lời chúc', value: '+10 Credits' },
                  ].map(item => (
                    <div key={item.label} className="bg-white rounded-xl p-3 border border-brand-100">
                      <p className="font-bold text-brand-600 text-xs">{item.value}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {rewardHistory.length === 0 ? (
                <EmptyState icon={<Package className="w-8 h-8" />} title="Chưa có lịch sử đổi quà" description="Bạn chưa đổi quà nào. Hãy dùng Credits tại cửa hàng!" action={{ label: '🛍 Tới cửa hàng', onClick: () => setActiveTab('store') }} />
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm divide-y divide-slate-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100"><h3 className="font-bold text-slate-900">Lịch sử đổi quà</h3></div>
                  {rewardHistory.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors">
                      <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Gift className="w-5 h-5 text-brand-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm">{item.rewardTitle}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.date}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-amber-600 flex items-center gap-1"><Star className="w-4 h-4 fill-amber-500" /> -{item.cost}</p>
                        <StatusBadge status={item.status as any} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm Modal */}
        <Modal isOpen={!!confirmReward} onClose={() => setConfirmReward(null)} title="Xác nhận đổi quà" size="sm">
          {confirmReward && (
            <div className="space-y-5">
              <div className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${confirmReward.gradient} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-brand`}>
                  <confirmReward.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">{confirmReward.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{confirmReward.desc}</p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                <p className="text-amber-700 font-bold text-sm">Chi phí: <span className="text-2xl font-extrabold text-amber-800">{confirmReward.cost}</span> Credits</p>
                <p className="text-amber-600 text-xs mt-1">Số dư sau đổi: {(currentUser?.credits || 0) - confirmReward.cost} Credits</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setConfirmReward(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200">Hủy</button>
                <button onClick={handleRedeem} className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-brand">Xác nhận đổi</button>
              </div>
            </div>
          )}
        </Modal>
      </>)}
    </div>
  );
};
