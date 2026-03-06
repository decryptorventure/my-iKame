import React, { useState } from 'react';
import { Users, Star, TrendingUp, CheckCircle2, AlertCircle, Mail, Phone, MapPin, Briefcase, Calendar, Building2, Shield, Search, X, BarChart3, Clock } from 'lucide-react';
import { useAuthStore, useAppStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import { Modal, Field, inputClass, selectClass, StatusBadge, EmptyState, PageHeader } from '../components/UI';

const TEAM_MEMBERS = [
  { id: 'u1', name: 'Nguyễn Văn A', title: 'Frontend Developer', department: 'Engineering', level: 5, exp: 2450, credits: 150, avatar: 'https://picsum.photos/seed/user1/150/150', email: 'nva@ikame.vn', phone: '0901234567', dob: '1995-08-20', startDate: '2022-03-15', address: '123 Nguyễn Văn Linh, Q7', online: true, attendance: 92, okrProgress: 65, questsCompleted: 4 },
  { id: 'u2', name: 'Lê Văn C', title: 'Backend Developer', department: 'Engineering', level: 4, exp: 1800, credits: 90, avatar: 'https://picsum.photos/seed/user3/150/150', email: 'lvc@ikame.vn', phone: '0902345678', dob: '1997-03-12', startDate: '2023-06-01', address: '456 Lê Lợi, Q1', online: false, attendance: 88, okrProgress: 42, questsCompleted: 2 },
  { id: 'u3', name: 'Phạm Thị D', title: 'UI/UX Designer', department: 'Product', level: 6, exp: 3100, credits: 210, avatar: 'https://picsum.photos/seed/user4/150/150', email: 'ptd@ikame.vn', phone: '0903456789', dob: '1996-11-25', startDate: '2021-09-10', address: '789 CMT8, Q10', online: true, attendance: 97, okrProgress: 78, questsCompleted: 7 },
  { id: 'u4', name: 'Hoàng Văn E', title: 'QA Engineer', department: 'Engineering', level: 3, exp: 950, credits: 60, avatar: 'https://picsum.photos/seed/user5/150/150', email: 'hve@ikame.vn', phone: '0904567890', dob: '1999-06-08', startDate: '2024-01-15', address: '321 Đinh Tiên Hoàng, Q3', online: true, attendance: 95, okrProgress: 55, questsCompleted: 3 },
];

export const Team = () => {
  const { currentUser } = useAuthStore();
  const { addToast, leaveRequests, approveLeaveRequest } = useAppStore();
  const [selectedMember, setSelectedMember] = useState<typeof TEAM_MEMBERS[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evalTarget, setEvalTarget] = useState<string>('');
  const [evalForm, setEvalForm] = useState({ performance: '4', attitude: '4', teamwork: '4', feedback: '' });
  const [editForm, setEditForm] = useState({ title: '', department: '', phone: '' });

  const filtered = TEAM_MEMBERS.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingLeaves = leaveRequests.filter(r => r.status === 'pending');

  const getAttColor = (v: number) => v >= 90 ? 'text-emerald-600' : v >= 75 ? 'text-amber-600' : 'text-rose-600';
  const getOKRColor = (v: number) => v >= 70 ? 'text-emerald-600' : v >= 50 ? 'text-brand-600' : 'text-amber-600';

  const handleEvalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const avg = ((Number(evalForm.performance) + Number(evalForm.attitude) + Number(evalForm.teamwork)) / 3).toFixed(1);
    addToast({ type: 'success', title: `Đã đánh giá ${evalTarget}`, message: `Điểm trung bình: ${avg}/5 ⭐` });
    setShowEvalModal(false);
    setEvalForm({ performance: '4', attitude: '4', teamwork: '4', feedback: '' });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({ type: 'success', title: 'Cập nhật hồ sơ thành công!' });
    setSelectedMember(null);
  };

  const openEdit = (m: typeof TEAM_MEMBERS[0]) => {
    setSelectedMember(m);
    setEditForm({ title: m.title, department: m.department, phone: m.phone });
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={<Users className="w-6 h-6 text-white" />} title="Hồ sơ nhân sự"
        subtitle={`Quản lý đội ngũ · ${TEAM_MEMBERS.length} thành viên · ${currentUser?.department}`}
        gradient="bg-gradient-to-br from-slate-700 to-slate-900"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng nhân sự', value: TEAM_MEMBERS.length, icon: '👥', color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'OKR Avg', value: `${Math.round(TEAM_MEMBERS.reduce((a, m) => a + m.okrProgress, 0) / TEAM_MEMBERS.length)}%`, icon: '🎯', color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'Đơn chờ duyệt', value: pendingLeaves.length, icon: '📋', color: pendingLeaves.length > 0 ? 'text-amber-600' : 'text-emerald-600', bg: pendingLeaves.length > 0 ? 'bg-amber-50' : 'bg-emerald-50' },
          { label: 'Online ngay', value: TEAM_MEMBERS.filter(m => m.online).length, icon: '🟢', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3 text-xl`}>{s.icon}</div>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Pending leave approvals */}
      {pendingLeaves.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-3"><AlertCircle className="w-5 h-5" /> {pendingLeaves.length} đơn nghỉ phép chờ duyệt</h3>
          <div className="space-y-3">
            {pendingLeaves.map(r => (
              <div key={r.id} className="bg-white rounded-xl p-4 border border-amber-200 flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm">{r.userId} — {r.type}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{r.startDate} → {r.endDate} · {r.reason}</p>
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

      {/* Search + Table */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <h3 className="font-bold text-slate-900">Danh sách nhân sự</h3>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Tìm nhân viên..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-5 py-3 text-left">Nhân viên</th>
              <th className="px-5 py-3 text-left">Phòng ban</th>
              <th className="px-5 py-3 text-center">Level</th>
              <th className="px-5 py-3 text-center">Chuyên cần</th>
              <th className="px-5 py-3 text-center">OKR</th>
              <th className="px-5 py-3 text-center">Quest</th>
              <th className="px-5 py-3 text-center">Hành động</th>
            </tr></thead>
            <tbody>
              {filtered.map((m, i) => (
                <motion.tr key={m.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={m.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${m.online ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{m.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{m.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{m.department}</td>
                  <td className="px-5 py-3.5 text-center"><span className="font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded text-xs">Lv.{m.level}</span></td>
                  <td className={`px-5 py-3.5 text-center font-extrabold ${getAttColor(m.attendance)}`}>{m.attendance}%</td>
                  <td className={`px-5 py-3.5 text-center font-extrabold ${getOKRColor(m.okrProgress)}`}>{m.okrProgress}%</td>
                  <td className="px-5 py-3.5 text-center text-slate-600 font-bold">{m.questsCompleted}</td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => openEdit(m)} className="px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold hover:bg-brand-100 transition-colors">Hồ sơ</button>
                      <button onClick={() => { setEvalTarget(m.name); setShowEvalModal(true); }} className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors">Đánh giá</button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-slate-500 font-medium">Không tìm thấy nhân viên phù hợp</p>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      <Modal isOpen={!!selectedMember} onClose={() => setSelectedMember(null)} title="Hồ sơ nhân sự" size="lg">
        {selectedMember && (
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <img src={selectedMember.avatar} alt="" className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md" referrerPolicy="no-referrer" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">{selectedMember.name}</h3>
                <p className="text-slate-500 text-sm">{selectedMember.email}</p>
                <div className="flex gap-2 mt-1.5">
                  <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">Lv.{selectedMember.level}</span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">⭐ {selectedMember.credits} Credits</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Chức danh"><input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} className={inputClass} /></Field>
              <Field label="Phòng ban"><input value={editForm.department} onChange={e => setEditForm(f => ({ ...f, department: e.target.value }))} className={inputClass} /></Field>
              <Field label="Số điện thoại"><input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} className={inputClass} /></Field>
              <Field label="Ngày vào làm"><input value={selectedMember.startDate} disabled className={`${inputClass} opacity-60`} /></Field>
            </div>
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl">
              <div className="text-center"><p className={`text-2xl font-extrabold ${getAttColor(selectedMember.attendance)}`}>{selectedMember.attendance}%</p><p className="text-xs text-slate-500">Chuyên cần</p></div>
              <div className="text-center"><p className={`text-2xl font-extrabold ${getOKRColor(selectedMember.okrProgress)}`}>{selectedMember.okrProgress}%</p><p className="text-xs text-slate-500">OKR</p></div>
              <div className="text-center"><p className="text-2xl font-extrabold text-brand-600">{selectedMember.questsCompleted}</p><p className="text-xs text-slate-500">Quests</p></div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setSelectedMember(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200">Đóng</button>
              <button type="submit" className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-brand">Lưu thay đổi</button>
            </div>
          </form>
        )}
      </Modal>

      {/* Evaluation Modal */}
      <Modal isOpen={showEvalModal} onClose={() => setShowEvalModal(false)} title={`Đánh giá KPI — ${evalTarget}`} size="md">
        <form onSubmit={handleEvalSubmit} className="space-y-5">
          {[
            { id: 'performance', label: 'Hiệu suất công việc' },
            { id: 'attitude', label: 'Thái độ & Chủ động' },
            { id: 'teamwork', label: 'Phối hợp nhóm' },
          ].map(item => (
            <div key={item.id}>
              <Field label={item.label}>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} type="button" onClick={() => setEvalForm(f => ({ ...f, [item.id]: String(v) }))}
                      className={cn("flex-1 py-2.5 rounded-xl font-extrabold text-sm transition-all",
                        String(v) === evalForm[item.id as keyof typeof evalForm]
                          ? 'bg-brand-600 text-white shadow-brand' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-brand-300')}>
                      {'⭐'.repeat(v)}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          ))}
          <Field label="Nhận xét chi tiết">
            <textarea value={evalForm.feedback} onChange={e => setEvalForm(f => ({ ...f, feedback: e.target.value }))} rows={3} className={inputClass} placeholder="Điểm mạnh, điểm cần cải thiện..." />
          </Field>
          <div className="p-3 bg-brand-50 rounded-xl text-center">
            <p className="text-brand-700 font-bold text-sm">Điểm trung bình: <span className="text-xl font-extrabold">{((Number(evalForm.performance) + Number(evalForm.attitude) + Number(evalForm.teamwork)) / 3).toFixed(1)}</span>/5 ⭐</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowEvalModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200">Hủy</button>
            <button type="submit" className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-brand">Gửi đánh giá</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
