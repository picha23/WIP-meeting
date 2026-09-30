import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { X, User, Mail, Briefcase, Check } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  themeColor: 'green' | 'indigo';
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  themeColor
}) => {
  const [name, setName] = useState(currentProfile.name);
  const [email, setEmail] = useState(currentProfile.email);
  const [role, setRole] = useState(currentProfile.role);

  // Sync state when opened
  React.useEffect(() => {
    if (isOpen) {
      setName(currentProfile.name);
      setEmail(currentProfile.email);
      setRole(currentProfile.role);
    }
  }, [isOpen, currentProfile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSaveProfile({
      name: name.trim(),
      email: email.trim(),
      role: role.trim() || 'Senior Product Designer',
      avatarUrl: currentProfile.avatarUrl
    });
    onClose();
  };

  const primaryBtnClass =
    themeColor === 'indigo'
      ? 'bg-[#4f46e5] hover:bg-[#4338ca] text-white'
      : 'bg-[#218300] hover:bg-[#186700] text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-[#e5e1e7] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e5e1e7] flex items-center justify-between bg-[#fcf8fe]">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs ${
                themeColor === 'indigo' ? 'bg-[#4f46e5]' : 'bg-[#218300]'
              }`}
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#1c1b1f] leading-tight">
                Kemaskini Nama & Profil
              </h3>
              <p className="text-[11px] text-[#556050]">
                Ubah nama pengguna dan maklumat peranan ruang kerja
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#556050] hover:bg-[#f0ecf2] hover:text-[#1c1b1f] transition-colors"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#1c1b1f] mb-1.5">
              Nama Pengguna <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#556050] absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Amri Faizal"
                required
                className="w-full pl-9 pr-3.5 py-2 text-[13px] rounded-xl border border-[#e5e1e7] focus:outline-none focus:border-[#218300] focus:ring-1 focus:ring-[#218300]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#1c1b1f] mb-1.5">
              Alamat Emel
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#556050] absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Contoh: amri.faizal@bigtree.com.my"
                className="w-full pl-9 pr-3.5 py-2 text-[13px] rounded-xl border border-[#e5e1e7] focus:outline-none focus:border-[#218300] focus:ring-1 focus:ring-[#218300]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#1c1b1f] mb-1.5">
              Jawatan / Peranan
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-[#556050] absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Contoh: Senior Product Designer"
                className="w-full pl-9 pr-3.5 py-2 text-[13px] rounded-xl border border-[#e5e1e7] focus:outline-none focus:border-[#218300] focus:ring-1 focus:ring-[#218300]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e5e1e7]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[12px] font-semibold text-[#556050] hover:bg-[#f0ecf2] rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold rounded-xl shadow-xs transition-all active:scale-95 ${primaryBtnClass}`}
            >
              <Check className="w-4 h-4" />
              <span>Simpan Nama & Profil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
