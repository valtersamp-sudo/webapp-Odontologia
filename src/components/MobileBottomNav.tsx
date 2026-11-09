import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { Calendar, CalendarCheck, Sparkles, Stethoscope, User } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeRoleView: 'patient' | 'clinic';
  setActiveRoleView: (mode: 'patient' | 'clinic') => void;
  onOpenLogin: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  activeRoleView,
  setActiveRoleView,
  onOpenLogin,
}) => {
  const { appointments, currentUser } = useClinic();

  const myUpcomingCount = appointments.filter(
    (a) => a.patientId === currentUser?.id && a.status !== 'cancelled'
  ).length;

  return (
    <nav 
      aria-label="Navegação Principal Mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8DFC9] shadow-lg pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-1">
        {/* Tab 1: Agendar */}
        <button
          type="button"
          onClick={() => {
            setActiveRoleView('patient');
            setCurrentTab('booking');
          }}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
            activeRoleView === 'patient' && currentTab === 'booking'
              ? 'text-[#8D6B2C]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="relative">
            <Calendar className={`w-5 h-5 ${activeRoleView === 'patient' && currentTab === 'booking' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          </div>
          <span className={`text-[10px] mt-1 tracking-tight ${
            activeRoleView === 'patient' && currentTab === 'booking' ? 'font-bold' : 'font-medium'
          }`}>
            Agendar
          </span>
          {activeRoleView === 'patient' && currentTab === 'booking' && (
            <span className="w-1 h-1 rounded-full bg-[#B38E46] mt-0.5" />
          )}
        </button>

        {/* Tab 2: Meus Horários */}
        <button
          type="button"
          onClick={() => {
            setActiveRoleView('patient');
            setCurrentTab('my_appointments');
          }}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
            activeRoleView === 'patient' && currentTab === 'my_appointments'
              ? 'text-[#8D6B2C]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="relative">
            <CalendarCheck className={`w-5 h-5 ${activeRoleView === 'patient' && currentTab === 'my_appointments' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {myUpcomingCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#B38E46] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {myUpcomingCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] mt-1 tracking-tight ${
            activeRoleView === 'patient' && currentTab === 'my_appointments' ? 'font-bold' : 'font-medium'
          }`}>
            Consultas
          </span>
          {activeRoleView === 'patient' && currentTab === 'my_appointments' && (
            <span className="w-1 h-1 rounded-full bg-[#B38E46] mt-0.5" />
          )}
        </button>

        {/* Tab 3: Procedimentos */}
        <button
          type="button"
          onClick={() => {
            setActiveRoleView('patient');
            setCurrentTab('treatments');
          }}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            activeRoleView === 'patient' && currentTab === 'treatments'
              ? 'text-[#8D6B2C]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${activeRoleView === 'patient' && currentTab === 'treatments' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className={`text-[10px] mt-1 tracking-tight ${
            activeRoleView === 'patient' && currentTab === 'treatments' ? 'font-bold' : 'font-medium'
          }`}>
            Serviços
          </span>
          {activeRoleView === 'patient' && currentTab === 'treatments' && (
            <span className="w-1 h-1 rounded-full bg-[#B38E46] mt-0.5" />
          )}
        </button>

        {/* Tab 4: Dentista / Agenda Clínica */}
        <button
          type="button"
          onClick={() => {
            setActiveRoleView('clinic');
            setCurrentTab('clinic_agenda');
          }}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
            activeRoleView === 'clinic'
              ? 'text-[#8D6B2C]'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Stethoscope className={`w-5 h-5 ${activeRoleView === 'clinic' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className={`text-[10px] mt-1 tracking-tight ${
            activeRoleView === 'clinic' ? 'font-bold' : 'font-medium'
          }`}>
            Clínica
          </span>
          {activeRoleView === 'clinic' && (
            <span className="w-1 h-1 rounded-full bg-[#B38E46] mt-0.5" />
          )}
        </button>

        {/* Tab 5: Perfil / Demo User */}
        <button
          type="button"
          onClick={onOpenLogin}
          className="flex flex-col items-center justify-center h-full min-h-[44px] text-stone-500 hover:text-stone-800 transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-[#FAF1DF] border border-[#E8DFC9] text-[#8D6B2C] flex items-center justify-center text-xs font-semibold">
            {currentUser?.name?.charAt(0) || <User className="w-3.5 h-3.5" />}
          </div>
          <span className="text-[10px] mt-1 tracking-tight font-medium">
            Conta
          </span>
        </button>
      </div>
    </nav>
  );
};
