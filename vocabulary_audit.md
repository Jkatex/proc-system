# ProcureX Vocabulary Audit: Non-Procurement Terms & Corrections

> [!IMPORTANT]
> This audit identifies every user-facing term in the ProcureX UI that is **not standard procurement vocabulary** and suggests the correct replacement. Terms are sourced from standard procurement practice, Tanzania's **Public Procurement Act (PPA)**, and the **PPRA (Public Procurement Regulatory Authority)** glossary.

---

## Category 1: 🔴 Internal Jargon Exposed to Users

These are developer/system terms that should NEVER appear in the UI. Users don't know what "Logic 15" means.

| # | Current Term | File & Line | Correct Term | Why |
|---|-------------|-------------|--------------|-----|
| 1 | **"Logic 15 performance memory"** | `post-award-tracking.js:38` | **"Contract Performance History"** | "Logic 15" is an internal system reference, not a user-facing label |
| 2 | **"Logic 15 and Logic 19"** | `post-award-tracking.js:71` | **"Delivery & Invoice Verification"** | Users don't know what logic numbers mean |
| 3 | **"Logic 19 invoice validation"** | `post-award-tracking.js:128` | **"Three-Way Invoice Matching"** | Standard procurement term for PO-GRN-Invoice verification |
| 4 | **"Logic 20 exception handling"** | `post-award-tracking.js:204` | **"Dispute Resolution"** or **"Exception Management"** | Standard procurement term |
| 5 | **"CEC winner"** | `bid-evaluation.js:592` | **"Lowest Evaluated Cost"** or **"Best Evaluated Bid"** | CEC (Comparable Economic Cost) is internal — PPA uses "Best Evaluated Bid" |
| 6 | **"Visibility model"** | `tender-publication.js:82` | **"Publication Settings"** or **"Access Control"** | "Visibility model" is a developer term |
| 7 | **"Quality flags"** | `tender-publication.js:89` | **"Compliance Checklist"** or **"Pre-Publication Review"** | "Quality flags" sounds like QA testing |
| 8 | **"Records path"** | `tender-details.js:133` | **"Audit Trail"** or **"Procurement Records"** | Standard procurement term |
| 9 | **"scope-empty"** (CSS class shown as message context) | Multiple files | N/A — CSS class is fine, but review the empty-state messages for clarity | The class name is internal; the messages are user-facing |
| 10 | **"Read-only trust data"** | `verification-status.js:353` | **"System Verification Record"** | "Trust data" is not a procurement concept |
| 11 | **"Trust Score"** | `post-award-tracking.js:266`, `buyer-dashboard.js:124` | **"Performance Rating"** or **"Vendor Rating"** | "Trust score" is fintech jargon — procurement uses "Performance Rating" |

---

## Category 2: 🔴 Role-Based Terms (Must Remove — No Roles in System)

Since users are NOT "buyers" or "suppliers" — they are just **users**, these labels must change.

