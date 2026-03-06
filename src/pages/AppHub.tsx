import React from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Target, BookOpen, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const APP_CONFIGS: Record<string, {
    name: string;
    tagline: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    url: string;
    features: string[];
}> = {
    icheck: {
        name: 'iCheck',
        tagline: 'Xem thông tin chấm công, ngày phép',
        description: 'Quản lý chấm công, theo dõi ngày phép, xin đi muộn/về sớm, làm việc ngoài công ty và xem lịch sử chấm công của bạn.',
        icon: Clock,
        color: 'from-orange-500 to-amber-500',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-700',
        url: '#',
        features: ['Chấm công hàng ngày', 'Quản lý đơn phép', 'Bảng xếp hạng check-in', 'Lịch sử chấm công'],
    },
    igoal: {
        name: 'iGoal',
        tagline: 'Nơi nắm bắt, cập nhật tiến độ mục tiêu',
        description: 'Thiết lập và theo dõi OKR (Objectives & Key Results) cá nhân và team, cập nhật tiến độ và báo cáo kết quả.',
        icon: Target,
        color: 'from-emerald-500 to-teal-500',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        textColor: 'text-emerald-700',
        url: '#',
        features: ['Thiết lập OKR', 'Theo dõi Key Results', 'Báo cáo tiến độ', 'OKR team & cá nhân'],
    },
    iwiki: {
        name: 'iWiki',
        tagline: 'Tìm kiếm tài liệu để làm việc hiệu quả hơn',
        description: 'Kho tài liệu nội bộ: sổ tay nhân viên, quy trình, chính sách, hướng dẫn sử dụng công cụ và tài liệu đào tạo.',
        icon: BookOpen,
        color: 'from-blue-500 to-sky-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-700',
        url: '#',
        features: ['Sổ tay nhân viên', 'Quy trình & chính sách', 'Tài liệu đào tạo', 'Hướng dẫn công cụ'],
    },
};

export const AppHub = ({ appId }: { appId?: string }) => {
    const params = useParams();
    const id = appId || params.appId || 'icheck';
    const config = APP_CONFIGS[id];

    if (!config) {
        return <div className="text-center py-20 text-slate-500">Ứng dụng không tồn tại.</div>;
    }

    const Icon = config.icon;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* App Card — matching mobile "Khám phá" style */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className={`${config.bgColor} ${config.borderColor} border rounded-2xl p-6 relative overflow-hidden`}>
                <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                        <h1 className={`text-2xl font-extrabold ${config.textColor}`}>{config.name}</h1>
                        <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{config.tagline}</p>
                    </div>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                        <Icon className="w-8 h-8 text-white" />
                    </div>
                </div>
            </motion.div>

            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                <h2 className="font-bold text-slate-900 mb-3">Giới thiệu</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{config.description}</p>

                <div className="mt-5 space-y-2.5">
                    {config.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${config.textColor}`} />
                            <span className="text-sm text-slate-700 font-medium">{f}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <button onClick={() => window.open(config.url, '_blank')}
                    className={`w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r ${config.color} text-white rounded-2xl font-bold text-base hover:opacity-90 transition-all active:scale-[0.98] shadow-lg`}>
                    <ExternalLink className="w-5 h-5" />
                    Mở ứng dụng {config.name}
                    <ArrowRight className="w-5 h-5" />
                </button>
            </motion.div>
        </div>
    );
};
