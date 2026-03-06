import React, { useState } from 'react';
import { BookOpen, FileText, Download, Search, Folder, File, FileArchive, ExternalLink, Eye, Plus, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader, EmptyState } from '../components/UI';
import { cn } from '../utils';

const CATEGORIES = [
  { id: 'hr', label: 'Nhân sự & Chính sách', icon: '👥', count: 12, color: 'from-brand-500 to-purple-600', desc: 'Sổ tay NV, quy trình nghỉ phép, phúc lợi' },
  { id: 'tech', label: 'Kỹ thuật & Dev', icon: '💻', count: 8, color: 'from-emerald-500 to-teal-600', desc: 'Coding standards, deploy guide, architecture' },
  { id: 'finance', label: 'Tài chính & Kế toán', icon: '💰', count: 5, color: 'from-amber-500 to-orange-600', desc: 'Quy trình thanh toán, báo cáo, chi phí' },
  { id: 'product', label: 'Sản phẩm', icon: '🚀', count: 9, color: 'from-rose-500 to-pink-600', desc: 'Roadmap, PRD templates, design system' },
];

const ALL_DOCS = [
  { id: 1, title: 'Sổ tay nhân viên 2026', category: 'hr', type: 'pdf', size: '2.4MB', updatedAt: '2026-01-10', author: 'HR Department', views: 342 },
  { id: 2, title: 'Quy trình xin nghỉ phép', category: 'hr', type: 'doc', size: '480KB', updatedAt: '2026-02-15', author: 'Nguyễn Hằng', views: 218 },
  { id: 3, title: 'Coding Standards & Best Practices', category: 'tech', type: 'md', size: '120KB', updatedAt: '2026-02-28', author: 'Tech Lead', views: 156 },
  { id: 4, title: 'Hướng dẫn Deploy Production', category: 'tech', type: 'md', size: '240KB', updatedAt: '2026-03-01', author: 'DevOps Team', views: 89 },
  { id: 5, title: 'Chính sách bảo mật thông tin', category: 'hr', type: 'pdf', size: '1.2MB', updatedAt: '2025-12-20', author: 'IT Security', views: 124 },
  { id: 6, title: 'Quy trình thanh toán chi phí', category: 'finance', type: 'doc', size: '380KB', updatedAt: '2026-01-05', author: 'Finance Team', views: 67 },
  { id: 7, title: 'Product Roadmap Q1-Q2 2026', category: 'product', type: 'pdf', size: '5.8MB', updatedAt: '2026-02-01', author: 'CPO Office', views: 201 },
  { id: 8, title: 'Architecture Decision Records', category: 'tech', type: 'md', size: '88KB', updatedAt: '2026-03-03', author: 'Backend Team', views: 77 },
];

const fileIcon = (type: string) => {
  if (type === 'pdf') return <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center"><FileText className="w-5 h-5 text-rose-600" /></div>;
  if (type === 'md') return <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center"><File className="w-5 h-5 text-brand-600" /></div>;
  return <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><FileText className="w-5 h-5 text-blue-600" /></div>;
};

