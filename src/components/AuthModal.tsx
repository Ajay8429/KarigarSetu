import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, ADMIN_EMAILS } from '../firebase';
import { X, AlertCircle, Shield, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextHint?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, contextHint }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  if (!isOpen) return null;

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorCode(null);
    setErrorMsg(null);

    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      const rawMessage = err instanceof Error ? err.message : String(err);
      setErrorCode(code);

      if (code === 'auth/unauthorized-domain') {
        setErrorMsg(
          `This domain ("${currentDomain}") is not yet allowlisted in Firebase Authentication Authorized Domains.`
        );
      } else if (code === 'auth/popup-blocked') {
        setErrorMsg(
          'Your browser blocked the Google Sign-In popup. Please allow popups for this site and click Continue with Google again.'
        );
      } else if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setErrorMsg('Sign-in popup was closed before completing. Click Continue with Google whenever you are ready.');
      } else if (code === 'auth/network-request-failed') {
        setErrorMsg('Network connection error while contacting Google Sign-In. Please check your internet connection.');
      } else {
        setErrorMsg(rawMessage || 'Unable to sign in right now. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyDomain = () => {
    if (!currentDomain) return;
    navigator.clipboard.writeText(currentDomain);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#ead8c3] overflow-hidden my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#6d6259] hover:text-[#2e2118] hover:bg-[#f4ecdf] transition-colors"
          aria-label="Close sign in dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Brand Emblem */}
          <div className="text-center space-y-2.5">
            <div className="w-12 h-12 rounded-xl bg-[#2e2118] text-amber-300 flex items-center justify-center mx-auto shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-[#2e2118]">
              Welcome to KarigarSetu
            </h2>
            <p className="text-xs sm:text-sm text-[#6d6259] leading-relaxed max-w-xs mx-auto">
              {contextHint ||
                'Sign in with Google to sync your bookings across devices, save your wishlist, and post verified reviews.'}
            </p>
          </div>

          {/* Actionable Error Feedback */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{errorMsg}</span>
              </div>

              {errorCode === 'auth/unauthorized-domain' && currentDomain && (
                <div className="pt-2 border-t border-red-200/80 space-y-2 text-[11px] text-red-800">
                  <div className="font-semibold">How Store Owner can fix this in 30 seconds:</div>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Open Firebase Console → Authentication → Settings → Authorized domains</li>
                    <li>Add this exact hostname:</li>
                  </ol>
                  <div className="flex items-center justify-between gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-red-200 font-mono text-[11px] text-[#2e2118]">
                    <span className="truncate">{currentDomain}</span>
                    <button
                      type="button"
                      onClick={handleCopyDomain}
                      className="inline-flex items-center gap-1 text-[#6b3f25] font-sans font-semibold shrink-0 hover:underline"
                    >
                      {copiedDomain ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedDomain ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <a
                    href="https://console.firebase.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-red-900 underline"
                  >
                    <span>Open Firebase Console</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Primary Google Sign-In Button */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-white border-2 border-[#dfcbb5] hover:border-[#6b3f25] hover:bg-[#fbf6ef] text-[#2e2118] font-semibold text-sm transition-all shadow-xs active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {/* Crisp inline Google G SVG */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                />
              </svg>
              <span className="text-[#2e2118]">
                {isLoading ? 'Connecting to Google…' : 'Continue with Google'}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2e2118] text-white text-xs font-semibold hover:bg-[#422e21] transition-colors cursor-pointer"
            >
              Continue Browsing as Guest
            </button>
          </div>

          {/* Store Admin Notice */}
          <div className="pt-4 border-t border-[#f0e4d6] flex items-start gap-2.5 text-[11px] text-[#7d7168] leading-relaxed">
            <Shield className="w-4 h-4 text-[#8c5835] shrink-0 mt-0.5" />
            <span>
              Store Admin Console is reserved for{' '}
              <span className="font-semibold text-[#2e2118]">{ADMIN_EMAILS[0]}</span> via Google Sign-In.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
