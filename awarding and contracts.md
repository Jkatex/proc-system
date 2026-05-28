Yes. The **Awarding & Contracts** design should support **both sides**:

1. **Awarder / Buyer side** — the company that created the tender
2. **Awardee / Supplier side** — the company that was awarded the tender

The same page can serve both, but the fields and actions change depending on the user’s relationship to the tender.

# Main Page: Awarding & Contracts

When the user enters the module, the design can be like this:

```text
Awarding & Contracts

Manage award decisions, contract negotiation, signing, and post-award execution.

[Pending Awarding] [Awarded to you] [Contracts Pending Action] [Active Contracts] [Closed Contracts]
```

---

# 1. Pending Awarding Tab

This is for tenders **created by the company**.

The user here is acting as:

```text
Awarder / Buyer
```

## Table Design

```text
Pending Awarding
Tenders created by your company that require award or contract action.
```

| Field                | Meaning                                 |
| -------------------- | --------------------------------------- |
| Tender Title         | Name of the tender                      |
| Procurement Type     | Goods, works, services, consultancy     |
| Closing Date         | Tender closing date                     |
| Evaluation Status    | Pending, completed, approved            |
| Recommended Supplier | Highest ranked / selected bidder        |
| Award Status         | Not awarded, award pending, awarded     |
| Contract Status      | Not created, draft, negotiation, signed |
| Action               | Continue Award                          |

Example row:

```text
Tender: Supply of Laptops
Type: Goods
Evaluation Status: Completed
Recommended Supplier: TechWorld Ltd
Award Status: Pending Award Approval
Contract Status: Not Created
Action: Continue Award
```

When the buyer clicks **Continue Award**, they enter the **Buyer Awarding & Contract Flow**.

---

# 2. Awarded to you Tab

This is for tenders where the company was awarded.

The user here is acting as:

```text
Awardee / Supplier
```

## Table Design

```text
Awarded to you
Tenders awarded to your company by buyers.
```

| Field            | Meaning                                             |
| ---------------- | --------------------------------------------------- |
| Tender Title     | Tender won by this company                          |
| Buyer Name       | Organization that created the tender                |
| Procurement Type | Goods, works, services, consultancy                 |
| Award Value      | Amount awarded                                      |
| Award Status     | Received, accepted, declined                        |
| Contract Status  | Awaiting contract, under negotiation, ready to sign |
| Required Action  | Accept award, review contract, sign contract        |

Example row:

```text
Tender: Cleaning Services for Office Block
Buyer: ABC University
Award Value: 12,000,000 TZS
Award Status: Award Received
Contract Status: Awaiting Your Acceptance
Action: View Award
```

When supplier clicks **View Award**, they enter the **Supplier Awardee & Contract Flow**.

---

# Buyer / Awarder Side Design

This is for the company that created the tender.

The flow should be:

```text
Evaluation Result
   ↓
Award Decision
   ↓
Award Notification
   ↓
Supplier Acceptance
   ↓
Draft Contract
   ↓
Contract Negotiation
   ↓
Final Agreement
   ↓
Contract Signing
   ↓
Active Contract
```

---

# Buyer Step 1: Evaluation Result Screen

This screen shows the evaluation outcome before awarding.

## Design

```text
Awarding Workspace

Tender: Supply of Office Furniture
Procurement Type: Goods
Status: Evaluation Completed

[1 Evaluation Result] [2 Award Decision] [3 Notification] [4 Contract] [5 Negotiation] [6 Signing]
```

## Input / Display Fields

### Tender Summary

| Field                      | Type        |
| -------------------------- | ----------- |
| Tender title               | Auto-filled |
| Tender reference number    | Auto-filled |
| Procurement type           | Auto-filled |
| Closing date               | Auto-filled |
| Number of bids received    | Auto-filled |
| Evaluation status          | Auto-filled |
| Evaluation completion date | Auto-filled |

### Bidder Ranking Table

| Field              | Type        |
| ------------------ | ----------- |
| Supplier name      | Auto-filled |
| Technical score    | Auto-filled |
| Financial score    | Auto-filled |
| Total score        | Auto-filled |
| Rank               | Auto-filled |
| Responsiveness     | Auto-filled |
| Evaluation remarks | Auto-filled |

## Buyer Actions

```text
[View Bid Details]
[View Evaluation Report]
[Continue to Award Decision]
```

---

# Buyer Step 2: Award Decision Screen

