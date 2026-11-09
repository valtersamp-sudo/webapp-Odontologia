import React, { useState, useMemo } from 'react';
import { useClinic } from '../context/ClinicContext';
import { CLINIC_INFO, getRelativeDateString } from '../data/mockData';
import { Dentist, Service } from '../types';
import {
  formatFriendlyDate,
  formatFullDate,
  generateGoogleCalendarUrl,
  generateICSDataUri,
  generateWhatsAppConfirmationUrl,
} from '../utils/calendarUtils';
import {
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Info,
  MapPin,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User as UserIcon,
} from 'lucide-react';

interface BookingWizardProps {
  onSuccessNavigate?: () => void;
  preselectedServiceId?: string;
  onOpenLoginModal?: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  onSuccessNavigate,
  preselectedServiceId,
}) => {
  const {
    services,
    dentists,
    currentUser,
    getAvailableSlots,
    addAppointment,
    registerPatient,
  } = useClinic();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || services[0]?.id || ''
  );
  const [selectedDentistId, setSelectedDentistId] = useState<string>(dentists[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(() => getRelativeDateString(1)); // Tomorrow
  const [selectedTime, setSelectedTime] = useState<string>('10:00');

  const [patientName, setPatientName] = useState(currentUser?.name || 'Valter Sampaio');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '(11) 99123-8844');
  const [patientEmail, setPatientEmail] = useState(currentUser?.email || 'valtersamp@gmail.com');
  const [notes, setNotes] = useState('');
  const [allergies, setAllergies] = useState('');
  const [sendWhatsAppReminder, setSendWhatsAppReminder] = useState(true);

  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCategory, setServiceCategory] = useState<string>('all');
  const [createdAppointment, setCreatedAppointment] = useState<any>(null);

  React.useEffect(() => {
    if (currentUser) {
      setPatientName(currentUser.name);
      setPatientPhone(currentUser.phone);
      setPatientEmail(currentUser.email);
    }
  }, [currentUser]);

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId) || services[0],
    [services, selectedServiceId]
  );

  const selectedDentist = useMemo(
    () => dentists.find((d) => d.id === selectedDentistId) || dentists[0],
    [dentists, selectedDentistId]
  );

  const dateOptions = useMemo(() => {
    const list = [];
    for (let i = 0; i < 14; i++) {
      const dateStr = getRelativeDateString(i);
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      const isSunday = d.getDay() === 0;
      if (!isSunday) {
        list.push({
          dateStr,
          dayNumber: day,
          dayName: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
          monthName: d.toLocaleDateString('pt-BR', { month: 'short' }),
          isToday: i === 0,
          isTomorrow: i === 1,
        });
      }
    }
    return list;
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesSearch =
        srv.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        srv.description.toLowerCase().includes(serviceSearch.toLowerCase());
      const matchesCategory =
        serviceCategory === 'all' || srv.category === serviceCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, serviceSearch, serviceCategory]);

  const timeSlots = useMemo(() => {
    if (!selectedDentistId || !selectedDate) return [];
    return getAvailableSlots(selectedDentistId, selectedDate);
  }, [getAvailableSlots, selectedDentistId, selectedDate]);

  const handleConfirmBooking = () => {
    if (!currentUser) {
      registerPatient(patientName, patientEmail, patientPhone);
    }

    const newApt = addAppointment({
      patientId: currentUser?.id || `usr-${Date.now()}`,
      patientName,
      patientPhone,
      patientEmail,
      dentistId: selectedDentist.id,
      dentistName: selectedDentist.name,
      dentistCro: selectedDentist.cro,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      categoryLabel: selectedService.categoryLabel,
      durationMinutes: selectedService.durationMinutes,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmed',
      notes,
      allergiesSensitivities: allergies,
    });

    setCreatedAppointment(newApt);
    setStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 pb-28 md:pb-8">
      {/* Wizard Progress Bar */}
      {step < 5 && (
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2.5 text-[11px] sm:text-xs font-medium text-stone-500">
            <span className={step >= 1 ? 'text-[#8D6B2C] font-semibold' : ''}>1. Tratamento</span>
            <span className="text-stone-300">·</span>
            <span className={step >= 2 ? 'text-[#8D6B2C] font-semibold' : ''}>2. Dentista</span>
            <span className="text-stone-300">·</span>
            <span className={step >= 3 ? 'text-[#8D6B2C] font-semibold' : ''}>3. Horário</span>
            <span className="text-stone-300">·</span>
            <span className={step >= 4 ? 'text-[#8D6B2C] font-semibold' : ''}>4. Confirmar</span>
          </div>

          <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B38E46] transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: Escolha do Procedimento */}
      {step === 1 && (
        <div className="space-y-4 sm:space-y-6">
          <div className="text-left sm:text-center max-w-2xl mx-auto">
            <span className="text-[11px] uppercase tracking-widest text-[#8D6B2C] font-semibold">
              Passo 1 de 4
            </span>
            <h2 className="text-xl sm:text-3xl font-serif text-[#292524] mt-0.5">
              Selecione o Procedimento
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Odontologia estética, preventiva e restauradora com tecnologia 3D.
            </p>
          </div>

          {/* Search & Categories Bar */}
          <div className="flex flex-col gap-2.5">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar procedimento (clareamento, botox, limpeza...)"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B38E46]/40 min-h-[44px]"
              />
            </div>

            {/* Horizontal Touch Scroll for Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x -mx-1 px-1">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'estetica', label: 'Estética & Harmonização' },
                { id: 'clinica', label: 'Clínica & Prevenção' },
                { id: 'ortodontia', label: 'Invisalign' },
                { id: 'cirurgia', label: 'Implantes' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setServiceCategory(cat.id)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap min-h-[40px] shrink-0 transition-colors snap-start ${
                    serviceCategory === cat.id
                      ? 'bg-[#B38E46] text-white shadow-2xs font-semibold'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {filteredServices.map((srv) => {
              const isSelected = selectedServiceId === srv.id;
              return (
                <div
                  key={srv.id}
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`p-4 sm:p-5 rounded-xl border text-left cursor-pointer transition-all active:scale-[0.99] min-h-[48px] ${
                    isSelected
                      ? 'border-[#B38E46] bg-[#FAF6EC] shadow-xs ring-2 ring-[#B38E46]'
                      : 'border-stone-200 bg-white hover:border-[#D4AF37]/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#8D6B2C] font-semibold">
                          {srv.categoryLabel}
                        </span>
                        {srv.popular && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FAF1DF] text-[#8D6B2C] font-semibold border border-[#E8DFC9]">
                            Destaque
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-stone-900 mt-0.5">
                        {srv.name}
                      </h3>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#B38E46] border-[#B38E46] text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
                    {srv.description}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2.5 border-t border-stone-100 text-stone-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#B38E46]" />
                      <span>{srv.durationMinutes} min</span>
                    </div>
                    <span className="font-semibold text-stone-800">
                      {srv.priceFormatted}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Continue Button */}
          <div className="hidden md:flex justify-end pt-4">
            <button
              type="button"
              onClick={() => {
                setStep(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-2.5 bg-[#B38E46] hover:bg-[#997530] text-white text-sm font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-2 min-h-[44px]"
            >
              <span>Continuar para Profissional</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sticky Mobile Bottom CTA Bar */}
          <div className="md:hidden fixed bottom-16 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-[#E8DFC9] z-30 shadow-lg flex items-center justify-between gap-3">
            <div className="truncate pr-2">
              <span className="text-[10px] text-stone-500 uppercase block">Selecionado:</span>
              <span className="text-xs font-semibold text-stone-900 truncate block">
                {selectedService.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setStep(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-[#B38E46] active:bg-[#997530] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 min-h-[44px] shrink-0"
            >
              <span>Avançar</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Escolha do Profissional */}
      {step === 2 && (
        <div className="space-y-4 sm:space-y-6">
          <div className="text-left sm:text-center max-w-2xl mx-auto">
            <span className="text-[11px] uppercase tracking-widest text-[#8D6B2C] font-semibold">
              Passo 2 de 4
            </span>
            <h2 className="text-xl sm:text-3xl font-serif text-[#292524] mt-0.5">
              Escolha o Dentista
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Corpo clínico com sólida experiência em cada especialidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
            {dentists.map((dentist) => {
              const isSelected = selectedDentistId === dentist.id;
              return (
                <div
                  key={dentist.id}
                  onClick={() => setSelectedDentistId(dentist.id)}
                  className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all active:scale-[0.99] flex flex-row md:flex-col items-center md:items-stretch gap-4 justify-between ${
                    isSelected
                      ? 'border-[#B38E46] bg-[#FAF6EC] shadow-xs ring-2 ring-[#B38E46]'
                      : 'border-stone-200 bg-white hover:border-[#D4AF37]/60'
                  }`}
                >
                  <div className="flex md:flex-col items-center gap-3 md:gap-0 flex-1">
                    <div className="relative shrink-0 md:mb-3">
                      <img
                        src={dentist.avatar}
                        alt={dentist.name}
                        className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover border border-[#E8DFC9] shadow-xs"
                      />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 bg-[#B38E46] text-white p-1 rounded-full shadow-2xs">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="text-left md:text-center">
                      <h3 className="text-sm sm:text-base font-semibold text-stone-900">
                        {dentist.name}
                      </h3>
                      <p className="text-xs text-[#8D6B2C] font-medium">
                        {dentist.cro}
                      </p>
                      <p className="text-xs text-stone-500 line-clamp-1 md:line-clamp-2 mt-0.5">
                        {dentist.title}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:block pt-3 border-t border-stone-100 text-xs text-stone-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#B38E46]" />
                        <span className="font-semibold text-stone-800">{dentist.rating}</span>
                        <span>({dentist.reviewsCount})</span>
                      </div>
                      <span className="text-[11px] text-stone-400">Seg a Sex</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm font-medium flex items-center gap-1.5 min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(3);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-2.5 bg-[#B38E46] hover:bg-[#997530] text-white text-sm font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-2 min-h-[44px]"
            >
              <span>Continuar para Horários</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sticky Mobile Bottom CTA Bar */}
          <div className="md:hidden fixed bottom-16 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-[#E8DFC9] z-30 shadow-lg flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-2 text-stone-600 text-xs font-semibold flex items-center gap-1 min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(3);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-[#B38E46] active:bg-[#997530] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 min-h-[44px]"
            >
              <span>Ver Horários</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Escolha de Data e Horário */}
      {step === 3 && (
        <div className="space-y-4 sm:space-y-6">
          <div className="text-left sm:text-center max-w-2xl mx-auto">
            <span className="text-[11px] uppercase tracking-widest text-[#8D6B2C] font-semibold">
              Passo 3 de 4
            </span>
            <h2 className="text-xl sm:text-3xl font-serif text-[#292524] mt-0.5">
              Escolha o Dia e Horário
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Atendimento com <strong className="text-stone-800">{selectedDentist.name}</strong> para{' '}
              <span className="text-[#8D6B2C] font-medium">{selectedService.name}</span>.
            </p>
          </div>

          {/* Touch Date Scroller */}
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-[11px] sm:text-xs font-semibold uppercase text-stone-600 tracking-wider">
                1. Selecione o Dia
              </label>
              <span className="text-[11px] text-[#8D6B2C] font-medium">
                {formatFriendlyDate(selectedDate)}
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x -mx-1 px-1">
              {dateOptions.map((opt) => {
                const isSelected = selectedDate === opt.dateStr;
                return (
                  <button
                    key={opt.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(opt.dateStr)}
                    className={`flex flex-col items-center justify-center min-w-[68px] sm:min-w-[76px] py-2.5 sm:py-3 px-2 rounded-xl border text-center transition-all snap-start min-h-[64px] active:scale-95 ${
                      isSelected
                        ? 'border-[#B38E46] bg-[#B38E46] text-white shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-[#FAF6EC] text-stone-800'
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-semibold ${
                      isSelected ? 'text-[#FAF1DF]' : 'text-stone-500'
                    }`}>
                      {opt.dayName}
                    </span>
                    <span className="text-lg sm:text-xl font-bold my-0.5">
                      {opt.dayNumber}
                    </span>
                    <span className={`text-[10px] ${
                      isSelected ? 'text-white/90 font-medium' : 'text-stone-400'
                    }`}>
                      {opt.isTomorrow ? 'Amanhã' : opt.isToday ? 'Hoje' : opt.monthName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Touch-Friendly Time Slots Grid */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold uppercase text-stone-600 tracking-wider">
                  2. Horários para {formatFriendlyDate(selectedDate)}
                </label>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Toque para selecionar seu horário
                </p>
              </div>

              <div className="flex items-center gap-2.5 text-[11px]">
                <div className="flex items-center gap-1 text-stone-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Livre</span>
                </div>
                <div className="flex items-center gap-1 text-stone-400">
                  <span className="w-2 h-2 rounded-full bg-stone-300" />
                  <span>Ocupado</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
              {timeSlots.map((slot) => {
                const isSelected = selectedTime === slot.time && slot.available;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`py-2.5 sm:py-3 px-2 rounded-xl text-xs font-medium border transition-all text-center min-h-[48px] flex flex-col items-center justify-center active:scale-95 ${
                      !slot.available
                        ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed opacity-50'
                        : isSelected
                        ? 'border-[#B38E46] bg-[#FAF6EC] text-[#8D6B2C] ring-2 ring-[#B38E46] font-bold shadow-2xs'
                        : 'border-stone-200 bg-white hover:border-[#D4AF37] text-stone-800'
                    }`}
                  >
                    <span className="text-sm font-semibold">{slot.time}</span>
                    <span className="text-[9px] text-stone-400 mt-0.2">
                      {slot.available ? 'Livre' : 'Ocupado'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => {
                setStep(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm font-medium flex items-center gap-1.5 min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            <button
              type="button"
              disabled={!selectedTime}
              onClick={() => {
                setStep(4);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-2.5 bg-[#B38E46] hover:bg-[#997530] text-white text-sm font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-2 min-h-[44px] disabled:opacity-50"
            >
              <span>Revisar e Confirmar</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sticky Mobile Bottom CTA Bar */}
          <div className="md:hidden fixed bottom-16 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-[#E8DFC9] z-30 shadow-lg flex items-center justify-between gap-3">
            <div className="truncate pr-2">
              <span className="text-[10px] text-stone-500 block">Horário escolhido:</span>
              <span className="text-xs font-bold text-stone-900 block">
                {selectedTime} · {formatFriendlyDate(selectedDate)}
              </span>
            </div>

            <button
              type="button"
              disabled={!selectedTime}
              onClick={() => {
                setStep(4);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-[#B38E46] active:bg-[#997530] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 min-h-[44px] disabled:opacity-50 shrink-0"
            >
              <span>Avançar</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Revisão e Confirmação */}
      {step === 4 && (
        <div className="space-y-4 sm:space-y-6">
          <div className="text-left sm:text-center max-w-2xl mx-auto">
            <span className="text-[11px] uppercase tracking-widest text-[#8D6B2C] font-semibold">
              Passo 4 de 4
            </span>
            <h2 className="text-xl sm:text-3xl font-serif text-[#292524] mt-0.5">
              Confirmar Agendamento
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Revise os dados antes de finalizar sua reserva de horário.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-4 bg-white p-4 sm:p-6 rounded-xl border border-stone-200">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-xs sm:text-sm font-semibold text-stone-900 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-[#B38E46]" />
                  <span>Dados do Paciente</span>
                </h3>
                {currentUser && (
                  <span className="text-[10px] text-[#8D6B2C] font-medium bg-[#FAF1DF] px-2 py-0.5 rounded">
                    {currentUser.name}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38E46]/30 min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    WhatsApp / Celular *
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38E46]/30 min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  E-mail para Confirmação
                </label>
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38E46]/30 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Sensibilidade dental ou alergias (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: sensibilidade a ar frio; foco estético..."
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B38E46]/30"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-600">
                  <input
                    type="checkbox"
                    checked={sendWhatsAppReminder}
                    onChange={(e) => setSendWhatsAppReminder(e.target.checked)}
                    className="mt-0.5 rounded text-[#B38E46] focus:ring-[#B38E46] w-4 h-4"
                  />
                  <span>
                    Receber lembrete pré-consulta gratuito com orientações pelo WhatsApp.
                  </span>
                </label>
              </div>
            </div>

            {/* Mobile / Desktop Summary Card */}
            <div className="bg-[#FAF6EC] p-4 sm:p-6 rounded-xl border border-[#E8DFC9] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="border-b border-[#E8DFC9] pb-3">
                  <span className="text-[10px] uppercase font-semibold text-[#8D6B2C] tracking-wider">
                    Resumo
                  </span>
                  <h4 className="text-base font-semibold text-stone-900 mt-0.5">
                    {selectedService.name}
                  </h4>
                  <p className="text-xs text-stone-600">
                    {selectedService.durationMinutes} min · {selectedService.priceFormatted}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-stone-700">
                    <Calendar className="w-4 h-4 text-[#B38E46] shrink-0" />
                    <div>
                      <span className="font-semibold">{formatFullDate(selectedDate)}</span>
                      <span className="block text-stone-500 font-normal">às {selectedTime} horas</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-stone-700">
                    <Stethoscope className="w-4 h-4 text-[#B38E46] shrink-0" />
                    <div>
                      <span className="font-semibold">{selectedDentist.name}</span>
                      <span className="block text-stone-500 font-normal">{selectedDentist.cro}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-stone-700">
                    <MapPin className="w-4 h-4 text-[#B38E46] shrink-0 mt-0.5" />
                    <span className="text-stone-600 text-[11px] leading-tight">
                      {CLINIC_INFO.address}
                    </span>
                  </div>
                </div>

                <div className="bg-white/80 p-3 rounded-lg border border-[#E8DFC9] text-xs text-stone-600">
                  <p className="font-medium text-stone-800 flex items-center gap-1 mb-0.5">
                    <Info className="w-3.5 h-3.5 text-[#B38E46]" />
                    <span>Instruções pré-consulta:</span>
                  </p>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {selectedService.preparationNote}
                  </p>
                </div>
              </div>

              {/* Desktop Confirm Button */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="w-full py-3 bg-[#B38E46] hover:bg-[#997530] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirmar Agendamento</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Mobile Confirm Button */}
          <div className="md:hidden fixed bottom-16 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-[#E8DFC9] z-30 shadow-lg flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-3 py-2 text-stone-600 text-xs font-semibold min-h-[44px]"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={handleConfirmBooking}
              className="flex-1 py-3 bg-[#B38E46] active:bg-[#997530] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 min-h-[48px]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirmar Consulta</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Sucesso / Confirmação */}
      {step === 5 && createdAppointment && (
        <div className="max-w-2xl mx-auto space-y-5 text-center">
          <div className="w-14 h-14 bg-[#FAF1DF] border border-[#E8DFC9] text-[#B38E46] rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#8D6B2C] font-semibold">
              Agendamento Confirmado!
            </span>
            <h2 className="text-xl sm:text-3xl font-serif text-[#292524] mt-0.5">
              Esperamos por você na Harmony Smile
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Guarde os dados ou adicione diretamente ao calendário do seu celular.
            </p>
          </div>

          {/* Ticket Card */}
          <div className="bg-white border border-[#E8DFC9] rounded-2xl p-4 sm:p-6 text-left shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <p className="text-[10px] text-[#8D6B2C] font-semibold uppercase tracking-wider">
                  Comprovante Digital de Agendamento
                </p>
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                  {createdAppointment.serviceName}
                </h3>
              </div>
              <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded-md border border-emerald-200">
                Confirmado
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-stone-400 font-medium">Paciente</p>
                <p className="text-stone-800 font-semibold">{createdAppointment.patientName}</p>
                <p className="text-stone-500">{createdAppointment.patientPhone}</p>
              </div>

              <div>
                <p className="text-stone-400 font-medium">Dentista</p>
                <p className="text-stone-800 font-semibold">{createdAppointment.dentistName}</p>
                <p className="text-stone-500">{createdAppointment.dentistCro}</p>
              </div>

              <div>
                <p className="text-stone-400 font-medium">Data e Horário</p>
                <p className="text-stone-800 font-semibold">
                  {formatFullDate(createdAppointment.date)}
                </p>
                <p className="text-[#8D6B2C] font-bold text-sm">às {createdAppointment.time}</p>
              </div>

              <div>
                <p className="text-stone-400 font-medium">Local</p>
                <p className="text-stone-800 font-semibold">Harmony Smile Odontologia</p>
                <p className="text-stone-500 text-[11px] leading-tight">{CLINIC_INFO.address}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons for Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <a
              href={generateGoogleCalendarUrl(createdAppointment)}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-3 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 shadow-2xs flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
            >
              <Calendar className="w-4 h-4 text-[#B38E46]" />
              <span>Google Agenda</span>
            </a>

            <a
              href={generateICSDataUri(createdAppointment)}
              download={`HarmonySmile-Consulta-${createdAppointment.date}.ics`}
              className="py-3 px-3 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 shadow-2xs flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
            >
              <Download className="w-4 h-4 text-[#B38E46]" />
              <span>Baixar Calendário .ICS</span>
            </a>

            <a
              href={generateWhatsAppConfirmationUrl(createdAppointment)}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
            >
              <Send className="w-4 h-4" />
              <span>WhatsApp da Clínica</span>
            </a>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (onSuccessNavigate) {
                  onSuccessNavigate();
                } else {
                  setStep(1);
                }
              }}
              className="w-full sm:w-auto px-6 py-3 bg-[#B38E46] text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors min-h-[44px]"
            >
              Ver Meus Agendamentos
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setCreatedAppointment(null);
              }}
              className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors min-h-[44px]"
            >
              Fazer Novo Agendamento
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
