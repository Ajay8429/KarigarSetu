import React, { useState } from 'react';
import { SupabaseConfig } from '../types';
import { X, Database, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, Code } from 'lucide-react';

interface DatabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SupabaseConfig;
  onSaveConfig: (config: SupabaseConfig) => void;
}

export const DatabaseSettingsModal: React.FC<DatabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [url, setUrl] = useState(config.url);
  const [anonKey, setAnonKey] = useState(config.anonKey);
  const [testStatus, setTestStatus] = useState<'IDLE' | 'TESTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [statusMessage, setStatusMessage] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSql, setShowSql] = useState(false);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      onSaveConfig({ url: '', anonKey: '', connected: false });
      setTestStatus('IDLE');
      setStatusMessage('Switched to Local Device Storage mode.');
      return;
    }

    setTestStatus('TESTING');
    setStatusMessage('Connecting to Supabase endpoints...');

    try {
      const cleanUrl = url.trim().replace(/\/$/, '');
      const testRes = await fetch(`${cleanUrl}/rest/v1/product_comments?limit=1`, {
        headers: {
          apikey: anonKey.trim(),
          Authorization: `Bearer ${anonKey.trim()}`
        }
      });

      if (testRes.ok) {
        setTestStatus('SUCCESS');
        setStatusMessage('Connected successfully to your Supabase database!');
        onSaveConfig({
          url: cleanUrl,
          anonKey: anonKey.trim(),
          connected: true
        });
      } else {
        const errorText = await testRes.text();
        setTestStatus('ERROR');
        setStatusMessage(`Connection reached server, but received status ${testRes.status}. Make sure you ran supabase.sql schema in Supabase.`);
      }
    } catch (err: unknown) {
      setTestStatus('ERROR');
      setStatusMessage(err instanceof Error ? err.message : 'Network error connecting to Supabase URL.');
    }
  };

  const handleClear = () => {
    setUrl('');
    setAnonKey('');
    onSaveConfig({ url: '', anonKey: '', connected: false });
    setTestStatus('IDLE');
    setStatusMessage('Cleared credentials. Reverted to Local Storage.');
  };

  const sqlSchema = `-- Run this in your Supabase SQL Editor:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.product_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    comment TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.product_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference TEXT UNIQUE NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    instructions TEXT,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.product_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Comments" ON public.product_comments FOR SELECT USING (true);
CREATE POLICY "Public Insert Comments" ON public.product_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Bookings" ON public.product_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Bookings" ON public.product_bookings FOR SELECT USING (true);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#ead8c3] overflow-hidden my-8">
        <div className="bg-[#fbf6ef] px-6 py-4 border-b border-[#ead8c3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#6b3f25]" />
            <h3 className="text-base sm:text-lg font-bold font-serif text-[#2e2118]">
              Database & Cloud Sync Configuration
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#6d6259] hover:text-[#2e2118]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="p-3.5 rounded-xl bg-[#faf5ef] border border-[#dfcbb5] text-xs text-[#5c5249] space-y-1.5">
            <div className="font-bold text-[#2e2118] flex items-center justify-between">
              <span>Current Data Storage Mode:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                config.connected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
              }`}>
                {config.connected ? '● Supabase Cloud Active' : '○ Local Device Storage (Demo)'}
              </span>
            </div>
            <p>
              By default, customer comments and bookings are preserved instantly in your device's browser storage. To share orders across multiple staff devices, enter your free Supabase credentials below.
            </p>
          </div>

          <form onSubmit={handleTestAndSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#3b2112] mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-[#dfcbb5] rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#6b3f25]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3b2112] mb-1">
                Supabase Anon (Public) Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-[#dfcbb5] rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#6b3f25]"
              />
            </div>

            {statusMessage && (
              <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                testStatus === 'SUCCESS' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                testStatus === 'ERROR' ? 'bg-red-50 text-red-800 border border-red-200' :
                'bg-blue-50 text-blue-800 border border-blue-200'
              }`}>
                {testStatus === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{statusMessage}</span>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={testStatus === 'TESTING'}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#6b3f25] text-white font-semibold text-xs hover:bg-[#53301a] transition-colors shadow-xs disabled:opacity-50"
              >
                {testStatus === 'TESTING' ? 'Testing Connection...' : 'Save & Connect Supabase'}
              </button>
              {config.connected && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="py-2.5 px-3 rounded-xl border border-[#dfcbb5] text-xs font-medium text-[#6d6259] hover:bg-[#faf5ef]"
                >
                  Disconnect
                </button>
              )}
            </div>
          </form>

          {/* SQL Schema Preview Collapsible */}
          <div className="pt-2 border-t border-[#ead8c3]">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowSql(!showSql)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#6b3f25] hover:underline"
              >
                <Code className="w-3.5 h-3.5" />
                <span>{showSql ? 'Hide SQL Migration' : 'View & Copy supabase.sql Setup Script'}</span>
              </button>
              <button
                type="button"
                onClick={copySql}
                className="flex items-center gap-1 text-xs text-[#5b3820] font-medium hover:text-[#2e2118]"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied SQL' : 'Copy SQL'}</span>
              </button>
            </div>

            {showSql && (
              <pre className="mt-3 p-3 bg-[#2e2118] text-[#fbf6ef] text-[11px] font-mono rounded-xl max-h-52 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                {sqlSchema}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
