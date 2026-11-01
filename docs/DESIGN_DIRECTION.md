# VTS Design Direction: "The Trail" (Surface Reset & Signature Edition)
**Art Direction & Interface Specification for Volunteer Tracking System**

---

## 1. Research & External Visual References

Our design language draws directly from 12 distinct, high-impact interfaces across wayfinding, editorial design, transport systems, and kinetic typography:

1. **Studio Dumbar / DEMO Festival** (https://studiodumbar.com/work/demo-festival)  
   Bold rectangular grotesque typography; primary flat field colors; kinetic typographic scale that commands immediate attention.
2. **Koto Studio / Bolt Rebrand** (https://koto.studio/work/bolt/)  
   Electric full-bleed flat fields of color; heavy grotesque numerals treated as primary visual anchors; avoidance of muddy gradient lighting.
3. **DIA Studio / Basel Marathon & Wayfinding Systems** (https://dia.tv)  
   The route line as a living interface element; animated continuous path connecting waypoints and stages.
4. **Collins / San Francisco Symphony** (https://wearecollins.com/work/sf-symphony/)  
   Expressive grotesque letterforms in architectural scale; dynamic typographic voice that feels human and vibrant.
5. **Swiss Alpine Club (SAC) / Swiss Alpine Route Passes** (https://www.alpen-route.ch)  
   Altitude as progression; trail route elevations marked with physical trail-marker clarity and elevation checkpoints.
6. **Resident Advisor / RA Tickets & Event Passes** (https://ra.co)  
   Authentic notched ticket pass silhouettes; stub sections; physical ticket aesthetics applied to modern web surfaces.
7. **Telebirr SuperApp Ethiopia** (https://www.ethiotelecom.et/telebirr/)  
   Vibrant flat saffron transaction vouchers; large bold Birr currency numerals; instant mobile confirmation patterns.
8. **It’s Nice That / Printed Matter & Editorial Feature Issues** (https://itsnicethat.com)  
   Staggered asymmetric layouts; overlapping paper layers; unexpected visual rhythm between sections.
9. **AllTrails Route Maps & Summit Progress** (https://alltrails.com)  
   Ascending trail elevation graphs; waypoints representing physical checkpoints; progress visualized as ground covered along an actual route.
10. **Awwwards SOTD / Nike Trail Running Experience** (https://awwwards.com)  
    SVG stroke drawing animations along winding paths; oversized numerals anchoring step-by-step guides.
11. **Siteinspire / Studio Freight Portfolio** (https://siteinspire.com)  
    Mobile floating bottom dock with thumb-accessible tools; horizontal snap tracks that invite tactile sliding.
12. **Linear 2024 Command Surface** (https://linear.app)  
    Clean tonal separation; airy white workspaces; elimination of heavy black borders and muddy backgrounds in favor of crisp whitespace.

---

## 2. Core Concept: "The Trail"

A volunteer’s journey is an ascent along a trail. Progress is an active route line with marked waypoints, elevation gain, and tangible milestones:
- **Member**: Starting waypoint (intake complete, volunteer pass issued).
- **Senior Member**: Active waypoint (30 hours logged, core training verified).
- **Team Lead**: Advanced waypoint (75 hours logged, leadership verified).
- **Manager**: Summit waypoint (150 hours logged, operations verified).

---

## 3. Surface System & Visual Hierarchy (Part 0 Precedence)

Things are separated with **tone and space**, not outlines.

### 3.1 Three Surface Tiers
1. **Plain Tier**: Default surface. The page canvas is pure white (`#FFFFFF`). Sections sit directly on the page, separated by 40 to 56 px of vertical whitespace.
2. **Panel Tier**: `#F7F8FA` solid fill, zero border, 16 px radius (`rounded-[16px]`), for grouped content and sidebars.
3. **Raised Tier**: White with a very soft shadow (`0 1px 2px rgba(16,24,40,0.05), 0 8px 24px -12px rgba(16,24,40,0.10)`), zero border, 16 px radius (`rounded-[16px]`). Used exclusively for the page's main hero card, tickets and passes, and floating dialogs/drawers.

### 3.2 Outlines & Dividers
- **Zero Card Outlines**: All dark, black, or slate borders on cards, panels, and passes are removed.
- **Allowed Borders**: 1 px `#CBD2DA` on text inputs and selects (with a 2 px focus ring in the role colour), ticket perforations, and 1 px `#EDEFF2` hairline dividers between list rows.
- **No Nested Boxes**: Never put a bordered or filled box inside another box.

### 3.3 Buttons & Actions
- **Primary**: Exactly one black-filled button per visible section (`bg-ink-primary text-white border-none rounded-[8px]`).
- **Secondary**: Tonal fill (`#F1F3F6`, no border, `text-ink-primary`).
- **Tertiary**: Text links with an arrow (`→`).
- **Row-level Actions**: Tonal buttons or text links, never black and never outlined.
- **Ripple Effect**: Every button ripples on interaction; 0 press translation or scale effects.

---

## 4. Five Shared Signature Components

1. **TopoBackdrop**: Static SVG contour lines at 6% to 9% opacity in the role accent colour.
2. **TrailMeter**: Route line with waypoints, avatar progress indicator, distance callouts, and unlocking details.
3. **TicketCard**: Notched silhouette, left date/time stub, spots-left meter, plain status words, hover lift.
4. **JourneyLog**: Vertical spine with status dots, month markers, big numerals, expandable rows.
5. **MomentOverlay**: Quick, memorable celebrations for payment, hours approved, and promotion.
