import React, { useState } from 'react';
import { Users, Target, Gift, Activity, Send, TrendingUp, Pin, Trash2, Calendar, UserCheck } from 'lucide-react';
import { useAppStore, Post } from '../../store';
import { cn } from '../../utils';

export function AdminDashboard() {
    const { users, quests, rewardHistory, posts, addPost, deletePost, togglePinPost, addToast } = useAppStore();

    const [annContent, setAnnContent] = useState('');
    const [isPinned, setIsPinned] = useState(false);

    const handlePostAnnouncement = () => {
        if (!annContent.trim()) return;
        addPost({
            author: {
                name: 'Admin Panel',
                avatar: 'https://cdn-icons-png.flaticon.com/512/9131/9131529.png',
                title: 'Quản trị viên'
            },
            content: annContent,
            type: 'announcement',
            isPinned: isPinned
        });
        setAnnContent('');
        setIsPinned(false);
        addToast({ type: 'success', title: 'Đã đăng thông báo', message: 'Bài viết đã được ghim lên Newfeed.' });
    };

    const activeUsers = users.filter(u => u.online).length;
    const adminPosts = posts.filter(p => p.author.name === 'Admin Panel' || p.type === 'announcement');

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Tổng quan Hệ thống</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-16 h-16 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider">Tổng Nhân sự</h3>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shadow-sm"><Users className="w-5 h-5" /></div>
                    </div>
                    <p className="text-4xl font-black text-slate-900">{users.length}</p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600">
                        <TrendingUp className="w-3 h-3" /> <span>+12% so với tháng trước</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <UserCheck className="w-16 h-16 text-emerald-600" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider">Đang Online</h3>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shadow-sm"><UserCheck className="w-5 h-5" /></div>
                    </div>
                    <p className="text-4xl font-black text-slate-900">{activeUsers}</p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Hoạt động ngay bây giờ</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target className="w-16 h-16 text-purple-600" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider">Quests hệ thống</h3>
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shadow-sm"><Target className="w-5 h-5" /></div>
                    </div>
                    <p className="text-4xl font-black text-slate-900">{quests.length}</p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full inline-flex">
                        <span>Đang vận hành</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Gift className="w-16 h-16 text-amber-600" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wider">Đơn đổi quà</h3>
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shadow-sm"><Gift className="w-5 h-5" /></div>
                    </div>
                    <p className="text-4xl font-black text-slate-900">{rewardHistory.length}</p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-600">
                        <span>{rewardHistory.filter(h => h.status === 'processing').length} đơn chờ xử lý</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Announcement Section */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center shadow-brand">
                                <Pin className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="font-black text-slate-900">Đăng tin Thông báo</h2>
                                <p className="text-xs text-slate-500 font-medium">Nội dung sẽ xuất hiện trên đầu Newfeed của nhân viên</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <textarea
                                value={annContent}
                                onChange={e => setAnnContent(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 rounded-2xl p-4 text-sm font-medium transition-all"
                                rows={4}
                                placeholder="Nhập nội dung thông báo quan trọng..."
                            />

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={cn(
                                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                                        isPinned ? "bg-brand-600 border-brand-600" : "border-slate-300 group-hover:border-brand-400"
                                    )}>
                                        {isPinned && <Pin className="w-3 h-3 text-white" />}
                                        <input type="checkbox" className="hidden" checked={isPinned} onChange={e => setIsPinned(e.target.checked)} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">Ghim thông báo lên đầu Newfeed</span>
                                </label>

                                <button
                                    onClick={handlePostAnnouncement}
                                    disabled={!annContent.trim()}
                                    className="px-6 py-2.5 bg-brand-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-brand-700 transition shadow-brand disabled:opacity-50 active:scale-95"
                                >
                                    <Send className="w-4 h-4" /> Đăng tin ngay
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Performance Analytics (Mock) */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h2 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-brand-600" /> Biểu đồ Hiệu suất hệ thống
                        </h2>

                        <div className="space-y-6">
                            {[
                                { label: 'Tỷ lệ hoàn thành Quest', val: 68, color: 'bg-emerald-500' },
                                { label: 'Tỷ lệ đổi quà / Credits', val: 42, color: 'bg-amber-500' },
                                { label: 'Trung bình Kudos / Tuần', val: 85, color: 'bg-blue-500' },
                                { label: 'Nhân sự hoạt động liên tục (Streak)', val: 56, color: 'bg-rose-500' }
                            ].map((stat, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-600">
                                        <span>{stat.label}</span>
                                        <span>{stat.val}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-1000 delay-300", stat.color)}
                                            style={{ width: `${stat.val}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Recent Admin Posts */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                        <h2 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2 uppercase tracking-widest text-slate-400">
                            Các thông báo đã đăng
                        </h2>
                        <div className="space-y-4">
                            {adminPosts.length === 0 ? (
                                <p className="text-center text-slate-400 py-8 text-sm italic">Chưa có thông báo nào</p>
                            ) : (
                                adminPosts.slice(0, 5).map(post => (
                                    <div key={post.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl relative group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-1.5 font-black text-[10px] text-brand-600 uppercase">
                                                {post.isPinned && <Pin className="w-3 h-3" />} {post.type}
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => togglePinPost(post.id)} className="p-1 text-slate-400 hover:text-brand-600"><Pin className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => deletePost(post.id)} className="p-1 text-slate-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed mb-2 font-medium">{post.content}</p>
                                        <div className="text-[10px] text-slate-400 font-bold">{post.time}</div>
                                    </div>
                                ))
                            )}
                        </div>
                        {adminPosts.length > 5 && (
                            <button className="w-full mt-4 py-2 text-xs font-bold text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">Xem tất cả thông báo</button>
                        )}
                    </div>

                    {/* App Health (Mock) */}
                    <div className="bg-brand-gradient rounded-2xl p-6 text-white shadow-brand">
                        <h3 className="font-black mb-1 uppercase tracking-tighter italic text-xl">App Health</h3>
                        <p className="text-xs text-white/70 mb-6">Tình trạng hệ thống My iKame</p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold">Uptime</span>
                                <span className="font-black">99.98%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold">Database Latency</span>
                                <span className="font-black">24ms</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold">Active Sessions</span>
                                <span className="font-black">1.2k</span>
                            </div>
                            <div className="pt-4 border-t border-white/20">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-300">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                    Tất cả hệ thống đang ổn định
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
