import React from 'react';
import { Product } from '../types';
import { formatINR } from '../data/products';
import { X, ShoppingBag, Check, MapPin, MessageCircle } from 'lucide-react';
import { buildWhatsAppLink } from '../config/contact';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onBookNow
}) => {
  if (!isOpen || !product) return null;

  const getWhatsAppProductUrl = () => {
    return buildWhatsAppLink(
      `Hello KarigarSetu! 🪵 I am interested in *${product.name}* (${formatINR(product.price)}). Could you provide details on custom dimensions and shipping time?`
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#ead8c3] overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-[#2e2118] hover:bg-white shadow-sm border border-[#dfcbb5] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image Box */}
          <div className="relative bg-[#f7f1e8] p-6 flex items-center justify-center min-h-[300px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto max-h-[420px] object-contain rounded-xl"
            />
            <div className="absolute top-4 left-4 bg-white/95 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider text-[#3c543f] border border-[#dfcbb5]">
              {product.category}
            </div>
          </div>

          {/* Right: Specifications & Artisan Lore */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs font-semibold text-[#8c5835]">
                {product.woodType}
              </div>
              <h2 className="text-2xl font-bold font-serif text-[#2e2118] mt-1">
                {product.name}
              </h2>
              <div className="mt-2 text-2xl font-bold font-serif text-[#6b3f25] tabular-nums">
                {formatINR(product.price)}
              </div>

              <p className="mt-3 text-sm text-[#6d6259] leading-relaxed">
                {product.desc}
              </p>

              {/* Key Features */}
              <div className="mt-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#4a3424]">
                  Artisan Highlights
                </div>
                <ul className="space-y-1.5 text-xs text-[#5c5249]">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#3c543f] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Specifications Table */}
              <div className="mt-5 pt-4 border-t border-[#f4ecdf] grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#82746a] block">Dimensions</span>
                  <span className="font-semibold text-[#2e2118]">{product.dimensions}</span>
                </div>
                <div>
                  <span className="text-[#82746a] block">Item Weight</span>
                  <span className="font-semibold text-[#2e2118]">{product.weight}</span>
                </div>
                <div>
                  <span className="text-[#82746a] block">Finish & Treatment</span>
                  <span className="font-semibold text-[#2e2118]">{product.finish}</span>
                </div>
                <div>
                  <span className="text-[#82746a] block">Craft Lead Time</span>
                  <span className="font-semibold text-[#3c543f]">{product.leadTime}</span>
                </div>
              </div>

              {/* Artisan provenance box */}
              <div className="mt-4 p-3 rounded-lg bg-[#fbf6ef] border border-[#ead8c3] text-xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#6b3f25] text-amber-200 flex items-center justify-center font-bold text-sm shrink-0">
                  {product.artisan[0]}
                </div>
                <div>
                  <div className="font-bold text-[#2e2118]">{product.artisan}</div>
                  <div className="text-[#7d7168] flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3 h-3 text-[#3c543f]" />
                    <span>{product.artisanVillage}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-[#f4ecdf] flex gap-3">
              <button
                onClick={() => {
                  onClose();
                  onBookNow(product);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#6b3f25] text-white font-semibold text-sm hover:bg-[#53301a] transition-colors shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Book This Craft</span>
              </button>

              <a
                href={getWhatsAppProductUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center p-3 rounded-xl border border-[#dfcbb5] bg-[#faf5ef] text-[#3c543f] hover:bg-[#ead8c3] transition-colors"
                title="Ask question on WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-emerald-700" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
