import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Clock, ChevronRight } from 'lucide-react';

interface TreatmentsCatalogProps {
  onSelectServiceToBook: (serviceId: string) => void;
}

export const TreatmentsCatalog: React.FC<TreatmentsCatalogProps> = ({
  onSelectServiceToBook,
}) => {
  const { services } = useClinic();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = services.filter(
    (s) => activeCategory === 'all' || s.category === activeCategory
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 pb-28 md:pb-8">
      <div className="text-left sm:text-center max-w-2xl mx-auto">
        <span className="text-[11px] uppercase tracking-widest text-[#8D6B2C] font-semibold">
          Especialidades
        </span>
        <h2 className="text-xl sm:text-3xl font-serif text-[#292524] mt-0.5">
          Tratamentos Odontológicos & Harmonização
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Protocolos alinhados à estética natural, saúde biológica e conforto.
        </p>
      </div>

      {/* Horizontal Touch Scroll for Categories on Mobile */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x -mx-1 px-1">
        {[
          { id: 'all', label: 'Todos os Procedimentos' },
          { id: 'estetica', label: 'Estética & Harmonização' },
          { id: 'clinica', label: 'Clínica & Prevenção' },
          { id: 'ortodontia', label: 'Ortodontia Digital' },
          { id: 'cirurgia', label: 'Implantes' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 text-xs font-medium rounded-xl whitespace-nowrap min-h-[40px] shrink-0 transition-colors snap-start ${
              activeCategory === cat.id
                ? 'bg-[#B38E46] text-white shadow-2xs font-semibold'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {filtered.map((service) => (
          <div
            key={service.id}
            className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-2xs hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#8D6B2C] uppercase tracking-wider">
                  {service.categoryLabel}
                </span>
                {service.popular && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#FAF1DF] text-[#8D6B2C] font-semibold border border-[#E8DFC9]">
                    Destaque
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-snug">
                {service.name}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed">
                {service.description}
              </p>

              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 text-[11px] text-stone-600 space-y-0.5">
                <p className="font-semibold text-stone-800">Preparo & Orientações:</p>
                <p>{service.preparationNote}</p>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-stone-100 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-stone-500">
                  <Clock className="w-3.5 h-3.5 text-[#B38E46]" />
                  <span>{service.durationMinutes} min</span>
                </div>
                <span className="font-semibold text-stone-900">
                  {service.priceFormatted}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onSelectServiceToBook(service.id)}
                className="w-full py-2.5 bg-[#FAF6EC] hover:bg-[#B38E46] text-[#8D6B2C] hover:text-white border border-[#E8DFC9] hover:border-[#B38E46] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs min-h-[44px]"
              >
                <span>Agendar Este Procedimento</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
