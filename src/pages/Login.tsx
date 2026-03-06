import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export const Login = () => {
    const { login, isAuthenticated } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Vui lòng nhập đầy đủ thông tin.'); return; }
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 900)); // simulate network
        const result = login(email, password);
        setIsLoading(false);
        if (!result.success) setError(result.error || 'Đăng nhập thất bại.');
    };

    const fillDemo = (role: 'new_employee' | 'employee' | 'admin') => {
        const emails = {
            'new_employee': 'nva@ikame.vn',
            'employee': 'emp@ikame.vn',
            'admin': 'admin@ikame.vn'
        };
        setEmail(emails[role]);
        setPassword('123456');
        setError('');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Left Panel — Brand */}
            <div className="hidden lg:flex lg:w-1/2 bg-brand-gradient relative overflow-hidden flex-col justify-between p-12">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full" />
                    <div className="absolute top-1/2 -right-16 w-64 h-64 bg-white/5 rounded-full" />
                    <div className="absolute -bottom-24 left-1/4 w-80 h-80 bg-white/5 rounded-full" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-extrabold text-white tracking-tight">My iKame</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                        Super App nội bộ<br />
                        <span className="text-brand-200">thế hệ tiếp theo</span>
                    </h1>
                    <p className="text-brand-100/80 text-lg leading-relaxed max-w-md">
                        Một cổng thông tin duy nhất tích hợp toàn bộ hệ thống nhân sự với Gamification và AI Assistant.
                    </p>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-4">
                    {[
                        { icon: '⏰', label: 'iCheck', desc: 'Chấm công thông minh' },
                        { icon: '🎯', label: 'iGoal', desc: 'Quản lý OKR' },
                        { icon: '⚔️', label: 'iQuest', desc: 'Gamification' },
                        { icon: '🤖', label: 'AI Assistant', desc: 'Hỏi đáp tức thì' },
                    ].map(item => (
                        <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                            <div className="text-2xl mb-2">{item.icon}</div>
                            <p className="font-bold text-white text-sm">{item.label}</p>
                            <p className="text-brand-100/70 text-xs">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center shadow-brand">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-extrabold text-gradient tracking-tight">My iKame</span>
                    </div>

                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Đăng nhập</h2>
                    <p className="text-slate-500 mb-8 font-medium">Chào mừng trở lại! Nhập thông tin để tiếp tục.</p>

                    {/* Demo Accounts */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <button onClick={() => fillDemo('new_employee')} className="flex flex-col items-center gap-1 p-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-[10px] font-bold text-amber-700 transition-colors">
                            <span className="text-lg">🌱</span> NV Mới
                        </button>
                        <button onClick={() => fillDemo('employee')} className="flex flex-col items-center gap-1 p-2 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-xl text-[10px] font-bold text-brand-700 transition-colors">
                            <span className="text-lg">👤</span> Chính thức
                        </button>
                        <button onClick={() => fillDemo('admin')} className="flex flex-col items-center gap-1 p-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-[10px] font-bold text-slate-700 transition-colors">
                            <span className="text-lg">🛡️</span> Admin
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Email công ty
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="ten@company.vn"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all font-medium"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Mật khẩu</label>
                                <button type="button" className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors">Quên mật khẩu?</button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all font-medium"
                                    autoComplete="current-password"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm font-medium text-rose-700"
                            >
                                <span className="text-base">❌</span> {error}
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3.5 bg-brand-gradient text-white rounded-xl font-bold text-base shadow-brand-lg hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Đăng nhập <ArrowRight className="w-5 h-5" /></>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                        <Shield className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            Dữ liệu được mã hóa E2E. Hệ thống tuân thủ tiêu chuẩn bảo mật ISO 27001.
                            Chỉ dành cho nhân viên iKame Corp.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