export const Documents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredDocs = ALL_DOCS.filter(doc => {
    const matchSearch = searchQuery.length === 0 || doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = !selectedCategory || doc.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <PageHeader icon={<BookOpen className="w-6 h-6 text-white" />} title="iWiki"
        subtitle="Kho tri thức nội bộ — Tìm kiếm tài liệu, quy trình, chính sách"
        gradient="bg-brand-gradient"
      />

      {/* Featured Articles & Search Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Featured Card */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 bg-orange-50 rounded-3xl p-8 border border-orange-100 relative overflow-hidden group cursor-pointer">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <span className="px-3 py-1 bg-white text-brand-600 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">Tin hot</span>
              <h2 className="text-3xl font-black text-slate-800 mt-4 leading-tight">Những điều iKamer cần biết<br />về văn hoá & quy định</h2>
              <p className="text-slate-600 mt-3 text-sm max-w-md leading-relaxed">Bộ tài liệu tổng hợp tất cả các quy trình từ onboard, nghỉ phép đến chính sách đãi ngộ mới nhất 2026.</p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <button className="px-6 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-sm shadow-brand-lg hover:bg-brand-700 transition-colors">Đọc ngay</button>
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => <img key={i} src={`https://picsum.photos/seed/${i + 42}/32/32`} className="w-8 h-8 rounded-full border-2 border-white" alt="" />)}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-white/50 flex items-center justify-center text-[10px] font-bold text-slate-500">+12</div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 text-[120px] opacity-[0.03] select-none font-black">WIKI</div>
        </motion.div>

        {/* Quick Links / Search Side */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex-1">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-brand-500" /> Truy cập nhanh</h3>
            <div className="space-y-3">
              {['Quy định nghỉ phép', 'Chính sách bảo hiểm', 'Coding Standards', 'Phúc lợi sinh nhật'].map(link => (
                <button key={link} className="w-full text-left px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:border-brand-100 hover:text-brand-600 transition-all flex items-center justify-between group">
                  {link} <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm tài liệu, quy trình, hướng dẫn..."
          className="w-full pl-14 pr-14 py-4 bg-white border border-slate-200 rounded-3xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-400 focus:bg-white transition-all shadow-xl shadow-slate-200/40 placeholder:text-slate-400"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
        {searchQuery && (
          <p className="absolute -bottom-7 left-4 text-xs text-slate-500 font-medium">
            {filteredDocs.length} kết quả cho "<strong>{searchQuery}</strong>"
          </p>
        )}
      </div>

      {/* Categories */}
      {!searchQuery && !selectedCategory && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
          {CATEGORIES.map((cat, i) => (
            <motion.button key={cat.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              onClick={() => setSelectedCategory(cat.id)}
              className="group relative bg-white rounded-2xl p-5 border border-slate-200/60 card-hover text-left overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center mb-3 text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1 leading-tight">{cat.label}</h3>
              <p className="text-xs text-slate-500">{cat.desc}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">{cat.count} tài liệu</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Category header if selected */}
      {selectedCategory && !searchQuery && (
        <div className="flex items-center gap-2">
          <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-1.5 text-sm text-brand-600 font-bold hover:text-brand-700 transition-colors">
            ← Tất cả danh mục
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-bold text-slate-700">{CATEGORIES.find(c => c.id === selectedCategory)?.label}</span>
        </div>
      )}

      {/* Document list */}
      {(searchQuery || selectedCategory) && (
        <motion.div key="doclist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-2">
          {filteredDocs.length === 0 ? (
            <EmptyState icon={<BookOpen className="w-8 h-8" />} title="Không tìm thấy tài liệu" description="Thử tìm với từ khóa khác hoặc hỏi AI Assistant." action={{ label: '← Xem tất cả', onClick: () => { setSearchQuery(''); setSelectedCategory(null); } }} />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm divide-y divide-slate-100 overflow-hidden">
              {filteredDocs.map((doc, i) => (
                <motion.div key={doc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/80 transition-colors group">
                  <div className="flex-shrink-0">{fileIcon(doc.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">{doc.title}</h4>
                    <div className="flex items-center gap-3 mt-0.5 text-[11px] text-slate-400 font-medium">
                      <span>{doc.author}</span>
                      <span>·</span>
                      <span>{doc.updatedAt}</span>
                      <span>·</span>
                      <span>{doc.size}</span>
                      <span>·</span>
                      <span>{doc.views} lượt xem</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-brand-50 text-brand-600 rounded-xl hover:bg-brand-100 transition-colors" title="Xem tài liệu">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors" title="Tải xuống">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors" title="Mở trong tab mới">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Recent docs when no search or category */}
      {!searchQuery && !selectedCategory && (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Tài liệu gần đây</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {ALL_DOCS.slice(0, 5).map((doc, i) => (
              <motion.div key={doc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/80 transition-colors group cursor-pointer">
                <div className="flex-shrink-0">{fileIcon(doc.type)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors truncate">{doc.title}</h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">{CATEGORIES.find(c => c.id === doc.category)?.label} · {doc.updatedAt}</p>
                </div>
                <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap hidden sm:block">{doc.views} lượt xem</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
