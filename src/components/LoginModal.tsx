import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { DEMO_USERS, CLINIC_INFO } from '../data/mockData';
import { User } from '../types';
import { Check, Sparkles, UserCheck, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser, registerPatient } = useClinic();
  const [tab, setTab] = useState<'quick' | 'register'>('quick');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');

  if (!isOpen) return null;

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    const user = registerPatient(name.trim(), email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@exemplo.com`, phone.trim(), cpf.trim());
    setCurrentUser(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-lg bg-[#FCFAF7] border-t sm:border border-[#E8DFC9] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col pb-[env(safe-area-inset-bottom,16px)]"
        role="dialog"
        aria-modal="true"
      >
        <div className="sm:hidden w-12 h-1.5 bg-stone-300 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-b from-[#FAF4E8] to-[#FCFAF7] border-b border-[#E8DFC9] relative text-center shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 text-stone-400 hover:text-stone-700 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
          
          <img
            src={CLINIC_INFO.logoUrl}
            alt="Harmony Smile Odontologia"
            className="h-12 sm:h-16 w-auto mx-auto object-contain mb-1"
          />
          <h3 className="text-lg sm:text-xl font-serif text-[#292524] tracking-tight">
            Harmony Smile
          </h3>
          <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
            Acesso ao Sistema de Agendamento
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E8DFC9] bg-stone-100/60 p-1 shrink-0">
          <button
            type="button"
            onClick={() => setTab('quick')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all min-h-[40px] ${
              tab === 'quick'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Perfis de Demonstração
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all min-h-[40px] ${
              tab === 'register'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Novo Paciente
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {tab === 'quick' ? (
            <div className="space-y-2.5">
              <p className="text-xs text-stone-500 mb-2">
                Selecione um perfil para demonstrar ao vivo:
              </p>

              {DEMO_USERS.map((user) => {
                const isSelected = currentUser?.id === user.id;
                const roleBadge = 
                  user.role === 'patient' 
                    ? 'Paciente' 
                    : user.role === 'dentist' 
                    ? 'Cirurgiã-Dentista' 
                    : 'Recepção';

                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group min-h-[52px] active:scale-[0.99] ${
                      isSelected
                        ? 'border-[#B38E46] bg-[#F7F2E7] shadow-xs'
                        : 'border-stone-200 bg-white hover:border-[#D4AF37] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-sm font-semibold shrink-0 ${
                        isSelected 
                          ? 'bg-[#B38E46] text-white' 
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {user.name.charAt(0)}
                      </div>
                      <div className="truncate pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-semibold text-stone-900 truncate">{user.name}</span>
                          {isSelected && (
                            <span className="text-[9px] text-[#8D6B2C] font-semibold px-1.5 py-0.2 bg-[#FAF1DF] rounded shrink-0">
                              Ativo
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate">
                          {roleBadge} · {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="text-stone-400 shrink-0">
                      {isSelected ? <Check className="w-5 h-5 text-[#B38E46]" /> : <UserCheck className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Valter Sampaio"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B38E46]/40 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  WhatsApp / Celular *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B38E46]/40 min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    CPF (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg min-h-[44px]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 bg-[#B38E46] active:bg-[#997530] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Sparkles className="w-4 h-4" />
                Criar Acesso e Continuar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