This is where the buyer confirms the winning supplier.

## Input Fields

### Award Information

| Field                    | Type                          | Required |
| ------------------------ | ----------------------------- | -------- |
| Selected supplier        | Dropdown / auto-selected      | Yes      |
| Award amount             | Number / auto-filled from bid | Yes      |
| Currency                 | Dropdown                      | Yes      |
| Award decision date      | Date                          | Yes      |
| Award reason             | Long text                     | Yes      |
| Award conditions         | Long text                     | Optional |
| Negotiation required?    | Yes / No                      | Yes      |
| Internal approval note   | Long text                     | Optional |
| Authorized approver name | Text                          | Yes      |
| Approval checkbox        | Checkbox                      | Yes      |

## Example Design

```text
Award Decision

Selected Supplier
[TechWorld Ltd]

Award Amount
[25,000,000] [TZS]

Reason for Award
[Supplier had the highest evaluated score and met all technical and financial requirements.]

Award Conditions
[Supplier must submit performance security before contract signing.]

Negotiation Required?
[Yes] [No]

Authorized Representative
[ProcureX Company Admin]

[ ] I confirm that this award decision is based on the approved evaluation results.

[Approve Award Decision]
```

---

# Buyer Step 3: Award Notification Screen

After approving the award, the buyer sends notification to the winning supplier.

## Input Fields

| Field                              | Type      | Required |
| ---------------------------------- | --------- | -------- |
| Notification subject               | Text      | Yes      |
| Message to awarded supplier        | Long text | Yes      |
| Response deadline                  | Date      | Yes      |
| Required documents before contract | Checklist | Optional |
| Notify unsuccessful bidders?       | Yes / No  | Optional |
| Message to unsuccessful bidders    | Long text | Optional |

## Design

```text
Award Notification

Awarded Supplier
TechWorld Ltd

Subject
[Notice of Award - Supply of Office Furniture]

Message
[Your company has been selected for award subject to acceptance and contract finalization.]

Supplier Response Deadline
[Select Date]

Required Before Contract Signing
[ ] Performance security
[ ] Updated delivery schedule
[ ] Tax clearance
[ ] Insurance certificate
[ ] Bank details
[ ] Authorized signatory details

Notify Unsuccessful Bidders?
[Yes] [No]

[Send Award Notification]
```

---

# Buyer Step 4: Supplier Acceptance Status

This screen shows whether the supplier accepted or declined.

## Display Fields

| Field               | Type        |
| ------------------- | ----------- |
| Supplier response   | Auto-filled |
| Response date       | Auto-filled |
| Supplier message    | Auto-filled |
| Documents submitted | Auto-filled |
| Next action         | Auto-filled |

## Possible Statuses

```text
Awaiting Supplier Acceptance
Award Accepted
Award Declined
Clarification Requested
```

## Buyer Actions

If accepted:

```text
[Generate Draft Contract]
```

If declined:

```text
[Award Next Ranked Bidder]
[Cancel Award Process]
[Reopen Award Decision]
```

---

# Buyer Step 5: Draft Contract Creation

The buyer creates or reviews the draft contract.

## Contract Overview Fields

| Field                     | Type                              | Required |
| ------------------------- | --------------------------------- | -------- |
| Contract title            | Text                              | Yes      |
| Contract reference number | Auto-generated                    | Yes      |
| Buyer name                | Auto-filled                       | Yes      |
| Supplier name             | Auto-filled                       | Yes      |
| Tender reference          | Auto-filled                       | Yes      |
| Procurement type          | Auto-filled                       | Yes      |
| Contract value            | Auto-filled / editable if allowed | Yes      |
| Currency                  | Auto-filled                       | Yes      |
| Contract start date       | Date                              | Yes      |
| Contract end date         | Date                              | Yes      |
| Contract duration         | Auto-calculated                   | Yes      |

## Design

```text
Draft Contract

Contract Title
[Supply of Office Furniture Contract]

Contract Reference
[CTR-2026-0008]

Buyer
[ABC University]

Supplier
[TechWorld Ltd]

Contract Value
[25,000,000 TZS]

Start Date
[Select Date]

End Date
[Select Date]

[Save Draft Contract]
[Continue to Terms & Clauses]
```

---

# Buyer Step 6: Terms & Clauses Setup

This is where the buyer defines contract clauses.

Each clause should appear as a card.

## Clause Card Fields

