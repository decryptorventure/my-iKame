import React, { useState } from 'react';
import { Search, X, Edit, Shield } from 'lucide-react';
import { useAppStore, User } from '../../store';
import { Modal } from '../../components/UI';

export function AdminUsers() {
    const { users, updateEmployee } = useAppStore();
    const [search, setSearch] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const [editForm, setEditForm] = useState({ level: 1, exp: 0, credits: 0 });

    const openEdit = (u: User) => {
        setEditingUser(u);
        setEditForm({ level: u.level, exp: u.exp, credits: u.credits });
    };

    const handleSave = () => {
        if (editingUser) {
            updateEmployee(editingUser.id, editForm);
            setEditingUser(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex md:flex-row flex-col gap-4 md:items-center justify-between">
                <h1 className="text-2xl font-bold">Quản lý Nhân sự</h1>
                <button className="px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700">
                    + Thêm Nhân viên
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm nhân viên..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Nhân viên</th>
                                <th className="px-6 py-4">Chức vụ</th>
                                <th className="px-6 py-4">Level / EXP</th>
                                <th className="px-6 py-4">Credits</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={u.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <p className="font-bold text-slate-900">{u.name}</p>
                                                <p className="text-slate-500 text-xs">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{u.title}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-brand-600">Lv.{u.level}</span>
                                        <span className="text-slate-500 ml-1">({u.exp} EXP)</span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-amber-500">{u.credits}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 uppercase">
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => openEdit(u)} className="text-brand-600 font-medium hover:text-brand-700 bg-brand-50 hover:bg-brand-100 p-2 rounded-lg transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title="Chỉnh sửa Nhân viên">
                {editingUser && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <img src={editingUser.avatar} className="w-12 h-12 rounded-full" alt="" />
                            <div>
                                <p className="font-bold text-slate-900">{editingUser.name}</p>
                                <p className="text-xs text-slate-500">{editingUser.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cấp độ (Level)</label>
                                <input type="number" min={1} value={editForm.level} onChange={e => setEditForm({ ...editForm, level: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kinh nghiệm (EXP)</label>
                                <input type="number" min={0} value={editForm.exp} onChange={e => setEditForm({ ...editForm, exp: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Số dư Credits</label>
                                <div className="relative">
                                    <input type="number" min={0} value={editForm.credits} onChange={e => setEditForm({ ...editForm, credits: parseInt(e.target.value) || 0 })} className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-amber-600" />
                                    <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1">Sử dụng để test các luồng mua sắm/chơi game mà không cần cày Quest.</p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-slate-100">
                            <button onClick={() => setEditingUser(null)} className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">Hủy</button>
                            <button onClick={handleSave} className="flex-1 py-2 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-brand">Lưu thông tin</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
