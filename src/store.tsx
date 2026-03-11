import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Role = 'employee' | 'new_employee' | 'manager' | 'admin';

export interface Reward {
  id: number;
  title: string;
  desc: string;
  cost: number;
  icon: any; // Using any for Lucide icons in store to avoid complex typing for now
  gradient: string;
  tag: string | null;
  stock: number;
  category: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  level: number;
  exp: number;
  maxExp: number;
  credits: number;
  avatar: string;
  department: string;
  title: string;
  phone?: string;
  address?: string;
  dob?: string;
  startDate?: string;
  online: boolean;
  hasCompletedWelcomeTour?: boolean;
  hasCompletedAdminTour?: boolean;
  hasReceivedOnboardingReward?: boolean;
  equippedBadge?: string;
  unlockedBadges?: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  condition: string;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'exp' | 'levelup';

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
  expAmount?: number;
  duration?: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'approval' | 'reminder' | 'celebration' | 'system' | 'quest';
  icon?: string;
  link?: string;
}

export interface AttendanceRecord {
  date: string;           // YYYY-MM-DD
  checkIn?: string;       // HH:mm
  checkOut?: string;
  status: 'on_time' | 'late' | 'absent' | 'holiday' | 'wfh' | 'ot';
  expEarned: number;
  note?: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  type: 'annual' | 'sick' | 'maternity' | 'ot' | 'wfh';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedBy?: string;
}

export interface OKR {
  id: string;
  userId: string;
  title: string;
  quarter: string;        // "Q1-2026"
  progress: number;       // 0-100
  keyResults: KeyResult[];
  createdAt: string;
}

export interface KeyResult {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
}

export interface Quest {
  id: number;
  title: string;
  desc: string;
  exp: number;
  credits: number;
  progress: number;
  target: number;
  status: 'pending' | 'in-progress' | 'submitted' | 'completed' | 'rejected';
  subCategory: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  tabId: string;
  deadline?: string;
  howToComplete?: string;
  eventName?: string;
  eventDesc?: string;
  eventEndTime?: string;
}

export interface TournamentEvent {
  id: string;
  name: string;
  description: string;
  banner: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface RewardHistory {
  id: string;
  rewardId: number;
  rewardTitle: string;
  cost: number;
  date: string;
  status: 'processing' | 'delivered';
}

export interface Post {
  id: number;
  author: { name: string; avatar: string; title: string };
  content: string;
  image?: string;
  time: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  type: 'announcement' | 'update' | 'achievement' | 'event' | 'ai_update' | 'kudos';
  isPinned?: boolean;
  badge?: string;
  featuredUser?: { name: string; title: string; avatar: string };
  expEarned?: number;
}

export interface CelebrationItem {
  id: number;
  user: { name: string; avatar: string; title: string; department: string };
  type: 'birthday' | 'anniversary';
  date: string;
  years?: number; // years of service for anniversary
  wishes: number;
  hasWished: boolean;
}

// ─── MOCK DATA ────────────────────────────────────────────────

export const MOCK_USERS: Record<string, { user: User; password: string }> = {
  'thutrang@ikame.vn': {
    password: '123456',
    user: {
      id: 'u_new', name: 'Thu Trang', email: 'thutrang@ikame.vn',
      role: 'new_employee', level: 1, exp: 0, maxExp: 1000, credits: 0,
      avatar: 'https://picsum.photos/seed/thutrang/150/150',
      department: 'Marketing', title: 'Content Creator (Fresher)',
      phone: '0901234567', address: '123 Nguyễn Văn Linh, Q7, TP.HCM',
      dob: '2000-08-20', startDate: new Date().toISOString().split('T')[0], online: true,
      hasCompletedWelcomeTour: false,
      hasReceivedOnboardingReward: false,
      unlockedBadges: [],
    },
  },
  'nva@ikame.vn': {
    password: '123456',
    user: {
      id: 'u1', name: 'Nguyễn Văn A', email: 'nva@ikame.vn',
      role: 'employee', level: 15, exp: 12000, maxExp: 15000, credits: 850,
      avatar: 'https://picsum.photos/seed/user3/150/150',
      department: 'Engineering', title: 'Senior Developer',
      phone: '0908765432', address: '456 Cách Mạng Tháng 8, Q3, TP.HCM',
      dob: '1992-10-10', startDate: '2022-01-01', online: true,
      hasCompletedWelcomeTour: false,
      unlockedBadges: ['b1', 'b2', 'b5'],
      equippedBadge: 'b5',
    },
  },
  'admin@ikame.vn': {
    password: 'admin123',
    user: {
      id: 'a1', name: 'Trần Thị B', email: 'admin@ikame.vn',
      role: 'admin', level: 25, exp: 45000, maxExp: 50000, credits: 2500,
      avatar: 'https://picsum.photos/seed/manager1/150/150',
      department: 'Board', title: 'Administrator',
      phone: '0909876543', address: '456 Lê Lợi, Q1, TP.HCM',
      dob: '1990-05-12', startDate: '2019-07-01', online: true,
      hasCompletedWelcomeTour: true,
      hasCompletedAdminTour: false,
      unlockedBadges: ['b1', 'b2', 'b3', 'b4', 'b5'],
      equippedBadge: 'b3',
    },
  },
};

const INITIAL_REWARDS: Reward[] = [
  { id: 1, title: 'Voucher Coffee Highlands', desc: '1 ly nước bất kỳ tại Highlands Coffee', cost: 50, icon: 'Coffee', gradient: 'from-amber-500 to-orange-600', tag: 'Hot', stock: 20, category: 'food' },
  { id: 2, title: 'iKame Remote Day', desc: '1 ngày WFH extra (áp dụng T2-T6)', cost: 80, icon: 'Plane', gradient: 'from-brand-500 to-purple-600', tag: 'Premium', stock: 5, category: 'benefit' },
  { id: 3, title: 'Grab Card 100K', desc: 'Thẻ Grab trị giá 100.000đ', cost: 120, icon: 'ShoppingBag', gradient: 'from-emerald-500 to-teal-600', tag: 'New', stock: 15, category: 'voucher' },
  { id: 4, title: 'Book Voucher 200K', desc: 'Mua sách tại Fahasa/Tiki, trị giá 200K', cost: 150, icon: 'Star', gradient: 'from-rose-500 to-pink-600', tag: null, stock: 8, category: 'learning' },
  { id: 5, title: 'Gaming Top-up 50K', desc: 'Nạp thẻ game bất kỳ 50.000đ', cost: 60, icon: 'Ticket', gradient: 'from-violet-500 to-purple-600', tag: 'Hot', stock: 30, category: 'entertainment' },
  { id: 6, title: 'Thêm 1 ngày phép năm', desc: 'Thêm 1 ngày nghỉ phép năm (áp dụng trong quý)', cost: 300, icon: 'Gift', gradient: 'from-brand-600 to-blue-600', tag: 'Premium', stock: 3, category: 'benefit' },
];

const INITIAL_BADGES: Badge[] = [
  { id: 'b1', name: 'Tân binh năng nổ', description: 'Hoàn thành Onboarding', icon: '🌱', color: 'text-emerald-500 bg-emerald-50 border-emerald-200', condition: 'Hoàn thành toàn bộ nhiệm vụ Onboarding' },
  { id: 'b2', name: 'Người kể chuyện', description: 'Đăng 10 bài viết trên Newsfeed', icon: '✍️', color: 'text-blue-500 bg-blue-50 border-blue-200', condition: 'Đăng 10 bài viết' },
  { id: 'b3', name: 'Kẻ hủy diệt Deadline', description: 'Hoàn thành 50 nhiệm vụ iQuest đúng hạn', icon: '⚔️', color: 'text-rose-500 bg-rose-50 border-rose-200', condition: 'Hoàn thành 50 nhiệm vụ' },
  { id: 'b4', name: 'Thợ săn giải thưởng', description: 'Đổi 5 món quà từ iReward', icon: '🎁', color: 'text-purple-500 bg-purple-50 border-purple-200', condition: 'Đổi 5 phần quà' },
  { id: 'b5', name: 'Ngôi sao đang lên', description: 'Đạt Level 10', icon: '⭐', color: 'text-amber-500 bg-amber-50 border-amber-200', condition: 'Đạt Level 10' }
];

const INITIAL_EVENTS: TournamentEvent[] = [
  { id: 'ev1', name: 'Đường Đua Mùa Xuân', description: 'Hoàn thành các nhiệm vụ đặc biệt mùa xuân để nhận quà khủng.', banner: 'https://picsum.photos/seed/ev1/800/300', startDate: '2026-03-01', endDate: '2026-03-31', status: 'ongoing' },
  { id: 'ev2', name: 'Tìm Kiếm Bug Thần Tốc', description: 'Giải đấu nội bộ dành riêng cho đội Dev/QA.', banner: 'https://picsum.photos/seed/ev2/800/300', startDate: '2026-04-10', endDate: '2026-04-20', status: 'upcoming' }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, title: 'Phê duyệt nghỉ phép', message: 'Đơn xin nghỉ phép ngày 10/03 đã được duyệt.', time: '5 phút trước', read: false, type: 'approval', icon: '✅', link: '/icheck' },
  { id: 2, title: 'Sinh nhật Trần Thị B', message: 'Hôm nay là sinh nhật của Trần Thị B. Hãy gửi lời chúc!', time: '1 giờ trước', read: false, type: 'celebration', icon: '🎂', link: '/dashboard' },
  { id: 3, title: 'Nhắc nhở cập nhật OKR', message: 'Bạn chưa cập nhật tiến độ OKR tuần này. Hãy cập nhật trước thứ 6.', time: '2 giờ trước', read: false, type: 'reminder', icon: '⏰', link: '/igoal' },
  { id: 4, title: 'iQuest mới', message: 'Nhiệm vụ "Viết bài blog kỹ thuật" đang chờ bạn.', time: '3 giờ trước', read: true, type: 'quest', icon: '⚔️', link: '/iquest' },
  { id: 5, title: 'Hệ thống cập nhật', message: 'My iKame v2.1 đã có mặt! Nhiều tính năng mới hấp dẫn.', time: 'Hôm qua', read: true, type: 'system', icon: '🚀' },
];