| Field                         | Type      | Required           |
| ----------------------------- | --------- | ------------------ |
| Clause title                  | Text      | Yes                |
| Clause category               | Dropdown  | Yes                |
| Clause text                   | Long text | Yes                |
| Negotiable?                   | Yes / No  | Yes                |
| Locked reason                 | Text      | Required if locked |
| Supplier comment allowed?     | Yes / No  | Yes                |
| Supporting document required? | Yes / No  | Optional           |

## Clause Categories

```text
Scope of Contract
Contract Price
Payment Terms
Delivery Schedule
Inspection and Acceptance
Warranty / Defects Liability
Performance Security
Penalty / Liquidated Damages
Termination
Dispute Resolution
Confidentiality
Force Majeure
Signatures
```

## Design Example

```text
Clause: Payment Terms

Clause Category
[Payment Terms]

Clause Text
[Payment shall be made within 30 days after delivery acceptance and invoice approval.]

Negotiable?
[Yes] [No]

If No, reason:
[Payment period is based on buyer financial policy.]

Supplier Comment Allowed?
[Yes] [No]

[Save Clause]
```

---

# Buyer Step 7: Send Contract for Supplier Review

## Input Fields

| Field                           | Type      |
| ------------------------------- | --------- |
| Message to supplier             | Long text |
| Review deadline                 | Date      |
| Allow supplier change requests? | Yes / No  |
| Maximum negotiation rounds      | Number    |
| Attach documents                | Upload    |

## Design

```text
Send Contract for Review

Message to Supplier
[Please review the draft contract terms and submit any comments before the deadline.]

Review Deadline
[Select Date]

Allow Change Requests?
[Yes]

Maximum Negotiation Rounds
[3]

Attachments
[Upload Contract Attachments]

[Send to Supplier]
```

---

# Buyer Step 8: Contract Negotiation Screen

This is where buyer reviews supplier comments and change requests.

## Negotiation Table

| Field         | Meaning                                |
| ------------- | -------------------------------------- |
| Clause        | Which clause is being negotiated       |
| Requested by  | Supplier / buyer                       |
| Current text  | Existing clause wording                |
| Proposed text | Requested change                       |
| Reason        | Why change is requested                |
| Status        | Pending, accepted, rejected, countered |
| Action        | Review                                 |

## Buyer Review Fields

| Field                        | Type                      | Required            |
| ---------------------------- | ------------------------- | ------------------- |
| Decision                     | Accept / reject / counter | Yes                 |
| Buyer response note          | Long text                 | Yes                 |
| Counter-proposed clause text | Long text                 | Required if counter |
| Mark as final?               | Checkbox                  | Optional            |

## Design

```text
Negotiation Request

Clause
Delivery Schedule

Current Clause
[Delivery shall be completed within 14 days after contract signing.]

Supplier Proposed Change
[Delivery shall be completed within 21 days after contract signing.]

Supplier Reason
[Imported items require customs clearance.]

Buyer Decision
[Accept] [Reject] [Counter-Propose]

Counter-Proposed Text
[Delivery shall be completed within 18 days after contract signing.]

Buyer Response Note
[The buyer can allow extension but project timeline cannot exceed 18 days.]

[Submit Response]
```

---

# Buyer Step 9: Final Agreement and Lock Contract

Once both parties agree, the contract is locked for signing.

## Fields

| Field                        | Type           |
| ---------------------------- | -------------- |
| Final contract version       | Auto-generated |
| Final agreement note         | Long text      |
| Buyer confirmation checkbox  | Checkbox       |
| Supplier confirmation status | Auto-filled    |
| Lock contract button         | Button         |

## Design

```text
Final Agreement

Contract Version
Version 2.0 - Final Agreed Contract

Supplier Confirmation
Confirmed

Buyer Confirmation
[ ] I confirm that all negotiated terms and clauses are final.

Final Agreement Note
[Both parties have agreed to the final contract terms.]

[Lock Contract for Signature]
```

---

# Buyer Step 10: Buyer Signature

Usually supplier signs first, then buyer signs.

## Fields

| Field                          | Type           |
| ------------------------------ | -------------- |
| Signatory name                 | Text           |
| Signatory position             | Text           |
| Digital signature confirmation | Checkbox       |
| Signature date                 | Auto-filled    |
| Final contract PDF             | Auto-generated |

## Design

```text
Buyer Signature

Signatory Name
[John Michael]

Position
[Authorized Representative]

[ ] I confirm that I am authorized to sign this contract on behalf of the buyer.

[Sign Contract]
```

