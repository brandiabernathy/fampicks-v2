/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      gridTemplateColumns: {
        'game': '1fr 20px 48px 20px 1fr',
      },
      maxWidth: {
        '8xl': '90rem',
      },
    },
  },
  plugins: [],
}
