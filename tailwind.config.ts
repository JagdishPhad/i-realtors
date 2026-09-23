import type { Config } from 'tailwindcss';

/**
 * Tailwind design tokens for the I Realtors brand.
 *
 * Palette (dark luxury):
 *  - Deep background : #0B132B (base) / #020617 (deepest sections, footer, hero wash)
 *  - Surface         : #1E293B (cards, sticky bars, form panels)
 *  - Accent gold     : #EAB308 (primary CTA) / #D97706 (hover + pressed, gradients)
 *  - Primary text    : #F8FAFC
 *  - Secondary text  : #94A3B8
 *
 * Utility names generated from the tokens below:
 *  bg-background / bg-background-deep / bg-surface / bg-surface-raised
 *  text-ink / text-ink-muted / text-gold / bg-gold / border-gold ...
 */
const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/sections/**/*.{ts,tsx}',
    './src/data/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0B132B',
          deep: '#020617',
        },
        surface: {
          DEFAULT: '#1E293B',
          raised: '#243349',
          border: '#334155',
        },
        gold: {
          DEFAULT: '#EAB308',
          deep: '#D97706',
          soft: 'rgba(234, 179, 8, 0.12)',
        },
        ink: {
          DEFAULT: '#F8FAFC',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-inter, ui-sans-serif)',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'display-lg': ['clamp(2.25rem, 6vw, 3.75rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(1.75rem, 4vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 20px 45px -25px rgba(2, 6, 23, 0.9)',
        glow: '0 0 0 1px rgba(234, 179, 8, 0.35), 0 18px 40px -18px rgba(234, 179, 8, 0.45)',
      },
      backgroundImage: {
        'gold-sheen': 'linear-gradient(120deg, #EAB308 0%, #D97706 55%, #F59E0B 100%)',
        'hero-radial':
          'radial-gradient(120% 120% at 10% 0%, rgba(234, 179, 8, 0.16) 0%, rgba(11, 19, 43, 0) 55%), radial-gradient(90% 90% at 90% 10%, rgba(30, 41, 59, 0.9) 0%, rgba(2, 6, 23, 0) 60%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(234, 179, 8, 0.55)' },
          '70%': { boxShadow: '0 0 0 14px rgba(234, 179, 8, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(234, 179, 8, 0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
