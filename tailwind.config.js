/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ── Stitch Design System Colors ──────────────────────────────────────
      colors: {
        // Stitch tokens
        "surface-dim":                  "#d2d9f4",
        "surface-container-high":       "#e2e7ff",
        "on-surface-variant":           "#424754",
        "tertiary-fixed-dim":           "#ffb786",
        "on-error":                     "#ffffff",
        "on-tertiary-fixed-variant":    "#723600",
        "outline":                      "#727785",
        "on-tertiary-container":        "#fffbff",
        "surface-container-highest":    "#dae2fd",
        "on-primary-fixed-variant":     "#004395",
        "on-primary-container":         "#fefcff",
        "surface-container":            "#eaedff",
        "primary-fixed-dim":            "#adc6ff",
        "on-error-container":           "#93000a",
        "inverse-primary":              "#adc6ff",
        "on-secondary":                 "#ffffff",
        "on-secondary-container":       "#fffbff",
        "secondary":                    "#4b41e1",
        "tertiary-fixed":               "#ffdcc6",
        "error-container":              "#ffdad6",
        "surface-variant":              "#dae2fd",
        "secondary-fixed":              "#e2dfff",
        "on-surface":                   "#131b2e",
        "outline-variant":              "#c2c6d6",
        "secondary-container":          "#645efb",
        "surface-tint":                 "#005ac2",
        "on-primary-fixed":             "#001a42",
        "tertiary-container":           "#b75b00",
        "secondary-fixed-dim":          "#c3c0ff",
        "on-tertiary-fixed":            "#311400",
        "primary-fixed":                "#d8e2ff",
        "surface-container-low":        "#f2f3ff",
        "tertiary":                     "#924700",
        "on-tertiary":                  "#ffffff",
        "on-background":                "#131b2e",
        "surface":                      "#faf8ff",
        "surface-container-lowest":     "#ffffff",
        "primary":                      "#0058be",
        "primary-container":            "#2170e4",
        "background":                   "#faf8ff",
        "inverse-on-surface":           "#eef0ff",
        "on-secondary-fixed":           "#0f0069",
        "surface-bright":               "#faf8ff",
        "inverse-surface":              "#283044",
        "on-secondary-fixed-variant":   "#3323cc",
        "on-primary":                   "#ffffff",
        "error":                        "#ba1a1a",
        // Legacy dark brand tokens (used by Login/Signup)
        brand: {
          50:  '#f0f3ff',
          100: '#e1e7ff',
          200: '#c5d0ff',
          300: '#9aa9ff',
          400: '#6875ff',
          500: '#4f46e5',
          600: '#4338ca',
          700: '#3730a3',
          800: '#2e2984',
          900: '#27246a',
          950: '#17143f',
        },
      },

      // ── Stitch Font Families ─────────────────────────────────────────────
      fontFamily: {
        sans:           ['Inter', 'sans-serif'],
        outfit:         ['Outfit', 'sans-serif'],
        geist:          ['Geist', 'sans-serif'],
        'body-lg':      ['Inter'],
        'body-md':      ['Inter'],
        'body-sm':      ['Inter'],
        'headline-md':  ['Inter'],
        'headline-lg':  ['Inter'],
        'display-lg':   ['Inter'],
        'label-sm':     ['Geist'],
        'label-md':     ['Geist'],
      },

      // ── Stitch Font Sizes ────────────────────────────────────────────────
      fontSize: {
        'body-sm':             ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-md':             ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-lg':             ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'label-sm':            ['12px', { lineHeight: '14px', letterSpacing: '0.05em', fontWeight: '500' }],
        'label-md':            ['14px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '500' }],
        'headline-md':         ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-lg':         ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-lg-mobile':  ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-lg':          ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
      },

      // ── Stitch Spacing ───────────────────────────────────────────────────
      spacing: {
        'xs':             '0.25rem',
        'sm':             '0.5rem',
        'md':             '1rem',
        'lg':             '1.5rem',
        'xl':             '2rem',
        '2xl':            '3rem',
        'gutter':         '24px',
        'margin-mobile':  '16px',
        'container-max':  '1280px',
      },

      // ── Stitch Border Radius ─────────────────────────────────────────────
      borderRadius: {
        DEFAULT: '0.25rem',
        lg:      '0.5rem',
        xl:      '0.75rem',
        '2xl':   '1rem',
        '3xl':   '1.5rem',
        full:    '9999px',
      },

      maxWidth: {
        'container-max': '1280px',
      },

      // ── Animations (kept from original) ──────────────────────────────────
      animation: {
        'fade-in':     'fadeIn 0.5s ease-out forwards',
        'slide-up':    'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
