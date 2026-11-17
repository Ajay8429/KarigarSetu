import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto z-50 flex items-center gap-2.5 rounded-xl bg-[#2e2118] text-[#fbf6ef] px-4 py-3 text-xs font-medium shadow-xl border border-[#ead8c3]">
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
      <span>
        Offline Mode — You can still browse cached wooden crafts and review saved bookings.
      </span>
    </div>
  );
};
