/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'moonly-gold': '#c9a96e',
        'moonly-purple': '#6b5b95',
        'moonly-text': {
          DEFAULT: '#ffffff',
          secondary: 'rgba(255, 255, 255, 0.75)',
          muted: 'rgba(255, 255, 255, 0.5)',
        },
        'fate': {
          50: '#fdf8f0',
          100: '#f5e6d3',
          200: '#e8cfa8',
          300: '#d9b07a',
          400: '#c9935a',
          500: '#b0783e',
          600: '#8a5f32',
          700: '#634728',
          800: '#3e2e1a',
          900: '#1f170d',
        },
        'oriental': {
          'bg': '#f5f0e6',
          'bg-card': '#faf8f3',
          'accent': '#8b1a1a',
          'accent-light': '#a52a2a',
          'text': '#1a1a1a',
          'text-muted': '#666666',
          'text-secondary': '#444444',
          'border': '#d6d0c4',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-scale': 'fadeInScale 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 169, 110, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(201, 169, 110, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      fontFamily: {
        'serif': ['Noto Serif SC', 'Songti SC', 'SimSun', 'STSong', 'Georgia', 'Times New Roman', 'serif'],
        'slidefu': ['Slidefu', 'Georgia', 'serif'],
        'daoli': ['AlimamaDaoLiTi', 'LiSu', 'STLiti', 'serif'],
      }
    },
  },
  plugins: [],
}
