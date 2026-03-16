import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Crown, Search, Sparkles, ArrowRight, Users } from 'lucide-react';
import { PageHeader, EmptyState, inputClass } from '../components/UI';
import { useAppStore } from '../store';
import { cn } from '../utils';

type FilterType = 'all' | 'legend' | 'alumni';

const getYearsAtIKame = (joinDate: string, leaveDate?: string) => {
  const start = new Date(joinDate);
  const end = leaveDate ? new Date(leaveDate) : new Date();
  const diff = end.getTime() - start.getTime();
  const years = Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24 * 365)));
  return years;
};

export const HallOfFame = () => {
  const navigate = useNavigate();
  const { hofMembers, badges } = useAppStore();

  const [filter, setFilter] = useState<FilterType>('all');
  const [query, setQuery] = useState('');

  const featuredMember = hofMembers.find(m => m.type === 'legend');

  const filteredMembers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return hofMembers
      .filter(member => {
        if (filter !== 'all' && member.type !== filter) return false;
        if (!q) return true;
        return (
          member.name.toLowerCase().includes(q) ||
          member.title.toLowerCase().includes(q) ||
          member.department.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === 'legend' ? -1 : 1;
        return b.level - a.level;
      });
  }, [filter, hofMembers, query]);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Crown className="w-6 h-6 text-white" />}
        title="Hall of Fame"
        subtitle="Vinh danh những huyền thoại và cựu iKamer đã tạo nên hành trình đáng tự hào"
        gradient="bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600"
      />

      {featuredMember && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-white p-6 md:p-8 shadow-sm overflow-hidden relative"
        >
          <div className="absolute -top-16 -right-10 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center relative">
            <div className="lg:col-span-2 space-y-3">
              <p className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                <Sparkles className="w-3.5 h-3.5" /> Huyền thoại nổi bật
              </p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900">{featuredMember.name}</h3>
              <p className="text-sm font-semibold text-amber-700">{featuredMember.title} · {featuredMember.department}</p>
              <p className="text-slate-600 italic leading-relaxed">"{featuredMember.quote}"</p>
              <button
                onClick={() => navigate(`/hall-of-fame/${featuredMember.id}`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm"
              >
                Xem hành trình chi tiết <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="justify-self-start lg:justify-self-end">
              <img
                src={featuredMember.avatar}
                alt={featuredMember.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover border-4 border-white shadow-lg"
              />
            </div>
          </div>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 md:p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'legend', label: 'Huyền thoại' },
            { id: 'alumni', label: 'Đã nghỉ' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as FilterType)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-bold transition-all',
                filter === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-amber-300 hover:text-amber-700',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên, chức vụ, phòng ban..."
            className={cn(inputClass, 'pl-10')}
          />
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm">
          <EmptyState
            icon={<Users className="w-7 h-7" />}
            title="Không tìm thấy nhân vật phù hợp"
            description="Thử đổi bộ lọc hoặc từ khóa để xem thêm hồ sơ Hall of Fame."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member, index) => {
            const memberBadges = (member.badges || [])
              .map(badgeId => badges.find(b => b.id === badgeId))
              .filter(Boolean)
              .slice(0, 2);

            return (
              <motion.button
                key={member.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                onClick={() => navigate(`/hall-of-fame/${member.id}`)}
                className={cn(
                  'text-left bg-white rounded-2xl p-5 border shadow-sm transition-all card-hover group',
                  member.type === 'legend'
                    ? 'border-amber-300 hover:border-amber-400'
                    : 'border-slate-200/60 hover:border-slate-300',
                )}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className={cn(
                      'w-16 h-16 rounded-2xl object-cover border-2',
                      member.type === 'legend' ? 'border-amber-300' : 'border-slate-200',
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold text-slate-900 truncate">{member.name}</h3>
                      {member.type === 'legend' && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                          Legend
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-700 truncate">{member.title}</p>
                    <p className="text-xs text-slate-500">{member.department}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-xs text-slate-500 font-medium">
                    {getYearsAtIKame(member.joinDate, member.leaveDate)} năm tại iKame · Lv.{member.level}
                  </p>
                  {member.quote && (
                    <p className="text-sm text-slate-600 line-clamp-2 italic">"{member.quote}"</p>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {memberBadges.length > 0 ? memberBadges.map((badge) => (
                    <span
                      key={badge!.id}
                      className={cn('px-2.5 py-1 rounded-lg text-[11px] border font-bold', badge!.color)}
                    >
                      {badge!.icon} {badge!.name}
                    </span>
                  )) : (
                    <span className="text-xs text-slate-400">Chưa có huy hiệu hiển thị</span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};
