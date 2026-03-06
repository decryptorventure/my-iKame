import React, { useState } from 'react';
import { useAppStore, Quest } from '../../store';
import { CheckCircle2, XCircle, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { Modal } from '../../components/UI';
import { cn } from '../../utils';

export function AdminQuests() {
    const { quests, approveQuest, addQuest, updateQuest, deleteQuest, addToast } = useAppStore();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
    const [activeTab, setActiveTab] = useState('all');
    const [qForm, setQForm] = useState<Partial<Quest>>({
        title: '', desc: '', exp: 50, credits: 10, tabId: 'daily', rarity: 'common', target: 1
    });

    const openCreate = () => {
        setEditingQuest(null);
        setQForm({ title: '', desc: '', exp: 50, credits: 10, tabId: 'daily', rarity: 'common', target: 1 });
        setIsFormOpen(true);
    };

    const openEdit = (q: Quest) => {
        setEditingQuest(q);
        setQForm(q);
        setIsFormOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Bạn có chắc muốn xóa Nhiệm vụ này?')) {
            deleteQuest(id);
            addToast({ type: 'info', title: 'Đã xóa Nhiệm vụ' });
        }
    };

    const handleSave = () => {
        if (!qForm.title || !qForm.desc) {
            addToast({ type: 'error', title: 'Lỗi', message: 'Vui lòng nhập đủ Tên và Mô tả.' });
            return;
        }

        if (editingQuest) {
            updateQuest(editingQuest.id, qForm);
            addToast({ type: 'success', title: 'Đã cập nhật Nhiệm vụ' });
        } else {
            addQuest(qForm as Omit<Quest, 'id' | 'progress' | 'status'>);
            addToast({ type: 'success', title: 'Đã tạo Nhiệm vụ mới' });
        }
        setIsFormOpen(false);
    };

    const pendingQuests = quests.filter(q => q.status === 'submitted');
    const otherQuests = quests.filter(q => q.status !== 'submitted');

    const TABS = [
        { id: 'all', label: 'Tất cả' },
        { id: 'onboarding', label: 'On-boarding' },
        { id: 'daily', label: 'Hàng ngày' },
        { id: 'weekly', label: 'Hàng tuần' },
        { id: 'monthly', label: 'Hàng tháng' },
        { id: 'event', label: 'Sự kiện' }
    ];

    const filteredQuests = otherQuests.filter(q => activeTab === 'all' || q.tabId === activeTab);

    return (
        <div className="space-y-6">
            <div className="flex md:flex-row flex-col gap-4 md:items-center justify-between">
                <h1 className="text-2xl font-bold">Quản lý iQuest</h1>
                <button onClick={openCreate} className="px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Tạo Nhiệm vụ mới
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="font-bold text-slate-800">Cần phê duyệt minh chứng ({pendingQuests.length})</h2>
                </div>

                {pendingQuests.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">Trống</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {pendingQuests.map(q => (
                            <div key={q.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                <div>
                                    <h3 className="font-bold text-slate-900">{q.title}</h3>
                                    <p className="text-sm text-slate-500">{q.desc}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => approveQuest(q.id, true)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </button>
                                    <button onClick={() => approveQuest(q.id, false)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800">Danh sách Nhiệm vụ Hệ thống</h2>
                </div>

                <div className="flex gap-2 p-4 border-b border-slate-100 overflow-x-auto">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all",
                                activeTab === t.id
                                    ? "bg-brand-50 text-brand-700 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                            )}>
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Nhiệm vụ</th>
                                <th className="px-6 py-4">Nhóm / Loại</th>
                                <th className="px-6 py-4">Thưởng (EXP/Coin)</th>
                                <th className="px-6 py-4">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredQuests.map(q => (
                                <tr key={q.id}>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-900">{q.title}</p>
                                        {q.tabId === 'event' && q.eventName && (
                                            <div className="flex items-center gap-1 mt-1 text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md inline-flex">
                                                <Calendar className="w-3 h-3" />
                                                <span className="font-medium">{q.eventName}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 capitalize">
                                        {TABS.find(t => t.id === q.tabId)?.label} / {q.rarity}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-brand-600">
                                        +{q.exp} EXP / +{q.credits} Coins
                                    </td>
                                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                        <button onClick={() => openEdit(q)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(q.id)} className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredQuests.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                        Chưa có nhiệm vụ nào trong nhóm này.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingQuest ? "Sửa Nhiệm vụ" : "Tạo Nhiệm vụ mới"}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên Nhiệm vụ</label>
                        <input type="text" value={qForm.title} onChange={e => setQForm({ ...qForm, title: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="VD: Chia sẻ bài lên Facebook" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mô tả chi tiết</label>
                        <textarea value={qForm.desc} onChange={e => setQForm({ ...qForm, desc: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" rows={2} placeholder="Điều kiện hoàn thành..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">EXP Thưởng</label>
                            <input type="number" min={0} value={qForm.exp} onChange={e => setQForm({ ...qForm, exp: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-brand-600 font-bold" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Credits Thưởng</label>
                            <input type="number" min={0} value={qForm.credits} onChange={e => setQForm({ ...qForm, credits: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-amber-600 font-bold" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phân loại</label>
                            <select value={qForm.tabId} onChange={e => setQForm({ ...qForm, tabId: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                                <option value="onboarding">Onboarding</option>
                                <option value="daily">Hàng ngày</option>
                                <option value="weekly">Hàng tuần</option>
                                <option value="monthly">Thử thách dài hạn</option>
                                <option value="event">Nhiệm vụ Sự kiện</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Độ khó/Hiếm</label>
                            <select value={qForm.rarity} onChange={e => setQForm({ ...qForm, rarity: e.target.value as any })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                                <option value="common">Bình thường (Common)</option>
                                <option value="rare">Hiếm (Rare)</option>
                                <option value="epic">Sử thi (Epic)</option>
                                <option value="legendary">Huyền thoại (Legendary)</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mục tiêu (Số lần thực hiện)</label>
                            <input type="number" min={1} value={qForm.target} onChange={e => setQForm({ ...qForm, target: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                        </div>
                    </div>

                    {qForm.tabId === 'event' && (
                        <div className="mt-4 p-4 border border-purple-200 bg-purple-50 rounded-xl space-y-4">
                            <h3 className="font-bold text-purple-800 flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4" /> Thông tin Sự kiện
                            </h3>
                            <div>
                                <label className="block text-xs font-bold text-purple-700 uppercase mb-1">Tên Sự kiện</label>
                                <input type="text" value={qForm.eventName || ''} onChange={e => setQForm({ ...qForm, eventName: e.target.value })} className="w-full px-3 py-2 bg-white border border-purple-200 rounded-lg text-sm" placeholder="VD: Cuộc thi Marathon 2026" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-purple-700 uppercase mb-1">Mô tả Sự kiện</label>
                                <textarea value={qForm.eventDesc || ''} onChange={e => setQForm({ ...qForm, eventDesc: e.target.value })} className="w-full px-3 py-2 bg-white border border-purple-200 rounded-lg text-sm" rows={2} placeholder="Sự kiện đặc biệt nhân dịp..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-purple-700 uppercase mb-1">Thời gian kết thúc</label>
                                <input type="date" value={qForm.eventEndTime || ''} onChange={e => setQForm({ ...qForm, eventEndTime: e.target.value })} className="w-full px-3 py-2 bg-white border border-purple-200 rounded-lg text-sm" />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <button onClick={() => setIsFormOpen(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">Hủy</button>
                        <button onClick={handleSave} className="flex-1 py-2 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-brand">Lưu lại</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
