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
          secondary: '#374151', // Clean neutral slate
          tertiary:  '#6B7280', // Muted metadata
          inverted:  '#FFFFFF',
        },
        border: {
          DEFAULT: '#111111', // Structural divider - 2px solid near-black
          subdued: '#D1D5DB', // Soft secondary separator
          strong:  '#111111', // Heavy accent
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
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['"Hanken Grotesk"', 'sans-serif'],
        mono: ['"Hanken Grotesk"', 'sans-serif'], // Replace monospace with clean sans
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        'ticket': '4px',
        'ticket-lg': '6px',
      },
      boxShadow: {
        'none': '0 0 0 transparent',
        'sm': '2px 2px 0 #111111',
        'hard': '4px 4px 0 #111111',
        'hard-sm': '2px 2px 0 #111111',
        'hard-lg': '6px 6px 0 #111111',
        'hard-xl': '8px 8px 0 #111111',
        'ticket': '4px 4px 0 #111111',
        'float': '6px 6px 0 #111111',
        'dock': '4px 4px 0 #000000',
        'modal': '8px 8px 0 #111111',
      },
    },
  },
  plugins: [],
}
