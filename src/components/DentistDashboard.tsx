import React, { useState, useMemo } from 'react';
import { useClinic } from '../context/ClinicContext';
import { DAILY_TIME_SLOTS, getRelativeDateString } from '../data/mockData';
import { formatFriendlyDate, formatFullDate } from '../utils/calendarUtils';
import {
  Ban,
  Check,
  Clock,
  Filter,
  Trash2,
  X,
} from 'lucide-react';

export const DentistDashboard: React.FC = () => {
  const {
    dentists,
    appointments,
    blockedSlots,
    blockSlot,
    unblockSlot,
    updateAppointmentStatus,
  } = useClinic();

  const [selectedDentistFilter, setSelectedDentistFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(() => getRelativeDateString(1)); // Tomorrow
  const [showBlockModal, setShowBlockModal] = useState(false);

  const [blockDentistId, setBlockDentistId] = useState(dentists[0]?.id || '');
  const [blockTime, setBlockTime] = useState('12:00');
  const [blockReason, setBlockReason] = useState('Intervalo de Almoço');

  const dateOptions = useMemo(() => {
    const list = [];
    for (let i = 0; i < 10; i++) {
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
          isToday: i === 0,
        });
      }
    }
    return list;
  }, []);

  const dayAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesDate = apt.date === selectedDate;
      const matchesDentist =
        selectedDentistFilter === 'all' || apt.dentistId === selectedDentistFilter;
      return matchesDate && matchesDentist && apt.status !== 'cancelled';
    });
  }, [appointments, selectedDate, selectedDentistFilter]);

  const dayBlockedSlots = useMemo(() => {
    return blockedSlots.filter((b) => {
      const matchesDate = b.date === selectedDate;
      const matchesDentist =
        selectedDentistFilter === 'all' || b.dentistId === selectedDentistFilter;
      return matchesDate && matchesDentist;
    });
  }, [blockedSlots, selectedDate, selectedDentistFilter]);

  const totalOccupied = dayAppointments.length;
  const confirmedCount = dayAppointments.filter((a) => a.status === 'confirmed').length;
  const pendingCount = dayAppointments.filter((a) => a.status === 'pending').length;
  const totalSlotsCount = DAILY_TIME_SLOTS.length * (selectedDentistFilter === 'all' ? dentists.length : 1);
  const occupancyRate = Math.min(100, Math.round(((totalOccupied + dayBlockedSlots.length) / totalSlotsCount) * 100));

  const handleSaveBlock = (e: React.FormEvent) => {
    e.preventDefault();
    blockSlot(blockDentistId, selectedDate, blockTime, blockReason);
    setShowBlockModal(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 pb-28 md:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest text-[#8D6B2C] font-semibold">
              Painel Profissional
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500">Gestão de Consultórios</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-serif text-[#292524] mt-0.5">
            Agenda dos Consultórios
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Visualize consultas e bloqueie horários em tempo real.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowBlockModal(true)}
          className="px-3.5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto min-h-[44px]"
        >
          <Ban className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Bloquear Horário / Almoço</span>
        </button>
      </div>

      {/* KPI Metrics: 2x2 on mobile, 4-col on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 bg-white border border-stone-200 rounded-xl shadow-2xs">
          <p className="text-[11px] sm:text-xs text-stone-500 font-medium">Pacientes no Dia</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-stone-900">
              {totalOccupied}
            </span>
            <span className="text-[10px] text-stone-400">agendados</span>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-white border border-stone-200 rounded-xl shadow-2xs">
          <p className="text-[11px] sm:text-xs text-stone-500 font-medium">Confirmados</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-600">
              {confirmedCount}
            </span>
            <span className="text-[10px] text-emerald-600/70">prontos</span>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-white border border-stone-200 rounded-xl shadow-2xs">
          <p className="text-[11px] sm:text-xs text-stone-500 font-medium">Pendentes</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-amber-600">
              {pendingCount}
            </span>
            <span className="text-[10px] text-amber-600/70">aguardando</span>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-white border border-stone-200 rounded-xl shadow-2xs">
          <p className="text-[11px] sm:text-xs text-stone-500 font-medium">Ocupação</p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#8D6B2C]">
              {occupancyRate}%
            </span>
            <span className="text-[10px] text-stone-400">capacidade</span>
          </div>
        </div>
      </div>

      {/* Date Bar & Dentist Filter */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={selectedDentistFilter}
              onChange={(e) => setSelectedDentistFilter(e.target.value)}
              className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 font-medium text-stone-800 focus:outline-none min-h-[40px] w-full sm:w-auto"
            >
              <option value="all">Todos os Profissionais</option>
              {dentists.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.cro})
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Data: <span className="text-stone-900 font-semibold">{formatFullDate(selectedDate)}</span>
          </div>
        </div>

        {/* Date Selector Strip (Touch Scrollable) */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x -mx-1 px-1">
          {dateOptions.map((opt) => {
            const isSelected = selectedDate === opt.dateStr;
            return (
              <button
                key={opt.dateStr}
                type="button"
                onClick={() => setSelectedDate(opt.dateStr)}
                className={`flex flex-col items-center justify-center min-w-[66px] sm:min-w-[76px] py-2 px-2 rounded-xl border text-center transition-all snap-start min-h-[60px] active:scale-95 ${
                  isSelected
                    ? 'border-[#B38E46] bg-[#B38E46] text-white shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-[#FAF6EC] text-stone-800'
                }`}
              >
                <span className={`text-[10px] uppercase font-semibold ${isSelected ? 'text-[#FAF1DF]' : 'text-stone-500'}`}>
                  {opt.dayName}
                </span>
                <span className="text-base sm:text-lg font-bold my-0.2">{opt.dayNumber}</span>
                <span className={`text-[9px] ${isSelected ? 'text-white/90' : 'text-stone-400'}`}>
                  {opt.isTomorrow ? 'Amanhã' : opt.isToday ? 'Hoje' : opt.monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline Schedule View */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-3 sm:p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#B38E46]" />
            <h3 className="text-xs sm:text-sm font-bold text-stone-900">
              Grade Horária — {formatFriendlyDate(selectedDate)}
            </h3>
          </div>
          <span className="text-[11px] sm:text-xs text-stone-500 font-medium">
            {dayAppointments.length} consultas
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {DAILY_TIME_SLOTS.map((time) => {
            const aptsInSlot = dayAppointments.filter((a) => a.time === time);
            const blocksInSlot = dayBlockedSlots.filter((b) => b.time === time);
            const isFree = aptsInSlot.length === 0 && blocksInSlot.length === 0;

            return (
              <div
                key={time}
                className={`p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 transition-colors ${
                  !isFree ? 'bg-[#FCFAF7]' : 'hover:bg-stone-50/60'
                }`}
              >
                {/* Time Indicator */}
                <div className="flex items-center gap-3 sm:w-28 shrink-0">
                  <span className="font-mono text-sm font-bold text-stone-800 tabular-nums">
                    {time}
                  </span>
                  {isFree && (
                    <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                      Livre
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  {aptsInSlot.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3 bg-white border border-[#E8DFC9] rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-stone-900">
                            {apt.patientName}
                          </span>
                          <span className="text-xs text-stone-400">·</span>
                          <span className="text-xs text-stone-500">{apt.patientPhone}</span>
                        </div>

                        <div className="text-xs text-[#8D6B2C] font-medium mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span>{apt.serviceName}</span>
                          <span className="text-stone-300">|</span>
                          <span className="text-stone-600">{apt.dentistName}</span>
                        </div>

                        {apt.notes && (
                          <p className="text-[11px] text-stone-500 mt-1 italic">
                            Obs: {apt.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                        {apt.status === 'confirmed' ? (
                          <span className="text-[11px] px-2 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-md border border-emerald-200">
                            Confirmada
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                            className="px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors flex items-center gap-1 min-h-[36px]"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirmar</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                          className="px-2.5 py-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-lg transition-colors min-h-[36px]"
                        >
                          Concluir
                        </button>
                      </div>
                    </div>
                  ))}

                  {blocksInSlot.map((block) => (
                    <div
                      key={block.id}
                      className="p-2.5 bg-stone-100 border border-stone-200 rounded-lg text-xs flex items-center justify-between text-stone-600 mb-1"
                    >
                      <div className="flex items-center gap-2">
                        <Ban className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-semibold text-stone-700">Bloqueado:</span>
                        <span>{block.reason}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => unblockSlot(block.id)}
                        className="text-stone-400 hover:text-red-600 p-2 rounded min-h-[36px] min-w-[36px] flex items-center justify-center"
                        title="Desbloquear"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {isFree && (
                    <span className="text-xs text-stone-400 italic">
                      Disponível para agendamento online
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Block Slot Modal (Bottom Sheet on mobile) */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
          <form
            onSubmit={handleSaveBlock}
            className="bg-white border-t sm:border border-[#E8DFC9] rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-xl pb-[env(safe-area-inset-bottom,20px)]"
          >
            <div className="sm:hidden w-12 h-1.5 bg-stone-300 rounded-full mx-auto -mt-1 mb-2" />

            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Ban className="w-4 h-4 text-[#B38E46]" />
                <span>Bloquear Horário na Grade</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Profissional:
              </label>
              <select
                value={blockDentistId}
                onChange={(e) => setBlockDentistId(e.target.value)}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none min-h-[44px]"
              >
                {dentists.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.cro})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Data:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Horário:</label>
                <select
                  value={blockTime}
                  onChange={(e) => setBlockTime(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl min-h-[44px]"
                >
                  {DAILY_TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Motivo:
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Intervalo de Almoço, Reunião de Casos..."
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl min-h-[44px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="px-4 py-2.5 text-xs font-medium text-stone-600 min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-xl shadow-2xs min-h-[44px]"
              >
                Salvar Bloqueio
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
