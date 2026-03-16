import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft, Calendar, Heart, ImagePlus, MessageSquareHeart, Users,
  Trophy, Rocket, Milestone, BriefcaseBusiness, Handshake, Sparkles,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { EmptyState, Modal, inputClass } from '../components/UI';
import { cn } from '../utils';
import { useAppStore, useAuthStore } from '../store';

type DetailTab = 'journey' | 'tributes' | 'memories';

const getYearsAtIKame = (joinDate: string, leaveDate?: string) => {
  const start = new Date(joinDate);
  const end = leaveDate ? new Date(leaveDate) : new Date();
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24 * 365)));
};

const formatDate = (date: string) => new Date(date).toLocaleDateString('vi-VN');

const milestoneTypeStyles: Record<string, { dot: string; icon: React.ReactNode }> = {
  join: { dot: 'bg-emerald-500', icon: <Rocket className="w-4 h-4 text-white" /> },
  promotion: { dot: 'bg-amber-500', icon: <Milestone className="w-4 h-4 text-white" /> },
  achievement: { dot: 'bg-violet-500', icon: <Trophy className="w-4 h-4 text-white" /> },
  project: { dot: 'bg-sky-500', icon: <BriefcaseBusiness className="w-4 h-4 text-white" /> },
  farewell: { dot: 'bg-rose-500', icon: <Handshake className="w-4 h-4 text-white" /> },
  custom: { dot: 'bg-slate-500', icon: <Sparkles className="w-4 h-4 text-white" /> },
};