| # | Current Term | File & Line | Correct Term | Why |
|---|-------------|-------------|--------------|-----|
| 12 | **"Supplier Dashboard"** | `supplier-dashboard.js:29` | **"Dashboard"** | No roles — just "Dashboard" |
| 13 | **"Buyer Dashboard"** | `buyer-dashboard.js:32` | **"Dashboard"** | Same — no roles |
| 14 | **"Supplier Marketplace"** | `supplier-marketplace.js:12` label, `app.js:270` page title | **"Tender Marketplace"** or just **"Marketplace"** | Marketplace is for all users, not just suppliers |
| 15 | **"Buyer action"** | `procurement-dashboard.js:125` | **"Create & Manage"** or **"My Tenders"** | Avoid buyer/supplier labels |
| 16 | **"Supplier action"** | `procurement-dashboard.js:135` | **"Bid & Respond"** or **"My Bids"** | Avoid buyer/supplier labels |
| 17 | **"Supplier Journey"** | `supplier-journey.js:21,39` | **"Procurement Lifecycle"** or **"Bidding Process Guide"** | No supplier-specific journey — it's the same platform for everyone |
| 18 | **"Supplier Journey: Discovery to Payment"** | `supplier-journey.js:39` | **"Procurement Process: Tender to Payment"** | Use procurement vocabulary |
| 19 | **"supplier-marketplace"** (page URL/ID) | `app.js:206,238,239` + 20+ navigation refs | **"marketplace"** | Rename the page route to role-neutral |
| 20 | **"supplier-tender-detail"** (page URL/ID) | `app.js:239` + navigation refs | **"tender-detail"** | Simpler, role-neutral |
| 21 | **"supplier-dashboard"** (page URL/ID) | `app.js:268` | **Remove entirely** — merge into `workspace-dashboard` | Redundant with unified dashboard |
| 22 | **"buyer-dashboard"** (page URL/ID) | `app.js:266` | **Remove entirely** — merge into `workspace-dashboard` | Redundant with unified dashboard |

---

## Category 3: 🟡 Tech/Startup Language (Not Procurement)

These terms come from SaaS/startup/tech vocabulary and should be replaced with procurement-standard words.

| # | Current Term | File & Line | Correct Term | Why |
|---|-------------|-------------|--------------|-----|
| 23 | **"Explore Opportunities"** | `welcome.js:65,86,234` | **"Browse Open Tenders"** | In procurement, tenders are called tenders, not "opportunities" |
| 24 | **"Discovery"** | `supplier-journey.js:6`, `supplier-dashboard.js:48` | **"Tender Search"** or **"Tender Notice"** | PPA uses "Invitation to Tender" or "Tender Notice" for the discovery phase |
| 25 | **"Smart quick actions"** | `workspace-dashboard.js:326` | **"Quick Actions"** or **"Pending Actions"** | "Smart" is marketing language — doesn't add meaning |
| 26 | **"Personalized apps"** | `workspace-dashboard.js:393` | **"Applications"** or **"Modules"** | "Personalized" is unnecessary marketing language |
| 27 | **"Opportunity and insight feed"** | `workspace-dashboard.js:424` | **"Procurement Updates"** or **"Activity Feed"** | "Opportunity" and "insight" are startup/sales terms |
| 28 | **"Revenue pipeline"** | `workspace-dashboard.js:226` | **"Bid Value Pipeline"** or **"Potential Contract Value"** | "Revenue pipeline" is sales jargon — procurement uses "contract value" |
| 29 | **"Draft applications"** | `procurement-dashboard.js:145,183` | **"Draft Bids"** or **"Draft Tenders"** | In procurement, you submit bids/tenders, not "applications" |
| 30 | **"Live workspace"** | `procurement-dashboard.js:208` | **"Active Procurements"** or **"In Progress"** | "Live workspace" is tech jargon |
| 31 | **"global network of verified suppliers"** | `welcome.js:16` | **"registered participants"** or **"verified vendors"** | "Global network" sounds like LinkedIn |
| 32 | **"Institutional Memory"** | `post-award-tracking.js:273` | **"Contract History"** or **"Procurement Records"** | "Institutional memory" is academic language |
| 33 | **"Secure onboarding"** | `role-selection.js:9`, `iam-verification.js:46` | **"Registration"** or **"Account Verification"** | "Onboarding" is HR/SaaS language |
| 34 | **"Create Opportunity"** | `welcome.js:15` | **"Create Tender"** or **"Publish Tender"** | In procurement, you create tenders, not "opportunities" |
| 35 | **"Listed opportunities"** (guest marketplace KPI) | `guest-marketplace.js:58` | **"Published Tenders"** | Standard procurement term |

---

## Category 4: 🟡 Vague or Generic Labels

These terms are technically correct but too vague for a procurement platform — users need precise labels.

