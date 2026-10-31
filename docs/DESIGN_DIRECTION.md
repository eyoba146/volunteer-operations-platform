# VTS Design Direction: "The Trail" (Phase 5 Polish & Tone-Down)
**Art Direction & Interface Specification for Volunteer Tracking System**

---

## 1. Research & External Visual References

To eliminate generic AI design defaults (cream backgrounds, serif headlines, uppercase monospace eyebrows, hairline-bordered boxes, and floating card grids), we draw directly from 12 distinct, high-impact interfaces across wayfinding, editorial design, transport systems, and kinetic web typography:

1. **Studio Dumbar / DEMO Festival**  
   *URL*: https://studiodumbar.com/work/demo-festival  
   *Takeaway*: Bold rectangular grotesque typography; primary flat field colors; kinetic typographic scale that commands immediate attention.
2. **Koto Studio / Bolt Rebrand**  
   *URL*: https://koto.studio/work/bolt/  
   *Takeaway*: Electric full-bleed flat fields of color; heavy grotesque numerals treated as primary visual anchors; avoidance of muddy gradient lighting.
3. **DIA Studio / Basel Marathon & Wayfinding Systems**  
   *URL*: https://dia.tv  
   *Takeaway*: The route line as a living interface element; animated continuous path that connects start to finish; waypoints that mark altitude and stage completion.
4. **Collins / San Francisco Symphony**  
   *URL*: https://wearecollins.com/work/sf-symphony/  
   *Takeaway*: Expressive grotesque letterforms used in architectural sizes without serifs; dynamic typographic voice that feels human, vibrant, and alive.
5. **Swiss Alpine Club (SAC) / Swiss Alpine Route Passes**  
   *URL*: https://www.alpen-route.ch  
   *Takeaway*: Altitude as a progression metric; trail route elevations marked with notched cards and bold waypoints; physical trail-marker clarity.
6. **Resident Advisor / RA Tickets & Event Passes**  
   *URL*: https://ra.co  
   *Takeaway*: Authentic notched and cut-corner ticket pass silhouettes; bold barcode and stub sections; physical badge aesthetics applied to digital cards.
7. **Telebirr SuperApp Ethiopia (Ethio Telecom)**  
   *URL*: https://www.ethiotelecom.et/telebirr/  
   *Takeaway*: Vibrant flat saffron/yellow transaction vouchers; large bold Birr currency numerals; zero generic card grids; instant mobile USSD confirmation patterns.
8. **It’s Nice That / Printed Matter & Editorial Feature Issues**  
   *URL*: https://itsnicethat.com  
   *Takeaway*: Staggered asymmetric rails; overlapping paper ticket layers; unexpected layout rhythm that never repeats between sections.
9. **AllTrails Route Maps & Summit Progress**  
   *URL*: https://alltrails.com  
   *Takeaway*: Ascending trail elevation graphs; waypoints representing physical checkpoints; progress visualized as ground covered along an actual route rather than a generic progress bar.
10. **Awwwards SOTD / Nike Trail Running Experience**  
    *URL*: https://awwwards.com  
    *Takeaway*: SVG stroke drawing animations along winding paths; oversized numerals (01, 02, 03, 04) that anchor multi-step guides without tiny icons.
11. **Siteinspire / Studio Freight Portfolio**  
    *URL*: https://siteinspire.com  
    *Takeaway*: Mobile floating bottom dock with thumb-accessible tools; horizontal snap tracks that invite tactile sliding; departure from traditional hamburger menus.
12. **Godly / Linear 2024 Command Surface**  
    *URL*: https://godly.website  
    *Takeaway*: Desktop slim top rail with active zone accents and command palette search; elimination of bulky dark sidebars in favor of focused work areas.

---

## 2. Art Direction Concept: "The Trail"

A volunteer’s service is a journey up a trail. Progress is not an arbitrary percentage bar; it is an active route line with waypoints drawn using SVG animation. The trail line is the signature element of VTS: it threads through the home page, the rank progress screen, volunteer profiles, and the celebratory welcome moment.

When a volunteer logs hours, checks into a community cleanup, or gets promoted, they are advancing further up the trail. Every milestone is a marked waypoint with real coordinates and unlocked privileges.

---

## 3. Toned-Down Editorial Visual Language (Phase 5)

Moving beyond heavy black fills, overly thick outlines, and shouting uppercase text, VTS Phase 5 establishes a calm, confident, editorial product style: lots of whitespace, a few confident dark outlines, one distinct color moment per page, and clear typographic hierarchy.

