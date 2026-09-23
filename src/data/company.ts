import type { CompanyInfo, WorkingHours } from '@/types/property';

/* -------------------------------------------------------------------------- *
 * Verified business identity for I Realtors (Baner, Pune).
 *
 * TODO(launch-blocker):
 *   - `phone` and `whatsappNumber` are PLACEHOLDERS. Replace both with the
 *     verified business lines before the site goes live.
 *   - `googleMapsUrl` is generated from the postal address via the official
 *     Maps search API URL, so it resolves without a place ID. Swap it for the
 *     Google Business Profile short link once it is confirmed.
 * -------------------------------------------------------------------------- */

/** MahaRERA agent registration number of the consultancy. */
export const RERA_NUMBER = 'A52100000092';

/** Registered office address exactly as printed on the MahaRERA certificate. */
export const OFFICE_ADDRESS =
  '1st Floor, Shree Building, Survey 12, Veerbhadra Nagar Rd, Veerbhadra Nagar, Baner, Pune, Maharashtra 411045';

/** Shorthand label reused in badges, metadata and the footer. */
export const RERA_REGISTRATION_LABEL = `MahaRERA Reg. No. ${RERA_NUMBER}`;

/** Published office hours (IST), split weekday / weekend. */
export const WORKING_HOURS: WorkingHours = {
  weekday: {
    days: 'Mon – Thu',
    timings: '9:30 AM – 7:30 PM',
  },
  weekend: {
    days: 'Fri – Sun',
    timings: '9:30 AM – 9:30 PM',
  },
};

/** Compliance copy for the footer and disclaimer strips. */
export const RERA_DISCLAIMER = `I Realtors is a MahaRERA registered real estate agent (Reg. No. ${RERA_NUMBER}). Project RERA numbers, pricing, carpet areas and availability are indicative and subject to change; please verify the latest disclosures on the MahaRERA portal before booking.`;

/** Official Google Maps deep link for the Baner office. */
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `I Realtors, ${OFFICE_ADDRESS}`,
)}`;

/** Single source of truth for every surface that shows brand/contact details. */
export const COMPANY_INFO: CompanyInfo = {
  name: 'I Realtors',
  reraNumber: RERA_NUMBER,
  address: OFFICE_ADDRESS,
  phone: '+91 90000 00000', // TODO: replace with the verified office line.
  whatsappNumber: '919000000000', // TODO: replace with the verified WhatsApp number.
  googleMapsUrl: GOOGLE_MAPS_URL,
  workingHours: WORKING_HOURS,
};

/** Short value proposition reused by the hero, CTA bands and OG descriptions. */
export const COMPANY_TAGLINE =
  'RERA-registered channel partner in Baner, Pune — handpicked 2, 3 & 4 BHK homes across Pune West.';
