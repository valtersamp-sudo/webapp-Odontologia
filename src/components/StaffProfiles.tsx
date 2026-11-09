import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { Calendar, Star } from 'lucide-react';

interface StaffProfilesProps {
  onSelectDentistToBook: (dentistId: string) => void;
}

export const StaffProfiles: React.FC<StaffProfilesProps> = ({
  onSelectDentistToBook,
}) => {
  const { dentists } = useClinic();

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 pb-28 md:pb-8">
      <div className="text-left sm:text-center max-w-2xl mx-auto">
        <span className="text-[11px] uppercase tracking-widest text-[#8D6B2C] font-semibold">
          Excelência Técnica
        </span>
        <h2 className="text-xl sm:text-3xl font-serif text-[#292524] mt-0.5">
          Corpo Clínico Harmony Smile
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Dentistas especialistas dedicados à odontologia estética, biológica e precisão digital.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
        {dentists.map((dentist) => (
          <div
            key={dentist.id}
            className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-56 sm:h-64 overflow-hidden bg-stone-100">
                <img
                  src={dentist.avatar}
                  alt={dentist.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-semibold text-stone-800 flex items-center gap-1 shadow-2xs">
                  <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  <span>{dentist.rating}</span>
                  <span className="text-stone-400 font-normal">({dentist.reviewsCount})</span>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-3">
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                    {dentist.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#8D6B2C]">
                    {dentist.cro}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5 font-medium">
                    {dentist.title}
                  </p>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {dentist.bio}
                </p>

                <div className="pt-1">
                  <p className="text-[10px] font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Especialidades:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {dentist.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 pt-0">
              <button
                type="button"
                onClick={() => onSelectDentistToBook(dentist.id)}
                className="w-full py-3 bg-[#B38E46] active:bg-[#997530] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-2xs min-h-[44px]"
              >
                <Calendar className="w-4 h-4" />
                <span>Ver Horários com {dentist.name.split(' ')[0]} {dentist.name.split(' ')[1]}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