Once signed:

```text
Contract Active
```

---

# Supplier / Awardee Side Design

This is for the company that was awarded the tender.

The flow should be:

```text
View Award
   ↓
Accept / Decline Award
   ↓
Submit Pre-Contract Requirements
   ↓
Review Draft Contract
   ↓
Negotiate Clauses
   ↓
Confirm Final Terms
   ↓
Sign Contract
   ↓
Active Contract
```

---

# Supplier Step 1: Award Notification Screen

When supplier opens awarded tender:

## Display Fields

| Field              | Type        |
| ------------------ | ----------- |
| Tender title       | Auto-filled |
| Buyer name         | Auto-filled |
| Procurement type   | Auto-filled |
| Award value        | Auto-filled |
| Award date         | Auto-filled |
| Response deadline  | Auto-filled |
| Buyer message      | Auto-filled |
| Required documents | Auto-filled |

## Supplier Actions

```text
[Accept Award]
[Decline Award]
[Ask Clarification]
```

## Design

```text
Award Notification

Congratulations, your company has been selected for award.

Tender
Supply of Office Furniture

Buyer
ABC University

Award Value
25,000,000 TZS

Response Deadline
04 June 2026

Buyer Message
[Please accept the award and submit required documents before contract drafting.]

Required Documents
- Performance security
- Updated delivery schedule
- Bank details
- Authorized signatory details

[Accept Award] [Decline Award] [Ask Clarification]
```

---

# Supplier Step 2: Accept or Decline Award

## If Accepting Award

Input fields:

| Field                          | Type      | Required |
| ------------------------------ | --------- | -------- |
| Acceptance note                | Long text | Optional |
| Authorized representative name | Text      | Yes      |
| Confirmation checkbox          | Checkbox  | Yes      |

Design:

```text
Accept Award

Acceptance Note
[We accept the award and are ready to proceed to contract finalization.]

Authorized Representative
[Jane Peter]

[ ] I confirm that my company accepts this award and agrees to proceed to contract review.

[Submit Acceptance]
```

## If Declining Award

Input fields:

| Field                 | Type      | Required |
| --------------------- | --------- | -------- |
| Reason for decline    | Dropdown  | Yes      |
| Explanation           | Long text | Yes      |
| Confirmation checkbox | Checkbox  | Yes      |

Reasons:

```text
Unable to meet delivery timeline
Pricing no longer valid
Internal capacity issue
Cannot accept contract conditions
Other
```

---

# Supplier Step 3: Submit Pre-Contract Requirements

The supplier submits documents required before contract signing.

## Input Fields

| Field                            | Type                      |
| -------------------------------- | ------------------------- |
| Performance security document    | Upload                    |
| Updated delivery schedule        | Upload / structured dates |
| Tax document                     | Upload                    |
| Insurance document               | Upload                    |
| Bank details                     | Form                      |
| Authorized signatory name        | Text                      |
| Authorized signatory position    | Text                      |
| Signatory authorization document | Upload                    |
| Additional comments              | Long text                 |

## Design

```text
Pre-Contract Requirements

Performance Security
[Upload File]

Updated Delivery Schedule
[Upload File] or [Add Milestone]

Bank Name
[Enter Bank Name]

Account Name
[Enter Account Name]

Account Number
[Enter Account Number]

Authorized Signatory Name
[Enter Name]

Authorized Signatory Position
[Enter Position]

Authorization Document
[Upload File]

Additional Comment
[Enter comment]

[Submit Requirements]
```

---

# Supplier Step 4: Contract Review Screen

Supplier reviews the draft contract from the buyer.

## Contract Sections

```text
Contract Overview
Terms & Clauses
Negotiation
Documents
Signature
Activity Log
```

## Supplier Clause Review Fields

For each clause:

| Field                   | Type                              |
| ----------------------- | --------------------------------- |
| Clause title            | Auto-filled                       |
| Clause text             | Auto-filled                       |
| Negotiable status       | Auto-filled                       |
| Supplier decision       | Accept / request change / comment |
| Supplier comment        | Long text                         |
| Proposed clause wording | Long text                         |
| Reason for change       | Long text                         |
| Supporting document     | Upload                            |

## Design

