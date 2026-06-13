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
      fontFamily: {
        'serif': ['Noto Serif SC', 'Songti SC', 'SimSun', 'STSong', 'Georgia', 'Times New Roman', 'serif'],
        'slidefu': ['Slidefu', 'Georgia', 'serif'],
        'daoli': ['AlimamaDaoLiTi', 'LiSu', 'STLiti', 'serif'],
      }
    },
  },
  plugins: [],
}
