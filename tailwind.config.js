/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          teal: {
            light: '#E2F0EC',
            DEFAULT: '#528276',
            dark: '#3A5F56',
            accent: '#79B4A6',
          },
          purple: {
            light: '#F1ECF8',
            DEFAULT: '#856BA9',
            dark: '#5F497E',
            accent: '#AE95D4',
          },
          slate: {
            50: '#F8FAFC',
            100: '#F1F4F9',
            200: '#E2E8F0',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          }
        }
      },
      fontFamily: {
        vazir: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(112, 128, 160, 0.12)',
        'soft-lg': '0 20px 40px -15px rgba(112, 128, 160, 0.18)',
        'glass': '0 8px 32px 0 rgba(133, 107, 169, 0.08)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
