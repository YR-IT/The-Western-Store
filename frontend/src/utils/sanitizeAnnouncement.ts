import { STORE_INFO } from '../data/mockData';

/** Drop leftover CMS/localStorage copy that pushes Instagram/WhatsApp ordering. */
export function sanitizeAnnouncement(raw: string | undefined | null): string {
  const text = (raw || '').trim();
  if (!text) return STORE_INFO.announcement;
  if (
    /dm us on instagram|instagram.*to order|whatsapp.*(order|concierge)|order via (whatsapp|instagram)|direct whatsapp order/i.test(
      text
    )
  ) {
    return STORE_INFO.announcement;
  }
  return text;
}
