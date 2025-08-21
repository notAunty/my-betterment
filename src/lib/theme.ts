// Theme configuration with earthy shell tones and pastel greens
export const PistachioTheme = {
  colors: {
    // Primary pistachio greens (more pastel)
    primary: '#A8D4A0',      // Soft pastel pistachio green
    primaryDark: '#8BB882',  // Muted darker green for headers
    primaryLight: '#C5E4BE', // Very light pastel green for backgrounds
    
    // Earthy shell tones for backgrounds and surfaces
    background: '#F5F2ED',   // Warm shell beige background
    surface: '#FEFCF9',      // Soft cream white for cards
    surfaceVariant: '#EDE8E0', // Light shell tone for secondary surfaces
    
    // Accent colors using green primarily
    accent: '#7FA876',       // Muted green accent for buttons and highlights
    accentLight: '#9BC092',  // Lighter green accent for hover states
    
    // Secondary colors with shell undertones
    secondary: '#E8E3D8',    // Warm light beige for cards and dividers
    secondaryDark: '#D4CFC4', // Slightly darker shell tone
    
    // Text colors with earthy warmth
    text: '#3A4A32',         // Deep forest green for primary text
    textSecondary: '#6B7A5E', // Muted green-brown for secondary text
    textTertiary: '#8A9580',  // Light green-gray for tertiary text
    
    // Status colors (keeping standard but slightly muted)
    success: '#6BA85A',      // Muted success green
    warning: '#E6A555',      // Warm amber warning
    error: '#C85A5A',        // Muted error red
    info: '#7FA8C4',         // Soft blue for info
    
    // Border and divider colors
    border: '#D8D3C8',       // Soft shell-toned border
    divider: '#E5E0D5',      // Light divider with shell undertone
    
    // Interactive states
    hover: '#F0EDE6',        // Light shell tone for hover
    pressed: '#E8E3D8',      // Slightly darker for pressed state
    disabled: '#C4BFB4',     // Muted shell tone for disabled elements
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
  shadows: {
    sm: '0 1px 3px rgba(58, 74, 50, 0.1)',
    md: '0 4px 6px rgba(58, 74, 50, 0.1)',
    lg: '0 10px 15px rgba(58, 74, 50, 0.1)',
  }
};