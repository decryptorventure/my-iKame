import React, { useState, useEffect } from 'react';
import { useAuthStore, useAppStore } from '../store';
import type { LeaveRequest } from '../store';
import { Clock, CheckCircle2, AlertCircle, MapPin, Fingerprint, Zap, TrendingUp, Flame, Calendar, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isSameMonth } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader, Modal, Field, inputClass, selectClass, StatusBadge, EmptyState } from '../components/UI';
import { cn } from '../utils';

const CLOCK = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const hh = String(time.getHours()).padStart(2, '0');
  const mm = String(time.getMinutes()).padStart(2, '0');
  const ss = String(time.getSeconds()).padStart(2, '0');
  const blink = time.getSeconds() % 2 === 0;
  return (
    <div className="flex items-center justify-center gap-1">
      {[hh[0], hh[1]].map((d, i) => (
        <div key={`h${i}`} className="w-14 h-16 bg-slate-800 rounded-xl flex items-center justify-center text-4xl font-extrabold text-white font-mono shadow-inner">{d}</div>
      ))}
      <span className={cn("text-4xl font-extrabold text-slate-400 mb-2 transition-opacity", blink ? 'opacity-100' : 'opacity-20')}>:</span>
      {[mm[0], mm[1]].map((d, i) => (
        <div key={`m${i}`} className="w-14 h-16 bg-slate-800 rounded-xl flex items-center justify-center text-4xl font-extrabold text-white font-mono shadow-inner">{d}</div>
      ))}
      <span className={cn("text-4xl font-extrabold text-slate-400 mb-2 transition-opacity", blink ? 'opacity-100' : 'opacity-20')}>:</span>
      {[ss[0], ss[1]].map((d, i) => (
        <div key={`s${i}`} className="w-10 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-2xl font-extrabold text-slate-300 font-mono">{d}</div>
      ))}
    </div>
  );
};

