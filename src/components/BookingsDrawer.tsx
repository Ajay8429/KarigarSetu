import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import { Booking } from '../types';
import { formatINR } from '../data/products';
import { X, Search, FileText, Download, Check, Copy, Printer, ShieldCheck, LogIn } from 'lucide-react';

interface BookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onUpdateStatus: (reference: string, newStatus: Booking['status']) => Promise<void>;
  user: User | null;
  isAdmin: boolean;
  onRequestAuth: (hint: string) => void;
  isDbConnected: boolean;
}

export const BookingsDrawer: React.FC<BookingsDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  onUpdateStatus,
  user,
  isAdmin,
  onRequestAuth,
  isDbConnected
}) => {
  const [filter, setFilter] = useState<'ALL' | Booking['status']>('ALL');
  const [search, setSearch] = useState('');
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = filter === 'ALL' || b.status === filter;
    const matchesSearch =
      b.reference.toLowerCase().includes(search.toLowerCase()) ||
      b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      b.product_name.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search) ||
      b.pincode.includes(search);
    return matchesFilter && matchesSearch;
  });

  const handleCopy = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const handleExportCSV = () => {
    if (bookings.length === 0) return;
    const headers = ['Reference', 'Product', 'Quantity', 'Total Amount', 'Customer', 'Phone', 'Address', 'Pincode', 'Status', 'Date'];
    const rows = bookings.map(b => [
      b.reference,
      `"${b.product_name}"`,
      b.quantity,
      b.total_amount,
      `"${b.customer_name}"`,
      b.phone,
      `"${b.address.replace(/"/g, '""')}"`,
      b.pincode,
      b.status,
      new Date(b.created_at).toISOString()
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KarigarSetu_Bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintSlip = (b: Booking) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Booking Slip - ${b.reference}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 30px; color: #2e2118; max-width: 600px; margin: auto; }
            .header { border-bottom: 2px solid #6b3f25; padding-bottom: 12px; margin-bottom: 20px; }
            .brand { font-size: 24px; font-weight: bold; color: #6b3f25; }
            .ref { font-family: monospace; font-size: 16px; margin-top: 4px; color: #555; }
            .section { margin: 16px 0; padding: 12px; background: #faf5ef; border-radius: 8px; }
            .row { display: flex; justify-content: space-between; margin: 6px 0; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">🪵 KarigarSetu Saharanpur</div>
            <div class="ref">Booking Slip: ${b.reference}</div>
            <div style="font-size: 12px; color: #888;">Date: ${new Date(b.created_at).toLocaleString('en-IN')}</div>
          </div>
          <div class="section">
            <div class="row"><span class="bold">Product:</span><span>${b.product_name}</span></div>
            <div class="row"><span>Quantity:</span><span>${b.quantity}</span></div>
            <div class="row"><span>Unit Price:</span><span>₹${b.unit_price}</span></div>
            <div class="row"><span class="bold">Total Amount:</span><span class="bold">₹${b.total_amount}</span></div>
            <div class="row"><span>Finish:</span><span>${b.finish_preference || 'Standard'}</span></div>
          </div>
          <div class="section">
            <div class="bold" style="margin-bottom: 8px;">Customer Details:</div>
            <div>${b.customer_name}</div>
            <div>${b.phone}</div>
            <div style="margin-top: 6px;">${b.address}</div>
            <div>PIN: ${b.pincode}</div>
          </div>
          ${b.instructions ? `<div class="section"><span class="bold">Instructions:</span> ${b.instructions}</div>` : ''}
          <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #777;">
            Handcrafted with GI-tagged heritage in Saharanpur, Uttar Pradesh
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-[#ead8c3]">
        <div className="bg-[#fbf6ef] px-6 py-4 border-b border-[#ead8c3] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold font-serif text-[#2e2118]">
                {isAdmin ? 'Store Admin Console' : 'My Bookings & Orders'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#ead8c3] text-[#5b3820] tabular-nums">
                {bookings.length}
              </span>
            </div>
            <div className="text-xs text-[#7d7168] mt-0.5 flex items-center gap-1.5">
              {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-[#3c543f]" />}
              <span>
                {user
                  ? isAdmin
                    ? `Admin signed in as ${user.email} · Live Firestore`
                    : `Synced to ${user.email} · Live Firestore`
                  : isDbConnected
                    ? 'Connected to Supabase Cloud'
                    : 'Guest Local Device Storage'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="p-2 rounded-lg border border-[#dfcbb5] bg-white hover:bg-[#faf5ef] text-[#5b3820] text-xs font-semibold flex items-center gap-1.5"
              title="Export all orders to CSV spreadsheet"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#6d6259] hover:text-[#2e2118] hover:bg-[#ead8c3]/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!user && (
          <div className="px-4 py-3 bg-[#fbf6ef] border-b border-[#ead8c3] flex items-center justify-between gap-3 text-xs">
            <span className="text-[#5c5249]">
              Sign in with Google to view your cloud-synced bookings or access the Store Admin Console.
            </span>
            <button
              type="button"
              onClick={() => onRequestAuth('Sign in with Google to access your bookings or Store Admin Console.')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2e2118] text-white font-semibold shrink-0 hover:bg-[#422e21]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        )}

        <div className="p-4 bg-white border-b border-[#ead8c3] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#9a8c80]" />
            <input
              type="text"
              placeholder="Search by reference, customer, product, PIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#faf5ef] border border-[#dfcbb5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6b3f25]"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {(['ALL', 'New', 'Confirmed', 'In Carving', 'Dispatched', 'Delivered', 'Cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                  filter === st
                    ? 'bg-[#6b3f25] text-white shadow-xs'
                    : 'bg-[#faf5ef] text-[#6d6259] hover:bg-[#ead8c3]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#faf5ef]">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-[#82746a] space-y-2">
              <FileText className="w-10 h-10 mx-auto text-[#c8b29c]" />
              <p className="text-sm font-medium">No bookings found</p>
              <p className="text-xs max-w-xs mx-auto">
                {search ? 'Try clearing your search query.' : 'Submit a booking from the product catalogue to track it here.'}
              </p>
            </div>
          ) : (
            filteredBookings.map((b) => {
              const canCustomerCancel =
                user && !isAdmin && (b.status === 'New' || b.status === 'Confirmed');
              return (
                <div
                  key={b.reference}
                  className="bg-white rounded-xl border border-[#ead8c3] p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#6b3f25] bg-[#fbf6ef] px-2 py-0.5 rounded border border-[#dfcbb5]">
                          {b.reference}
                        </span>
                        <button
                          onClick={() => handleCopy(b.reference)}
                          className="text-[#8c5835] hover:text-[#55301a] p-1"
                          title="Copy reference code"
                        >
                          {copiedRef === b.reference ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-[#2e2118] mt-1.5">
                        {b.product_name}
                      </h4>
                    </div>

                    {isAdmin || !user ? (
                      <select
                        value={b.status}
                        onChange={(e) => onUpdateStatus(b.id || b.reference, e.target.value as Booking['status'])}
                        className="text-xs font-semibold px-2 py-1 rounded-md border border-[#dfcbb5] bg-[#fbf6ef] text-[#2e2118] focus:outline-none"
                      >
                        <option value="New">New</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Carving">In Carving</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md border border-[#dfcbb5] bg-[#fbf6ef] text-[#2e2118]">
                          {b.status}
                        </span>
                        {canCustomerCancel && (
                          <button
                            onClick={() => onUpdateStatus(b.id || b.reference, 'Cancelled')}
                            className="text-[11px] font-semibold text-red-700 hover:underline"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#faf5ef] p-2.5 rounded-lg border border-[#f0e4d6]">
                    <div>
                      <span className="text-[#82746a] block">Customer:</span>
                      <span className="font-semibold text-[#2e2118]">{b.customer_name}</span>
                      <span className="text-[#6d6259] block text-[11px]">{b.phone}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#82746a] block">Amount:</span>
                      <span className="font-bold text-[#6b3f25] text-sm tabular-nums">
                        {formatINR(b.total_amount)}
                      </span>
                      <span className="text-[11px] text-[#7d7168] block">Qty: {b.quantity}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-[#eee2d7] text-[11px] text-[#5c5249]">
                      <span className="font-medium text-[#2e2118]">Delivery:</span> {b.address}, PIN: {b.pincode}
                    </div>
                    {b.instructions && (
                      <div className="col-span-2 text-[11px] text-[#7c6655] italic">
                        Note: "{b.instructions}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#82746a] pt-1">
                    <span>
                      Booked on {new Date(b.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <button
                      onClick={() => handlePrintSlip(b)}
                      className="flex items-center gap-1 text-[#6b3f25] font-semibold hover:underline"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Slip</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
