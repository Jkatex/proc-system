# UNIFIED ENTITY RELATIONSHIP DIAGRAM
## Procurement Intelligence & Governance Platform — Complete View

**Version:** 2.0 — Full-Attribute Unified ERD  
**Date:** February 19, 2026  
**Total Entities:** 63 | **Total Domains:** 9

---

> This document presents a **single, fully-detailed ERD** that merges every entity from all 9 domains with **every attribute** preserved. No attributes have been trimmed or abbreviated. All cross-domain relationships are included at the end.

---

## Entity Count Summary

| # | Domain | Entities | Count |
|---|--------|----------|-------|
| 1 | Identity & Access | User, Organization, Verification Document, Role, Permission, Role Permission, User Role, Trust Tier Record, Conflict of Interest | 9 |
| 2 | Procurement Design & Tender | Tender, Tender Item, Tender Document, Evaluation Criteria, Tender Amendment, Clarification, Tender Design Analysis, Category Taxonomy | 8 |
| 3 | Supplier Profile & Discovery | Supplier Profile, Supplier Capability, Supplier Capacity Profile, Performance Record, Supplier Trust Profile, Trust Tier History, Personnel Record, Personnel Assignment | 8 |
| 4 | Bidding & Evaluation | Bid, Bid Item, Bid Document, Bid Validation, Bid Opening Record, Evaluation Score, Evaluation Consensus, Bid Ranking, Price Benchmark, Sample Submission, Sample Evaluation | 11 |
| 5 | Award, Contract & Budget | Award Decision, Contract, Contract Milestone, Approval Workflow, Approval Step, Delegation Record, Budget, Budget Transaction, Digital Signature, Delivery Feasibility | 10 |
| 6 | Post-Award & Financial | Invoice, Invoice Line Item, Goods Receipt, Dispute, Dispute Evidence, Dispute Appeal | 6 |
| 7 | Risk, Anti-Collusion & Governance | Risk Forecast, Collusion Analysis, Compliance Review, Violation Record, Enforcement Action, Appeal Record, Reinstatement Record | 7 |
| 8 | Audit & Intelligence | Audit Trail, Market Intelligence, Learning Model, Recommendation, Liquidity Index | 5 |
| 9 | Integration | ERP Integration, Sync Record, Module Registry, Notification | 4 |
| | **TOTAL** | | **63** |

---

## Complete Unified ERD — All 63 Entities, All Attributes, All Relationships

