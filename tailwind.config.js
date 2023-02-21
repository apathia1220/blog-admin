module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'login-bg': '#212121'
      },
      height: {
        'code': '36rem'
      },
      minHeight: {
        'home': '100vh'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('tailwind-scrollbar')]
}
