import React from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Target, Gift, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store';
import { cn } from '../../utils';
import { motion } from 'motion/react';

const MENU_ITEMS = [
    { id: 'dashboard', path: '/admin', label: 'Tổng quan CMS', icon: LayoutDashboard },
    { id: 'users', path: '/admin/users', label: 'Quản lý Nhân sự', icon: Users },
    { id: 'quests', path: '/admin/quests', label: 'Quản lý iQuest', icon: Target },
    { id: 'rewards', path: '/admin/rewards', label: 'Quản lý iReward', icon: Gift },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, currentUser } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-20">
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center shadow-brand">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">iKame Admin</h1>
                            <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">Portal v2.1</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    <div className="px-4 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Hệ thống</div>
                    {MENU_ITEMS.map((item) => {
                        const active = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all group",
                                    active
                                        ? "bg-brand-500 text-white shadow-brand-lg"
                                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", active ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
                                {item.label}
                                {active && (
                                    <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-4">
                        <div className="flex items-center gap-3 mb-3">
                            <img src={currentUser?.avatar} alt="" className="w-10 h-10 rounded-full ring-2 ring-brand-500/20" />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm truncate text-slate-900 dark:text-white">{currentUser?.name}</p>
                                <p className="text-[10px] text-slate-500 font-bold truncate uppercase">{currentUser?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-20 flex items-center justify-between px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-10">
                    <div>
                        <h2 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                            {MENU_ITEMS.find(i => i.path === location.pathname)?.label || 'Quản trị'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-500/20 text-xs font-bold">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            Hệ thống ổn định
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
}
