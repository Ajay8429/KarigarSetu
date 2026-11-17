import React from 'react';
import type { User } from 'firebase/auth';
import { ShoppingBag, Download, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface NavbarProps {
  user: User | null;
  isAdmin: boolean;
  bookingsCount: number;
  onOpenBookings: () => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  isAdmin,
  bookingsCount,
  onOpenBookings,
  onOpenAuth,
  onSignOut
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  return (
    <header className="sticky top-0 z-40 bg-[#fbf6ef]/95 backdrop-blur-md border-b border-[#ead8c3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-[#2e2118] whitespace-nowrap shrink-0 group"
        >
          <span className="w-8 h-8 rounded-lg bg-[#6b3f25] text-amber-200 flex items-center justify-center font-serif text-base shadow-sm group-hover:bg-[#55301a] transition-colors">
            🪵
          </span>
          <span className="font-display tracking-wider text-xl font-bold">
            KarigarSetu
          </span>
        </a>

        {/* Zone 2: 4 concise single-line text links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6d6259]">
          <a
            href="#products"
            className="hover:text-[#6b3f25] transition-colors whitespace-nowrap shrink-0"
          >
            Catalogue
          </a>
          <a
            href="#craft-heritage"
            className="hover:text-[#6b3f25] transition-colors whitespace-nowrap shrink-0"
          >
            Heritage
          </a>
          <a
            href="#artisan-collective"
            className="hover:text-[#6b3f25] transition-colors whitespace-nowrap shrink-0"
          >
            Artisans
          </a>
          <a
            href="#contact"
            className="hover:text-[#6b3f25] transition-colors whitespace-nowrap shrink-0"
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: Auth & Primary Bookings Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {isInstallable && !isInstalled && (
            <button
              onClick={install}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}

          {user ? (
            <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#dfcbb5] bg-white/80 text-xs text-[#2e2118] whitespace-nowrap shrink-0">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-5 h-5 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="w-5 h-5 rounded-full bg-[#6b3f25] text-white text-[10px] font-bold flex items-center justify-center">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </span>
              )}
              <span className="hidden sm:inline font-medium max-w-[110px] truncate">
                {user.displayName || user.email?.split('@')[0]}
              </span>
              {isAdmin && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#3c543f]" title="Store Admin Console Enabled">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Admin</span>
                </span>
              )}
              <button
                onClick={onSignOut}
                className="p-1 text-[#6d6259] hover:text-red-700 transition-colors"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-[#dfcbb5] bg-white hover:bg-[#faf5ef] text-[#2e2118] transition-colors whitespace-nowrap shrink-0"
            >
              <LogIn className="w-3.5 h-3.5 text-[#6b3f25]" />
              <span>Sign In</span>
            </button>
          )}

          <button
            onClick={onOpenBookings}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-[#6b3f25] rounded-lg hover:bg-[#55301a] transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isAdmin ? 'Admin Orders' : 'Bookings'}</span>
            {bookingsCount > 0 && (
              <span className="bg-amber-200 text-[#3b2112] text-xs font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {bookingsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
