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
        background: 'var(--background)',
        sidebar: 'var(--sidebar)',
        foreground: 'var(--foreground)',
        glass: 'var(--glass-bg)',
        'glass-border': 'var(--glass-border)',
        primary: {
          DEFAULT: 'var(--primary)',
          light: '#818cf8',
          dark: '#4f46e5',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          light: '#c084fc',
          dark: '#9333ea',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'system-gradient': 'linear-gradient(135deg, #1e1e2f 0%, #111119 100%)',
        'accent-gradient': 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
