import React from 'react';
import { CLINIC_INFO } from '../data/mockData';
import { Calendar, Clock, Compass, MapPin, Phone, Send, ShieldCheck, Sparkles } from 'lucide-react';

interface ClinicAboutProps {
  onStartBooking: () => void;
}

export const ClinicAbout: React.FC<ClinicAboutProps> = ({ onStartBooking }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12 pb-28 md:pb-8">
      {/* Header */}
      <div className="text-left sm:text-center max-w-2xl mx-auto">
        <span className="text-[11px] uppercase tracking-widest text-[#8D6B2C] font-semibold">
          Conheça a Nossa Estrutura
        </span>
        <h2 className="text-xl sm:text-3xl font-serif text-[#292524] mt-0.5">
          Harmony Smile Odontologia
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Espaço concebido para acolhimento, alta tecnologia e máxima privacidade.
        </p>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="rounded-2xl overflow-hidden border border-[#E8DFC9] shadow-xs group relative">
          <img
            src={CLINIC_INFO.loungeImg}
            alt="Lounge de Espera Harmony Smile"
            className="w-full h-56 sm:h-80 object-cover"
          />
          <div className="p-4 bg-white border-t border-stone-100">
            <h3 className="text-sm font-bold text-stone-900 font-serif">
              Lounge & Recepção Acolhedora
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Ambiente privativo com isolamento acústico, cafeteria e recepção dedicada.
            </p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-[#E8DFC9] shadow-xs group relative">
          <img
            src={CLINIC_INFO.treatmentRoomImg}
            alt="Consultório Clínico Harmony Smile"
            className="w-full h-56 sm:h-80 object-cover"
          />
          <div className="p-4 bg-white border-t border-stone-100">
            <h3 className="text-sm font-bold text-stone-900 font-serif">
              Suíte Clínica de Alta Tecnologia
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Equipamentos ergonômicos, fluxo digital iTero 3D e esterilização hospitalar.
            </p>
          </div>
        </div>
      </div>

      {/* Differentiators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
        <div className="p-4 sm:p-6 bg-white border border-stone-200 rounded-xl space-y-1.5">
          <div className="w-9 h-9 rounded-lg bg-[#FAF1DF] text-[#8D6B2C] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-stone-900 font-serif">
            Fluxo 100% Digital & 3D
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Eliminamos moldagens desconfortáveis com escaneamento intraoral de alta precisão.
          </p>
        </div>

        <div className="p-4 sm:p-6 bg-white border border-stone-200 rounded-xl space-y-1.5">
          <div className="w-9 h-9 rounded-lg bg-[#FAF1DF] text-[#8D6B2C] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-stone-900 font-serif">
            Pontualidade Rigorosa
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Atendimento com hora marcada e intervalo estendido entre pacientes.
          </p>
        </div>

        <div className="p-4 sm:p-6 bg-white border border-stone-200 rounded-xl space-y-1.5">
          <div className="w-9 h-9 rounded-lg bg-[#FAF1DF] text-[#8D6B2C] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-stone-900 font-serif">
            Autonomia no Celular
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Agende, reagende e consulte preparos pelo seu smartphone a qualquer hora.
          </p>
        </div>
      </div>

      {/* Location & Contacts */}
      <div className="bg-[#FAF6EC] border border-[#E8DFC9] rounded-2xl p-5 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-widest text-[#8D6B2C] font-semibold">
                Localização & Contato
              </span>
              <span className="text-xs text-stone-400">·</span>
              <span className="text-[11px] font-medium text-stone-500">
                CNES: {CLINIC_INFO.cnes}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Capão Redondo · São Paulo
            </h3>

            <div className="space-y-2 text-xs text-stone-700">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#B38E46] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{CLINIC_INFO.address}</p>
                  <p className="text-stone-500">{CLINIC_INFO.parking}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B38E46] shrink-0" />
                <span>{CLINIC_INFO.hours}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B38E46] shrink-0" />
                <span>
                  Telefone Oficial:{' '}
                  <a href={`tel:${CLINIC_INFO.phoneClean || '+551158741121'}`} className="font-bold text-[#8D6B2C] hover:underline">
                    {CLINIC_INFO.phone}
                  </a>{' '}
                  ({CLINIC_INFO.phoneFormatted})
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <a
                href={`https://wa.me/${CLINIC_INFO.whatsappClean}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 bg-emerald-600 active:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-colors min-h-[44px]"
              >
                <Send className="w-4 h-4" />
                <span>Falar no WhatsApp ({CLINIC_INFO.phone})</span>
              </a>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLINIC_INFO.address)}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 bg-white active:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-colors min-h-[44px]"
              >
                <Compass className="w-4 h-4 text-[#B38E46]" />
                <span>Abrir no Google Maps</span>
              </a>
            </div>
          </div>

          <div className="text-center p-5 sm:p-6 bg-white rounded-xl border border-[#E8DFC9] space-y-3">
            <img
              src={CLINIC_INFO.logoUrl}
              alt="Harmony Smile"
              className="h-12 sm:h-16 mx-auto object-contain"
            />
            <p className="text-xs text-stone-600">
              Agende sua consulta diretamente pelo smartphone em tempo real.
            </p>
            <button
              type="button"
              onClick={onStartBooking}
              className="w-full py-3.5 bg-[#B38E46] active:bg-[#997530] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Minha Consulta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
