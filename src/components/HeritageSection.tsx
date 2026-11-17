import React from 'react';
import { Award, Compass, TreePine, HeartHandshake } from 'lucide-react';

export const HeritageSection: React.FC = () => {
  return (
    <section id="craft-heritage" className="py-16 bg-[#faf5ef] border-b border-[#ead8c3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-[#3c543f]">
            Four Centuries of Living Heritage
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-[#2e2118] mt-1.5 text-balance">
            Saharanpur: India's Renowned Woodcraft Capital
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6d6259] leading-relaxed">
            Dating back to the Mughal era in the 17th century, the artisans of Saharanpur in western Uttar Pradesh developed extraordinary techniques in pierced openwork (Jali), relief floral carving, and brass inlay (Tarkashi). Today, this legacy is protected under the Government of India's Geographical Indication (GI) certification.
          </p>
        </div>

        {/* 4 Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#ead8c3] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#f4ecdf] text-[#6b3f25] flex items-center justify-center font-bold">
              <TreePine className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#2e2118]">Kiln-Dried Hardwood</h3>
            <p className="text-xs text-[#6d6259] leading-relaxed">
              We exclusively use ethically harvested, seasoned Indian Rosewood (Sheesham) and Mango wood, kiln-dried to under 10% moisture content to prevent seasonal warping or cracking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#ead8c3] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#f4ecdf] text-[#6b3f25] flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#2e2118]">Tarkashi & Jali Mastery</h3>
            <p className="text-xs text-[#6d6259] leading-relaxed">
              Every curve is hand-chiseled using traditional iron gouges (Rambha and Hathodi). Brass wire patterns are carefully hammered directly into grooves cut into solid wood.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#ead8c3] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#f4ecdf] text-[#6b3f25] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#2e2118]">GI-Tag Protection</h3>
            <p className="text-xs text-[#6d6259] leading-relaxed">
              Saharanpur wooden handicrafts enjoy official Geographical Indication status, certifying that each product originates from authentic regional guilds and workshops.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#ead8c3] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#f4ecdf] text-[#6b3f25] flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#2e2118]">Fair Karigar Wages</h3>
            <p className="text-xs text-[#6d6259] leading-relaxed">
              KarigarSetu connects you directly with the artisan families. Up to 70% of product value goes straight to the carver, ensuring the next generation can continue this historic craft.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
