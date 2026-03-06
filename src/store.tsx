import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Role = 'employee' | 'new_employee' | 'manager' | 'admin';

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
}

export interface RewardHistory {
  id: string;
  rewardId: number;
  rewardTitle: string;
  cost: number;
  date: string;
  status: 'processing' | 'delivered';
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
  'nva@ikame.vn': {
    password: '123456',
    user: {
      id: 'u1', name: 'Nguyễn Văn A', email: 'nva@ikame.vn',
      role: 'new_employee', level: 5, exp: 2450, maxExp: 3000, credits: 150,
      avatar: 'https://picsum.photos/seed/user1/150/150',
      department: 'Engineering', title: 'Intern Developer',
      phone: '0901234567', address: '123 Nguyễn Văn Linh, Q7, TP.HCM',
      dob: '1995-08-20', startDate: '2026-02-15', online: true,
    },
  },
  'emp@ikame.vn': {
    password: '123456',
    user: {
      id: 'u2', name: 'Lê Văn C', email: 'emp@ikame.vn',
      role: 'employee', level: 15, exp: 12000, maxExp: 15000, credits: 850,
      avatar: 'https://picsum.photos/seed/user3/150/150',
      department: 'Engineering', title: 'Senior Developer',
      phone: '0908765432', address: '456 Cách Mạng Tháng 8, Q3, TP.HCM',
      dob: '1992-10-10', startDate: '2022-01-01', online: true,
    },
  },
  'admin@ikame.vn': {
    password: '123456',
    user: {
      id: 'a1', name: 'Trần Thị B', email: 'admin@ikame.vn',
      role: 'admin', level: 25, exp: 45000, maxExp: 50000, credits: 2500,
      avatar: 'https://picsum.photos/seed/manager1/150/150',
      department: 'Board', title: 'Administrator',
      phone: '0909876543', address: '456 Lê Lợi, Q1, TP.HCM',
      dob: '1990-05-12', startDate: '2019-07-01', online: true,
    },
  },
};

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
        checkIn: isLate ? '09:' + String(Math.floor(Math.random() * 30) + 10).padStart(2, '0') : '08:' + String(Math.floor(Math.random() * 29) + 1).padStart(2, '0'),
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
        return { success: true };
      },

      logout: () => set({ currentUser: null, isAuthenticated: false }),

      updateUser: (updates) => {
        const u = get().currentUser;
        if (u) set({ currentUser: { ...u, ...updates } });
      },
    }),
    { name: 'ikame-auth', storage: createJSONStorage(() => localStorage) }
  )
);

