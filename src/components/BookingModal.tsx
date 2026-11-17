import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { Product, Booking } from '../types';
import { formatINR } from '../data/products';
import { X, CheckCircle2, MessageCircle, Copy, Check, Truck, Shield, LogIn } from 'lucide-react';

interface BookingModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitBooking: (bookingData: Omit<Booking, 'reference' | 'created_at' | 'status'>) => Promise<Booking>;
  user: User | null;
  onRequestAuth: (hint: string) => void;
  isDbConnected: boolean;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  product,
  isOpen,
  onClose,
  onSubmitBooking,
  user,
  onRequestAuth,
  isDbConnected
}) => {
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [instructions, setInstructions] = useState('');
  const [finish, setFinish] = useState('Default Artisanal Wax Finish');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSubmittedBooking(null);
      setErrorMsg('');
      setCopied(false);
      if (user?.displayName && !name) {
        setName(user.displayName);
      }
    }
  }, [isOpen, product, user, name]);

  if (!isOpen || !product) return null;

  const totalAmount = product.price * quantity;

  const getPincodeRegion = (pin: string) => {
    if (pin.length < 2) return null;
    const firstDigit = pin[0];
    const map: Record<string, string> = {
      '1': 'Northern Zone (Delhi, Haryana, Punjab, HP, J&K)',
      '2': 'Northern Zone (Uttar Pradesh & Uttarakhand)',
      '3': 'Western Zone (Rajasthan & Gujarat)',
      '4': 'Western Zone (Maharashtra, Goa, MP, Chhattisgarh)',
      '5': 'Southern Zone (AP, Telangana, Karnataka)',
      '6': 'Southern Zone (Tamil Nadu, Kerala)',
      '7': 'Eastern Zone (West Bengal, Odisha, North East)',
      '8': 'Eastern Zone (Bihar & Jharkhand)'
    };
    return map[firstDigit] || null;
  };

  const regionHint = pincode.length >= 2 ? getPincodeRegion(pincode) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    if (address.trim().length < 5) {
      setErrorMsg('Please enter your complete delivery street address (at least 5 characters).');
      return;
    }
    if (!/^[0-9]{6}$/.test(pincode.trim())) {
      setErrorMsg('Please enter a valid 6-digit Indian postal PIN code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const created = await onSubmitBooking({
        product_id: product.id,
        product_name: product.name,
        unit_price: product.price,
        quantity,
        total_amount: totalAmount,
        customer_name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        pincode: pincode.trim(),
        instructions: instructions.trim(),
        finish_preference: finish
      });
      setSubmittedBooking(created);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to submit booking. Please try again.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReference = () => {
    if (submittedBooking?.reference) {
      navigator.clipboard.writeText(submittedBooking.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Hello KarigarSetu! 🪵 I want to confirm my booking:\n\n` +
      `*Order Ref:* ${submittedBooking ? submittedBooking.reference : 'New Inquiry'}\n` +
      `*Product:* ${product.name} (Qty: ${quantity})\n` +
      `*Total:* ${formatINR(totalAmount)}\n` +
      `*Customer:* ${name || 'Customer'}\n` +
      `*Phone:* ${phone}\n` +
      `*Delivery Address:* ${address}, PIN: ${pincode}\n` +
      `*Finish:* ${finish}\n` +
      `${instructions ? `*Note:* ${instructions}\n` : ''}\n` +
      `Please confirm estimated delivery date and safe packaging.`
    );
    return `https://wa.me/919876543210?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#ead8c3] overflow-hidden my-8">
        <div className="bg-[#fbf6ef] px-6 py-4 border-b border-[#ead8c3] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#3c543f]">
              Artisan Booking & Dispatch
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-[#2e2118]">
              {submittedBooking ? 'Booking Received' : `Book ${product.name}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6d6259] hover:text-[#2e2118] hover:bg-[#ead8c3]/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submittedBooking ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-800">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#2e2118]">Thank You, {submittedBooking.customer_name}!</h3>
                <p className="text-sm text-[#6d6259] mt-1 max-w-md mx-auto">
                  Your handcrafted booking has been registered. Our Saharanpur artisan workshop will inspect the wood seasoning and contact you to confirm delivery.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#fbf6ef] border border-[#dfcbb5] max-w-sm mx-auto text-left space-y-2">
                <div className="flex items-center justify-between text-xs text-[#6d6259]">
                  <span>Booking Reference:</span>
                  <button
                    onClick={copyReference}
                    className="flex items-center gap-1 text-[#6b3f25] font-semibold hover:underline"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-xl font-bold font-mono tracking-wider text-[#6b3f25]">
                  {submittedBooking.reference}
                </div>
                <div className="text-xs text-[#553b26] pt-1 border-t border-[#dfcbb5] flex justify-between">
                  <span>{submittedBooking.product_name} (x{submittedBooking.quantity})</span>
                  <span className="font-bold">{formatINR(submittedBooking.total_amount)}</span>
                </div>
                <div className="text-[11px] text-[#7d7168]">
                  Saved to: {user ? 'Firebase Cloud Account' : isDbConnected ? 'Supabase Database' : 'This Device (Guest Mode)'}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center max-w-md mx-auto">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20b858] transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Booking to WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-[#f4ecdf] text-[#4a3424] font-semibold text-sm hover:bg-[#ead8c3] transition-colors"
                >
                  Back to Catalogue
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!user && (
                <div className="p-3 rounded-xl bg-[#fbf6ef] border border-[#dfcbb5] flex items-center justify-between gap-3 text-xs">
                  <span className="text-[#5c5249]">
                    Sign in to save bookings to your account across devices.
                  </span>
                  <button
                    type="button"
                    onClick={() => onRequestAuth('Sign in with Google to save and track your bookings across all devices.')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2e2118] text-white font-semibold shrink-0 hover:bg-[#422e21]"
                  >
                    <LogIn className="w-3 h-3" />
                    <span>Sign In</span>
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#faf5ef] border border-[#ead8c3]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 rounded-lg object-cover border border-[#dfcbb5]"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#2e2118] truncate">{product.name}</div>
                  <div className="text-xs text-[#8c5835]">{product.woodType}</div>
                  <div className="text-xs font-semibold text-[#6b3f25] tabular-nums mt-0.5">
                    {formatINR(product.price)} each
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-[#7d7168]">Estimated Transit</div>
                  <div className="text-xs font-semibold text-[#3c543f]">{product.leadTime}</div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 text-xs bg-red-50 text-red-800 rounded-lg border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3b2112] mb-1">
                    Quantity
                  </label>
                  <div className="flex items-center border border-[#dfcbb5] rounded-lg bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-sm font-bold bg-[#faf5ef] hover:bg-[#ead8c3] text-[#2e2118]"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                      className="w-full text-center text-sm font-semibold py-2 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(20, quantity + 1))}
                      className="px-3 py-2 text-sm font-bold bg-[#faf5ef] hover:bg-[#ead8c3] text-[#2e2118]"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3b2112] mb-1">
                    Polish / Finish
                  </label>
                  <select
                    value={finish}
                    onChange={(e) => setFinish(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white border border-[#dfcbb5] rounded-lg focus:ring-1 focus:ring-[#6b3f25] focus:outline-none"
                  >
                    <option value="Default Artisanal Wax Finish">Artisan Wax (Natural Sheesham)</option>
                    <option value="Warm Honey Gloss">Warm Honey Gloss</option>
                    <option value="Dark Walnut Stain">Dark Walnut Stain</option>
                    <option value="Raw Natural Matte">Raw Natural Matte</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3b2112] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="e.g. Ajay Maurya"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white border border-[#dfcbb5] rounded-lg focus:ring-1 focus:ring-[#6b3f25] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3b2112] mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    minLength={7}
                    maxLength={20}
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white border border-[#dfcbb5] rounded-lg focus:ring-1 focus:ring-[#6b3f25] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b2112] mb-1">
                  Complete Delivery Address *
                </label>
                <textarea
                  required
                  rows={2}
                  minLength={5}
                  maxLength={500}
                  placeholder="House/Flat number, building name, street, locality, city..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-[#dfcbb5] rounded-lg focus:ring-1 focus:ring-[#6b3f25] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#3b2112]">
                    6-Digit Postal PIN Code *
                  </label>
                  {regionHint && (
                    <span className="text-[11px] text-[#3c543f] font-medium">
                      {regionHint}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  placeholder="e.g. 247001 or 560001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="w-full p-2.5 text-xs bg-white border border-[#dfcbb5] rounded-lg focus:ring-1 focus:ring-[#6b3f25] focus:outline-none tracking-wider"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b2112] mb-1">
                  Special Customization / Delivery Notes (Optional)
                </label>
                <input
                  type="text"
                  maxLength={300}
                  placeholder="Gift packing, specific delivery timing, custom size request..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-[#dfcbb5] rounded-lg focus:ring-1 focus:ring-[#6b3f25] focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-[#ead8c3] flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#6d6259]">Total Booking Value</div>
                  <div className="text-xl font-bold font-serif text-[#6b3f25] tabular-nums">
                    {formatINR(totalAmount)}
                  </div>
                </div>

                <div className="text-right text-[11px] text-[#7d7168] space-y-0.5">
                  <div className="flex items-center gap-1 justify-end text-emerald-800 font-medium">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Free Artisan Crating</span>
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <Shield className="w-3.5 h-3.5 text-amber-700" />
                    <span>Pay only after phone confirmation</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#6b3f25] text-white font-semibold text-sm hover:bg-[#53301a] transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering Booking…' : `Submit Booking (${formatINR(totalAmount)})`}
                </button>

                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20b858] transition-colors shadow-xs"
                  title="Directly chat on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Order</span>
                </a>
              </div>

              <p className="text-[11px] text-[#82746a] text-center">
                No advance online card payment required. The artisan collective will confirm dimensions and dispatch schedule by phone.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