export const Attendance = () => {
  const { currentUser } = useAuthStore();
  const { attendanceRecords, todayCheckedIn, todayCheckInTime, checkIn, checkOut, leaveRequests, submitLeaveRequest, approveLeaveRequest, addToast } = useAppStore();
  const [activeTab, setActiveTab] = useState<'checkin' | 'leave' | 'calendar'>('checkin');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [calMonth, setCalMonth] = useState(new Date());
  const [leaveForm, setLeaveForm] = useState({ type: 'annual' as LeaveRequest['type'], startDate: '', endDate: '', reason: '' });

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayRecord = attendanceRecords.find(r => r.date === today);
  const isManager = currentUser?.role === 'manager' || currentUser?.role === 'admin';

  // Calculate streak from real data
  const streak = (() => {
    let count = 0;
    let d = new Date(); d.setDate(d.getDate() - (todayCheckedIn ? 0 : 1));
    for (let i = 0; i < 30; i++) {
      const rec = attendanceRecords.find(r => r.date === d.toISOString().split('T')[0]);
      if (rec && (rec.status === 'on_time' || rec.status === 'late')) { count++; d.setDate(d.getDate() - 1); }
      else if (rec?.status === 'holiday') { d.setDate(d.getDate() - 1); continue; }
      else break;
    }
    return count;
  })();

  const onTimeCount = attendanceRecords.filter(r => r.status === 'on_time').length;
  const totalWork = attendanceRecords.filter(r => r.status === 'on_time' || r.status === 'late').length;
  const onTimeRate = totalWork ? Math.round((onTimeCount / totalWork) * 100) : 0;

  // Calendar data
  const calDays = eachDayOfInterval({ start: startOfMonth(calMonth), end: endOfMonth(calMonth) });
  const startDow = getDay(startOfMonth(calMonth));
  const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const getCalDayStatus = (date: Date) => {
    const rec = attendanceRecords.find(r => r.date === format(date, 'yyyy-MM-dd'));
    if (!rec) return null;
    return rec.status;
  };

  const statusDot: Record<string, string> = {
    on_time: 'bg-emerald-500',
    late: 'bg-amber-500',
    absent: 'bg-rose-500',
    holiday: 'bg-slate-300',
    wfh: 'bg-brand-400',
    ot: 'bg-orange-500',
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      addToast({ type: 'error', title: 'Vui lòng điền đầy đủ thông tin!' });
      return;
    }
    submitLeaveRequest({ ...leaveForm, userId: currentUser?.id || '' });
    setShowLeaveModal(false);
    setLeaveForm({ type: 'annual', startDate: '', endDate: '', reason: '' });
  };

  const myLeaves = leaveRequests.filter(r => r.userId === currentUser?.id);
  const pendingLeaves = leaveRequests.filter(r => r.status === 'pending');

  const leaveTypeLabel: Record<string, string> = {
    annual: 'Phép năm', sick: 'Phép ốm', maternity: 'Thai sản', ot: 'OT', wfh: 'WFH',
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={<Clock className="w-6 h-6 text-white" />} title="iCheck"
        subtitle="Chấm công thông minh & quản lý nghỉ phép"
        actions={
          <button onClick={() => setShowLeaveModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 transition-colors shadow-brand active:scale-95">
            <Plus className="w-4 h-4" /> Tạo đơn nghỉ phép
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-2">
        {[{ id: 'checkin', label: '⏰ Chấm công' }, { id: 'leave', label: '📋 Đơn nghỉ phép' }, { id: 'calendar', label: '📅 Lịch tháng' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all",
              activeTab === tab.id ? 'bg-brand-600 text-white shadow-brand' : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-300')}>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'checkin' && (
          <motion.div key="checkin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            {/* Clock Panel */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm text-center">
              <p className="text-brand-600 font-bold text-sm mb-4 uppercase tracking-widest">
                {format(new Date(), 'EEEE, dd/MM/yyyy', { locale: vi })}
              </p>
              <CLOCK />

              <div className="flex items-center justify-center gap-3 mt-5 text-sm text-slate-500">
                <MapPin className="w-4 h-4" /> <span className="font-medium">iKame Office — Tầng 11, 219 Trung Kính, Cầu Giấy, HN</span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 max-w-xs mx-auto">
                <button onClick={() => { if (!todayCheckedIn) checkIn(); else addToast({ type: 'info', title: 'Đã iCheck sáng nay!' }); }}
                  className={cn("flex flex-col items-center gap-2 p-4 rounded-xl font-bold text-sm border-2 transition-all",
                    todayCheckedIn ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-brand-gradient border-transparent text-white shadow-brand animate-pulse-glow hover:opacity-90 active:scale-95')}>
                  <Fingerprint className="w-8 h-8" />
                  {todayCheckedIn ? `✅ ${todayCheckInTime}` : 'Check In'}
                </button>
                <button onClick={() => { if (todayCheckedIn && !todayRecord?.checkOut) checkOut(); else if (!todayCheckedIn) addToast({ type: 'warning', title: 'Chưa check-in!' }); else addToast({ type: 'info', title: 'Đã check-out hôm nay!' }); }}
                  className={cn("flex flex-col items-center gap-2 p-4 rounded-xl font-bold text-sm border-2 transition-all",
                    todayRecord?.checkOut ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-200 hover:border-brand-400 hover:bg-brand-50 text-slate-700 active:scale-95')}>
                  <CheckCircle2 className="w-8 h-8" />
                  {todayRecord?.checkOut ? `✅ ${todayRecord.checkOut}` : 'Check Out'}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Streak hiện tại', value: `${streak} ngày`, icon: <Flame className="w-5 h-5 text-orange-500" />, color: 'text-orange-600' },
                { label: 'Tỷ lệ đúng giờ', value: `${onTimeRate}%`, icon: <TrendingUp className="w-5 h-5 text-emerald-500" />, color: 'text-emerald-600' },
                { label: 'EXP từ iCheck', value: `+${attendanceRecords.reduce((a, r) => a + r.expEarned, 0)} XP`, icon: <Zap className="w-5 h-5 text-brand-500" />, color: 'text-brand-600' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm text-center">
                  <div className="flex justify-center mb-2">{s.icon}</div>
                  <p className={`text-xl font-extrabold ${s.color} tracking-tight`}>{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* History */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Lịch sử chấm công</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-5 py-3 text-left">Ngày</th>
                    <th className="px-5 py-3 text-left">Check In</th>
                    <th className="px-5 py-3 text-left">Check Out</th>
                    <th className="px-5 py-3 text-left">Trạng thái</th>
                    <th className="px-5 py-3 text-right">EXP</th>
                  </tr></thead>
                  <tbody>
                    {attendanceRecords.slice(0, 14).map((rec, i) => (
                      <motion.tr key={rec.date} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                        className={cn("border-t border-slate-50 hover:bg-slate-50/80 transition-colors", i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30')}>
                        <td className="px-5 py-3 font-semibold text-slate-700">{rec.date}</td>
                        <td className="px-5 py-3">{rec.checkIn ? <span className={cn("font-bold", rec.status === 'late' ? 'text-amber-600' : 'text-emerald-600')}>{rec.checkIn}</span> : <span className="text-slate-400">—</span>}</td>
                        <td className="px-5 py-3 text-slate-600">{rec.checkOut || <span className="text-slate-400">—</span>}</td>
                        <td className="px-5 py-3">
                          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border",
                            rec.status === 'on_time' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              rec.status === 'late' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                rec.status === 'holiday' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                  'bg-rose-50 text-rose-700 border-rose-200')}>
                            {rec.status === 'on_time' ? '✅ Đúng giờ' : rec.status === 'late' ? '⚠️ Đi muộn' : rec.status === 'holiday' ? '🏖 Nghỉ' : '❌ Vắng'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-brand-600">{rec.expEarned > 0 ? `+${rec.expEarned}` : '—'}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'leave' && (
          <motion.div key="leave" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            {isManager && pendingLeaves.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> {pendingLeaves.length} đơn chờ phê duyệt</h3>
                <div className="space-y-3">
                  {pendingLeaves.map(r => (
                    <div key={r.id} className="bg-white rounded-xl p-4 border border-amber-200 flex items-center gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm">{leaveTypeLabel[r.type]} · {r.startDate} → {r.endDate}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{r.reason}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => approveLeaveRequest(r.id, true)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors">✅ Duyệt</button>
                        <button onClick={() => approveLeaveRequest(r.id, false)} className="px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold hover:bg-rose-200 transition-colors">❌ Từ chối</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {myLeaves.length === 0 ? (
              <EmptyState icon={<Calendar className="w-8 h-8" />} title="Chưa có đơn nghỉ phép" description="Tạo đơn xin nghỉ để quản lý gởi duyệt." action={{ label: '+ Tạo đơn', onClick: () => setShowLeaveModal(true) }} />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100"><h3 className="font-bold text-slate-900">Đơn nghỉ phép của tôi</h3></div>
                <div className="divide-y divide-slate-100">
                  {myLeaves.map(r => (
                    <div key={r.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm">{leaveTypeLabel[r.type]}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{r.startDate} → {r.endDate} · {r.reason}</p>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'calendar' && (
          <motion.div key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setCalMonth(m => { const d = new Date(m); d.setMonth(d.getMonth() - 1); return d; })} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
                <h3 className="font-extrabold text-lg text-slate-900">{format(calMonth, 'MMMM yyyy', { locale: vi })}</h3>
                <button onClick={() => setCalMonth(m => { const d = new Date(m); d.setMonth(d.getMonth() + 1); return d; })} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><ChevronRight className="w-5 h-5 text-slate-600" /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayLabels.map(d => <div key={d} className="text-center text-[11px] font-bold text-slate-400 py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startDow }).map((_, i) => <div key={`empty-${i}`} />)}
                {calDays.map(day => {
                  const status = getCalDayStatus(day);
                  const isToday = isSameDay(day, new Date());
                  return (
                    <div key={day.toISOString()} className={cn("relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-bold cursor-default transition-all",
                      isToday ? 'bg-brand-600 text-white shadow-brand' : isSameMonth(day, calMonth) ? 'text-slate-700 hover:bg-slate-50' : 'text-slate-300')}>
                      {format(day, 'd')}
                      {status && <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${statusDot[status]}`} />}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                {Object.entries({ on_time: 'Đúng giờ', late: 'Đi muộn', absent: 'Vắng', holiday: 'Nghỉ/Lễ', wfh: 'WFH' }).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <span className={`w-2.5 h-2.5 rounded-full ${statusDot[k]}`} /> {v}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leave Modal */}
      <Modal isOpen={showLeaveModal} onClose={() => setShowLeaveModal(false)} title="Tạo đơn nghỉ phép" size="md">
        <form onSubmit={handleLeaveSubmit} className="space-y-5">
          <Field label="Loại đơn" required>
            <select value={leaveForm.type} onChange={e => setLeaveForm(f => ({ ...f, type: e.target.value as any }))} className={selectClass}>
              <option value="annual">Phép năm</option>
              <option value="sick">Phép ốm (có giấy bác sĩ)</option>
              <option value="maternity">Thai sản</option>
              <option value="ot">Làm thêm giờ (OT)</option>
              <option value="wfh">Làm việc từ xa (WFH)</option>
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Từ ngày" required>
              <input type="date" value={leaveForm.startDate} onChange={e => setLeaveForm(f => ({ ...f, startDate: e.target.value }))} className={inputClass} />
            </Field>
            <Field label="Đến ngày" required>
              <input type="date" value={leaveForm.endDate} onChange={e => setLeaveForm(f => ({ ...f, endDate: e.target.value }))} className={inputClass} />
            </Field>
          </div>
          <Field label="Lý do" required>
            <textarea value={leaveForm.reason} onChange={e => setLeaveForm(f => ({ ...f, reason: e.target.value }))} rows={3} className={inputClass} placeholder="Mô tả lý do xin nghỉ..." />
          </Field>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowLeaveModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">Hủy</button>
            <button type="submit" className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-brand">Gửi đơn</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
