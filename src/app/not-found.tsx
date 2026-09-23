import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Compass, MessageCircle } from 'lucide-react';

import { getWhatsAppHref } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: {
    index: false,
    follow: true,
  },
};

/** Branded 404 that routes lost visitors back into the conversion funnel. */
export default function NotFound(): JSX.Element {
  return (
    <div className="container-shell flex min-h-[60vh] flex-col items-center justify-center gap-5 py-16 text-center">
      <span className="badge">
        <Compass className="h-3.5 w-3.5" aria-hidden="true" />
        404
      </span>
      <h1 className="text-display-sm font-bold text-ink">We could not find that page</h1>
      <p className="muted-copy max-w-md">
        The project or page you were looking for may have been renamed or withdrawn. Browse our live
        inventory, or ask us directly — we will point you to something better.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/properties" className="btn-gold">
          Browse projects
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <a
          href={getWhatsAppHref('Hi I Realtors, I was looking for a project on your website.')}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Ask on WhatsApp
        </a>
      </div>
    </div>
  );
}
