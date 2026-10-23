/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cp: {
          bg: '#080B12',
          card: '#101824',
          'card-hover': '#142030',
          elevated: '#141E2B',
          'elevated-hover': '#1A283A',
          gold: {
            DEFAULT: '#F0B93A',
            hover: '#F7C95C',
            light: 'rgba(240, 185, 58, 0.12)',
            border: 'rgba(240, 185, 58, 0.3)',
            glow: 'rgba(240, 185, 58, 0.25)',
          },
          text: {
            primary: '#F4F6FA',
            secondary: '#98A5B7',
            muted: '#627185',
          },
          border: {
            DEFAULT: '#243042',
            subtle: '#1A2332',
            light: '#314159',
          },
          positive: {
            DEFAULT: '#00D6A0',
            hover: '#05E5AD',
            subtle: 'rgba(0, 214, 160, 0.12)',
            border: 'rgba(0, 214, 160, 0.3)',
          },
          negative: {
            DEFAULT: '#FF5364',
            hover: '#FF6D7D',
            subtle: 'rgba(255, 83, 100, 0.12)',
            border: 'rgba(255, 83, 100, 0.3)',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'gold-sm': '0 0 10px rgba(240, 185, 58, 0.15)',
        'gold-md': '0 0 20px rgba(240, 185, 58, 0.25)',
        'gold-lg': '0 0 30px rgba(240, 185, 58, 0.35)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
        'elevated': '0 10px 30px -4px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F0B93A 0%, #D89C1D 100%)',
        'gold-gradient-hover': 'linear-gradient(135deg, #F7C95C 0%, #E5A826 100%)',
        'dark-gradient': 'linear-gradient(180deg, #101824 0%, #080B12 100%)',
        'card-gradient': 'linear-gradient(180deg, #141E2B 0%, #101824 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(240, 185, 58, 0.15) 50%, transparent 100%)',
      },
    },
    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
}
