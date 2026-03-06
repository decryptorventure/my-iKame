import React from 'react';
import { useAppStore, useAuthStore } from '../store';
import { Settings as SettingsIcon, Moon, Sun, Languages, Bell, Shield, Smartphone, Monitor, ChevronRight, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { PageHeader } from '../components/UI';
import { cn } from '../utils';

export const Settings = () => {
    const { theme, language, toggleTheme, setLanguage, addToast } = useAppStore();
    const { currentUser } = useAuthStore();

    const handleSave = () => {
        addToast({ type: 'success', title: 'Đã lưu cài đặt!', message: 'Tùy chọn của bạn đã được cập nhật thành công.' });
    };

    return (
        <div className="space-y-6">
            <PageHeader
                icon={<SettingsIcon className="w-6 h-6 text-white" />}
                title="Cài đặt hệ thống"
                subtitle="Tùy chỉnh giao diện, ngôn ngữ và thông báo"
                gradient="bg-brand-gradient"
            />

            <div className="max-w-4xl">
                <div className="grid grid-cols-1 gap-6">
                    {/* Appearance */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                                <Monitor className="w-5 h-5 text-brand-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Giao diện & Trải nghiệm</h3>
                                <p className="text-xs text-slate-500">Tùy chỉnh chế độ hiển thị</p>
                            </div>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-800">Chế độ tối (Dark Mode)</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Giảm mỏi mắt khi sử dụng ứng dụng vào ban đêm.</p>
                                </div>
                                <button onClick={toggleTheme} className={cn(
                                    "relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none",
                                    theme === 'dark' ? "bg-slate-800" : "bg-slate-200"
                                )}>
                                    <motion.div
                                        animate={{ x: theme === 'dark' ? 24 : 4 }}
                                        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                                    >
                                        {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-slate-700" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                                    </motion.div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-800">Ngôn ngữ hiển thị</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Chọn ngôn ngữ bạn muốn sử dụng trên toàn ứng dụng.</p>
                                </div>
                                <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                                    <button
                                        onClick={() => setLanguage('vi')}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                                            language === 'vi' ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        Tiếng Việt
                                    </button>
                                    <button
                                        onClick={() => setLanguage('en')}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                                            language === 'en' ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        English
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Notifications */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                                <Bell className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Thông báo</h3>
                                <p className="text-xs text-slate-500">Cài đặt cách bạn nhận tin tức</p>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            {[
                                { title: 'Thông báo phê duyệt', desc: 'Nhận tin khi đơn nghỉ phép hoặc quest được duyệt.' },
                                { title: 'Nhắc nhở iCheck', desc: 'Thông báo khi chưa chấm công sáng hoặc chiều.' },
                                { title: 'Cập nhật iGoal', desc: 'Nhắc nhở cập nhật tiến độ KR hàng tuần.' },
                                { title: 'Tin tức công ty', desc: 'Các thông báo quan trọng từ bộ phận HR.' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                    </div>
                                    <div className="w-10 h-6 bg-emerald-500 rounded-full relative p-1 cursor-not-allowed">
                                        <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Security & System */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                <Shield className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Hệ thống & Bảo mật</h3>
                                <p className="text-xs text-slate-500">Phiên bản v2.1.0 — Bảo mật ISO 27001</p>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {[
                                { icon: Shield, label: 'Xác thực sinh trắc học', value: 'Bật' },
                                { icon: Smartphone, label: 'Thiết bị đã đăng nhập', value: '2 thiết bị' },
                                { icon: Languages, label: 'Bản dịch AI tự động', value: 'Bật' },
                            ].map((item, i) => (
                                <button key={i} className="w-full px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
                                        <span className="text-sm font-bold text-slate-700">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400 font-medium">{item.value}</span>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button className="px-8 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-all">Đặt lại mặc định</button>
                        <button onClick={handleSave} className="px-10 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 shadow-brand transition-all">
                            Lưu cấu hình
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
