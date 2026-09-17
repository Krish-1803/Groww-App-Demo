/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Groww brand tokens. Backed by CSS variables (see index.css) so the
        // palette flips cleanly between light and dark themes.
        primary: 'rgb(var(--c-primary) / <alpha-value>)',
        teal: 'rgb(var(--c-teal) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        canvas: 'rgb(var(--c-canvas) / <alpha-value>)',
        card: 'rgb(var(--c-card) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        positive: 'rgb(var(--c-positive) / <alpha-value>)',
        danger: 'rgb(var(--c-danger) / <alpha-value>)',
        warn: 'rgb(var(--c-warn) / <alpha-value>)',
        blue: 'rgb(var(--c-blue) / <alpha-value>)',
        sky: 'rgb(var(--c-sky) / <alpha-value>)',
        yellow: 'rgb(var(--c-yellow) / <alpha-value>)',
        purple: 'rgb(var(--c-purple) / <alpha-value>)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgb(26 31 54 / 0.08), 0 1px 3px -1px rgb(26 31 54 / 0.05)',
        card: '0 1px 3px 0 rgb(26 31 54 / 0.06), 0 1px 2px -1px rgb(26 31 54 / 0.05)',
        lift: '0 8px 30px -6px rgb(26 31 54 / 0.16)',
      },
      keyframes: {
        'count-fade': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'ring-fill': {
          '0%': { strokeDashoffset: 'var(--from)' },
          '100%': { strokeDashoffset: 'var(--to)' },
        },
        flame: {
          '0%, 100%': { transform: 'scale(1) rotate(-2deg)' },
          '50%': { transform: 'scale(1.12) rotate(2deg)' },
        },
        'sheet-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'count-fade': 'count-fade 0.4s ease-out',
        flame: 'flame 1.4s ease-in-out infinite',
        'sheet-up': 'sheet-up 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.22s cubic-bezier(0.22, 1, 0.36, 1)',
        marquee: 'marquee 22s linear infinite',
      },
    },
  },
  plugins: [],
}