export const HallOfFameDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuthStore();
  const { hofMembers, addHoFTribute, toggleHoFTributeLike, addHoFGalleryPhoto } = useAppStore();

  const [activeTab, setActiveTab] = useState<DetailTab>('journey');
  const [tributeContent, setTributeContent] = useState('');
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoTags, setPhotoTags] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const member = hofMembers.find(item => item.id === id);

  const sortedMilestones = useMemo(
    () => [...(member?.milestones || [])].sort((a, b) => a.date.localeCompare(b.date)),
    [member?.milestones],
  );

  if (!member) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm">
        <EmptyState
          icon={<Users className="w-7 h-7" />}
          title="Không tìm thấy nhân vật"
          description="Hồ sơ Hall of Fame bạn tìm kiếm không còn tồn tại."
          action={{ label: 'Quay lại Hall of Fame', onClick: () => navigate('/hall-of-fame') }}
        />
      </div>
    );
  }

  const handleSubmitTribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !tributeContent.trim()) return;

    addHoFTribute(member.id, {
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorTitle: currentUser.title,
      content: tributeContent.trim(),
    });
    setTributeContent('');
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !photoUrl.trim()) return;

    addHoFGalleryPhoto(member.id, {
      url: photoUrl.trim(),
      caption: photoCaption.trim() || undefined,
      uploadedBy: currentUser.id,
      uploadedByName: currentUser.name,
      tags: photoTags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean),
    });

    setPhotoUrl('');
    setPhotoCaption('');
    setPhotoTags('');
    setIsAddPhotoOpen(false);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/hall-of-fame')}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-amber-300 hover:text-amber-700 transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Hall of Fame
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden"
      >
        <div className="relative h-44 md:h-56">
          <img
            src={member.coverPhoto || member.avatar}
            alt={member.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/65 via-slate-900/20 to-transparent" />
        </div>

        <div className="px-6 md:px-8 pb-7 -mt-14 relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3">
              <img
                src={member.avatar}
                alt={member.name}
                className={cn(
                  'w-28 h-28 rounded-3xl object-cover border-4 shadow-lg',
                  member.type === 'legend' ? 'border-amber-300' : 'border-slate-200',
                )}
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900">{member.name}</h1>
                  <span className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-bold border',
                    member.type === 'legend'
                      ? 'bg-amber-100 text-amber-700 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200',
                  )}>
                    {member.type === 'legend' ? 'Huyền thoại' : 'Alumni'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-1">{member.title} · {member.department}</p>
                {member.quote && <p className="text-sm italic text-slate-600 mt-2">"{member.quote}"</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:min-w-[420px]">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <p className="text-xl font-black text-slate-900">{getYearsAtIKame(member.joinDate, member.leaveDate)}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Năm tại iKame</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <p className="text-xl font-black text-slate-900">Lv.{member.level}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Cấp độ</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <p className="text-xl font-black text-slate-900">{member.stats?.projectsCompleted || 0}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Dự án</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                <p className="text-xl font-black text-slate-900">{member.stats?.mentees || 0}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Mentor</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <h3 className="text-sm font-black text-amber-800 mb-2">Dấu ấn nổi bật</h3>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-amber-900">
              {member.highlights.map(item => <li key={item} className="font-medium">• {item}</li>)}
            </ul>
          </div>
        </div>
      </motion.div>

      <div className="bg-white rounded-2xl border border-slate-200/60 p-3 shadow-sm flex gap-2 overflow-x-auto">
        {[
          { id: 'journey', label: 'Chặng đường', count: sortedMilestones.length },
          { id: 'tributes', label: 'Lời gửi gắm', count: member.tributes.length },
          { id: 'memories', label: 'Kỷ niệm', count: member.gallery.length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as DetailTab)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-amber-300 hover:text-amber-700',
            )}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'journey' && (
          <motion.div
            key="journey"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6"
          >
            <div className="space-y-5">
              {sortedMilestones.map((milestone, index) => {
                const style = milestoneTypeStyles[milestone.type] || milestoneTypeStyles.custom;
                return (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shadow-sm', style.dot)}>
                        {style.icon}
                      </div>
                      {index < sortedMilestones.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 my-1" />}
                    </div>
                    <div className="flex-1 pb-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{milestone.date}</p>
                      <h3 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-2">
                        {milestone.icon ? <span>{milestone.icon}</span> : null}
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{milestone.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'tributes' && (
          <motion.div
            key="tributes"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            <form
              onSubmit={handleSubmitTribute}
              className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 space-y-3"
            >
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <MessageSquareHeart className="w-4 h-4 text-amber-600" />
                Gửi lời tri ân
              </h3>
              <textarea
                value={tributeContent}
                onChange={(e) => setTributeContent(e.target.value)}
                rows={4}
                placeholder="Viết điều bạn muốn gửi đến nhân vật này..."
                className={cn(inputClass, 'min-h-[112px] resize-none')}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!tributeContent.trim()}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-sm font-bold transition-all',
                    tributeContent.trim()
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed',
                  )}
                >
                  Gửi lời yêu thương
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {[...member.tributes]
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                .map(tribute => {
                  const hasLiked = !!currentUser && tribute.likedBy.includes(currentUser.id);
                  return (
                    <motion.div
                      key={tribute.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 md:p-5"
                    >
                      <div className="flex items-start gap-3">
                        <img src={tribute.authorAvatar} alt={tribute.authorName} className="w-11 h-11 rounded-full object-cover border border-slate-200" />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-bold text-slate-900">{tribute.authorName}</p>
                              <p className="text-xs text-slate-500">{tribute.authorTitle}</p>
                            </div>
                            <p className="text-xs text-slate-400">{formatDate(tribute.createdAt)}</p>
                          </div>
                          <p className="text-sm text-slate-700 mt-3 leading-relaxed">{tribute.content}</p>
                          <button
                            onClick={() => currentUser && toggleHoFTributeLike(member.id, tribute.id, currentUser.id)}
                            className={cn(
                              'mt-3 inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-all',
                              hasLiked
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-rose-200 hover:text-rose-700',
                            )}
                          >
                            <Heart className={cn('w-3.5 h-3.5', hasLiked ? 'fill-rose-500 text-rose-500' : '')} />
                            {tribute.likes} lượt yêu thích
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        )}

        {activeTab === 'memories' && (
          <motion.div
            key="memories"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 flex justify-end">
              <button
                onClick={() => setIsAddPhotoOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all"
              >
                <ImagePlus className="w-4 h-4" /> Đóng góp ảnh
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {member.gallery.map((photo, index) => (
                <motion.button
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => setLightboxIndex(index)}
                  className="relative rounded-2xl overflow-hidden border border-slate-200 group shadow-sm"
                >
                  <img src={photo.url} alt={photo.caption || member.name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-900/80 to-transparent text-left">
                    <p className="text-xs font-bold text-white line-clamp-1">{photo.caption || 'Khoảnh khắc kỷ niệm'}</p>
                    <p className="text-[11px] text-white/80 mt-0.5">by {photo.uploadedByName}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal isOpen={isAddPhotoOpen} onClose={() => setIsAddPhotoOpen(false)} title="Đóng góp ảnh kỷ niệm">
        <form onSubmit={handleAddPhoto} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">URL hình ảnh</label>
            <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className={inputClass} placeholder="https://..." required />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Caption</label>
            <input value={photoCaption} onChange={(e) => setPhotoCaption(e.target.value)} className={inputClass} placeholder="Mô tả ngắn về ảnh..." />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tags (phân tách bằng dấu phẩy)</label>
            <input value={photoTags} onChange={(e) => setPhotoTags(e.target.value)} className={inputClass} placeholder="team, workshop, memory" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsAddPhotoOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl">
              Hủy
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl">
              Lưu ảnh
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        title="Khoảnh khắc iKame"
        size="xl"
      >
        {lightboxIndex !== null && member.gallery[lightboxIndex] && (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200">
              <img
                src={member.gallery[lightboxIndex].url}
                alt={member.gallery[lightboxIndex].caption || member.name}
                className="w-full max-h-[65vh] object-cover"
              />
              <button
                onClick={() => setLightboxIndex(prev => prev === null ? prev : (prev - 1 + member.gallery.length) % member.gallery.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow"
              >
                <ChevronLeft className="w-4 h-4 text-slate-700" />
              </button>
              <button
                onClick={() => setLightboxIndex(prev => prev === null ? prev : (prev + 1) % member.gallery.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow"
              >
                <ChevronRight className="w-4 h-4 text-slate-700" />
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-900">{member.gallery[lightboxIndex].caption || 'Khoảnh khắc đáng nhớ'}</p>
                <p className="text-sm text-slate-500">Đăng bởi {member.gallery[lightboxIndex].uploadedByName}</p>
              </div>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(member.gallery[lightboxIndex].uploadedAt)}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