| # | Current Term | File & Line | Correct Term | Why |
|---|-------------|-------------|--------------|-----|
| 36 | **"User dashboard"** | `workspace-dashboard.js:278` | **"Procurement Dashboard"** | Specify the domain — it's a procurement platform |
| 37 | **"Needs attention"** | `workspace-dashboard.js:305` | **"Urgent Actions"** or **"Pending Approvals"** | Too vague — what needs attention? |
| 38 | **"Continue working"** | `workspace-dashboard.js:373` | **"Resume Drafts"** or **"Incomplete Items"** | More specific about what to continue |
| 39 | **"Current user"** | `workspace-dashboard.js:446` | **"Account Details"** or **"Profile Summary"** | "Current user" is a database term |
| 40 | **"Login owner"** | `verification-status.js:237` | **"Account Holder"** or **"Primary Contact"** | "Login owner" is IT jargon |
| 41 | **"Platform behavior"** | `verification-status.js:341` | **"Notification Preferences"** or **"System Settings"** | "Platform behavior" is vague |
| 42 | **"Tender matching"** | `verification-status.js:274` | **"Industry Classification"** or **"Procurement Categories"** | More precise about what it does |
| 43 | **"Evaluation support"** | `verification-status.js:316` | **"Financial Qualification"** or **"Financial Statements"** | This section shows financial data — name it clearly |
| 44 | **"Bid qualification"** | `verification-status.js:328` | **"Technical Qualification"** or **"Experience & Capacity"** | Align with PPA pre-qualification terminology |
| 45 | **"Approvals inbox"** | `tender-publication.js:67` | **"Approval Queue"** or **"Pending Approvals"** | "Inbox" implies email — this is an approval workflow |
| 46 | **"Amendment control"** | `tender-details.js:116` | **"Tender Amendments"** or **"Addenda"** | "Addenda" is the official procurement term for changes to published tenders |
| 47 | **"Evaluation workspace"** | `tender-details.js:125` | **"Bid Evaluation"** | Simpler, matches PPA language |
| 48 | **"Procurement app"** | `supplier-marketplace.js:12` | **"Tender Marketplace"** | More specific |

---

## Category 5: 🟡 Acceptable but Could Be Improved

These terms are close to correct but could be more precise in procurement context.

| # | Current Term | Suggested Improvement | Why |
|---|-------------|----------------------|-----|
| 49 | **"eKYC"** (used 15+ times across files) | **"Identity Verification"** or **"KYC Verification"** | "eKYC" is fintech jargon — most procurement users won't know it. PPA calls this "Registration" or "Vendor Registration" |
| 50 | **"IAM"** (used as app name) | **"Registration & Verification"** or keep **"IAM"** with subtitle | "IAM" (Identity & Access Management) is an IT term — but acceptable if always paired with subtitle |
| 51 | **"Marketplace"** | ✅ Acceptable | While PPA uses "Tender Notice" or "Invitation to Tender", "Marketplace" is widely understood in e-procurement |
| 52 | **"Bid"** vs **"Tender"** | Both are correct — but be consistent | In Tanzania PPA, the document you submit is a "Tender" in response to an "Invitation to Tender". However, "Bid" is commonly used and understood |
| 53 | **"GRN"** (Goods Received Note) | ✅ Keep — but add tooltip | Standard procurement term but may need explanation for new users |
| 54 | **"Three-way matching"** | ✅ Keep — but add explanation | Standard but not universally known: "PO vs GRN vs Invoice" |
| 55 | **"Clarifications"** | ✅ Correct | Standard PPA term for questions about tender documents |
| 56 | **"Award Recommendation"** | ✅ Correct | Standard PPA term |
| 57 | **"Evaluation Criteria"** | ✅ Correct | Standard PPA term |
| 58 | **"Standstill Period"** | ✅ Correct | Standard PPA term (14-day waiting period before contract signing) |

---

## Category 6: 🟢 File/Page Naming Conflicts

These internal page names should be renamed to match the new vocabulary:

