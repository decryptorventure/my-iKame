import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { MascotTooltip } from './MascotTooltip';

// Steps for new employees
const NEWBIE_STEPS: Step[] = [
    {
        target: 'body',
        content: <p>Xin chào! Tôi là Trợ lý My iKame.<br />Chào mừng bạn đến với Super App nội bộ. Hãy để tôi hướng dẫn bạn một vòng nhé!</p>,
        title: 'Chào mừng đến với My iKame!',
        placement: 'center',
        disableBeacon: true,
    },
    {
        target: '#tour-nav',
        content: 'Đây là các tính năng chính của ứng dụng. Bạn có thể chấm công (iCheck), làm nhiệm vụ (iQuest) và đổi thưởng (iReward) tại đây.',
        title: 'Menu Điều hướng',
        placement: 'right',
    },
    {
        target: '#tour-header-actions',
        content: 'Những người quản lý có thể thao tác ở góc này. Bên cạnh là ô tìm kiếm nhanh toàn hệ thống.',
        title: 'Công cụ nhanh',
        placement: 'bottom-end',
    },
    {
        target: '#tour-search',
        content: 'Muốn tìm đồng nghiệp, iQuest hay thông báo? Gõ vào đây là ra ngay!',
        title: 'Tìm kiếm toàn cục',
        placement: 'bottom',
    },
    {
        target: '#tour-quests',
        content: 'Theo dõi tiến trình Onboarding, cấp độ và Credits hiện có của bạn ở ngay màn hình chính.',
        title: 'Chỉ số cá nhân',
        placement: 'right',
    },
    {
        target: '#tour-leaderboard',
        content: 'Cạnh tranh với đồng nghiệp trên Bảng xếp hạng, hoặc xem thành tích của phòng ban mình!',
        title: 'Bảng Xếp Hạng',
        placement: 'left',
    },
    {
        target: 'body',
        content: <p>Đó là tất cả những gì cơ bản nhất!<br />Bây giờ, hãy bắt đầu thực hiện các Nhiệm vụ Onboarding để kiếm phần thưởng đầu tiên nhé!</p>,
        title: 'Sẵn sàng chưa?',
        placement: 'center',
    }
];

// Steps for testing Admin
const ADMIN_STEPS: Step[] = [
    {
        target: 'body',
        content: <p>Xin chào Admin!<br />Chào mừng bạn đến với hệ thống CMS quản trị của My iKame.</p>,
        title: 'Admin Portal',
        placement: 'center',
        disableBeacon: true,
    },
    {
        target: '#tour-nav',
        content: 'Bên này là thanh công cụ quản trị: bao gồm Quản lý Users, Quests, Phần thưởng và Sự kiện.',
        title: 'Menu Quản Trị',
        placement: 'right',
    }
];

export const WelcomeTour = () => {
    const { currentUser, updateUser } = useAuthStore();
    const [run, setRun] = useState(false);

    // Determine which steps to show based on role
    const isAdmin = currentUser?.role === 'admin';
    const steps = isAdmin ? ADMIN_STEPS : NEWBIE_STEPS;

    useEffect(() => {
        // Automatically start tour for specific conditions
        const isNewbie = currentUser?.role === 'new_employee' && !currentUser?.hasCompletedWelcomeTour;
        const isNewAdmin = isAdmin && !currentUser?.hasCompletedAdminTour;

        if (isNewbie || isNewAdmin) {
            // slight delay to ensure UI is mounted
            setTimeout(() => setRun(true), 1000);
        }
    }, [currentUser, isAdmin]);

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            if (isAdmin) {
                updateUser({ hasCompletedAdminTour: true });
                window.location.href = '/admin';
            } else {
                updateUser({ hasCompletedWelcomeTour: true });
            }
        }
    };

    if (!run) return null;

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showProgress
            showSkipButton
            disableOverlayClose
            spotlightPadding={8}
            tooltipComponent={MascotTooltip}
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    zIndex: 10000,
                    primaryColor: '#0ea5e9', // brand-500
                },
                overlay: {
                    backgroundColor: 'rgba(15, 23, 42, 0.65)', // slate-900/65
                },
                spotlight: {
                    borderRadius: '16px',
                }
            }}
        />
    );
};
