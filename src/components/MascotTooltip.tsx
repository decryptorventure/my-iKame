import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TooltipRenderProps } from 'react-joyride';
import { X, ChevronRight, Check } from 'lucide-react';
import { cn } from '../utils';
import assistantAvatar from '../assets/assistant.png';

export const MascotTooltip = ({
    index,
    step,
    tooltipProps,
    primaryProps,
    skipProps,
    isLastStep,
}: TooltipRenderProps) => {
    return (
        <div
            {...tooltipProps}
            className="w-[340px] bg-white rounded-3xl shadow-2xl border border-slate-200/60 relative p-0"
        >
            <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full h-full p-0 m-0"
            >
                {/* Mascot Avatar positioned overlapping the card */}
                <div className="absolute -top-6 -left-4 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10 animate-bounce-slow overflow-hidden">
                    <img src={assistantAvatar} alt="Assistant" className="w-full h-full object-contain" />
                </div>

                <div className="pt-8 pb-5 px-6">
                    {/* Title & Close */}
                    <div className="flex justify-between items-start mb-2 pl-6">
                        <h3 className="font-bold text-slate-900 text-lg leading-tight">
                            {step.title}
                        </h3>
                        <button
                            {...skipProps}
                            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors flex-shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="text-slate-500 text-[14px] leading-relaxed mb-6 font-medium">
                        {step.content}
                    </div>

                    {/* Footer Controls */}
                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100">
                        <div className="text-xs font-bold text-slate-400">
                            Bước {index + 1}
                        </div>

                        <button
                            {...primaryProps}
                            className={cn(
                                "flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm text-white shadow-md transition-all transform active:scale-95",
                                isLastStep
                                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                                    : "bg-brand-600 hover:bg-brand-700 shadow-brand-500/20"
                            )}
                        >
                            {isLastStep ? (
                                <>Hoàn tất <Check className="w-4 h-4" /></>
                            ) : (
                                <>Tiếp tục <ChevronRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
