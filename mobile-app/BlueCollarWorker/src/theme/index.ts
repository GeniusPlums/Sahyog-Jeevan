// Theme configuration for the mobile app

export const colors = {
  primary: '#2563eb', // Blue color similar to web app
  primaryLight: 'rgba(37, 99, 235, 0.1)',
  secondary: '#6b7280',
  secondaryLight: 'rgba(107, 114, 128, 0.1)',
  background: '#f8fafc',
  card: '#ffffff',
  text: '#1e293b',
  textMuted: '#64748b',
  border: 'rgba(37, 99, 235, 0.2)',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  inputBackground: '#ffffff',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  fontWeights: {
    normal: 'normal',
    medium: '500',
    semibold: '600',
    bold: 'bold',
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
};
