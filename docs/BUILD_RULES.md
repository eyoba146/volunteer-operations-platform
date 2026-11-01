# VTS Permanent Build Rules: "The Trail" (Surface Reset & Signature Edition)
**Permanent Architectural & Aesthetic Constraints for Volunteer Tracking System**

All engineering and design work must strictly comply with these rules. The surface and signature rules below take absolute precedence over any older guidelines.

---

## 1. Absolute Surface & Structure Rules (Part 0 Reset)

1. **Pure White Page Canvas**: The main page canvas is pure white (`#FFFFFF`). No grey page backgrounds anywhere.
2. **Sidebar Tone Separation**: The sidebar uses a very light tint (`#F7F8FA`) with no right border, so sidebar and content separate cleanly by tone rather than lines.
3. **Three Surface Tiers Only**:
   - **Panel Tier**: `#F7F8FA` fill, no border, 16 px radius (`rounded-[16px]`), for grouped content.
   - **Raised Tier**: White with a very soft shadow (`0 1px 2px rgba(16,24,40,0.05), 0 8px 24px -12px rgba(16,24,40,0.10)`), no border, 16 px radius (`rounded-[16px]`). Used ONLY for the page's main hero card, tickets/passes, and floating elements (menus, dialogs, drawers, sticky bars).
   - **Plain Tier**: No container. Heading and content sit directly on the white canvas, with 40 to 56 px of vertical space between sections.
4. **No Boxes Inside Boxes**: Never put a bordered or filled box inside another box. Inside a card or panel, separate parts using generous whitespace or a hairline divider (`#EDEFF2`).
5. **Borders None by Default**:
   - Strictly forbidden: Any dark, black, or slate-800/900 border, any `border-2`, any bottom-only or right-only border, and any zero-blur offset shadow (`shadow-[4px_4px_0_#111111]`).
   - Allowed exceptions only:
     - Text inputs and selects: 1 px border in `#CBD2DA` with a 2 px focus ring in the role brand colour.
     - Ticket perforations: 1 px dashed hairline in `#EDEFF2`.
     - List row dividers: 1 px hairline in `#EDEFF2`.
6. **Button Hierarchy**:
   - At most **one filled primary button** per visible section (`bg-ink-primary text-white border-none rounded-[8px]`).
   - Secondary buttons: Tonal fill (`#F1F3F6`, no border, dark text `text-ink-primary`, hover `#E8EBEF`).
   - Tertiary buttons: Clean text links with an arrow (`→`).
   - Row-level actions (Check in, View details, Join): Tonal buttons or text links, never black and never outlined.
   - Every button-like element triggers a Material-style circular ripple expanding from the click coordinates (or center for keyboard). 0 press/push translations or scale effects.
7. **Hero Cards**: Main hero cards receive a subtle 4% to 6% tint of the role colour with a `TopoBackdrop` contour pattern, never plain grey.
8. **Tabs & Segmented Controls**: Clean underline tabs (2 px indicator line in the role colour, no grey container).
9. **Table Headers**: Plain 14 px medium sentence-case slate-500 text with a hairline divider (`#EDEFF2`) below; zero grey bands.
10. **Stat Figures**: Large bold numerals on white canvas or panels; zero stat boxes.

---

## 2. Five Shared Signature Components

1. **TopoBackdrop**: Subtle static SVG contour pattern generated from noise at 6% to 9% opacity in the role accent colour. Never a gradient.
2. **TrailMeter**: Replaces every rank progress bar. Continuous SVG route with the 4 ranks as waypoints (Member, Senior Member, Team Lead, Manager). Solid line for completed segments, dashed for upcoming. Real avatar marker with distance callout ("43.5 hours to Senior Member"). Variants: full (hero & rank page), compact (sidebar footer for Volunteer & Team Lead), summit (Manager).
3. **TicketCard**: Used for every activity everywhere. Notched ticket silhouette with side cutouts, dashed perforation, Raised tier soft shadow, no border. Left stub: big day number, small month, time. Body: title, place, spots-left meter. Status: dot plus plain words. Next activity is a larger featured ticket.
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
