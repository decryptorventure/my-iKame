import React, { useState } from 'react';
import { useAppStore, TournamentEvent } from '../../store';
import { Plus, Edit2, Calendar, Gamepad2 } from 'lucide-react';
import { Modal } from '../../components/UI';
import { cn } from '../../utils';

export const AdminEvents = () => {
    const { events, createEvent, updateEvent, deleteEvent } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<TournamentEvent | null>(null);

    const [formData, setFormData] = useState<Partial<TournamentEvent>>({
        name: '', description: '', banner: 'https://picsum.photos/seed/event/800/300', startDate: '', endDate: '', status: 'upcoming'
    });

    const handleOpenCreate = () => {
        setEditingEvent(null);
        setFormData({ name: '', description: '', banner: 'https://picsum.photos/seed/event/800/300', startDate: '', endDate: '', status: 'upcoming' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (event: TournamentEvent) => {
        setEditingEvent(event);
        setFormData(event);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.startDate || !formData.endDate) return;

        if (editingEvent) {
            updateEvent(editingEvent.id, formData);
        } else {
            createEvent({
                ...formData,
                id: `ev_${Date.now()}`,
            } as TournamentEvent);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Bạn có chắc muốn xóa sự kiện này?")) {
            deleteEvent(id);
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý Sự kiện / Giải đấu</h1>
                    <p className="text-slate-500 font-medium mt-1">Thiết lập sự kiện giới hạn thời gian để nhân viên thi đua</p>
                </div>
                <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" /> Tạo Sự kiện mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map(event => (
                    <div key={event.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                        <div className="h-32 w-full bg-slate-100 relative">
                            <img src={event.banner} alt={event.name} className="w-full h-full object-cover" />
                            <div className="absolute top-3 right-3 flex gap-2">
                                <span className={cn(
                                    "px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm backdrop-blur-md",
                                    event.status === 'ongoing' ? "bg-emerald-500/90 text-white" :
                                        event.status === 'upcoming' ? "bg-amber-500/90 text-white" :
                                            "bg-slate-500/90 text-white"
                                )}>
                                    {event.status === 'ongoing' ? 'Đang diễn ra' : event.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'}
                                </span>
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">{event.name}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{event.description}</p>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                                    <Calendar className="w-4 h-4" />
                                    {event.startDate} - {event.endDate}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenEdit(event)} className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEvent ? "Cập nhật Sự kiện" : "Tạo Sự kiện mới"} size="lg">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Tên Sự kiện</label>
                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 outline-none" placeholder="VD: Đường Đua Mùa Xuân" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Mô tả</label>
                        <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 outline-none resize-none" rows={3} placeholder="..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Ngày bắt đầu</label>
                            <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Ngày kết thúc</label>
                            <input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 outline-none" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Trạng thái</label>
                            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 outline-none">
                                <option value="upcoming">Sắp diễn ra</option>
                                <option value="ongoing">Đang diễn ra</option>
                                <option value="completed">Đã kết thúc</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Link Ảnh Banner</label>
                            <input value={formData.banner} onChange={e => setFormData({ ...formData, banner: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 outline-none" />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        {editingEvent && (
                            <button onClick={() => handleDelete(editingEvent.id)} className="px-5 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-colors">
                                Xóa
                            </button>
                        )}
                        <button onClick={handleSave} className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-sm">
                            {editingEvent ? 'Lưu thay đổi' : 'Tạo Sự kiện'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
