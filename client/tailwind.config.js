/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F4F5F7', // Cool near-white (not cream, not beige)
          subdued: '#EBEDF0', // Cool light gray
          raised:  '#FFFFFF', // Pure crisp white
          inset:   '#E2E5E9', // Tactile cool inset
          dark:    '#111315', // Pure carbon
        },
        ink: {
          primary:   '#111315', // High-contrast deep carbon
          secondary: '#495057', // Clean neutral slate
          tertiary:  '#717A84', // Muted metadata
          inverted:  '#FFFFFF',
        },
        border: {
          DEFAULT: '#DDE1E5', // Structural divider
          subdued: '#EAEEF2', // Soft separator
          strong:  '#111315', // Heavy accent
        },
        // Role Dominant Fields
        role: {
          applicant:       '#E58B05', // Saffron
          applicantLight:  '#FEF5E7',
          volunteer:       '#1E824C', // Grass Green
          volunteerLight:  '#EAF5EE',
          teamlead:        '#D63927', // Tomato Red
          teamleadLight:   '#FDECE9',
          manager:         '#0E6266', // Deep Teal
          managerLight:    '#E5F2F2',
          finance:         '#111315', // Deep Ink
          financeAccent:   '#B4F000', // Electric Lime
          admin:           '#202328', // Charcoal
          adminLight:      '#E9EBEF',
        },
        // Telebirr brand accent
        telebirr: {
          DEFAULT: '#E58B05',
          dark: '#B26700',
        }
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'sans-serif'],
        sans: ['"Schibsted Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'ticket': '4px',
        'ticket-lg': '12px',
      },
      boxShadow: {
        'ticket': '0 4px 12px rgba(17, 19, 21, 0.06)',
        'float': '0 12px 32px rgba(17, 19, 21, 0.12)',
        'dock': '0 8px 30px rgba(17, 19, 21, 0.18)',
      },
    },
  },
  plugins: [],
}
