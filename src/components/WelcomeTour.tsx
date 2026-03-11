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
        disableBeacon: true,
    },
    {
        target: '#tour-header-actions',
        content: 'Những người quản lý có thể thao tác ở góc này. Bên cạnh là ô tìm kiếm nhanh toàn hệ thống.',
        title: 'Công cụ nhanh',
        placement: 'bottom-end',
        disableBeacon: true,
    },
    {
        target: '#tour-search',
        content: 'Muốn tìm đồng nghiệp, iQuest hay thông báo? Gõ vào đây là ra ngay!',
        title: 'Tìm kiếm toàn cục',
        placement: 'bottom',
        disableBeacon: true,
    },
    {
        target: '#tour-quests',
        content: 'Theo dõi tiến trình Onboarding, cấp độ và Credits hiện có của bạn ở ngay màn hình chính.',
        title: 'Chỉ số cá nhân',
        placement: 'auto',
        disableBeacon: true,
    },
    {
        target: '#tour-leaderboard',
        content: 'Cạnh tranh với đồng nghiệp trên Bảng xếp hạng, hoặc xem thành tích của phòng ban mình!',
        title: 'Bảng Xếp Hạng',
        placement: 'auto',
        disableBeacon: true,
    },
    {
        target: '#tour-feed',
        content: 'Đây là News Feed. Nơi cập nhật các thông báo từ phòng ban PnOD, xem vinh danh đồng nghiệp, và nhận các gợi ý thông minh từ "Em Sen iKame".',
        title: 'Bảng Tin My iKame',
        placement: 'auto',
        disableBeacon: true,
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

// Steps for Official Employees (role: employee, manager)
const OFFICIAL_STEPS: Step[] = [
    {
        target: 'body',
        content: <p>Chào mừng bạn trải nghiệm My iKame - Super App dành riêng cho người iKame!<br />Hãy dành 1 phút để điểm qua các tính năng thú vị trên ứng dụng nhé.</p>,
        title: 'Trải nghiệm Super App',
        placement: 'center',
        disableBeacon: true,
    },
    {
        target: '#tour-nav',
        content: 'Đây là trung tâm điều hướng. Bạn có thể dễ dàng truy cập iCheck chấm công, iQuest nhiệm vụ hay Đổi quà iReward từ đây.',
        title: 'Menu Tiện Ích',
        placement: 'right',
        disableBeacon: true,
    },
    {
        target: '#tour-search',
        content: 'Cần tìm nhanh tài liệu chính sách, ứng dụng hay đồng nghiệp? Gõ vào thanh tìm kiếm toàn cục này.',
        title: 'Tìm kiếm Siêu Tốc',
        placement: 'bottom',
        disableBeacon: true,
    },
    {
        target: '#tour-feed',
        content: 'Đây là News Feed. Góc cập nhật thông báo quan trọng từ công ty, vinh danh thành tích, và các cập nhật từ AI Assistant.',
        title: 'Bảng Tin Nội Bộ',
        placement: 'auto',
        disableBeacon: true,
    },
    {
        target: 'body',
        content: <p>Để bắt đầu, hãy thử chấm công <b>iCheck</b> ngày hôm nay trên điện thoại, hoặc gửi một <b>Kudos</b> khen tặng đồng nghiệp trên bảng tin nhé!<br />Cùng tích lũy EXP và lên level nào!</p>,
        title: 'Sẵn sàng trải nghiệm',
        placement: 'center',
    }
];

export const WelcomeTour = () => {
    const { currentUser, updateUser } = useAuthStore();
    const [run, setRun] = useState(false);

    // Determine which steps to show based on role
    const isAdmin = currentUser?.role === 'admin';
    const isNewbie = currentUser?.role === 'new_employee';
    const steps = isAdmin ? ADMIN_STEPS : (isNewbie ? NEWBIE_STEPS : OFFICIAL_STEPS);

    useEffect(() => {
        // Automatically start tour for specific conditions
        const isNewbieTour = isNewbie && !currentUser?.hasCompletedWelcomeTour;
        const isOfficialTour = !isNewbie && !isAdmin && !currentUser?.hasCompletedWelcomeTour;
        const isNewAdmin = isAdmin && !currentUser?.hasCompletedAdminTour;

        if (isNewbieTour || isOfficialTour || isNewAdmin) {
            // slight delay to ensure UI is mounted
            setTimeout(() => setRun(true), 1000);
        }
    }, [currentUser, isAdmin, isNewbie]);

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
            disableScrolling={false}
            scrollOffset={200}
            scrollDuration={500}
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
