import React from 'react';
import { useAppStore } from '../store';
import { Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Events = () => {
    const { events } = useAppStore();
    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sự kiện & Giải đấu</h1>
                <p className="text-slate-500 font-medium mt-1">Tham gia các sự kiện thú vị để nhận phần thưởng hấp dẫn</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                    <div
                        key={event.id}
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-lg hover:border-brand-300 transition-all cursor-pointer group"
                    >
                        <div className="h-40 w-full bg-slate-100 relative overflow-hidden">
                            <img
                                src={event.banner}
                                alt={event.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                            <div className="absolute top-3 right-3 flex gap-2">
                                <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm backdrop-blur-md ${event.status === 'ongoing' ? "bg-emerald-500/90 text-white" :
                                        event.status === 'upcoming' ? "bg-amber-500/90 text-white" :
                                            "bg-slate-500/90 text-white"
                                    }`}>
                                    {event.status === 'ongoing' ? 'Đang diễn ra' : event.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'}
                                </span>
                            </div>
                            <h3 className="absolute bottom-4 left-4 right-4 text-xl font-black text-white drop-shadow-md">{event.name}</h3>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">{event.description}</p>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                                    <Calendar className="w-4 h-4 text-brand-500" />
                                    {event.startDate} đến {event.endDate}
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
                                    Chi tiết <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {events.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                        <p className="font-medium">Chưa có sự kiện nào được tạo.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