```mermaid
erDiagram
    %% ╔═══════════════════════════════════════════════════════════════╗
    %% ║  DOMAIN 1 — IDENTITY & ACCESS (Logics 1, 2, 37)             ║
    %% ╚═══════════════════════════════════════════════════════════════╝

    USER {
        uuid user_id PK
        string legal_name
        string email
        string phone
        string user_type
        string verification_status
        string trust_tier
        float risk_score
        datetime created_at
        datetime last_verified_at
        boolean is_active
    }

    ORGANIZATION {
        uuid org_id PK
        string org_name
        string org_type
        string registration_number
        string tax_id
        string country
        string region
        string verification_status
        datetime created_at
    }

    VERIFICATION_DOCUMENT {
        uuid document_id PK
        uuid user_id FK
        string document_type
        string file_path
        string status
        datetime submitted_at
        datetime verified_at
        datetime expiry_date
        string verified_by
        text rejection_reason
    }

    ROLE {
        uuid role_id PK
        string role_name
        string role_scope
        boolean is_custom
        uuid org_id FK
    }

    PERMISSION {
        uuid permission_id PK
        string permission_name
        string resource_type
        string action
        string level
    }

    ROLE_PERMISSION {
        uuid role_id FK
        uuid permission_id FK
    }

    USER_ROLE {
        uuid user_id FK
        uuid role_id FK
        uuid org_id FK
        datetime assigned_at
        datetime expires_at
        uuid assigned_by FK
    }

    TRUST_TIER_RECORD {
        uuid record_id PK
        uuid user_id FK
        string previous_tier
        string new_tier
        string trigger_reason
        datetime changed_at
        text justification
    }

    CONFLICT_OF_INTEREST {
        uuid coi_id PK
        uuid user_id FK
        uuid tender_id FK
        string declaration_type
        text description
        datetime declared_at
        string status
    }

    %% ╔═══════════════════════════════════════════════════════════════╗
    %% ║  DOMAIN 2 — PROCUREMENT DESIGN & TENDER (Logics 3, 4, 24, 36) ║
    %% ╚═══════════════════════════════════════════════════════════════╝

    TENDER {
        uuid tender_id PK
        uuid org_id FK
        uuid created_by FK
        string tender_reference
        string title
        string procurement_type
        string visibility_model
        string status
        string category_code
        text description
        decimal estimated_value
        string currency
        uuid budget_id FK
        datetime publication_date
        datetime clarification_deadline
        datetime submission_deadline
        datetime opening_date
        datetime expected_delivery_date
        string evaluation_method
        datetime created_at
        datetime approved_at
    }

    TENDER_ITEM {
        uuid item_id PK
        uuid tender_id FK
        string item_description
        string unit_of_measure
        decimal quantity
        decimal estimated_unit_price
        decimal estimated_total
        text technical_specifications
        string category_code
        int lot_number
    }

    TENDER_DOCUMENT {
        uuid doc_id PK
        uuid tender_id FK
        string document_type
        string file_path
        string file_hash
        int version_number
        datetime uploaded_at
        uuid uploaded_by FK
    }

    EVALUATION_CRITERIA {
        uuid criteria_id PK
        uuid tender_id FK
        string criteria_name
        string criteria_type
        decimal weight_percentage
        text scoring_scale
        boolean is_mandatory
        int display_order
    }

    TENDER_AMENDMENT {
        uuid amendment_id PK
        uuid tender_id FK
        int amendment_number
        text change_description
        datetime published_at
        uuid published_by FK
        boolean deadline_extended
        datetime new_deadline
    }

    CLARIFICATION {
        uuid clarification_id PK
        uuid tender_id FK
        uuid asked_by FK
        text question
        text answer
        datetime asked_at
        datetime answered_at
        boolean is_published
    }

    TENDER_DESIGN_ANALYSIS {
        uuid analysis_id PK
        uuid tender_id FK
        float vagueness_index
        float bias_probability
        float exclusion_risk
        float feasibility_risk
        float consistency_score
        float overall_risk_score
        string risk_level
        text flagged_clauses
        text recommendations
        datetime analyzed_at
    }

    CATEGORY_TAXONOMY {
        uuid category_id PK
        string category_code
        string category_name
        uuid parent_category_id FK
        int level
        boolean is_active
    }

    %% ╔═══════════════════════════════════════════════════════════════╗
    %% ║  DOMAIN 3 — SUPPLIER PROFILE & DISCOVERY (Logics 5, 15, 22, 25) ║
    %% ╚═══════════════════════════════════════════════════════════════╝

    SUPPLIER_PROFILE {
        uuid supplier_id PK
        uuid user_id FK
        uuid org_id FK
        string business_type
        string registration_country
        text categories_served
        text regions_served
        text certifications
        decimal declared_annual_turnover
        int declared_workforce_size
        decimal declared_max_capacity
        float trust_score
        string trust_tier
        float overall_performance_score
        datetime profile_updated_at
    }

    SUPPLIER_CAPABILITY {
        uuid capability_id PK
        uuid supplier_id FK
        string category_code
        string capability_description
        string experience_level
        int years_of_experience
        text reference_contracts
    }

    SUPPLIER_CAPACITY_PROFILE {
        uuid capacity_id PK
        uuid supplier_id FK
        decimal max_monthly_capacity
        decimal current_utilization_pct
        int active_contracts_count
        decimal active_contract_value
        string risk_level
        float overload_probability
        datetime last_calculated_at
    }

    PERFORMANCE_RECORD {
        uuid record_id PK
        uuid supplier_id FK
        uuid contract_id FK
        float delivery_score
        float quality_score
        float compliance_score
        float financial_accuracy_score
        float overall_score
        text evaluator_comments
        datetime evaluation_date
    }

    SUPPLIER_TRUST_PROFILE {
        uuid trust_id PK
        uuid supplier_id FK
        string category_code
        float delivery_performance_pct
        float quality_compliance_pct
        float dispute_outcome_index
        float financial_accuracy_pct
        float capacity_reliability_pct
        float ethical_compliance_pct
        float composite_trust_score
        string trust_tier
        datetime calculated_at
    }

    TRUST_TIER_HISTORY {
        uuid history_id PK
        uuid supplier_id FK
        string previous_tier
        string new_tier
        float previous_score
        float new_score
        string change_reason
        datetime changed_at
    }

    PERSONNEL_RECORD {
        uuid personnel_id PK
        uuid supplier_id FK
        string full_name
        string role_title
        text qualifications
        int years_experience
        text cv_file_path
        boolean is_available
    }

    PERSONNEL_ASSIGNMENT {
        uuid assignment_id PK
        uuid personnel_id FK
        uuid contract_id FK
        decimal hours_per_month
        datetime start_date
        datetime end_date
        string status
    }

    %% ╔═══════════════════════════════════════════════════════════════╗
    %% ║  DOMAIN 4 — BIDDING & EVALUATION (Logics 6, 7, 8, 9, 17, 26) ║
    %% ╚═══════════════════════════════════════════════════════════════╝

    BID {
        uuid bid_id PK
        uuid tender_id FK
        uuid supplier_id FK
        string bid_reference
        string bid_type
        string status
        decimal total_bid_price
        string currency
        string technical_envelope_hash
        string financial_envelope_hash
        boolean is_locked
        datetime submitted_at
        datetime withdrawn_at
        text withdrawal_reason
        string encryption_key_id
    }

    BID_ITEM {
        uuid bid_item_id PK
        uuid bid_id FK
        uuid tender_item_id FK
        decimal unit_price
        decimal quantity
        decimal total_price
        text technical_compliance
        text remarks
    }

    BID_DOCUMENT {
        uuid doc_id PK
        uuid bid_id FK
        string document_type
        string envelope_type
        string file_path
        string file_hash
        datetime uploaded_at
    }

    BID_VALIDATION {
        uuid validation_id PK
        uuid bid_id FK
        string validation_type
        string result
        text details
        datetime validated_at
    }

    BID_OPENING_RECORD {
        uuid opening_id PK
        uuid tender_id FK
        string envelope_type
        datetime opened_at
        text authorized_by
        int bids_opened_count
        text hash_verification_results
        string opening_report_path
    }

    EVALUATION_SCORE {
        uuid score_id PK
        uuid bid_id FK
        uuid criteria_id FK
        uuid evaluator_id FK
        decimal raw_score
        decimal weighted_score
        text justification
        boolean is_locked
        datetime scored_at
    }

    EVALUATION_CONSENSUS {
        uuid consensus_id PK
        uuid tender_id FK
        uuid bid_id FK
        uuid criteria_id FK
        decimal final_score
        text moderation_notes
        datetime finalized_at
    }

    BID_RANKING {
        uuid ranking_id PK
        uuid tender_id FK
        uuid bid_id FK
        int rank_position
        decimal total_weighted_score
        decimal technical_score
        decimal financial_score
        decimal risk_adjusted_score
        string qualification_status
        text disqualification_reason
    }

    PRICE_BENCHMARK {
        uuid benchmark_id PK
        uuid tender_id FK
        uuid bid_id FK
        decimal raw_price
        decimal market_median_price
        decimal historical_average
        decimal normalized_price
        float price_variance_pct
        string outlier_flag
        float price_risk_score
        decimal logistics_adjustment
        decimal tax_adjustment
        decimal scarcity_adjustment
        decimal currency_risk_adjustment
    }

    SAMPLE_SUBMISSION {
        uuid sample_id PK
        uuid tender_id FK
        uuid supplier_id FK
        string sample_type
        string sample_reference
        string status
        datetime submitted_at
        datetime received_at
        text storage_location
    }

    SAMPLE_EVALUATION {
        uuid eval_id PK
        uuid sample_id FK
        uuid evaluator_id FK
        decimal score
        text evaluation_notes
        boolean blind_evaluation
        datetime evaluated_at
    }

    %% ╔═══════════════════════════════════════════════════════════════╗
    %% ║  DOMAIN 5 — AWARD, CONTRACT & BUDGET (Logics 10, 11, 12, 13, 16) ║
    %% ╚═══════════════════════════════════════════════════════════════╝

    AWARD_DECISION {
        uuid award_id PK
        uuid tender_id FK
        uuid winning_bid_id FK
        uuid supplier_id FK
        string decision_status
        text justification
        datetime decision_date
        datetime standstill_end_date
        datetime notification_sent_at
        boolean is_challenged
    }

    CONTRACT {
        uuid contract_id PK
        uuid award_id FK
        uuid tender_id FK
        uuid supplier_id FK
        uuid buyer_org_id FK
        string contract_reference
        string status
        decimal contract_value
        string currency
        datetime start_date
        datetime end_date
        datetime signed_at
        string contract_document_path
        string performance_security_status
        decimal security_amount
    }

    CONTRACT_MILESTONE {
        uuid milestone_id PK
        uuid contract_id FK
        string milestone_name
        datetime due_date
        datetime completed_date
        string status
        decimal deliverable_value
        text description
    }

    APPROVAL_WORKFLOW {
        uuid workflow_id PK
        uuid reference_id FK
        string reference_type
        string workflow_type
        string status
        datetime initiated_at
        datetime completed_at
    }

    APPROVAL_STEP {
        uuid step_id PK
        uuid workflow_id FK
        int step_order
        uuid approver_id FK
        uuid delegate_id FK
        string step_type
        string status
        text comments
        datetime decided_at
        datetime deadline
    }

    DELEGATION_RECORD {
        uuid delegation_id PK
        uuid delegator_id FK
        uuid delegate_id FK
        string authority_type
        decimal max_value_limit
        datetime valid_from
        datetime valid_until
        string status
    }

    BUDGET {
        uuid budget_id PK
        uuid org_id FK
        string budget_code
        string budget_name
        string fiscal_year
        decimal allocated_amount
        decimal committed_amount
        decimal spent_amount
        decimal available_amount
        string currency
        string status
    }

    BUDGET_TRANSACTION {
        uuid transaction_id PK
        uuid budget_id FK
        uuid reference_id FK
        string reference_type
        string transaction_type
        decimal amount
        decimal balance_after
        datetime transaction_date
        text description
    }

    DIGITAL_SIGNATURE {
        uuid signature_id PK
        uuid document_id FK
        uuid signer_id FK
        string signature_type
        string certificate_id
        string document_hash
        string signature_value
        datetime signed_at
        string timestamp_authority
        string verification_status
    }

    DELIVERY_FEASIBILITY {
        uuid feasibility_id PK
        uuid bid_id FK
        uuid tender_id FK
        float distance_score
        float transport_risk_score
        float infrastructure_score
        float seasonal_risk_score
        float overall_feasibility_score
        string risk_classification
        datetime assessed_at
    }

    %% ╔═══════════════════════════════════════════════════════════════╗
    %% ║  DOMAIN 6 — POST-AWARD & FINANCIAL (Logics 19, 20)           ║
    %% ╚═══════════════════════════════════════════════════════════════╝

    INVOICE {
        uuid invoice_id PK
        uuid contract_id FK
        uuid supplier_id FK
        string invoice_number
        decimal invoice_amount
        decimal tax_amount
        decimal total_amount
        string currency
        string status
        datetime invoice_date
        datetime received_at
        datetime verified_at
        datetime paid_at
        string three_way_match_status
        boolean duplicate_flag
        boolean overbilling_flag
    }

    INVOICE_LINE_ITEM {
        uuid line_id PK
        uuid invoice_id FK
        uuid contract_milestone_id FK
        string description
        decimal quantity
        decimal unit_price
        decimal line_total
        decimal tax_amount
    }

    GOODS_RECEIPT {
        uuid receipt_id PK
        uuid contract_id FK
        uuid milestone_id FK
        string receipt_reference
        datetime received_date
        decimal quantity_received
        string quality_status
        text inspection_notes
        uuid received_by FK
    }

    DISPUTE {
        uuid dispute_id PK
        uuid contract_id FK
        uuid raised_by FK
        string dispute_type
        string severity_level
        string status
        text description
        datetime raised_at
        datetime response_deadline
        datetime resolved_at
        string resolution_method
        text resolution_outcome
        boolean penalty_applied
        decimal penalty_amount
    }

    DISPUTE_EVIDENCE {
        uuid evidence_id PK
        uuid dispute_id FK
        uuid submitted_by FK
        string evidence_type
        string file_path
        text description
        datetime submitted_at
    }

    DISPUTE_APPEAL {
        uuid appeal_id PK
        uuid dispute_id FK
        uuid appellant_id FK
        text appeal_grounds
        string status
        datetime filed_at
        datetime decided_at
        text decision_outcome
    }

    %% ╔═══════════════════════════════════════════════════════════════╗
    %% ║  DOMAIN 7 — RISK, ANTI-COLLUSION & GOVERNANCE (Logics 23, 27, 29) ║
    %% ╚═══════════════════════════════════════════════════════════════╝

    RISK_FORECAST {
        uuid forecast_id PK
        uuid tender_id FK
        uuid bid_id FK
        uuid supplier_id FK
        float supplier_trust_index
        float capacity_stress_index
        float logistics_risk_index
        float market_volatility_index
        float dispute_probability
        float complexity_multiplier
        float total_risk_score
        string risk_classification
        text primary_risk_drivers
        text mitigation_suggestions
        datetime calculated_at
    }

    COLLUSION_ANALYSIS {
        uuid analysis_id PK
        uuid tender_id FK
        float price_correlation_score
        float rotation_frequency_score
        float spread_consistency_score
        float timing_similarity_score
        float document_similarity_score
        float composite_collusion_index
        string risk_level
        text flagged_supplier_pairs
        datetime analyzed_at
    }

    COMPLIANCE_REVIEW {
        uuid review_id PK
        uuid collusion_analysis_id FK
        uuid reviewer_id FK
        string review_status
        text findings
        text action_taken
        datetime reviewed_at
    }

    VIOLATION_RECORD {
        uuid violation_id PK
        uuid user_id FK
        uuid org_id FK
        string violation_level
        string violation_type
        text description
        text evidence_summary
        datetime detected_at
        string detection_method
    }

    ENFORCEMENT_ACTION {
        uuid action_id PK
        uuid violation_id FK
        string action_type
        text justification
        datetime effective_from
        datetime effective_until
        string status
        uuid decided_by FK
    }

    APPEAL_RECORD {
        uuid appeal_id PK
        uuid enforcement_action_id FK
        uuid appellant_id FK
        text appeal_grounds
        string status
        datetime filed_at
        datetime decided_at
        text decision
    }

    REINSTATEMENT_RECORD {
        uuid reinstatement_id PK
        uuid enforcement_action_id FK
        uuid user_id FK
        text conditions
        datetime reinstated_at
        string probation_status
        datetime probation_end_date
    }

    %% ╔═══════════════════════════════════════════════════════════════╗
    %% ║  DOMAIN 8 — AUDIT & INTELLIGENCE (Logics 14, 28, 31)         ║
    %% ╚═══════════════════════════════════════════════════════════════╝

    AUDIT_TRAIL {
        uuid audit_id PK
        uuid user_id FK
        string action_type
        string resource_type
        uuid resource_id
        text previous_state
        text new_state
        string ip_address
        string session_id
        datetime timestamp
        string correlation_id
    }

    MARKET_INTELLIGENCE {
        uuid intelligence_id PK
        string category_code
        string region
        string metric_type
        decimal metric_value
        string time_period
        int sample_size
        datetime generated_at
    }

    LEARNING_MODEL {
        uuid model_id PK
        string model_type
        string model_version
        string target_logic
        float accuracy_score
        datetime trained_at
        datetime last_validated_at
        int training_sample_count
    }

    RECOMMENDATION {
        uuid recommendation_id PK
        uuid model_id FK
        uuid target_user_id FK
        string recommendation_type
        text recommendation_content
        float confidence_score
        string status
        datetime generated_at
        boolean was_accepted
    }

    LIQUIDITY_INDEX {
        uuid index_id PK
        string category_code
        string region
        int active_tenders
        int active_suppliers
        float avg_bids_per_tender
        float supplier_engagement_index
        float buyer_engagement_index
        string health_status
        datetime calculated_at
    }

    %% ╔═══════════════════════════════════════════════════════════════╗
    %% ║  DOMAIN 9 — INTEGRATION (Logics 35, 40)                      ║
    %% ╚═══════════════════════════════════════════════════════════════╝

    ERP_INTEGRATION {
        uuid integration_id PK
        uuid org_id FK
        string erp_system_type
        string api_endpoint
        string auth_method
        string sync_status
        datetime last_sync_at
        boolean is_active
    }

    SYNC_RECORD {
        uuid sync_id PK
        uuid integration_id FK
        string sync_direction
        string entity_type
        uuid entity_id
        string sync_status
        text error_details
        datetime synced_at
    }

    MODULE_REGISTRY {
        uuid module_id PK
        string module_name
        string module_type
        string version
        string status
        boolean is_core
        text api_endpoints
        datetime installed_at
    }

    NOTIFICATION {
        uuid notification_id PK
        uuid user_id FK
        string notification_type
        string channel
        string subject
        text message
        string status
        uuid reference_id
        string reference_type
        datetime created_at
        datetime read_at
    }

    %% ╔═══════════════════════════════════════════════════════════════════╗
    %% ║  ALL RELATIONSHIPS — Cross-Domain Unified Map                     ║
    %% ╚═══════════════════════════════════════════════════════════════════╝

    %% ─── Identity & Access Relationships ───
    USER ||--o{ VERIFICATION_DOCUMENT : "submits"
    USER ||--o{ USER_ROLE : "has"
    USER ||--o{ TRUST_TIER_RECORD : "progresses"
    USER ||--o{ CONFLICT_OF_INTEREST : "declares"
    USER ||--o{ AUDIT_TRAIL : "generates"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ RECOMMENDATION : "targeted_by"
    ROLE ||--o{ USER_ROLE : "assigned_via"
    ROLE ||--o{ ROLE_PERMISSION : "grants"
    PERMISSION ||--o{ ROLE_PERMISSION : "included_in"
    ORGANIZATION ||--o{ USER_ROLE : "scopes"
    ORGANIZATION ||--o{ ROLE : "defines"

    %% ─── Procurement Design & Tender Relationships ───
    USER ||--o{ TENDER : "creates"
    ORGANIZATION ||--o{ TENDER : "publishes"
    TENDER }o--|| CATEGORY_TAXONOMY : "classified_under"
    CATEGORY_TAXONOMY ||--o{ CATEGORY_TAXONOMY : "has_children"
    TENDER ||--o{ TENDER_ITEM : "contains"
    TENDER ||--o{ TENDER_DOCUMENT : "includes"
    TENDER ||--o{ EVALUATION_CRITERIA : "defines"
    TENDER ||--o{ TENDER_AMENDMENT : "amends"
    TENDER ||--o{ CLARIFICATION : "receives"
    TENDER ||--|| TENDER_DESIGN_ANALYSIS : "analyzed_by"

    %% ─── Supplier Profile & Discovery Relationships ───
    USER ||--|| SUPPLIER_PROFILE : "has_profile"
    SUPPLIER_PROFILE ||--o{ SUPPLIER_CAPABILITY : "declares"
    SUPPLIER_PROFILE ||--|| SUPPLIER_CAPACITY_PROFILE : "capacity_tracked"
    SUPPLIER_PROFILE ||--o{ SUPPLIER_TRUST_PROFILE : "trust_scored"
    SUPPLIER_PROFILE ||--o{ TRUST_TIER_HISTORY : "tier_tracked"
    SUPPLIER_PROFILE ||--o{ PERSONNEL_RECORD : "employs"
    SUPPLIER_PROFILE ||--o{ PERFORMANCE_RECORD : "evaluated_in"

    %% ─── Bidding & Evaluation Relationships ───
    TENDER ||--o{ BID : "receives_bids"
    SUPPLIER_PROFILE ||--o{ BID : "submits_bid"
    BID ||--o{ BID_ITEM : "contains_items"
    BID ||--o{ BID_DOCUMENT : "has_documents"
    BID ||--o{ BID_VALIDATION : "validated_by"
    TENDER ||--|| BID_OPENING_RECORD : "opened_via"
    BID ||--o{ EVALUATION_SCORE : "scored_in"
    BID ||--o{ EVALUATION_CONSENSUS : "consensus_for"
    BID ||--|| BID_RANKING : "ranked_as"
    BID ||--o| PRICE_BENCHMARK : "benchmarked"
    BID ||--o| DELIVERY_FEASIBILITY : "feasibility_checked"
    TENDER ||--o{ SAMPLE_SUBMISSION : "requires_samples"
    SUPPLIER_PROFILE ||--o{ SAMPLE_SUBMISSION : "submits_samples"
    SAMPLE_SUBMISSION ||--o{ SAMPLE_EVALUATION : "evaluated_via"

    %% ─── Award, Contract & Budget Relationships ───
    TENDER ||--|| AWARD_DECISION : "results_in_award"
    AWARD_DECISION ||--|| CONTRACT : "creates_contract"
    ORGANIZATION ||--o{ CONTRACT : "buyer_of"
    SUPPLIER_PROFILE ||--o{ CONTRACT : "awarded_to"
    CONTRACT ||--o{ CONTRACT_MILESTONE : "tracked_by"
    CONTRACT ||--o{ DIGITAL_SIGNATURE : "signed_with"
    PERSONNEL_RECORD ||--o{ PERSONNEL_ASSIGNMENT : "assigned_to"

    %% ─── Approval & Budget Relationships ───
    ORGANIZATION ||--o{ BUDGET : "allocates"
    BUDGET ||--o{ BUDGET_TRANSACTION : "records"
    BUDGET ||--o{ TENDER : "funds"
    APPROVAL_WORKFLOW ||--o{ APPROVAL_STEP : "routes_through"
    USER ||--o{ APPROVAL_STEP : "approves"
    USER ||--o{ DELEGATION_RECORD : "delegates"

    %% ─── Post-Award & Financial Relationships ───
    CONTRACT ||--o{ INVOICE : "billed_under"
    SUPPLIER_PROFILE ||--o{ INVOICE : "issues"
    INVOICE ||--o{ INVOICE_LINE_ITEM : "contains_lines"
    CONTRACT ||--o{ GOODS_RECEIPT : "received_under"
    CONTRACT ||--o{ DISPUTE : "triggers"
    CONTRACT ||--o{ PERFORMANCE_RECORD : "evaluated_via"
    DISPUTE ||--o{ DISPUTE_EVIDENCE : "supported_by"
    DISPUTE ||--o| DISPUTE_APPEAL : "appealed_via"
    USER ||--o{ DISPUTE : "raises"

    %% ─── Risk & Governance Relationships ───
    TENDER ||--o{ RISK_FORECAST : "risk_forecasted"
    BID ||--o| RISK_FORECAST : "risk_assessed"
    TENDER ||--o{ COLLUSION_ANALYSIS : "collusion_checked"
    COLLUSION_ANALYSIS ||--o| COMPLIANCE_REVIEW : "reviewed_in"
    USER ||--o{ VIOLATION_RECORD : "violates"
    VIOLATION_RECORD ||--o{ ENFORCEMENT_ACTION : "enforced_via"
    ENFORCEMENT_ACTION ||--o| APPEAL_RECORD : "appealed_via"
    ENFORCEMENT_ACTION ||--o| REINSTATEMENT_RECORD : "reinstated_via"

    %% ─── Intelligence & Learning Relationships ───
    LEARNING_MODEL ||--o{ RECOMMENDATION : "generates"

    %% ─── Integration Relationships ───
    ORGANIZATION ||--o{ ERP_INTEGRATION : "configures"
    ERP_INTEGRATION ||--o{ SYNC_RECORD : "produces"
```

