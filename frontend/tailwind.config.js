/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          lime: '#84cc16',   // Calm lime-green
          coral: '#f87171', // Soft rose-red
        },
        brand: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        slate: {
          850: '#1e293b',
          950: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2.5s infinite ease-in-out',
        'morph-slow': 'morphSlow 20s ease-in-out infinite alternate',
        'morph-medium': 'morphMedium 15s ease-in-out infinite alternate',
        'morph-fast': 'morphFast 12s ease-in-out infinite alternate',
        'ripple': 'ripple 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.015)', opacity: '0.95' },
        },
        morphSlow: {
          '0%': { borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%', transform: 'translate(0px, 0px) rotate(0deg)' },
          '50%': { borderRadius: '70% 30% 52% 48% / 60% 40% 60% 40%', transform: 'translate(40px, -60px) rotate(180deg)' },
          '100%': { borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%', transform: 'translate(0px, 0px) rotate(360deg)' }
        },
        morphMedium: {
          '0%': { borderRadius: '50% 50% 30% 70% / 50% 60% 40% 50%', transform: 'translate(0px, 0px) rotate(0deg)' },
          '50%': { borderRadius: '30% 70% 70% 30% / 50% 30% 70% 50%', transform: 'translate(-50px, 50px) rotate(-180deg)' },
          '100%': { borderRadius: '50% 50% 30% 70% / 50% 60% 40% 50%', transform: 'translate(0px, 0px) rotate(-360deg)' }
        },
        morphFast: {
          '0%': { borderRadius: '60% 40% 60% 40% / 40% 60% 40% 60%', transform: 'translate(0px, 0px) rotate(0deg)' },
          '50%': { borderRadius: '40% 60% 40% 60% / 60% 40% 60% 40%', transform: 'translate(30px, 30px) rotate(90deg)' },
          '100%': { borderRadius: '60% 40% 60% 40% / 40% 60% 40% 60%', transform: 'translate(0px, 0px) rotate(180deg)' }
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '0.5', filter: 'blur(4px)' },
          '100%': { transform: 'scale(1.2)', opacity: '0', filter: 'blur(16px)' }
        }
      }
    },
  },
  plugins: [],
}
