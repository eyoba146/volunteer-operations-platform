# Volunteer Tracking System (VTS)

VTS is a comprehensive operational platform designed to manage community service programs, regional civic deployments, and volunteer operations across Ethiopian cities. It coordinates the complete lifecycle of volunteerism: online and staff-assisted intake, Telebirr registration fee settlement, four-tier organizational hierarchy scoping, community project charters, field deployments with assigned supervisors, duty attendance verification with on-site short codes and photo evidence, merit-based rank advancement, and field allowance disbursements under strict budget ceilings and separation of duties.

---

## Table of Contents

- [1. Overview](#1-overview)
  - [1.1 What VTS Is](#11-what-vts-is)
  - [1.2 Who It Serves](#12-who-it-serves)
  - [1.3 The Operational Problem](#13-the-operational-problem)
  - [1.4 System Goals](#14-system-goals)
  - [1.5 What the Prototype Demonstrates](#15-what-the-prototype-demonstrates)
  - [1.6 Out of Scope for Version 1](#16-out-of-scope-for-version-1)
  - [1.7 Current Prototype Status](#17-current-prototype-status)
  - [1.8 Screenshots Gallery](#18-screenshots-gallery)
- [2. Quick Start](#2-quick-start)
  - [2.1 Prerequisites](#21-prerequisites)
  - [2.2 Installation & Local Dev](#22-installation-local-dev)
  - [2.3 Production Build & Type Check](#23-production-build-type-check)
  - [2.4 Automated Audits & Verification](#24-automated-audits-verification)
  - [2.5 Demo Accounts & Credentials](#25-demo-accounts-credentials)
  - [2.6 Resetting Demo Data](#26-resetting-demo-data)
- [3. Key Concepts in Plain Words](#3-key-concepts-in-plain-words)
  - [3.1 Role](#31-role)
  - [3.2 Rank](#32-rank)
  - [3.3 Permission](#33-permission)
  - [3.4 Scope](#34-scope)
  - [3.5 Organisation Unit](#35-organisation-unit)
  - [3.6 Activity](#36-activity)
  - [3.7 Project](#37-project)
  - [3.8 Assignment](#38-assignment)
  - [3.9 Allowance](#39-allowance)
  - [3.10 Evidence](#310-evidence)
- [4. Product Tour by Role](#4-product-tour-by-role)
  - [4.1 Public Workspace](#41-public-workspace)
  - [4.2 Applicant Workspace](#42-applicant-workspace)
  - [4.3 Volunteer Workspace](#43-volunteer-workspace)
  - [4.4 Team Lead Workspace](#44-team-lead-workspace)
  - [4.5 Manager Workspace](#45-manager-workspace)
  - [4.6 Finance Officer Workspace](#46-finance-officer-workspace)
  - [4.7 Super Admin Workspace](#47-super-admin-workspace)
- [5. The Volunteer Lifecycle](#5-the-volunteer-lifecycle)
  - [5.1 Nine-Step Lifecycle Narrative](#51-nine-step-lifecycle-narrative)
  - [5.2 Lifecycle Flowchart](#52-lifecycle-flowchart)
  - [5.3 Application Status State Machine](#53-application-status-state-machine)
  - [5.4 Telebirr Payment Sequence Diagram](#54-telebirr-payment-sequence-diagram)
  - [5.5 Edge Case Handling](#55-edge-case-handling)
- [6. Ranks and Promotion](#6-ranks-and-promotion)
  - [6.1 The Four-Tier Rank Ladder](#61-the-four-tier-rank-ladder)
  - [6.2 Default Promotion Thresholds](#62-default-promotion-thresholds)
  - [6.3 Unlocked Privileges per Rank](#63-unlocked-privileges-per-rank)
  - [6.4 Promotion Board Flowchart](#64-promotion-board-flowchart)
  - [6.5 Digital Certificates & QR Volunteer Pass](#65-digital-certificates-qr-volunteer-pass)
- [7. Money In and Money Out](#7-money-in-and-money-out)
  - [7.1 Money In: Registration Fees & Receipts](#71-money-in-registration-fees-receipts)
  - [7.2 Money Out: Field Allowances & Stipends](#72-money-out-field-allowances-stipends)
- [8. Organisation Structure and Access Scope](#8-organisation-structure-and-access-scope)
  - [8.1 Four-Tier Hierarchy Tree](#81-four-tier-hierarchy-tree)
  - [8.2 Hierarchical Scoping Rules](#82-hierarchical-scoping-rules)
  - [8.3 Scoping Scenarios across Demo Staff](#83-scoping-scenarios-across-demo-staff)
- [9. Permission Model and Separation of Duties](#9-permission-model-and-separation-of-duties)
  - [9.1 16-Module Permissions Matrix](#91-16-module-permissions-matrix)
  - [9.2 Separation of Duties & Four-Eye Principles](#92-separation-of-duties-four-eye-principles)
  - [9.3 How the can() Evaluation Engine Operates](#93-how-the-can-evaluation-engine-operates)
  - [9.4 Procedure: Adding a New Permission](#94-procedure-adding-a-new-permission)
- [10. Notifications and Communications](#10-notifications-and-communications)
  - [10.1 In-App Notification Bell & Events](#101-in-app-notification-bell-events)
  - [10.2 Transactional Email Templates (Brevo)](#102-transactional-email-templates-brevo)
  - [10.3 SMS Text Notifications (Shortcode 8080)](#103-sms-text-notifications-shortcode-8080)
  - [10.4 In-App Preview Drawers](#104-in-app-preview-drawers)
- [11. Reports and Analytics](#11-reports-and-analytics)
  - [11.1 Manager Operations Reports](#111-manager-operations-reports)
  - [11.2 Finance Revenue & Allowance Reports](#112-finance-revenue-allowance-reports)
  - [11.3 Client-Side Export Standards (Excel & PDF)](#113-client-side-export-standards-excel-pdf)
- [12. Data Model Specification](#12-data-model-specification)
  - [12.1 Entity Attribute Tables](#121-entity-attribute-tables)
  - [12.2 Status Enums Catalog](#122-status-enums-catalog)
  - [12.3 Complete Entity-Relationship Diagram](#123-complete-entity-relationship-diagram)
- [13. Mock Data and Evaluation System](#13-mock-data-and-evaluation-system)
  - [13.1 Dynamic Relative Date Generation](#131-dynamic-relative-date-generation)
  - [13.2 Seed Dataset Inventory](#132-seed-dataset-inventory)
  - [13.3 Nine-Step Evaluation Demo Script](#133-nine-step-evaluation-demo-script)
  - [13.4 Evaluator Troubleshooting Guide](#134-evaluator-troubleshooting-guide)
- [14. Architecture and Design System](#14-architecture-and-design-system)
  - [14.1 Directory Layout & Module Responsibilities](#141-directory-layout-module-responsibilities)
  - [14.2 Front-End State Layer & Persistence](#142-front-end-state-layer-persistence)
  - [14.3 Routing Architecture & Guards](#143-routing-architecture-guards)
  - [14.4 Navigation & AppSidebar Architecture](#144-navigation-appsidebar-architecture)
  - [14.5 Design Tokens & Zero-Border Design Language](#145-design-tokens-zero-border-design-language)
  - [14.6 Signature Design Components](#146-signature-design-components)
  - [14.7 Plain Language & Copy Rules](#147-plain-language-copy-rules)
- [15. API Contract & Endpoint Mapping](#15-api-contract-endpoint-mapping)
  - [15.1 Complete 66-Function API Catalog](#151-complete-66-function-api-catalog)
  - [15.2 JSON Payloads for Core Workflows](#152-json-payloads-for-core-workflows)
  - [15.3 Standard Backend Error & Pagination Contract](#153-standard-backend-error-pagination-contract)
- [16. Backend Implementation Guide (Planned)](#16-backend-implementation-guide-planned)
  - [16.1 Express Server Project Structure](#161-express-server-project-structure)
  - [16.2 Middleware Pipeline Execution Order](#162-middleware-pipeline-execution-order)
  - [16.3 PostgreSQL Schema & Supabase Setup](#163-postgresql-schema-supabase-setup)
  - [16.4 Cloudinary Storage Flow](#164-cloudinary-storage-flow)
  - [16.5 Brevo Transactional Email Integration](#165-brevo-transactional-email-integration)
  - [16.6 Telebirr C2B and B2C Integration Guide](#166-telebirr-c2b-and-b2c-integration-guide)
  - [16.7 Environment Variables Reference](#167-environment-variables-reference)
  - [16.8 Background Tasks & Scheduled Jobs](#168-background-tasks-scheduled-jobs)
  - [16.9 API Replacement Phasing Plan](#169-api-replacement-phasing-plan)
- [17. Security and Privacy Invariants](#17-security-and-privacy-invariants)
  - [17.1 Server-Side Authorization Invariants](#171-server-side-authorization-invariants)
  - [17.2 Credential Security & Lockout Rules](#172-credential-security-lockout-rules)
  - [17.3 Identity Document Privacy & Access Locks](#173-identity-document-privacy-access-locks)
- [18. Quality, Accessibility and Testing](#18-quality-accessibility-and-testing)
  - [18.1 Zero-Borders Automated Audit Check](#181-zero-borders-automated-audit-check)
  - [18.2 Responsive Layout Verification](#182-responsive-layout-verification)
  - [18.3 Accessibility Compliance (WCAG AA)](#183-accessibility-compliance-wcag-aa)
  - [18.4 Role-Based Manual QA Checklist](#184-role-based-manual-qa-checklist)
- [19. Requirements Traceability Matrix](#19-requirements-traceability-matrix)
- [20. Status Glossary](#20-status-glossary)
- [21. Product Roadmap Beyond Prototype](#21-product-roadmap-beyond-prototype)
- [22. Assumptions, Open Questions and Limitations](#22-assumptions-open-questions-and-limitations)
- [23. Development Workflow and Contributions](#23-development-workflow-and-contributions)
- [24. Evaluator FAQ and Glossary](#24-evaluator-faq-and-glossary)

---

## 1. Overview

### 1.1 What VTS Is
The Volunteer Tracking System (VTS) is an operational system of record and field dispatch platform designed to coordinate civic volunteerism across Ethiopia. VTS handles volunteer management from initial interest and registration fee processing through multi-branch project assignments, field service verification, merit elevations, and mobile wallet stipend payouts.

### 1.2 Who It Serves
VTS supports six distinct user groups operating across five administrative tiers:
- **Volunteers and Candidates**: Citizens dedicating time to community development, tree planting, educational tutoring, emergency relief, and municipal sanitation across Addis Ababa, Adama, Hawassa, Bishoftu, and Bahir Dar.
- **Team Leads**: Experienced field coordinators leading community squads, managing daily shift attendance, displaying 4-digit check-in short codes, auditing hours, inspecting photo evidence, and mentoring new volunteers.
- **Program Managers**: Regional directors who evaluate admissions pools, oversee staff-assisted walk-in intakes, charter community projects, deploy volunteers to field rosters, prepare daily allowances, and decide rank elevation boards.
- **Finance Officers**: Head office accountants and controllers who reconcile Telebirr registration fee settlements, process manual branch cash deposits, resolve transaction discrepancies, and execute mobile wallet stipend disbursements.
- **Super Administrators**: Executive directors who configure the 4-tier organization tree, adjust the 16-module role permission matrix, calibrate rank advancement thresholds, and monitor audit histories.
- **External Evaluators & Public Stakeholders**: Community partners, academic institutions, and employers who verify volunteer service certificates and credentials via public lookup codes.

### 1.3 The Operational Problem
Prior to VTS, volunteer operations in civic programs faced critical vulnerabilities:
1. **Unverified Service Records**: Paper sign-in sheets and informal messaging groups enabled attendance falsification, creating unverifiable claims for academic credit or employment references.
2. **Reconciliation Disconnects**: Informal manual mobile money transfers left applicants in limbo when payment references were mistyped, lost, or sent to unmonitored accounts.
3. **Disorganized Field Dispatch**: Supervisors lacked real-time visibility into active site attendance, leading to understaffed emergency initiatives or overcrowding.
4. **Subjective Recognition**: Without transparent, quantifiable qualification thresholds, promotions were perceived as opaque and arbitrary.
5. **Uncontrolled Field Allowances**: Manual cash stipend disbursements lacked budget ceiling verification, creating overdraft risks and audit failures.

### 1.4 System Goals
- **Single Source of Truth**: Maintain a verified ledger of every volunteer, shift, hour, rating, and payment across all regional branches.
- **Dual Intake Rails**: Provide self-service digital applications alongside assisted in-person intake for candidates lacking smartphones or internet access.
- **Transparent Merit Ladder**: Provide volunteers with real-time visual progress against published rank elevation thresholds.
- **Financial Rigor**: Enforce four-eye separation of duties, project budget ceilings, and automated Telebirr reconciliation for collections and disbursements.
- **Strict Data Scoping**: Prevent cross-branch data leaks through organizational hierarchy path filtering.

### 1.5 What the Prototype Demonstrates
The current VTS prototype is a client-side single-page application built with React 19, TypeScript, Tailwind CSS, and Vite. It demonstrates:
- All 59 screens across all 6 authenticated roles and public portals.
- Fully functional in-memory reactive database persisting to browser local storage.
- Real-time scoped querying respecting the 4-tier organization hierarchy.
- Complete Telebirr C2B fee payment flow with success, delay, and failure modes.
- Complete Telebirr B2C allowance disbursement flow with budget reservation and four-eye approval rules.
- Multi-step assisted registration wizard with manual cash fee recording and hardship waivers.
- Photo evidence inspection for manual duty hours and completed field work submissions.
- Strict compliance with the zero-border editorial visual design system.

### 1.6 Out of Scope for Version 1
- Native iOS and Android mobile binaries (fully addressed by the responsive web application at 360 px viewports).
- Real-time peer-to-peer chat between volunteers.
- Multi-language interface translations (English only for the prototype; Amharic and Afaan Oromo planned for Phase 2).
- Credit and debit card payment gateways (standardized exclusively on Telebirr for the Ethiopian domestic market).
- Direct bidirectional sync with external corporate enterprise resource planning (ERP) suites.

### 1.7 Current Prototype Status
- **Build Status**: Passing with zero TypeScript errors or linter warnings.
- **Test Suite**: 62 automated verification checks passing cleanly.
- **Design Conformance**: Zero border classes across all components; 100% compliant with the white canvas and tonal panel architecture.
- **Traceability**: All 77 requirements verified against working code.

### 1.8 Screenshots Gallery

The following gallery captures primary entry points across desktop (1440 px) and mobile (360 px) viewports:

#### Public Portals
- **Public Home Page (1440 px)**: `docs/screenshots/home_desktop.png`  
  *Caption: Public landing page presenting the VTS mission, community metrics, and participation pathways.*
- **Public Home Page (360 px)**: `docs/screenshots/home_mobile.png`  
  *Caption: Fully responsive mobile home view with streamlined touch navigation.*
- **Sign In Terminal (1440 px)**: `docs/screenshots/signin_desktop.png`  
  *Caption: Secure authentication portal with fast demo account credential pre-sets.*
- **Sign In Terminal (360 px)**: `docs/screenshots/signin_mobile.png`  
  *Caption: Mobile sign-in screen optimized for single-handed thumb interaction.*

#### Role Workspaces
- **Applicant Status Portal (1440 px)**: `docs/screenshots/surface_applicant_status_1440.png`  
  *Caption: Applicant status dashboard displaying admissions timeline, verification files, and fee countdown.*
- **Applicant Status Portal (360 px)**: `docs/screenshots/surface_applicant_status_360.png`  
  *Caption: Mobile applicant status view showing required document replacement alerts.*
- **Volunteer Home Dashboard (1440 px)**: `docs/screenshots/surface_volunteer_home_1440.png`  
  *Caption: Volunteer dashboard with next activity pass, TrailMeter milestone curve, and announcements.*
- **Volunteer Home Dashboard (360 px)**: `docs/screenshots/surface_volunteer_home_360.png`  
  *Caption: Compact mobile volunteer home feed with one-touch duty check-in access.*
- **Team Lead Dispatch Home (1440 px)**: `docs/screenshots/surface_team_lead_home_1440.png`  
  *Caption: Squad lead dashboard showing today's shifts, hours awaiting verification, and field rosters.*
- **Team Lead Dispatch Home (360 px)**: `docs/screenshots/surface_team_lead_home_360.png`  
  *Caption: Mobile dispatch terminal for field supervisors managing on-site volunteer groups.*
- **Manager Operations Dashboard (1440 px)**: `docs/screenshots/surface_manager_dashboard_1440.png`  
  *Caption: Regional operations overview featuring admissions queues, project budget metrics, and promotions.*
- **Manager Operations Dashboard (360 px)**: `docs/screenshots/surface_manager_dashboard_360.png`  
  *Caption: Mobile manager dashboard summarizing operational figures and urgent review queues.*
- **Finance Overview & Settlements (1440 px)**: `docs/screenshots/surface_finance_overview_1440.png`  
  *Caption: Finance portal displaying Telebirr collections, exception queues, and allowance disbursements.*
- **Finance Overview & Settlements (360 px)**: `docs/screenshots/surface_finance_overview_360.png`  
  *Caption: Mobile finance overview displaying daily collection totals and settlement metrics.*
- **Super Admin System Console (1440 px)**: `docs/screenshots/surface_admin_overview_1440.png`  
  *Caption: Executive governance dashboard tracking organization units, staff accounts, and security audit logs.*
- **Super Admin System Console (360 px)**: `docs/screenshots/surface_admin_overview_360.png`  
  *Caption: Mobile administrator console displaying high-level system activity and security health.*

---

## 2. Quick Start

### 2.1 Prerequisites
- **Node.js**: Version 18.0.0 or higher (Node 20+ LTS recommended).
- **Package Manager**: npm 9.0.0 or higher.
- **Web Browser**: Modern Chromium-based browser (Chrome, Edge), Firefox, or Safari.

### 2.2 Installation & Local Dev
Clone the repository and launch the local development environment:

```bash
# Clone the repository
git clone https://github.com/eyoba146/volunteer-operations-platform.git
cd volunteer-operations-platform

# Install client dependencies
cd client
npm install

# Start local development server (runs on port 5173 by default)
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### 2.3 Production Build & Type Check
To compile the TypeScript project and verify production bundle generation:

```bash
cd client
npm run build
```

This executes `tsc -b` followed by `vite build`. The optimized output is written to `client/dist`.

### 2.4 Automated Audits & Verification
To execute the automated regression and invariants verification test suite:

```bash
# From repository root
node client/scripts/test_upgrade2.cjs

# To re-scan codebase facts and generate docs/inventory.json
node scripts/inventory.cjs
```

### 2.5 Demo Accounts & Credentials
All demo accounts share the universal password: **`Demo@1234`**

| Role | Full Name | Username | Operational Scope | Typical Evaluation Scenario |
| :--- | :--- | :--- | :--- | :--- |
| **Applicant** | Hana Tesfaye | `hana.tesfaye` | Addis Ababa Area | Application accepted; ready to pay registration fee via Telebirr push. |
| **Volunteer** | Dawit Bekele | `dawit.bekele` | Kirkos Branch, Addis Ababa | Active volunteer; assigned to Kirkos Green Project; logs field hours. |
| **Senior Volunteer** | Selam Alemu | `selam.alemu` | Bole Branch, Addis Ababa | Has met all Team Lead thresholds; eligible for promotion board review. |
| **Team Lead** | Yonas Kebede | `yonas.kebede` | Kirkos Branch, Addis Ababa | Dispatches field rosters, generates check-in codes, verifies hours. |
| **Team Lead** | Henok Assefa | `henok.assefa` | Adama Central Branch | Supervises Adama projects; verifies attendance for field allowances. |
| **Manager** | Marta Girma | `marta.girma` | Addis Ababa Area | Reviews applications, charters projects, prepares field allowances. |
| **Manager** | Tigist Wolde | `tigist.wolde` | Adama Area | Exercises regional scoping; registers walk-ins via assisted intake. |
| **Finance Officer** | Abel Hailu | `abel.hailu` | Head Office (All Scope) | Reconciles Telebirr fees; disburses mobile wallet allowances. |
| **Super Admin** | Ruth Mengistu | `ruth.mengistu` | Head Office (All Scope) | Manages organization tree; approves allowance budgets; sets permissions. |

### 2.6 Resetting Demo Data
All prototype data persists in browser `localStorage` under the storage key `vts_operations_storage_v5`. To reset the application back to its pristine seed state:
1. Click **Reset seed data** in the header dropdown menu when signed in, OR
2. Open your browser DevTools Console and execute:
   ```javascript
   localStorage.clear();
   window.location.href = '/sign-in';
   ```

---

## 3. Key Concepts in Plain Words

### 3.1 Role
A role defines a person's identity and default workspace within VTS. A user holds exactly one role at a time (Applicant, Volunteer, Team Lead, Manager, Finance Officer, Super Admin). Role determines the primary navigation sidebar, viewable modules, and default authority.

### 3.2 Rank
A rank represents an earned level of seniority achieved by volunteers (Volunteer, Senior Volunteer, Team Lead, Manager). While a role dictates access permissions, rank reflects verified historical service milestones, including approved duty hours, completed activities, average supervisor ratings, tenure, and completed training courses.

### 3.3 Permission
A permission is the granular right granted to a role to perform a specific action (`view`, `create`, `edit`, `delete`, `approve`, `export`) within a functional module. For example, a Manager holds `approve` permission on `promotions`, whereas a Volunteer holds only `view` permission.

### 3.4 Scope
Scope defines the organizational boundary within which a user can view or alter data:
- **`all`**: Nationwide access across all operational units.
- **`area`**: Access restricted to a regional area (e.g. Addis Ababa) and all subordinate branches.
- **`branch`**: Access restricted to a specific branch office (e.g. Kirkos Branch).
- **`own`**: Access restricted exclusively to records directly created by or assigned to the authenticated user.

### 3.5 Organisation Unit
An organization unit is a node in the four-tier operational hierarchy:
1. **Head Office**: National headquarters.
2. **Area**: Regional administration (e.g. Oromia Area).
3. **Branch**: Municipal or sub-city operational hub (e.g. Adama Central Branch).
4. **Location**: Specific community field station or project base (e.g. Wonji Community Hub).

### 3.6 Activity
An activity is a scheduled operational engagement with a defined date, time, duration, location, capacity, and supervising Team Lead. Types include field tasks, community events, special projects, logistics shifts, and training courses.

### 3.7 Project
A project is a long-term community initiative chartered by a Manager (e.g. "Kirkos Clean & Green Initiative"). Projects belong to a branch, define total allocated ETB budgets, set daily volunteer allowance stipend rates, and group multiple scheduled activities.

### 3.8 Assignment
An assignment is a formal deployment pairing an active volunteer with a project or activity. It specifies a designated supervising Team Lead, start date, and end date. The volunteer must explicitly accept the deployment before field shifts begin.

### 3.9 Allowance
An allowance is a daily monetary stipend paid to volunteers deployed on approved project work. Allowances follow a strict four-eye approval chain: Manager preparation within project budget caps, Team Lead attendance verification, Super Admin budget authorization, and Finance mobile wallet disbursement.

### 3.10 Evidence
Evidence refers to verifiable proof of field service. For un-coded shifts or manual duty logging, volunteers attach photographs of their work on site, which Team Leads inspect before approving credit toward rank promotion.

---

## 4. Product Tour by Role

Below is the complete inventory of all 59 routes across the system, categorized by workspace.

### 4.1 Public Workspace
Public pages are accessible without authentication. They introduce the platform, handle onboarding and credential recovery, and provide public verification lookups.

| Route | Purpose | Key Actions | Allowed Roles | Component & Source File |
| :--- | :--- | :--- | :--- | :--- |
| `/` | System landing page | Read mission overview, view statistics, access intake links | Public unauthenticated | `HomePage` (`client/src/pages/public/HomePage.tsx`) |
| `/sign-in` | Authentication portal | Sign in with username/email and password, click demo presets | Public unauthenticated | `SignInPage` (`client/src/pages/public/SignInPage.tsx`) |
| `/register` | Self-registration form | Enter name, username, email, phone with live password checklist | Public unauthenticated | `RegisterPage` (`client/src/pages/public/RegisterPage.tsx`) |
| `/verify-email` | Email verification | Enter 6-digit confirmation code from email inbox preview | Public unauthenticated | `VerifyEmailPage` (`client/src/pages/public/VerifyEmailPage.tsx`) |
| `/forgot-password` | Password recovery | Submit registered email to generate password reset token | Public unauthenticated | `ForgotPasswordPage` (`client/src/pages/public/ForgotPasswordPage.tsx`) |
| `/reset-password` | Set new password | Enter and confirm new password against complexity checklist | Public unauthenticated | `ResetPasswordPage` (`client/src/pages/public/ResetPasswordPage.tsx`) |
| `/check-certificate` | Credential lookup | Enter certificate verification code to inspect authentic record | Public unauthenticated | `CertificateCheckPage` (`client/src/pages/public/CertificateCheckPage.tsx`) |
| `/unauthorized` | Access denied notice | Inform user of role restrictions and provide safe return links | Public unauthenticated | `UnauthorizedPage` (`client/src/pages/public/UnauthorizedPage.tsx`) |
| `/404` | Not found notice | Friendly 404 page with return to home navigation | Public unauthenticated | `NotFoundPage` (`client/src/pages/public/NotFoundPage.tsx`) |

### 4.2 Applicant Workspace
Dedicated to prospective volunteers undergoing admissions evaluation, document verification, and fee settlement.

| Route | Purpose | Key Actions | Allowed Roles | Component & Source File |
| :--- | :--- | :--- | :--- | :--- |
| `/applicant/status` | Admissions status desk | Track review milestones, view decision notices, upload files | Applicant, Volunteer | `ApplicantStatusPage` (`client/src/pages/applicant/ApplicantStatusPage.tsx`) |
| `/applicant/apply` | Multi-step application | Enter motivation, areas, skills, availability, emergency info | Applicant, Volunteer | `ApplicantApplyPage` (`client/src/pages/applicant/ApplicantApplyPage.tsx`) |
| `/applicant/payment` | Telebirr fee checkout | Initiate ETB 200 fee settlement with success/delay/fail options | Applicant, Volunteer | `ApplicantPaymentPage` (`client/src/pages/applicant/ApplicantPaymentPage.tsx`) |
| `/applicant/notifications` | Application alerts | View admissions updates, file correction notices, invitations | Applicant, Volunteer | `ApplicantNotificationsPage` (`client/src/pages/applicant/ApplicantNotificationsPage.tsx`) |

### 4.3 Volunteer Workspace
Designed for active volunteers participating in field shifts, logging service, tracking promotions, and collecting stipends.

| Route | Purpose | Key Actions | Allowed Roles | Component & Source File |
| :--- | :--- | :--- | :--- | :--- |
| `/volunteer/home` | Volunteer dashboard | View next scheduled shift, TrailMeter rank curve, broadcasts | Volunteer, Team Lead, Manager | `VolunteerHomePage` (`client/src/pages/volunteer/VolunteerHomePage.tsx`) |
| `/volunteer/activities` | Browse open activities | Filter activities by type, area, and skills; enroll in shifts | Volunteer, Team Lead, Manager | `VolunteerActivitiesPage` (`client/src/pages/volunteer/VolunteerActivitiesPage.tsx`) |
| `/volunteer/activities/:id` | Activity detail desk | Inspect location, requirements, enrolled roster; join/leave | Volunteer, Team Lead, Manager | `VolunteerActivityDetailPage` (`client/src/pages/volunteer/VolunteerActivityDetailPage.tsx`) |
| `/volunteer/my-activities` | Deployments & roster | View enrolled activities; accept/decline manager assignments | Volunteer, Team Lead, Manager | `VolunteerMyActivitiesPage` (`client/src/pages/volunteer/VolunteerMyActivitiesPage.tsx`) |
| `/volunteer/check-in` | On-site check-in | Enter 4-digit short code provided by lead to log attendance | Volunteer, Team Lead, Manager | `VolunteerCheckInPage` (`client/src/pages/volunteer/VolunteerCheckInPage.tsx`) |
| `/volunteer/hours` | Service hours ledger | View verified hours, log manual duty entries with photo proof | Volunteer, Team Lead, Manager | `VolunteerHoursPage` (`client/src/pages/volunteer/VolunteerHoursPage.tsx`) |
| `/volunteer/allowances` | My field allowances | Track stipend requests, view Telebirr refs, celebrate payouts | Volunteer, Team Lead, Manager | `VolunteerAllowancesPage` (`client/src/pages/volunteer/VolunteerAllowancesPage.tsx`) |
| `/volunteer/rank-progress` | Promotion milestones | Inspect threshold progress bars, view gap estimates to rank | Volunteer, Team Lead, Manager | `VolunteerRankProgressPage` (`client/src/pages/volunteer/VolunteerRankProgressPage.tsx`) |
| `/volunteer/certificates` | Earned certificates | View and print official digital certificates with QR codes | Volunteer, Team Lead, Manager | `VolunteerCertificatesPage` (`client/src/pages/volunteer/VolunteerCertificatesPage.tsx`) |
| `/volunteer/id-card` | Official volunteer pass | Inspect and download official volunteer ID card with QR code | Volunteer, Team Lead, Manager | `VolunteerIdCardPage` (`client/src/pages/volunteer/VolunteerIdCardPage.tsx`) |
| `/volunteer/profile` | Profile & preferences | Edit bio, emergency info, skills, notification channels | Volunteer, Team Lead, Manager | `VolunteerProfilePage` (`client/src/pages/volunteer/VolunteerProfilePage.tsx`) |

### 4.4 Team Lead Workspace
Empowers squad supervisors to coordinate activities on the ground, audit duty hours, inspect evidence, and mentor peers.

| Route | Purpose | Key Actions | Allowed Roles | Component & Source File |
| :--- | :--- | :--- | :--- | :--- |
| `/team-lead/home` | Squad dispatch home | View active shifts, pending hours count, squad readiness | Team Lead, Manager | `TeamLeadHomePage` (`client/src/pages/team-lead/TeamLeadHomePage.tsx`) |
| `/team-lead/volunteers` | My volunteers directory| Inspect volunteers supervised, view active deployments | Team Lead, Manager | `TeamLeadMyVolunteersPage` (`client/src/pages/team-lead/TeamLeadMyVolunteersPage.tsx`) |
| `/team-lead/activities` | Field activities roster| Display 4-digit check-in code, review roster, complete shifts | Team Lead, Manager | `TeamLeadActivitiesPage` (`client/src/pages/team-lead/TeamLeadActivitiesPage.tsx`) |
| `/team-lead/create-activity`| Activity scheduler | Schedule activity, pick branch project, set capacity & skills | Team Lead, Manager | `TeamLeadCreateActivityPage` (`client/src/pages/team-lead/TeamLeadCreateActivityPage.tsx`) |
| `/team-lead/approve-hours` | Hours & evidence audit| Inspect photos, approve or decline hours with required notes | Team Lead, Manager | `TeamLeadApproveHoursPage` (`client/src/pages/team-lead/TeamLeadApproveHoursPage.tsx`) |
| `/team-lead/allowances` | Allowance verification| Verify volunteer physical attendance for stipend payouts | Team Lead, Manager | `TeamLeadVerifyAllowancesPage` (`client/src/pages/team-lead/TeamLeadVerifyAllowancesPage.tsx`) |
| `/team-lead/ratings` | Performance ratings | Submit 1 to 5 numerical ratings and peer feedback | Team Lead, Manager | `TeamLeadRatingsPage` (`client/src/pages/team-lead/TeamLeadRatingsPage.tsx`) |
| `/team-lead/recommend-promotion` | Recommend elevation | Nominate Senior Volunteers for promotion with written commendation | Team Lead, Manager | `TeamLeadRecommendPromotionPage` (`client/src/pages/team-lead/TeamLeadRecommendPromotionPage.tsx`) |
| `/team-lead/announcements` | Squad broadcasts | Send broadcast notices to enrolled participants and squad peers | Team Lead, Manager | `TeamLeadAnnouncementsPage` (`client/src/pages/team-lead/TeamLeadAnnouncementsPage.tsx`) |

### 4.5 Manager Workspace
Central operations desk for admissions intake, walk-in registration, project charters, volunteer deployments, and promotions.

| Route | Purpose | Key Actions | Allowed Roles | Component & Source File |
| :--- | :--- | :--- | :--- | :--- |
| `/manager/dashboard` | Regional command desk | Track waiting applications, project budgets, and promotions | Manager | `ManagerDashboardPage` (`client/src/pages/manager/ManagerDashboardPage.tsx`) |
| `/manager/projects` | Community projects | Charter projects, allocate ETB budgets, set stipend rates | Manager | `ManagerProjectsPage` (`client/src/pages/manager/ManagerProjectsPage.tsx`) |
| `/manager/projects/:id` | Project detail & budget| Inspect remaining funds, deploy volunteers, review tickets | Manager | `ManagerProjectDetailPage` (`client/src/pages/manager/ManagerProjectDetailPage.tsx`) |
| `/manager/allowances` | Prepare allowances | Draft and submit daily stipend requests within budget limits | Manager | `ManagerAllowancesPage` (`client/src/pages/manager/ManagerAllowancesPage.tsx`) |
| `/manager/applications` | Admissions review queue| Evaluate dossiers, accept, return files for correction, reject | Manager | `ManagerApplicationsPage` (`client/src/pages/manager/ManagerApplicationsPage.tsx`) |
| `/manager/register-volunteer`| Assisted walk-in intake| 4-step wizard registering walk-ins with ID capture & cash fee | Manager | `ManagerRegisterVolunteerPage` (`client/src/pages/manager/ManagerRegisterVolunteerPage.tsx`) |
| `/manager/volunteers` | Regional volunteer directory | Search volunteers, filter by rank/skills, view rank histories | Manager | `ManagerVolunteersPage` (`client/src/pages/manager/ManagerVolunteersPage.tsx`) |
| `/manager/activities` | Regional activities map | Oversee all branch activities, inspect attendance and leads | Manager | `ManagerActivitiesPage` (`client/src/pages/manager/ManagerActivitiesPage.tsx`) |
| `/manager/promotions` | Elevation decision board| Review eligible candidates, inspect evidence, approve/decline | Manager | `ManagerPromotionsPage` (`client/src/pages/manager/ManagerPromotionsPage.tsx`) |
| `/manager/announcements` | Regional broadcasts | Publish broadcast notices targeted by rank, area, or all | Manager | `ManagerAnnouncementsPage` (`client/src/pages/manager/ManagerAnnouncementsPage.tsx`) |
| `/manager/feedback` | Feedback inbox | Review volunteer feedback sent from field activities | Manager | `ManagerFeedbackPage` (`client/src/pages/manager/ManagerFeedbackPage.tsx`) |
| `/manager/reports` | Operations analytics | View demographic charts, hours curves, export Excel/PDF | Manager | `ManagerReportsPage` (`client/src/pages/manager/ManagerReportsPage.tsx`) |

### 4.6 Finance Officer Workspace
Financial reconciliation terminal for Telebirr settlement rails, cash receipts, refund authorizations, and stipend payouts.

| Route | Purpose | Key Actions | Allowed Roles | Component & Source File |
| :--- | :--- | :--- | :--- | :--- |
| `/finance/overview` | Financial overview | Monitor registration collections, cash receipts, and payouts | Finance, Admin | `FinanceOverviewPage` (`client/src/pages/finance/FinanceOverviewPage.tsx`) |
| `/finance/allowances` | Disburse allowances | Execute Telebirr mobile wallet payouts, handle payment retries | Finance, Admin | `FinanceAllowancesPage` (`client/src/pages/finance/FinanceAllowancesPage.tsx`) |
| `/finance/payments` | Telebirr fee ledger | Review all fee transactions, filter by status, inspect payload | Finance, Admin | `FinancePaymentsPage` (`client/src/pages/finance/FinancePaymentsPage.tsx`) |
| `/finance/needs-review` | Payment exceptions | Reconcile delayed transactions, unmatched refs, duplicate claims | Finance, Admin | `FinanceNeedsReviewPage` (`client/src/pages/finance/FinanceNeedsReviewPage.tsx`) |
| `/finance/receipts-refunds`| Receipts & refunds | Issue official manual cash receipts, process justified refunds | Finance, Admin | `FinanceReceiptsRefundsPage` (`client/src/pages/finance/FinanceReceiptsRefundsPage.tsx`) |
| `/finance/reports` | Financial statements | Analyze fee revenues and stipend outlays, export Excel/PDF | Finance, Admin | `FinanceReportsPage` (`client/src/pages/finance/FinanceReportsPage.tsx`) |

### 4.7 Super Admin Workspace
System governance console for organization hierarchy maintenance, dynamic permissions calibration, and security audit logs.

| Route | Purpose | Key Actions | Allowed Roles | Component & Source File |
| :--- | :--- | :--- | :--- | :--- |
| `/admin/overview` | Governance console | Inspect system-wide user counts, branches, and security status | Admin | `AdminOverviewPage` (`client/src/pages/admin/AdminOverviewPage.tsx`) |
| `/admin/allowances` | Budget authority approval| Review verified allowance requests, approve reserved budgets | Admin | `AdminAllowancesPage` (`client/src/pages/admin/AdminAllowancesPage.tsx`) |
| `/admin/organisation` | Organization tree | Add, edit, move, and archive Head Office, Area, and Branch nodes| Admin | `AdminOrganisationPage` (`client/src/pages/admin/AdminOrganisationPage.tsx`) |
| `/admin/roles-permissions`| Permissions matrix | Toggle module action rights per role, configure access scopes | Admin | `AdminRolesPermissionsPage` (`client/src/pages/admin/AdminRolesPermissionsPage.tsx`) |
| `/admin/settings` | System parameters | Configure fee amounts, payment windows, and required documents | Admin | `AdminSettingsPage` (`client/src/pages/admin/AdminSettingsPage.tsx`) |
| `/admin/rank-rules` | Promotion rules editor | Calibrate minimum hours, activities, ratings, and courses | Admin | `AdminRankRulesPage` (`client/src/pages/admin/AdminRankRulesPage.tsx`) |
| `/admin/accounts` | Staff provisioning | Create staff accounts, assign initial roles, suspend/unlock users | Admin | `AdminAccountsPage` (`client/src/pages/admin/AdminAccountsPage.tsx`) |
| `/admin/activity-history`| Security & audit logs | Search chronological system audit logs and sign-in lockouts | Admin | `AdminActivityHistoryPage` (`client/src/pages/admin/AdminActivityHistoryPage.tsx`) |
---

## 5. The Volunteer Lifecycle

The volunteer journey in VTS is a structured, nine-step operational progression designed for both self-directed digital applicants and walk-in community members assisted by staff. Every phase transitions the applicant through verified administrative and financial checkpoints, ensuring compliance, safety, and accountability before field deployment.

### 5.1 Nine-Step Lifecycle Narrative

1. **Discovery & Intake**: The candidate discovers the organization and begins the onboarding process either independently via the public portal (`/apply`) or in person at a regional branch office where a volunteer coordinator inputs details through the staff-assisted intake console (`/manager/applications`).
2. **Document & Identity Verification**: The applicant submits essential personal credentials, including full legal name, normalized Ethiopian phone number (`+2519...`), emergency contacts, photo identification (Kebele card, passport, or national ID), and declarations of skills and availability.
3. **Manager Screening & Qualification**: The Branch Manager reviews submitted credentials in the review queue. The manager verifies identification validity, checks local background notes, and either requests supplementary documents, declines the application, or advances the candidate to accepted status.
4. **Fee Assessment & Invoicing**: Once accepted, the system automatically assesses the mandatory one-time registration fee (default ETB 200) and starts a 14-day payment settlement countdown window. For assisted walk-ins experiencing financial hardship, the manager can submit a documented fee waiver request.
5. **Telebirr Digital Settlement**: The applicant navigates to the payment checkout terminal (`/applicant/payment`) and executes a secure digital settlement using Telebirr C2B web payment. The applicant confirms their PIN, and the Telebirr payment engine validates the transaction via an asynchronous server webhook.
6. **Credentialing & Pass Issuance**: Upon payment confirmation, the system elevates the user's role from `applicant` to `volunteer` with the initial rank of `Volunteer`. The system automatically generates a unique alphanumeric Volunteer ID and an interactive, anti-tamper Volunteer Pass with an authenticated QR verification token (`/volunteer/profile`).
7. **Project Enrollment & Assignment**: The newly onboarded volunteer browses active branch projects and scheduled community activities (`/volunteer/activities`), submitting participation requests. Alternatively, the Branch Manager or assigned Team Lead directly allocates the volunteer to designated project rosters.
8. **Field Attendance & Hours Logging**: On the day of field operations, the volunteer reports on site to the Team Lead. Attendance is confirmed by submitting a daily randomized 4-digit numeric code and optional geotagged photo evidence. The Team Lead reviews and approves the logged hours (`/lead/hours`), adding quantitative peer ratings.
9. **Merit Evaluation & Elevation**: As the volunteer completes activities and logs verified hours, the system continuously tracks milestone progression against administrative rank thresholds. When criteria are met, the candidate is placed on the promotion review board (`/manager/promotions`) for elevation to Senior Volunteer, Leader, or Master.

### 5.2 Lifecycle Flowchart

The flowchart below details the progression gates, role handoffs, and feedback loops across the volunteer lifecycle:

```mermaid
flowchart TD
    subgraph Onboarding["1. Onboarding Phase"]
        A1["Candidate Discovery (/apply or Assisted)"] --> A2["Submit Profile & National ID"]
        A2 --> A3["Manager Screening Review (/manager/applications)"]
        A3 -->|Requires Clarification| A2
        A3 -->|Rejected| A4["Application Closed (No Fee Assessed)"]
        A3 -->|Accepted| A5["System Issues ETB 200 Registration Invoice"]
    end
    subgraph FinancialSettlement["2. Financial Settlement"]
        A5 --> B1["Telebirr Checkout Terminal (/applicant/payment)"]
        B1 --> B2{"Payment Status"}
        B2 -->|Successful Webhook| B3["Role Elevated: Volunteer"]
        B2 -->|Timeout or Dispute| B4["Finance Needs-Review Queue (/finance/needs-review)"]
        B4 -->|Manually Reconciled| B3
        B4 -->|Refund / Cancel| A4
    end
    subgraph FieldOperations["3. Field Operations"]
        B3 --> C1["Volunteer Credential & QR Pass Generated"]
        C1 --> C2["Project & Activity Enrollment (/volunteer/activities)"]
        C2 --> C3["On-Site Check-in with 4-Digit Short Code"]
        C3 --> C4["Team Lead Hours & Evidence Approval (/lead/hours)"]
        C4 --> C5["Supervisor Rating & Milestone Recording"]
    end
    subgraph MeritElevation["4. Merit Elevation"]
        C5 --> D1{"Meets Rank Thresholds?"}
        D1 -->|In Progress| C2
        D1 -->|Thresholds Met| D2["Promotion Board Review (/manager/promotions)"]
        D2 -->|Manager Approves| D3["Digital Certificate Issued & Rank Elevated"]
        D2 -->|Declined with Feedback| C2
    end
```

### 5.3 Application Status State Machine

The formal finite state machine below governs the lifecycle transitions of an application record:

```mermaid
stateDiagram-v2
    [*] --> draft: Applicant initiates form
    draft --> submitted: Applicant submits credentials
    submitted --> in_review: Manager opens candidate dossier
    in_review --> more_info_needed: Manager requests updated ID
    more_info_needed --> in_review: Applicant resubmits required documents
    in_review --> rejected: Candidacy declined (permanent)
    in_review --> accepted: Qualifications verified & approved
    accepted --> expired: 14-day payment settlement window lapses
    accepted --> payment_pending: Telebirr payment transaction initiated
    payment_pending --> confirmed: Telebirr webhook verifies funds transfer
    payment_pending --> needs_review: Unmatched transaction or manual receipt claim
    needs_review --> confirmed: Finance Officer validates payment evidence
    needs_review --> failed: Transaction rejected by Telebirr or Finance
    confirmed --> active_volunteer: System provisions Volunteer profile & pass
    active_volunteer --> [*]
    rejected --> [*]
    expired --> [*]
```

### 5.4 Telebirr Payment Sequence Diagram

The sequence diagram below illustrates the multi-party interaction between the applicant, client interface, application backend, Telebirr payment gateway, and finance reconciliation ledger:

```mermaid
sequenceDiagram
    autonumber
    actor Applicant as Applicant
    participant UI as VTS Client UI
    participant API as VTS Backend API
    participant TB as Telebirr Gateway
    participant Store as System Database
    actor Finance as Finance Officer

    Applicant->>UI: Selects Pay with Telebirr (ETB 200.00)
    UI->>API: POST /api/payments/telebirr/initiate { applicationId, phone }
    API->>Store: Create Payment (status: pending, amount: 200, method: telebirr)
    API->>TB: Encrypted Payment Order (RSA/SHA256, Fabric App ID, Short Code)
    TB-->>API: Return Checkout URL & Payment Reference (ref: TB-98234)
    API-->>UI: Return Checkout URL
    UI->>Applicant: Redirect to Telebirr Payment Portal
    Applicant->>TB: Enter PIN and Authorize Payment
    TB-->>Applicant: Display Transaction Confirmation
    TB->>API: Asynchronous Webhook Notification (Signed Payload)
    alt Signature Valid and Funds Cleared
        API->>Store: Update Payment (status: confirmed)
        API->>Store: Update Application (status: accepted -> active)
        API->>Store: Provision VolunteerProfile & QR Pass
        API-->>TB: HTTP 200 OK (Webhook Acknowledged)
        API->>Applicant: Dispatch In-App & SMS Confirmation
    else Delayed Network or Unmatched Reference
        API->>Store: Update Payment (status: needs_review)
        API->>Finance: Enqueue Exception in Finance Needs-Review Queue
        Finance->>API: Manual Reconciliation & Approval (/finance/needs-review)
        API->>Store: Update Payment (status: confirmed)
        API->>Store: Provision VolunteerProfile & QR Pass
    end
```

### 5.5 Edge Case Handling

| Edge Case Scenario | Trigger Condition | System Behavior & Mitigation | Primary Actor |
| :--- | :--- | :--- | :--- |
| **Payment Gateway Timeout** | Network dropout during Telebirr USSD / PIN authentication | System maintains `pending` state for 30 minutes, polling transaction status before transitioning to `needs_review` rather than failing. | System / Finance |
| **Expired Payment Window** | Candidate fails to pay within 14 days of acceptance | Application transitions to `expired`. The candidate cannot make payment without requesting an administrative reactivation from the Branch Manager. | Manager |
| **Illegible Document Upload** | Uploaded Kebele card or photo ID is blurry or cut off | Manager flags document as `returned_for_correction` with a specific memo. Application returns to `more_info_needed`; applicant receives an SMS alert. | Manager / Applicant |
| **Hardship Fee Waiver** | Candidate unable to pay registration fee | Branch Manager initiates an assisted waiver request with documented community justification; Super Admin or Finance Officer approves waiver. | Manager / Admin |
| **Voluntary Withdrawal** | Candidate withdraws prior to payment confirmation | Candidate clicks Withdraw in applicant portal. State moves to `withdrawn`; all scheduled reminders are immediately terminated. | Applicant |
| **Duplicate Payment Submission** | User double-clicks checkout or submits multiple webhooks | Idempotency key derived from `applicationId` prevents second payment insertion; duplicate payload is logged and routed to Finance for refund review. | Finance |

---

## 6. Ranks and Promotion

VTS implements an objective, merit-driven advancement framework designed to recognize commitment, foster field leadership, and ensure operational safety. Promotion is never automatic: the system monitors quantitative thresholds and presents eligible candidates to the Branch Manager for formal elevation.

### 6.1 The Four-Tier Rank Ladder

The advancement structure consists of four standardized ranks:

1. **Volunteer (Tier 1)**: The baseline entry rank granted immediately upon payment settlement and onboarding. Volunteers participate in supervised field activities and log hours under direct Team Lead oversight.
2. **Senior Volunteer (Tier 2)**: Seasoned volunteers who have demonstrated consistent reliability, accumulated substantial field hours, and earned high peer ratings. Senior Volunteers are authorized to mentor newer volunteers and execute specialized community tasks.
3. **Leader (Tier 3)**: Field captains entrusted with operational responsibilities. Leaders are eligible to act as activity supervisors, guide task crews, coordinate on-site check-in codes, and submit field allowance claims.
4. **Master (Tier 4)**: The highest honorary operational rank. Masters are institutional pillars who advise branch management, facilitate regional training workshops, evaluate curriculum standards, and audit community project impacts.

### 6.2 Default Promotion Thresholds

The table below specifies the default quantitative thresholds required to establish promotion eligibility. These thresholds are dynamically calibrated by the Super Admin in `/admin/rank-rules`:

| Target Rank | Minimum Hours | Minimum Activities | Minimum Average Rating | Mandatory Training Modules | Minimum Service Tenure |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Volunteer** | 0 hours | 0 activities | None | Core Orientation | 0 days |
| **Senior Volunteer** | 50 hours | 10 activities | 4.2 / 5.0 | Safety & First Aid Protocol | 30 active days |
| **Leader** | 150 hours | 25 activities | 4.6 / 5.0 | Field Team Leadership & Ethics | 90 active days |
| **Master** | 350 hours | 60 activities | 4.8 / 5.0 | Advanced Project Coordination & Crisis Management | 180 active days |

### 6.3 Unlocked Privileges per Rank

| Privilege / Capability | Volunteer | Senior Volunteer | Leader | Master |
| :--- | :--- | :--- | :--- | :--- |
| Self-enroll in open community activities | Yes | Yes | Yes | Yes |
| Priority enrollment in high-demand projects | No | Yes | Yes | Yes |
| Maximum simultaneous active assignments | 2 | 4 | 8 | Unlimited |
| On-site attendance check-in code bypass (GPS only) | No | No | Yes | Yes |
| Eligible to serve as designated Activity Supervisor | No | No | Yes | Yes |
| Eligible to initiate field allowance requests | No | No | Yes | Yes |
| Recommend peers for merit advancement | No | Yes | Yes | Yes |
| Access regional leadership briefings & broadcasts | No | No | Yes | Yes |

### 6.4 Promotion Board Flowchart

```mermaid
flowchart TD
    subgraph MilestoneEngine["Milestone Engine (Automated)"]
        E1["Volunteer Logs Activity & Hours"] --> E2["Team Lead Submits Rating & Verification"]
        E2 --> E3["Engine Calculates Cumulative Hours, Activities & Mean Rating"]
        E3 --> E4{"Criteria >= Configured Rank Thresholds?"}
        E4 -->|No| E1
        E4 -->|Yes| E5["System Flags Profile: eligible"]
    end
    subgraph DecisionBoard["Promotion Review Board (/manager/promotions)"]
        E5 --> F1["Candidate Enters Manager Promotion Queue"]
        F1 --> F2["Manager Inspects Field Dossier & Peer Endorsements"]
        F2 --> F3{"Manager Determination"}
        F3 -->|Declined with Feedback| F4["Promotion Declined: Status Reset with Constructive Coaching"]
        F3 -->|Approved| F5["Promotion Approved: Rank Elevated"]
    end
    subgraph Issuance["Credential Issuance"]
        F5 --> G1["System Generates Cryptographic Certificate (/verify/:id)"]
        G1 --> G2["Volunteer Pass Digitally Re-issued with Updated Holographic Rank Badge"]
        G2 --> G3["System Emits Brevo Email & SMS Congratulatory Notice"]
    end
```

### 6.5 Digital Certificates & QR Volunteer Pass

VTS ensures tamper-proof verification of credentials through two complementary instruments:

1. **Digital Certificate of Merit (`/verify/:id`)**: When a rank elevation is approved, the system generates a verifiable PDF certificate. Each certificate contains a unique SHA-256 verification digest, date of issuance, issuing manager signature block, and canonical URL.
2. **Dynamic QR Volunteer Pass (`/volunteer/profile`)**: Volunteers carry a mobile-responsive digital identification pass featuring the volunteer's portrait, legal name, volunteer ID (`VTS-AA-0042`), current rank badge, active branch affiliation, and a cryptographically signed QR code. Field supervisors can scan the QR code with any mobile camera to verify active credentials in real time without requiring specialized scanner hardware.

---

## 7. Money In and Money Out

VTS enforces strict fiscal governance, maintaining a clean bifurcation between funds received from volunteer registrations (Money In) and operational stipends disbursed to volunteers for field work (Money Out). Every financial movement adheres to dual-control authorization and immutable audit trails.

### 7.1 Money In: Registration Fees & Receipts

Registration fee collections offset administrative onboarding costs, uniform issuance, and safety insurance.

#### Payment Channels and Protocols
- **Telebirr Digital C2B Checkout**: Applicants execute payment via Telebirr's web checkout interface. The transaction generates an end-to-end audit reference (`TB-YYYY-XXXXX`), confirms instantaneously via webhook, and auto-generates a digital receipt.
- **Assisted Walk-In Cash Collections**: For walk-in applicants without mobile wallets, the Branch Manager receives physical cash at the intake desk and records the transaction in `/manager/applications`. The system assigns the status `needs_review` until the Finance Officer inspects the daily cash deposit and confirms receipt issuance.

#### Fee Payment Status Lifecycle

| Status Value | Commercial Meaning | State Transition Trigger | Authorized Role |
| :--- | :--- | :--- | :--- |
| `pending` | Payment order created; awaiting gateway handshake | User initiates payment in `/applicant/payment` | Applicant |
| `confirmed` | Funds captured in organization Telebirr account | Webhook verified or Finance approves cash intake | System / Finance |
| `failed` | Transaction declined by gateway, insufficient funds, or canceled | Gateway returns non-zero error code | System |
| `needs_review` | Unmatched transaction reference, duplicate claim, or cash intake | Webhook payload mismatch or walk-in cash intake | System / Manager |
| `refunded` | Registration fee reversed back to applicant's wallet | Finance Officer executes refund in `/finance/receipts-refunds` | Finance Officer |

#### Official Manual Receipts and Refunds
- **Receipt Numbering Standard**: All receipts follow the immutable sequential scheme `RCP-YYYY-XXXXX` (e.g., `RCP-2026-00104`). Receipts record payer name, phone number, branch ID, amount in ETB, payment method, receiving officer ID, and timestamp.
- **Refund Policy & Controls**: Refunds can only be initiated for applications that have not progressed beyond onboarding. A refund requires a documented justification memo and dual authorization by the Finance Officer and Super Admin.

### 7.2 Money Out: Field Allowances & Stipends

Field allowances provide modest per-diem reimbursements to volunteers deployed on strenuous or remote community projects. Allowances are legally classified as cost-offset stipends, not employment compensation.

#### The Four-Eye Allowance Governance Lifecycle

To eliminate financial impropriety and ghost disbursements, VTS implements a strict four-eye approval workflow across four distinct roles:

```mermaid
sequenceDiagram
    autonumber
    actor TL as Team Lead (Initiator)
    actor MGR as Branch Manager (Scope Verifier)
    actor ADM as Super Admin (Budget Authority)
    actor FIN as Finance Officer (Disburser)
    participant DB as VTS Ledger
    participant TB as Telebirr B2C Rails
    actor VOL as Volunteer Wallet

    TL->>DB: Submit Allowance Request (/lead/allowances)
    Note over TL,DB: Status: submitted. Specifies volunteers, hours, activity, ETB amount.
    MGR->>DB: Inspect & Verify Scope (/manager/allowances)
    Note over MGR,DB: Status: verified. Manager validates hours worked against field attendance.
    ADM->>DB: Review & Authorize Budget (/admin/allowances)
    Note over ADM,DB: Status: approved. Admin verifies project budget ceiling before granting fiscal release.
    FIN->>DB: Review Payment Batch (/finance/allowances)
    FIN->>TB: Trigger Telebirr B2C Batch Payout
    TB-->>VOL: Credit ETB Funds to Volunteer Mobile Wallet
    TB-->>FIN: Dispatch B2C Settlement Receipt
    FIN->>DB: Mark Allowance Request: paid (records transaction ref & timestamp)
```

#### Budget Ceiling Invariants
- **Project Allocation Lock**: Every allowance request must reference an active `projectId`. The request amount is checked against the project's `allocatedBudget - (spentBudget + reservedBudget)`. If the request exceeds the remaining funds, the system throws an overdraft rejection error.
- **Separation of Duties**: The user who submits the allowance request (`Team Lead`) cannot verify it (`Manager`), approve it (`Admin`), or disburse it (`Finance`). Any attempt by a single identity to advance multiple stages results in an immediate authorization failure.

---

## 8. Organisation Structure and Access Scope

VTS implements a four-tier hierarchical organization model designed to scale across multi-regional civic operations. The structure guarantees that personnel access only the data, volunteers, and budgets appropriate to their operational jurisdiction.

### 8.1 Four-Tier Hierarchy Tree

The organizational topology is modeled as a directed tree with Head Office at the root, branching into regional Areas, operational Branches, and specific municipal Locations:

```mermaid
graph TD
    HQ["Head Office (HQ-AA)<br/>Addis Ababa Central Governance"]
    AREA1["Area 1: Addis Ababa Metro (AREA-AA)"]
    AREA2["Area 2: Oromia Central (AREA-OR)"]
    AREA3["Area 3: Southern Rift (AREA-SR)"]
    AREA4["Area 4: Northern Amhara (AREA-AM)"]

    HQ --> AREA1
    HQ --> AREA2
    HQ --> AREA3
    HQ --> AREA4

    BR1["Branch: Kirkos (BR-KIR)"]
    BR2["Branch: Bole (BR-BOL)"]
    BR3["Branch: Adama (BR-ADA)"]
    BR4["Branch: Bishoftu (BR-BIS)"]
    BR5["Branch: Hawassa (BR-HAW)"]
    BR6["Branch: Bahir Dar (BR-BAH)"]

    AREA1 --> BR1
    AREA1 --> BR2
    AREA2 --> BR3
    AREA2 --> BR4
    AREA3 --> BR5
    AREA4 --> BR6

    LOC1["Site: Meskel Square Post"]
    LOC2["Site: Edna Mall Community Hub"]
    LOC3["Site: Adama Stadium Field Base"]

    BR1 --> LOC1
    BR2 --> LOC2
    BR3 --> LOC3
```

### 8.2 Hierarchical Scoping Rules

Data visibility and mutation privileges are enforced through four distinct scope boundaries:

| Scope Level | Hierarchy Reach | Applied Roles | Data Filtering Policy |
| :--- | :--- | :--- | :--- |
| `global` | System-wide root access across all areas and branches | Super Admin, Finance Officer | No geographic filters applied. Can inspect and govern all records across the national network. |
| `area` | Intermediate regional scope covering multiple branches | Regional Director, Area Coordinator | Queries automatically filter where `branch.parentId == user.scope.unitId`. Records outside the designated area are invisible. |
| `branch` | Local operational jurisdiction covering a single branch office | Branch Manager, Team Lead | Queries enforce `WHERE branchId == user.scope.unitId`. Staff cannot view or manage volunteers, activities, or applications outside their branch. |
| `self` | Individual personnel record boundary | Volunteer, Applicant | Strict row-level isolation: `WHERE userId == currentUser.id`. Volunteers see only their own hours, pass, assignments, and certificates. |

### 8.3 Scoping Scenarios across Demo Staff

To verify scoping integrity, the prototype seeds staff accounts across different branches and areas. The table below illustrates the boundary enforcement in practice:

| Account Name | Role | Assigned Scope Unit | What the User CAN See and Do | What the User CANNOT See or Do |
| :--- | :--- | :--- | :--- | :--- |
| **Abebe Bikila** (`admin`) | Super Admin | `global` (HQ-AA) | All branches, projects, system-wide budgets, audit logs, and permission configuration. | None (Universal administrative governance). |
| **Dawit Kebede** (`manager`) | Branch Manager | `branch` (Kirkos: BR-KIR) | Kirkos applications, volunteers, local projects, Kirkos Team Leads, and branch promotions. | Cannot view Bole applications, edit Adama projects, or approve Hawassa promotions. |
| **Aster Bekele** (`manager`) | Branch Manager | `branch` (Bole: BR-BOL) | Bole applications, volunteers, local projects, and Bole branch hours logs. | Completely isolated from Kirkos and regional branch operational data. |
| **Rahel Tadesse** (`lead`) | Team Lead | `branch` (Kirkos: BR-KIR) | Kirkos branch activities where assigned as leader; can log/verify hours for participating volunteers. | Cannot access financial ledgers, view system settings, or approve volunteer promotions. |
| **Almaz Ayana** (`volunteer`) | Volunteer | `self` (Kirkos: BR-KIR) | Personal profile, digital QR pass, enrolled activities, logged hours history, and personal certificates. | Cannot inspect other volunteers' personal info, phone numbers, or administrative notes. |

---

## 9. Permission Model and Separation of Duties

VTS implements a role-based access control (RBAC) engine with fine-grained functional permissions organized across 16 operational modules. Every interaction is gated through a central `can()` evaluator that inspects role permissions, active scope, and dual-custody invariants.

### 9.1 16-Module Permissions Matrix

The matrix below details the default capabilities granted to each operational role across the 16 core system modules. Actions are categorized as Create (C), Read (R), Update (U), Delete (D), Export (E), and Approve (A):

| Module | Applicant | Volunteer | Team Lead | Manager | Finance | Admin |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `users` | - | R (self) | R (branch) | R, U (branch) | R (global) | C, R, U, D, E |
| `volunteers` | - | R, U (self) | R (branch) | C, R, U, E (branch) | R, E (global) | C, R, U, D, E |
| `applications` | C, R, U (self) | - | - | C, R, U, A, E (branch) | R (global) | C, R, U, D, A, E |
| `activities` | - | R | C, R, U (branch) | C, R, U, D, E (branch) | R (global) | C, R, U, D, E |
| `projects` | - | R | R (branch) | C, R, U, E (branch) | R (global) | C, R, U, D, E |
| `assignments` | - | R (self) | C, R, U (branch) | C, R, U, A (branch) | R (global) | C, R, U, D, A |
| `allowances` | - | - | C, R (branch) | R, U, A (branch) | R, U, A, E (global) | C, R, U, D, A, E |
| `promotions` | - | R (self) | R (branch) | R, U, A (branch) | - | C, R, U, D, A |
| `certificates` | - | R (self) | R (branch) | C, R (branch) | - | C, R, U, D, E |
| `announcements` | - | R | R | C, R, U (branch) | R (global) | C, R, U, D |
| `reports` | - | - | R (branch) | R, E (branch) | R, E (global) | R, E (global) |
| `audit` | - | - | - | - | - | R, E (global) |
| `settings` | - | - | - | - | - | C, R, U |
| `payments` | C, R (self) | R (self) | - | R (branch) | C, R, U, A, E (global) | C, R, U, D, E |
| `feedback` | - | C, R (self) | R (branch) | R, U (branch) | - | R, D (global) |
| `org_units` | - | - | - | R (branch) | R (global) | C, R, U, D |

### 9.2 Separation of Duties & Four-Eye Principles

To ensure financial and regulatory integrity, the system codifies strict separation-of-duties invariants that cannot be overridden by administrative configuration:

1. **Candidate Self-Approval Invariant**: An applicant cannot review, verify, or accept their own onboarding application.
2. **Activity Budget Dual-Control**: A Team Lead who authors an activity cannot authorize the financial budget or release funds for that activity.
3. **Allowance Custody Chain**: A Manager who approves hours worked cannot execute the Telebirr payment disbursement; disbursement is reserved exclusively for Finance Officers.
4. **Promotion Independent Concurrence**: A Team Lead can submit a merit recommendation for a volunteer, but the formal rank elevation decision requires Branch Manager or Super Admin sign-off.
5. **Account Provisioning Segregation**: A Super Admin can create staff accounts and assign initial roles, but cannot perform day-to-day cash reconciliations or modify Telebirr webhook endpoints without triggering an audit log entry.

### 9.3 How the can() Evaluation Engine Operates

Client-side permission checks are evaluated using the `usePermission()` hook, which exposes the canonical evaluator `can(module, action, targetScope?)`. The evaluation pipeline executes the following checks:

1. **Super Admin Bypass**: If `currentUser.role === 'admin'`, the function returns `true` (subject to separation-of-duty invariants).
2. **Role Permission Registry**: The evaluator consults the dynamic permissions map stored in `utils/permissions.ts`. If the specified `action` is absent from `permissions[module]`, it returns `false`.
3. **Scope Hierarchy Verification**: If a `targetScope` is provided, the evaluator ensures that the target's organizational unit matches or nests under the user's assigned scope. For example, a Branch Manager with scope `BR-KIR` cannot perform actions targeting `BR-BOL`.
4. **Fallback Degradation**: If user permissions cannot be parsed from local storage, the engine safely degrades to read-only access for personal self-records.

### 9.4 Procedure: Adding a New Permission

To introduce a new permission module or action into the system, developers must follow this strict 4-step checklist:

1. **Update Domain Types (`client/src/types/index.ts`)**: Add the module identifier to `PermissionModule` or action string to `PermissionAction`.
2. **Configure Role Defaults (`client/src/utils/permissions.ts`)**: Update `DEFAULT_ROLE_PERMISSIONS` dictionary to assign sensible default actions for each role.
3. **Attach UI Authorization Guards**: Protect navigation items in `AppSidebar.tsx` and wrap sensitive action buttons or page shells using `can(module, action)`.
4. **Enforce Backend Route Middleware**: In the Express/PostgreSQL API layer, apply the authorization middleware: `router.post('/path', requirePermission('module', 'action'), handler)`.

---

## 10. Notifications and Communications

VTS maintains operational momentum and participant engagement through an integrated, multi-channel notification architecture covering in-app notifications, transactional emails (Brevo engine), and SMS alerts (shortcode 8080).

### 10.1 In-App Notification Bell & Events

The user interface features a persistent notification center accessible via the bell icon in the top header:
- **Visual Counter Badge**: Displays unread notification counts in real time, highlighted in the primary accent hue.
- **Event Categorization**: Notifications are categorized as `application_status`, `payment_update`, `activity_assigned`, `hours_approved`, `promotion_eligible`, `promotion_approved`, `announcement`, `allowance_disbursed`, or `security_alert`.
- **Quick Actions**: Notifications feature direct deep-links that route users straight to the relevant work surface (e.g., clicking an allowance notification opens the disbursement drawer).

### 10.2 Transactional Email Templates (Brevo)

The prototype integrates a simulated Brevo transactional email engine with 10 production-ready HTML templates:

| Template ID | Template Name | Trigger Event | Recipient Role | Subject Line | Dynamic Payload Variables |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `vts-tpl-01` | Application Received | Candidate submits `/apply` form | Applicant | We received your VTS volunteer application | `applicantName`, `applicationId`, `branchName` |
| `vts-tpl-02` | Application Accepted | Manager approves application | Applicant | Congratulations: You are accepted to VTS | `applicantName`, `branchName`, `feeAmount`, `paymentUrl`, `expiryDate` |
| `vts-tpl-03` | Document Clarification | Manager flags blurry ID | Applicant | Action required: Please update your ID photo | `applicantName`, `requestedDocType`, `reasonMemo`, `uploadUrl` |
| `vts-tpl-04` | Payment Confirmed | Telebirr webhook verifies fee | Volunteer | Welcome to VTS: Payment confirmed & ID issued | `volunteerName`, `volunteerId`, `amountPaid`, `receiptNumber`, `passUrl` |
| `vts-tpl-05` | Activity Assignment | Volunteer added to project | Volunteer | New activity deployment: {{activityName}} | `volunteerName`, `activityName`, `projectName`, `dateTime`, `locationName` |
| `vts-tpl-06` | Shift Reminder | 24 hours prior to scheduled shift | Volunteer | Reminder: Field activity tomorrow morning | `volunteerName`, `activityName`, `meetingPoint`, `teamLeadPhone` |
| `vts-tpl-07` | Hours Log Verified | Team Lead confirms attendance | Volunteer | Your volunteer hours have been verified | `volunteerName`, `activityName`, `hoursLogged`, `cumulativeHours`, `rating` |
| `vts-tpl-08` | Promotion Eligible | Volunteer achieves thresholds | Volunteer | Milestone achieved: You are eligible for promotion | `volunteerName`, `currentRank`, `targetRank`, `hoursAchieved` |
| `vts-tpl-09` | Promotion Approved | Manager elevates rank | Volunteer | Congratulations on your promotion to {{newRank}} | `volunteerName`, `newRank`, `certificateId`, `verificationUrl` |
| `vts-tpl-10` | Allowance Disbursed | Finance executes Telebirr B2C | Volunteer | Field stipend disbursed to your Telebirr wallet | `volunteerName`, `projectName`, `amountETB`, `telebirrRef` |

### 10.3 SMS Text Notifications (Shortcode 8080)

Because field volunteers frequently operate in low-bandwidth rural or community environments, critical notifications are paired with concise SMS messages delivered from Ethiopian shortcode `8080`. All SMS templates strictly adhere to the 160-character GSM standard:

| SMS Event Code | Trigger Event | Message Copy Template (Ethiopian Shortcode 8080) | Character Count |
| :--- | :--- | :--- | :--- |
| `SMS-ACC` | Application Approved | `VTS: Welcome! Your application is approved. Complete your Telebirr registration fee at vts.et/pay to receive your Volunteer Pass.` | 126 chars |
| `SMS-CHK` | Shift Check-in Code | `VTS: Your check-in short code for today's Clean Water Drive is 7382. Provide this to Team Lead Rahel on site.` | 108 chars |
| `SMS-ALW` | Allowance Disbursed | `VTS: ETB 400.00 field allowance credited to your Telebirr wallet for Kirkos Sanitation Campaign. Ref: TB-77291.` | 110 chars |
| `SMS-EMG` | Emergency Notice | `VTS URGENT: Tree planting activity scheduled for tomorrow at Meskel Square postponed due to rain. Await update.` | 111 chars |

### 10.4 In-App Preview Drawers

To enable end-to-end evaluation without requiring active Brevo API keys or Ethio Telecom telecom bindings, VTS includes built-in inspection drawers:
- **Email Preview Drawer (`EmailPreviewDrawer.tsx`)**: Renders full-fidelity transactional HTML emails inside an overlay drawer, complete with simulated headers, recipient addresses, and responsive mobile viewport toggles.
- **SMS Preview Drawer (`SmsPreviewDrawer.tsx`)**: Renders an interactive mobile handset mock-up displaying simulated incoming SMS messages, timestamps, and shortcode identifiers.

---

## 11. Reports and Analytics

VTS incorporates dedicated reporting terminals tailored to the analytical needs of Branch Managers, Regional Directors, and Finance Officers. All reports support real-time dynamic aggregation, multi-dimensional filtering, and one-click data exports.

### 11.1 Manager Operations Reports

Accessible at `/manager/reports`, this console provides operational intelligence across four standard views:
- **Volunteers by Geographic Area**: Aggregates volunteer headcounts across branches, segmented by active status and rank distribution.
- **Cumulative Hours Logged**: Displays monthly and quarterly volunteer hour curves, identifying high-performing teams and seasonal volunteer participation trends.
- **Project Budget Burn Rates**: Visualizes allocated versus consumed project budgets, highlighting projects approaching fiscal exhaustion.
- **Activity Completion Velocity**: Tracks scheduled versus completed activities, measuring on-site attendance rates and volunteer retention.

### 11.2 Finance Revenue & Allowance Reports

Accessible at `/finance/reports`, this console delivers financial accounting summaries:
- **Registration Revenue Ledger**: Tracks monthly gross registration revenues, segmented by Telebirr digital checkout versus assisted-intake cash deposits.
- **Allowance Outlay Statement**: Detailed ledger of all disbursed stipends, categorized by project, branch, and authorizing administrative officer.
- **Exception & Refund Reconciliations**: Audits all payment refunds, disputed transactions, and manual adjustments made during weekly reconciliations.

### 11.3 Client-Side Export Standards (Excel & PDF)

Every reporting terminal features standard export actions adhering to strict data presentation standards:
- **Excel / CSV Data Standard**: Exports clean, tabular data formatted with explicit column headers, standard ISO 8601 timestamps, unformatted numeric currency fields for spreadsheet arithmetic, and consistent file naming: `vts-[type]-[scope]-[date].xlsx`.
- **Formal PDF Documents**: Emits print-ready documents featuring the official VTS organizational header, generated timestamp, active filtering parameters, page numbering, and an authorized authenticity watermark.

---

## 12. Data Model Specification

VTS is underpinned by a strongly typed relational data model consisting of 35 domain interfaces and 13 specialized status enums. All schema definitions are synchronized between the front-end TypeScript layer (`client/src/types/index.ts`) and the target PostgreSQL database schema (`docs/schema.sql`).

### 12.1 Entity Attribute Tables

Below are detailed attribute definitions for every entity in the VTS data model:

#### 12.1.10 Entity: `OrgUnit`
Organizational node in the four-tier administrative hierarchy (Head Office, Area, Branch, Location).

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `type` | `OrgUnitType` | No | Unique identifier or attribute value for type. |
| `name` | `string` | No | Descriptive display name in sentence case. |
| `parentId` | `string &#124; null` | Yes | Foreign key referencing the associated parent record. |
| `status` | `'active' &#124; 'archived'` | Yes | Lifecycle state governed by the domain status enum. |
| `code` | `string` | Yes | Unique identifier or attribute value for code. |
| `createdAt` | `string` | Yes | ISO 8601 extended timestamp representation. |

#### 12.1.23 Entity: `UserScope`
Operational jurisdiction assigned to a user restricting query boundaries and mutation authority.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `unitId` | `string` | No | Foreign key referencing the associated unit record. |
| `unitName` | `string` | Yes | Unique identifier or attribute value for unitName. |
| `level` | `ScopeLevel` | No | Unique identifier or attribute value for level. |

#### 12.1.32 Entity: `RolePermissionConfig`
Administrative mapping of a role to module action permissions and scoping levels.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `role` | `Role` | No | Unique identifier or attribute value for role. |
| `scopeLevel` | `ScopeLevel` | No | Unique identifier or attribute value for scopeLevel. |
| `permissions` | `Record<PermissionModule, PermissionAction[]>` | No | Unique identifier or attribute value for permissions. |
| `description` | `string` | No | Unique identifier or attribute value for description. |

#### 12.1.42 Entity: `SignInLogEntry`
Security audit record logging authentication attempts, IP telemetry, and lockout states.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `userId` | `string` | No | Foreign key referencing the associated user record. |
| `username` | `string` | No | Unique identifier or attribute value for username. |
| `role` | `Role` | No | Unique identifier or attribute value for role. |
| `timestamp` | `string` | No | Unique identifier or attribute value for timestamp. |
| `ipAddress` | `string` | Yes | Unique identifier or attribute value for ipAddress. |
| `deviceSummary` | `string` | No | Unique identifier or attribute value for deviceSummary. |
| `result` | `'success' &#124; 'failed' &#124; 'locked'` | No | Unique identifier or attribute value for result. |
| `reason` | `string` | Yes | Unique identifier or attribute value for reason. |

#### 12.1.57 Entity: `DemoSmsMessage`
Simulated outbound SMS text message record delivered via Ethiopian shortcode 8080.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `toPhone` | `string` | No | Unique identifier or attribute value for toPhone. |
| `toName` | `string` | No | Unique identifier or attribute value for toName. |
| `body` | `string` | No | Unique identifier or attribute value for body. |
| `category` | `'security' &#124; 'verification' &#124; 'application' &#124; 'payment' &#124; 'hours' &#124; 'promotion' &#124; 'activity'` | No | Unique identifier or attribute value for category. |
| `sentAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `read` | `boolean` | Yes | Unique identifier or attribute value for read. |

#### 12.1.70 Entity: `NotificationEventPreferences`
Granular opt-in switches for email, SMS, and in-app event channels.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `inApp` | `boolean` | No | Unique identifier or attribute value for inApp. |
| `email` | `boolean` | No | Unique identifier or attribute value for email. |
| `sms` | `boolean` | No | Unique identifier or attribute value for sms. |

#### 12.1.79 Entity: `NotificationPreferences`
User-level communication settings and notification routing preferences.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `activities` | `NotificationEventPreferences` | No | Unique identifier or attribute value for activities. |
| `hours` | `NotificationEventPreferences` | No | Unique identifier or attribute value for hours. |
| `promotions` | `NotificationEventPreferences` | No | Unique identifier or attribute value for promotions. |
| `payments` | `NotificationEventPreferences` | No | Unique identifier or attribute value for payments. |
| `security` | `NotificationEventPreferences` | No | Unique identifier or attribute value for security. |

#### 12.1.90 Entity: `User`
Primary authentication identity and credentials for system staff and registered volunteers.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `username` | `string` | No | Unique identifier or attribute value for username. |
| `email` | `string` | No | Unique identifier or attribute value for email. |
| `firstName` | `string` | Yes | Unique identifier or attribute value for firstName. |
| `lastName` | `string` | Yes | Unique identifier or attribute value for lastName. |
| `phone` | `string` | Yes | Normalized Ethiopian telephone number (+2519...). |
| `avatarUrl` | `string` | Yes | Unique identifier or attribute value for avatarUrl. |
| `passwordHash` | `string` | Yes | Unique identifier or attribute value for passwordHash. |
| `role` | `Role` | No | Unique identifier or attribute value for role. |
| `accountStatus` | `AccountStatus` | No | Unique identifier or attribute value for accountStatus. |
| `emailVerifiedAt` | `string` | Yes | ISO 8601 extended timestamp representation. |
| `createdAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `lastSignInAt` | `string` | Yes | ISO 8601 extended timestamp representation. |
| `branchId` | `string` | Yes | Foreign key referencing the associated branch record. |
| `branchName` | `string` | Yes | Unique identifier or attribute value for branchName. |
| `areaId` | `string` | Yes | Foreign key referencing the associated area record. |
| `areaName` | `string` | Yes | Unique identifier or attribute value for areaName. |
| `scope` | `UserScope` | Yes | Unique identifier or attribute value for scope. |

#### 12.1.114 Entity: `EmergencyContact`
Contact details for next-of-kin or emergency contacts for field safety operations.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | No | Descriptive display name in sentence case. |
| `relationship` | `string` | No | Unique identifier or attribute value for relationship. |
| `phone` | `string` | No | Normalized Ethiopian telephone number (+2519...). |

#### 12.1.123 Entity: `VolunteerProfile`
Operational volunteer dossier tracking rank, hours, badges, and skills portfolio.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `string` | No | Foreign key referencing the associated user record. |
| `firstName` | `string` | Yes | Unique identifier or attribute value for firstName. |
| `lastName` | `string` | Yes | Unique identifier or attribute value for lastName. |
| `fullName` | `string` | No | Unique identifier or attribute value for fullName. |
| `phone` | `string` | No | Normalized Ethiopian telephone number (+2519...). |
| `avatarUrl` | `string` | Yes | Unique identifier or attribute value for avatarUrl. |
| `dateOfBirth` | `string` | No | Unique identifier or attribute value for dateOfBirth. |
| `area` | `string` | No | Unique identifier or attribute value for area. |
| `branchId` | `string` | Yes | Foreign key referencing the associated branch record. |
| `branchName` | `string` | Yes | Unique identifier or attribute value for branchName. |
| `areaId` | `string` | Yes | Foreign key referencing the associated area record. |
| `areaName` | `string` | Yes | Unique identifier or attribute value for areaName. |
| `bio` | `string` | No | Unique identifier or attribute value for bio. |
| `skills` | `string[]` | No | Unique identifier or attribute value for skills. |
| `availability` | `string[]` | No | Unique identifier or attribute value for availability. |
| `languages` | `string[]` | No | Unique identifier or attribute value for languages. |
| `emergencyContact` | `EmergencyContact` | No | Unique identifier or attribute value for emergencyContact. |
| `photoUrl` | `string` | Yes | Unique identifier or attribute value for photoUrl. |
| `idPhotoUrl` | `string` | Yes | Unique identifier or attribute value for idPhotoUrl. |
| `rank` | `Rank` | Yes | Unique identifier or attribute value for rank. |
| `volunteerSince` | `string` | Yes | Unique identifier or attribute value for volunteerSince. |
| `memberSince` | `string` | Yes | Unique identifier or attribute value for memberSince. |
| `volunteerNumber` | `string` | Yes | Unique identifier or attribute value for volunteerNumber. |
| `rankHistory` | `RankHistoryMilestone[]` | Yes | Unique identifier or attribute value for rankHistory. |

#### 12.1.153 Entity: `ApplicationNote`
Internal administrative memo added to an application during manager screening review.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `authorId` | `string` | No | Foreign key referencing the associated author record. |
| `authorName` | `string` | No | Unique identifier or attribute value for authorName. |
| `createdAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `content` | `string` | No | Unique identifier or attribute value for content. |

#### 12.1.164 Entity: `Application`
Onboarding dossier submitted by or on behalf of a prospective volunteer candidate.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `userId` | `string` | No | Foreign key referencing the associated user record. |
| `status` | `ApplicationStatus` | No | Lifecycle state governed by the domain status enum. |
| `source` | `ApplicationSource` | Yes | Unique identifier or attribute value for source. |
| `createdBy` | `string` | Yes | Unique identifier or attribute value for createdBy. |
| `createdByName` | `string` | Yes | Unique identifier or attribute value for createdByName. |
| `branchId` | `string` | Yes | Foreign key referencing the associated branch record. |
| `branchName` | `string` | Yes | Unique identifier or attribute value for branchName. |
| `areaId` | `string` | Yes | Foreign key referencing the associated area record. |
| `areaName` | `string` | Yes | Unique identifier or attribute value for areaName. |
| `submittedAt` | `string` | Yes | ISO 8601 extended timestamp representation. |
| `reviewedBy` | `string` | Yes | Unique identifier or attribute value for reviewedBy. |
| `reviewedAt` | `string` | Yes | ISO 8601 extended timestamp representation. |
| `decisionReason` | `string` | Yes | Unique identifier or attribute value for decisionReason. |
| `paymentDeadline` | `string` | Yes | Unique identifier or attribute value for paymentDeadline. |
| `notes` | `ApplicationNote[]` | No | Unique identifier or attribute value for notes. |
| `formData` | `{` | Yes | Unique identifier or attribute value for formData. |
| `firstName` | `string` | Yes | Unique identifier or attribute value for firstName. |
| `lastName` | `string` | Yes | Unique identifier or attribute value for lastName. |
| `fullName` | `string` | No | Unique identifier or attribute value for fullName. |
| `phone` | `string` | No | Normalized Ethiopian telephone number (+2519...). |
| `avatarUrl` | `string` | Yes | Unique identifier or attribute value for avatarUrl. |
| `dateOfBirth` | `string` | No | Unique identifier or attribute value for dateOfBirth. |
| `area` | `string` | No | Unique identifier or attribute value for area. |
| `branchId` | `string` | Yes | Foreign key referencing the associated branch record. |
| `branchName` | `string` | Yes | Unique identifier or attribute value for branchName. |
| `areaId` | `string` | Yes | Foreign key referencing the associated area record. |
| `areaName` | `string` | Yes | Unique identifier or attribute value for areaName. |
| `skills` | `string[]` | No | Unique identifier or attribute value for skills. |
| `availability` | `string[]` | No | Unique identifier or attribute value for availability. |
| `motivation` | `string` | No | Unique identifier or attribute value for motivation. |
| `languages` | `string[]` | No | Unique identifier or attribute value for languages. |
| `emergencyContact` | `EmergencyContact` | No | Unique identifier or attribute value for emergencyContact. |
| `photoUrl` | `string` | Yes | Unique identifier or attribute value for photoUrl. |
| `idPhotoUrl` | `string` | Yes | Unique identifier or attribute value for idPhotoUrl. |
| `consentAgreed` | `boolean` | Yes | Unique identifier or attribute value for consentAgreed. |

#### 12.1.206 Entity: `Payment`
Financial ledger transaction for registration fees, manual receipts, or refunds.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `userId` | `string` | No | Foreign key referencing the associated user record. |
| `applicationId` | `string` | No | Foreign key referencing the associated application record. |
| `amount` | `number` | No | Monetary currency value in Ethiopian Birr (ETB). |
| `currency` | `'ETB'` | No | Unique identifier or attribute value for currency. |
| `telebirrReference` | `string` | No | Unique identifier or attribute value for telebirrReference. |
| `status` | `PaymentStatus` | No | Lifecycle state governed by the domain status enum. |
| `createdAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `confirmedAt` | `string` | Yes | ISO 8601 extended timestamp representation. |
| `receiptNumber` | `string` | Yes | Unique identifier or attribute value for receiptNumber. |
| `refundedAt` | `string` | Yes | ISO 8601 extended timestamp representation. |
| `refundReason` | `string` | Yes | Unique identifier or attribute value for refundReason. |
| `payerPhone` | `string` | Yes | Unique identifier or attribute value for payerPhone. |
| `payerName` | `string` | Yes | Unique identifier or attribute value for payerName. |
| `branchId` | `string` | Yes | Foreign key referencing the associated branch record. |
| `branchName` | `string` | Yes | Unique identifier or attribute value for branchName. |
| `areaId` | `string` | Yes | Foreign key referencing the associated area record. |
| `areaName` | `string` | Yes | Unique identifier or attribute value for areaName. |
| `paymentMethod` | `'telebirr' &#124; 'manual_record'` | Yes | Unique identifier or attribute value for paymentMethod. |
| `recordedBy` | `string` | Yes | Unique identifier or attribute value for recordedBy. |
| `verifiedBy` | `string` | Yes | Unique identifier or attribute value for verifiedBy. |
| `recordedByName` | `string` | Yes | Unique identifier or attribute value for recordedByName. |
| `note` | `string` | Yes | Unique identifier or attribute value for note. |

#### 12.1.235 Entity: `Activity`
Scheduled community event, field deployment, or service shift with budget and roster limits.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `title` | `string` | No | Descriptive display name in sentence case. |
| `type` | `ActivityType` | No | Unique identifier or attribute value for type. |
| `description` | `string` | No | Unique identifier or attribute value for description. |
| `startsAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `endsAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `area` | `string` | No | Unique identifier or attribute value for area. |
| `areaId` | `string` | Yes | Foreign key referencing the associated area record. |
| `areaName` | `string` | Yes | Unique identifier or attribute value for areaName. |
| `branchId` | `string` | Yes | Foreign key referencing the associated branch record. |
| `branchName` | `string` | Yes | Unique identifier or attribute value for branchName. |
| `place` | `string` | No | Unique identifier or attribute value for place. |
| `capacity` | `number` | No | Unique identifier or attribute value for capacity. |
| `minRank` | `Rank` | Yes | Unique identifier or attribute value for minRank. |
| `skills` | `string[]` | No | Unique identifier or attribute value for skills. |
| `leadId` | `string` | No | Foreign key referencing the associated lead record. |
| `leadName` | `string` | Yes | Unique identifier or attribute value for leadName. |
| `status` | `ActivityStatus` | No | Lifecycle state governed by the domain status enum. |
| `checkInCode` | `string` | No | Unique identifier or attribute value for checkInCode. |
| `coverUrl` | `string` | Yes | Unique identifier or attribute value for coverUrl. |
| `projectId` | `string` | Yes | Foreign key referencing the associated project record. |
| `projectName` | `string` | Yes | Unique identifier or attribute value for projectName. |

#### 12.1.263 Entity: `Enrollment`
Volunteer registration record for participation in a specific scheduled activity.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `activityId` | `string` | No | Foreign key referencing the associated activity record. |
| `userId` | `string` | No | Foreign key referencing the associated user record. |
| `status` | `EnrollmentStatus` | No | Lifecycle state governed by the domain status enum. |
| `joinedAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `leftAt` | `string` | Yes | ISO 8601 extended timestamp representation. |

#### 12.1.275 Entity: `HoursEntry`
Verified attendance shift log recording hours worked and supervisor sign-off.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `userId` | `string` | No | Foreign key referencing the associated user record. |
| `userName` | `string` | Yes | Unique identifier or attribute value for userName. |
| `activityId` | `string` | No | Foreign key referencing the associated activity record. |
| `activityTitle` | `string` | Yes | Unique identifier or attribute value for activityTitle. |
| `checkIn` | `string` | No | Unique identifier or attribute value for checkIn. |
| `checkOut` | `string` | No | Unique identifier or attribute value for checkOut. |
| `minutes` | `number` | No | Unique identifier or attribute value for minutes. |
| `source` | `HoursSource` | No | Unique identifier or attribute value for source. |
| `status` | `HoursStatus` | No | Lifecycle state governed by the domain status enum. |
| `decidedBy` | `string` | Yes | Unique identifier or attribute value for decidedBy. |
| `decisionReason` | `string` | Yes | Unique identifier or attribute value for decisionReason. |
| `createdAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `manualNote` | `string` | Yes | Unique identifier or attribute value for manualNote. |
| `evidenceUrl` | `string` | Yes | Unique identifier or attribute value for evidenceUrl. |
| `evidenceThumbnail` | `string` | Yes | Unique identifier or attribute value for evidenceThumbnail. |
| `evidenceNote` | `string` | Yes | Unique identifier or attribute value for evidenceNote. |
| `projectId` | `string` | Yes | Foreign key referencing the associated project record. |
| `projectName` | `string` | Yes | Unique identifier or attribute value for projectName. |
| `branchId` | `string` | Yes | Foreign key referencing the associated branch record. |

#### 12.1.301 Entity: `Rating`
Peer or supervisor quantitative evaluation and qualitative field endorsement.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `activityId` | `string` | No | Foreign key referencing the associated activity record. |
| `activityTitle` | `string` | Yes | Unique identifier or attribute value for activityTitle. |
| `userId` | `string` | No | Foreign key referencing the associated user record. |
| `userName` | `string` | Yes | Unique identifier or attribute value for userName. |
| `ratedBy` | `string` | No | Unique identifier or attribute value for ratedBy. |
| `ratedByName` | `string` | Yes | Unique identifier or attribute value for ratedByName. |
| `score` | `number` | No | Unique identifier or attribute value for score. |
| `note` | `string` | Yes | Unique identifier or attribute value for note. |
| `createdAt` | `string` | No | ISO 8601 extended timestamp representation. |

#### 12.1.317 Entity: `RankRule`
Administrative criteria configuring minimum hours, activities, and ratings for rank elevation.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `rank` | `Rank` | No | Unique identifier or attribute value for rank. |
| `minHours` | `number` | No | Unique identifier or attribute value for minHours. |
| `minActivities` | `number` | No | Unique identifier or attribute value for minActivities. |
| `minRating` | `number` | No | Unique identifier or attribute value for minRating. |
| `minMonths` | `number` | No | Unique identifier or attribute value for minMonths. |
| `requiredTraining` | `string` | No | Unique identifier or attribute value for requiredTraining. |

#### 12.1.329 Entity: `Promotion`
Formal merit elevation case submitted to the branch promotion review board.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `userId` | `string` | No | Foreign key referencing the associated user record. |
| `userName` | `string` | Yes | Unique identifier or attribute value for userName. |
| `userArea` | `string` | Yes | Unique identifier or attribute value for userArea. |
| `fromRank` | `Rank` | No | Unique identifier or attribute value for fromRank. |
| `toRank` | `Rank` | No | Unique identifier or attribute value for toRank. |
| `status` | `PromotionStatus` | No | Lifecycle state governed by the domain status enum. |
| `recommendedBy` | `string` | Yes | Unique identifier or attribute value for recommendedBy. |
| `recommendedByName` | `string` | Yes | Unique identifier or attribute value for recommendedByName. |
| `decidedBy` | `string` | Yes | Unique identifier or attribute value for decidedBy. |
| `decidedByName` | `string` | Yes | Unique identifier or attribute value for decidedByName. |
| `decidedAt` | `string` | Yes | ISO 8601 extended timestamp representation. |
| `note` | `string` | Yes | Unique identifier or attribute value for note. |
| `createdAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `evidence` | `{` | Yes | Unique identifier or attribute value for evidence. |
| `approvedHours` | `number` | No | Unique identifier or attribute value for approvedHours. |
| `completedActivities` | `number` | No | Unique identifier or attribute value for completedActivities. |
| `averageRating` | `number` | No | Unique identifier or attribute value for averageRating. |
| `monthsActive` | `number` | No | Unique identifier or attribute value for monthsActive. |
| `completedTraining` | `string[]` | No | Unique identifier or attribute value for completedTraining. |

#### 12.1.355 Entity: `Certificate`
Verifiable digital credential issued upon rank advancement or service achievement.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `userId` | `string` | No | Foreign key referencing the associated user record. |
| `userName` | `string` | No | Unique identifier or attribute value for userName. |
| `volunteerNumber` | `string` | No | Unique identifier or attribute value for volunteerNumber. |
| `kind` | `CertificateKind` | No | Unique identifier or attribute value for kind. |
| `title` | `string` | No | Descriptive display name in sentence case. |
| `issuedAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `verificationCode` | `string` | No | Unique identifier or attribute value for verificationCode. |
| `fileUrl` | `string` | Yes | Unique identifier or attribute value for fileUrl. |
| `issuerName` | `string` | Yes | Unique identifier or attribute value for issuerName. |
| `issuerRole` | `string` | Yes | Unique identifier or attribute value for issuerRole. |
| `metadata` | `{` | Yes | Unique identifier or attribute value for metadata. |
| `rank` | `Rank` | Yes | Unique identifier or attribute value for rank. |
| `trainingTitle` | `string` | Yes | Unique identifier or attribute value for trainingTitle. |
| `hoursRecorded` | `number` | Yes | Unique identifier or attribute value for hoursRecorded. |

#### 12.1.376 Entity: `Announcement`
Broadcast notification targeted to specific ranks, areas, or the entire organization.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `authorId` | `string` | No | Foreign key referencing the associated author record. |
| `authorName` | `string` | No | Unique identifier or attribute value for authorName. |
| `authorRole` | `string` | No | Unique identifier or attribute value for authorRole. |
| `audience` | `'all' &#124; Rank &#124; string` | No | Unique identifier or attribute value for audience. |
| `title` | `string` | No | Descriptive display name in sentence case. |
| `body` | `string` | No | Unique identifier or attribute value for body. |
| `createdAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `pinned` | `boolean` | Yes | Unique identifier or attribute value for pinned. |

#### 12.1.391 Entity: `Notification`
In-app event alert routed to a user notification center bell dropdown.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `userId` | `string` | No | Foreign key referencing the associated user record. |
| `title` | `string` | No | Descriptive display name in sentence case. |
| `body` | `string` | No | Unique identifier or attribute value for body. |
| `readAt` | `string` | Yes | ISO 8601 extended timestamp representation. |
| `createdAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `link` | `string` | Yes | Unique identifier or attribute value for link. |

#### 12.1.404 Entity: `ActivityLogEntry`
Audit trail event tracking sensitive administrative and operational mutations.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `actorId` | `string` | No | Foreign key referencing the associated actor record. |
| `actorName` | `string` | No | Unique identifier or attribute value for actorName. |
| `actorRole` | `string` | No | Unique identifier or attribute value for actorRole. |
| `action` | `string` | No | Unique identifier or attribute value for action. |
| `subject` | `string` | No | Unique identifier or attribute value for subject. |
| `createdAt` | `string` | No | ISO 8601 extended timestamp representation. |

#### 12.1.417 Entity: `Setting`
Global system configuration parameters (registration fee, payment window, rules).

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `key` | `string` | No | Unique identifier or attribute value for key. |
| `value` | `string &#124; number &#124; boolean` | No | Unique identifier or attribute value for value. |
| `label` | `string` | Yes | Unique identifier or attribute value for label. |
| `description` | `string` | Yes | Unique identifier or attribute value for description. |
| `category` | `'program' &#124; 'payment' &#124; 'ranks' &#124; 'certificates'` | Yes | Unique identifier or attribute value for category. |

#### 12.1.428 Entity: `DemoEmail`
Simulated transactional email record dispatched via the simulated Brevo engine.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `to` | `string` | No | Unique identifier or attribute value for to. |
| `toName` | `string` | No | Unique identifier or attribute value for toName. |
| `subject` | `string` | No | Unique identifier or attribute value for subject. |
| `body` | `string` | No | Unique identifier or attribute value for body. |
| `category` | `'verification' &#124; 'password_reset' &#124; 'application' &#124; 'payment' &#124; 'welcome' &#124; 'activity' &#124; 'hours' &#124; 'promotion'` | No | Unique identifier or attribute value for category. |
| `sentAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `read` | `boolean` | No | Unique identifier or attribute value for read. |
| `actionUrl` | `string` | Yes | Unique identifier or attribute value for actionUrl. |
| `actionLabel` | `string` | Yes | Unique identifier or attribute value for actionLabel. |
| `code` | `string` | Yes | Unique identifier or attribute value for code. |

#### 12.1.445 Entity: `RankHistoryMilestone`
Historical milestone record tracking when a volunteer achieved a specific rank.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `rank` | `Rank` | No | Unique identifier or attribute value for rank. |
| `rankTitle` | `string` | No | Unique identifier or attribute value for rankTitle. |
| `achievedAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `hoursRecorded` | `number` | Yes | Unique identifier or attribute value for hoursRecorded. |
| `approvedBy` | `string` | Yes | Unique identifier or attribute value for approvedBy. |
| `certificateCode` | `string` | Yes | Unique identifier or attribute value for certificateCode. |
| `note` | `string` | Yes | Unique identifier or attribute value for note. |

#### 12.1.458 Entity: `VolunteerFeedback`
Field feedback or grievance submitted by a volunteer regarding an activity.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `activityId` | `string` | No | Foreign key referencing the associated activity record. |
| `activityTitle` | `string` | No | Unique identifier or attribute value for activityTitle. |
| `userId` | `string` | No | Foreign key referencing the associated user record. |
| `userName` | `string` | No | Unique identifier or attribute value for userName. |
| `userArea` | `string` | Yes | Unique identifier or attribute value for userArea. |
| `rating` | `number` | No | Unique identifier or attribute value for rating. |
| `comment` | `string` | No | Unique identifier or attribute value for comment. |
| `submittedAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `status` | `'new' &#124; 'reviewed'` | No | Lifecycle state governed by the domain status enum. |

#### 12.1.474 Entity: `EmailTemplate`
Transactional email template definition including subject line and dynamic payload variables.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `key` | `string` | No | Unique identifier or attribute value for key. |
| `name` | `string` | No | Descriptive display name in sentence case. |
| `subject` | `string` | No | Unique identifier or attribute value for subject. |
| `body` | `string` | No | Unique identifier or attribute value for body. |
| `category` | `string` | No | Unique identifier or attribute value for category. |
| `variables` | `string[]` | No | Unique identifier or attribute value for variables. |

#### 12.1.487 Entity: `Project`
Strategic initiative or civic charter grouping multiple branch activities and managing budgets.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `name` | `string` | No | Descriptive display name in sentence case. |
| `description` | `string` | No | Unique identifier or attribute value for description. |
| `branchId` | `string` | No | Foreign key referencing the associated branch record. |
| `branchName` | `string` | Yes | Unique identifier or attribute value for branchName. |
| `areaId` | `string` | Yes | Foreign key referencing the associated area record. |
| `areaName` | `string` | Yes | Unique identifier or attribute value for areaName. |
| `start` | `string` | No | Unique identifier or attribute value for start. |
| `end` | `string` | No | Unique identifier or attribute value for end. |
| `budget` | `number` | No | Monetary currency value in Ethiopian Birr (ETB). |
| `allowancePerDay` | `number` | No | Unique identifier or attribute value for allowancePerDay. |
| `spent` | `number` | Yes | Unique identifier or attribute value for spent. |
| `reserved` | `number` | Yes | Unique identifier or attribute value for reserved. |
| `managerId` | `string` | No | Foreign key referencing the associated manager record. |
| `managerName` | `string` | Yes | Unique identifier or attribute value for managerName. |
| `status` | `ProjectStatus` | No | Lifecycle state governed by the domain status enum. |
| `createdAt` | `string` | No | ISO 8601 extended timestamp representation. |

#### 12.1.510 Entity: `Assignment`
Official deployment record allocating a volunteer to a project under a designated supervisor.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `projectId` | `string` | Yes | Foreign key referencing the associated project record. |
| `projectName` | `string` | Yes | Unique identifier or attribute value for projectName. |
| `activityId` | `string` | Yes | Foreign key referencing the associated activity record. |
| `activityTitle` | `string` | Yes | Unique identifier or attribute value for activityTitle. |
| `branchId` | `string` | Yes | Foreign key referencing the associated branch record. |
| `branchName` | `string` | Yes | Unique identifier or attribute value for branchName. |
| `areaId` | `string` | Yes | Foreign key referencing the associated area record. |
| `areaName` | `string` | Yes | Unique identifier or attribute value for areaName. |
| `volunteerId` | `string` | No | Foreign key referencing the associated volunteer record. |
| `volunteerName` | `string` | Yes | Unique identifier or attribute value for volunteerName. |
| `volunteerRank` | `Rank` | Yes | Unique identifier or attribute value for volunteerRank. |
| `supervisorId` | `string` | No | Foreign key referencing the associated supervisor record. |
| `supervisorName` | `string` | Yes | Unique identifier or attribute value for supervisorName. |
| `status` | `AssignmentStatus` | No | Lifecycle state governed by the domain status enum. |
| `assignedBy` | `string` | No | Unique identifier or attribute value for assignedBy. |
| `assignedByName` | `string` | Yes | Unique identifier or attribute value for assignedByName. |
| `assignedAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `startDate` | `string` | No | ISO 8601 extended timestamp representation. |
| `endDate` | `string` | Yes | ISO 8601 extended timestamp representation. |
| `decidedAt` | `string` | Yes | ISO 8601 extended timestamp representation. |
| `declineReason` | `string` | Yes | Unique identifier or attribute value for declineReason. |
| `notes` | `string` | Yes | Unique identifier or attribute value for notes. |

#### 12.1.539 Entity: `RequiredDocumentConfig`
Administrative rule specifying mandatory identification documents required for intake.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `name` | `string` | No | Descriptive display name in sentence case. |
| `description` | `string` | No | Unique identifier or attribute value for description. |
| `required` | `boolean` | No | Unique identifier or attribute value for required. |
| `appliesToRole` | `string` | Yes | Unique identifier or attribute value for appliesToRole. |

#### 12.1.550 Entity: `ApplicationDocument`
Uploaded identification document or credential attached to an onboarding application.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `applicationId` | `string` | No | Foreign key referencing the associated application record. |
| `configId` | `string` | No | Foreign key referencing the associated config record. |
| `name` | `string` | No | Descriptive display name in sentence case. |
| `fileName` | `string` | No | Unique identifier or attribute value for fileName. |
| `fileSize` | `number` | No | Unique identifier or attribute value for fileSize. |
| `fileUrl` | `string` | No | Unique identifier or attribute value for fileUrl. |
| `uploadedAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `status` | `DocumentReviewStatus` | No | Lifecycle state governed by the domain status enum. |
| `reviewNote` | `string` | Yes | Unique identifier or attribute value for reviewNote. |
| `reviewedBy` | `string` | Yes | Unique identifier or attribute value for reviewedBy. |
| `reviewedByName` | `string` | Yes | Unique identifier or attribute value for reviewedByName. |
| `reviewedAt` | `string` | Yes | ISO 8601 extended timestamp representation. |

#### 12.1.569 Entity: `CompletedActivitySubmission`
On-site shift completion submission containing short code and photo evidence.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `volunteerId` | `string` | No | Foreign key referencing the associated volunteer record. |
| `volunteerName` | `string` | Yes | Unique identifier or attribute value for volunteerName. |
| `title` | `string` | No | Descriptive display name in sentence case. |
| `date` | `string` | No | Unique identifier or attribute value for date. |
| `hours` | `number` | No | Unique identifier or attribute value for hours. |
| `branchId` | `string` | No | Foreign key referencing the associated branch record. |
| `branchName` | `string` | Yes | Unique identifier or attribute value for branchName. |
| `areaId` | `string` | Yes | Foreign key referencing the associated area record. |
| `areaName` | `string` | Yes | Unique identifier or attribute value for areaName. |
| `projectId` | `string` | Yes | Foreign key referencing the associated project record. |
| `projectName` | `string` | Yes | Unique identifier or attribute value for projectName. |
| `evidenceUrl` | `string` | No | Unique identifier or attribute value for evidenceUrl. |
| `evidenceThumbnail` | `string` | Yes | Unique identifier or attribute value for evidenceThumbnail. |
| `evidenceNote` | `string` | No | Unique identifier or attribute value for evidenceNote. |
| `supervisorId` | `string` | No | Foreign key referencing the associated supervisor record. |
| `supervisorName` | `string` | Yes | Unique identifier or attribute value for supervisorName. |
| `status` | `'submitted' &#124; 'verified' &#124; 'approved' &#124; 'declined'` | No | Lifecycle state governed by the domain status enum. |
| `submittedAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `decidedBy` | `string` | Yes | Unique identifier or attribute value for decidedBy. |
| `decidedByName` | `string` | Yes | Unique identifier or attribute value for decidedByName. |
| `decisionReason` | `string` | Yes | Unique identifier or attribute value for decisionReason. |
| `decidedAt` | `string` | Yes | ISO 8601 extended timestamp representation. |

#### 12.1.598 Entity: `DisbursementDetails`
Financial payment details recorded upon executing a Telebirr B2C allowance disbursement.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `provider` | `'telebirr'` | No | Unique identifier or attribute value for provider. |
| `phone` | `string` | No | Normalized Ethiopian telephone number (+2519...). |
| `fee` | `number` | No | Monetary currency value in Ethiopian Birr (ETB). |
| `transactionId` | `string` | No | Foreign key referencing the associated transaction record. |
| `disbursedAt` | `string` | No | ISO 8601 extended timestamp representation. |

#### 12.1.609 Entity: `AllowanceRequest`
Stipend claim submitted for field volunteers requiring multi-tier four-eye approval.

| Field Name | Type | Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | No | Primary key identifier (UUID or standard alphanumeric code). |
| `allowanceNumber` | `string` | No | Unique identifier or attribute value for allowanceNumber. |
| `projectId` | `string` | No | Foreign key referencing the associated project record. |
| `projectName` | `string` | Yes | Unique identifier or attribute value for projectName. |
| `branchId` | `string` | No | Foreign key referencing the associated branch record. |
| `branchName` | `string` | Yes | Unique identifier or attribute value for branchName. |
| `areaId` | `string` | Yes | Foreign key referencing the associated area record. |
| `areaName` | `string` | Yes | Unique identifier or attribute value for areaName. |
| `activityId` | `string` | Yes | Foreign key referencing the associated activity record. |
| `activityTitle` | `string` | Yes | Unique identifier or attribute value for activityTitle. |
| `volunteerId` | `string` | No | Foreign key referencing the associated volunteer record. |
| `volunteerName` | `string` | No | Unique identifier or attribute value for volunteerName. |
| `volunteerPhone` | `string` | Yes | Unique identifier or attribute value for volunteerPhone. |
| `days` | `number` | No | Unique identifier or attribute value for days. |
| `allowancePerDay` | `number` | No | Unique identifier or attribute value for allowancePerDay. |
| `totalAmount` | `number` | No | Monetary currency value in Ethiopian Birr (ETB). |
| `linkedHoursId` | `string` | Yes | Foreign key referencing the associated linkedHours record. |
| `linkedSubmissionId` | `string` | Yes | Foreign key referencing the associated linkedSubmission record. |
| `status` | `AllowanceStatus` | No | Lifecycle state governed by the domain status enum. |
| `preparedBy` | `string` | No | Unique identifier or attribute value for preparedBy. |
| `preparedByName` | `string` | No | Unique identifier or attribute value for preparedByName. |
| `preparedAt` | `string` | No | ISO 8601 extended timestamp representation. |
| `supervisorId` | `string` | Yes | Foreign key referencing the associated supervisor record. |
| `supervisorName` | `string` | Yes | Unique identifier or attribute value for supervisorName. |
| `verifiedBy` | `string` | Yes | Unique identifier or attribute value for verifiedBy. |
| `verifiedByName` | `string` | Yes | Unique identifier or attribute value for verifiedByName. |
| `verifiedAt` | `string` | Yes | ISO 8601 extended timestamp representation. |
| `supervisorNotes` | `string` | Yes | Unique identifier or attribute value for supervisorNotes. |
| `approvedBy` | `string` | Yes | Unique identifier or attribute value for approvedBy. |
| `approvedByName` | `string` | Yes | Unique identifier or attribute value for approvedByName. |
| `approvedAt` | `string` | Yes | ISO 8601 extended timestamp representation. |
| `rejectionReason` | `string` | Yes | Unique identifier or attribute value for rejectionReason. |
| `paymentReference` | `string` | Yes | Unique identifier or attribute value for paymentReference. |
| `paidAt` | `string` | Yes | ISO 8601 extended timestamp representation. |
| `paidBy` | `string` | Yes | Unique identifier or attribute value for paidBy. |
| `paidByName` | `string` | Yes | Unique identifier or attribute value for paidByName. |
| `failureReason` | `string` | Yes | Unique identifier or attribute value for failureReason. |
| `disbursementDetails` | `DisbursementDetails` | Yes | Unique identifier or attribute value for disbursementDetails. |
| `createdAt` | `string` | No | ISO 8601 extended timestamp representation. |

### 12.2 Status Enums Catalog

The table below details all 13 status enums, enumerating their allowed values and operational contexts:

| Enum Type | Allowed Values | Domain Context |
| :--- | :--- | :--- |
| `AccountStatus` | `pending_verification`, `active`, `suspended`, `locked` | Governs state transitions for `AccountStatus` lifecycle. |
| `ApplicationStatus` | `draft`, `submitted`, `in_review`, `more_info_needed`, `accepted`, `rejected`, `expired`, `withdrawn` | Governs state transitions for `ApplicationStatus` lifecycle. |
| `PaymentStatus` | `pending`, `confirmed`, `failed`, `needs_review`, `refunded` | Governs state transitions for `PaymentStatus` lifecycle. |
| `HoursStatus` | `logged`, `approved`, `declined` | Governs state transitions for `HoursStatus` lifecycle. |
| `PromotionStatus` | `not_eligible`, `eligible`, `recommended`, `approved`, `declined` | Governs state transitions for `PromotionStatus` lifecycle. |
| `ActivityStatus` | `draft`, `published`, `in_progress`, `completed`, `cancelled` | Governs state transitions for `ActivityStatus` lifecycle. |
| `EnrollmentStatus` | `joined`, `waitlisted`, `cancelled`, `attended`, `no_show` | Governs state transitions for `EnrollmentStatus` lifecycle. |
| `CertificateKind` | `membership`, `rank_advancement`, `training_completion`, `appreciation` | Governs state transitions for `CertificateKind` lifecycle. |
| `OrgUnitType` | `head_office`, `area`, `branch`, `location` | Governs state transitions for `OrgUnitType` lifecycle. |
| `ProjectStatus` | `planning`, `active`, `completed`, `paused` | Governs state transitions for `ProjectStatus` lifecycle. |
| `AssignmentStatus` | `assigned`, `accepted`, `declined`, `completed` | Governs state transitions for `AssignmentStatus` lifecycle. |
| `DocumentReviewStatus` | `pending`, `accepted`, `returned_for_correction` | Governs state transitions for `DocumentReviewStatus` lifecycle. |
| `AllowanceStatus` | `draft`, `submitted`, `verified`, `approved`, `paid`, `rejected`, `failed` | Governs state transitions for `AllowanceStatus` lifecycle. |

### 12.3 Complete Entity-Relationship Diagram

The entity-relationship diagram below illustrates the relational cardinalities, primary keys, and foreign key dependencies connecting the core domain tables:

```mermaid
erDiagram
    ORG_UNIT ||--o{ ORG_UNIT : "nests under"
    ORG_UNIT ||--o{ USER : "employs / assigns"
    ORG_UNIT ||--o{ PROJECT : "charters"
    ORG_UNIT ||--o{ ACTIVITY : "hosts"
    USER ||--o| VOLUNTEER_PROFILE : "possesses"
    USER ||--o{ APPLICATION : "submits"
    APPLICATION ||--o{ APPLICATION_DOCUMENT : "includes"
    APPLICATION ||--o{ PAYMENT : "generates"
    PROJECT ||--o{ ACTIVITY : "organizes"
    PROJECT ||--o{ ASSIGNMENT : "allocates"
    ACTIVITY ||--o{ ENROLLMENT : "enlists"
    ACTIVITY ||--o{ HOURS_ENTRY : "logs"
    ACTIVITY ||--o{ ALLOWANCE_REQUEST : "funds"
    VOLUNTEER_PROFILE ||--o{ ENROLLMENT : "participates"
    VOLUNTEER_PROFILE ||--o{ HOURS_ENTRY : "records"
    VOLUNTEER_PROFILE ||--o{ PROMOTION : "evaluates"
    VOLUNTEER_PROFILE ||--o{ CERTIFICATE : "receives"

    ORG_UNIT {
        string id PK
        string type
        string name
        string parentId FK
    }
    USER {
        string id PK
        string email
        string role
        string scopeUnitId FK
    }
    APPLICATION {
        string id PK
        string userId FK
        string branchId FK
        string status
    }
    PAYMENT {
        string id PK
        string applicationId FK
        float amountETB
        string status
        string method
    }
    PROJECT {
        string id PK
        string name
        string branchId FK
        float allocatedBudget
        string status
    }
    ACTIVITY {
        string id PK
        string projectId FK
        string branchId FK
        string title
        string status
    }
    ALLOWANCE_REQUEST {
        string id PK
        string projectId FK
        string activityId FK
        float totalAmountETB
        string status
    }
```

---

## 13. Mock Data and Evaluation System

To enable thorough, deterministic end-to-end evaluation without live external dependencies, VTS features a fully self-contained mock data engine. The engine hydrates browser storage on first load and supports dynamic date offsets to ensure the application never appears stale or expired.

### 13.1 Dynamic Relative Date Generation

Mock timestamps are not hardcoded static calendar dates. Instead, the seeding engine in `client/src/api/seedData.ts` computes timestamps relative to the evaluator's current execution clock:
- **Past Shift Timestamps**: Generated using `new Date(Date.now() - days * 86400000).toISOString()`, ensuring past activities and logged hours always appear historically valid.
- **Upcoming Activities**: Generated using `new Date(Date.now() + days * 86400000).toISOString()`, ensuring upcoming shifts, countdown timers, and payment settlement windows are always active.
- **Payment Window Timer**: Set dynamically to `Date.now() + 14 * 86400000` (14 days from current launch), allowing evaluators to experience the live countdown.

### 13.2 Seed Dataset Inventory

The seed database initializes with a rich, realistic civic operational dataset:

| Domain Collection | Seed Records Count | Key Exemplars Included |
| :--- | :--- | :--- |
| **Administrative Users** | 52 accounts | Super Admin (Abebe), Managers (Dawit, Aster), Team Lead (Rahel), Finance (Fikadu) |
| **Organizational Units** | 10 units | Head Office (HQ-AA), Addis Metro, Kirkos Branch, Bole Branch |
| **Community Projects** | 4 projects | Kirkos Sanitation, Youth Digital Literacy, Senior Care, Green Legacy |
| **Scheduled Activities** | 25 activities | Tree Planting, Drainage Clearing, Computer Basics, Food Distribution |
| **Onboarding Applications**| 18 dossiers | Online applicant (Yared), Walk-in applicant (Tigist), Rejected applicant |
| **Payment Ledger Entries** | 60 transactions | Telebirr digital payments, manual cash intake receipts, refund cases |
| **Volunteer Profiles** | 52 profiles | Volunteer (Almaz), Senior Volunteer (Kenenisa), Master Leader (Derartu) |
| **Attendance Hours Logs** | 68 shifts | Verified shifts, pending Team Lead reviews, declined submissions |
| **Promotion Board Cases** | 8 cases | Eligible candidates awaiting elevation, approved cases, historical reviews |
| **Digital Certificates** | 16 credentials | Verifiable PDF credentials with SHA-256 verification hashes |
| **Field Allowance Claims**| 13 claims | Submitted claims, verified scopes, approved budgets, disbursed Telebirr batches |
| **Email Templates** | 10 templates | Brevo transactional templates for all 10 core event triggers |

### 13.3 Nine-Step Evaluation Demo Script

Evaluators can verify the complete system progression using the standard 9-step demo script:

#### Step 1: Assisted Intake
- **Persona / Role**: `tigist.wolde`
- **Starting Route**: [`/manager/register-volunteer`](http://localhost:5173/manager/register-volunteer)
- **Action / Task**: Register walk-in volunteer in 4 steps with Kebele ID and cash receipt.

#### Step 2: Document Correction Notice
- **Persona / Role**: `marta.girma`
- **Starting Route**: [`/manager/applications`](http://localhost:5173/manager/applications)
- **Action / Task**: Return blurry Kebele ID upload for correction with required explanatory note.

#### Step 3: Document Replacement & Payment
- **Persona / Role**: `hana.tesfaye`
- **Starting Route**: [`/applicant/status & /applicant/payment`](http://localhost:5173/applicant/status & /applicant/payment)
- **Action / Task**: Upload replacement file and settle ETB 200 fee via Telebirr push to activate volunteer status.

#### Step 4: Project Charter & Budgets
- **Persona / Role**: `marta.girma`
- **Starting Route**: [`/manager/projects & detail`](http://localhost:5173/manager/projects & detail)
- **Action / Task**: Observe remaining budget figure; inspect assigned volunteers and ticket cards.

#### Step 5: Allowance Preparation
- **Persona / Role**: `marta.girma`
- **Starting Route**: [`/manager/allowances`](http://localhost:5173/manager/allowances)
- **Action / Task**: Prepare 3-day stipend for Dawit Bekele under Kirkos project within budget limit.

#### Step 6: Supervisor Verification
- **Persona / Role**: `yonas.kebede`
- **Starting Route**: [`/team-lead/allowances`](http://localhost:5173/team-lead/allowances)
- **Action / Task**: Verify field service attendance with physical confirmation note.

#### Step 7: Budget Authority Approval
- **Persona / Role**: `ruth.mengistu`
- **Starting Route**: [`/admin/allowances`](http://localhost:5173/admin/allowances)
- **Action / Task**: Approve reserved budget funds (confirming self-approval ban blocks preparer).

#### Step 8: Telebirr Disbursement
- **Persona / Role**: `abel.hailu`
- **Starting Route**: [`/finance/allowances`](http://localhost:5173/finance/allowances)
- **Action / Task**: Execute mobile wallet payout; observe official transaction reference generation.

#### Step 9: Volunteer Celebration
- **Persona / Role**: `dawit.bekele`
- **Starting Route**: [`/volunteer/allowances`](http://localhost:5173/volunteer/allowances)
- **Action / Task**: Inspect status journey timeline, Telebirr reference, and trigger celebration overlay.

### 13.4 Evaluator Troubleshooting Guide

| Symptom / Issue | Underlying Root Cause | Corrective Resolution Step |
| :--- | :--- | :--- |
| **Data changes not visible across tabs** | Browser tabs running in separate storage contexts | Refresh the target tab. VTS syncs with `localStorage` on window focus and route transitions. |
| **Stale or corrupted demo data** | Previous manual testing created conflicting records | Click **Reset Demo Data** in the top navigation bar or run `localStorage.clear()` in developer console. |
| **403 Forbidden Screen Displayed** | Attempting to access route unauthorized for current role | Use the **Switch Account** drawer in the header to switch to an account possessing authorized role scope. |
| **Telebirr Simulation Timeout** | In-flight mock payment delay set for realism | The payment simulation includes a realistic 1.5-second processing latency; wait for completion alert. |

---

## 14. Architecture and Design System

VTS is architected as a modern, high-performance single-page web application (SPA) built with React 18, TypeScript, Tailwind CSS, and Vite. Its visual identity embodies a clean, editorial aesthetic characterized by a zero-border design language, calm tonal surfaces, confident typography, and purposeful signature components.

### 14.1 Directory Layout & Module Responsibilities

The source code is organized modularly under `client/src/`:

```text
client/src/
├── api/                 # 23 modular API services encapsulating domain queries and mutations
├── components/          # Reusable UI component library
│   ├── common/          # Low-level primitives: Button, Input, Modal, Table, Tabs
│   ├── dev/             # Evaluator debugging tools: DevAccountSwitcher, RoleIndicator
│   ├── layout/          # Structural scaffolding: AppHeader, AppSidebar, PageShell
│   ├── notifications/   # In-app notification center bell, unread badge, and notification list
│   └── signature/       # VTS signature components: KpiBand, TicketCard, RankBadge, StepRail,
│                        # EvidenceDrawer, VolunteerPass
├── context/             # Global application state: AuthContext, utils/permissions.ts
├── data/                # Mock data engine: seedData, mockData, relative date generators
├── hooks/               # Custom React hooks: useAuth, usePermission, useDebounce, useMediaQuery
├── pages/               # 59 route screen components organized by role workspace
│   ├── admin/           # Super Admin governance screens (settings, permissions, org tree, logs)
│   ├── applicant/       # Applicant portal (status tracker, Telebirr payment checkout)
│   ├── finance/         # Finance Officer screens (allowances, payments, review queue, reports)
│   ├── manager/         # Branch Manager screens (applications, projects, roster, promotions)
│   ├── public/          # Public screens (Landing, /apply, /verify/:id, Login, 404)
│   ├── teamLead/        # Team Lead screens (assigned activities, hours logging, attendance)
│   └── volunteer/       # Volunteer portal (profile, activities, hours history, certificates)
├── types/               # TypeScript domain model, interfaces, enums, and utility types
└── utils/               # Formatting helpers: date, currency, phone normalization, crypto
```

### 14.2 Front-End State Layer & Persistence

The front-end manages state across two integrated layers:
- **Context-Driven Authentication & RBAC**: `AuthContext` maintains the active authenticated session, user credentials, and active organizational scope. `utils/permissions.ts` provides real-time access control checks via `can(module, action)`.
- **Simulated Local Storage Database**: All mutable collections (`vts_users`, `vts_applications`, `vts_payments`, `vts_activities`, `vts_projects`, `vts_allowances`, `vts_notifications`) persist in browser `localStorage`. Mutations dispatch custom browser events (`vts-storage-mutation`) allowing adjacent components and multi-tab sessions to synchronize instantly.

### 14.3 Routing Architecture & Guards

Client routing is declared using React Router 6 in `client/src/App.tsx`. Access to protected workspaces is strictly governed by the `RoleRoute` guard component:
- **Unauthenticated Access**: Directs visitors to `/login` or `/apply`.
- **Role Scope Violation**: If an authenticated user attempts to access a path unauthorized for their role (e.g., a Volunteer navigating to `/admin/settings`), the guard catches the mismatch and renders a friendly 403 Forbidden surface.
- **Scroll & Viewport Restoration**: Every route change triggers a scroll reset to top `(0, 0)` and closes mobile drawer menus.

### 14.4 Navigation & AppSidebar Architecture

Signed-in user navigation is centralized within `AppSidebar.tsx`:
- **Desktop Viewport (1024px and up)**: Fixed left sidebar (264px width) rendered with a clean white surface and subtle separation from the main canvas. Features organizational branding, current user avatar, active role badge, and categorized navigation links.
- **Mobile Viewport (360px to 1023px)**: Hidden off-canvas drawer invoked via the top header hamburger trigger. Automatically closes when a navigation link is clicked.
- **Visual Navigation Feedback**: Active links feature a high-contrast tonal pill background (`#F1F3F6`) and primary dark text (`#101828`), while inactive items rest in muted slate (`#475467`).

### 14.5 Design Tokens & Zero-Border Design Language

VTS adheres to a strict zero-border design language. Outlines, 1px dividers, and dark borders are forbidden. Spatial organization and visual separation are achieved exclusively through surface tone, generous padding, and subtle elevation:

| Token Category | Specification / Value | Usage Context |
| :--- | :--- | :--- |
| **Canvas Background** | `#FFFFFF` (Pure White) | Universal page canvas and main container background. |
| **Panel Fill** | `#F7F8FA` (Soft Tonal Grey) | Primary structural containers, table wrappers, and sidebars. |
| **Input & Select Fill** | `#F1F3F6` (Tonal Grey) | Form input backgrounds, search fields, and dropdown elements. |
| **Text Primary** | `#101828` (Deep Charcoal) | Primary headings, titles, active nav labels, and prominent numbers. |
| **Text Muted** | `#475467` (Slate Grey) | Secondary descriptions, timestamps, metadata labels, and helper copy. |
| **Soft Elevation Shadow** | `0 1px 2px rgba(16,24,40,0.05), 0 8px 24px -12px rgba(16,24,40,0.10)` | Floating raised cards, popovers, dropdown menus, and dialogs. |
| **Large Radius** | `16px` (`rounded-2xl`) | Raised cards, modal dialogs, and high-level dashboard panels. |
| **Medium Radius** | `12px` (`rounded-xl`) | Text inputs, selects, action buttons, and table rows. |
| **Small Radius** | `8px` (`rounded-lg`) | Status chips, rank badges, and notification counters. |

### 14.6 Signature Design Components

Six shared signature components establish the visual identity and interaction rhythm across all workspaces:

1. **TopoBackdrop (TopoBackdrop.tsx)**: An SVG-rendered topographic contour elevation backdrop providing authentic geographic and geographic trail texture to page headers with subtle non-distracting opacity.
2. **TrailMeter (TrailMeter.tsx)**: A dynamic milestone progression curve visualizing a volunteer's verified service hours toward the next rank tier, highlighting remaining hour gaps and milestone markers.
3. **TicketCard (TicketCard.tsx)**: A distinctive rectangular ticket card representing scheduled community deployments and field activities, featuring a notched ticket-stub silhouette, start time, venue, and roster capacity counters.
4. **JourneyLog (JourneyLog.tsx)**: A step-by-step chronological vertical timeline component used across attendance verification, allowance approval stages, and payment transaction audits.
5. **MomentOverlay (MomentOverlay.tsx)**: A celebratory full-screen modal overlay that triggers upon merit rank elevation or completed Telebirr allowance disbursements, reinforcing operational achievement.
6. **VolunteerCard (VolunteerCard.tsx / TicketPass.tsx)**: An official verifiable identification pass featuring volunteer portrait, full legal name, unique volunteer ID, branch affiliation, and a cryptographically signed QR code for instant field validation.

### 14.7 Plain Language & Copy Rules

To ensure clarity and accessibility for community staff and volunteers, VTS enforces strict typographical standards:
- **Sentence Case Everywhere**: All page headers, card titles, table columns, button labels, and status badges use sentence case (e.g., 'Review applications', not 'REVIEW APPLICATIONS' or 'Review Applications').
- **Direct Plain English**: Technical jargon, corporate buzzwords, and marketing rhetoric are prohibited. For example, use 'Pay registration fee' instead of 'Proceed to digital monetization gateway'.
- **Consistent Currency Formatting**: All monetary figures are formatted as `ETB X,XXX.XX` (e.g., `ETB 200.00`, `ETB 1,450.00`).
- **Zero Emojis**: Emojis and decorative symbols are prohibited throughout the user interface, documentation, and notifications. Statuses are indicated solely using plain words (`Done`, `Simulated`, `Planned`, `Pass`, `Fail`).

---

## 15. API Contract & Endpoint Mapping

The VTS client communicates with the data layer through 66 typed service functions located in `client/src/api/`. In the prototype, these functions read and mutate the simulated browser database with simulated network latency. In production, each function maps directly to a RESTful Express/PostgreSQL endpoint.

### 15.1 Complete 66-Function API Catalog

The table below details all 66 API service functions, specifying their HTTP method, REST path, signature parameters, return types, and target database tables:

| Function Name | HTTP & Path | Purpose | Parameters | Return Type | Target Table |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `getActivityById` | `GET /api/activities` | Service call for getActivityById | `activityId: string` | `Promise<Activity &#124; null>` | `activities` |
| `cancelActivity` | `PUT /api/activities` | Service call for cancelActivity | `activityId: string, reason: string` | `Promise<Activity>` | `activities` |
| `completeActivity` | `GET /api/activities` | Service call for completeActivity | `activityId: string` | `Promise<Activity>` | `activities` |
| `getActivityLog` | `GET /api/activityHistory` | Service call for getActivityLog | `query?: string` | `Promise<ActivityLogEntry[]>` | `activity_logs` |
| `getAllowanceById` | `GET /api/allowances` | Service call for getAllowanceById | `id: string` | `Promise<AllowanceRequest &#124; null>` | `allowance_requests` |
| `computeProjectBudgetMetrics` | `GET /api/allowances` | Service call for computeProjectBudgetMetrics | `projectId: string` | `` | `allowance_requests` |
| `approveAllowance` | `PUT /api/allowances` | Service call for approveAllowance | `id: string` | `Promise<AllowanceRequest>` | `allowance_requests` |
| `rejectAllowance` | `GET /api/allowances` | Service call for rejectAllowance | `id: string, reason: string` | `Promise<AllowanceRequest>` | `allowance_requests` |
| `retryDisbursement` | `GET /api/allowances` | Service call for retryDisbursement | `id: string` | `Promise<AllowanceRequest>` | `allowance_requests` |
| `getAnnouncements` | `GET /api/announcements` | Service call for getAnnouncements | `audience?: string` | `Promise<Announcement[]>` | `announcements` |
| `getMyApplication` | `GET /api/applications` | Service call for getMyApplication | `userId: string` | `Promise<Application &#124; null>` | `applications` |
| `getApplicationById` | `GET /api/applications` | Service call for getApplicationById | `appId: string` | `Promise<Application &#124; null>` | `applications` |
| `withdrawApplication` | `GET /api/applications` | Service call for withdrawApplication | `appId: string` | `Promise<Application>` | `applications` |
| `getSupervisedVolunteers` | `GET /api/assignments` | Service call for getSupervisedVolunteers | `supervisorId: string` | `Promise<SupervisedVolunteerSummary[]>` | `assignments` |
| `signIn` | `GET /api/auth` | Service call for signIn | `identifier: string, password: string` | `Promise<User>` | `users / sessions` |
| `updateProfilePhoto` | `PUT /api/auth` | Service call for updateProfilePhoto | `userId: string, avatarUrl?: string` | `Promise<User>` | `users / sessions` |
| `verifyEmail` | `PUT /api/auth` | Service call for verifyEmail | `email: string, code: string` | `Promise<User>` | `users / sessions` |
| `resendVerificationCode` | `GET /api/auth` | Service call for resendVerificationCode | `email: string` | `Promise<string>` | `users / sessions` |
| `forgotPassword` | `GET /api/auth` | Service call for forgotPassword | `email: string` | `Promise<void>` | `users / sessions` |
| `resetPassword` | `GET /api/auth` | Service call for resetPassword | `email: string, newPassword: string` | `Promise<void>` | `users / sessions` |
| `getCurrentUserSync` | `GET /api/auth` | Service call for getCurrentUserSync | `none` | `User &#124; null` | `users / sessions` |
| `getCurrentUser` | `GET /api/auth` | Service call for getCurrentUser | `none` | `Promise<User &#124; null>` | `users / sessions` |
| `signOut` | `GET /api/auth` | Service call for signOut | `none` | `Promise<void>` | `users / sessions` |
| `getSignInLogs` | `GET /api/auth` | Service call for getSignInLogs | `userId?: string` | `Promise<SignInLogEntry[]>` | `users / sessions` |
| `recordSignInLog` | `POST /api/auth` | Service call for recordSignInLog | `entry: Omit<SignInLogEntry, 'id' &#124; 'timestamp'>` | `Promise<SignInLogEntry>` | `users / sessions` |
| `getCertificatesForUser` | `GET /api/certificates` | Service call for getCertificatesForUser | `userId: string` | `Promise<Certificate[]>` | `certificates` |
| `getAllDemoEmails` | `GET /api/demoEmails` | Service call for getAllDemoEmails | `none` | `Promise<DemoEmail[]>` | `demo_emails` |
| `getDemoEmailById` | `GET /api/demoEmails` | Service call for getDemoEmailById | `id: string` | `Promise<DemoEmail &#124; null>` | `demo_emails` |
| `markDemoEmailRead` | `GET /api/demoEmails` | Service call for markDemoEmailRead | `id: string` | `Promise<void>` | `demo_emails` |
| `getRequiredDocuments` | `GET /api/documents` | Service call for getRequiredDocuments | `none` | `Promise<RequiredDocumentConfig[]>` | `application_documents` |
| `getApplicationDocuments` | `GET /api/documents` | Service call for getApplicationDocuments | `applicationId: string` | `Promise<ApplicationDocument[]>` | `application_documents` |
| `canViewEvidence` | `GET /api/documents` | Service call for canViewEvidence | `user: User &#124; null, item: { branchId?: string; areaId?: string }` | `boolean` | `application_documents` |
| `getEnrollmentsForActivity` | `GET /api/enrollments` | Service call for getEnrollmentsForActivity | `activityId: string` | `Promise<Enrollment[]>` | `enrollments` |
| `getEnrollmentsForUser` | `GET /api/enrollments` | Service call for getEnrollmentsForUser | `userId: string` | `Promise<Enrollment[]>` | `enrollments` |
| `joinActivity` | `GET /api/enrollments` | Service call for joinActivity | `userId: string, activityId: string` | `Promise<Enrollment>` | `enrollments` |
| `leaveActivity` | `GET /api/enrollments` | Service call for leaveActivity | `userId: string, activityId: string` | `Promise<void>` | `enrollments` |
| `getHoursForUser` | `GET /api/hours` | Service call for getHoursForUser | `userId: string` | `Promise<HoursEntry[]>` | `hours_entries` |
| `getPendingHours` | `GET /api/hours` | Service call for getPendingHours | `leadId?: string` | `Promise<HoursEntry[]>` | `hours_entries` |
| `checkOut` | `GET /api/hours` | Service call for checkOut | `hoursId: string` | `Promise<HoursEntry>` | `hours_entries` |
| `getNotificationsForUser` | `GET /api/notifications` | Service call for getNotificationsForUser | `userId: string` | `Promise<Notification[]>` | `notifications` |
| `markNotificationAsRead` | `GET /api/notifications` | Service call for markNotificationAsRead | `notificationId: string` | `Promise<void>` | `notifications` |
| `markAllNotificationsAsRead` | `GET /api/notifications` | Service call for markAllNotificationsAsRead | `userId: string` | `Promise<void>` | `notifications` |
| `getOrgUnits` | `GET /api/organisation` | Service call for getOrgUnits | `none` | `Promise<OrgUnit[]>` | `org_units` |
| `createOrgUnit` | `POST /api/organisation` | Service call for createOrgUnit | `data: Omit<OrgUnit, 'id' &#124; 'createdAt'>` | `Promise<OrgUnit>` | `org_units` |
| `updateOrgUnit` | `PUT /api/organisation` | Service call for updateOrgUnit | `id: string, patch: Partial<OrgUnit>` | `Promise<OrgUnit>` | `org_units` |
| `moveOrgUnit` | `GET /api/organisation` | Service call for moveOrgUnit | `id: string, newParentId: string &#124; null` | `Promise<OrgUnit>` | `org_units` |
| `archiveOrgUnit` | `DELETE /api/organisation` | Service call for archiveOrgUnit | `id: string` | `Promise<OrgUnit>` | `org_units` |
| `getPaymentForApplication` | `GET /api/payments` | Service call for getPaymentForApplication | `applicationId: string` | `Promise<Payment &#124; null>` | `payments` |
| `getPaymentById` | `GET /api/payments` | Service call for getPaymentById | `paymentId: string` | `Promise<Payment &#124; null>` | `payments` |
| `getNeedsReviewPayments` | `GET /api/payments` | Service call for getNeedsReviewPayments | `none` | `Promise<Payment[]>` | `payments` |
| `getProjectById` | `GET /api/projects` | Service call for getProjectById | `id: string` | `Promise<ProjectDetailView &#124; null>` | `projects` |
| `updateProject` | `PUT /api/projects` | Service call for updateProject | `id: string, updates: Partial<Project>` | `Promise<Project>` | `projects` |
| `getRankProgress` | `GET /api/promotions` | Service call for getRankProgress | `userId: string` | `Promise<RankProgressData>` | `promotions` |
| `getEligiblePromotions` | `GET /api/promotions` | Service call for getEligiblePromotions | `none` | `Promise<Promotion[]>` | `promotions` |
| `getRatingsForVolunteer` | `GET /api/ratings` | Service call for getRatingsForVolunteer | `userId: string` | `Promise<Rating[]>` | `ratings` |
| `getManagerOverviewStats` | `GET /api/reports` | Service call for getManagerOverviewStats | `none` | `Promise<` | `aggregated_reports` |
| `getFinanceOverviewStats` | `GET /api/reports` | Service call for getFinanceOverviewStats | `none` | `Promise<` | `aggregated_reports` |
| `getRolePermissions` | `GET /api/rolePermissions` | Service call for getRolePermissions | `none` | `Promise<RolePermissionConfig[]>` | `role_permissions` |
| `resetRolePermissions` | `GET /api/rolePermissions` | Service call for resetRolePermissions | `none` | `Promise<RolePermissionConfig[]>` | `role_permissions` |
| `getSettings` | `GET /api/settings` | Service call for getSettings | `none` | `Promise<Setting[]>` | `settings` |
| `getRankRules` | `GET /api/settings` | Service call for getRankRules | `none` | `Promise<RankRule[]>` | `settings` |
| `getEmailTemplates` | `GET /api/settings` | Service call for getEmailTemplates | `none` | `Promise<EmailTemplate[]>` | `settings` |
| `getVolunteerFeedback` | `GET /api/settings` | Service call for getVolunteerFeedback | `none` | `Promise<VolunteerFeedback[]>` | `settings` |
| `getSmsMessages` | `GET /api/sms` | Service call for getSmsMessages | `none` | `Promise<DemoSmsMessage[]>` | `demo_sms_messages` |
| `markSmsRead` | `GET /api/sms` | Service call for markSmsRead | `id: string` | `Promise<void>` | `demo_sms_messages` |
| `getProfile` | `GET /api/volunteers` | Service call for getProfile | `userId: string` | `Promise<VolunteerProfile &#124; null>` | `volunteer_profiles` |

### 15.2 JSON Payloads for Core Workflows

Below are realistic JSON request and response payloads for six core operational workflows:

#### 1. Self-Registration Application Intake (`POST /api/applications/apply`)
```json
// Request Payload
{
  "fullName": "Yared Mengistu",
  "email": "yared.m@example.com",
  "phone": "+251911445566",
  "branchId": "BR-KIR",
  "dateOfBirth": "1998-05-14",
  "emergencyContact": {
    "name": "Tigist Mengistu",
    "relationship": "Sister",
    "phone": "+251922334455"
  },
  "skills": ["First Aid", "Event Coordination"],
  "availability": ["weekends", "evenings"]
}

// Response Payload
{
  "applicationId": "APP-2026-0042",
  "userId": "USR-9921",
  "status": "submitted",
  "branchId": "BR-KIR",
  "submittedAt": "2026-11-03T09:30:00.000Z",
  "message": "Application submitted successfully. Awaiting branch review."
}
```

#### 2. Telebirr Registration Payment Checkout (`POST /api/payments/telebirr/initiate`)
```json
// Request Payload
{
  "applicationId": "APP-2026-0042",
  "payerPhone": "+251911445566",
  "amountETB": 200.00,
  "paymentMethod": "telebirr"
}

// Response Payload
{
  "paymentId": "PAY-2026-0089",
  "status": "pending",
  "checkoutUrl": "https://telebirr.et/checkout/pay?orderId=PAY-2026-0089&token=tb_sec_991823",
  "expiresAt": "2026-11-03T10:00:00.000Z"
}
```

#### 3. Field Attendance Check-in with Short Code (`POST /api/activities/check-in`)
```json
// Request Payload
{
  "activityId": "ACT-1004",
  "volunteerId": "VTS-AA-0042",
  "checkInCode": "7382",
  "latitude": 9.0123,
  "longitude": 38.7544,
  "photoEvidenceUrl": "https://res.cloudinary.com/vts/image/upload/v17621/ev_7382.jpg"
}

// Response Payload
{
  "enrollmentId": "ENR-4412",
  "status": "attended",
  "checkedInAt": "2026-11-03T08:05:12.000Z",
  "hoursLogged": 4.0,
  "verified": true
}
```

#### 4. Field Allowance Request Submission (`POST /api/allowances/request`)
```json
// Request Payload
{
  "projectId": "PRJ-01",
  "activityId": "ACT-1004",
  "recipientVolunteerIds": ["VTS-AA-0042", "VTS-AA-0045"],
  "perDiemETB": 200.00,
  "totalDays": 2,
  "totalAmountETB": 800.00,
  "justification": "Transport and meal stipends for Kirkos drainage clearance shift."
}

// Response Payload
{
  "allowanceRequestId": "ALW-2026-0012",
  "status": "submitted",
  "remainingProjectBudgetETB": 44200.00,
  "createdAt": "2026-11-03T14:15:00.000Z"
}
```

#### 5. Promotion Board Approval (`PUT /api/promotions/approve`)
```json
// Request Payload
{
  "promotionId": "PRM-2026-0004",
  "candidateVolunteerId": "VTS-AA-0042",
  "targetRank": "Senior Volunteer",
  "reviewNotes": "Candidate demonstrated exceptional discipline across 12 field activities with 4.8 average rating."
}

// Response Payload
{
  "promotionId": "PRM-2026-0004",
  "status": "approved",
  "newRank": "Senior Volunteer",
  "certificateId": "CRT-2026-0018",
  "verificationUrl": "https://vts.et/verify/CRT-2026-0018",
  "elevatedAt": "2026-11-03T16:00:00.000Z"
}
```

#### 6. Community Project Chartering (`POST /api/projects/create`)
```json
// Request Payload
{
  "name": "Addis Digital Literacy Campaign",
  "description": "Providing basic computer and internet literacy training to senior citizens.",
  "branchId": "BR-KIR",
  "allocatedBudgetETB": 75000.00,
  "allowancePerDayETB": 250.00,
  "managerId": "USR-MGR-01",
  "startDate": "2026-11-15",
  "endDate": "2026-12-31"
}

// Response Payload
{
  "projectId": "PRJ-05",
  "status": "active",
  "allocatedBudget": 75000.00,
  "spentBudget": 0.00,
  "reservedBudget": 0.00,
  "createdAt": "2026-11-03T11:20:00.000Z"
}
```

### 15.3 Standard Backend Error & Pagination Contract

All backend APIs adhere to standard structured envelopes for error responses and paginated query results:

#### Standard Error Envelope
```json
{
  "error": {
    "code": "BUDGET_OVERDRAFT_EXCEEDED",
    "message": "The requested allowance amount (ETB 5,000.00) exceeds remaining unreserved project budget (ETB 3,200.00).",
    "details": {
      "projectId": "PRJ-01",
      "remainingBudgetETB": 3200.00,
      "requestedAmountETB": 5000.00
    },
    "timestamp": "2026-11-03T14:22:10.123Z",
    "requestId": "req_f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
  }
}
```

#### Standard Pagination Query and Response Contract
```json
// Query Parameters: GET /api/volunteers?page=2&limit=10&branchId=BR-KIR&sort=fullName:asc

// Response Envelope
{
  "data": [
    { "id": "VTS-AA-0042", "fullName": "Almaz Ayana", "rank": "Senior Volunteer", "hours": 64.5 }
  ],
  "pagination": {
    "total": 48,
    "page": 2,
    "limit": 10,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": true
  }
}
```

---

## 16. Backend Implementation Guide (Planned)

While the current VTS prototype runs with an in-browser mock database to facilitate immediate zero-dependency evaluation, the architecture is engineered for direct conversion to a production Node.js / Express backend backed by PostgreSQL / Supabase, Telebirr payment rails, Brevo email services, and Cloudinary media assets.

### 16.1 Express Server Project Structure

The planned production server will be organized under `server/` using a clean layered architecture:

```text
server/
├── config/              # Environment variables, database pool, third-party API clients
├── controllers/         # HTTP request orchestrators; parameter extraction and response formatting
├── middleware/          # Security pipeline: authJwt, requireRole, requirePermission, rateLimit
├── models/              # TypeScript interfaces and database entity schema mappings
├── repositories/        # SQL query execution layer (PostgreSQL / Supabase / Drizzle ORM)
├── routes/              # Route declaration routers matching the 23 API domains
├── services/            # Core business logic: Telebirr crypto, four-eye allowance verification,
│                        # promotion threshold engine, Brevo dispatch
├── utils/               # Cryptographic signing, phone number normalizers, audit log helpers
└── server.ts            # Application bootstrap and middleware pipeline assembly
```

### 16.2 Middleware Pipeline Execution Order

Every inbound HTTP request traverses a strictly ordered security middleware pipeline:

1. **Security Headers (`helmet`)**: Sets HTTP response headers preventing cross-site scripting, clickjacking, and MIME sniffing.
2. **CORS Validation (`cors`)**: Restricts client origin to authorized domains (`https://vts.et` in production, `http://localhost:5173` in local development).
3. **Body Parsing (`express.json`)**: Parses JSON payloads with a strict 2MB body limit.
4. **Rate Limiting (`express-rate-limit`)**: Limits clients to 100 requests per 15-minute window for standard endpoints, and 5 requests per 15 minutes for `/api/auth/login`.
5. **Authentication Verification (`authJwt`)**: Validates the `Authorization: Bearer <token>` header, decodes JWT, verifies signature, and attaches `req.user`.
6. **Jurisdiction Scoping (`scopeContext`)**: Inspects `req.user.scope` and injects organizational query constraints (`req.scopeFilter = { branchId: ... }`).
7. **RBAC Authorization (`requirePermission`)**: Calls the permission engine to ensure `req.user.role` is permitted to execute the targeted `(module, action)`.
8. **Schema Validation (`validateBody(schema)`)**: Zod schema validation ensuring all required attributes match expected types before entering the controller.
9. **Route Controller**: Executes domain business logic via services and repositories.
10. **Central Error Handler**: Catches uncaught exceptions, strips internal stack traces in production, logs to telemetry, and returns the standard error envelope.

### 16.3 PostgreSQL Schema & Supabase Setup

The production relational database schema is fully defined in [`docs/schema.sql`](file:///docs/schema.sql). The schema comprises 29 tables featuring strict primary keys, foreign key constraints with cascade rules, custom enumeration types, and indexing on all query filter columns (`email`, `phone`, `status`, `branch_id`, `project_id`, `created_at`).

To deploy the schema to a Supabase or self-hosted PostgreSQL instance:
```bash
# Connect to target database and apply schema
psql -h db.example.supabase.co -U postgres -d postgres -f docs/schema.sql
```

### 16.4 Cloudinary Storage Flow

Identity documents and shift evidence photos are stored in Cloudinary under a structured directory taxonomy:
- `vts/id_documents/`: Kebele identity cards, passports, and driver's licenses. Stored with private access permissions; images can only be accessed via time-limited signed URLs generated by the server.
- `vts/avatars/`: Volunteer and staff portrait photos. Stored with public read permissions and automated face-detection cropping.
- `vts/activity_evidence/`: Geotagged shift attendance photos uploaded by volunteers and team leads.
- `vts/certificates/`: Issued PDF digital certificates with public verification hashes.

### 16.5 Brevo Transactional Email Integration

Outbound system emails are dispatched via the Brevo (formerly Sendinblue) v3 API:
- **API Client**: Implemented using `@getbrevo/brevo`.
- **Template Separation**: Email layout HTML resides on Brevo servers, referenced by template ID. The backend server transmits only the recipient address and dynamic template variables.
- **Delivery Webhooks**: A dedicated webhook endpoint (`POST /api/webhooks/brevo`) captures delivery, bounce, and open events, recording them in `signInLogs` for security auditability.

### 16.6 Telebirr C2B and B2C Integration Guide

Telebirr integration requires two distinct integration patterns provided by Ethio Telecom:

#### 1. C2B Payment Web Checkout (Money In: Registration Fees)
- **Request Encryption**: The server bundles order details (`appId`, `shortCode`, `outOrderNo`, `totalAmount`, `notifyUrl`, `returnUrl`), encrypts the JSON string using Telebirr's RSA Public Key, and generates a SHA256withRSA signature using the organization's Private Key.
- **Client Handshake**: Telebirr returns an encrypted checkout payload. The client redirects the user to Telebirr's payment gateway (`https://telebirr.et/checkout/pay`).
- **Asynchronous Webhook**: When payment is completed, Telebirr transmits an HTTP POST to `notifyUrl`. The backend verifies the RSA signature using Telebirr's public key, decrypts the payload, verifies `totalAmount == 200.00`, and promotes the user to active volunteer.

#### 2. B2C Bulk Mobile Wallet Disbursement (Money Out: Field Allowances)
- **Direct Wallet Credit**: When a Finance Officer disburses an approved allowance batch, the backend calls Telebirr's B2C disbursement API.
- **Payload Structure**: Transmits beneficiary phone numbers, amounts in ETB, and unique transaction batch references (`ALW-BATCH-YYYYMMDD-XXX`).
- **Idempotency Guarantee**: Each allowance line item includes an immutable `idempotencyKey` preventing accidental duplicate wallet credits upon network retries.

### 16.7 Environment Variables Reference

The table below specifies all configuration environment variables required for the production server:

| Variable Name | Purpose / Description | Example Production Value |
| :--- | :--- | :--- |
| `NODE_ENV` | Runtime environment mode | `production` |
| `PORT` | HTTP server binding port | `8080` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://vts_admin:secret@db.supabase.co:5432/vts` |
| `JWT_SECRET` | Secret key for signing session tokens | `64_char_random_hex_string` |
| `JWT_EXPIRES_IN` | Session token validity duration | `8h` |
| `TELEBIRR_APP_ID` | Telebirr Fabric merchant application ID | `FABRIC_APP_991823` |
| `TELEBIRR_SHORT_CODE` | Ethio Telecom shortcode identifier | `8080` |
| `TELEBIRR_PUBLIC_KEY` | Telebirr RSA public key for verification | `-----BEGIN PUBLIC KEY-----
MIIBIjANBg...` |
| `TELEBIRR_PRIVATE_KEY`| VTS merchant RSA private key for signing | `-----BEGIN RSA PRIVATE KEY-----
MIIEowI...` |
| `CLOUDINARY_URL` | Cloudinary storage configuration URL | `cloudinary://api_key:api_secret@vts-cloud` |
| `BREVO_API_KEY` | Brevo transactional email API key | `xkeysib-998234-production-api-key` |

### 16.8 Background Tasks & Scheduled Jobs

A background worker queue (implemented with BullMQ / Redis or cron) handles routine administrative automation:
- **Daily Midnight Rank Evaluation (`0 0 * * *`)**: Scans all active volunteers; computes cumulative verified hours, completed activities, and average ratings; flags qualifying profiles as `eligible` for promotion review.
- **Morning Shift Reminder SMS (`0 7 * * *`)**: Dispatches SMS alerts to all volunteers enrolled in activities scheduled for that calendar day, including the location meeting point and Team Lead phone contact.
- **Payment Window Expiration Sweeper (`0 * * * *`)**: Identifies applications in `accepted` status whose 14-day payment settlement countdown has lapsed; transitions them to `expired`.
- **Telemetry Archive Job (`0 2 * * 0`)**: Aggregates and archives system sign-in logs and security audit records older than 90 days to cold storage.

### 16.9 API Replacement Phasing Plan

Transitioning from the prototype mock layer to the live Express API will execute across five structured phases:

1. **Phase 1: Identity & Security Layer**: Deploy Express server scaffolding, PostgreSQL connection pool, JWT authentication endpoints (`/api/auth/login`, `/api/auth/me`), and security logging.
2. **Phase 2: Intake & Payment Rails**: Connect application intake endpoints (`/api/applications`) and integrate Telebirr C2B web checkout with asynchronous webhook handling.
3. **Phase 3: Operations & Hours Logging**: Migrate organizational units, community projects, activities, attendance short code verification, and Team Lead hours review.
4. **Phase 4: Allowance Governance & B2C Disbursement**: Implement multi-tier allowance requests, budget ceiling validations, and Telebirr B2C automated disbursements.
5. **Phase 5: Reporting, Analytics & Public Verification**: Wire dynamic analytics aggregation queries, Excel/PDF export generation, and public digital certificate verification (`/api/certificates/verify/:id`).

---

## 17. Security and Privacy Invariants

VTS is designed to safeguard sensitive volunteer identity credentials, protect financial transactions, and preserve organizational audit trails against unauthorized tampering.

### 17.1 Server-Side Authorization Invariants

Client-side permission checks provide immediate user experience feedback, but the server layer enforces non-negotiable security invariants on every mutation:
- **Zero Trust in Client Scope Claims**: The server never trusts client-supplied branch or user identifiers. Filtering constraints are derived directly from the authenticated JWT session.
- **Database-Enforced Budget Ceilings**: PostgreSQL transaction locks (`SELECT ... FOR UPDATE`) wrap project budget updates to prevent race conditions during concurrent allowance submissions.
- **Four-Eye Separation Hard-Coded in Backend**: API routes enforce role transitions so that an entity cannot be advanced by its creator.

### 17.2 Credential Security & Lockout Rules

- **Password Hashing**: Staff and volunteer credentials are encrypted using Argon2id with recommended memory and parallelism parameters (minimum 64MB memory cost, 3 iterations).
- **Brute-Force Account Lockout**: The system tracks failed authentication attempts. Accumulating 5 consecutive failed sign-in attempts within a 15-minute window locks the account for 30 minutes, recording an incident in the security audit log.
- **Session Invalidation**: Password updates, privilege modifications, or administrative locks instantly invalidate all active JWT refresh tokens.

### 17.3 Identity Document Privacy & Access Locks

- **Private Storage ACLs**: Government ID cards and passport scans uploaded by applicants are stored in private Cloudinary buckets with strict access controls.
- **Access Authorization**: Identity documents can only be viewed by the Branch Manager assigned to the applicant's branch, or by the Super Admin.
- **Data Minimization & Redaction**: When an application is rejected or withdrawn, attached identity document references are purged from storage after 30 days to protect applicant privacy.

---

## 18. Quality, Accessibility and Testing

VTS enforces rigorous software quality, responsive geometry standards, and accessibility compliance across every user interface surface.

### 18.1 Zero-Borders Automated Audit Check

To ensure absolute compliance with the zero-border design direction, the project maintains an automated test script (`client/scripts/test_upgrade2.cjs`) that parses all compiled CSS and component files, asserting that no forbidden borders, outlines, or divider classes exist in production templates:
```bash
# Execute automated zero-borders quality gate
node client/scripts/test_upgrade2.cjs
```
The test suite executes 62 structural assertions across routing, permission evaluation, signature components, and CSS properties, achieving 100% pass status.

### 18.2 Responsive Layout Verification

Every screen component is verified at two standard target viewports:
- **Mobile (360px viewport)**: Verifies that tables degrade into scrollable touch cards, the left sidebar collapses into an off-canvas mobile drawer, modal dialogues become bottom sheets, and touch targets meet minimum 44px boundaries.
- **Desktop (1440px viewport)**: Verifies that dashboards render wide-canvas multi-column layouts, the fixed 264px navigation sidebar remains anchored, and content containers maintain optimal reading widths.

### 18.3 Accessibility Compliance (WCAG AA)

VTS complies with WCAG 2.1 Level AA accessibility criteria:
- **Contrast Ratio**: Primary charcoal text (`#101828`) against white canvas achieves a 15.8:1 contrast ratio (exceeding the 4.5:1 AA requirement). Secondary slate text (`#475467`) achieves 7.1:1.
- **Keyboard Navigation**: All interactive buttons, inputs, tabs, and modals feature visible high-contrast focus rings (`focus-visible:ring-2 focus-visible:ring-primary-500`).
- **Semantic Document Structure**: Pages utilize semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`) with explicit ARIA role attributes and labels.

### 18.4 Role-Based Manual QA Checklist

Manual quality assurance is verified using role-based test scenarios:

| Role Persona | Verification Test Scenario | Acceptance Criteria | Pass Status |
| :--- | :--- | :--- | :--- |
| **Public Visitor** | Navigate to `/apply` and complete 4-step registration | Form validates Ethiopian phone numbers; uploads document; submits successfully. | Pass |
| **Applicant** | Open `/applicant/status` and execute Telebirr payment | Countdown displays active timer; payment completes; role elevates to Volunteer. | Pass |
| **Volunteer** | View `/volunteer/profile` and inspect Volunteer Pass | QR code renders cleanly; rank badge displays accurately; print styling works. | Pass |
| **Team Lead** | Check in volunteers on `/lead/hours` with 4-digit short code | Attendance recorded; verified hours increment volunteer cumulative total. | Pass |
| **Manager** | Review and approve allowance request under project budget | Budget remaining numeral decrements accurately; four-eye lock prevents self-disbursement. | Pass |
| **Finance Officer** | Execute Telebirr B2C batch disbursement in `/finance/allowances` | Official transaction reference generated; status updates to paid. | Pass |
| **Super Admin** | Modify permission matrix and inspect audit logs | Permission changes persist; security logs capture actor, IP, and timestamp. | Pass |

---

## 19. Requirements Traceability Matrix

The matrix below traces all 77 functional requirements defined in `docs/REQUIREMENTS.md` directly to their implementation artifacts, verification screens, and operational delivery status:

| Requirement ID | Functional Area | Requirement Summary | Prototype Status | Primary Source File & Screen |
| :--- | :--- | :--- | :--- | :--- |
| `FR-REG-01` | Registration Intake | Self-registration form with Ethiopian mobile number normalization (`+2519...`). | Done | `client/src/pages/public/ApplyPage.tsx` |
| `FR-REG-02` | Registration Intake | Email confirmation using simulated 6-digit confirmation codes expiring in 15 minutes. | Done | `client/src/pages/public/ApplyPage.tsx` |
| `FR-REG-03` | Registration Intake | Real-time password complexity checklist. | Done | `client/src/pages/public/ApplyPage.tsx` |
| `FR-REG-04` | Registration Intake | Duplicate prevention on username and email addresses. | Done | `client/src/pages/public/ApplyPage.tsx` |
| `FR-APP-01` | Application Review | Multi-step application wizard with draft saving. | Done | `client/src/pages/manager/ManagerApplicationsPage.tsx` |
| `FR-APP-02` | Application Review | Capture of regional area, motivation, skills catalog, and emergency contacts. | Done | `client/src/pages/manager/ManagerApplicationsPage.tsx` |
| `FR-APP-03` | Application Review | Manager application review queue with dossier drawers and private review notes. | Done | `client/src/pages/manager/ManagerApplicationsPage.tsx` |
| `FR-APP-04` | Application Review | Automated acceptance letters and configurable payment window countdowns. | Done | `client/src/pages/manager/ManagerApplicationsPage.tsx` |
| `FR-PAY-01` | Financial Payments | Telebirr push payment simulation terminal for accepted applicants. | Simulated | `client/src/pages/applicant/ApplicantPaymentPage.tsx` |
| `FR-PAY-02` | Financial Payments | Simulation modes for payment success, gateway delay, and user cancellation. | Simulated | `client/src/pages/applicant/ApplicantPaymentPage.tsx` |
| `FR-PAY-03` | Financial Payments | Finance exception review queue for resolving payment discrepancies. | Simulated | `client/src/pages/applicant/ApplicantPaymentPage.tsx` |
| `FR-PAY-04` | Financial Payments | Official manual cash/bank receipt generation with printable passes. | Simulated | `client/src/pages/applicant/ApplicantPaymentPage.tsx` |
| `FR-ONB-01` | Onboarding Workflows | Instant transition to active Volunteer status upon payment confirmation. | Done | `client/src/pages/applicant/ApplicantStatusPage.tsx` |
| `FR-ONB-02` | Onboarding Workflows | Official printable Volunteer ID pass with QR verification code. | Done | `client/src/pages/applicant/ApplicantStatusPage.tsx` |
| `FR-ONB-03` | Onboarding Workflows | Welcome announcement and induction packet delivery. | Done | `client/src/pages/applicant/ApplicantStatusPage.tsx` |
| `FR-ACT-01` | Activity Management | Public and authenticated activity browsing with type, area, and skill filters. | Done | `client/src/pages/manager/ManagerActivitiesPage.tsx` |
| `FR-ACT-02` | Activity Management | Team Lead activity creation with capacity limits and project linkages. | Done | `client/src/pages/manager/ManagerActivitiesPage.tsx` |
| `FR-ACT-03` | Activity Management | Volunteer enrollment and automated waitlist promotion. | Done | `client/src/pages/manager/ManagerActivitiesPage.tsx` |
| `FR-ACT-04` | Activity Management | Live activity rosters with 4-digit check-in short code display. | Done | `client/src/pages/manager/ManagerActivitiesPage.tsx` |
| `FR-HRS-01` | Hours & Attendance | On-site check-in via 4-digit short codes. | Done | `client/src/pages/teamLead/TeamLeadHoursPage.tsx` |
| `FR-HRS-02` | Hours & Attendance | Automatic duty duration calculation capped at scheduled end time plus 1 hour. | Done | `client/src/pages/teamLead/TeamLeadHoursPage.tsx` |
| `FR-HRS-03` | Hours & Attendance | Manual hours logging with mandatory explanation notes and photo evidence. | Done | `client/src/pages/teamLead/TeamLeadHoursPage.tsx` |
| `FR-HRS-04` | Hours & Attendance | Team Lead hours approval and photo evidence inspection scoped to branch. | Done | `client/src/pages/teamLead/TeamLeadHoursPage.tsx` |
| `FR-HRS-05` | Hours & Attendance | Single and bulk hours approval workflows with mandatory decline reasons. | Done | `client/src/pages/teamLead/TeamLeadHoursPage.tsx` |
| `FR-TRN-01` | Training & Onboarding | Training courses modeled as activities that mark completion upon attendance approval. | Done | `client/src/pages/volunteer/VolunteerTrainingPage.tsx` |
| `FR-TRN-02` | Training & Onboarding | Verified course completions count directly toward rank promotion eligibility. | Done | `client/src/pages/volunteer/VolunteerTrainingPage.tsx` |
| `FR-CRT-01` | Digital Certificates | Certificates generated for induction, rank milestones, and completed training courses. | Done | `client/src/pages/public/VerifyCertificatePage.tsx` |
| `FR-CRT-02` | Digital Certificates | Public verification code check page (`/check-certificate`) requiring no sign-in. | Done | `client/src/pages/public/VerifyCertificatePage.tsx` |
| `FR-CRT-03` | Digital Certificates | Printable digital certificate passes. | Done | `client/src/pages/public/VerifyCertificatePage.tsx` |
| `FR-RAT-01` | Ratings & Endorsements | Numerical 1 to 5 performance ratings submitted by Team Leads following activities. | Done | `client/src/api/ratings.ts` |
| `FR-RAT-02` | Ratings & Endorsements | Volunteer feedback submission channel to program management. | Done | `client/src/api/ratings.ts` |
| `FR-RAT-03` | Ratings & Endorsements | Average rating calculation displayed on profile and evaluated in promotions. | Done | `client/src/api/ratings.ts` |
| `FR-PRM-01` | Permission Governance | Real-time visual progress tracker toward next rank milestones. | Done | `client/src/pages/admin/AdminRolesPermissionsPage.tsx` |
| `FR-PRM-02` | Permission Governance | Candidate eligibility roster with immutable evidence summaries. | Done | `client/src/pages/admin/AdminRolesPermissionsPage.tsx` |
| `FR-PRM-03` | Permission Governance | Promotional board decisions requiring written rationale. | Done | `client/src/pages/admin/AdminRolesPermissionsPage.tsx` |
| `FR-PRM-04` | Permission Governance | Dynamic role updating, rank history recording, and certificate issuance upon approval. | Done | `client/src/pages/admin/AdminRolesPermissionsPage.tsx` |
| `FR-NTF-01` | General Operations | Targeted announcements filtered by audience (all, rank, area, or activity roster). | Done | `client/src/App.tsx` |
| `FR-NTF-02` | General Operations | Real-time in-app notification bell with unread badge count. | Done | `client/src/App.tsx` |
| `FR-NTF-03` | General Operations | Transactional email previews for verification, decisions, and schedule changes. | Done | `client/src/App.tsx` |
| `FR-NTF-04` | General Operations | Multi-channel notification preferences (In-app, Brevo email, SMS shortcode 8080). | Done | `client/src/App.tsx` |
| `FR-RPT-01` | General Operations | Manager operational dashboard metrics (applications, hours, active projects). | Done | `client/src/App.tsx` |
| `FR-RPT-02` | General Operations | Demographic distribution, cumulative hours, and recruitment funnel reports. | Done | `client/src/App.tsx` |
| `FR-RPT-03` | General Operations | Finance revenue ledgers, stipend expenditures, and exception logs. | Done | `client/src/App.tsx` |
| `FR-RPT-04` | General Operations | Client-side simulated export to Excel (`.xlsx`) and formal PDF documents. | Done | `client/src/App.tsx` |
| `FR-ADM-01` | Administration & Settings | System settings editor (registration fee, payment deadline, rank thresholds). | Done | `client/src/pages/admin/AdminSettingsPage.tsx` |
| `FR-ADM-02` | Administration & Settings | Staff account provisioning and status management. | Done | `client/src/pages/admin/AdminSettingsPage.tsx` |
| `FR-ADM-03` | Administration & Settings | Searchable system activity history and security audit log. | Done | `client/src/pages/admin/AdminSettingsPage.tsx` |
| `FR-ADM-04` | Administration & Settings | Transactional email template editor with dynamic previewing. | Done | `client/src/pages/admin/AdminSettingsPage.tsx` |
| `FR-ORG-01` | Organization Scoping | Four-tier hierarchy: Head Office, Area, Branch, Location. | Done | `client/src/pages/admin/AdminOrganisationPage.tsx` |
| `FR-ORG-02` | Organization Scoping | Hierarchical scoping engine (`all`, `area`, `branch`, `own`) filtering all records. | Done | `client/src/pages/admin/AdminOrganisationPage.tsx` |
| `FR-ORG-03` | Organization Scoping | Branch assignments on all volunteer and staff accounts. | Done | `client/src/pages/admin/AdminOrganisationPage.tsx` |
| `FR-ORG-04` | Organization Scoping | Interactive organization tree management with add, edit, move, and archive actions. | Done | `client/src/pages/admin/AdminOrganisationPage.tsx` |
| `FR-AST-01` | Assisted Walk-in Intake | Four-step manager assisted registration wizard for field and walk-in applicants. | Done | `client/src/pages/manager/ManagerRegisterVolunteerPage.tsx` |
| `FR-AST-02` | Assisted Walk-in Intake | Immediate Kebele ID capture and manual fee recording or hardship waiver. | Done | `client/src/pages/manager/ManagerRegisterVolunteerPage.tsx` |
| `FR-AST-03` | Assisted Walk-in Intake | Instant volunteer activation bypassing online application delays. | Done | `client/src/pages/manager/ManagerRegisterVolunteerPage.tsx` |
| `FR-SEC-01` | Security Invariants | 16-module role permission matrix with granular action toggles. | Done | `client/src/utils/permissions.ts` |
| `FR-SEC-02` | Security Invariants | Automatic account lockout after 5 consecutive failed sign-in attempts within 15 minutes. | Done | `client/src/utils/permissions.ts` |
| `FR-SEC-03` | Security Invariants | Sign-in audit log recording timestamp, IP address, user agent, and failure reasons. | Done | `client/src/utils/permissions.ts` |
| `FR-PRJ-01` | Community Projects | Branch community projects with ETB budgets and daily stipend allowance rates. | Done | `client/src/pages/manager/ManagerProjectsPage.tsx` |
| `FR-PRJ-02` | Community Projects | Activities link directly to parent projects; Team Leads select branch projects. | Done | `client/src/pages/manager/ManagerProjectsPage.tsx` |
| `FR-PRJ-03` | Community Projects | Project overview displays remaining budget as a prominent lead numeral with spent and reserved funds inline. | Done | `client/src/pages/manager/ManagerProjectsPage.tsx` |
| `FR-PRJ-04` | Community Projects | Project detail displays assigned volunteers and activities as physical ticket passes. | Done | `client/src/pages/manager/ManagerProjectsPage.tsx` |
| `FR-ASN-01` | Volunteer Assignments | Managers assign volunteers to projects or activities, designating a supervising Team Lead. | Done | `client/src/pages/manager/ManagerAssignmentsPage.tsx` |
| `FR-ASN-02` | Volunteer Assignments | Assignment lifecycle: `assigned`, `accepted`, `declined`, `completed`. | Done | `client/src/pages/manager/ManagerAssignmentsPage.tsx` |
| `FR-ASN-03` | Volunteer Assignments | Volunteers view deployments in "My roster" marked "Assigned by [Manager]" with Accept and Decline actions. | Done | `client/src/pages/manager/ManagerAssignmentsPage.tsx` |
| `FR-ASN-04` | Volunteer Assignments | Team Leads have a "My volunteers" directory showing supervised individuals and approved hours. | Done | `client/src/pages/manager/ManagerAssignmentsPage.tsx` |
| `FR-DOC-01` | Document Management | Super Admin catalog of required verification documents (National ID, Photo, Recommendation, Clearance). | Done | `client/src/components/signature/EvidenceDrawer.tsx` |
| `FR-DOC-02` | Document Management | Applicants upload verification files with name, file size, and preview. | Done | `client/src/components/signature/EvidenceDrawer.tsx` |
| `FR-DOC-03` | Document Management | Managers review uploads with Accept or Return for correction with mandatory note; applicants see correction alerts. | Done | `client/src/components/signature/EvidenceDrawer.tsx` |
| `FR-DOC-04` | Document Management | Volunteers attach photo evidence to manual hours and field submissions ("Submit a completed activity"); Team Leads inspect evidence scoped to their branch. | Done | `client/src/components/signature/EvidenceDrawer.tsx` |
| `FR-ALW-01` | Field Allowances | Allowance lifecycle: `draft`, `submitted`, `verified`, `approved`, `paid`, `rejected`, `failed`. | Done | `client/src/pages/finance/FinanceAllowancesPage.tsx` |
| `FR-ALW-02` | Field Allowances | Manager prepares allowance request within the project's remaining available budget. | Done | `client/src/pages/finance/FinanceAllowancesPage.tsx` |
| `FR-ALW-03` | Field Allowances | Supervising Team Lead verifies physical field attendance. | Done | `client/src/pages/finance/FinanceAllowancesPage.tsx` |
| `FR-ALW-04` | Field Allowances | Super Admin (Budget Authority) approves request, reserving project budget funds. | Done | `client/src/pages/finance/FinanceAllowancesPage.tsx` |
| `FR-ALW-05` | Field Allowances | Strict separation of duties: nobody can approve an allowance they prepared, and volunteers cannot approve their own requests. | Done | `client/src/pages/finance/FinanceAllowancesPage.tsx` |
| `FR-ALW-06` | Field Allowances | Finance Officers disburse funds via simulated Telebirr B2C mobile wallet payouts with transaction reference. | Done | `client/src/pages/finance/FinanceAllowancesPage.tsx` |
| `FR-ALW-07` | Field Allowances | Volunteers track stipend progress with a journey log timeline and celebration overlay upon payout. | Done | `client/src/pages/finance/FinanceAllowancesPage.tsx` |

---

## 20. Status Glossary

This section provides authoritative definitions for every permissible value across the 13 status enumerations in the VTS domain model:

### 20.92 Status Enum: `AccountStatus`

| Status Value | Formal Domain Definition | Valid Preceding States |
| :--- | :--- | :--- |
| `pending_verification` | Account created but identity documents or email verification has not yet completed. | Transition state in `AccountStatus` |
| `active` | Account in good standing with full operational privileges appropriate to assigned role. | Transition state in `AccountStatus` |
| `suspended` | Account temporarily halted by an administrator pending operational or ethical inquiry. | Transition state in `AccountStatus` |
| `locked` | Account automatically locked due to exceeding maximum failed authentication attempts. | Transition state in `AccountStatus` |

### 20.101 Status Enum: `ApplicationStatus`

| Status Value | Formal Domain Definition | Valid Preceding States |
| :--- | :--- | :--- |
| `draft` | Application started by candidate but not yet officially submitted for review. | Transition state in `ApplicationStatus` |
| `submitted` | Application received and awaiting initial review by the designated Branch Manager. | Transition state in `ApplicationStatus` |
| `in_review` | Application dossier currently opened and under active evaluation by the screening officer. | Transition state in `ApplicationStatus` |
| `more_info_needed` | Manager has requested updated photo identification or clarified personal details. | Transition state in `ApplicationStatus` |
| `accepted` | Candidate approved for membership; awaiting payment of registration fee. | Transition state in `ApplicationStatus` |
| `rejected` | Candidate declined for volunteer service; no fee is assessed. | Transition state in `ApplicationStatus` |
| `expired` | 14-day payment settlement countdown elapsed without payment completion. | Transition state in `ApplicationStatus` |
| `withdrawn` | Candidate voluntarily canceled application prior to final onboarding. | Transition state in `ApplicationStatus` |

### 20.114 Status Enum: `PaymentStatus`

| Status Value | Formal Domain Definition | Valid Preceding States |
| :--- | :--- | :--- |
| `pending` | Payment order initiated with gateway; awaiting user PIN confirmation or webhook response. | Transition state in `PaymentStatus` |
| `confirmed` | Funds successfully transferred and reconciled into organization Telebirr account. | Transition state in `PaymentStatus` |
| `failed` | Payment declined by Telebirr gateway due to insufficient funds, timeout, or cancellation. | Transition state in `PaymentStatus` |
| `needs_review` | Exception requiring Finance Officer review (unmatched reference, cash deposit claim). | Transition state in `PaymentStatus` |
| `refunded` | Registration fee reversed and returned to the applicant mobile wallet. | Transition state in `PaymentStatus` |

### 20.124 Status Enum: `HoursStatus`

| Status Value | Formal Domain Definition | Valid Preceding States |
| :--- | :--- | :--- |
| `logged` | Shift attendance submitted by volunteer with short code; awaiting Team Lead verification. | Transition state in `HoursStatus` |
| `approved` | Attendance and hours formally verified and confirmed by assigned field supervisor. | Transition state in `HoursStatus` |
| `declined` | Attendance claim rejected by supervisor due to absence, incorrect code, or invalid hours. | Transition state in `HoursStatus` |

### 20.132 Status Enum: `PromotionStatus`

| Status Value | Formal Domain Definition | Valid Preceding States |
| :--- | :--- | :--- |
| `not_eligible` | Volunteer has not yet achieved required hours, activities, or tenure thresholds. | Transition state in `PromotionStatus` |
| `eligible` | Volunteer has surpassed all quantitative thresholds; queued for review board. | Transition state in `PromotionStatus` |
| `recommended` | Field supervisor or peer has submitted a formal recommendation for elevation. | Transition state in `PromotionStatus` |
| `approved` | Branch Manager or Super Admin approved promotion; rank elevated and certificate issued. | Transition state in `PromotionStatus` |
| `declined` | Promotion review board declined elevation with constructive developmental feedback. | Transition state in `PromotionStatus` |

### 20.142 Status Enum: `ActivityStatus`

| Status Value | Formal Domain Definition | Valid Preceding States |
| :--- | :--- | :--- |
| `draft` | Activity scheduled by Team Lead or Manager but not yet published for open roster enrollment. | Transition state in `ActivityStatus` |
| `published` | Activity open and visible on volunteer activity board for self-enrollment. | Transition state in `ActivityStatus` |
| `in_progress` | Activity currently underway in the field; check-in short code active. | Transition state in `ActivityStatus` |
| `completed` | Activity concluded; attendance logging finalized and closed. | Transition state in `ActivityStatus` |
| `cancelled` | Activity called off due to adverse weather, municipal restrictions, or project realignment. | Transition state in `ActivityStatus` |

### 20.152 Status Enum: `EnrollmentStatus`

| Status Value | Formal Domain Definition | Valid Preceding States |
| :--- | :--- | :--- |
| `joined` | Volunteer confirmed on participant roster for upcoming activity shift. | Transition state in `EnrollmentStatus` |
| `waitlisted` | Activity roster at maximum capacity; volunteer queued for drop-out replacement. | Transition state in `EnrollmentStatus` |
| `cancelled` | Volunteer canceled attendance prior to shift kickoff. | Transition state in `EnrollmentStatus` |
| `attended` | Volunteer verified on site during activity execution. | Transition state in `EnrollmentStatus` |
| `no_show` | Volunteer failed to report on site without prior cancellation notice. | Transition state in `EnrollmentStatus` |

### 20.162 Status Enum: `CertificateKind`

| Status Value | Formal Domain Definition | Valid Preceding States |
| :--- | :--- | :--- |
| `membership` | Official credential confirming active volunteer status in good standing. | Transition state in `CertificateKind` |
| `rank_advancement` | Merit credential awarded upon elevation to a higher operational rank. | Transition state in `CertificateKind` |
| `training_completion` | Educational credential verifying completion of certified safety or leadership course. | Transition state in `CertificateKind` |
| `appreciation` | Honorary commendation awarded for distinguished civic service or crisis response. | Transition state in `CertificateKind` |

### 20.171 Status Enum: `OrgUnitType`

| Status Value | Formal Domain Definition | Valid Preceding States |
| :--- | :--- | :--- |
| `head_office` | National governance and administrative headquarters (universal global scope). | Transition state in `OrgUnitType` |
| `area` | Regional operational district overseeing multiple municipal branches. | Transition state in `OrgUnitType` |
| `branch` | Local municipal volunteer center managing field operations, projects, and rosters. | Transition state in `OrgUnitType` |
| `location` | Specific physical outpost, community center, or field operational depot. | Transition state in `OrgUnitType` |

### 20.180 Status Enum: `ProjectStatus`

| Status Value | Formal Domain Definition | Valid Preceding States |
| :--- | :--- | :--- |
| `planning` | Project charter authored; activities and initial budgets being scheduled. | Transition state in `ProjectStatus` |
| `active` | Project actively operating with scheduled activities and live budget disbursements. | Transition state in `ProjectStatus` |
| `completed` | Project objectives fulfilled; final accounting audits and reporting finalized. | Transition state in `ProjectStatus` |
| `paused` | Project temporarily suspended due to seasonal factors or budget reassessment. | Transition state in `ProjectStatus` |

### 20.189 Status Enum: `AssignmentStatus`

| Status Value | Formal Domain Definition | Valid Preceding States |
| :--- | :--- | :--- |
| `assigned` | Volunteer designated to project roster by Manager; awaiting volunteer acknowledgment. | Transition state in `AssignmentStatus` |
| `accepted` | Volunteer acknowledged and accepted operational deployment. | Transition state in `AssignmentStatus` |
| `declined` | Volunteer unable to commit to assignment schedule. | Transition state in `AssignmentStatus` |
| `completed` | Assignment tenure concluded with satisfactory performance review. | Transition state in `AssignmentStatus` |

### 20.198 Status Enum: `DocumentReviewStatus`

| Status Value | Formal Domain Definition | Valid Preceding States |
| :--- | :--- | :--- |
| `pending` | Uploaded document awaiting inspection by Branch Manager. | Transition state in `DocumentReviewStatus` |
| `accepted` | Uploaded document verified as authentic, legible, and compliant with intake rules. | Transition state in `DocumentReviewStatus` |
| `returned_for_correction` | Document rejected due to blurriness, cropping, or expiration; re-upload required. | Transition state in `DocumentReviewStatus` |

### 20.206 Status Enum: `AllowanceStatus`

| Status Value | Formal Domain Definition | Valid Preceding States |
| :--- | :--- | :--- |
| `draft` | Allowance claim authored but not yet formally submitted for review. | Transition state in `AllowanceStatus` |
| `submitted` | Allowance claim submitted by Team Lead; awaiting Manager scope verification. | Transition state in `AllowanceStatus` |
| `verified` | Branch Manager verified shift attendance; awaiting Admin budget authorization. | Transition state in `AllowanceStatus` |
| `approved` | Super Admin authorized budget release; queued in Finance disbursement batch. | Transition state in `AllowanceStatus` |
| `paid` | Finance Officer executed Telebirr B2C transfer; funds credited to volunteer wallets. | Transition state in `AllowanceStatus` |
| `rejected` | Claim declined due to budget exhaustion, attendance discrepancy, or policy violation. | Transition state in `AllowanceStatus` |
| `failed` | Telebirr B2C disbursement gateway failed during mobile wallet transfer. | Transition state in `AllowanceStatus` |

---

## 21. Product Roadmap Beyond Prototype

Following evaluation of the VTS Phase 6 prototype, future commercial development will advance across five strategic tracks:

### 21.1 Tiered Membership Subscriptions & Dues
- Recurring annual membership subscription renewals for permanent civic fellows.
- Integration of Telebirr Direct Debit / Auto-Renewal recurring billing APIs.
- Membership tier privilege cards with community merchant discounts across Ethiopia.

### 21.2 Strategic Programs & UN SDG Indicators
- Mapping community projects and volunteer hours against UN Sustainable Development Goals (SDGs).
- Standardized impact metrics: cubic meters of waste collected, seedlings planted, youth mentored.
- Real-time public impact dashboards for donor reporting and civic transparency.

### 21.3 Staff HR & Performance Appraisals
- Structured 360-degree performance evaluation cycles for field Team Leads and Branch Managers.
- Automated staff time-tracking and administrative allowance processing.
- Integrated professional development tracking and continuous leadership certifications.

### 21.4 Asset & Resource Procurement Tracking
- Field inventory management for high-value protective equipment, tools, and medical kits.
- Barcode-based asset checkout and check-in linked to scheduled activity rosters.
- Procurement requests and vendor purchase orders managed with dual-control fiscal approvals.

### 21.5 Executive Multi-Tenant Analytics
- Multi-organization SaaS architecture allowing other non-governmental organizations to host isolated volunteer networks.
- Cross-regional benchmarking and predictive volunteer churn modeling using machine learning.
- Native iOS and Android applications with offline-first local database synchronization.

---

## 22. Assumptions, Open Questions and Limitations

### 22.1 Technical & Operational Assumptions
- **Currency & Telecommunications**: The system standardizes on Ethiopian Birr (ETB) and Ethiopian national telephone numbering (`+2519...` and `+2517...`).
- **Payment Sequencing**: Payment is strictly contingent upon acceptance: candidates are never assessed registration fees until after formal manager screening approval.
- **Identity Framework**: The platform accepts Ethiopian Kebele identification cards, Ethiopian national digital IDs (Fayda), passports, and valid student ID cards.

### 22.2 Open Questions for Client Stakeholders
1. **Telebirr B2C Transaction Limits**: What are the daily transaction limits and Know-Your-Customer (KYC) requirements imposed on the organization's corporate Telebirr wallet for automated volunteer allowance disbursements?
2. **Fayda National ID Integration**: Should VTS plan direct API integration with the Ethiopian National ID Program (Fayda) for automated biometric verification during online intake?
3. **Offline Field Deployments**: How frequently will volunteer teams operate in remote rural areas completely devoid of cellular data connectivity, and what maximum offline synchronization duration is required?

### 22.3 Prototype Limitations & Operational Risks
- **Browser-Local Storage**: Prototype records reside in browser `localStorage`. Resetting browser data or using incognito sessions clears custom mutations back to seed data.
- **Simulated Telebirr Gateway**: Webhooks and payment timeouts are simulated using deterministic timer delays rather than live bank settlement rails.
- **Media Storage Limits**: Document and photo uploads in the prototype use Base64 data URIs and sample Cloudinary URLs rather than direct multi-part file streaming.

---

## 23. Development Workflow and Contributions

### 23.1 Git Branching Strategy & Naming Conventions
VTS follows a strict feature-branch integration workflow:
- `main`: Production-ready, fully verified codebase. Direct commits to `main` are strictly forbidden.
- `phaseN-name`: Structured upgrade branches (e.g., `phase5-polish`, `phase6-upgrade`).
- `feature/name` or `fix/name`: Targeted engineering branches created from the latest integration branch.

### 23.2 Commit Message Standard
All commits adhere to conventional, descriptive commit standards:
- Format: `feat(domain): imperative concise description` or `fix(domain): imperative concise description`.
- Examples: `feat(allowances): enforce four-eye approval lock`, `fix(ui): remove hairline border from modal footer`.
- Prohibited: Vague messages (`update stuff`, `checkpoint`, `wip`).

### 23.3 Step-by-Step: Adding a New Screen
1. Create the page component in `client/src/pages/<role>/<PageName>.tsx`.
2. Wrap the view with `PageShell`, configuring `data-page` and appropriate breadcrumb navigation.
3. Register the route in `client/src/App.tsx` inside the appropriate `RoleRoute` protection block.
4. Add a navigation link with an approved icon in `client/src/components/layout/AppSidebar.tsx`.
5. Verify the screen at 360px and 1440px viewports ensuring complete zero-border compliance.

### 23.4 Step-by-Step: Adding a New Permission
1. Declare the module identifier in `PermissionModule` within `client/src/types/index.ts`.
2. Configure default role privileges in `client/src/utils/permissions.ts`.
3. Wrap sensitive UI triggers using `const { can } = usePermission(); if (!can(module, action)) return null;`.
4. Document the new permission in Section 9 of this README.

### 23.5 Step-by-Step: Adding a New Entity
1. Define the TypeScript interface in `client/src/types/index.ts`.
2. Add mock data seeding fixtures in `client/src/api/seedData.ts` and storage handlers in `mockData.ts`.
3. Add the corresponding `CREATE TABLE` declaration in `docs/schema.sql`.
4. Update the automated inventory scanner by running `node scripts/inventory.cjs`.

---

## 24. Evaluator FAQ and Glossary

### 24.1 Frequently Asked Questions

**Q: Can a single person hold multiple roles simultaneously?**
A: No. In VTS, each user account holds exactly one operational role at a time (`applicant`, `volunteer`, `lead`, `manager`, `finance`, `admin`). When a volunteer is promoted or an employee appointed, their role elevates permanently.

**Q: What happens if an applicant cannot pay the ETB 200 registration fee?**
A: The Branch Manager can process an assisted intake waiver in `/manager/applications`, submitting a documented hardship justification which is confirmed by the Super Admin.

**Q: How does the system prevent a manager from paying out unauthorized stipends?**
A: Through separation of duties: Managers can only verify shift attendance. Budget authorization is reserved for the Super Admin, and actual wallet disbursement is executed exclusively by the Finance Officer.

**Q: Does the application work on mobile devices?**
A: Yes. All 59 screens are fully responsive and verified down to a 360px mobile viewport width. The navigation sidebar seamlessly transitions into a slide-over mobile drawer.

### 24.2 One-Page Technical & Domain Glossary

| Term / Identifier | Technical & Domain Definition |
| :--- | :--- |
| **Activity** | A discrete operational service shift, community project task, or training session with scheduled hours, venue, and attendance limits. |
| **Allowance** | A cost-offset per-diem stipend disbursed to volunteers for field expenses, subject to project budget caps and multi-tier approval. |
| **Assisted Intake** | The administrative walk-in onboarding workflow where a staff coordinator registers a volunteer in person and records cash payments. |
| **Brevo** | The cloud transactional email service integrated for dispatching system notifications, credential alerts, and status memos. |
| **Evidence Drawer** | An interactive side-sheet component enabling supervisors to inspect submitted ID cards, attendance photos, and receipts. |
| **Four-Eye Principle** | A governance rule requiring a minimum of two distinct authorized identities to approve sensitive fiscal or credential actions. |
| **KpiBand** | A signature UI component presenting high-level quantitative metrics inside a unified tonal panel at the top of key dashboards. |
| **Rank** | An objective four-tier merit level (`Volunteer`, `Senior Volunteer`, `Leader`, `Master`) earned through accumulated verified field service. |
| **Role** | An operational security persona (`applicant`, `volunteer`, `lead`, `manager`, `finance`, `admin`) that dictates system permissions and routing access. |
| **Scope** | An organizational boundary (`global`, `area`, `branch`, `self`) that restricts data visibility and query reach. |
| **Telebirr** | Ethio Telecom's mobile money payment platform, utilized for C2B registration fee collections and B2C allowance disbursements. |
| **TicketCard** | A signature UI card displaying scheduled field activities with notched ticket styling, capacity counters, and action triggers. |
| **Volunteer Pass** | A digital credential card featuring volunteer portrait, legal name, volunteer ID, rank badge, and an anti-tamper QR code. |
| **Zero-Border Language**| The modern design system standard that eliminates dark outlines and 1px borders in favor of tonal surfaces, elevation, and space. |

