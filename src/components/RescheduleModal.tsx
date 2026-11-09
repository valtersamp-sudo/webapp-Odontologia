import React, { useState, useMemo } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Appointment } from '../types';
import { formatFriendlyDate, formatFullDate } from '../utils/calendarUtils';
import { getRelativeDateString } from '../data/mockData';
import { Check, X } from 'lucide-react';

interface RescheduleModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { rescheduleAppointment, getAvailableSlots } = useClinic();

  const [newDate, setNewDate] = useState<string>(() => appointment?.date || getRelativeDateString(2));
  const [newTime, setNewTime] = useState<string>(() => appointment?.time || '10:00');

  const dateOptions = useMemo(() => {
    const list = [];
    for (let i = 1; i <= 14; i++) {
      const dateStr = getRelativeDateString(i);
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      if (d.getDay() !== 0) {
        list.push({
          dateStr,
          dayNumber: day,
          dayName: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
          monthName: d.toLocaleDateString('pt-BR', { month: 'short' }),
          isTomorrow: i === 1,
        });
      }
    }
    return list;
  }, []);

  const timeSlots = useMemo(() => {
    if (!appointment || !newDate) return [];
    return getAvailableSlots(appointment.dentistId, newDate);
  }, [appointment, newDate, getAvailableSlots]);

  if (!isOpen || !appointment) return null;

  const handleConfirmReschedule = () => {
    if (!newDate || !newTime) return;
    rescheduleAppointment(appointment.id, newDate, newTime);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white border-t sm:border border-[#E8DFC9] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden pb-[env(safe-area-inset-bottom,16px)]">
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-stone-300 rounded-full mx-auto mt-2.5 mb-1" />

        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-[#FAF4E8] to-[#FCFAF7] border-b border-[#E8DFC9] flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#8D6B2C]">
              Reagendamento
            </span>
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
              {appointment.serviceName}
            </h3>
            <p className="text-xs text-stone-500">
              {appointment.dentistName} ({appointment.dentistCro})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Current schedule info */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex items-center justify-between">
            <span className="text-stone-500">Agendamento Atual:</span>
            <span className="font-semibold text-stone-800">
              {formatFullDate(appointment.date)} às {appointment.time}
            </span>
          </div>

          {/* Date Picker Strip */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              1. Escolha a Nova Data
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x -mx-1 px-1">
              {dateOptions.map((opt) => {
                const isSelected = newDate === opt.dateStr;
                return (
                  <button
                    key={opt.dateStr}
                    type="button"
                    onClick={() => setNewDate(opt.dateStr)}
                    className={`flex flex-col items-center justify-center min-w-[66px] sm:min-w-[70px] py-2.5 px-2 rounded-xl border text-center transition-all snap-start min-h-[64px] active:scale-95 ${
                      isSelected
                        ? 'border-[#B38E46] bg-[#B38E46] text-white shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-[#FAF6EC] text-stone-800'
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-semibold ${isSelected ? 'text-[#FAF1DF]' : 'text-stone-500'}`}>
                      {opt.dayName}
                    </span>
                    <span className="text-lg font-bold my-0.5">{opt.dayNumber}</span>
                    <span className={`text-[9px] ${isSelected ? 'text-white/90' : 'text-stone-400'}`}>
                      {opt.isTomorrow ? 'Amanhã' : opt.monthName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              2. Horários Disponíveis para {formatFriendlyDate(newDate)}
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map((slot) => {
                const isSelected = newTime === slot.time && slot.available;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setNewTime(slot.time)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-medium border text-center transition-all min-h-[44px] flex items-center justify-center active:scale-95 ${
                      !slot.available
                        ? 'border-stone-200 bg-stone-100 text-stone-300 cursor-not-allowed opacity-50'
                        : isSelected
                        ? 'border-[#B38E46] bg-[#FAF6EC] text-[#8D6B2C] ring-2 ring-[#B38E46] font-bold'
                        : 'border-stone-200 bg-white hover:border-[#D4AF37] text-stone-800'
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 min-h-[44px]"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={!newDate || !newTime}
            onClick={handleConfirmReschedule}
            className="px-5 py-2.5 bg-[#B38E46] active:bg-[#997530] text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 min-h-[44px] disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>Confirmar Novo Horário</span>
          </button>
        </div>
      </div>
    </div>
  );
};
