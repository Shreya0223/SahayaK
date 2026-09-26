/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#f7f6f1',
        paper: '#fffef9',
        pine: {
          50: '#eff5ef', 100: '#dcead9', 200: '#b9d4b4', 300: '#8fb889',
          400: '#5f9660', 500: '#2e6b3a', 600: '#22582e', 700: '#1c4a27',
          800: '#163d21', 900: '#0f2f1a', 950: '#0a2413',
        },
        royal: {
          50: '#eef1ff', 100: '#dfe5ff', 200: '#c1ccff', 300: '#9aabf8',
          400: '#7489ec', 500: '#4c56c9', 600: '#3743b8', 700: '#2c379b',
          800: '#232a7c', 900: '#1e2570', 950: '#141845',
        },
        navy: '#232a7c',
        peach: { 50: '#fdf3e7', 100: '#fbe6cc', 200: '#f7cf9c', 300: '#f2b268', 400: '#ee9a3f' },
        periwinkle: '#dbe2ff',
        ink: '#0f2f1a',
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,47,26,.05), 0 2px 8px rgba(15,47,26,.06)',
        pop: '0 12px 40px -12px rgba(15,47,26,.28)',
      },
      borderRadius: { xl2: '1.25rem' },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulse: { '0%,100%': { opacity: '1' }, '50%': { opacity: '.45' } },
      },
      animation: {
        'fade-up': 'fade-up .35s ease-out both',
        pulse: 'pulse 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
