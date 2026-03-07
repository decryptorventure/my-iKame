import React from 'react';
import { useAppStore } from '../store';
import { Shield, Briefcase, Star, Trophy } from 'lucide-react';
import { Modal } from './UI';
import { cn } from '../utils';

interface Props {
    userId: string | null;
    onClose: () => void;
}

export const PublicProfileModal = ({ userId, onClose }: Props) => {
    const { users, badges } = useAppStore();

    if (!userId) return null;
    const user = users.find(u => u.name === userId || u.id === userId); // Allow finding by name or ID
    if (!user) return null;

    const equippedBadge = user.equippedBadge ? badges.find(b => b.id === user.equippedBadge) : null;
    const unlockedBadgesCount = user.unlockedBadges?.length || 0;

    return (
        <Modal isOpen={!!userId} onClose={onClose} title="Hồ sơ nhân viên" size="lg">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="relative">
                        <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-3">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">{user.name}</h2>
                            {equippedBadge && (
                                <div className={cn("px-2 py-1 rounded-lg text-xs font-bold border", equippedBadge.color)} title="Huy hiệu đang trang bị">
                                    {equippedBadge.icon} {equippedBadge.name}
                                </div>
                            )}
                        </div>
                        <p className="text-brand-600 font-bold text-sm mt-1 flex items-center justify-center md:justify-start gap-2">
                            <Briefcase className="w-4 h-4" /> {user.title}
                        </p>
                        <p className="text-slate-400 text-sm mt-1">{user.department}</p>

                        <div className="flex gap-4 mt-4 justify-center md:justify-start">
                            <div className="px-3 py-1.5 bg-brand-50 rounded-xl border border-brand-100 flex items-center gap-2">
                                <Star className="w-4 h-4 text-brand-500 fill-brand-500" />
                                <span className="font-bold text-brand-700">Lv.{user.level}</span>
                            </div>
                            <div className="px-3 py-1.5 bg-orange-50 rounded-xl border border-orange-100 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-orange-500" />
                                <span className="font-bold text-orange-700">{user.exp} XP</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" /> Thành tích đạt được ({unlockedBadgesCount})
                    </h3>
                    {unlockedBadgesCount === 0 ? (
                        <p className="text-sm text-slate-500 italic">Người dùng này chưa mở khóa huy hiệu nào.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {badges.filter(b => user.unlockedBadges?.includes(b.id)).map((badge) => (
                                <div key={badge.id} className={cn("p-3 rounded-xl border flex items-center gap-3 bg-white", badge.color)}>
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-white/50 border border-white/20">
                                        {badge.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[13px]">{badge.name}</h4>
                                        <p className="text-[10px] opacity-80 mt-0.5">{badge.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};
