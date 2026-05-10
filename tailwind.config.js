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
        'ink': {
          50: '#f5f5f4',
          100: '#e7e5e4',
          200: '#d6d3d1',
          300: '#a8a29e',
          400: '#78716c',
          500: '#57534e',
          600: '#44403c',
          700: '#292524',
          800: '#1c1917',
          900: '#0c0a09',
        }
      },
      fontFamily: {
        'serif': ['Georgia', 'Cambria', 'serif'],
      }
    },
  },
  plugins: [],
}
