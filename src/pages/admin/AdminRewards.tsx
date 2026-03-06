import React, { useState } from 'react';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { useAppStore, Reward } from '../../store';
import { Modal } from '../../components/UI';

export function AdminRewards() {
    const { rewards, addReward, updateReward, deleteReward, rewardHistory, updateRewardHistoryStatus, addToast } = useAppStore();

    // Quà tặng logic
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingReward, setEditingReward] = useState<Reward | null>(null);
    const [rForm, setRForm] = useState<Partial<Reward>>({
        title: '', desc: '', cost: 100, icon: 'Gift', gradient: 'from-brand-500 to-purple-600', stock: 10, category: 'benefit', tag: null
    });

    const openCreate = () => {
        setEditingReward(null);
        setRForm({ title: '', desc: '', cost: 100, icon: 'Gift', gradient: 'from-brand-500 to-purple-600', stock: 10, category: 'benefit', tag: null });
        setIsFormOpen(true);
    };

    const openEdit = (r: Reward) => {
        setEditingReward(r);
        setRForm(r);
        setIsFormOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Bạn có chắc muốn xóa Quà này?')) {
            deleteReward(id);
            addToast({ type: 'info', title: 'Đã xóa Quà' });
        }
    };

    const handleSave = () => {
        if (!rForm.title || !rForm.desc) {
            addToast({ type: 'error', title: 'Lỗi', message: 'Vui lòng nhập đủ Tên và Mô tả.' });
            return;
        }

        if (editingReward) {
            updateReward(editingReward.id, rForm);
            addToast({ type: 'success', title: 'Đã cập nhật Quà' });
        } else {
            addReward(rForm as Omit<Reward, 'id'>);
            addToast({ type: 'success', title: 'Đã tạo Quà mới' });
        }
        setIsFormOpen(false);
    };

    const handleUpdateStatus = (historyId: string, status: 'processing' | 'delivered') => {
        updateRewardHistoryStatus(historyId, status);
        addToast({ type: 'success', title: 'Đã cập nhật trạng thái đơn quà' });
    };

    return (
        <div className="space-y-6">
            <div className="flex md:flex-row flex-col gap-4 md:items-center justify-between">
                <h1 className="text-2xl font-bold">Quản lý Kho Quà tặng</h1>
                <button onClick={openCreate} className="px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Thêm Quà mới
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="font-bold text-slate-800">Lịch sử Đổi Quà (Cần duyệt / Ship hàng)</h2>
                </div>

                {rewardHistory.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>Chưa có ai đổi quà.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">ID Đơn</th>
                                    <th className="px-6 py-4">Quà tặng</th>
                                    <th className="px-6 py-4">Ngày đổi</th>
                                    <th className="px-6 py-4">Trạng thái</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rewardHistory.map(r => (
                                    <tr key={r.id}>
                                        <td className="px-6 py-4 text-slate-500">#{r.id.slice(-6)}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">{r.rewardTitle}</td>
                                        <td className="px-6 py-4 text-slate-600">{r.date}</td>
                                        <td className="px-6 py-4">
                                            {r.status === 'processing' ? (
                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Chờ xử lý</span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Đã giao</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {r.status === 'processing' && (
                                                <button onClick={() => handleUpdateStatus(r.id, 'delivered')} className="text-emerald-600 font-medium text-sm hover:underline bg-emerald-50 px-3 py-1.5 rounded-lg">Xác nhận đã giao</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="font-bold text-slate-800">Danh sách Quà trong Cửa hàng</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Quà tặng</th>
                                <th className="px-6 py-4">Loại</th>
                                <th className="px-6 py-4">Giá (Credits)</th>
                                <th className="px-6 py-4">Tồn kho / Tag</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rewards.map(r => (
                                <tr key={r.id}>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-900">{r.title}</p>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 capitalize">{r.category}</td>
                                    <td className="px-6 py-4 font-bold text-amber-500">
                                        {r.cost}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span>{r.stock}</span>
                                            {r.tag && <span className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-bold border">{r.tag}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                        <button onClick={() => openEdit(r)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(r.id)} className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingReward ? "Sửa Quà" : "Thêm Quà mới"}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên Quà</label>
                        <input type="text" value={rForm.title} onChange={e => setRForm({ ...rForm, title: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="VD: Gấu bông iKame" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mô tả</label>
                        <input type="text" value={rForm.desc} onChange={e => setRForm({ ...rForm, desc: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="Mô tả chi tiết quà tặng" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Giá Credits</label>
                            <input type="number" min={0} value={rForm.cost} onChange={e => setRForm({ ...rForm, cost: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-amber-600 font-bold" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Số lượng tồn kho</label>
                            <input type="number" min={0} value={rForm.stock} onChange={e => setRForm({ ...rForm, stock: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Danh mục</label>
                            <select value={rForm.category} onChange={e => setRForm({ ...rForm, category: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                                <option value="food">🍵 F&B</option>
                                <option value="benefit">🎯 Phúc lợi</option>
                                <option value="voucher">🎟 Voucher</option>
                                <option value="learning">📚 Học thuật</option>
                                <option value="entertainment">🎮 Giải trí</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nhãn (Tag)</label>
                            <input type="text" value={rForm.tag || ''} onChange={e => setRForm({ ...rForm, tag: e.target.value || null })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="VD: Hot, New (Tùy chọn)" />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <button onClick={() => setIsFormOpen(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">Hủy</button>
                        <button onClick={handleSave} className="flex-1 py-2 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-brand">Lưu lại</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
