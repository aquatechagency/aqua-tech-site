module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        'surface-container-lowest': '#010f1f',
        'surface-container-low': '#0d1c2d',
        'surface-container': '#122131',
        'surface-container-high': '#1c2b3c',
        'surface-container-highest': '#273647',
        'background': '#051424',
        'surface': '#051424',
        'primary': '#89ceff',
        'primary-container': '#00b4ff',
        'primary-fixed': '#c9e6ff',
        'on-primary': '#00344d',
        'on-primary-fixed': '#001e2f',
        'on-background': '#d4e4fa',
        'on-surface': '#d4e4fa',
        'on-surface-variant': '#bdc8d2',
        'outline': '#87929c',
        'outline-variant': '#3e4851',
        'secondary': '#bec6e0',
        'tertiary-fixed-dim': '#bcc7de'
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem'
      },
      spacing: {
        'stack-sm': '8px',
        'stack-md': '24px',
        'stack-lg': '48px',
        'gutter': '24px',
        'margin-mobile': '16px',
        'section-padding': '120px',
        'container-max': '1280px'
      },
      fontFamily: {
        'headline-xl': ['Inter', 'system-ui', 'sans-serif'],
        'headline-lg': ['Inter', 'system-ui', 'sans-serif'],
        'headline-md': ['Inter', 'system-ui', 'sans-serif'],
        'body-md': ['Inter', 'system-ui', 'sans-serif'],
        'body-lg': ['Inter', 'system-ui', 'sans-serif'],
        'label-sm': ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        'headline-xl': ['48px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'headline-lg-mobile': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'label-sm': ['12px', { lineHeight: '1.4', letterSpacing: '0.05em', fontWeight: '500' }]
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
};
