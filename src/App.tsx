import React, { useState } from 'react';
import { ClinicProvider } from './context/ClinicContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BookingWizard } from './components/BookingWizard';
import { MyAppointments } from './components/MyAppointments';
import { DentistDashboard } from './components/DentistDashboard';
import { TreatmentsCatalog } from './components/TreatmentsCatalog';
import { StaffProfiles } from './components/StaffProfiles';
import { ClinicAbout } from './components/ClinicAbout';
import { LoginModal } from './components/LoginModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CLINIC_INFO } from './data/mockData';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('booking');
  const [activeRoleView, setActiveRoleView] = useState<'patient' | 'clinic'>('patient');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);

  const handleSelectServiceToBook = (serviceId: string) => {
    setPreselectedServiceId(serviceId);
    setActiveRoleView('patient');
    setCurrentTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDentistToBook = (_dentistId: string) => {
    setActiveRoleView('patient');
    setCurrentTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#292524] antialiased">
      {/* Top Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        activeRoleView={activeRoleView}
        setActiveRoleView={setActiveRoleView}
      />

      {/* Main View Area (with bottom padding on mobile for the fixed nav) */}
      <main className="flex-1 pb-16 md:pb-0">
        {/* If in patient mode and on booking tab, show luxury hero banner */}
        {activeRoleView === 'patient' && currentTab === 'booking' && (
          <HeroSection
            onStartBooking={() => {
              const bookingElement = document.getElementById('booking-section');
              if (bookingElement) {
                bookingElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onViewMyAppointments={() => {
              setCurrentTab('my_appointments');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Dynamic Views */}
        {activeRoleView === 'clinic' ? (
          <DentistDashboard />
        ) : (
          <>
            {currentTab === 'booking' && (
              <div id="booking-section">
                <BookingWizard
                  preselectedServiceId={preselectedServiceId}
                  onSuccessNavigate={() => {
                    setCurrentTab('my_appointments');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenLoginModal={() => setIsLoginModalOpen(true)}
                />
              </div>
            )}

            {currentTab === 'my_appointments' && (
              <MyAppointments
                onNavigateToBooking={() => {
                  setPreselectedServiceId(undefined);
                  setCurrentTab('booking');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenLogin={() => setIsLoginModalOpen(true)}
              />
            )}

            {currentTab === 'treatments' && (
              <TreatmentsCatalog onSelectServiceToBook={handleSelectServiceToBook} />
            )}

            {currentTab === 'team' && (
              <StaffProfiles onSelectDentistToBook={handleSelectDentistToBook} />
            )}

            {currentTab === 'about' && (
              <ClinicAbout
                onStartBooking={() => {
                  setCurrentTab('booking');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1C1917] text-stone-400 border-t border-stone-800 py-10 pb-24 md:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6 pb-6 border-b border-stone-800 text-xs">
            {/* Brand Col */}
            <div className="space-y-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <img
                  src={CLINIC_INFO.logoUrl}
                  alt="Harmony Smile"
                  className="h-9 w-auto object-contain bg-white/95 p-1 rounded-md"
                />
                <span className="font-serif text-base font-bold text-white tracking-wide">
                  Harmony Smile
                </span>
              </div>
              <p className="text-stone-400 leading-relaxed text-[11px]">
                Odontologia contemporânea e harmonização facial com hora marcada e pontualidade.
              </p>
              <p className="text-[#C5A059] font-medium text-[11px]">
                Direção Clínica: Dr. Carlos Alberto Harmony (CRO/SP 98.410)
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <p className="font-semibold text-white uppercase tracking-wider mb-2">
                Atalhos
              </p>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button
                    onClick={() => {
                      setActiveRoleView('patient');
                      setCurrentTab('booking');
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Agendar Consulta Online
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveRoleView('patient');
                      setCurrentTab('my_appointments');
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Meus Agendamentos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveRoleView('clinic');
                      setCurrentTab('clinic_agenda');
                    }}
                    className="text-[#C5A059] hover:text-[#e4be74] transition-colors"
                  >
                    Acessar Agenda Clínica
                  </button>
                </li>
              </ul>
            </div>

            {/* Specialties */}
            <div>
              <p className="font-semibold text-white uppercase tracking-wider mb-2">
                Especialidades
              </p>
              <ul className="space-y-1 text-stone-400 text-[11px]">
                <li>Harmonização Orofacial & Botox</li>
                <li>Clareamento Dental Laser</li>
                <li>Invisalign® & Ortodontia Digital</li>
                <li>Lentes de Contato & Facetas</li>
                <li>Implantes Guiados por Computador</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="font-semibold text-white uppercase tracking-wider mb-2">
                Contato & CNES
              </p>
              <p className="text-stone-300 font-medium text-[11px] mb-1">{CLINIC_INFO.address}</p>
              <p className="text-stone-400 text-[11px] mb-1">{CLINIC_INFO.hours}</p>
              <p className="text-[#C5A059] font-semibold text-[11px]">Tel: {CLINIC_INFO.phone} ({CLINIC_INFO.phoneFormatted})</p>
              <p className="text-stone-400 text-[10px] mt-0.5">Registro CNES: {CLINIC_INFO.cnes}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Harmony Smile Odontologia.</p>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-stone-400 hover:text-white underline"
            >
              Alternar Perfil de Demonstração
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Pattern 1) */}
      <MobileBottomNav
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeRoleView={activeRoleView}
        setActiveRoleView={setActiveRoleView}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Login & Role Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ClinicProvider>
      <AppContent />
    </ClinicProvider>
  );
}
