module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'login-bg': '#212121',
        'home-bg': 'linear-gradient(135deg, #b9cdcf, #f1f5e2, #d9ece9)'
      },
      height: {
        'code': '36rem'
      },
      minHeight: {
        'home': '100vh'
      },
      minWidth: {
        'login': '47rem'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('tailwind-scrollbar')]
}