```text
Clause Review

Clause: Delivery Schedule

Current Clause
[Delivery shall be completed within 14 days after contract signing.]

Negotiable
Yes

Your Decision
[Accept Clause] [Request Change] [Add Comment]

Proposed Change
[Delivery shall be completed within 21 days after contract signing.]

Reason
[The items require import clearance before final delivery.]

Supporting Document
[Upload File]

[Submit Clause Response]
```

---

# Supplier Step 5: Negotiation Response Screen

After buyer responds, supplier reviews buyer decision.

## Display Fields

| Field                     | Type        |
| ------------------------- | ----------- |
| Original clause           | Auto-filled |
| Supplier requested change | Auto-filled |
| Buyer decision            | Auto-filled |
| Buyer counter-proposal    | Auto-filled |
| Buyer reason              | Auto-filled |

## Supplier Actions

```text
[Accept Buyer Response]
[Counter Again]
[Withdraw Request]
```

## Design

```text
Buyer Response

Clause
Delivery Schedule

Your Requested Change
21 days after contract signing

Buyer Counter-Proposal
18 days after contract signing

Buyer Reason
The project must be completed before semester opening.

Your Action
[Accept Counter-Proposal] [Counter Again] [Withdraw Request]
```

---

# Supplier Step 6: Confirm Final Terms

Before signing, supplier confirms the final agreed contract.

## Fields

| Field                          | Type        |
| ------------------------------ | ----------- |
| Final contract version         | Auto-filled |
| Summary of agreed changes      | Auto-filled |
| Supplier confirmation checkbox | Checkbox    |
| Confirmation note              | Long text   |

## Design

```text
Final Terms Confirmation

Final Contract Version
Version 2.0

Summary of Changes
- Delivery changed from 14 days to 18 days
- Inspection period clarified as 5 working days
- Payment invoice requirements updated

[ ] I confirm that my company agrees to the final contract terms.

Confirmation Note
[We confirm the final terms and are ready for signing.]

[Confirm Final Terms]
```

---

# Supplier Step 7: Supplier Signature

## Fields

| Field                      | Type        |
| -------------------------- | ----------- |
| Signatory name             | Text        |
| Position                   | Text        |
| Digital signature checkbox | Checkbox    |
| Signature date             | Auto-filled |

## Design

```text
Supplier Signature

Signatory Name
[Jane Peter]

Position
[Managing Director]

[ ] I confirm that I am authorized to sign this contract on behalf of the supplier.

[Sign Contract]
```

After supplier signs:

```text
Awaiting Buyer Signature
```

After buyer signs:

```text
Contract Active
```

---

# Both Sides: Contract Workspace Design

Once a tender reaches contract stage, both buyer and supplier should see the same workspace, but actions differ.

```text
Contract Workspace

Contract: Supply of Office Furniture
Status: Under Negotiation
Your Role: Buyer / Supplier

[Overview] [Terms & Clauses] [Negotiation] [Documents] [Signatures] [Activity Log]
```

---

## Overview Tab Fields

| Field                   | Type        |
| ----------------------- | ----------- |
| Contract title          | Auto-filled |
| Contract reference      | Auto-filled |
| Tender reference        | Auto-filled |
| Buyer                   | Auto-filled |
| Supplier                | Auto-filled |
| Your role               | Auto-filled |
| Procurement type        | Auto-filled |
| Contract value          | Auto-filled |
| Start date              | Date        |
| End date                | Date        |
| Current status          | Auto-filled |
| Current action required | Auto-filled |

---

## Terms & Clauses Tab Fields

| Field           | Type           |
| --------------- | -------------- |
| Clause number   | Auto-generated |
| Clause title    | Text           |
| Clause category | Dropdown       |
| Clause text     | Long text      |
| Negotiable?     | Yes / No       |
| Locked reason   | Text           |
| Current status  | Auto-filled    |
| Last updated by | Auto-filled    |

Each clause can have status:

```text
Accepted
Commented
Change Requested
Buyer Countered
Supplier Countered
Rejected
Final Agreed
Locked
```

---

## Negotiation Tab Fields

| Field                 | Type                                     |
| --------------------- | ---------------------------------------- |
| Negotiation round     | Auto-generated                           |
| Clause                | Dropdown                                 |
| Raised by             | Auto-filled                              |
| Request type          | Comment / change request / counter-offer |
| Current clause text   | Auto-filled                              |
| Proposed clause text  | Long text                                |
| Reason for change     | Long text                                |
| Supporting attachment | Upload                                   |
| Response decision     | Accept / reject / counter                |
| Response note         | Long text                                |
| Status                | Auto-filled                              |

