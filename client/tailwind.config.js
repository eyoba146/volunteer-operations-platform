/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0D5C46', // Refined Alpine Pine
          hover:   '#094434',
          light:   '#E8F5F1',
          tint:    '#F2F9F6',
          dark:    '#062D22',
        },
        canvas: {
          DEFAULT: '#F8FAFC', // Very light cool-tinted blue-grey near-white (slate-50)
          subdued: '#F1F5F9', // Flat tinted tile surface (slate-100)
          raised:  '#FFFFFF', // Elevated white cards
          inset:   '#E2E8F0', // Slate-200
          dark:    '#0F172A', // Slate-900
        },
        ink: {
          primary:   '#0F172A', // Near-black slate (slate-900)
          secondary: '#64748B', // Muted slate-500
          tertiary:  '#94A3B8', // Slate-400
          inverted:  '#FFFFFF',
        },
        border: {
          DEFAULT: '#E2E8F0', // Slate-200
          subdued: '#F1F5F9', // Slate-100
          light:   '#F8FAFC',
          strong:  '#0F172A',
        },
        // Role Accent Palettes (used for icon tiles, small highlights, dots)
        role: {
          applicant:       '#E58B05', // Saffron
          applicantLight:  '#FEF6E7',
          volunteer:       '#1E824C', // Grass Green
          volunteerLight:  '#EAF5EE',
          teamlead:        '#D63927', // Tomato Red
          teamleadLight:   '#FDECE9',
          manager:         '#0E6266', // Deep Teal
          managerLight:    '#E5F2F2',
          finance:         '#0F172A', // Deep Ink / Slate
          financeAccent:   '#84CC16', // Vibrant Lime
          financeLight:    '#F7FEE7',
          admin:           '#334155', // Slate-700
          adminLight:      '#F1F5F9',
        },
        // Telebirr brand accent
        telebirr: {
          DEFAULT: '#E58B05',
          dark: '#B26700',
          light: '#FFF9F0',
        }
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['"Schibsted Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'card': '24px',
        'inner': '16px',
        'tile': '14px',
        'pill': '9999px',
        'ticket': '12px',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(16, 24, 40, 0.04), 0 12px 32px -12px rgba(16, 24, 40, 0.08)',
        'soft-hover': '0 2px 4px rgba(16, 24, 40, 0.04), 0 16px 36px -10px rgba(16, 24, 40, 0.12)',
        'pill': '0 2px 8px rgba(16, 24, 40, 0.05)',
        'dock': '0 8px 30px rgba(15, 23, 42, 0.10)',
        'card': '0 1px 3px rgba(16, 24, 40, 0.04), 0 20px 25px -5px rgba(16, 24, 40, 0.05)',
        'ticket': '0 4px 16px rgba(16, 24, 40, 0.06)',
      },
    },
  },
  plugins: [],
}
