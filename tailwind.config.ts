import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F1F4F9',
          100: '#DCE3ED',
          200: '#B9C7DB',
          300: '#95ABC9',
          400: '#5878A0',
          500: '#2B5079',
          600: '#1E3A5F',
          700: '#172E4C',
          800: '#102338',
          900: '#091625',
        },
        gold: {
          50: '#FBF7EB',
          100: '#F5EAC4',
          200: '#EAD68A',
          300: '#E0C24F',
          400: '#D4AF37',
          500: '#B0902B',
          600: '#8B7222',
          700: '#665318',
          800: '#41350F',
          900: '#1C1707',
        },
      },
      fontFamily: {
        arabic: ['var(--font-cairo)', 'Tahoma', 'sans-serif'],
        latin: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
