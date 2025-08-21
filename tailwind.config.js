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
        // Primary pistachio greens
        primary: '#A8D4A0',
        'primary-dark': '#8BB882',
        'primary-light': '#C5E4BE',
        
        // Backgrounds and surfaces
        background: '#F5F2ED',
        surface: '#FEFCF9',
        'surface-variant': '#EDE8E0',
        
        // Accent colors
        accent: '#7FA876',
        'accent-light': '#9BC092',
        
        // Secondary colors
        secondary: '#E8E3D8',
        'secondary-dark': '#D4CFC4',
        
        // Text colors
        'text-primary': '#3A4A32',
        'text-secondary': '#6B7A5E',
        'text-tertiary': '#8A9580',
        
        // Status colors
        success: '#6BA85A',
        warning: '#E6A555',
        error: '#C85A5A',
        info: '#7FA8C4',
        
        // Interactive states
        hover: '#F0EDE6',
        pressed: '#E8E3D8',
        disabled: '#C4BFB4',
        
        // Borders
        border: '#D8D3C8',
        divider: '#E5E0D5',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(58, 74, 50, 0.1)',
        'md': '0 4px 6px rgba(58, 74, 50, 0.1)',
        'lg': '0 10px 15px rgba(58, 74, 50, 0.1)',
      }
    },
  },
  plugins: [],
}