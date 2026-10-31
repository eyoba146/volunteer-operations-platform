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
          DEFAULT: '#F4F5F7', // Cool off-white
          subdued: '#E8EBEF', // Clean light gray
          raised:  '#FFFFFF', // Pure crisp white
          inset:   '#DEE2E6', // Tactile cool inset
          dark:    '#111315', // Pure carbon
        },
        ink: {
          primary:   '#111111', // High-contrast deep carbon
          secondary: '#374151', // Clean neutral slate (meets 4.5:1 on light backgrounds)
          tertiary:  '#4B5563', // Muted metadata (WCAG AA compliant >= 4.5:1 on white)
          inverted:  '#FFFFFF',
        },
        border: {
          DEFAULT: '#D5DAE1', // Soft slate border for standard cards and panels
          subdued: '#E2E8F0', // Soft secondary separator
          strong:  '#111111', // Near-black for signatures and primary outlines
          input:   '#475569', // 1.5px dark slate input border
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
          financeAccent:   '#784E0B', // High-contrast amber/gold for light surfaces
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
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['"Hanken Grotesk"', 'sans-serif'],
        mono: ['"Hanken Grotesk"', 'sans-serif'], // Replace monospace with clean sans
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        DEFAULT: '8px',
        md: '8px',
        lg: '10px',
        card: '10px',
        input: '8px',
        button: '8px',
        'ticket': '4px',
        'ticket-lg': '6px',
      },
      boxShadow: {
        'none': '0 0 0 transparent',
        'sm': '1px 1px 0 #111111',
        'ticket': '4px 4px 0 #111111',
        'pass': '4px 4px 0 #111111',
        'receipt': '4px 4px 0 #111111',
        'id-card': '4px 4px 0 #111111',
        'modal': '8px 8px 0 #111111',
      },
    },
  },
  plugins: [],
}
