/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        surface: v('surface'),
        soft: v('soft'),
        ink: v('ink'),
        muted: v('muted'),
        line: v('line'),
        lav: v('lav'),
        mintsoft: v('mint-soft'),
        peach: v('peach'),
        butter: v('butter'),
        butterline: v('butter-line'),
        purple: { DEFAULT: '#6C63D9', dark: '#5149B8', light: '#8F88E6' },
        coral: { DEFAULT: '#FF8A72', dark: '#F0705A' },
        mint: { DEFAULT: '#4FC29A', light: '#70D6B0', dark: '#2E9C75' },
        navy: { DEFAULT: '#18243A', deep: '#0F1828' },
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans Variable"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(24,36,58,0.04), 0 8px 24px -12px rgba(24,36,58,0.10)',
        lift: '0 2px 4px rgba(24,36,58,0.05), 0 18px 40px -16px rgba(24,36,58,0.22)',
        glow: '0 10px 30px -8px rgba(108,99,217,0.55)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'none' } },
        'pop-in': { '0%': { opacity: 0, transform: 'scale(.96)' }, '100%': { opacity: 1, transform: 'none' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'fade-up': 'fade-up .45s ease-out both',
        'pop-in': 'pop-in .2s ease-out both',
        float: 'float 5s ease-in-out infinite',
        'spin-slow': 'spin-slow 60s linear infinite',
      },
    },
  },
  plugins: [],
};