interface AppState {
  // Gamification
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: number) => void;
  addExp: (amount: number, reason: string) => void;
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

  // Celebrations
  celebrations: CelebrationItem[];
  sendWish: (celebrationId: number) => void;

  // Reward history
  rewardHistory: RewardHistory[];
  addRewardHistory: (item: Omit<RewardHistory, 'id' | 'date'>) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Settings
  theme: 'light' | 'dark';
  language: 'vi' | 'en';
  toggleTheme: () => void;
  setLanguage: (lang: 'vi' | 'en') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      toasts: [],
      addToast: (toast) => {
        const id = ++toastId;
        set(s => ({ toasts: [...s.toasts, { ...toast, id }] }));
        setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
          toast.duration || (toast.type === 'levelup' ? 5000 : 3000));
      },
      removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

      addExp: (amount, reason) => {
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
        get().addToast({ type: 'exp', title: reason, message: `+${amount} EXP`, expAmount: amount });
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
        { id: 1, title: 'iCheck trước 8:30', desc: 'Đi làm sớm mỗi ngày.', exp: 10, credits: 2, progress: 1, target: 1, status: 'completed', subCategory: 'Productivity', rarity: 'common', tabId: 'daily' },
        { id: 2, title: 'Hoàn thành 1 task', desc: 'Đóng ít nhất 1 task trên hệ thống.', exp: 30, credits: 5, progress: 0, target: 1, status: 'pending', subCategory: 'Productivity', rarity: 'common', tabId: 'daily' },
        { id: 3, title: 'Tương tác mạng nội bộ', desc: 'Like hoặc comment 3 bài viết.', exp: 15, credits: 3, progress: 1, target: 3, status: 'in-progress', subCategory: 'Social', rarity: 'common', tabId: 'daily' },
        { id: 4, title: 'Viết báo cáo tuần', desc: 'Nộp báo cáo trước 17:00 thứ 6.', exp: 100, credits: 20, progress: 0, target: 1, status: 'pending', subCategory: 'Productivity', rarity: 'rare', tabId: 'weekly' },
        { id: 5, title: 'Cập nhật iGoal', desc: 'Cập nhật tiến độ OKR ít nhất 1 lần.', exp: 50, credits: 10, progress: 1, target: 1, status: 'completed', subCategory: 'Goal', rarity: 'common', tabId: 'weekly' },
        { id: 6, title: 'Review Code', desc: 'Review 5 Pull Requests của đồng nghiệp.', exp: 80, credits: 15, progress: 3, target: 5, status: 'in-progress', subCategory: 'Teamwork', rarity: 'rare', tabId: 'weekly' },
        { id: 7, title: 'Viết bài blog kỹ thuật', desc: 'Chia sẻ kiến thức chuyên môn.', exp: 300, credits: 60, progress: 0, target: 1, status: 'pending', subCategory: 'Knowledge', rarity: 'epic', tabId: 'monthly' },
        { id: 8, title: 'Không đi muộn cả tháng', desc: 'Check-in đúng giờ 100%.', exp: 500, credits: 100, progress: 18, target: 22, status: 'in-progress', subCategory: 'Discipline', rarity: 'legendary', tabId: 'monthly' },
        // Onboarding Quest Chain from iKame Onboarding Image
        { id: 9, title: 'Day One Tour', desc: 'Tham gia buổi tour làm quen văn phòng ngày đầu tiên.', exp: 50, credits: 10, progress: 1, target: 1, status: 'completed', subCategory: 'Khởi đầu', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-01' },
        { id: 10, title: 'First meeting with Manager', desc: 'Gặp gỡ và trao đổi định hướng với Quản lý trực tiếp.', exp: 100, credits: 20, progress: 1, target: 1, status: 'completed', subCategory: 'Kết nối', rarity: 'rare', tabId: 'onboarding', deadline: '2026-03-01' },
        { id: 11, title: 'Cập nhật Profile Google & Slack', desc: 'Thêm ảnh đại diện chuyên nghiệp cho tài khoản Google & Slack.', exp: 30, credits: 5, progress: 1, target: 1, status: 'completed', subCategory: 'Thiết lập', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-01' },
        { id: 12, title: 'Đọc Cẩm nang Onboarding', desc: 'Tìm hiểu cẩm nang để trở thành một iKamer hiệu quả.', exp: 80, credits: 15, progress: 0, target: 1, status: 'pending', subCategory: 'Học hỏi', rarity: 'rare', tabId: 'onboarding', deadline: '2026-03-01' },
        { id: 13, title: 'Ký NDA & HĐTV', desc: 'Hoàn thành ký Thỏa thuận Bảo mật thông tin & Hợp đồng thử việc.', exp: 50, credits: 10, progress: 1, target: 1, status: 'completed', subCategory: 'Hồ sơ', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-01' },
        { id: 14, title: 'Cung cấp giấy tờ Kế toán', desc: 'Nộp đầy đủ hồ sơ, giấy tờ cần thiết cho bộ phận Kế toán.', exp: 50, credits: 10, progress: 0, target: 1, status: 'pending', subCategory: 'Hồ sơ', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-08' },
        { id: 15, title: 'Chấm công với iCheck', desc: 'Sign-in và thực hiện chấm công lần đầu với iCheck.', exp: 20, credits: 5, progress: 1, target: 1, status: 'completed', subCategory: 'IT & Tools', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-01' },
        { id: 16, title: 'Sign-in Slack', desc: 'Đăng nhập vào không gian làm việc của team trên Slack.', exp: 20, credits: 5, progress: 1, target: 1, status: 'completed', subCategory: 'IT & Tools', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-01' },
        { id: 17, title: 'Tham gia Group Facebook nội bộ', desc: 'Gia nhập group iKame Inc Group trên Facebook.', exp: 30, credits: 5, progress: 1, target: 1, status: 'completed', subCategory: 'Social', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-01' },
        { id: 18, title: 'Kích hoạt 2FA Email', desc: 'Kích hoạt Xác thực 2 lớp bảo mật cho email công ty.', exp: 50, credits: 10, progress: 0, target: 1, status: 'pending', subCategory: 'IT & Tools', rarity: 'rare', tabId: 'onboarding', deadline: '2026-03-05' },
        { id: 19, title: 'Làm quen với Asana', desc: 'Sign-in Asana và tìm hiểu về Project Onboarding của bạn.', exp: 60, credits: 12, progress: 0, target: 1, status: 'pending', subCategory: 'IT & Tools', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-01' },
        { id: 20, title: 'Khám phá iWiki', desc: 'Sign-in và tìm hiểu các chức năng tra cứu tài liệu trên iWiki.', exp: 40, credits: 8, progress: 0, target: 1, status: 'pending', subCategory: 'IT & Tools', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-01' },
        { id: 21, title: 'Sử dụng iPerform', desc: 'Sign-in và tìm hiểu chức năng của hệ thống iPerform.', exp: 40, credits: 8, progress: 0, target: 1, status: 'pending', subCategory: 'IT & Tools', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-01' },
        { id: 22, title: 'Tìm hiểu iCloud', desc: 'Tìm hiểu về cách thức lưu trữ và chia sẻ file trên iCloud (Optional).', exp: 20, credits: 4, progress: 0, target: 1, status: 'pending', subCategory: 'IT & Tools', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-05' },
        { id: 23, title: 'Tạo IT Support request', desc: 'Tìm hiểu cách tạo request hỗ trợ IT bằng Asana Form (Optional).', exp: 20, credits: 4, progress: 0, target: 1, status: 'pending', subCategory: 'IT & Tools', rarity: 'common', tabId: 'onboarding', deadline: '2026-03-05' },
      ],
      submitQuestReport: (questId, title, desc) => {
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
            get().addExp(quest.exp, `iQuest: ${quest.title}`);
            const auth = useAuthStore.getState();
            auth.updateUser({ credits: (auth.currentUser?.credits || 0) + quest.credits });
            get().addToast({ type: 'success', title: `Quest hoàn thành: ${quest.title}`, message: `+${quest.exp} EXP · +${quest.credits} Credits` });
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
        }
      },

      rewardHistory: [],
      addRewardHistory: (item) => {
        set(s => ({ rewardHistory: [{ ...item, id: `rh-${Date.now()}`, date: new Date().toISOString().split('T')[0] }, ...s.rewardHistory] }));
      },

      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),

      theme: 'light',
      language: 'vi',
      toggleTheme: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'ikame-app',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        attendanceRecords: s.attendanceRecords,
        todayCheckedIn: s.todayCheckedIn,
        todayCheckInTime: s.todayCheckInTime,
        leaveRequests: s.leaveRequests,
        okrs: s.okrs,
        quests: s.quests,
        celebrations: s.celebrations,
        rewardHistory: s.rewardHistory,
        notifications: s.notifications,
        theme: s.theme,
        language: s.language,
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
