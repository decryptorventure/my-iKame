import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { ChevronLeft, Calendar, Trophy, Gamepad2, Gift, Star, ArrowRight } from 'lucide-react';
import { cn } from '../utils';

export const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { events, quests, users } = useAppStore();

    const event = events.find(e => e.id === id);

    if (!event) return <div className="p-8 text-center text-slate-500">Không tìm thấy sự kiện.</div>;

    const eventQuests = quests.filter(q => q.eventName === event.name);

    // Mock Event Leaderboard
    const eventLeaderboard = [
        { name: 'Nguyễn Văn A', exp: 1250, avatar: 'https://picsum.photos/seed/user3/150/150' },
        { name: 'Trần Thị B', exp: 980, avatar: 'https://picsum.photos/seed/manager1/150/150' },
        { name: 'Phạm Thị D', exp: 850, avatar: 'https://picsum.photos/seed/user4/150/150' },
        { name: 'Hoàng Văn E', exp: 620, avatar: 'https://picsum.photos/seed/user5/150/150' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <button onClick={() => navigate('/events')} className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors font-medium">
                <ChevronLeft className="w-4 h-4" /> Quay lại danh sách
            </button>

            {/* Event Header / Banner */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                <div className="h-64 md:h-80 w-full relative">
                    <img src={event.banner} alt={event.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={cn("px-3 py-1 text-xs font-black uppercase tracking-widest rounded-lg shadow-sm backdrop-blur-md",
                                event.status === 'ongoing' ? "bg-emerald-500/90 text-white" :
                                    event.status === 'upcoming' ? "bg-amber-500/90 text-white" :
                                        "bg-slate-500/90 text-white"
                            )}>
                                {event.status === 'ongoing' ? 'Đang diễn ra' : event.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'}
                            </span>
                            <span className="flex items-center gap-1.5 text-white/90 text-sm font-medium bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg">
                                <Calendar className="w-4 h-4" /> {event.startDate} - {event.endDate}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{event.name}</h1>
                    </div>
                </div>
                <div className="p-6 md:p-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Thông tin Sự kiện</h3>
                    <p className="text-slate-600 leading-relaxed text-[15px]">{event.description}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Quests Section */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                                <Gamepad2 className="w-5 h-5 text-brand-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Nhiệm vụ Sự kiện</h2>
                        </div>

                        {eventQuests.length > 0 ? (
                            <div className="space-y-3">
                                {eventQuests.map((quest, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-brand-200 hover:bg-brand-50/50 transition-colors">
                                        <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center flex-shrink-0 text-xl font-bold text-brand-600">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-900 text-[15px]">{quest.title}</h4>
                                            <p className="text-sm text-slate-500 truncate">{quest.desc}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-sm font-black text-brand-600">+{quest.exp} XP</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                                Sự kiện này chưa có nhiệm vụ nào.
                            </div>
                        )}
                        <button onClick={() => navigate('/iquest')} className="mt-6 w-full py-3 bg-brand-50 text-brand-700 font-bold rounded-xl hover:bg-brand-100 transition-colors flex items-center justify-center gap-2">
                            Xem tất cả iQuest <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Leaderboard Section */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-amber-500" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Bảng Xếp Hạng</h2>
                        </div>
                        <div className="space-y-2">
                            {eventLeaderboard.map((u, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                                    <span className={cn("w-6 text-center font-bold", i < 3 ? "text-lg" : "text-sm text-slate-400")}>
                                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                                    </span>
                                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border border-slate-200" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-slate-900 truncate">{u.name}</p>
                                        <p className="text-xs text-brand-600 font-bold">{u.exp} XP</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rewards Info Section */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm bg-gradient-to-br from-brand-600 to-indigo-700 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Gift className="w-24 h-24" />
                        </div>
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2 relative z-10"><Star className="w-5 h-5 text-amber-300 fill-amber-300" /> Phần thưởng</h3>
                        <p className="text-brand-100 text-sm mb-4 relative z-10">Top 3 người chơi xuất sắc nhất sẽ nhận được các phần quà đặc biệt từ iReward và danh hiệu Độc Quyền!</p>
                        <ul className="space-y-2 text-sm font-medium text-white relative z-10">
                            <li className="flex items-center gap-2">🥇 500 Credits + Thẻ Grab 200k</li>
                            <li className="flex items-center gap-2">🥈 300 Credits + Voucher 100k</li>
                            <li className="flex items-center gap-2">🥉 100 Credits</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
