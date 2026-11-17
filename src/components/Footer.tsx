import React from 'react';
import { Database, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenDbSettings: () => void;
  isDbConnected: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDbSettings, isDbConnected }) => {
  return (
    <footer className="bg-[#241810] text-[#ead8c3] py-12 border-t border-[#412c1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#3b271a] text-xs">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-serif text-lg font-bold">
              <span>🪵</span>
              <span>KarigarSetu</span>
            </div>
            <p className="text-[#c8b29c] leading-relaxed">
              Bridging Saharanpur's 400-year GI-certified woodcraft legacy directly to Indian households.
            </p>
            <div className="text-[11px] text-[#9a8472]">
              GI Application No. 586 · Saharanpur Woodcrafts Guild
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-white">Handcrafted Catalogue</div>
            <ul className="space-y-1.5 text-[#c8b29c]">
              <li><a href="#products" className="hover:text-white transition-colors">Carved Photo Frames</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Brass Inlay Jewellery Boxes</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Pierced Jali Wall Panels</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Hand-Turned Wooden Lamps</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Sheesham Accent Side Tables</a></li>
            </ul>
          </div>

          {/* Craft Guarantee */}
          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-white">Artisan Standards</div>
            <ul className="space-y-1.5 text-[#c8b29c]">
              <li>100% Solid Seasoned Hardwood</li>
              <li>Zero Synthetic Fiberboard or MDF</li>
              <li>Lead-Free Natural Beeswax Polish</li>
              <li>Heavy-Duty Safe Wooden Packaging</li>
              <li>Fair Living Wages for Master Karigars</li>
            </ul>
          </div>

          {/* Data & Developer Tools */}
          <div className="space-y-3">
            <div className="font-bold uppercase tracking-wider text-white">Platform Settings</div>
            <p className="text-[#c8b29c]">
              Manage storage modes, download bookings spreadsheet, or inspect Supabase cloud connectivity.
            </p>
            <button
              onClick={onOpenDbSettings}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#553b28] bg-[#322116] hover:bg-[#3d291b] text-amber-200 transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isDbConnected ? 'Supabase Live Settings' : 'Configure Cloud Database'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9a8472]">
          <div>
            © {new Date().getFullYear()} KarigarSetu · Saharanpur Wooden Crafts & Furniture. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-[#b59f8c]">
            <span>Crafted with reverence for Indian artisans</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
