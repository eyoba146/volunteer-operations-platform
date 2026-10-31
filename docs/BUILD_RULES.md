# VTS Permanent Build Rules: "The Trail" (Phase 5 Polish)
**Permanent Architectural & Aesthetic Constraints for Volunteer Tracking System**

All engineering and design work must strictly comply with these rules.

---

## 1. Absolute Banned Patterns (Never Use These)

1. **No Cream, Parchment or Beige Backgrounds**: The neutral ground is a clean, cool off-white (`#F4F5F7`), never antiqued beige or yellowed paper.
2. **No Serif Headlines**: Headlines must NEVER use serifs (no Fraunces, Georgia, Times). Headlines use **Bricolage Grotesque** at bold weights (700/800).
3. **No Monospace or Techy Fonts**: REMOVED every monospace and condensed tech font. Tabular data, codes, and labels use clean, confident grotesque type (**Hanken Grotesk**).
4. **No Uppercase Headlines, Card Titles, Buttons, or Eyebrow Badges**: Sentence-case everywhere. Never place tiny uppercase monospace badges above headings.
5. **No Four Identical Boxes in a Row**: Never show four identical boxes or cards in a row. Use interactive timelines, rich lead detail cards, lead numerals with inline lists, and varied-width scrolling strips.
6. **No Multiple Black Buttons Per Section**: Maximum ONE black-filled button per visible section. All secondary buttons are outlined or text links with an arrow (`→`).
7. **No Large Black Fields or Dark Top Bars**: Top navigation is light white with a 1 px border. Role indicators appear as small color markers next to avatars and active tab underlines.
8. **No Hard Offset Shadows Except on Ticket Passes**: Hard offset shadows (`4px 4px 0 #111111`) are strictly limited to signature ticket passes (volunteer ID pass, certificate, receipt, activity tickets). Standard cards and panels use soft slate borders and no hard shadow.
9. **No Soft Blurred Shadows, Glowing Blobs, or Glassmorphism**: Backgrounds are solid, flat colour blocks and bands.
10. **No Emojis Anywhere**: Zero emojis in UI text, seed data, notification banners, toasts, empty states, or source code.
11. **No Made-Up Benefits or Perks**: Never invent benefits not in `docs/REQUIREMENTS.md` (e.g. Duty Insurance Coverage). Use only real verified criteria.
12. **No Mountain / Extreme Elevation Jargon**: Avoid "Altitude Stations", "Elevation 60m", "Basecamp", "Summit". Use clear plain terms: "Starting rank", "Ranks and verified milestones", "Manager".
13. **No Lucide, Feather, or Heroicons**: Use **Phosphor Icons** (`@phosphor-icons/react`) exclusively in bold weight.
14. **No Developer or Vendor Jargon in Interface**:
    - NEVER use: *API, token, encrypted, secured, migration, webhook, null, undefined, 401, 500, OTP, Brevo, institutional, system of record, governance bureau, Directorate*.
    - The client is a private volunteer company, not a government agency.
    - Vendor names are internal only; email simulation is labeled **"Preview Emails"** and lives only inside Super Admin demo tools and on the sign-in demo panel.

---

## 2. Typography Rules

- **Headlines**: **Bricolage Grotesque** (`@fontsource/bricolage-grotesque`), Bold/ExtraBold (700/800). Tight tracking, sentence case. Card titles 20 to 24 px.
- **Numerals**: Rendered large and punchy in **Bricolage Grotesque** (`font-display font-black`).
- **Body Text**: **Hanken Grotesk** (`@fontsource/hanken-grotesk`), weights 400, 500, 600, 700. Body text 16 px (`text-base`) with generous line height (`leading-relaxed` / 1.6). Secondary text 14 px (`text-sm`). Nothing below 13 px (`text-[13px]`).
- **Contrast**: Strict WCAG AA compliance (minimum 4.5:1 for normal text, 3:1 for large text). Zero text-contrast failures in any state.
- **Labels**: Sentence-case only, bold sans-serif (`text-sm font-bold text-ink-primary`).

---

## 3. Borders, Depth & Structure

- **Regular Cards and Panels**: Pure white background (`#FFFFFF`), 1 px border in soft slate (`#D5DAE1`), radius 10 px (`rounded-[10px]`), no hard shadow.
- **Inputs & Secondary Controls**: 1.5 px dark slate border (`border-[#475569]`), radius 8 px (`rounded-[8px]`), no hard shadow.
- **Primary Buttons**: Exactly one black-filled button per visible section (`bg-ink-primary text-white border border-ink-primary rounded-[8px]`).
- **Secondary Buttons & Links**: Outlined with 1.5 px border or clean text links with an arrow (`→`).
- **Top Navigation Bar**: Clean light white background (`bg-white border-b border-[#D5DAE1]`). Role color indicator appears as a small circle next to user avatar and the active tab underline.
- **Signature Ticket Passes**: Kept exclusively for tickets, volunteer ID passes, certificates, and receipts: notched corners (`clipPath`), stub dividers, and hard offset shadows (`shadow-[4px_4px_0_#111111]`).

---

## 4. Role Colour Fields

Every user role has its identifiable accent marker and palette:

| Role | Accent Colour | Hex Code | High-Contrast Pairing |
| :--- | :--- | :--- | :--- |
| **Applicant** | **Saffron** | `#E58B05` | Near-Black (`#111111`) & White |
| **Volunteer** | **Grass Green** | `#1E824C` | White & Slate (`#111111`) |
| **Team Lead** | **Tomato Red** | `#D63927` | White & Black |
| **Manager** | **Deep Teal** | `#0E6266` | White & Pale Seafoam |
| **Finance** | **Deep Ink** | `#111315` | Amber / Electric Lime (`#784E0B`) |
| **Super Admin** | **Charcoal** | `#202328` | Amber Alert (`#D97706`) |

Canvas: Cool off-white (`#F4F5F7`). Cards: Pure crisp white (`#FFFFFF`). Primary ink: High-contrast near-black (`#111111`).

---

## 5. Plain Language Dictionary

| Instead of Developer / Institutional / Banned Jargon | Always Say |
| :--- | :--- |
| *Civic Service Register of Ethiopia* | **Volunteer Tracking System (VTS)** |
| *Program Operations Directorate / Directorate* | **Operations Desk** |
| *System Administration* | **Admin home** |
| *Go to Workspace* | **Open my space** |
| *Official Volunteer ID Pass* | **Volunteer ID pass** |
| *System audit trails / Audit log* | **Activity history** |
| *Dynamic rank qualification rules* | **Rank rules** |
| *Qualification requirements* | **Rank criteria / Training requirements** |
| *Regional hubs* | **Community areas** |
| *Altitude Stations / Elevation 60m / Basecamp / Summit* | **Starting rank / Stages of advancement / Manager** |
| *Duty Insurance Coverage* | **[Omitted - not in requirements]** |
| *Authenticate / Authorization* | **Sign in** |
| *Initiate payment transaction* | **Pay with Telebirr** |
| *Brevo Simulator* | **Preview Emails (admin & sign-in demo panel only)** |
| *OTP* | **6-digit code** |
| *Reset token* | **Recovery code** |
| *404 / 500 / Null error* | **We could not find that page / Something went wrong** |
| *Threshold requirements met* | **Ready for promotion** |
