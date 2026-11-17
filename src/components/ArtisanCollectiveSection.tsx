import React from 'react';
import { MapPin, Award } from 'lucide-react';

export const ArtisanCollectiveSection: React.FC = () => {
  const artisans = [
    {
      name: 'Ustad Mohammad Rashid',
      specialty: 'Master Floral Relief & Box Carving',
      experience: '34 Years Experience',
      location: 'Mohalla Saraian, Saharanpur',
      story: 'Inherited the art of carving Sheesham wood memory chests from his grandfather. His floral relief carvings are finished with pure beeswax.'
    },
    {
      name: 'Ustad Irfan Ansari',
      specialty: 'Tarkashi (Brass Wire Inlay)',
      experience: '28 Years Experience',
      location: 'Qutub Sher, Saharanpur',
      story: 'Specializes in the rare Tarkashi technique where paper-thin pure brass wires are hammered directly into microscopic grooves cut into hardwood.'
    },
    {
      name: 'Master Abdul Sattar',
      specialty: 'Pierced Jali Lattice Screens',
      experience: '40 Years Experience',
      location: 'Chilkana Road, Saharanpur',
      story: 'Known across Uttar Pradesh for sacred geometric Jali screens that filter ambient light into breathtaking architectural shadows.'
    },
    {
      name: 'Rameshwar Sharma & Sons',
      specialty: 'Handcrafted Furniture & Tables',
      experience: '3rd Generation Workshop',
      location: 'Pansari Bazar, Saharanpur',
      story: 'Master craftsmen of solid Sheesham accent tables, utilizing traditional mortise and tenon joinery that outlasts decades of daily use.'
    }
  ];

  return (
    <section id="artisan-collective" className="py-16 bg-[#fbf6ef] border-b border-[#ead8c3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-[#3c543f]">
            The Hands Behind The Wood
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-[#2e2118] mt-1.5">
            Meet the Saharanpur Master Karigars
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6d6259] leading-relaxed">
            Every product on KarigarSetu is attributed directly to the master carver whose workshop crafted it. When you purchase, you are not buying industrial factory goods—you are preserving a generational craft.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {artisans.map((a, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white border border-[#ead8c3] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#6b3f25] text-amber-200 flex items-center justify-center font-serif text-lg font-bold shadow-xs">
                  {a.name.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2e2118]">{a.name}</h3>
                  <div className="text-xs font-semibold text-[#8c5835] mt-0.5">{a.specialty}</div>
                  <div className="text-[11px] text-[#7d7168] flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-[#3c543f]" />
                    <span>{a.location}</span>
                  </div>
                </div>
                <p className="text-xs text-[#6d6259] leading-relaxed pt-1 border-t border-[#f4ecdf]">
                  {a.story}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#3c543f]">
                <Award className="w-3.5 h-3.5" />
                <span>{a.experience}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
