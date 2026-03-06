import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, LayoutGrid, Target, Gift, Rocket, ChevronRight, Check } from 'lucide-react';
import { useAuthStore } from '../store';
import { cn } from '../utils';

const NEWBIE_TOUR_STEPS = [
    {
        id: 'welcome',
        title: 'Chào mừng đến với My iKame!',
        description: 'My iKame là Super App nội bộ được thiết kế đặc biệt để giúp bạn dễ dàng hòa nhập và trải nghiệm làm việc một cách thú vị nhất tại iKame.',
        icon: Sparkles,
        gradient: 'from-blue-500 to-indigo-600',
        imageBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
    },
    {
        id: 'hub',
        title: 'Hệ sinh thái iKame Apps',
        description: 'Truy cập mọi ứng dụng công việc chỉ từ một nơi: iCheck (Chấm công), iGoal (Quản lý OKR) và iWiki (Tài liệu nội bộ). Không cần phải mở nhiều tab nữa!',
        icon: LayoutGrid,
        gradient: 'from-emerald-500 to-teal-600',
        imageBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
    },
    {
        id: 'quest',
        title: 'Làm nhiệm vụ - Thăng cấp',
        description: 'Tham gia iQuest mỗi ngày! Hoàn thành công việc, báo cáo tiến độ và tương tác với đồng nghiệp để nhận Điểm kinh nghiệm (EXP) và Credits siêu khủng.',
        icon: Target,
        gradient: 'from-amber-500 to-orange-600',
        imageBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
    },
    {
        id: 'reward',
        title: 'Đổi quà cực chất tại iReward',
        description: 'Dùng số Credits bạn tích lũy được để đổi lấy các phần thưởng xứng đáng: Voucher cafe, thẻ cào, hoặc thậm chí là thêm một ngày phép năm!',
        icon: Gift,
        gradient: 'from-rose-500 to-pink-600',
        imageBg: 'bg-rose-100',
        iconColor: 'text-rose-600',
    },
    {
        id: 'start',
        title: 'Bắt đầu hành trình!',
        description: 'Chúng tôi đã chuẩn bị một danh sách các Nhiệm vụ Onboarding dành riêng cho bạn ở màn hình Tổng quan. Hãy bắt đầu ngay thôi!',
        icon: Rocket,
        gradient: 'from-brand-500 to-purple-600',
        imageBg: 'bg-brand-100',
        iconColor: 'text-brand-600',
    },
];

const ADMIN_TOUR_STEPS = [
    {
        id: 'admin-welcome',
        title: 'Chào mừng Admin Portal!',
        description: 'Đây là trung tâm điều khiển toàn bộ hệ thống My iKame. Bạn có thể quản lý người dùng, nhiệm vụ và các chương trình đổi thưởng tại đây.',
        icon: Rocket,
        gradient: 'from-slate-700 to-slate-900',
        imageBg: 'bg-slate-100',
        iconColor: 'text-slate-800',
    },
    {
        id: 'admin-dashboard',
        title: 'Dashboard Thông minh',
        description: 'Theo dõi các chỉ số vận hành, đăng thông báo quan trọng và ghim chúng lên Newfeed để nhân viên luôn cập nhật thông tin mới nhất.',
        icon: LayoutGrid,
        gradient: 'from-brand-500 to-brand-700',
        imageBg: 'bg-brand-100',
        iconColor: 'text-brand-600',
    },
    {
        id: 'admin-management',
        title: 'Quản trị iQuest & iReward',
        description: 'Tạo các bộ nhiệm vụ Onboarding, Sự kiện và quản lý kho quà tặng một cách linh hoạt. Mọi thay đổi sẽ được cập nhật tức thì đến nhân viên.',
        icon: Target,
        gradient: 'from-purple-500 to-pink-600',
        imageBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
    }
];

export const WelcomeTour = () => {
    const { currentUser, updateUser } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const isAdmin = currentUser?.role === 'admin';
    const tourSteps = isAdmin ? ADMIN_TOUR_STEPS : NEWBIE_TOUR_STEPS;

    useEffect(() => {
        const isNewbie = currentUser?.role === 'new_employee' && !currentUser?.hasCompletedWelcomeTour;
        const isNewAdmin = isAdmin && !currentUser?.hasCompletedAdminTour;

        if (isNewbie || isNewAdmin) {
            setIsOpen(true);
        }
    }, [currentUser, isAdmin]);

    if (!isOpen) return null;

    const step = tourSteps[currentStep];
    const isLast = currentStep === tourSteps.length - 1;

    const handleFinish = () => {
        setIsOpen(false);
        if (isAdmin) {
            updateUser({ hasCompletedAdminTour: true });
            window.location.href = '/admin';
        } else {
            updateUser({ hasCompletedWelcomeTour: true });
        }
    };

    const handleNext = () => {
        if (isLast) {
            handleFinish();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleSkip = () => {
        handleFinish();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
                key="tour-modal"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10"
            >
                {/* Header Illustration */}
                <div className={cn("h-48 w-full flex items-center justify-center relative overflow-hidden transition-colors duration-500", step.imageBg)}>
                    <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${step.gradient}`} />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                            className={`w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center relative z-10 rotate-3`}
                        >
                            <step.icon className={`w-12 h-12 ${step.iconColor}`} />
                        </motion.div>
                    </AnimatePresence>

                    {/* Decorative elements */}
                    <div className="absolute top-4 left-6 w-8 h-8 rounded-full bg-white/40 blur-sm" />
                    <div className="absolute bottom-6 right-12 w-12 h-12 rounded-full bg-white/30 blur-md" />
                </div>

                {/* Content */}
                <div className="p-8 text-center">
                    {/* Progress dots */}
                    <div className="flex justify-center gap-2 mb-8">
                        {tourSteps.map((_, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    idx === currentStep ? "w-8 bg-brand-600" : "w-2 bg-slate-200"
                                )}
                            />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">
                                {step.title}
                            </h2>
                            <p className="text-slate-500 leading-relaxed font-medium text-[15px] h-20">
                                {step.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Actions */}
                    <div className="mt-8 flex items-center justify-between">
                        <button
                            onClick={handleSkip}
                            className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Bỏ qua
                        </button>
                        <button
                            onClick={handleNext}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-lg",
                                isLast ? "bg-brand-600 hover:bg-brand-700 shadow-brand-lg" : "bg-slate-900 hover:bg-black shadow-slate-900/20"
                            )}
                        >
                            {isLast ? (
                                <>Đi đến Admin Portal <ChevronRight className="w-5 h-5" /></>
                            ) : (
                                <>Tiếp theo <ChevronRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
