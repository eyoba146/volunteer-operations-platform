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
          DEFAULT: '#FFFFFF', // Pure crisp white page canvas
          subdued: '#F1F3F6', // Tonal panel & button fill
          panel:   '#F7F8FA', // Panel tier background (#F7F8FA)
          sidebar: '#F7F8FA', // Sidebar tone (#F7F8FA)
          raised:  '#FFFFFF', // Raised tier card surface
          inset:   '#F1F3F6',
          dark:    '#111315',
        },
        ink: {
          primary:   '#111111', // Deep carbon text
          secondary: '#374151', // Clean neutral slate (meets 4.5:1 on light backgrounds)
          tertiary:  '#64748B', // Muted slate-500
          inverted:  '#FFFFFF',
        },
        border: {
          DEFAULT: '#EDEFF2', // Hairline divider only
          subdued: '#EDEFF2', // Hairline list row separator
          divider: '#EDEFF2', // Hairline divider
          input:   '#CBD2DA', // 1px input/select border
          strong:  'transparent', // No dark outlines
        },
        // Role Dominant Fields & Tonal Tints (4% - 6%)
        role: {
          applicant:       '#E58B05',
          applicantLight:  '#FEF7ED', // 5% tint
          volunteer:       '#1E824C',
          volunteerLight:  '#F0FDF4', // 5% tint
          teamlead:        '#D63927',
          teamleadLight:   '#FEF2F2', // 5% tint
          manager:         '#0E6266',
          managerLight:    '#F0FDFA', // 5% tint
          finance:         '#111315',
          financeLight:    '#F8FAFC',
          financeAccent:   '#784E0B',
          admin:           '#202328',
          adminLight:      '#F8FAFC',
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
        mono: ['"Hanken Grotesk"', 'sans-serif'],
      },
      borderRadius: {
        none: '0px',
        sm: '6px',
        DEFAULT: '16px',
        md: '12px',
        lg: '16px',
        panel: '16px',
        card: '16px',
        raised: '16px',
        input: '8px',
        button: '8px',
        ticket: '16px',
        'ticket-lg': '16px',
      },
      boxShadow: {
        none: '0 0 0 transparent',
        soft: '0 1px 2px rgba(16,24,40,0.05), 0 8px 24px -12px rgba(16,24,40,0.10)',
        raised: '0 1px 2px rgba(16,24,40,0.05), 0 8px 24px -12px rgba(16,24,40,0.10)',
        ticket: '0 1px 2px rgba(16,24,40,0.05), 0 8px 24px -12px rgba(16,24,40,0.10)',
        pass: '0 1px 2px rgba(16,24,40,0.05), 0 8px 24px -12px rgba(16,24,40,0.10)',
        receipt: '0 1px 2px rgba(16,24,40,0.05), 0 8px 24px -12px rgba(16,24,40,0.10)',
        'id-card': '0 1px 2px rgba(16,24,40,0.05), 0 8px 24px -12px rgba(16,24,40,0.10)',
        modal: '0 1px 3px rgba(16,24,40,0.08), 0 16px 36px -4px rgba(16,24,40,0.14)',
        floating: '0 1px 3px rgba(16,24,40,0.08), 0 16px 36px -4px rgba(16,24,40,0.14)',
      },
    },
  },
  plugins: [],
}
