import React from 'react';
import { ArrowDown, MessageCircle, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import heroWorkshopImg from '../assets/images/hero_saharanpur_woodcraft_1792925323380.jpg';

interface HeroProps {
  onExploreClick: () => void;
  onWhatsAppInquiry: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onWhatsAppInquiry }) => {
  return (
    <div className="relative border-b border-[#ead8c3] bg-gradient-to-b from-[#f7eee3] to-[#fbf6ef]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial & Conversion */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#3c543f] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#3c543f]"></span>
              <span>Geographical Indication (GI) Protected Craft</span>
              <span className="text-[#a49182]">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Saharanpur, Uttar Pradesh
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2e2118] leading-[1.12] text-balance">
              Bring the living warmth of hand-carved wood into your home.
            </h1>

            <p className="text-base sm:text-lg text-[#6d6259] leading-relaxed max-w-2xl">
              Direct from Saharanpur master woodcarvers to your doorstep. Explore heirloom Sheesham photo frames, brass-inlaid keepsake boxes, delicate Jali wall panels, and bespoke accent tables crafted without middleman markups.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#6b3f25] text-white font-semibold text-sm hover:bg-[#53301a] transition-all shadow-md active:scale-[0.98]"
              >
                <span>Explore Handcrafted Catalogue</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onWhatsAppInquiry}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-[#dfcbb5] text-[#3c543f] font-semibold text-sm hover:bg-[#f3e9dc] transition-all shadow-xs active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>WhatsApp Custom Inquiries</span>
              </button>
            </div>

            <div className="flex items-center gap-5 pt-3 text-xs text-[#7d7168]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#3c543f]" />
                100% Kiln-Dried Solid Hardwood
              </span>
              <span className="text-[#dfcbb5]">|</span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-700" />
                Zero Machine Stamping
              </span>
            </div>
          </div>

          {/* Right Column: High-fidelity Artisanal Workshop Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#ead8c3] shadow-xl bg-[#ead8c3]">
              <img
                src={heroWorkshopImg}
                alt="Master woodcarver carving floral jali hardwood in Saharanpur workshop"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover"
                referrerPolicy="no-referrer"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white p-3 rounded-lg bg-black/40 backdrop-blur-xs text-xs">
                <div className="font-semibold text-amber-200">Ustad Mohammad Rashid at work</div>
                <div className="text-slate-200 text-[11px]">Hand-chiseling floral jali lattice in Sheesham hardwood, Saharanpur</div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-Column KPI Trust Strip */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-[#ead8c3] shadow-xs">
          <div className="px-3 py-2 border-r border-[#f0e4d6] last:border-0">
            <div className="text-xl sm:text-2xl font-bold font-serif text-[#6b3f25] tabular-nums">400+ Yrs</div>
            <div className="text-xs text-[#6d6259] mt-0.5">Saharanpur Carving Legacy</div>
          </div>
          <div className="px-3 py-2 border-r border-[#f0e4d6] last:border-0">
            <div className="text-xl sm:text-2xl font-bold font-serif text-[#6b3f25] tabular-nums">100% Solid</div>
            <div className="text-xs text-[#6d6259] mt-0.5">Seasoned Sheesham & Teak</div>
          </div>
          <div className="px-3 py-2 border-r border-[#f0e4d6] last:border-0">
            <div className="text-xl sm:text-2xl font-bold font-serif text-[#6b3f25] tabular-nums">Direct Price</div>
            <div className="text-xs text-[#6d6259] mt-0.5">Zero Middleman Markup</div>
          </div>
          <div className="px-3 py-2">
            <div className="text-xl sm:text-2xl font-bold font-serif text-[#6b3f25] tabular-nums">Safe Crating</div>
            <div className="text-xs text-[#6d6259] mt-0.5">All-India Damage-Proof Transit</div>
          </div>
        </div>
      </div>
    </div>
  );
};