| Current Page Name | Suggested Name | Reason |
|---|---|---|
| `supplier-marketplace` | `marketplace` | No "supplier" prefix needed |
| `supplier-tender-detail` | `tender-detail` | Role-neutral |
| `supplier-dashboard` | Remove — merge into `workspace-dashboard` | Redundant |
| `buyer-dashboard` | Remove — merge into `workspace-dashboard` | Redundant |
| `supplier-journey` | `procurement-guide` or `process-overview` | Role-neutral |
| `buyer-journey` | Remove — merge into `procurement-guide` | Redundant |
| `iam-verification` | `identity-verification` or `registration` | More user-friendly |
| `verification-status` | `profile` or `account-profile` | Clearer |

---

## Quick Reference: PPA Standard Terminology

For reference, here are the official Tanzanian PPA terms that should be used consistently:

| Concept | PPA Standard Term | ❌ Avoid |
|---------|------------------|----------|
| The document published to request bids | **Invitation to Tender (ITT)** | "Opportunity", "Listing" |
| What a user submits in response | **Tender** or **Bid** (both acceptable) | "Application", "Proposal" (unless consultancy) |
| The platform where tenders are listed | **Tender Portal** or **Marketplace** | "Opportunity board" |
| Reviewing submitted bids | **Bid Evaluation** | "Review", "Assessment" |
| The committee that evaluates | **Evaluation Committee** | "Review panel", "Judges" |
| The body that approves awards | **Tender Board** | "Approval committee" |
| Changes to a published tender | **Addendum** (plural: Addenda) | "Amendment", "Update" |
| Questions about tender documents | **Clarification Request** | "Question", "Inquiry" |
| Notice of who won | **Notification of Intention to Award** | "Winner announcement" |
| The user creating a tender | **Procuring Entity** | "Buyer", "Client" |
| The user submitting a bid | **Tenderer** or **Bidder** | "Supplier", "Vendor" |
| Financial guarantee with bid | **Tender Security** (or Bid Security) | "Deposit", "Bond" |
| Checking if bid meets requirements | **Responsiveness Check** | "Compliance check", "Validation" |
| The winning bid | **Best Evaluated Bid** | "Winner", "Top bid" |
| Post-evaluation waiting period | **Standstill Period** | "Cooling period", "Wait time" |
| Complaint about the process | **Appeal** (to PPAA) | "Dispute", "Complaint" |

---

## Summary: Top 10 Most Urgent Vocabulary Fixes

| Priority | Fix | Impact |
|----------|-----|--------|
| 🔴 1 | Remove **"Logic 15/19/20"** from post-award-tracking.js | Internal jargon visible to users — completely confusing |
| 🔴 2 | Replace **"CEC winner"** with "Best Evaluated Bid" | Non-standard procurement term |
| 🔴 3 | Replace **"Trust Score"** with "Performance Rating" | Fintech jargon in procurement context |
| 🔴 4 | Remove all **"Buyer/Supplier"** labels | Conflicts with no-role architecture |
| 🔴 5 | Replace **"Opportunity"** with "Tender" across welcome page | "Opportunity" is not procurement vocabulary |
| 🟡 6 | Replace **"Draft applications"** with "Draft Bids" | Procurement doesn't use "applications" for bids |
| 🟡 7 | Replace **"Revenue pipeline"** with "Contract Value Pipeline" | Sales jargon, not procurement |
| 🟡 8 | Replace **"Institutional Memory"** with "Contract History" | Academic language |
| 🟡 9 | Consider replacing **"eKYC"** with "Identity Verification" | Most procurement users don't know "eKYC" |
| 🟡 10 | Rename page routes to be role-neutral | `supplier-marketplace` → `marketplace` etc. |

> [!TIP]
> A simple find-and-replace for the top 5 items alone would dramatically improve the professionalism of the platform. These are the terms that would confuse a real procurement officer logging in for the first time.
