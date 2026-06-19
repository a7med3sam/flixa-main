import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: {
          lighter: '#C8FAD6',
          light: '#34c759',
          DEFAULT: '#71dd8c',
          dark: '#385737',
          darker: '#004B50',
        },
        secondary: {
          lighter: '#EFD6FF',
          light: '#C684FF',
          DEFAULT: '#8E33FF',
          dark: '#5119B7',
          darker: '#27097A',
        },
        info: {
          lighter: '#CAFDF5',
          light: '#61F3F3',
          DEFAULT: '#00B8D9',
          dark: '#006C9C',
          darker: '#003768',
        },
        success: {
          lighter: '#D3FCD2',
          light: '#77ED8B',
          DEFAULT: '#22C55E',
          dark: '#118D57',
          darker: '#065E49',
        },
        warning: {
          lighter: '#FFF5CC',
          light: '#FFD666',
          DEFAULT: '#FFAB00',
          dark: '#B76E00',
          darker: '#7A4100',
        },
        error: {
          lighter: '#FFE9D5',
          light: '#FFAC82',
          DEFAULT: '#FF3B30',
          dark: '#B71D18',
          darker: '#7A0916',
        },
        grey: {
          0: '#FFFFFF',
          100: '#F9FAFB',
          200: '#F4F6F8',
          300: '#DFE3E8',
          400: '#C4CDD5',
          500: '#919EAB',
          600: '#637381',
          700: '#454F5B',
          800: '#212B36',
          900: '#161C24',
        },
      },
      fontFamily: {
        sans: ['DINNextLTArabic', 'Cairo', 'Helvetica', 'Arial', 'sans-serif'],
        secondary: ['Kufam', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
        cardDark: '0 0 2px 0 rgba(0, 0, 0, 0.2), 0 12px 24px -4px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
