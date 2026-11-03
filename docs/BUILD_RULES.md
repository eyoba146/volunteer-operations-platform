# VTS Permanent Build Rules: "The Trail" (Zero Borders & Signature Edition)
**Permanent Architectural & Aesthetic Constraints for Volunteer Tracking System**

All engineering and design work must strictly comply with these rules. The Zero Border rules below take absolute precedence over any older guidelines.

---

## 1. Absolute Surface & Structure Rules (Zero Borders)

1. **Pure White Page Canvas**: The main page canvas is pure white (`#FFFFFF`). No grey page backgrounds anywhere.
2. **Sidebar Tone Separation**: The sidebar uses a very light tint (`#F7F8FA`) with no right border or dividing line, so sidebar and content separate cleanly by tone and space rather than lines.
3. **Three Surface Tiers Only**:
   - **Panel Tier**: `#F7F8FA` fill, no border, 16 px radius (`rounded-[16px]`), for grouped content.
   - **Raised Tier**: White with a very soft shadow (`0 1px 2px rgba(16,24,40,0.05), 0 8px 24px -12px rgba(16,24,40,0.10)`), no border, 16 px radius (`rounded-[16px]`). Used ONLY for the page's main hero card, tickets/passes, and floating elements (menus, dialogs, drawers, toasts, sticky bars).
   - **Plain Tier**: No container. Heading and content sit directly on the white canvas, with 40 to 56 px of vertical space between sections.
4. **No Borders Anywhere in the UI**:
   - Zero borders: Not dark, not light, not 1 px hairlines, not dividers, not on cards, panels, tabs, tables, buttons, chips, avatars, dialogs, menus, sidebar, top header, or breadcrumbs. Separation comes strictly from tone, space, and the one approved soft shadow.
   - **Inputs and Selects**: Tonal fill `#F1F3F6`, 12 px radius (`rounded-[12px]`), no border. Focus only: 2 px ring in the role brand colour (`outline` or `box-shadow` on `:focus-visible`, nothing when unfocused). Errors: red text below the field plus a light red tonal fill, never a red border.
   - **Buttons**: Filled primary (`bg-ink-primary text-white border-none rounded-[8px]`), tonal secondary (`#F1F3F6` fill, no border, dark text `text-ink-primary`, hover `#E8EBEF`), text-link tertiary with arrow (`→`). No outlined buttons anywhere.
   - **Tabs**: No border around the tab bar. Active tab indicator is a 2 px bar drawn with a pseudo-element background in the role colour, not a border.
   - **Tables and Lists**: No row lines, no header line. Separate rows with space (4 to 8 px gap) and a subtle alternating tonal band on hover only. Section separators: 40 to 56 px vertical space, no divider lines.
   - **Sidebar and Top Header**: No right or bottom edge lines; separate by the sidebar's `#F7F8FA` tint and generous whitespace.
   - **Chips and Status**: Dot plus text, or tonal fill, no border. Avatars and user images: no ring.
   - **Dialogs, Menus, Drawers, Toasts**: Raised soft shadow only, no borders.
   - **Tickets**: Notches and dashed perforation must be drawn as SVG or a background image, never as a border.
   - **Dividers Inside Cards**: Deleted; separate parts using generous whitespace.
5. **Ripple Effect**: Every button-like element triggers a Material-style circular ripple expanding from the click coordinates (or center for keyboard). 0 press/push translations or scale effects.
6. **Hero Cards**: Main hero cards receive a subtle 4% to 6% tint of the role colour with a `TopoBackdrop` contour pattern, never plain grey.
7. **Stat Figures**: Large bold numerals on white canvas or panels; zero stat boxes.

---

## 2. Five Shared Signature Components

1. **TopoBackdrop**: Subtle static SVG contour pattern generated from noise at 6% to 9% opacity in the role accent colour. Never a gradient.
2. **TrailMeter**: Replaces every rank progress bar. Continuous SVG route with the 4 ranks as waypoints (Member, Senior Member, Team Lead, Manager). Solid line for completed segments, dashed for upcoming. Real avatar marker with distance callout ("43.5 hours to Senior Member"). Variants: full (hero & rank page), compact (sidebar footer for Volunteer & Team Lead), summit (Manager).
3. **TicketCard**: Used for every activity everywhere. Notched ticket silhouette with side cutouts, SVG dashed perforation, Raised tier soft shadow, no border. Left stub: big day number, small month, time. Body: title, place, spots-left meter. Status: dot plus plain words. Next activity is a larger featured ticket.
4. **JourneyLog**: Replaces the Logged hours table and any date-based ledger. Vertical spine with status dots (filled=approved, hollow=waiting, amber=needs attention, crossed=declined). Month markers, large hour/amount numerals on the right, expandable detail drawer.
5. **MomentOverlay**: Celebratory moments under 2.5 seconds, skippable, reduced-motion safe, never confetti. Payment success, hours approved, promotion approved.

---

## 3. Typography & Copy Standards

1. **Headlines**: **Bricolage Grotesque** (`@fontsource/bricolage-grotesque`), Bold (700). Sentence case always.
2. **Body & Controls**: **Hanken Grotesk** (`@fontsource/hanken-grotesk`), 16 px (`text-base`) for body, 14 px (`text-sm`) for secondary, minimum 13 px.
3. **No Eyebrow Labels**: Remove all small uppercase or monospace badges above titles. Page headers consist strictly of: title, at most one short plain sentence, and one primary action.
4. **No Vendor or Internal Jargon**: Never use *API, token, encrypted, Brevo, institutional, system of record, governance bureau, Directorate*.
5. **Strict WCAG AA Contrast**: Zero contrast failures in any state.
6. **No Emojis Anywhere**: Use **Phosphor Icons** (`@phosphor-icons/react`) exclusively in bold weight.
7. **Status Terms**: Waiting for approval, Approved, Needs a quick look, Declined.
8. **Rank Names**: Always capitalized: `Member`, `Senior Member`, `Team Lead`, `Manager`.
