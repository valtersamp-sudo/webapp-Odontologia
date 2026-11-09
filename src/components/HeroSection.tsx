import React from 'react';
import { CLINIC_INFO } from '../data/mockData';
import { Calendar, ChevronRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onStartBooking: () => void;
  onViewMyAppointments: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartBooking,
  onViewMyAppointments,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#FCFAF7] to-[#F7F3EB] border-b border-[#E8DFC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
          {/* Left Text Col */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF1DF] border border-[#E8DFC9] rounded-full text-[11px] sm:text-xs font-semibold text-[#8D6B2C]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Odontologia de Alta Performance & Estética</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#292524] tracking-tight leading-[1.2]">
              A harmonia perfeita entre{' '}
              <span className="italic text-[#8D6B2C]">ciência, precisão</span> e a arte de sorrir com confiança.
            </h1>

            <p className="text-xs sm:text-base text-stone-600 max-w-xl leading-relaxed">
              Bem-vindo à <strong>Harmony Smile</strong>. Agende sua consulta em tempo real, escolha seu dentista de confiança e gerencie seus retornos com total comodidade digital.
            </p>

            {/* CTAs: Full width on mobile for easy thumb tapping */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={onStartBooking}
                className="px-6 py-3.5 sm:py-3 bg-[#B38E46] active:bg-[#997530] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Consulta Online</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onViewMyAppointments}
                className="px-5 py-3 sm:py-3 bg-white active:bg-stone-50 border border-[#E8DFC9] text-stone-800 text-xs sm:text-sm font-semibold rounded-xl shadow-2xs transition-colors flex items-center justify-center min-h-[48px]"
              >
                Gerenciar Meus Horários
              </button>
            </div>

            {/* Proof Points */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-[#E8DFC9]/80 text-xs">
              <div className="bg-white/60 p-2 sm:p-0 rounded-lg sm:bg-transparent">
                <p className="text-lg sm:text-xl font-bold font-mono text-stone-900 tabular-nums">4.98<span className="text-xs font-normal text-stone-400">/5</span></p>
                <p className="text-stone-500 text-[10px] sm:text-xs mt-0.5">+780 avaliações</p>
              </div>
              <div className="bg-white/60 p-2 sm:p-0 rounded-lg sm:bg-transparent">
                <p className="text-lg sm:text-xl font-bold font-mono text-stone-900 tabular-nums">100%</p>
                <p className="text-stone-500 text-[10px] sm:text-xs mt-0.5">Fluxo digital 3D</p>
              </div>
              <div className="bg-white/60 p-2 sm:p-0 rounded-lg sm:bg-transparent">
                <p className="text-lg sm:text-xl font-bold font-mono text-stone-900 tabular-nums">Zero</p>
                <p className="text-stone-500 text-[10px] sm:text-xs mt-0.5">Fila de espera</p>
              </div>
            </div>
          </div>

          {/* Right Visual Image Card */}
          <div className="lg:col-span-5 relative mt-2 sm:mt-0">
            <div className="relative rounded-2xl overflow-hidden border border-[#E8DFC9] shadow-lg group">
              <img
                src={CLINIC_INFO.loungeImg}
                alt="Recepção Harmony Smile"
                className="w-full h-52 sm:h-[380px] object-cover transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                  Ambiente Privativo
                </span>
                <p className="font-serif text-base sm:text-lg font-semibold mt-0.5">
                  Lounge Boutique & Consultórios
                </p>
                <p className="text-[11px] sm:text-xs text-stone-200 mt-0.5">
                  Capão Redondo · São Paulo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
