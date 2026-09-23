import { COMPANY_INFO } from '@/data/company';

/** Keeps an optional leading `+` while stripping spaces, dashes and brackets. */
export function sanitisePhoneNumber(phoneNumber: string): string {
  const trimmed = phoneNumber.trim();
  const digits = trimmed.replace(/\D/g, '');

  return trimmed.startsWith('+') ? `+${digits}` : digits;
}

/** `tel:` deep link for click-to-call CTAs. Defaults to the office line. */
export function getTelHref(phoneNumber: string = COMPANY_INFO.phone): string {
  return `tel:${sanitisePhoneNumber(phoneNumber)}`;
}

/**
 * `wa.me` deep link with an optional pre-filled message — the highest converting
 * CTA on mobile, so the message is pre-seeded with the enquiry context.
 */
export function getWhatsAppHref(message?: string): string {
  const number = sanitisePhoneNumber(COMPANY_INFO.whatsappNumber).replace('+', '');
  const baseUrl = `https://wa.me/${number}`;
  const trimmedMessage = message?.trim();

  return trimmedMessage ? `${baseUrl}?text=${encodeURIComponent(trimmedMessage)}` : baseUrl;
}

/** Google Maps deep link for the Baner office. */
export function getDirectionsHref(): string {
  return COMPANY_INFO.googleMapsUrl;
}
