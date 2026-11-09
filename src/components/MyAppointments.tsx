import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Appointment } from '../types';
import { CLINIC_INFO } from '../data/mockData';
import {
  formatFriendlyDate,
  formatFullDate,
  generateGoogleCalendarUrl,
  generateWhatsAppConfirmationUrl,
} from '../utils/calendarUtils';
import { RescheduleModal } from './RescheduleModal';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  MapPin,
  RefreshCw,
  Send,
  Stethoscope,
  Trash2,
  X,
} from 'lucide-react';

interface MyAppointmentsProps {
  onNavigateToBooking: () => void;
  onOpenLogin: () => void;
}

export const MyAppointments: React.FC<MyAppointmentsProps> = ({
  onNavigateToBooking,
}) => {
  const { currentUser, appointments, cancelAppointment, services, dentists } = useClinic();
  const [filterTab, setFilterTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('Imprevisto na agenda');
  const [preparationsTarget, setPreparationsTarget] = useState<Appointment | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const userAppointments = appointments.filter((apt) => {
    if (!currentUser) return true;
    if (currentUser.role === 'patient') {
      return apt.patientId === currentUser.id || apt.patientEmail === currentUser.email;
    }
    if (currentUser.role === 'dentist') {
      return apt.dentistName.includes(currentUser.name.replace('Dra. ', '').replace('Dr. ', ''));
    }
    return true;
  });

  const upcomingList = userAppointments.filter(
    (apt) => apt.status === 'confirmed' || apt.status === 'pending'
  );
  const completedList = userAppointments.filter((apt) => apt.status === 'completed');
  const cancelledList = userAppointments.filter((apt) => apt.status === 'cancelled');

  const currentDisplayList =
    filterTab === 'upcoming'
      ? upcomingList
      : filterTab === 'completed'
      ? completedList
      : cancelledList;

  const nextAppointment = upcomingList[0];

  const handleConfirmCancel = () => {
    if (!cancelTarget) return;
    cancelAppointment(cancelTarget.id, cancelReason);
    setCancelTarget(null);
    setSuccessToast('Consulta desmarcada com sucesso.');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 pb-28 md:pb-8">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs flex items-center gap-2 border border-stone-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#8D6B2C] font-semibold">
            Portal do Paciente
          </span>
          <h1 className="text-xl sm:text-3xl font-serif text-[#292524] mt-0.5">
            Meus Agendamentos
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {currentUser ? `Paciente: ${currentUser.name}` : 'Visualizando consultas cadastradas'}
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToBooking}
          className="px-4 py-2.5 bg-[#B38E46] hover:bg-[#997530] text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors self-start sm:self-auto min-h-[44px] flex items-center gap-1.5"
        >
          <Calendar className="w-4 h-4" />
          <span>+ Nova Consulta</span>
        </button>
      </div>

      {/* Immediate Next Appointment Card (Mobile Optimized) */}
      {nextAppointment && (
        <div className="bg-gradient-to-br from-[#FAF4E8] via-[#FDFBF7] to-[#FAF4E8] border border-[#E8DFC9] rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider rounded-md bg-[#B38E46] text-white">
                Próxima Visita
              </span>
              <span className="text-xs font-bold text-[#8D6B2C]">
                {formatFriendlyDate(nextAppointment.date)} às {nextAppointment.time}
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-serif font-bold text-stone-900 leading-snug">
              {nextAppointment.serviceName}
            </h2>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-stone-600">
              <div className="flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-[#B38E46] shrink-0" />
                <span className="font-semibold text-stone-800">{nextAppointment.dentistName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#B38E46] shrink-0" />
                <span>{nextAppointment.durationMinutes} min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#B38E46] shrink-0" />
                <span>Capão Redondo, SP</span>
              </div>
            </div>

            {/* Quick Actions (Grid on mobile for comfortable tap targets) */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 pt-2 border-t border-[#E8DFC9]/60">
              <button
                type="button"
                onClick={() => setRescheduleTarget(nextAppointment)}
                className="py-2.5 px-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#B38E46]" />
                <span>Reagendar</span>
              </button>

              <button
                type="button"
                onClick={() => setPreparationsTarget(nextAppointment)}
                className="py-2.5 px-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <FileText className="w-3.5 h-3.5 text-[#B38E46]" />
                <span>Instruções</span>
              </button>

              <a
                href={generateWhatsAppConfirmationUrl(nextAppointment)}
                target="_blank"
                rel="noreferrer"
                className="col-span-2 sm:col-span-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl overflow-x-auto scrollbar-none snap-x">
        <button
          type="button"
          onClick={() => setFilterTab('upcoming')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap min-h-[40px] shrink-0 ${
            filterTab === 'upcoming'
              ? 'bg-white text-stone-900 shadow-2xs font-semibold'
              : 'text-stone-600'
          }`}
        >
          <span>Agendadas</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FAF1DF] text-[#8D6B2C] font-bold">
            {upcomingList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('completed')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap min-h-[40px] shrink-0 ${
            filterTab === 'completed'
              ? 'bg-white text-stone-900 shadow-2xs font-semibold'
              : 'text-stone-600'
          }`}
        >
          <span>Realizadas</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700 font-bold">
            {completedList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('cancelled')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap min-h-[40px] shrink-0 ${
            filterTab === 'cancelled'
              ? 'bg-white text-stone-900 shadow-2xs font-semibold'
              : 'text-stone-600'
          }`}
        >
          <span>Canceladas</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700 font-bold">
            {cancelledList.length}
          </span>
        </button>
      </div>

      {/* List */}
      {currentDisplayList.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-8 sm:p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-stone-800">
              Nenhuma consulta encontrada
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              {filterTab === 'upcoming'
                ? 'Você não possui consultas agendadas no momento.'
                : 'Não há registros nesta categoria.'}
            </p>
          </div>
          {filterTab === 'upcoming' && (
            <button
              type="button"
              onClick={onNavigateToBooking}
              className="px-5 py-2.5 bg-[#B38E46] text-white text-xs font-semibold rounded-xl min-h-[44px]"
            >
              Agendar Primeira Consulta
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {currentDisplayList.map((apt) => {
            const statusConfig = {
              confirmed: {
                label: 'Confirmada',
                bg: 'bg-emerald-50',
                text: 'text-emerald-700',
                border: 'border-emerald-200',
              },
              pending: {
                label: 'Pendente',
                bg: 'bg-amber-50',
                text: 'text-amber-700',
                border: 'border-amber-200',
              },
              completed: {
                label: 'Realizada',
                bg: 'bg-stone-100',
                text: 'text-stone-700',
                border: 'border-stone-200',
              },
              cancelled: {
                label: 'Cancelada',
                bg: 'bg-red-50',
                text: 'text-red-700',
                border: 'border-red-200',
              },
            }[apt.status];

            const dentistData = dentists.find((d) => d.id === apt.dentistId);

            return (
              <div
                key={apt.id}
                className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-2xs hover:border-[#D4AF37]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                    >
                      {statusConfig.label}
                    </span>
                    <span className="text-xs text-stone-400">·</span>
                    <span className="text-xs text-[#8D6B2C] font-medium">
                      {apt.categoryLabel}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-snug">
                      {apt.serviceName}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {formatFullDate(apt.date)} às <span className="font-bold text-stone-800">{apt.time}</span> ({apt.durationMinutes} min)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    {dentistData?.avatar && (
                      <img
                        src={dentistData.avatar}
                        alt={apt.dentistName}
                        className="w-6 h-6 rounded-full object-cover border border-stone-200"
                      />
                    )}
                    <span className="font-medium text-stone-800">{apt.dentistName}</span>
                    <span className="text-stone-400">({apt.dentistCro})</span>
                  </div>

                  {apt.notes && (
                    <p className="text-xs text-stone-500 bg-stone-50 p-2 rounded-lg border border-stone-100 italic">
                      &quot;{apt.notes}&quot;
                    </p>
                  )}
                </div>

                {/* Mobile Touch Action Buttons (2-column grid on mobile) */}
                <div className="grid grid-cols-2 md:flex md:flex-col gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                  {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setRescheduleTarget(apt)}
                        className="py-2.5 px-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[#B38E46]" />
                        <span>Reagendar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPreparationsTarget(apt)}
                        className="py-2.5 px-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <Info className="w-3.5 h-3.5 text-[#B38E46]" />
                        <span>Orientações</span>
                      </button>

                      <a
                        href={generateGoogleCalendarUrl(apt)}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#B38E46]" />
                        <span>Calendário</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setCancelTarget(apt)}
                        className="py-2.5 px-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancelar</span>
                      </button>
                    </>
                  )}

                  {apt.status === 'completed' && (
                    <button
                      type="button"
                      onClick={onNavigateToBooking}
                      className="col-span-2 py-2.5 px-4 bg-[#B38E46] text-white text-xs font-semibold rounded-xl transition-colors min-h-[44px]"
                    >
                      Agendar Nova Sessão
                    </button>
                  )}

                  {apt.status === 'cancelled' && (
                    <button
                      type="button"
                      onClick={onNavigateToBooking}
                      className="col-span-2 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-xl transition-colors min-h-[44px]"
                    >
                      Reagendar Horário
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reschedule Modal */}
      <RescheduleModal
        appointment={rescheduleTarget}
        isOpen={!!rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
        onSuccess={() => {
          setSuccessToast('Consulta reagendada com sucesso!');
          setTimeout(() => setSuccessToast(null), 3000);
        }}
      />

      {/* Cancel Modal (Bottom Sheet on mobile) */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white border-t sm:border border-stone-200 rounded-t-3xl sm:rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl pb-[env(safe-area-inset-bottom,24px)]">
            <div className="sm:hidden w-12 h-1.5 bg-stone-300 rounded-full mx-auto -mt-2 mb-2" />

            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-stone-900">
                Deseja cancelar esta consulta?
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Consulta de <strong>{cancelTarget.serviceName}</strong> em {formatFullDate(cancelTarget.date)} às {cancelTarget.time}.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Motivo do cancelamento:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none min-h-[44px]"
              >
                <option value="Imprevisto profissional">Imprevisto profissional / trabalho</option>
                <option value="Problema de saúde ou indisposição">Problema de saúde ou indisposição</option>
                <option value="Gostaria de reagendar para outro dia">Gostaria de reagendar para outro dia</option>
                <option value="Outro motivo">Outro motivo</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-800 min-h-[44px]"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors min-h-[44px]"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preparations Modal (Bottom Sheet on mobile) */}
      {preparationsTarget && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white border-t sm:border border-[#E8DFC9] rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto pb-[env(safe-area-inset-bottom,24px)]">
            <div className="sm:hidden w-12 h-1.5 bg-stone-300 rounded-full mx-auto -mt-2 mb-2" />

            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-[#8D6B2C]">
                <FileText className="w-5 h-5" />
                <h3 className="text-sm font-bold text-stone-900">
                  Instruções Pré-Consulta
                </h3>
              </div>
              <button
                onClick={() => setPreparationsTarget(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
              <div className="p-3 bg-[#FAF6EC] border border-[#E8DFC9] rounded-xl">
                <p className="font-semibold text-stone-900 mb-1">
                  Procedimento: {preparationsTarget.serviceName}
                </p>
                <p className="text-stone-700">
                  {services.find((s) => s.id === preparationsTarget.serviceId)?.preparationNote ||
                    'Chegar com 10 minutos de antecedência para preenchimento de anamnese digital.'}
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="font-semibold text-stone-800">Recomendações da Harmony Smile:</p>
                <ul className="list-disc list-inside space-y-1 text-stone-600">
                  <li>Traga documento de identificação com foto.</li>
                  <li>Realize higienização bucal prévia habitual.</li>
                  <li>Dispomos de serviço de manobrista gratuito no local.</li>
                  <li>Em caso de imprevisto, você pode reagendar pelo próprio app.</li>
                </ul>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-[11px] text-stone-500">
                Endereço: {CLINIC_INFO.address} · Tel: {CLINIC_INFO.phone}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setPreparationsTarget(null)}
                className="w-full py-3 bg-[#B38E46] text-white text-xs font-semibold rounded-xl shadow-2xs min-h-[44px]"
              >
                Entendi, Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
