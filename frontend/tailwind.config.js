/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:   ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        poppins:['Poppins', 'Inter', 'sans-serif'],
        mono:   ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        emergency: {
          50:  '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc8c8',
          300: '#ffa2a2',
          400: '#ff6b6b',
          500: '#f83b3b',
          600: '#e51a1a',
          700: '#c11414',
          800: '#9f1515',
          900: '#841919',
        },
      },
      animation: {
        'ambulance':    'ambulance-drive 0.8s ease-in-out infinite',
        'bounce-gen':   'bounce-gentle 3s ease-in-out infinite',
        'fade-up':      'fade-up 0.6s ease-out forwards',
        'slide-right':  'slide-in-right 0.5s ease-out forwards',
        'pulse-glow':   'pulse-glow 2s ease-in-out infinite',
        'float':        'float 6s ease-in-out infinite',
        'shimmer':      'shimmer 1.5s infinite',
      },
      keyframes: {
        'ambulance-drive': {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '25%':       { transform: 'translateX(4px) rotate(1deg)' },
          '75%':       { transform: 'translateX(-4px) rotate(-1deg)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(220,38,38,0.6)' },
          '50%':       { boxShadow: '0 0 0 16px rgba(220,38,38,0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'emergency': '0 4px 15px rgba(220,38,38,.4)',
        'card':      '0 4px 24px rgba(0,0,0,.08)',
        'glow-red':  '0 0 30px rgba(220,38,38,.35)',
      },
      borderRadius: {
        'card': '1rem',
        '2xl':  '1rem',
        '3xl':  '1.5rem',
      },
    },
  },
  plugins: [],
}