---

## Documents Tab Fields

| Field               | Type                          |
| ------------------- | ----------------------------- |
| Document type       | Dropdown                      |
| Document name       | Text                          |
| Upload file         | Upload                        |
| Uploaded by         | Auto-filled                   |
| Upload date         | Auto-filled                   |
| Verification status | Pending / accepted / rejected |
| Reviewer comment    | Long text                     |

Document types:

```text
Performance Security
Insurance Certificate
Tax Clearance
Bank Details
Delivery Schedule
Work Program
Technical Attachment
Signed Authorization
Contract Attachment
Other
```

---

## Signatures Tab Fields

| Field                       | Type        |
| --------------------------- | ----------- |
| Buyer signatory name        | Text        |
| Buyer signatory position    | Text        |
| Buyer signature status      | Auto-filled |
| Supplier signatory name     | Text        |
| Supplier signatory position | Text        |
| Supplier signature status   | Auto-filled |
| Final contract version      | Auto-filled |
| Signed date                 | Auto-filled |
| Download signed contract    | Button      |

---

## Activity Log Tab Fields

This should be automatic.

| Field            | Type             |
| ---------------- | ---------------- |
| Action           | Auto-filled      |
| Performed by     | Auto-filled      |
| Role             | Buyer / Supplier |
| Date and time    | Auto-filled      |
| Description      | Auto-filled      |
| Version affected | Auto-filled      |

Example:

```text
28 May 2026, 10:30 AM
Supplier requested change on Delivery Schedule clause.

28 May 2026, 12:05 PM
Buyer counter-proposed delivery period from 21 days to 18 days.

28 May 2026, 02:00 PM
Supplier accepted buyer counter-proposal.
```

---

# Contract Negotiation Rules in Design

The design should make it clear that some fields are locked and some are negotiable.

## Locked Fields Design

For locked fields, show:

```text
Locked
This term cannot be changed because it comes from the awarded tender or evaluation result.
```

Example:

```text
Awarded Supplier
TechWorld Ltd
[Locked]

Award Amount
25,000,000 TZS
[Locked]
```

## Negotiable Fields Design

For negotiable fields, show:

```text
Negotiable
You may comment or request changes before signing.
```

Example:

```text
Delivery Schedule
[Negotiable]

[Accept] [Request Change] [Comment]
```

---

# Final Both-Side Flow

## Buyer / Awarder

```text
Pending Awarding
   ↓
Open Tender
   ↓
View Evaluation Result
   ↓
Approve Award Decision
   ↓
Send Award Notification
   ↓
Supplier Accepts Award
   ↓
Generate Draft Contract
   ↓
Define Terms and Clauses
   ↓
Send Contract to Supplier
   ↓
Review Supplier Negotiation Requests
   ↓
Accept / Reject / Counter
   ↓
Lock Final Contract
   ↓
Wait for Supplier Signature
   ↓
Buyer Signs
   ↓
Contract Active
```

## Supplier / Awardee

```text
Awarded to you
   ↓
Open Award Notification
   ↓
Accept / Decline Award
   ↓
Submit Pre-Contract Requirements
   ↓
Review Draft Contract
   ↓
Accept Clauses / Request Changes
   ↓
Review Buyer Response
   ↓
Confirm Final Terms
   ↓
Sign Contract
   ↓
Wait for Buyer Signature
   ↓
Contract Active
```

---

# Best Simple Design Summary

Your **Awarding & Contracts** module should be designed like this:

```text
Awarding & Contracts
 ├── Pending Awarding
 │    └── Buyer path
 │         ├── Evaluation Result
 │         ├── Award Decision
 │         ├── Award Notification
 │         ├── Draft Contract
 │         ├── Contract Negotiation
 │         ├── Final Agreement
 │         └── Signing
 │
 ├── Awarded to you
 │    └── Supplier path
 │         ├── Award Notification
 │         ├── Award Acceptance
 │         ├── Pre-Contract Requirements
 │         ├── Contract Review
 │         ├── Contract Negotiation
 │         ├── Final Confirmation
 │         └── Signing
 │
 ├── Contracts Pending Action
 ├── Active Contracts
 └── Closed Contracts
```

The most important design rule is:

**The account is not permanently buyer or supplier. The tender decides the path. If the company created the tender, show buyer/awarder fields. If the company was awarded the tender, show supplier/awardee fields.**