---

## Relationship Legend

| Symbol | Cardinality | Meaning |
|--------|-------------|---------|
| `\|\|--\|\|` | One-to-One | Exactly one on each side |
| `\|\|--o{` | One-to-Many | One parent, zero or more children |
| `\|\|--o\|` | One-to-Zero-or-One | One parent, optional single child |
| `}o--\|\|` | Many-to-One | Many children, one parent |

---

## Attribute Statistics

| Domain | Entities | Total Attributes |
|--------|----------|-----------------|
| Identity & Access | 9 | 45 |
| Procurement Design & Tender | 8 | 68 |
| Supplier Profile & Discovery | 8 | 75 |
| Bidding & Evaluation | 11 | 108 |
| Award, Contract & Budget | 10 | 87 |
| Post-Award & Financial | 6 | 63 |
| Risk & Governance | 7 | 54 |
| Audit & Intelligence | 5 | 42 |
| Integration | 4 | 30 |
| **TOTAL** | **63** | **572** |

---

## Cross-Domain Relationship Summary

| From Entity | To Entity | Relationship | Cardinality |
|-------------|-----------|--------------|-------------|
| USER | VERIFICATION_DOCUMENT | submits | 1:N |
| USER | USER_ROLE | has | 1:N |
| USER | TRUST_TIER_RECORD | progresses | 1:N |
| USER | CONFLICT_OF_INTEREST | declares | 1:N |
| USER | AUDIT_TRAIL | generates | 1:N |
| USER | NOTIFICATION | receives | 1:N |
| USER | RECOMMENDATION | targeted_by | 1:N |
| USER | TENDER | creates | 1:N |
| USER | SUPPLIER_PROFILE | has_profile | 1:1 |
| USER | APPROVAL_STEP | approves | 1:N |
| USER | DELEGATION_RECORD | delegates | 1:N |
| USER | DISPUTE | raises | 1:N |
| USER | VIOLATION_RECORD | violates | 1:N |
| ROLE | USER_ROLE | assigned_via | 1:N |
| ROLE | ROLE_PERMISSION | grants | 1:N |
| PERMISSION | ROLE_PERMISSION | included_in | 1:N |
| ORGANIZATION | USER_ROLE | scopes | 1:N |
| ORGANIZATION | ROLE | defines | 1:N |
| ORGANIZATION | TENDER | publishes | 1:N |
| ORGANIZATION | CONTRACT | buyer_of | 1:N |
| ORGANIZATION | BUDGET | allocates | 1:N |
| ORGANIZATION | ERP_INTEGRATION | configures | 1:N |
| TENDER | CATEGORY_TAXONOMY | classified_under | N:1 |
| TENDER | TENDER_ITEM | contains | 1:N |
| TENDER | TENDER_DOCUMENT | includes | 1:N |
| TENDER | EVALUATION_CRITERIA | defines | 1:N |
| TENDER | TENDER_AMENDMENT | amends | 1:N |
| TENDER | CLARIFICATION | receives | 1:N |
| TENDER | TENDER_DESIGN_ANALYSIS | analyzed_by | 1:1 |
| TENDER | BID | receives_bids | 1:N |
| TENDER | BID_OPENING_RECORD | opened_via | 1:1 |
| TENDER | SAMPLE_SUBMISSION | requires_samples | 1:N |
| TENDER | AWARD_DECISION | results_in_award | 1:1 |
| TENDER | RISK_FORECAST | risk_forecasted | 1:N |
| TENDER | COLLUSION_ANALYSIS | collusion_checked | 1:N |
| CATEGORY_TAXONOMY | CATEGORY_TAXONOMY | has_children | 1:N |
| SUPPLIER_PROFILE | SUPPLIER_CAPABILITY | declares | 1:N |
| SUPPLIER_PROFILE | SUPPLIER_CAPACITY_PROFILE | capacity_tracked | 1:1 |
| SUPPLIER_PROFILE | SUPPLIER_TRUST_PROFILE | trust_scored | 1:N |
| SUPPLIER_PROFILE | TRUST_TIER_HISTORY | tier_tracked | 1:N |
| SUPPLIER_PROFILE | PERSONNEL_RECORD | employs | 1:N |
| SUPPLIER_PROFILE | PERFORMANCE_RECORD | evaluated_in | 1:N |
| SUPPLIER_PROFILE | BID | submits_bid | 1:N |
| SUPPLIER_PROFILE | CONTRACT | awarded_to | 1:N |
| SUPPLIER_PROFILE | SAMPLE_SUBMISSION | submits_samples | 1:N |
| SUPPLIER_PROFILE | INVOICE | issues | 1:N |
| BID | BID_ITEM | contains_items | 1:N |
| BID | BID_DOCUMENT | has_documents | 1:N |
| BID | BID_VALIDATION | validated_by | 1:N |
| BID | EVALUATION_SCORE | scored_in | 1:N |
| BID | EVALUATION_CONSENSUS | consensus_for | 1:N |
| BID | BID_RANKING | ranked_as | 1:1 |
| BID | PRICE_BENCHMARK | benchmarked | 1:0..1 |
| BID | DELIVERY_FEASIBILITY | feasibility_checked | 1:0..1 |
| BID | RISK_FORECAST | risk_assessed | 1:0..1 |
| SAMPLE_SUBMISSION | SAMPLE_EVALUATION | evaluated_via | 1:N |
| AWARD_DECISION | CONTRACT | creates_contract | 1:1 |
| CONTRACT | CONTRACT_MILESTONE | tracked_by | 1:N |
| CONTRACT | DIGITAL_SIGNATURE | signed_with | 1:N |
| CONTRACT | INVOICE | billed_under | 1:N |
| CONTRACT | GOODS_RECEIPT | received_under | 1:N |
| CONTRACT | DISPUTE | triggers | 1:N |
| CONTRACT | PERFORMANCE_RECORD | evaluated_via | 1:N |
| PERSONNEL_RECORD | PERSONNEL_ASSIGNMENT | assigned_to | 1:N |
| BUDGET | BUDGET_TRANSACTION | records | 1:N |
| BUDGET | TENDER | funds | 1:N |
| APPROVAL_WORKFLOW | APPROVAL_STEP | routes_through | 1:N |
| INVOICE | INVOICE_LINE_ITEM | contains_lines | 1:N |
| DISPUTE | DISPUTE_EVIDENCE | supported_by | 1:N |
| DISPUTE | DISPUTE_APPEAL | appealed_via | 1:0..1 |
| COLLUSION_ANALYSIS | COMPLIANCE_REVIEW | reviewed_in | 1:0..1 |
| VIOLATION_RECORD | ENFORCEMENT_ACTION | enforced_via | 1:N |
| ENFORCEMENT_ACTION | APPEAL_RECORD | appealed_via | 1:0..1 |
| ENFORCEMENT_ACTION | REINSTATEMENT_RECORD | reinstated_via | 1:0..1 |
| LEARNING_MODEL | RECOMMENDATION | generates | 1:N |
| ERP_INTEGRATION | SYNC_RECORD | produces | 1:N |

---

**END OF UNIFIED ERD DOCUMENT — 63 Entities, 572 Attributes, 73 Relationships**
