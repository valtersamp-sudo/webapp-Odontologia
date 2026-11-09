import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { CLINIC_INFO } from '../data/mockData';
import { Calendar, ChevronDown, LogOut, Stethoscope, User } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenLogin: () => void;
  activeRoleView: 'patient' | 'clinic';
  setActiveRoleView: (mode: 'patient' | 'clinic') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenLogin,
  activeRoleView,
  setActiveRoleView,
}) => {
  const { currentUser, setCurrentUser, appointments } = useClinic();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const myUpcomingAppointments = appointments.filter(
    (a) => a.patientId === currentUser?.id && a.status !== 'cancelled'
  );

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8DFC9] transition-all">
      {/* Presentation Switcher Strip (Only on desktop or subtle on mobile) */}
      <div className="bg-[#1C1917] text-[#E8DFC9] px-3 sm:px-4 py-1 text-[11px] sm:text-xs">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="text-[#C5A059] font-medium truncate">Harmony Smile</span>
            <span className="hidden sm:inline text-stone-500">·</span>
            <span className="hidden sm:inline text-stone-400">Atendimento Pontual com Hora Marcada</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-stone-400 hidden lg:inline mr-1">Apresentação:</span>
            <div className="inline-flex p-0.5 bg-stone-800 rounded-lg border border-stone-700">
              <button
                type="button"
                onClick={() => {
                  setActiveRoleView('patient');
                  setCurrentTab('booking');
                }}
                className={`px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-md transition-colors ${
                  activeRoleView === 'patient'
                    ? 'bg-[#B38E46] text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Paciente
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveRoleView('clinic');
                  setCurrentTab('clinic_agenda');
                }}
                className={`px-2 py-0.5 text-[10px] sm:text-[11px] font-medium rounded-md transition-colors ${
                  activeRoleView === 'clinic'
                    ? 'bg-[#B38E46] text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Dentista / Recepção
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-14 sm:h-18">
          {/* Zone 1: Brand Wordmark and Logo */}
          <button
            onClick={() => {
              setCurrentTab('booking');
              setActiveRoleView('patient');
            }}
            className="flex items-center gap-2 sm:gap-3 text-left shrink-0 group focus:outline-none min-h-[44px]"
          >
            <img
              src={CLINIC_INFO.logoUrl}
              alt="Harmony Smile Odontologia"
              className="h-9 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-2xl font-semibold tracking-wide text-[#292524] leading-tight">
                Harmony Smile
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#8D6B2C] font-medium hidden sm:inline">
                Odontologia & Estética
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Desktop only, mobile uses fixed bottom bar) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            {activeRoleView === 'patient' ? (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentTab('booking')}
                  className={`hover:text-[#8D6B2C] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 min-h-[44px] flex items-center ${
                    currentTab === 'booking'
                      ? 'text-[#8D6B2C] border-[#B38E46] font-semibold'
                      : 'border-transparent text-stone-700'
                  }`}
                >
                  Agendar Consulta
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('my_appointments')}
                  className={`hover:text-[#8D6B2C] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 min-h-[44px] ${
                    currentTab === 'my_appointments'
                      ? 'text-[#8D6B2C] border-[#B38E46] font-semibold'
                      : 'border-transparent text-stone-700'
                  }`}
                >
                  <span>Meus Agendamentos</span>
                  {myUpcomingAppointments.length > 0 && (
                    <span className="text-[11px] px-1.5 py-0.2 bg-[#FAF1DF] text-[#8D6B2C] font-semibold rounded-md border border-[#E8DFC9]">
                      {myUpcomingAppointments.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('treatments')}
                  className={`hover:text-[#8D6B2C] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 min-h-[44px] flex items-center ${
                    currentTab === 'treatments'
                      ? 'text-[#8D6B2C] border-[#B38E46] font-semibold'
                      : 'border-transparent text-stone-700'
                  }`}
                >
                  Procedimentos
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('team')}
                  className={`hover:text-[#8D6B2C] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 min-h-[44px] flex items-center ${
                    currentTab === 'team'
                      ? 'text-[#8D6B2C] border-[#B38E46] font-semibold'
                      : 'border-transparent text-stone-700'
                  }`}
                >
                  Corpo Clínico
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentTab('about')}
                  className={`hover:text-[#8D6B2C] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 min-h-[44px] flex items-center ${
                    currentTab === 'about'
                      ? 'text-[#8D6B2C] border-[#B38E46] font-semibold'
                      : 'border-transparent text-stone-700'
                  }`}
                >
                  A Clínica
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentTab('clinic_agenda')}
                  className={`hover:text-[#8D6B2C] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 min-h-[44px] ${
                    currentTab === 'clinic_agenda'
                      ? 'text-[#8D6B2C] border-[#B38E46] font-semibold'
                      : 'border-transparent text-stone-700'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-[#B38E46]" />
                  <span>Agenda Completa dos Consultórios</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveRoleView('patient');
                    setCurrentTab('booking');
                  }}
                  className="hover:text-[#8D6B2C] transition-colors whitespace-nowrap shrink-0 py-1 text-stone-600 min-h-[44px] flex items-center"
                >
                  + Novo Agendamento
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: User Action / Profile Button */}
          <div className="flex items-center gap-2 shrink-0">
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border border-[#E8DFC9] bg-white hover:border-[#B38E46] transition-colors text-xs text-stone-700 shadow-2xs min-h-[44px]"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FAF1DF] text-[#8D6B2C] font-semibold flex items-center justify-center font-serif text-xs sm:text-sm">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="font-medium text-stone-800 max-w-[90px] sm:max-w-[120px] truncate text-xs">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E8DFC9] rounded-xl shadow-xl py-2 z-50 text-left">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider">Identificado como</p>
                      <p className="text-sm font-semibold text-stone-800">{currentUser.name}</p>
                      <p className="text-xs text-stone-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded bg-[#FAF1DF] text-[#8D6B2C]">
                        {currentUser.role === 'patient' ? 'Paciente' : currentUser.role === 'dentist' ? 'Dentista' : 'Recepção'}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setActiveRoleView('patient');
                          setCurrentTab('my_appointments');
                        }}
                        className="w-full px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2 min-h-[44px]"
                      >
                        <Calendar className="w-4 h-4 text-[#B38E46]" />
                        <span>Minhas Consultas</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenLogin();
                        }}
                        className="w-full px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2 min-h-[44px]"
                      >
                        <User className="w-4 h-4 text-[#B38E46]" />
                        <span>Trocar Perfil / Modo Demo</span>
                      </button>

                      <div className="border-t border-stone-100 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setCurrentUser(null);
                          }}
                          className="w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 min-h-[44px]"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Desconectar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-[#B38E46] hover:bg-[#997530] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-2xs min-h-[44px] flex items-center"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
