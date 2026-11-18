import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, MapPin, ChevronDown, Send } from 'lucide-react';
import { buildWhatsAppLink, WHATSAPP_DISPLAY, PHONE_LINK } from '../config/contact';

export const ContactSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customMsg, setCustomMsg] = useState('');
  const [sentCustom, setSentCustom] = useState(false);

  const faqs = [
    {
      q: 'How are wooden crafts packaged for long-distance transit across India?',
      a: 'All furniture and delicate Jali panels are cushioned with high-density EPE foam, wrapped in 5-ply corrugated sheets, and crated inside heavy wooden battens to ensure zero in-transit damage.'
    },
    {
      q: 'Can I order custom sizes or finishes (e.g. distressed white, walnut, or honey)?',
      a: 'Yes! Saharanpur artisans take custom orders. You can specify exact room measurements and polish tones via our WhatsApp link or during phone confirmation.'
    },
    {
      q: 'How should I clean and care for solid Sheesham wood products?',
      a: 'Wipe with a soft dry or microfiber cloth. Avoid water puddles and harsh detergents. Applying natural beeswax furniture balm once a year will maintain the deep golden luster for generations.'
    },
    {
      q: 'What is the payment process for bookings placed on KarigarSetu?',
      a: 'Bookings placed here are verified over phone by our artisan coordinator. We confirm your delivery address and estimated arrival date before providing UPI / Bank Transfer / Cash on Delivery payment options.'
    }
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customPhone.trim()) return;
    const url = buildWhatsAppLink(
      `Hello KarigarSetu! My name is ${customName}. I have a custom woodcraft request:\n"${customMsg}"\nPlease contact me at ${customPhone}.`
    );
    window.open(url, '_blank');
    setSentCustom(true);
  };

  return (
    <section id="contact" className="py-16 bg-[#fbf6ef] border-b border-[#ead8c3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Contacts */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#3c543f]">
                Artisan Coordination & Custom Work
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#2e2118] mt-1.5">
                Contact KarigarSetu Saharanpur
              </h2>
              <p className="mt-2 text-sm text-[#6d6259] leading-relaxed">
                Have questions about an existing booking, bulk corporate gifting, or custom architectural Jali partitions? Speak directly with our Saharanpur workshop cluster.
              </p>
            </div>

            {/* Direct Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={buildWhatsAppLink('Hello KarigarSetu, I am interested in Saharanpur handcrafted wooden products.')}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/15 transition-colors flex items-start gap-3 group"
              >
                <div className="p-2.5 rounded-lg bg-[#25D366] text-white">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1e7e34]">WhatsApp Order Desk</div>
                  <div className="text-sm font-semibold text-[#2e2118] group-hover:text-emerald-800">
                    {WHATSAPP_DISPLAY}
                  </div>
                  <div className="text-[11px] text-[#5c5249]">Mon - Sat: 9 AM - 8 PM IST</div>
                </div>
              </a>

              <a
                href={PHONE_LINK}
                className="p-4 rounded-xl bg-white border border-[#ead8c3] hover:bg-[#faf5ef] transition-colors flex items-start gap-3"
              >
                <div className="p-2.5 rounded-lg bg-[#6b3f25] text-white">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#8c5835]">Direct Phone Helpline</div>
                  <div className="text-sm font-semibold text-[#2e2118]">
                    {WHATSAPP_DISPLAY}
                  </div>
                  <div className="text-[11px] text-[#5c5249]">Hindi & English Support</div>
                </div>
              </a>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#ead8c3] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#2e2118] font-semibold">
                <MapPin className="w-4 h-4 text-[#6b3f25]" />
                <span>Cluster Workshop & Dispatch Center:</span>
              </div>
              <p className="text-[#6d6259] pl-6 leading-relaxed">
                KarigarSetu Collective, Mohalla Saraian, Near Timber Market Road, Saharanpur - 247001, Uttar Pradesh, India
              </p>
              <div className="flex items-center gap-2 text-[#2e2118] font-semibold pt-1">
                <Mail className="w-4 h-4 text-[#6b3f25]" />
                <span>Email: contact@karigarsetu.in</span>
              </div>
            </div>

            {/* Custom inquiry mini-form */}
            <div className="p-5 rounded-2xl bg-[#faf5ef] border border-[#dfcbb5]">
              <h3 className="text-sm font-bold text-[#2e2118] mb-1">
                Need Custom Dimensions or Bulk Gifting?
              </h3>
              <p className="text-xs text-[#6d6259] mb-3">
                Send your requirements directly to the master carver via WhatsApp:
              </p>
              <form onSubmit={handleCustomSubmit} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="p-2 text-xs bg-white border border-[#dfcbb5] rounded-lg focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone / WhatsApp"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    className="p-2 text-xs bg-white border border-[#dfcbb5] rounded-lg focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="e.g. 36x24 inch jali panel or 50 corporate wooden boxes..."
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="w-full p-2 text-xs bg-white border border-[#dfcbb5] rounded-lg focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#3c543f] text-white text-xs font-semibold hover:bg-[#2b3c2d] transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Custom Inquiry to Karigar</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#3c543f]">
                Buyer Guidance & Trust
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2e2118] mt-1">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#ead8c3] bg-white overflow-hidden transition-all shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left font-semibold text-xs sm:text-sm text-[#2e2118] flex items-center justify-between gap-3 hover:bg-[#fbf6ef]"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#8c5835] transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-[#6d6259] leading-relaxed border-t border-[#f4ecdf] pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
