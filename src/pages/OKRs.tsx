import React, { useState } from 'react';
import { useAuthStore, useAppStore } from '../store';
import type { OKR, KeyResult } from '../store';
import { Target, TrendingUp, Plus, BarChart3, AlertTriangle, Zap, Trash2, Edit3, Check, X, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader, Modal, Field, inputClass, selectClass, EmptyState } from '../components/UI';
import { cn } from '../utils';

const QUARTERS = ['Q1-2026', 'Q2-2026', 'Q3-2026', 'Q4-2026', 'Q1-2025'];

const ProgressCircle = ({ progress, size = 48 }: { progress: number; size?: number }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  const color = progress >= 70 ? '#10B981' : progress >= 40 ? '#f97316' : '#F59E0B';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={7} />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }} transition={{ duration: 1.2, ease: 'easeOut' }}
        strokeLinecap="round" />
    </svg>
  );
};

const getColor = (p: number) => p >= 70 ? 'text-emerald-600' : p >= 40 ? 'text-brand-600' : 'text-amber-600';
const getBarColor = (p: number) => p >= 70 ? 'bg-emerald-500' : p >= 40 ? 'bg-brand-500' : 'bg-amber-500';

export const OKRs = () => {
  const { currentUser } = useAuthStore();
  const { okrs, addOKR, updateOKR, deleteOKR, updateKR, addToast } = useAppStore();
  const [selectedQ, setSelectedQ] = useState('Q1-2026');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingKR, setEditingKR] = useState<{ okrId: string; krId: string; value: string } | null>(null);
  const [expandedOKR, setExpandedOKR] = useState<string | null>(okrs[0]?.id || null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Create OKR form state
  const [form, setForm] = useState({
    title: '', quarter: 'Q1-2026',
    krs: [{ title: '', target: '', unit: 'task' }],
  });

  const filtered = okrs.filter(o => o.userId === currentUser?.id && o.quarter === selectedQ);

  const handleAddKR = () => setForm(f => ({ ...f, krs: [...f.krs, { title: '', target: '', unit: 'task' }] }));
  const handleRemoveKR = (i: number) => setForm(f => ({ ...f, krs: f.krs.filter((_, idx) => idx !== i) }));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) { addToast({ type: 'error', title: 'Nhập tên Objective!' }); return; }
    const krs = form.krs.filter(k => k.title && k.target).map(k => ({
      id: `kr-${Date.now()}-${Math.random()}`,
      title: k.title, current: 0, target: Number(k.target), unit: k.unit,
    }));
    addOKR({ title: form.title, quarter: form.quarter, progress: 0, keyResults: krs, userId: currentUser?.id || '' });
    setShowCreateModal(false);
    setForm({ title: '', quarter: 'Q1-2026', krs: [{ title: '', target: '', unit: 'task' }] });
  };

  const saveKREdit = () => {
    if (!editingKR) return;
    const val = parseFloat(editingKR.value);
    if (isNaN(val)) { addToast({ type: 'error', title: 'Giá trị không hợp lệ!' }); return; }
    updateKR(editingKR.okrId, editingKR.krId, val);
    setEditingKR(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={<Target className="w-6 h-6 text-white" />} title="iGoal"
        subtitle="Quản lý Mục tiêu & Kết quả Then chốt (OKR)"
        actions={
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 shadow-brand transition-colors active:scale-95">
            <Plus className="w-4 h-4" /> Tạo iGoal mới
          </button>
        }
      />

      {/* Quarter selector */}
      <div className="flex gap-2 flex-wrap">
        {QUARTERS.map(q => (
          <button key={q} onClick={() => setSelectedQ(q)}
            className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all",
              selectedQ === q ? 'bg-brand-600 text-white shadow-brand' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-300')}>
            📅 {q}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Target className="w-8 h-8" />} title="Chưa có iGoal nào" description={`Chưa có Objective nào cho ${selectedQ}. Hãy tạo mục tiêu đầu tiên!`} action={{ label: '+ Tạo iGoal mới', onClick: () => setShowCreateModal(true) }} />
      ) : (
        <div className="space-y-4">
          {filtered.map(okr => {
            const isExpanded = expandedOKR === okr.id;
            const isAtRisk = okr.progress < 50;
            return (
              <motion.div key={okr.id} layout className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                {/* OKR Header */}
                <div className="p-5 cursor-pointer" onClick={() => setExpandedOKR(isExpanded ? null : okr.id)}>
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <ProgressCircle progress={okr.progress} size={56} />
                      <span className={`absolute inset-0 flex items-center justify-center text-xs font-extrabold ${getColor(okr.progress)}`}>{okr.progress}%</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap">
                        <h3 className="font-extrabold text-slate-900 text-base">{okr.title}</h3>
                        {isAtRisk && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold">
                            <AlertTriangle className="w-3 h-3" /> Chậm tiến độ
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{okr.quarter} · {okr.keyResults.length} Key Results</p>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${okr.progress}%` }} transition={{ duration: 1 }}
                          className={`h-full rounded-full ${getBarColor(okr.progress)}`} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={e => { e.stopPropagation(); setDeleteConfirm(okr.id); }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                    </div>
                  </div>
                </div>

                {/* KR List */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <div className="border-t border-slate-100 divide-y divide-slate-50">
                        {okr.keyResults.map((kr, i) => {
                          const krPct = kr.target === 0 ? 0 : Math.min(100, Math.round((kr.current / kr.target) * 100));
                          const isEditing = editingKR?.okrId === okr.id && editingKR?.krId === kr.id;
                          return (
                            <motion.div key={kr.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                              className="px-5 py-4 hover:bg-slate-50/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-slate-800 mb-2">{kr.title}</p>
                                  <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                      <motion.div initial={{ width: 0 }} animate={{ width: `${krPct}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                                        className={`h-full rounded-full ${getBarColor(krPct)}`} />
                                    </div>
                                    <span className={`text-xs font-extrabold whitespace-nowrap ${getColor(krPct)}`}>{krPct}%</span>
                                  </div>
                                </div>
                                {isEditing ? (
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <input type="number" value={editingKR.value} onChange={e => setEditingKR(prev => prev ? { ...prev, value: e.target.value } : null)}
                                      className="w-20 px-2 py-1.5 border border-brand-400 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-center" autoFocus />
                                    <span className="text-xs text-slate-400">/{kr.target} {kr.unit}</span>
                                    <button onClick={saveKREdit} className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"><Check className="w-4 h-4" /></button>
                                    <button onClick={() => setEditingKR(null)} className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"><X className="w-4 h-4" /></button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="text-sm font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg whitespace-nowrap">{kr.current}/{kr.target} {kr.unit}</span>
                                    <button onClick={() => setEditingKR({ okrId: okr.id, krId: kr.id, value: String(kr.current) })}
                                      className="p-1.5 bg-slate-50 border border-slate-200 text-slate-500 hover:text-brand-600 hover:border-brand-300 rounded-lg transition-colors">
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="font-bold text-lg text-slate-900 mb-2">Xoá iGoal?</h3>
              <p className="text-sm text-slate-500 mb-5">Hành động này không thể hoàn tác. Tất cả Key Results sẽ bị xoá.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">Hủy</button>
                <button onClick={() => { deleteOKR(deleteConfirm); setDeleteConfirm(null); setExpandedOKR(null); }}
                  className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors">Xoá</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Tạo iGoal mới" size="lg">
        <form onSubmit={handleCreate} className="space-y-5">
          <Field label="Objective" required>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputClass} placeholder="VD: Tăng trưởng doanh thu Q2/2026" />
          </Field>
          <Field label="Chọn quý">
            <select value={form.quarter} onChange={e => setForm(f => ({ ...f, quarter: e.target.value }))} className={selectClass}>
              {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </Field>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Results</label>
              <button type="button" onClick={handleAddKR} className="flex items-center gap-1 px-3 py-1.5 bg-brand-50 text-brand-600 rounded-lg text-xs font-bold hover:bg-brand-100 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Thêm KR
              </button>
            </div>
            <div className="space-y-3">
              {form.krs.map((kr, i) => (
                <div key={i} className="flex gap-2 items-start p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex-1 space-y-2">
                    <input value={kr.title} onChange={e => setForm(f => ({ ...f, krs: f.krs.map((k, idx) => idx === i ? { ...k, title: e.target.value } : k) }))}
                      placeholder={`KR ${i + 1}: VD: Đạt 500M doanh thu`} className={inputClass} />
                    <div className="flex gap-2">
                      <input type="number" value={kr.target} onChange={e => setForm(f => ({ ...f, krs: f.krs.map((k, idx) => idx === i ? { ...k, target: e.target.value } : k) }))}
                        placeholder="Mục tiêu" className={`${inputClass} flex-1`} />
                      <input value={kr.unit} onChange={e => setForm(f => ({ ...f, krs: f.krs.map((k, idx) => idx === i ? { ...k, unit: e.target.value } : k) }))}
                        placeholder="Đơn vị (M, task, %…)" className={`${inputClass} flex-1`} />
                    </div>
                  </div>
                  {form.krs.length > 1 && (
                    <button type="button" onClick={() => handleRemoveKR(i)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0 mt-0.5">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">Hủy</button>
            <button type="submit" className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-brand transition-colors">Tạo iGoal</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
