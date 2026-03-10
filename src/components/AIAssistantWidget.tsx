import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore, useAppStore } from '../store';
import { Sparkles, CheckCircle2, Award, Clock, Star, ArrowRight, BellRing, Rocket } from 'lucide-react';
import { cn } from '../utils';

export const AIAssistantWidget = () => {
    const { currentUser } = useAuthStore();
    const { quests, todayCheckedIn, checkIn, addToast } = useAppStore();
    const [activeSuggestion, setActiveSuggestion] = useState<number>(0);

    const isNewEmployee = currentUser?.role === 'new_employee';
    const name = currentUser?.name?.split(' ').pop() || 'bạn';

    // AI Logic for suggestions
    const getSuggestions = () => {
        const suggestions = [];

        // 1. New Employee Priority: Onboarding Quests
        if (isNewEmployee) {
            const onboardingQuests = quests.filter(q => q.tabId === 'onboarding');
            const uncompletedOnboarding = onboardingQuests.filter(q => q.status !== 'completed');

            if (uncompletedOnboarding.length > 0) {
                suggestions.push({
                    id: 'onboarding',
                    title: `Bạn còn ${uncompletedOnboarding.length} nhiệm vụ Onboarding chưa hoàn thành!`,
                    desc: 'Hãy tiếp tục làm quen với môi trường mới nhé. Bạn đang làm rất tốt.',
                    actionText: 'Tiếp tục Onboarding',
                    actionLink: '/iquest',
                    icon: <Rocket className="w-5 h-5 text-orange-500" />,
                    color: 'from-orange-500 to-amber-500',
                    bg: 'bg-orange-50',
                    borderColor: 'border-orange-100',
                    textColor: 'text-orange-700'
                });
            } else {
                suggestions.push({
                    id: 'onboarding-done',
                    title: 'Tuyệt vời, bạn đã hoàn thành 100% Onboarding!',
                    desc: 'Chào mừng bạn chính thức gia nhập đội ngũ. Hãy bắt đầu chinh phục các nhiệm vụ hàng ngày nhé.',
                    actionText: 'Xem nhiệm vụ mới',
                    actionLink: '/iquest',
                    icon: <Award className="w-5 h-5 text-emerald-500" />,
                    color: 'from-emerald-500 to-teal-500',
                    bg: 'bg-emerald-50',
                    borderColor: 'border-emerald-100',
                    textColor: 'text-emerald-700'
                });
            }
        }

        // 2. Daily Check-in
        if (!todayCheckedIn) {
            suggestions.push({
                id: 'checkin',
                title: 'Bạn chưa điểm danh hôm nay',
                desc: 'Đừng quên iCheck để duy trì chuỗi (streak) nhận thưởng nhé.',
                actionText: 'iCheck ngay',
                actionType: 'button',
                actionClick: () => checkIn(),
                icon: <Clock className="w-5 h-5 text-blue-500" />,
                color: 'from-blue-500 to-indigo-500',
                bg: 'bg-blue-50',
                borderColor: 'border-blue-100',
                textColor: 'text-blue-700'
            });
        }

        // 3. Kudos Suggestion (for all if they checked in and finished onboarding)
        if (todayCheckedIn && (!isNewEmployee || (isNewEmployee && quests.filter(q => q.tabId === 'onboarding' && q.status !== 'completed').length === 0))) {
            suggestions.push({
                id: 'kudos',
                title: 'Giữ năng lượng tích cực nhé',
                desc: 'Có ai đã giúp đỡ bạn hôm nay không? Gửi ngay một lời cảm ơn (Kudos) để khích lệ tinh thần đồng đội nhe.',
                actionText: 'Đăng cập nhật',
                actionType: 'button',
                actionClick: () => {
                    // just scroll to top of feed to post, or we can just show a toast for mock
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    addToast({ type: 'info', title: 'Gợi ý', message: 'Hãy sử dụng form đăng bài để gửi Kudos nhé' });
                },
                icon: <Star className="w-5 h-5 text-purple-500" />,
                color: 'from-purple-500 to-pink-500',
                bg: 'bg-purple-50',
                borderColor: 'border-purple-100',
                textColor: 'text-purple-700'
            });
        }

        return suggestions;
    };

    const suggestions = getSuggestions();

    // Auto rotate suggestions
    useEffect(() => {
        if (suggestions.length <= 1) return;
        const interval = setInterval(() => {
            setActiveSuggestion((prev) => (prev + 1) % suggestions.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [suggestions.length]);

    if (suggestions.length === 0) return null;

    const currentSuggestion = suggestions[activeSuggestion];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-[2rem] p-7 border border-slate-200/50 shadow-xl overflow-hidden bg-white/60 backdrop-blur-xl group"
        >
            {/* Dynamic Background Glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-500/20 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700 delay-100"></div>

            {/* Header: AI ORB */}
            <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 90, 180, 270, 360]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-400 via-orange-500 to-brand-600 opacity-20 blur-sm"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center shadow-lg ring-2 ring-indigo-100 overflow-hidden"
                    >
                        <img src="/logo.png" className="w-7 h-7 object-contain" alt="Logo" />
                    </motion.div>
                </div>
                <div>
                    <h3 className="font-extrabold text-[12px] uppercase tracking-[0.15em] bg-gradient-to-r from-brand-600 to-orange-500 bg-clip-text text-transparent">
                        My iKame Assistant
                    </h3>
                    <p className="text-xs font-bold text-slate-500">Đang hoạt động</p>
                </div>
            </div>

            {/* AI Message Simulation */}
            <div className="text-sm text-slate-700 font-medium mb-5 bg-slate-50/80 rounded-2xl p-4 border border-slate-100 relative z-10">
                Chào <span className="font-extrabold text-brand-600">{name}</span>, tôi đã phân tích tiến độ của bạn. Dưới đây là đề xuất ưu tiên hiện tại:
            </div>

            {/* Suggestion Card */}
            <div className="relative h-[180px] z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSuggestion.id}
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className={cn("absolute inset-0 rounded-2xl p-5 border shadow-sm flex flex-col justify-between", currentSuggestion.bg, currentSuggestion.borderColor)}
                    >
                        <div>
                            <div className="flex items-start gap-3 mb-2">
                                <div className={cn("mt-0.5 p-1.5 rounded-xl bg-white shadow-sm ring-1 ring-slate-100", currentSuggestion.textColor)}>
                                    {currentSuggestion.icon}
                                </div>
                                <h4 className="font-bold text-slate-900 text-sm leading-snug pr-2">
                                    {currentSuggestion.title}
                                </h4>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium pl-[44px]">
                                {currentSuggestion.desc}
                            </p>
                        </div>

                        <div className="pl-[44px] pb-1">
                            {currentSuggestion.actionType === 'button' ? (
                                <button
                                    onClick={currentSuggestion.actionClick}
                                    className={cn("inline-flex items-center gap-1.5 text-xs font-bold bg-white px-3 py-1.5 rounded-xl shadow-sm border ring-1 transition-all hover:pr-4", currentSuggestion.borderColor, currentSuggestion.textColor, "ring-white/50")}
                                >
                                    {currentSuggestion.actionText} <ArrowRight className="w-3.5 h-3.5 transition-transform" />
                                </button>
                            ) : (
                                <a
                                    href={currentSuggestion.actionLink}
                                    className={cn("inline-flex items-center gap-1.5 text-xs font-bold bg-white px-3 py-1.5 rounded-xl shadow-sm border ring-1 transition-all hover:pr-4", currentSuggestion.borderColor, currentSuggestion.textColor, "ring-white/50")}
                                >
                                    {currentSuggestion.actionText} <ArrowRight className="w-3.5 h-3.5 transition-transform" />
                                </a>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Pagination dots if multiple suggestions */}
            {suggestions.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-6 relative z-10">
                    {suggestions.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveSuggestion(idx)}
                            className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                activeSuggestion === idx ? "w-4 bg-brand-500" : "bg-slate-200 hover:bg-slate-300"
                            )}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
};
