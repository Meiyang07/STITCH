/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F2EC',
        ink: '#111111',
        charcoal: '#232323',
        warm: '#D8D0C3',
        muted: '#6F6A62',
        gold: '#9C7A46'
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'Arial', 'sans-serif']
      },
      boxShadow: {
        soft: '0 18px 60px rgba(17,17,17,.08)'
      }
    }
  },
  plugins: []
}
