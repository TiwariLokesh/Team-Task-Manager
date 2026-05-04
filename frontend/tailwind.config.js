/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        steel: '#475569',
        cloud: '#f8fafc',
        mist: '#eef2f7',
        ocean: '#2563eb',
        glow: '#38bdf8',
        amber: '#f59e0b',
        rose: '#f43f5e',
        mint: '#10b981',
      },
      boxShadow: {
        soft: '0 18px 40px -24px rgba(15, 23, 42, 0.45)',
      },
    },
  },
  plugins: [],
}

