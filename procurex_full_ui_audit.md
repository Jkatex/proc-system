# ProcureX Complete UI Audit & Improvement Suggestions

> [!NOTE]
> This audit covers **all 28 pages**, the **design system (17,400+ lines CSS)**, the **SPA router**, and the **mock data layer**. Issues are ranked by impact.

---

## Table of Contents

1. [Architecture & Infrastructure](#1-architecture--infrastructure)
2. [Design System & Tokens](#2-design-system--tokens)
3. [Welcome / Landing Page](#3-welcome--landing-page)
4. [Registration Flow](#4-registration-flow)
5. [Sign-In Page](#5-sign-in-page)
6. [eKYC / IAM Verification](#6-ekyc--iam-verification)
7. [IAM Profile Workspace (Verification Status)](#7-iam-profile-workspace)
8. [Workspace Dashboard](#8-workspace-dashboard)
9. [Marketplace & Tender Discovery](#9-marketplace--tender-discovery)
10. [Supplier Tender Detail](#10-supplier-tender-detail)
11. [Create Tender Wizard](#11-create-tender-wizard)
12. [Bidding Workspace](#12-bidding-workspace)
13. [Communication Center](#13-communication-center)
14. [Bid Evaluation](#14-bid-evaluation)
15. [Award Recommendation](#15-award-recommendation)
16. [Contract Negotiation](#16-contract-negotiation)
17. [Post-Award Tracking](#17-post-award-tracking)
18. [App Launcher & Navigation Shell](#18-app-launcher--navigation-shell)
19. [Records & History](#19-records--history)
20. [Accessibility](#20-accessibility)
21. [Performance](#21-performance)
22. [Mobile Responsiveness](#22-mobile-responsiveness)

---

## 1. Architecture & Infrastructure

### Issues Found

| # | Issue | Severity |
|---|-------|----------|
| 1 | **28 separate `<script>` tags** loaded synchronously in `index.html` — no bundler, no code splitting | 🔴 High |
| 2 | `design-system.css` is **17,400+ lines / 380KB** in a single monolithic file | 🔴 High |
| 3 | Every page re-renders by replacing `innerHTML` of `#page-content` — no virtual DOM diffing, causes flash and lost scroll | 🟡 Medium |
| 4 | No `<meta name="description">` tag on `index.html` | 🟡 Medium |
| 5 | CDN scripts (Chart.js, html2pdf, dotlottie) loaded without integrity hashes or fallback | 🟡 Medium |
| 6 | Duplicate CSS — `main.css` is fully copied into `design-system.css` (lines 1–353 duplicated) | 🟡 Medium |
| 7 | Global function pollution — every page registers functions on `window` | 🟢 Low |

### Suggestions

- **Bundle with Vite or esbuild** — Combine all 28 page scripts + app.js into ≤3 chunks with tree-shaking
- **Split CSS** — Extract critical-path CSS (≤15KB) inline in `<head>`, lazy-load the rest
- **Remove duplicate CSS** — `main.css` should not exist since `design-system.css` already contains it
- **Add SRI hashes** to all CDN `<script>` tags
- **Add proper `<meta>` tags** — description, og:title, og:description, favicon link
- **Consider a lightweight router** (e.g., page.js or Navigo) instead of manual `popstate` + query-string routing

---

## 2. Design System & Tokens

### Issues Found

| # | Issue | Severity |
|---|-------|----------|
| 1 | **Badge colors are misleading** — `--success-green: #1d1d1f` (near-black), `--warning-amber: #7a7a7a` (gray) | 🔴 High |
| 2 | `--radius-xl`, `--radius-xxl`, `--radius-xxxl` are ALL `18px` — no differentiation | 🟡 Medium |
| 3 | No dark mode support despite `color-scheme: light` being set | 🟡 Medium |
| 4 | `--shadow-sm`, `--shadow-md`, `--shadow-lg` are all `none` — cards have zero depth | 🟡 Medium |
| 5 | Inline styles used extensively in `contract-negotiation.js` and `post-award-tracking.js` instead of CSS classes | 🟡 Medium |
| 6 | Button font-weight is `700` (bold) everywhere — DESIGN.md specifies `400` for primary buttons | 🟢 Low |

### Suggestions

- **Fix semantic color tokens immediately:**
  ```css
  --success-green: #0d7c3d;  /* actual green */
  --success-bg: #e8f5e9;
  --warning-amber: #d4790e;  /* actual amber/orange */
  --warning-bg: #fff8e1;
  ```
- **Differentiate radius tokens:** `--radius-xl: 20px`, `--radius-xxl: 24px`, `--radius-xxxl: 28px`
- **Add subtle shadows** for card depth perception:
  ```css
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  ```
- **Move ALL inline styles** in contract-negotiation.js and post-award-tracking.js to proper CSS classes
- **Add dark mode** with `@media (prefers-color-scheme: dark)` or a toggle
- **Add focus-visible styles** globally for keyboard navigation

---

## 3. Welcome / Landing Page

### What Works Well
- Clean hero layout with dual-CTA ("Get Started" + "Explore Opportunities")
- Social proof element ("Trusted by 2,000+ businesses")
- Four-step workflow section is clear and scannable
- Dark band marketplace section adds visual rhythm
- Footer has proper semantic `<nav>` elements

### Issues & Suggestions

| Area | Issue | Suggestion |
|------|-------|------------|
| **Hero** | No animation or visual motion on load beyond `animate-fade-in` | Add staggered entrance animations for hero text, product window, and CTAs |
| **Hero image** | Single static `procurement-meeting.webp` — no fallback if missing | Add `onerror` handler and a CSS gradient fallback |
| **Navigation** | "How It Works" and "About" use anchor links (`#how-it-works`) that don't work in SPA routing | Implement smooth-scroll-to-section behavior in `app.js` |
| **Marketplace cards** | Images load via string interpolation with fixed filenames — brittle | Use a data-driven approach with fallback placeholder |
| **CTA section** | Only one button ("Get Started Now") — missing secondary action | Add "Watch Demo" or "Learn More" as secondary CTA |
| **Footer** | "Privacy Policy" and "Terms" point to `#help-center` — not real pages | Create dedicated legal pages or modal overlays |
| **SEO** | Only one `<h1>` per page ✅ but no structured data (JSON-LD) | Add Organization schema markup |
| **Mobile** | Nav links don't collapse to hamburger menu | Add responsive hamburger menu for `< 768px` |

---

## 4. Registration Flow

### What Works Well
- 4-step progress indicator with clear labels
- OTP input auto-advances to next field
- Password strength meter with live requirements checklist
- "Use mock sign-up data" button for demo purposes

### Issues & Suggestions

| Area | Issue | Suggestion |
|------|-------|------------|
| **Step 1** | No real-time email validation feedback | Add inline validation with debounced check + visual indicator |
| **Step 1** | Phone placeholder `+255 XXX XXX XXX` — no input masking | Use input masking library or `pattern` attribute with visual formatting |
| **Step 2** | OTP timer starts at 30s but no visual countdown ring | Add circular countdown animation around the timer |
| **Step 2** | "Resend Code" button stays disabled until timer ends — no visual cue for when it enables | Add color transition animation when resend becomes available |
| **Step 3** | "Open Email App" button doesn't actually open anything | Implement `mailto:` link or explain it's a mock |
| **Step 3** | "Continue to Password Setup" bypasses actual email verification | Add warning text that this skips verification in demo mode |
| **Step 4** | Password requirements show "o" as placeholder icon | Use proper checkmark (✓) and X (✗) icons with color states |
| **Step 4** | Terms checkbox uses custom `data-confirm-control` — hard to discover | Make the checkbox label clickable with clearer visual affordance |
| **Step 5** | Success screen has minimal celebration | Add confetti animation or success Lottie animation |
| **Layout** | Right panel shows only Lottie animation — wasted space | Add contextual illustrations or benefits list that changes per step |

---

## 5. Sign-In Page

### Issues & Suggestions

| Area | Issue | Suggestion |
|------|-------|------------|
| **Layout** | Nearly identical to Register page — no visual differentiation | Differentiate with unique heading illustration or color accent |
| **Demo credentials** | Mock accounts shown inline — clutters the form | Move to collapsible "Demo accounts" accordion below the form |
| **Auth note** | "New users continue to eKYC..." text is plain unstyled text | Style as an info callout with icon |
| **Password** | No "Forgot password" flow implemented | Add at minimum a modal explaining password reset |
| **Remember me** | Checkbox has no visual custom styling | Style with custom checkbox matching the design system |
| **Social login** | No social sign-in options | Add Google, Microsoft SSO buttons (even as disabled placeholders) |
| **Loading state** | No loading indicator when clicking "Sign In" | Add button loading spinner state |

---

## 6. eKYC / IAM Verification

### What Works Well
- Entity type selection (Individual / Company / Business) with radio cards
- Registry lookup (TRA/BRELA) with mock data fetch
- Step-by-step wizard with 4 clear stages
- Digital signature capture step

### Issues & Suggestions

| Area | Issue | Suggestion |
|------|-------|------------|
| **Registry fetch** | "Click fetch to show the record" — mock hint is visible to users | Hide mock hints or show only in dev mode |
| **Step indicators** | Small dot indicators, hard to see current step | Use larger step circles with labels, matching register.js pattern |
| **Entity switching** | Changing entity type resets registry review without warning | Add confirmation dialog before resetting |
| **File uploads** | Generic upload areas with no file type hints | Show accepted formats (PDF, JPG, PNG) and max size |
| **Validation** | No field-level validation — user can skip required fields | Add real-time validation with error messages |
| **Completion** | Summary step (Step 4) is auto-generated but not editable | Allow users to edit individual fields from summary view |
| **Progress saving** | No auto-save or draft mechanism | Save progress to localStorage between steps |

---

## 7. IAM Profile Workspace

### What Works Well
- Comprehensive 10-tab profile editor (Overview → System)
- Entity-aware field visibility (Individual vs Organization)
- Profile completion percentage with progress bar
- Section-level completion badges

### Issues & Suggestions

| Area | Issue | Suggestion |
|------|-------|------------|
| **Tab navigation** | 10 tabs in a horizontal row — overflows on mobile | Use scrollable tab bar with overflow indicators or collapsible sidebar |
| **Save draft** | Only saves to session — no localStorage persistence | Persist to localStorage with timestamp and restore on reload |
| **Upload fields** | File inputs are raw browser defaults | Style with drag-and-drop zones matching the design system |
| **Toggle switches** | Custom `iam-toggle` — inconsistent with other form controls | Standardize toggle component across the platform |
| **Multiselect** | Checkbox lists for categories — no search or filter | Add searchable multiselect with chip display |
| **System tab** | Shows 15+ read-only rows with "System maintained" placeholders | Show actual counts where possible or hide placeholder rows |
| **Form validation** | `data-iam-required` attributes exist but no visual enforcement | Add red asterisk + error state styling for required fields |
| **Missing sidebar** | No sidebar navigation unlike other workspace pages | Add left sidebar with section quick-jump links |

---

## 8. Workspace Dashboard

### What Works Well
- Personalized greeting with time-of-day awareness
- Urgency-sorted action items with scores
- Smart quick actions adapted to user role
- Draft resume panel with tender/bid drafts from localStorage
- Analytics cards with period switching (weekly/monthly/yearly)
- Chart.js integration with graceful fallback when CDN is blocked

### Issues & Suggestions

| Area | Issue | Suggestion |
|------|-------|------------|
| **Hero card** | User avatar shows initials only — no profile photo support | Add photo upload integration from IAM profile |
| **Urgency scores** | Raw numbers (e.g., "94") shown — no context for what they mean | Add labels like "Critical", "High", "Medium" with color coding |
| **Drafts panel** | Empty state says "No saved drafts yet" — good, but CTA only shows "Create Tender" | Add "Browse Marketplace" as second CTA for suppliers |
| **Workflow items** | Time shows "1h ago", "2h ago" — mock data, not real | Use actual timestamps from localStorage saves |
| **Analytics** | Chart fallback bars are unstyled `<div>` elements | Style fallback bars with proper labels, colors, and animations |
| **Chart grid** | `is-hidden` class hides charts but shows fallback — jarring transition | Add smooth fade transition between chart and fallback |
| **Live feed** | 3600ms auto-rotation interval — too fast, causes attention distraction | Increase to 6000ms and add pause-on-hover |
| **Account panel** | "Open" button for deadline watch navigates to marketplace — unclear | Label as "View Closing Tenders" |
| **Missing** | No notification bell or alert count in the header | Add notification badge on the top bar |
| **Missing** | No search functionality on the dashboard | Add global search bar in the top navigation |

---

## 9. Marketplace & Tender Discovery

### Issues & Suggestions

| Area | Issue | Suggestion |
|------|-------|------------|
| **Search** | Search input, dropdowns, and button exist but search is non-functional | Implement client-side filtering on `tenders` array |
| **Filters** | Only 2 dropdowns (sector + type) — missing critical filters | Add: Budget range, Closing date range, Location, Status filter |
| **Tender list** | Flat list with no pagination — will break with many tenders | Add pagination or virtual scrolling (10-20 items per page) |
| **Tender cards** | Text-heavy with no visual hierarchy | Add tender type icon, color-coded status stripe, and deadline countdown |
| **KPI cards** | 3 cards ("Open tenders", "Draft bids", "Closing soon") — good | Add "Total budget value" as 4th KPI |
| **Empty state** | Plain text "No active marketplace tenders right now." | Add illustration + CTA to create a tender |
| **Sorting** | No sort options available | Add sort by: Newest, Deadline, Budget (ascending/descending) |
| **Saved/Bookmarked** | No way to bookmark tenders of interest | Add bookmark/star functionality with "Saved Tenders" tab |
| **Guest marketplace** | `guest-marketplace.js` is only 6KB — minimal implementation | Flesh out with full marketplace view but disabled bid actions |

---

## 10. Supplier Tender Detail

### What Works Well
- Detailed tender view with requirements, milestones, and documents
- Direct path to bidding workspace
- Clarification request integration

### Issues & Suggestions

| Area | Issue | Suggestion |
|------|-------|------------|
| **Layout** | Dense information without clear sections | Add tabbed interface: Overview / Requirements / Documents / Clarifications |
| **Deadline** | No visual countdown timer | Add prominent countdown with urgency color changes (green → amber → red) |
| **Documents** | Document list shows names only | Add file size, type icon, and download button styling |
| **Bid button** | Single "Start Bid" CTA at the bottom | Add sticky footer bar with "Start Bid" CTA (Apple's floating-sticky-bar pattern) |
| **Related tenders** | No "Similar tenders" section | Add recommendation engine for related open tenders |

---

## 11. Create Tender Wizard

### What Works Well
- At **395KB**, this is the most comprehensive component
- Multi-step wizard with auto-save to localStorage
- Dynamic requirement sections based on tender type
- Evaluation criteria definition
- Milestone and timeline management

### Issues & Suggestions

| Area | Issue | Suggestion |
|------|-------|------------|
| **File size** | 395KB single JS file — massive | Split into sub-modules per wizard step |
| **Auto-save** | Saves to localStorage but no visual feedback | Add "Saved just now" / "Saving..." indicator in the header |
| **Step navigation** | Linear wizard — can't jump to arbitrary steps | Allow clicking completed steps to jump back |
| **Preview** | Tender publication page exists but is minimal | Add full tender preview with PDF export option |
| **Validation** | Per-step validation exists but errors aren't highlighted inline | Scroll to first error field with shake animation |
| **Templates** | No tender templates for common procurement types | Add "Start from template" with predefined goods/works/services templates |
| **Collaboration** | Single-user wizard — no multi-user draft editing | Add "Share draft" functionality for team review |

---

## 12. Bidding Workspace

### What Works Well
- At **278KB**, extremely comprehensive
- Dynamic sections generated from tender requirements
- Line-item pricing tables
- Document attachment per requirement
- Bid receipt hash generation for integrity
- Auto-save with draft resume

### Issues & Suggestions

| Area | Issue | Suggestion |
|------|-------|------------|
| **File size** | 278KB — second largest file | Split into sub-modules (pricing, documents, compliance, review) |
| **Progress** | No overall bid completion percentage | Add progress bar showing % of required sections completed |
| **Compliance** | Requirements shown but no pass/fail gate | Add compliance checklist that blocks submission if mandatory items missing |
| **Pricing** | Line items exist but no automatic total calculation display | Add running total with tax/currency calculations |
| **Review** | Submission confirmation is basic | Add full bid summary review with section-by-section checklist |
| **Timer** | No deadline countdown during bid preparation | Add persistent countdown timer in the header/sticky bar |
| **Attachments** | File upload areas are functional but basic | Add drag-and-drop with preview, file type validation, and size limits |

---

## 13. Communication Center

### What Works Well
- Full email-client UI with sidebar folders (Inbox, Sent, Archived, Trash)
- Threaded conversations with reply visibility controls
- Role-aware mailbox system (buyer, supplier, admin, evaluator)
- Compose new message with category and recipient selection
- Filter/search/sort functionality
- localStorage persistence for sent items

### Issues & Suggestions

| Area | Issue | Suggestion |
|------|-------|------------|
| **Search** | Live search filters on input — may be slow with many items | Debounce search input (300ms delay) |
| **Thread view** | Threads are flat — no visual nesting or indentation | Add indented thread display with reply-chain visualization |
| **Attachments** | "Attach" button exists but doesn't work | Implement file attachment with preview |
| **Notifications** | No real-time notification for new messages | Add polling or WebSocket-ready structure with badge count |
| **Compose** | Opens inline — pushes content down | Open as modal overlay or slide-in panel |
| **Empty states** | "No communication items match this view" — plain text | Add folder-specific empty illustrations |
| **Bulk actions** | No multi-select for bulk read/archive/delete | Add checkboxes on each row with bulk action bar |
| **Mobile** | Three-column layout (sidebar + list + detail) won't work on mobile | Stack into single-column with back navigation |

---

## 14. Bid Evaluation

### What Works Well
- Multi-tender selection with per-tender progress tracking
- 7-stage evaluation pipeline (Opening → Report)
- Criterion-by-criterion, bidder-by-bidder scoring interface
- Draft save/resume with localStorage persistence
- Evaluation report generation with PDF export via html2pdf
- Conflict of interest declarations
- Price benchmarking and risk signals
- Submitted bid document viewer integration

### Issues & Suggestions

| Area | Issue | Suggestion |
|------|-------|------------|
| **Scoring UX** | One criterion + one bidder at a time — slow for many bids | Add matrix view option (all bidders × all criteria in one table) |
| **Score input** | Raw number input — easy to exceed max score | Add slider or constrained input with max validation |
| **Evidence** | Text input for evidence — no document attachment | Allow linking to uploaded bid documents as evidence |
| **Report** | Generated as HTML table — basic formatting | Add styled PDF template with header, logo, page numbers |
| **Comparison** | No side-by-side bid comparison view | Add split-screen comparison for 2-3 bidders |
| **Audit trail** | Displayed as `<ul>` list — minimal formatting | Add timeline visualization with icons and expandable details |
| **Stage navigation** | Tab-based with sidebar — good but sidebar links are basic | Add progress indicators per stage in the sidebar |

---

## 15. Award Recommendation

### Issues & Suggestions

| Area | Issue | Suggestion |
|------|-------|------------|
| **Ranking table** | Shows radio buttons for winner selection — not connected to logic | Wire radio selection to update recommendation fields |
| **Form fields** | Recommendation form uses raw `<input>` with pre-filled values — looks editable | Add clear edit/save modes with inline editing |
| **Approval flow** | No multi-level approval workflow UI | Add approval chain visualization (Evaluator → Committee → Authority) |
| **Missing** | No "Debrief unsuccessful bidders" action | Add debriefing letter template and send functionality |
| **Missing** | No standby supplier designation (2nd, 3rd place) | Add ranked reserve list with auto-escalation rules |

---

## 16. Contract Negotiation

### Issues & Suggestions

| Area | Issue | Suggestion |
|------|-------|------------|
| **Inline styles** | **Heavy inline style usage** — 30+ `style=""` attributes | Extract ALL inline styles to CSS classes |
| **Status cards** | "PO Matched", "Budget Verified" cards use `var(--success-green)` which is near-black | Fix after updating `--success-green` to actual green |
| **Signature area** | Static "Signature Area" placeholder — non-interactive | Add canvas-based signature pad or type-to-sign |
| **Chat sidebar** | Messages are static mock data — no send functionality | Wire the send button to add messages to the chat |
| **Clause library** | Excellent clause catalog by type — but read-only | Add clause customization: toggle on/off, edit terms, add custom clauses |
| **Contract preview** | No full contract document preview | Generate combined PDF with all clauses, terms, and signatures |
| **Version control** | Shows "Draft Version 2.1" but no version history | Add version comparison and rollback |

---

## 17. Post-Award Tracking

### Issues & Suggestions

| Area | Issue | Suggestion |
|------|-------|------------|
| **Inline styles** | Same issue as Contract Negotiation — extensive inline styles | Move to CSS classes |
| **Milestone tracking** | Good GRN/acceptance table but static data | Make milestone statuses interactive (click to update) |
| **Performance metrics** | Progress bars for Delivery/Quality/Communication — good | Add trend arrows (↑/↓) and comparison to platform average |
| **Dispute section** | Basic dispute list — no case detail view | Add expandable dispute detail with evidence viewer |
| **Invoice matching** | Three-way matching table is clear | Add visual match/mismatch indicators (✓/✗) per cell |
| **Institutional memory** | Timeline is a simple list | Add proper timeline component with icons and expandable entries |
| **Missing** | No contract amendment tracking | Add change order management with approval workflow |
| **Missing** | No payment scheduling calendar | Add Gantt-style payment schedule visualization |

---

## 18. App Launcher & Navigation Shell

### Issues & Suggestions

| Area | Issue | Suggestion |
|------|-------|------------|
| **App menu** | Drawer opens from top-right — 6 app cards | Add app icons/colors per card for faster visual scanning |
| **Profile menu** | Only "Settings" and "Logout" — minimal | Add: Profile, Notifications, Help, Language selector |
| **Breadcrumbs** | No breadcrumb navigation anywhere | Add breadcrumbs showing: Dashboard > Marketplace > Tender Detail |
| **Global search** | No search anywhere in the app shell | Add search input in the top bar with command-palette (Ctrl+K) |
| **App switcher** | Cards have SVG icons but all same teal color | Color-code each app: IAM=blue, Procurement=green, Communication=purple |
| **Role indicator** | Current role (buyer/supplier) not visible in the header | Add role badge/switcher in the top bar |

---

## 19. Records & History

### Issues & Suggestions

| Area | Issue | Suggestion |
|------|-------|------------|
| **File size** | Only 5.5KB — minimal implementation | Expand significantly with proper data tables |
| **Content** | Basic list view of past activities | Add filterable table with: Date, Type, Reference, Status, Amount |
| **Export** | No export functionality | Add CSV/PDF export for compliance and audit |
| **Search** | No search or date range filter | Add date picker range + text search + category filter |
| **Detail view** | No drill-down into individual records | Add click-to-expand detail view for each record |

---

## 20. Accessibility

### Critical Issues

| # | Issue | Fix |
|---|-------|-----|
| 1 | **No skip-to-content link** | Add `<a class="skip-link" href="#main-content">Skip to content</a>` |
| 2 | **Color contrast** — `--warning-amber: #7a7a7a` on white fails WCAG AA | Change to `#d4790e` or darker |
| 3 | **Badge contrast** — `badge-warning` has gray bg with dark text — low contrast | Use amber bg with dark text |
| 4 | **Focus states** — `:focus` removes outline (`outline: none`) on form inputs | Add `outline: 2px solid var(--primary-blue)` on `:focus-visible` |
| 5 | **ARIA labels** — Many interactive buttons lack `aria-label` | Add labels to all icon-only buttons |
| 6 | **Form errors** — `<span class="form-error-new">` is empty — no `aria-live` | Add `role="alert" aria-live="polite"` to error spans |
| 7 | **Tab order** — Modal/drawer menus don't trap focus | Implement focus trap in app drawer and profile menu |
| 8 | **Screen reader** — Page transitions don't announce new page | Add `aria-live` region that announces page title on navigation |

---

## 21. Performance

### Issues & Suggestions

| # | Issue | Suggestion |
|---|-------|------------|
| 1 | **380KB CSS** loaded as single blocking file | Split into critical (inline) + deferred chunks |
| 2 | **325KB data.js** loaded synchronously | Lazy-load mock data or split by page |
| 3 | **No image optimization pipeline** | Add WebP with `<picture>` + `srcset` for responsive loading |
| 4 | **innerHTML re-render** on every page change | Consider incremental DOM updates or lit-html |
| 5 | **Chart.js loaded on every page** even when no charts exist | Load Chart.js only on dashboard pages via dynamic import |
| 6 | **No service worker** or offline support | Add PWA manifest + service worker for offline capability |
| 7 | **No resource hints** | Add `<link rel="preload">` for critical fonts and CSS |

---

## 22. Mobile Responsiveness

### Issues Found

| # | Issue | Suggestion |
|---|-------|------------|
| 1 | **Welcome nav** doesn't collapse to hamburger on mobile | Add hamburger toggle at `< 768px` |
| 2 | **Evaluation workspace** — 3-column sidebar+content+detail layout breaks | Stack vertically with tab-based navigation |
| 3 | **Communication center** — 3-pane layout needs complete mobile rethink | Implement drill-down: Folders → List → Detail |
| 4 | **Data tables** — All tables use `min-width: 680px` causing horizontal scroll | Add responsive card view alternative for mobile |
| 5 | **Contract negotiation** chat sidebar | Convert to bottom sheet on mobile |
| 6 | **Bid evaluation scoring grid** | Convert to stacked card per criterion on mobile |
| 7 | **Dashboard analytics grid** | Ensure 1-column at `< 640px` — verify in CSS |
| 8 | **Touch targets** — Some buttons are smaller than 44×44px | Enforce minimum touch target size globally |

---

## Summary: Top 10 Most Impactful Changes

| Priority | Change | Impact |
|----------|--------|--------|
| 🔴 1 | **Fix badge/status colors** (`--success-green`, `--warning-amber`) | Users can't distinguish statuses — fundamental UX failure |
| 🔴 2 | **Bundle JS files** — reduce from 28 scripts to 3 chunks | Page load performance: ~1.2MB → ~200KB |
| 🔴 3 | **Split CSS** — 380KB monolith to critical + lazy | First paint time improvement |
| 🔴 4 | **Remove inline styles** from contract-negotiation.js and post-award-tracking.js | Maintainability and consistency |
| 🟡 5 | **Add functional search/filter** to marketplace | Core feature — currently non-functional |
| 🟡 6 | **Add pagination** to tender lists | Will break with real data volumes |
| 🟡 7 | **Mobile hamburger menu** on welcome page + responsive layouts | Platform unusable on mobile currently |
| 🟡 8 | **Add focus-visible styles** and skip-link | Accessibility compliance (WCAG 2.1 AA) |
| 🟡 9 | **Add card shadows** (currently all `none`) | Visual depth and hierarchy — feels flat |
| 🟢 10 | **Add global search** with command-palette | Power user productivity feature |

---

> [!IMPORTANT]
> The badge color issue (#1) is the single highest-impact fix. Users currently see **near-black** for success and **gray** for warnings — making every status badge indistinguishable. This should be fixed before any other change.
