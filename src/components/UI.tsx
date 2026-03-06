import React from 'react';
import { cn } from '../utils';
import { motion } from 'motion/react';

// ─── Skeleton ───────────────────────────────────────────────
export const Skeleton = ({ className }: { className?: string }) => (
    <div className={cn("bg-slate-200/80 rounded-xl animate-pulse", className)} />
);

export const SkeletonCard = ({ lines = 3 }: { lines?: number }) => (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/60 space-y-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-5 w-3/4" />
        {Array.from({ length: lines - 1 }).map((_, i) => (
            <div key={i} style={{ width: `${60 + Math.random() * 30}%` }}>
                <Skeleton className="h-3 w-full" />
            </div>
        ))}
    </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
    <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i}><Skeleton className="h-14 w-full" /></div>
        ))}
    </div>
);

// ─── Empty State ────────────────────────────────────────────
interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    action?: { label: string; onClick: () => void };
}
export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
    >
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
        {description && <p className="text-sm text-slate-500 max-w-xs leading-relaxed">{description}</p>}
        {action && (
            <button
                onClick={action.onClick}
                className="mt-5 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 transition-colors shadow-brand active:scale-95"
            >
                {action.label}
            </button>
        )}
    </motion.div>
);

// ─── Page Header ────────────────────────────────────────────
interface PageHeaderProps {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    gradient?: string;
    actions?: React.ReactNode;
}
export const PageHeader = ({ icon, title, subtitle, gradient = 'bg-brand-gradient', actions }: PageHeaderProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60"
    >
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${gradient} rounded-xl flex items-center justify-center shadow-brand`}>
                {icon}
            </div>
            <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
                {subtitle && <p className="text-slate-500 mt-0.5 text-sm font-medium">{subtitle}</p>}
            </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </motion.div>
);

// ─── Stat Card ──────────────────────────────────────────────
interface StatCardProps {
    label: string;
    value: string | number;
    sub?: string;
    icon: React.ReactNode;
    gradient: string;
    delay?: number;
    onClick?: () => void;
}
export const StatCard = ({ label, value, sub, icon, gradient, delay = 0, onClick }: StatCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white rounded-2xl p-5 border border-slate-200/60 card-hover group cursor-pointer"
        onClick={onClick}
    >
        <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                {icon}
            </div>
        </div>
        <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</p>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
            {label}{sub ? <span className="text-slate-400"> · {sub}</span> : null}
        </p>
    </motion.div>
);

// ─── Status Badge ───────────────────────────────────────────
const statusConfig = {
    pending: { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Chờ duyệt' },
    approved: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Đã duyệt' },
    rejected: { color: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Từ chối' },
    processing: { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Đang xử lý' },
    delivered: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Đã nhận' },
    completed: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Hoàn thành' },
    'in-progress': { color: 'bg-brand-50 text-brand-700 border-brand-200', label: 'Đang làm' },
    submitted: { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Đã nộp' },
};
export const StatusBadge = ({ status }: { status: keyof typeof statusConfig }) => {
    const cfg = statusConfig[status] || { color: 'bg-slate-100 text-slate-600 border-slate-200', label: status };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border ${cfg.color}`}>
            {cfg.label}
        </span>
    );
};

// ─── Modal Wrapper ──────────────────────────────────────────
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
    const sizeMap = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-3xl', xl: 'max-w-5xl' };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className={`bg-white rounded-2xl w-full ${sizeMap[size]} max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar`}
            >
                <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </motion.div>
        </div>
    );
};

// ─── Form Field ─────────────────────────────────────────────
interface FieldProps {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
}
export const Field = ({ label, error, required, children }: FieldProps) => (
    <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {children}
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
);

export const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all font-medium placeholder:text-slate-400";
export const selectClass = `${inputClass} appearance-none`;
