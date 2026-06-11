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
        'kimi': {
          bg: '#0a0e27',
          'bg-light': '#121a35',
          'bg-card': '#ffffff',
          'accent': '#3b82f6',
          'accent-light': '#60a5fa',
          'text': '#ffffff',
          'text-muted': '#94a3b8',
          'text-secondary': '#cbd5e1',
        },
      },
      fontFamily: {
        'serif': ['Georgia', 'Cambria', 'serif'],
        'slidefu': ['Slidefu', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
