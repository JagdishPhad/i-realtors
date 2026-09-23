import { MessageCircle, Phone } from 'lucide-react';

import { getTelHref, getWhatsAppHref } from '@/lib/contact';

/**
 * Mobile-only sticky action bar.
 *
 * Rendered once from the root layout so every route gets thumb-reachable call and
 * WhatsApp CTAs. Hidden from `md` upwards (where the header CTAs are visible) and
 * `aria-hidden` is avoided on purpose — these are real, focusable links.
 */
export function StickyMobileCta(): JSX.Element {
  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-gold/25 bg-background-deep/95 backdrop-blur-md md:hidden">
      <div className="container-shell flex items-center gap-2 py-2.5">
        <a href={getTelHref()} className="btn-gold flex-1 px-4 py-2.5 text-sm">
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call now
        </a>
        <a
          href={getWhatsAppHref('Hi I Realtors, I would like details of your current projects.')}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline flex-1 px-4 py-2.5 text-sm"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