const buildInitialAttendance = (): AttendanceRecord[] => {
  const today = new Date();
  const records: AttendanceRecord[] = [];
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dow = d.getDay();
    const dateStr = d.toISOString().split('T')[0];
    if (dow === 0 || dow === 6) {
      records.push({ date: dateStr, status: 'holiday', expEarned: 0 });
    } else {
      const isLate = Math.random() < 0.1;
      records.push({
        date: dateStr,
        checkIn: '08:' + String(Math.floor(Math.random() * 29) + 1).padStart(2, '0'),
        checkOut: '17:' + String(Math.floor(Math.random() * 30) + 30).padStart(2, '0'),
        status: isLate ? 'late' : 'on_time',
        expEarned: isLate ? 5 : 10,
      });
    }
  }
  return records;
};

// ─── STORES ───────────────────────────────────────────────────

let toastId = 0;

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,

      login: (email: string, password: string) => {
        const entry = MOCK_USERS[email.toLowerCase()];
        if (!entry) return { success: false, error: 'Email không tồn tại trong hệ thống.' };
        if (entry.password !== password) return { success: false, error: 'Mật khẩu không đúng.' };

        set({ currentUser: entry.user, isAuthenticated: true });
        
        // Reset states for testing/onboarding
        sessionStorage.removeItem('ai_mascot_opened');

        setTimeout(() => {
          const appStore = useAppStore.getState();
          const INITIAL_SYSTEM_QUESTS = [
            { id: 24, title: 'iCheck đầu tiên', desc: 'Thực hiện chấm công lần đầu trên hệ thống My iKame.', exp: 50, credits: 10, progress: 0, target: 1, status: 'pending', subCategory: 'Hệ thống', rarity: 'common', tabId: 'onboarding_official', howToComplete: 'Sử dụng tính năng iCheck trên Dashboard hoặc App mobile để ghi nhận ngày công.' },
            { id: 25, title: 'Đạt mốc Level 2', desc: 'Tích lũy EXP từ các hoạt động để thăng cấp lên Level 2.', exp: 100, credits: 20, progress: 0, target: 2, status: 'pending', subCategory: 'Cá nhân', rarity: 'rare', tabId: 'onboarding_official', howToComplete: 'Tham gia các hoạt động như iCheck, tương tác bải viết để nhận EXP và thăng cấp.' },
            { id: 26, title: 'Gửi lời chúc mừng', desc: 'Gửi lời chúc Sinh nhật hoặc Thâm niên đến đồng nghiệp.', exp: 30, credits: 5, progress: 0, target: 1, status: 'pending', subCategory: 'Tương tác', rarity: 'common', tabId: 'onboarding_official', howToComplete: 'Tìm các mục Sinh nhật/Thâm niên trên Dashboard và nhấn gửi lời chúc.' },
            { id: 27, title: 'Tương tác Newsfeed', desc: 'Like hoặc bình luận vào bài viết của đồng nghiệp.', exp: 20, credits: 5, progress: 0, target: 1, status: 'pending', subCategory: 'Tương tác', rarity: 'common', tabId: 'onboarding_official', howToComplete: 'Dạo một vòng quanh Newsfeed và để lại tim hoặc bình luận cho một bài viết bất kỳ.' },
            { id: 28, title: 'Hoàn thiện Profile', desc: 'Cập nhật đầy đủ thông tin cá nhân và ảnh đại diện.', exp: 50, credits: 10, progress: 0, target: 1, status: 'pending', subCategory: 'Cá nhân', rarity: 'common', tabId: 'onboarding_official', howToComplete: 'Truy cập trang Cá nhân và cập nhật các thông tin còn thiếu.' },
          ];

          // Ensure all system quests exist in the current store
          let currentQuests = [...appStore.quests];
          INITIAL_SYSTEM_QUESTS.forEach(sysQ => {
            if (!currentQuests.find(q => q.id === sysQ.id)) {
              currentQuests.push(sysQ as any);
            }
          });

          if (entry.user.role === 'new_employee') {
            useAppStore.setState({
              quests: currentQuests.map(q => ({ ...q, status: 'pending', progress: 0 })),
              attendanceRecords: [],
              todayCheckedIn: false,
              todayCheckInTime: null
            });
          } else {
            useAppStore.setState({
              quests: currentQuests.map(q => {
                if (q.tabId === 'onboarding') return { ...q, status: 'completed' as const, progress: q.target };
                // Reset onboarding_official for nva@ikame.vn or anyone meeting criteria
                if (q.tabId === 'onboarding_official' && (email.toLowerCase() === 'nva@ikame.vn' || !entry.user.hasReceivedOnboardingReward)) {
                   return { ...q, status: 'pending' as const, progress: 0 };
                }
                return q;
              }),
              attendanceRecords: appStore.attendanceRecords.length === 0 ? buildInitialAttendance() : appStore.attendanceRecords
            });
          }
          
          // Re-trigger check
          setTimeout(() => useAppStore.getState().checkOnboardingCompletion(), 100);
        }, 0);

        return { success: true };
      },

      logout: () => set({ currentUser: null, isAuthenticated: false }),

      updateUser: (updates) => {
        const u = get().currentUser;
        if (u) {
          set({ currentUser: { ...u, ...updates } });
          // Track official onboarding quest (ID 28 - Hoàn thiện Profile)
          const quest28 = useAppStore.getState().quests.find(q => q.id === 28);
          if (quest28 && quest28.status === 'pending') {
            useAppStore.getState().approveQuest(28, true);
          }
        }
      },
    }),
    { name: 'ikame-auth', storage: createJSONStorage(() => localStorage) }
  )
);

