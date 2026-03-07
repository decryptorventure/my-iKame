import React, { useState } from 'react';
import { useAppStore, Badge } from '../../store';
import { Plus, Edit2, Shield, Trophy } from 'lucide-react';
import { Modal } from '../../components/UI';
import { cn } from '../../utils';

export const AdminBadges = () => {
    const { badges, createBadge, updateBadge } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBadge, setEditingBadge] = useState<Badge | null>(null);

    const [formData, setFormData] = useState<Partial<Badge>>({
        name: '', description: '', icon: '🌟', color: 'text-amber-500 bg-amber-50 border-amber-200', condition: ''
    });

    const handleOpenCreate = () => {
        setEditingBadge(null);
        setFormData({ name: '', description: '', icon: '🌟', color: 'text-amber-500 bg-amber-50 border-amber-200', condition: '' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (badge: Badge) => {
        setEditingBadge(badge);
        setFormData(badge);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.condition) return;

        if (editingBadge) {
            updateBadge(editingBadge.id, formData);
        } else {
            createBadge({
                ...formData,
                id: `b_${Date.now()}`,
            } as Badge);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý Huy hiệu</h1>
                    <p className="text-slate-500 font-medium mt-1">Thiết lập hệ thống thành tựu và phần thưởng cho nhân sự</p>
                </div>
                <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" /> Tạo Huy hiệu mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map(badge => (
                    <div key={badge.id} className={cn("bg-white p-5 rounded-2xl border flex flex-col items-start gap-4 transition-shadow hover:shadow-md", badge.color.replace('bg-', 'border-').replace('text-', 'border-'))}>
                        <div className="flex items-center justify-between w-full">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border bg-white/50 backdrop-blur-sm", badge.color)}>
                                {badge.icon}
                            </div>
                            <button onClick={() => handleOpenEdit(badge)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 leading-tight">{badge.name}</h3>
                            <p className="text-sm text-slate-500 mt-1">{badge.description}</p>
                        </div>
                        <div className="mt-auto w-full pt-4 border-t border-slate-100 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-semibold text-slate-600">Điều kiện: {badge.condition}</span>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBadge ? "Cập nhật Huy hiệu" : "Tạo Huy hiệu mới"} size="md">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Tên Huy hiệu</label>
                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 outline-none" placeholder="VD: Chiến thần Deadline" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Mô tả hiển thị</label>
                        <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 outline-none resize-none" placeholder="..." />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Điều kiện đạt được</label>
                        <input value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 outline-none" placeholder="VD: Hoàn thành 50 task" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Emoji Icon</label>
                            <input value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 outline-none text-center text-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Mã màu (Tailwind)</label>
                            <input value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 outline-none text-xs" />
                        </div>
                    </div>
                    <button onClick={handleSave} className="w-full py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 mt-2">
                        {editingBadge ? 'Cập nhật Huy hiệu' : 'Tạo Huy hiệu'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};
