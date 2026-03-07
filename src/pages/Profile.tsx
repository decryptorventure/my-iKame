import React, { useState } from 'react';
import { useAuthStore, useAppStore } from '../store';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, Camera, Edit3, Save, Zap, Star, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { PageHeader, Field, inputClass, Modal } from '../components/UI';
import { cn } from '../utils';

export const Profile = () => {
    const { currentUser, updateUser } = useAuthStore();
    const { addToast, badges, equipBadge } = useAppStore();
    const [isEditing, setIsEditing] = useState(false);
    const [viewTab, setViewTab] = useState<'info' | 'achievements'>('info');
    const [form, setForm] = useState({
        name: currentUser?.name || '',
        title: currentUser?.title || '',
        phone: currentUser?.phone || '',
        address: currentUser?.address || '',
        dob: currentUser?.dob || '',
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser(form);
        setIsEditing(false);
        addToast({ type: 'success', title: 'Cập nhật thành công!', message: 'Thông tin hồ sơ đã được lưu.' });
    };

    const handleEquipBadge = (badgeId: string) => {
        equipBadge(badgeId);
        addToast({ type: 'success', title: 'Đã trang bị!', message: 'Huy hiệu đã được hiển thị bên cạnh tên của bạn.' });
    };

    if (!currentUser) return null;

    return (
        <div className="space-y-6">
            <PageHeader
                icon={<User className="w-6 h-6 text-white" />}
                title="Hồ sơ cá nhân"
                subtitle="Quản lý thông tin cá nhân và bảo mật tài khoản"
                gradient="bg-brand-gradient"
            />

            <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
                <button onClick={() => setViewTab('info')} className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all", viewTab === 'info' ? 'bg-brand-600 text-white shadow-brand' : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300')}>
                    Thông tin cá nhân
                </button>
                <button onClick={() => setViewTab('achievements')} className={cn("px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2", viewTab === 'achievements' ? 'bg-amber-500 text-white shadow-brand' : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300')}>
                    <Trophy className="w-4 h-4" /> Thành tựu & Huy hiệu
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Avatar & Basic Stats */}
                <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-24 bg-brand-gradient opacity-10 group-hover:opacity-20 transition-opacity" />

                        <div className="relative mb-6">
                            <div className="w-32 h-32 mx-auto rounded-full p-1 bg-white border-2 border-brand-200 shadow-xl overflow-hidden relative group/avatar">
                                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full object-cover transition-transform group-hover/avatar:scale-110" />
                                <button className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                    <Camera className="w-6 h-6 text-white" />
                                </button>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center text-white" title="Đang trực tuyến">
                                <Shield className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">{currentUser.name}</h2>
                            {currentUser.equippedBadge && (
                                <div className={cn("px-2 py-1 rounded-lg text-[10px] font-bold border", badges.find(b => b.id === currentUser.equippedBadge)?.color)} title="Huy hiệu đang trang bị">
                                    {badges.find(b => b.id === currentUser.equippedBadge)?.icon} {badges.find(b => b.id === currentUser.equippedBadge)?.name}
                                </div>
                            )}
                        </div>
                        <p className="text-brand-600 font-bold text-sm mt-1">{currentUser.title}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{currentUser.department}</p>

                        <div className="grid grid-cols-2 gap-3 mt-8">
                            <div className="bg-brand-50 rounded-2xl p-3 border border-brand-100">
                                <p className="text-2xl font-black text-brand-600">Lv.{currentUser.level}</p>
                                <p className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">Cấp độ</p>
                            </div>
                            <div className="bg-orange-50 rounded-2xl p-3 border border-orange-100">
                                <p className="text-2xl font-black text-orange-600">{currentUser.credits}</p>
                                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Credits</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-slate-500 uppercase">Tiến độ cấp độ</span>
                                <span className="text-brand-600">{currentUser.exp} / {currentUser.maxExp} XP</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(currentUser.exp / currentUser.maxExp) * 100}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-brand-gradient rounded-full"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Detailed Info or Badges */}
                <div className="lg:col-span-2 space-y-6">
                    {viewTab === 'info' ? (
                        <>
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden min-h-[500px]">
                                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        <Edit3 className="w-4 h-4 text-brand-600" /> Thông tin cá nhân
                                    </h3>
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 bg-white border border-brand-200 text-brand-600 rounded-xl text-sm font-bold hover:bg-brand-50 transition-all flex items-center gap-2 shadow-sm shadow-brand/5">
                                            Chỉnh sửa
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-500 text-sm font-bold hover:bg-slate-100 rounded-xl transition-all">Hủy</button>
                                            <button onClick={handleSave} className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-all flex items-center gap-2 shadow-brand">
                                                <Save className="w-4 h-4" /> Lưu lại
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="p-8">
                                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <Field label="Họ và tên">
                                            {isEditing ? (
                                                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} />
                                            ) : (
                                                <div className="py-2.5 px-4 bg-slate-50/50 border border-transparent rounded-2xl text-slate-900 font-bold">{currentUser.name}</div>
                                            )}
                                        </Field>
                                        <Field label="Chức vụ">
                                            {isEditing ? (
                                                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputClass} />
                                            ) : (
                                                <div className="py-2.5 px-4 bg-slate-50/50 border border-transparent rounded-2xl text-slate-900 font-bold">{currentUser.title}</div>
                                            )}
                                        </Field>
                                        <Field label="Email công ty">
                                            <div className="py-2.5 px-4 bg-slate-100 border border-transparent rounded-2xl text-slate-500 font-bold cursor-not-allowed flex items-center gap-2">
                                                <Mail className="w-4 h-4" /> {currentUser.email}
                                            </div>
                                        </Field>
                                        <Field label="Số điện thoại">
                                            {isEditing ? (
                                                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                                            ) : (
                                                <div className="py-2.5 px-4 bg-slate-50/50 border border-transparent rounded-2xl text-slate-900 font-bold flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-brand-500" /> {currentUser.phone || 'Chưa cập nhật'}
                                                </div>
                                            )}
                                        </Field>
                                        <Field label="Ngày sinh">
                                            {isEditing ? (
                                                <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} className={inputClass} />
                                            ) : (
                                                <div className="py-2.5 px-4 bg-slate-50/50 border border-transparent rounded-2xl text-slate-900 font-bold flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-brand-500" /> {currentUser.dob || 'Chưa cập nhật'}
                                                </div>
                                            )}
                                        </Field>
                                        <Field label="Phòng ban">
                                            <div className="py-2.5 px-4 bg-slate-100 border border-transparent rounded-2xl text-slate-500 font-bold cursor-not-allowed flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" /> {currentUser.department}
                                            </div>
                                        </Field>
                                        <Field label="Ngày vào làm">
                                            <div className="py-2.5 px-4 bg-slate-100 border border-transparent rounded-2xl text-slate-500 font-bold cursor-not-allowed flex items-center gap-2">
                                                <Shield className="w-4 h-4" /> {currentUser.startDate}
                                            </div>
                                        </Field>
                                        <Field label="Địa chỉ">
                                            {isEditing ? (
                                                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={inputClass} />
                                            ) : (
                                                <div className="py-2.5 px-4 bg-slate-50/50 border border-transparent rounded-2xl text-slate-900 font-bold flex items-center gap-2 md:col-span-2">
                                                    <MapPin className="w-4 h-4 text-brand-500" /> {currentUser.address || 'Chưa cập nhật'}
                                                </div>
                                            )}
                                        </Field>
                                    </form>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                    className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm">
                                    <h3 className="font-bold text-slate-900 mb-4">Bảo mật</h3>
                                    <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-sm font-bold text-slate-600 transition-all border border-slate-100">
                                        Đổi mật khẩu
                                    </button>
                                    <button className="w-full mt-3 py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-sm font-bold text-slate-600 transition-all border border-slate-100">
                                        Xác thực 2 lớp (2FA)
                                    </button>
                                </motion.div>

                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                    className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm">
                                    <h3 className="font-bold text-slate-900 mb-4">Cài đặt trợ lý AI</h3>
                                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">Tùy chỉnh cách iKame Assistant gọi tên và hỗ trợ bạn.</p>
                                    <button className="w-full py-3 bg-brand-50 hover:bg-brand-100 rounded-2xl text-sm font-bold text-brand-600 transition-all border border-brand-100">
                                        Tùy chỉnh AI
                                    </button>
                                </motion.div>
                            </div>
                        </>
                    ) : (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-8 min-h-[500px]">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-amber-500" /> Bộ sưu tập Huy hiệu
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {badges.map((badge, i) => {
                                    const isUnlocked = currentUser.unlockedBadges?.includes(badge.id);
                                    const isEquipped = currentUser.equippedBadge === badge.id;
                                    return (
                                        <motion.div key={badge.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                            className={cn("p-5 rounded-2xl border transition-all flex items-start gap-4",
                                                isUnlocked ? cn("bg-white", badge.color) : "bg-slate-50 border-slate-200 opacity-60 grayscale"
                                            )}>
                                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm border", isUnlocked ? badge.color : "bg-slate-100 border-slate-200 text-slate-400")}>
                                                {badge.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900 text-sm">{badge.name}</h4>
                                                <p className="text-xs text-slate-600 mt-1">{badge.description}</p>
                                                <p className="text-[10px] text-slate-400 mt-2 font-medium bg-white/50 inline-block px-2 py-0.5 rounded-lg border border-slate-200/50">Yêu cầu: {badge.condition}</p>
                                                {isUnlocked && (
                                                    <div className="mt-3">
                                                        <button
                                                            disabled={isEquipped}
                                                            onClick={() => handleEquipBadge(badge.id)}
                                                            className={cn("px-3 py-1.5 rounded-xl text-xs font-bold transition-all", isEquipped ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed" : "bg-brand-600 text-white hover:bg-brand-700 shadow-sm")}>
                                                            {isEquipped ? 'Đang hiển thị' : 'Đeo huy hiệu'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
