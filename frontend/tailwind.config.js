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
        // Light mode colors
        light: {
          bg: '#FFFFFF',
          'bg-secondary': '#F9FAFB',
          'bg-tertiary': '#F3F4F6',
          text: '#111827',
          'text-secondary': '#6B7280',
          'text-tertiary': '#9CA3AF',
          border: '#E5E7EB',
        },
        // Dark mode colors
        dark: {
          bg: '#0F172A',
          'bg-secondary': '#1E293B',
          'bg-tertiary': '#334155',
          text: '#F8FAFC',
          'text-secondary': '#CBD5E1',
          'text-tertiary': '#94A3B8',
          border: '#475569',
        },
        // Primary green color (accent)
        primary: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E', // Main green
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        // Label colors
        label: {
          red: '#EF4444',
          orange: '#F97316',
          yellow: '#EAB308',
          green: '#22C55E',
          blue: '#3B82F6',
          purple: '#A855F7',
          pink: '#EC4899',
          gray: '#6B7280',
        },
      },
      fontFamily: {
        estedad: ['Estedad', 'sans-serif'],
      },
      animation: {
        'float-subtle': 'float-subtle 3s ease-in-out infinite',
        'typewriter': 'typewriter 2s steps(40) 1s 1 normal both',
      },
      keyframes: {
        'float-subtle': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'typewriter': {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
      },
      boxShadow: {
        'float': '0 8px 24px rgba(34, 197, 94, 0.15)',
      },
    },
  },
  plugins: [],
}
