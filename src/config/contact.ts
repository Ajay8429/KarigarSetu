export const WHATSAPP_NUMBER = '9198429200434';
export const WHATSAPP_DISPLAY = '+91 98429200434';
export const PHONE_LINK = 'tel:+9198429200434';

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
