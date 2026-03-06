export const translations = {
    vi: {
        dashboard: 'Tổng quan',
        icheck: 'iCheck',
        igoal: 'iGoal',
        iquest: 'iQuest',
        iwiki: 'iWiki',
        ireward: 'iReward',
        hris: 'Hồ sơ nhân sự',
        profile: 'Hồ sơ cá nhân',
        settings: 'Cài đặt',
        logout: 'Đăng xuất',
        search_placeholder: 'Tìm kiếm trang, tính năng...',
        notifications: 'Thông báo',
        online: 'Trực tuyến',
        offline: 'Ngoại tuyến',
    },
    en: {
        dashboard: 'Dashboard',
        icheck: 'Attendance',
        igoal: 'OKRs',
        iquest: 'Quests',
        iwiki: 'Wiki',
        ireward: 'Rewards',
        hris: 'HRIS',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout',
        search_placeholder: 'Search pages, features...',
        notifications: 'Notifications',
        online: 'Online',
        offline: 'Offline',
    }
};

export type Lang = keyof typeof translations;