interface AppState {
  // Users Management (Admin)
  users: User[];
  updateEmployee: (id: string, updates: Partial<User>) => void;

  // Gamification
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: number) => void;
  addExp: (amount: number, reason: string, silent?: boolean) => void;
  spendCredits: (amount: number) => boolean;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: number) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<Notification, 'id'>) => void;

  // Attendance
  attendanceRecords: AttendanceRecord[];
  todayCheckedIn: boolean;
  todayCheckInTime: string | null;
  checkIn: () => void;
  checkOut: () => void;

  // Leave requests
  leaveRequests: LeaveRequest[];
  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>) => void;
  approveLeaveRequest: (id: string, approved: boolean) => void;

  // OKRs
  okrs: OKR[];
  addOKR: (okr: Omit<OKR, 'id' | 'createdAt'>) => void;
  updateOKR: (id: string, updates: Partial<OKR>) => void;
  deleteOKR: (id: string) => void;
  updateKR: (okrId: string, krId: string, current: number) => void;

  // Quests
  quests: Quest[];
  submitQuestReport: (questId: number, title: string, desc: string) => void;
  approveQuest: (questId: number, approved: boolean) => void;
  addQuest: (quest: Omit<Quest, 'id' | 'progress' | 'status'>) => void;
  updateQuest: (id: number, updates: Partial<Quest>) => void;
  deleteQuest: (id: number) => void;

  // Events
  events: TournamentEvent[];
  createEvent: (ev: TournamentEvent) => void;
  updateEvent: (id: string, ev: Partial<TournamentEvent>) => void;
  deleteEvent: (id: string) => void;

  // Rewards
  rewards: Reward[];
  addReward: (reward: Omit<Reward, 'id'>) => void;
  updateReward: (id: number, updates: Partial<Reward>) => void;
  deleteReward: (id: number) => void;

  // Celebrations
  celebrations: CelebrationItem[];
  sendWish: (celebrationId: number) => void;

  // Reward history
  rewardHistory: RewardHistory[];
  addRewardHistory: (item: Omit<RewardHistory, 'id' | 'date'>) => void;
  updateRewardHistoryStatus: (id: string, status: RewardHistory['status']) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;

  // Settings
  theme: 'light' | 'dark';
  language: 'vi' | 'en';
  toggleTheme: () => void;
  setLanguage: (lang: 'vi' | 'en') => void;

  // Global Actions
  checkOnboardingCompletion: () => void;

  // Posts / Announcements
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'time' | 'likes' | 'comments' | 'isLiked'>) => void;
  deletePost: (id: number) => void;
  togglePinPost: (id: number) => void;
  toggleLikePost: (id: number) => void;

  // Badges
  badges: Badge[];
  equipBadge: (badgeId: string | undefined) => void;
  createBadge: (badge: Badge) => void;
  updateBadge: (id: string, updates: Partial<Badge>) => void;
  unlockBadge: (badgeId: string, userId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: Object.values(MOCK_USERS).map(u => u.user),
      updateEmployee: (id, updates) => set(s => ({ users: s.users.map(u => u.id === id ? { ...u, ...updates } : u) })),

      toasts: [],
      addToast: (toast) => {
        const id = ++toastId;
        set(s => ({ toasts: [...s.toasts, { ...toast, id }] }));
        setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
          toast.duration || (toast.type === 'levelup' ? 5000 : 3000));
      },
      removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

      addExp: (amount, reason, silent = false) => {
        const auth = useAuthStore.getState();
        if (!auth.currentUser) return;
        let { exp, maxExp, level, credits } = auth.currentUser;
        exp += amount;
        while (exp >= maxExp) {
          exp -= maxExp;
          level += 1;
          credits += 50;
          maxExp = Math.floor(maxExp * 1.2);
          get().addToast({ type: 'levelup', title: `🎉 Lên cấp ${level}!`, message: 'Nhận được 50 Credits thưởng!' });
        }
        auth.updateUser({ exp, maxExp, level, credits });
        if (!silent) {
          get().addToast({ type: 'exp', title: reason, message: `+${amount} EXP`, expAmount: amount });
        }

        // Auto post when levelling up
        if (exp >= maxExp || (exp + amount) >= maxExp || reason.includes('Lên cấp')) {
          const newLevel = level + (exp + amount >= maxExp ? 1 : 0);
          if (newLevel > level) {
            get().addPost({
              author: { name: 'Em Sen iKame', avatar: '/logo.png', title: 'Hệ thống tự động' },
              content: `🎉 Tút tút! Chúc mừng **${auth.currentUser.name}** đã thăng cấp lên **Level ${newLevel}**!\n\nHãy tiếp tục giữ vững phong độ đỉnh cao này nhé! Đừng quên kiểm tra xem có nhiệm vụ mới nào vừa được mở khóa không nha. 🚀`,
              type: 'ai_update',
              badge: 'Level Up',
              featuredUser: { name: auth.currentUser.name, title: auth.currentUser.title, avatar: auth.currentUser.avatar }
            });
          }
        }
      },

      spendCredits: (amount) => {
        const auth = useAuthStore.getState();
        if (!auth.currentUser) return false;
        if (auth.currentUser.credits < amount) return false;
        auth.updateUser({ credits: auth.currentUser.credits - amount });
        return true;
      },

      notifications: INITIAL_NOTIFICATIONS,
      markNotificationRead: (id) => set(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) })),
      markAllRead: () => set(s => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) })),
      addNotification: (n) => set(s => ({ notifications: [{ ...n, id: Date.now() }, ...s.notifications] })),

      // Badges
      badges: INITIAL_BADGES,
      events: INITIAL_EVENTS,
      equipBadge: (badgeId) => {
        const auth = useAuthStore.getState();
        if (auth.currentUser) {
          auth.updateUser({ equippedBadge: badgeId });
        }
      },
      createBadge: (badge) => set(s => ({ badges: [...s.badges, badge] })),
      updateBadge: (id, updates) => set(s => ({ badges: s.badges.map(b => b.id === id ? { ...b, ...updates } : b) })),
      unlockBadge: (badgeId, userId) => {
        const auth = useAuthStore.getState();
        if (auth.currentUser?.id === userId) {
          const unlocked = auth.currentUser.unlockedBadges || [];
          if (!unlocked.includes(badgeId)) {
            auth.updateUser({ unlockedBadges: [...unlocked, badgeId] });
            get().addToast({ type: 'success', title: 'Huy hiệu mới! 🏆', message: 'Bạn vừa mở khóa một thành tựu mới.' });
          }
        }
        const user = get().users.find(u => u.id === userId);
        if (user) {
          const unlocked = user.unlockedBadges || [];
          if (!unlocked.includes(badgeId)) {
            get().updateEmployee(userId, { unlockedBadges: [...unlocked, badgeId] });
          }
        }
      },

      attendanceRecords: buildInitialAttendance(),
      todayCheckedIn: false,
      todayCheckInTime: null,

      checkIn: () => {
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const timeStr = now.toTimeString().slice(0, 5);
        const isLate = now.getHours() >= 9;
        const record: AttendanceRecord = {
          date: today, checkIn: timeStr, status: isLate ? 'late' : 'on_time',
          expEarned: isLate ? 5 : 10,
        };
        set(s => ({
          todayCheckedIn: true,
          todayCheckInTime: timeStr,
          attendanceRecords: [record, ...s.attendanceRecords.filter(r => r.date !== today)],
        }));
        get().addExp(isLate ? 5 : 10, isLate ? 'iCheck (Đi muộn)' : 'iCheck đúng giờ');
        
        // Track official onboarding quest (ID 24)
        const quest24 = get().quests.find(q => q.id === 24);
        if (quest24 && quest24.status === 'pending') {
          get().approveQuest(24, true);
        }
      },

      checkOut: () => {
        const today = new Date().toISOString().split('T')[0];
        const timeStr = new Date().toTimeString().slice(0, 5);
        set(s => ({
          attendanceRecords: s.attendanceRecords.map(r =>
            r.date === today ? { ...r, checkOut: timeStr } : r
          ),
        }));
      },

      leaveRequests: [],
      submitLeaveRequest: (req) => {
        const newReq: LeaveRequest = {
          ...req, id: `lr-${Date.now()}`, status: 'pending', createdAt: new Date().toISOString(),
        };
        set(s => ({ leaveRequests: [newReq, ...s.leaveRequests] }));
        get().addToast({ type: 'success', title: 'Gửi đơn thành công!', message: 'Đang chờ quản lý phê duyệt.' });
        get().addNotification({ title: 'Đơn nghỉ phép mới', message: `Đơn xin nghỉ từ ${req.startDate} đến ${req.endDate} đang chờ duyệt.`, time: 'Vừa xong', read: false, type: 'reminder', icon: '📋', link: '/icheck' });
      },
      approveLeaveRequest: (id, approved) => {
        set(s => ({ leaveRequests: s.leaveRequests.map(r => r.id === id ? { ...r, status: approved ? 'approved' : 'rejected' } : r) }));
        get().addToast({ type: approved ? 'success' : 'warning', title: approved ? 'Đã phê duyệt đơn' : 'Đã từ chối đơn' });
      },

      okrs: [
        {
          id: 'okr-1', userId: 'u1', title: 'Tăng trưởng doanh thu Q1', quarter: 'Q1-2026', progress: 65,
          createdAt: '2026-01-01',
          keyResults: [
            { id: 'kr-1', title: 'Đạt 500M VNĐ doanh thu mới', current: 325, target: 500, unit: 'M' },
            { id: 'kr-2', title: 'Ký hợp đồng với 5 khách hàng Enterprise', current: 3, target: 5, unit: 'KH' },
          ],
        },
        {
          id: 'okr-2', userId: 'u1', title: 'Cải thiện chất lượng sản phẩm', quarter: 'Q1-2026', progress: 40,
          createdAt: '2026-01-01',
          keyResults: [
            { id: 'kr-3', title: 'Giảm số lượng bug critical xuống 0', current: 2, target: 0, unit: 'bug' },
            { id: 'kr-4', title: 'Tăng điểm CSAT lên 4.5', current: 4.2, target: 4.5, unit: 'điểm' },
          ],
        },
      ],
      addOKR: (okr) => {
        const newOKR: OKR = { ...okr, id: `okr-${Date.now()}`, createdAt: new Date().toISOString() };
        set(s => ({ okrs: [newOKR, ...s.okrs] }));
        get().addToast({ type: 'success', title: 'Tạo iGoal thành công!', message: okr.title });
      },
      updateOKR: (id, updates) => set(s => ({ okrs: s.okrs.map(o => o.id === id ? { ...o, ...updates } : o) })),
      deleteOKR: (id) => {
        set(s => ({ okrs: s.okrs.filter(o => o.id !== id) }));
        get().addToast({ type: 'info', title: 'Đã xoá iGoal.' });
      },
      updateKR: (okrId, krId, current) => {
        set(s => ({
          okrs: s.okrs.map(o => {
            if (o.id !== okrId) return o;
            const newKRs = o.keyResults.map(kr => kr.id === krId ? { ...kr, current } : kr);
            const totalProgress = Math.round(newKRs.reduce((acc, kr) => {
              const p = kr.target === 0 ? (kr.current === 0 ? 100 : 0) : Math.min(100, (kr.current / kr.target) * 100);
              return acc + p;
            }, 0) / newKRs.length);
            return { ...o, keyResults: newKRs, progress: totalProgress };
          }),
        }));
        get().addExp(50, 'Cập nhật Key Result');
        get().addToast({ type: 'success', title: 'Đã cập nhật tiến độ!' });
      },

      quests: [
        { id: 1, title: 'iCheck trước 8:30', desc: 'Đi làm sớm mỗi ngày.', exp: 10, credits: 2, progress: 0, target: 1, status: 'pending', subCategory: 'Productivity', rarity: 'common', tabId: 'daily' },
        { id: 2, title: 'Hoàn thành 1 task', desc: 'Đóng ít nhất 1 task trên hệ thống.', exp: 30, credits: 5, progress: 0, target: 1, status: 'pending', subCategory: 'Productivity', rarity: 'common', tabId: 'daily' },
        { id: 3, title: 'Tương tác mạng nội bộ', desc: 'Like hoặc comment 3 bài viết.', exp: 15, credits: 3, progress: 0, target: 3, status: 'pending', subCategory: 'Social', rarity: 'common', tabId: 'daily' },
        { id: 4, title: 'Viết báo cáo tuần', desc: 'Nộp báo cáo trước 17:00 thứ 6.', exp: 100, credits: 20, progress: 0, target: 1, status: 'pending', subCategory: 'Productivity', rarity: 'rare', tabId: 'weekly' },
        { id: 5, title: 'Cập nhật iGoal', desc: 'Cập nhật tiến độ OKR ít nhất 1 lần.', exp: 50, credits: 10, progress: 0, target: 1, status: 'pending', subCategory: 'Goal', rarity: 'common', tabId: 'weekly' },
        { id: 6, title: 'Review Code', desc: 'Review 5 Pull Requests của đồng nghiệp.', exp: 80, credits: 15, progress: 0, target: 5, status: 'pending', subCategory: 'Teamwork', rarity: 'rare', tabId: 'weekly' },
        { id: 7, title: 'Viết bài blog kỹ thuật', desc: 'Chia sẻ kiến thức chuyên môn.', exp: 300, credits: 60, progress: 0, target: 1, status: 'pending', subCategory: 'Knowledge', rarity: 'epic', tabId: 'monthly' },
        { id: 8, title: 'Không đi muộn cả tháng', desc: 'Check-in đúng giờ 100%.', exp: 500, credits: 100, progress: 0, target: 22, status: 'pending', subCategory: 'Discipline', rarity: 'legendary', tabId: 'monthly' },
        // Onboarding Quest Chain
        { id: 9, title: 'Day One Tour', desc: 'Tham gia buổi tour làm quen văn phòng ngày đầu tiên.', exp: 50, credits: 10, progress: 0, target: 1, status: 'pending', subCategory: 'Khởi đầu', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-01', howToComplete: 'Tham gia buổi tour đi quanh văn phòng cùng HR vào sáng ngày đầu tiên nhận việc.' },
        { id: 10, title: 'First meeting with Manager', desc: 'Gặp gỡ và trao đổi định hướng với Quản lý trực tiếp.', exp: 100, credits: 20, progress: 0, target: 1, status: 'pending', subCategory: 'Kết nối', rarity: 'rare', tabId: 'onboarding', deadline: '2026-03-01', howToComplete: 'Đặt lịch 30 phút trao đổi trực tiếp với Quản lý (Team Leader/Manager) về JD và mục tiêu thử việc.' },
        { id: 11, title: 'Cập nhật Profile Google & Slack', desc: 'Thêm ảnh đại diện chuyên nghiệp cho tài khoản Google & Slack.', exp: 30, credits: 5, progress: 0, target: 1, status: 'pending', subCategory: 'Thiết lập', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-01', howToComplete: 'Cập nhật avatar thật (nhìn rõ mặt) và điền đầy đủ thông tin Bio trên Slack và Google Account.' },
        { id: 12, title: 'Đọc Cẩm nang Onboarding', desc: 'Tìm hiểu cẩm nang để trở thành một iKamer hiệu quả.', exp: 80, credits: 15, progress: 0, target: 1, status: 'pending', subCategory: 'Học hỏi', rarity: 'rare', tabId: 'onboarding', deadline: '2026-03-01', howToComplete: 'Truy cập iWiki và đọc hết tài liệu "Cẩm nang văn hóa iKame".' },
        { id: 13, title: 'Ký NDA & HĐTV', desc: 'Hoàn thành ký Thỏa thuận Bảo mật thông tin & Hợp đồng thử việc.', exp: 50, credits: 10, progress: 0, target: 1, status: 'pending', subCategory: 'Hồ sơ', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-01', howToComplete: 'Liên hệ BP Nhân sự để hoàn thành việc ký kết các giấy tờ pháp lý cần thiết.' },
        { id: 14, title: 'Cung cấp giấy tờ Kế toán', desc: 'Nộp đầy đủ hồ sơ, giấy tờ cần thiết cho bộ phận Kế toán.', exp: 50, credits: 10, progress: 0, target: 1, status: 'pending', subCategory: 'Hồ sơ', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-08', howToComplete: 'Scan và gửi bộ hồ sơ kế toán (CMND, Sổ hộ khẩu, Bằng cấp...) lên thư mục Google Drive được chỉ định.' },
        { id: 15, title: 'Chấm công với iCheck', desc: 'Sign-in và thực hiện chấm công lần đầu với iCheck.', exp: 20, credits: 5, progress: 0, target: 1, status: 'pending', subCategory: 'IT & Tools', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-01', howToComplete: 'Đăng nhập vào app iCheck bằng account iKame và thực hiện "Check-in" đầu tiên.' },
        { id: 16, title: 'Sign-in Slack', desc: 'Đăng nhập vào không gian làm việc của team trên Slack.', exp: 20, credits: 5, progress: 0, target: 1, status: 'pending', subCategory: 'IT & Tools', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-01', howToComplete: 'Gia nhập Workspace iKame trên Slack và gửi tin nhắn "Chào cả nhà" vào channel #general.' },
        { id: 17, title: 'Tham gia Group Facebook nội bộ', desc: 'Gia nhập group iKame Inc Group trên Facebook.', exp: 30, credits: 5, progress: 0, target: 1, status: 'pending', subCategory: 'Social', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-01', howToComplete: 'Gửi yêu cầu gia nhập Group Facebook iKame Inc và chờ Admin phê duyệt.' },
        { id: 18, title: 'Kích hoạt 2FA Email', desc: 'Kích hoạt Xác thực 2 lớp bảo mật cho email công ty.', exp: 50, credits: 10, progress: 0, target: 1, status: 'pending', subCategory: 'IT & Tools', rarity: 'rare', tabId: 'onboarding', deadline: '2026-03-05', howToComplete: 'Cài đặt bảo mật 2 lớp cho Google Account theo hướng dẫn của BP IT.' },
        { id: 19, title: 'Làm quen với Asana', desc: 'Sign-in Asana và tìm hiểu về Project Onboarding của bạn.', exp: 60, credits: 12, progress: 0, target: 1, status: 'pending', subCategory: 'IT & Tools', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-01', howToComplete: 'Đăng nhập Asana, tìm thấy Project "Onboarding - [Tên của bạn]" và xem danh sách các Task cần làm.' },
        { id: 20, title: 'Khám phá iWiki', desc: 'Sign-in và tìm hiểu các chức năng tra cứu tài liệu trên iWiki.', exp: 40, credits: 8, progress: 0, target: 1, status: 'pending', subCategory: 'IT & Tools', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-01', howToComplete: 'Đăng nhập iWiki và tìm hiểu cách tra cứu các quy trình phối hợp giữa các phòng ban.' },
        { id: 21, title: 'Sử dụng iPerform', desc: 'Sign-in và tìm hiểu chức năng của hệ thống iPerform.', exp: 40, credits: 8, progress: 0, target: 1, status: 'pending', subCategory: 'IT & Tools', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-01', howToComplete: 'Đăng nhập iPerform và làm quen với giao diện theo dõi KPI cá nhân.' },
        { id: 22, title: 'Tìm hiểu iCloud', desc: 'Tìm hiểu về cách thức lưu trữ và chia sẻ file trên iCloud (Optional).', exp: 20, credits: 4, progress: 0, target: 1, status: 'pending', subCategory: 'IT & Tools', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-05', howToComplete: 'Tìm hiểu cấu trúc lưu trữ dữ liệu chung của công ty trên nền tảng Google Drive (iCloud iKame).' },
        { id: 23, title: 'Tạo IT Support request', desc: 'Tìm hiểu cách tạo request hỗ trợ IT bằng Asana Form (Optional).', exp: 20, credits: 4, progress: 0, target: 1, status: 'pending', subCategory: 'IT & Tools', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-05', howToComplete: 'Biết cách sử dụng Form Asana để tạo yêu cầu hỗ trợ từ BP IT khi gặp sự cố máy móc/phần mềm.' },
        // Official Employee System Onboarding (for existing employees new to the app)
        { id: 24, title: 'iCheck đầu tiên', desc: 'Thực hiện chấm công lần đầu trên hệ thống My iKame.', exp: 50, credits: 10, progress: 0, target: 1, status: 'pending', subCategory: 'Hệ thống', rarity: 'common', tabId: 'onboarding_official', howToComplete: 'Sử dụng tính năng iCheck trên Dashboard hoặc App mobile để ghi nhận ngày công.' },
        { id: 25, title: 'Đạt mốc Level 2', desc: 'Tích lũy EXP từ các hoạt động để thăng cấp lên Level 2.', exp: 100, credits: 20, progress: 0, target: 2, status: 'pending', subCategory: 'Cá nhân', rarity: 'rare', tabId: 'onboarding_official', howToComplete: 'Tham gia các hoạt động như iCheck, tương tác bải viết để nhận EXP và thăng cấp.' },
        { id: 26, title: 'Gửi lời chúc mừng', desc: 'Gửi lời chúc Sinh nhật hoặc Thâm niên đến đồng nghiệp.', exp: 30, credits: 5, progress: 0, target: 1, status: 'pending', subCategory: 'Tương tác', rarity: 'common', tabId: 'onboarding_official', howToComplete: 'Tìm các mục Sinh nhật/Thâm niên trên Dashboard và nhấn gửi lời chúc.' },
        { id: 27, title: 'Tương tác Newsfeed', desc: 'Like hoặc bình luận vào bài viết của đồng nghiệp.', exp: 20, credits: 5, progress: 0, target: 1, status: 'pending', subCategory: 'Tương tác', rarity: 'common', tabId: 'onboarding_official', howToComplete: 'Dạo một vòng quanh Newsfeed và để lại tim hoặc bình luận cho một bài viết bất kỳ.' },
        { id: 28, title: 'Hoàn thiện Profile', desc: 'Cập nhật đầy đủ thông tin cá nhân và ảnh đại diện.', exp: 50, credits: 10, progress: 0, target: 1, status: 'pending', subCategory: 'Cá nhân', rarity: 'common', tabId: 'onboarding_official', howToComplete: 'Truy cập trang Cá nhân và cập nhật các thông tin còn thiếu.' },
      ],
      submitQuestReport: (questId, title, desc) => {
        const quest = get().quests.find(q => q.id === questId);
        if (quest?.tabId === 'onboarding' || quest?.tabId === 'onboarding_official') {
          // Instant completion for onboarding
          get().approveQuest(questId, true);
          return;
        }

        set(s => ({
          quests: s.quests.map(q => q.id === questId
            ? { ...q, status: 'submitted' as const }
            : q
          ),
        }));
        get().addToast({ type: 'success', title: 'Báo cáo đã gửi!', message: 'Đang chờ quản lý phê duyệt.' });
        get().addNotification({ title: 'Quest mới đang chờ duyệt', message: title, time: 'Vừa xong', read: false, type: 'quest', icon: '⚔️', link: '/iquest' });
      },
      approveQuest: (questId, approved) => {
        set(s => ({
          quests: s.quests.map(q => {
            if (q.id !== questId) return q;
            const newProgress = approved ? q.target : q.progress;
            const newStatus = approved ? 'completed' as const : 'rejected' as const;
            return { ...q, progress: newProgress, status: newStatus };
          }),
        }));
        if (approved) {
          const quest = get().quests.find(q => q.id === questId);
          if (quest) {
            get().addExp(quest.exp, `iQuest: ${quest.title}`, true);
            const auth = useAuthStore.getState();
            auth.updateUser({ credits: (auth.currentUser?.credits || 0) + quest.credits });
            get().addToast({ type: 'success', title: `Quest hoàn thành: ${quest.title}`, message: `+${quest.exp} EXP · +${quest.credits} Credits` });

            // Trigger check for onboarding completion
            if (quest.tabId === 'onboarding' || quest.tabId === 'onboarding_official') {
              get().checkOnboardingCompletion();
            }

            // AI post for epic/legendary quests
            if (quest.rarity === 'epic' || quest.rarity === 'legendary') {
              const currentUser = useAuthStore.getState().currentUser;
              get().addPost({
                author: { name: 'Em Sen iKame', avatar: '/logo.png', title: 'Hệ thống tự động' },
                content: `🔔 Ting ting! Một tràng pháo tay thật lớn cho **${currentUser?.name}** vì đã xuất sắc hoàn thành nhiệm vụ độ khó ${quest.rarity.toUpperCase()} trứ danh: **"${quest.title}"**!\n\nPhần thưởng khổng lồ +${quest.exp} EXP và +${quest.credits} Credits đã được chuyển vào ví. Ai sẽ là người tiếp theo chinh phục thử thách này đây? 😎`,
                type: 'ai_update',
                badge: 'Epic Achievement',
                featuredUser: { name: currentUser?.name || '', title: currentUser?.title || '', avatar: currentUser?.avatar || '' },
                expEarned: quest.exp
              });
            }
          }
        } else {
          get().addToast({ type: 'warning', title: 'Báo cáo bị từ chối', message: 'Vui lòng kiểm tra lại và gửi lại.' });
        }
      },

      celebrations: [
        { id: 1, user: { name: 'Trần Thị B', avatar: 'https://picsum.photos/seed/manager1/150/150', title: 'Engineering Manager', department: 'Engineering' }, type: 'birthday', date: '2026-03-05', wishes: 15, hasWished: false },
        { id: 2, user: { name: 'Lê Văn C', avatar: 'https://picsum.photos/seed/user3/150/150', title: 'Backend Developer', department: 'Engineering' }, type: 'birthday', date: '2026-03-07', wishes: 3, hasWished: false },
        { id: 3, user: { name: 'Phạm Thị D', avatar: 'https://picsum.photos/seed/user4/150/150', title: 'Product Designer', department: 'Design' }, type: 'anniversary', date: '2026-03-06', years: 3, wishes: 8, hasWished: true },
        { id: 4, user: { name: 'Hoàng Văn E', avatar: 'https://picsum.photos/seed/user5/150/150', title: 'QA Engineer', department: 'Quality' }, type: 'anniversary', date: '2026-03-10', years: 5, wishes: 12, hasWished: false },
      ],
      sendWish: (celebrationId) => {
        set(s => ({
          celebrations: s.celebrations.map(c =>
            c.id === celebrationId && !c.hasWished
              ? { ...c, wishes: c.wishes + 1, hasWished: true }
              : c
          ),
        }));
        const celebration = get().celebrations.find(c => c.id === celebrationId);
        if (celebration) {
          get().addExp(10, `Gửi lời chúc ${celebration.type === 'birthday' ? 'sinh nhật' : 'thâm niên'}`);
          get().addToast({ type: 'success', title: '🎉 Đã gửi lời chúc!', message: `Gửi lời chúc cho ${celebration.user.name}` });

          // Track official onboarding quest (ID 26 - Gửi lời chúc mừng)
          const quest26 = get().quests.find(q => q.id === 26);
          if (quest26 && quest26.status === 'pending') {
            get().approveQuest(26, true);
          }
        }
      },

      addQuest: (quest) => set(s => ({ quests: [...s.quests, { ...quest, id: Date.now(), progress: 0, status: 'pending' }] })),
      updateQuest: (id, updates) => set(s => ({ quests: s.quests.map(q => q.id === id ? { ...q, ...updates } : q) })),
      deleteQuest: (id) => set(s => ({ quests: s.quests.filter(q => q.id !== id) })),

      createEvent: (ev) => set(s => ({ events: [ev, ...s.events] })),
      updateEvent: (id, ev) => set(s => ({ events: s.events.map(x => x.id === id ? { ...x, ...ev } : x) })),
      deleteEvent: (id) => set(s => ({ events: s.events.filter(x => x.id !== id) })),

      rewards: INITIAL_REWARDS,
      addReward: (reward) => set(s => ({ rewards: [...s.rewards, { ...reward, id: Date.now() }] })),
      updateReward: (id, updates) => set(s => ({ rewards: s.rewards.map(r => r.id === id ? { ...r, ...updates } : r) })),
      deleteReward: (id) => set(s => ({ rewards: s.rewards.filter(r => r.id !== id) })),

      rewardHistory: [],
      addRewardHistory: (item) => {
        set(s => ({ rewardHistory: [{ ...item, id: `rh-${Date.now()}`, date: new Date().toISOString().split('T')[0] }, ...s.rewardHistory] }));
      },
      updateRewardHistoryStatus: (id, status) => set(s => ({ rewardHistory: s.rewardHistory.map(r => r.id === id ? { ...r, status } : r) })),

      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),

      showOnboardingModal: false,
      setShowOnboardingModal: (show) => set({ showOnboardingModal: show }),

      theme: 'light',
      language: 'vi',
      toggleTheme: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setLanguage: (lang) => set({ language: lang }),

      checkOnboardingCompletion: () => {
        const auth = useAuthStore.getState();
        const { quests } = get();
        const isNewEmployee = auth.currentUser?.role === 'new_employee';
        const tabId = isNewEmployee ? 'onboarding' : 'onboarding_official';
        
        const onboardingQuests = quests.filter(q => q.tabId === tabId);
        const completed = onboardingQuests.filter(q => q.status === 'completed').length;
        const total = onboardingQuests.length;

        // Use a small delay to ensure cumulative state is settled
        if (total > 0 && completed === total && !auth.currentUser?.hasReceivedOnboardingReward) {
          console.log('Onboarding COMPLETE triggered!');
          // All done!
          auth.updateUser({
            level: Math.round(Math.max(auth.currentUser?.level || 1, isNewEmployee ? 2 : auth.currentUser?.level + 1)), 
            credits: (auth.currentUser?.credits || 0) + 200,
            hasReceivedOnboardingReward: true,
            unlockedBadges: Array.from(new Set([...(auth.currentUser?.unlockedBadges || []), 'b1'])),
            equippedBadge: 'b1'
          });

          set({ showOnboardingModal: true });

          get().addToast({
            type: 'levelup',
            title: isNewEmployee ? '🎉 Hoàn thành Onboarding!' : '🎉 Tuyệt vời iKamer!',
            message: isNewEmployee ? 'Chúc mừng iKamer mới! Nhận ngay 200 Credits thưởng.' : 'Bạn đã làm quen thành thạo hệ thống. Nhận 200 Credits thưởng!'
          });

          // Also add a post to the feed
          get().addPost({
            author: { name: 'Em Sen iKame', avatar: '/logo.png', title: 'Hệ thống tự động' },
            content: isNewEmployee 
              ? `🎊 Chúc mừng **${auth.currentUser.name}** đã chính thức hoàn thành chuỗi thử thách Onboarding! \n\nHãy cùng gửi lời chào nồng nhiệt nhất tới thành viên mới của gia đình iKame nhé! 🚀`
              : `👏 Chúc mừng **${auth.currentUser.name}** đã hoàn thành "Khám phá Hệ thống My iKame"! \n\nTinh thần cầu thị và sẵn sàng thích nghi với công cụ mới của bạn thật đáng khen ngợi. Cùng tiếp tục bùng nổ nhé! 🔥`,
            type: 'ai_update',
            badge: isNewEmployee ? 'New Member' : 'System Mastery',
            featuredUser: {
              name: auth.currentUser?.name || '',
              title: auth.currentUser?.title || '',
              avatar: auth.currentUser?.avatar || ''
            }
          });
        }
      },

      posts: [
        {
          id: 101,
          author: { name: 'Em Sen iKame', avatar: '/logo.png', title: 'Hệ thống tự động' },
          content: '🎊 Chúc mừng **Nguyễn Việt Dũng** đã chính thức hoàn thành chuỗi thử thách Onboarding! \n\nDũng hiện đang là PM tại team Platform. Hãy ghé qua Profile để gửi lời chào và làm quen với đồng nghiệp mới nhé! 🚀',
          time: '10 phút trước', likes: 45, comments: 12, isLiked: false, type: 'ai_update',
          badge: 'Onboarding Completed',
          featuredUser: { name: 'Nguyễn Việt Dũng', title: 'Project Manager', avatar: 'https://picsum.photos/seed/dung/150/150' }
        },
        {
          id: 1,
          author: { name: 'Phòng PnOD', avatar: 'https://ui-avatars.com/api/?name=PnOD&background=8b5cf6&color=fff', title: 'People & Organization Dev' },
          content: '📌 **[THÔNG BÁO] Cập nhật Chính sách Phúc lợi Mùa hè 2026**\n\nXin chào các iKamer! \n\nPhòng PnOD xin trân trọng thông báo về chương trình "Summer Vibes 2026" với nhiều cải tiến về chính sách làm việc linh hoạt (WFH) và phần thưởng đặc biệt iReward. Chi tiết các bạn vui lòng xem trên hệ thống iWiki mục [Chính sách] nhé!\n\nChúc cả nhà một tuần làm việc bùng nổ năng lượng! 🌞',
          time: '30 phút trước', likes: 120, comments: 15, isLiked: false, type: 'announcement',
          isPinned: true
        },
        {
          id: 2,
          author: { name: 'HR Department', avatar: 'https://picsum.photos/seed/hr/150/150', title: 'Human Resources' },
          content: '🎉 Chúc mừng team Tech đã hoàn thành xuất sắc dự án Alpha trước thời hạn 2 tuần! Chiều nay có tiệc trà tại pantry nhé!',
          image: 'https://picsum.photos/seed/party/800/400',
          time: '2 giờ trước', likes: 24, comments: 5, isLiked: false, type: 'announcement'
        },
        {
          id: 102,
          author: { name: 'Em Sen iKame', avatar: '/logo.png', title: 'Hệ thống tự động' },
          content: '🔥 **Lê Văn C** vừa lập kỷ lục mới: Hoàn thành toàn bộ chuỗi nhiệm vụ Hàng tháng (Monthly Quest) chỉ trong 15 ngày! +500 Credits đã được cộng vào ví.\n\nQuá đỉnh! Đồng nghiệp nào đang "bí" nhiệm vụ có thể xin ngay vài bí kíp từ chuyên gia C này nha! 💎',
          time: '3 giờ trước', likes: 18, comments: 3, isLiked: false, type: 'ai_update',
          badge: 'Monthly Achievement'
        },
        {
          id: 103,
          author: { name: 'Em Sen iKame', avatar: '/logo.png', title: 'Hệ thống tự động' },
          content: '💡 **[Gợi ý iWiki từ Sen]** \n\nEm Sen thấy dạo này từ khóa "Quy trình xin cấp phép ngân sách" đang cực kỳ nóng rực trên iWiki. Ai còn đang loay hoay với các form mẫu thì đừng chần chừ nhấp ngay vào link bài viết [Hướng dẫn cấp phép ngân sách 2026] nhé. Tiết kiệm được cả đống thời gian đó! ⏱️',
          time: 'Hôm qua', likes: 35, comments: 2, isLiked: false, type: 'ai_update',
          badge: 'Trending Tips'
        }
      ],
      addPost: (p) => set(s => ({ posts: [{ ...p, id: Date.now(), time: 'Vừa xong', likes: 0, comments: 0, isLiked: false }, ...s.posts] })),
      deletePost: (id) => set(s => ({ posts: s.posts.filter(p => p.id !== id) })),
      togglePinPost: (id) => set(s => ({ posts: s.posts.map(p => p.id === id ? { ...p, isPinned: !p.isPinned } : p) })),
      toggleLikePost: (id) => set(s => ({ posts: s.posts.map(p => p.id === id ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked } : p) })),
    }),
    {
      name: 'ikame-app',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        users: s.users,
        attendanceRecords: s.attendanceRecords,
        todayCheckedIn: s.todayCheckedIn,
        todayCheckInTime: s.todayCheckInTime,
        leaveRequests: s.leaveRequests,
        okrs: s.okrs,
        quests: s.quests,
        celebrations: s.celebrations,
        rewards: s.rewards,
        rewardHistory: s.rewardHistory,
        notifications: s.notifications,
        theme: s.theme,
        language: s.language,
        badges: s.badges,
        events: s.events,
      }),
    }
  )
);

// Backward compatibility helper (for components still using old API)
export const useAppStoreCompat = () => {
  const app = useAppStore();
  const auth = useAuthStore();
  return {
    currentUser: auth.currentUser!,
    setCurrentUser: auth.updateUser,
    addExp: app.addExp,
    spendCredits: app.spendCredits,
    toasts: app.toasts,
    addToast: app.addToast,
    removeToast: app.removeToast,
    notifications: app.notifications,
    markNotificationRead: app.markNotificationRead,
    unreadCount: app.notifications.filter(n => !n.read).length,
  };
};