### 3.1 Borders, Depth & Hierarchy
- **Regular Cards and Panels**: Pure white background (`#FFFFFF`), 1 px border in soft slate (`#D5DAE1`), radius 10 px (`rounded-[10px]`), no hard shadow.
- **Inputs & Secondary Controls**: 1.5 px dark slate border (`border-[#475569]`), radius 8 px (`rounded-[8px]`), no hard shadow.
- **Button Rule**: Exactly ONE black-filled button per visible section. All secondary buttons are outlined with 1.5 px border or clean text links with an arrow (`→`).
- **Top Navigation Bar**: Light white header (`bg-white border-b border-[#D5DAE1]`). Role color indicator appears as a small circle next to user avatar and the active tab underline. No dark bars at the top.
- **Signature Ticket Passes**: Kept exclusively for tickets, volunteer ID passes, certificates, and receipts: notched corners (`clipPath`), stub dividers, and hard offset shadows (`shadow-[4px_4px_0_#111111]`).

### 3.2 Typography System
Tested in browser and selected pairing: **Bricolage Grotesque Bold/ExtraBold** for headlines + **Hanken Grotesk** for body.
- **Sentence Case Everywhere**: All headlines, card titles, buttons, and eyebrow labels are in sentence case. No all-caps shouting.
- **Headlines**: **Bricolage Grotesque** (`@fontsource/bricolage-grotesque`), Bold (700). Tight tracking, human and confident. Card titles 20 to 24 px.
- **Body & Controls**: **Hanken Grotesk** (`@fontsource/hanken-grotesk`), weights 400, 500, 600, 700. Set at 16 px minimum (`text-base`) with generous line height (1.6 / `leading-relaxed`). Secondary text 14 px (`text-sm`). Nothing below 13 px (`text-[13px]`).
- **Contrast**: Full WCAG AA compliance (4.5:1 minimum for normal text, 3:1 for large text). Zero contrast failures in hover, focus, and disabled states.

### 3.3 Page Composition (No Identical 4-Box Rows)
- **Home Page Ranks**: Interactive trail line with clickable waypoints. Clicking any rank reveals a single comprehensive detail card below displaying requirements and verified unlocks from `REQUIREMENTS.md`. The row of 4 equal boxes has been eliminated.
- **Home Page How to Join**: Clean vertical numbered timeline with large Bricolage Grotesque numerals (`01, 02, 03, 04`) and short plain descriptions. Zero boxes.
- **Home Page Activities**: One large featured ticket pass + a horizontal scrolling strip of ticket passes with varied widths.
- **Home Page Closing Section**: Light surface with high-contrast primary black button and secondary outlined button. White-on-white text bug permanently eliminated.
- **Dashboards**: Dashboards feature one large lead numeral on white (e.g., pending applications, total revenue, pending hours) accompanied by an inline list of secondary metrics separated by dividers. Top nav quick links replaced by live actionable information streams (e.g. unreviewed candidates, recent system history).

### 3.4 Colour by Role
Flat colour blocks and bands, strong but harmonious. Off-white canvas (`#F4F5F7`) with crisp white (`#FFFFFF`) cards and role accents:

| Role | Dominant Color Field | Hex Code | High-Contrast Pairing |
| :--- | :--- | :--- | :--- |
| **Applicant** | **Saffron** | `#E58B05` | Near-Black (`#111111`) & White |
| **Volunteer** | **Grass Green** | `#1E824C` | White & Slate (`#111111`) |
| **Team Lead** | **Tomato Red** | `#D63927` | White & Black |
| **Manager** | **Deep Teal** | `#0E6266` | White & Mint Light |
| **Finance** | **Deep Ink** | `#111315` | Amber / Electric Lime (`#784E0B`) |
| **Super Admin** | **Charcoal** | `#202328` | Amber Alert (`#D97706`) |

---

## 4. Plain Language & Verified Perks

All copy strictly uses real verified terms and requirements from `docs/REQUIREMENTS.md`:
- Removed all developer jargon (*API, token, encrypted, webhook, Brevo*).
- Removed all military/institutional jargon (*Directorate, Program Operations Directorate, System Administration, governance bureau*).
- Removed all extreme mountain metaphors (*Altitude Stations, Elevation 60m, Basecamp, Summit*).
- Removed invented benefits (*Duty Insurance Coverage*).
- Used human terms: *Admin home, Activity history, Rank rules, Volunteer ID pass, Accounts and roles, Settings and emails, Open my space*.
