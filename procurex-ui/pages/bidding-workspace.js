// Bidding Workspace Page Component (Supplier sealed bid flow)

function escapeBidWorkspaceHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getBidWorkspaceTender() {
    const selectedTender = typeof getProcurexSelectedTender === 'function'
        ? getProcurexSelectedTender()
        : mockData.tenders[0];
    if (selectedTender && !selectedTender.createdByCurrentUser) return selectedTender;

    const marketplaceTender = typeof getProcurexMarketplaceTenders === 'function'
        ? getProcurexMarketplaceTenders().find(tender => !tender.createdByCurrentUser)
        : null;
    return marketplaceTender || selectedTender || mockData.tenders[0];
}

function getBidWorkspaceProfile(tender) {
    if (typeof getCreateTenderTypeProfile === 'function') return getCreateTenderTypeProfile(tender);
    return {
        id: 'works',
        commercialName: 'BOQ',
        commercialTitle: 'BOQ Pricing',
        reviewLabel: 'Bid value',
        responseTitle: 'Technical Response',
        responseFields: ['Relevant experience', 'Methodology'],
        assuranceTitle: 'Samples',
        assuranceBadge: 'Optional',
        bidderPreparation: ['BOQ pricing', 'Work plan', 'Equipment and staff'],
        defaultItems: [{ item: '1.1', description: 'Tender line item', qty: 1, unit: 'Lot', rate: 0 }]
    };
}

function getBidWorkspaceCommercialItems(tender, profile) {
    const items = tender.commercialItems || tender.boqItems || profile.defaultItems || [];
    return items.length ? items : [{ item: '1.1', description: 'Tender requirement', qty: 1, unit: 'Lot', rate: tender.budget || 0 }];
}

function getBidWorkspaceAmount(items) {
    return items.reduce((total, item) => total + (parseCreateTenderNumber(item.qty) * parseCreateTenderNumber(item.rate)), 0);
}

function renderBidWorkspaceCommercialRows(items) {
    return items.map((item, index) => {
        const qty = parseCreateTenderNumber(item.qty) || 1;
        const rate = parseCreateTenderNumber(item.rate);
        const bidderRate = Math.round(rate * 0.98);
        return `
            <tr>
                <td>${escapeBidWorkspaceHtml(item.item || `${index + 1}.1`)}</td>
                <td>${escapeBidWorkspaceHtml(item.description || 'Tender requirement')}</td>
                <td>${escapeBidWorkspaceHtml(item.qty || 1)} ${escapeBidWorkspaceHtml(item.unit || 'Lot')}</td>
                <td><input class="form-input boq-input boq-number" type="number" min="0" step="1000" value="${bidderRate}" data-bid-rate aria-label="Bid rate or fee"></td>
                <td data-bid-line-amount>${formatCreateTenderMoney(qty * bidderRate)}</td>
            </tr>
        `;
    }).join('');
}

function renderBidPreparationCards(profile) {
    return (profile.bidderPreparation || []).map((item, index) => `
        <article class="review-card">
            <span>Preparation ${index + 1}</span>
            <strong>${escapeBidWorkspaceHtml(item)}</strong>
            <small>${profile.id === 'consultancy' && /financial/i.test(item) ? 'Keep financial proposal separate where required.' : 'Complete this before final submission.'}</small>
        </article>
    `).join('');
}

function renderBiddingWorkspace() {
    const tender = getBidWorkspaceTender();
    const profile = getBidWorkspaceProfile(tender);
    const commercialItems = getBidWorkspaceCommercialItems(tender, profile);
    const bidAmount = getBidWorkspaceAmount(commercialItems.map(item => ({ ...item, rate: Math.round(parseCreateTenderNumber(item.rate) * 0.98) })));
    const documents = tender.documents?.length ? tender.documents : profile.defaultAttachments?.map(item => item.text) || ['Tender document'];
    const responseFields = profile.responseFields || ['Technical response', 'Delivery approach'];
    const steps = [
        ['01', 'Access Tender', 'Login and review tender details'],
        ['02', 'Download Documents', 'Specs, ToR, BOQ, SOW, or templates'],
        ['03', 'Prepare Bid', `${profile.commercialName}, technical response, and evidence`],
        ['04', 'Submit Bid', 'Upload, price, declare, and seal'],
        ['05', 'Bid Closing', 'Deadline lock and receipt status']
    ];

    return `
        <div class="main-layout">
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>My Bids</h3>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">${escapeBidWorkspaceHtml(tender.title)}</div>
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="supplier-tender-detail">Tender Detail</a></li>
                    <li><a href="#" data-navigate="supplier-journey">Supplier Journey</a></li>
                    <li><a href="#" data-navigate="supplier-marketplace">Marketplace</a></li>
                    <li><a href="#" data-navigate="procurement-dashboard">Procurement Dashboard</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <div class="main-content">
                <div class="journey-page tender-wizard-page bid-flow-page">
                    <section class="journey-hero compact">
                        <div>
                            <span class="badge badge-info">${escapeBidWorkspaceHtml(tender.type)} bid</span>
                            <h1>Bid Submission</h1>
                            <p>${escapeBidWorkspaceHtml(tender.title)} / ${escapeBidWorkspaceHtml(tender.organization)}. Complete each card in sequence using the documents and requirements shown for this tender.</p>
                        </div>
                        <div class="hero-action-stack">
                            <button class="btn btn-secondary" type="button" data-bid-save-draft>Save Draft</button>
                            <button class="btn btn-primary" type="button" data-bid-jump-submit>Submit Bid</button>
                        </div>
                    </section>

                    <div class="wizard-shell" data-bid-wizard data-bid-tender-id="${escapeBidWorkspaceHtml(tender.id)}">
                        <aside class="wizard-rail">
                            ${steps.map((step, index) => `
                                <a href="#bid-step-${index + 1}" class="wizard-rail-step ${index === 0 ? 'active' : ''}" data-bid-step-index="${index}">
                                    <strong>${step[0]}</strong>
                                    <span>${step[1]}</span>
                                </a>
                            `).join('')}
                        </aside>

                        <div class="wizard-workspace">
                            <section class="journey-panel active" id="bid-step-1">
                                <div class="panel-heading"><div><span class="section-kicker">Step 1</span><h2>Access Tender</h2></div><span class="badge badge-success">Accessible</span></div>
                                <div class="record-summary">
                                    <div><span>Tender</span><strong>${escapeBidWorkspaceHtml(tender.title)}</strong></div>
                                    <div><span>Procurement type</span><strong>${escapeBidWorkspaceHtml(tender.type)}</strong></div>
                                    <div><span>Eligibility</span><strong>${escapeBidWorkspaceHtml(tender.eligibility)}</strong></div>
                                    <div><span>Submission deadline</span><strong>${escapeBidWorkspaceHtml(tender.closingDate)}</strong></div>
                                </div>
                            </section>

                            <section class="journey-panel" id="bid-step-2">
                                <div class="panel-heading"><div><span class="section-kicker">Step 2</span><h2>Download Documents</h2></div><span class="badge badge-success">${documents.length} files</span></div>
                                <div class="attachment-grid">
                                    ${documents.map(file => `<div class="attachment-card"><strong>${escapeBidWorkspaceHtml(file)}</strong><span>Mapped to ${escapeBidWorkspaceHtml(tender.type)} tender</span></div>`).join('')}
                                </div>
                                <div class="review-checklist">
                                    <div><strong>Envelope rule</strong><span>${profile.id === 'consultancy' ? 'Technical and financial proposals may be kept separate for QCBS/QBS workflows.' : 'Technical and financial responses are prepared for sealed submission.'}</span></div>
                                </div>
                            </section>

                            <section class="journey-panel" id="bid-step-3">
                                <div class="panel-heading"><div><span class="section-kicker">Step 3</span><h2>Prepare Bid</h2></div><span class="badge badge-warning">Draft</span></div>
                                <div class="review-summary-grid" style="margin-bottom: 20px;">
                                    ${renderBidPreparationCards(profile)}
                                </div>
                                <div class="form-grid two">
                                    <div class="form-group"><label class="form-label">${escapeBidWorkspaceHtml(responseFields[0])}</label><textarea class="form-input" rows="5">Response aligned to ${escapeBidWorkspaceHtml(tender.description)} with current capacity, controls, and delivery evidence.</textarea></div>
                                    <div class="form-group"><label class="form-label">${escapeBidWorkspaceHtml(responseFields[1])}</label><textarea class="form-input" rows="5">Detailed approach for ${escapeBidWorkspaceHtml(tender.type.toLowerCase())}, including schedule, resources, quality controls, and handover.</textarea></div>
                                </div>
                                <div class="data-table">
                                    <table>
                                        <thead><tr><th>Code</th><th>Requirement</th><th>Qty / Duration</th><th>Bid rate / fee</th><th>Amount</th></tr></thead>
                                        <tbody data-bid-commercial-body>${renderBidWorkspaceCommercialRows(commercialItems)}</tbody>
                                    </table>
                                </div>
                            </section>

                            <section class="journey-panel" id="bid-step-4">
                                <div class="panel-heading"><div><span class="section-kicker">Step 4</span><h2>Submit Bid</h2></div><span class="badge badge-info" data-bid-total>${formatCreateTenderMoney(bidAmount)}</span></div>
                                <div class="record-summary">
                                    <div><span>Bidder</span><strong>ABC Construction Ltd</strong></div>
                                    <div><span>${escapeBidWorkspaceHtml(profile.reviewLabel)}</span><strong data-bid-review-total>${formatCreateTenderMoney(bidAmount)}</strong></div>
                                    <div><span>Documents</span><strong>${documents.length} attached</strong></div>
                                    <div><span>Deadline</span><strong>${escapeBidWorkspaceHtml(tender.closingDate)}</strong></div>
                                </div>
                                <div class="confirm-action" data-confirm-control>
                                    <input type="checkbox" class="confirm-action-input" checked>
                                    <button type="button" class="confirm-action-button" data-confirm-toggle aria-pressed="true">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <path d="M20 6L9 17l-5-5"/>
                                        </svg>
                                        <span>Confirm bid declaration</span>
                                    </button>
                                    <p class="confirm-action-note" data-confirm-note>Confirm that this sealed bid is complete, accurate, and authorized for submission.</p>
                                </div>
                                <div class="submit-strip">
                                    <div>
                                        <strong>Ready to seal</strong>
                                        <span>The system will enforce the deadline and lock edits after bid closing.</span>
                                    </div>
                                    <button class="btn btn-primary" type="button" data-bid-submit>Submit Sealed Bid</button>
                                </div>
                            </section>

                            <section class="journey-panel" id="bid-step-5">
                                <div class="panel-heading"><div><span class="section-kicker">Step 5</span><h2>Bid Closing</h2></div><span class="badge badge-success">Receipt ready</span></div>
                                <div class="review-summary-grid">
                                    <article class="review-card">
                                        <span>Deadline lock</span>
                                        <strong>Auto-lock on ${escapeBidWorkspaceHtml(tender.closingDate)}</strong>
                                        <small>No edits are allowed after the closing deadline.</small>
                                    </article>
                                    <article class="review-card">
                                        <span>Receipt hash</span>
                                        <strong>0x9f24e7c2b8aa49f8a73c</strong>
                                        <small>Generated after sealed submission.</small>
                                    </article>
                                    <article class="review-card">
                                        <span>My Bids</span>
                                        <strong>Submitted / sealed</strong>
                                        <small>Withdraw or resubmit only before the deadline.</small>
                                    </article>
                                </div>
                                <div class="inline-actions" style="margin-top: 18px;">
                                    <button class="btn btn-secondary">Withdraw</button>
                                    <button class="btn btn-secondary">Resubmit</button>
                                    <button class="btn btn-primary" data-navigate="supplier-journey">View Outcome Center</button>
                                </div>
                            </section>

                            <div class="wizard-flow-controls" data-bid-flow-controls>
                                <button class="btn btn-secondary" type="button" data-bid-prev>Back</button>
                                <div class="wizard-flow-progress">
                                    <strong data-bid-progress>Step 1 of ${steps.length}</strong>
                                    <span data-bid-step-title>${escapeBidWorkspaceHtml(steps[0][1])}</span>
                                </div>
                                <button class="btn btn-primary" type="button" data-bid-next>Continue</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function initializeBiddingWorkspace() {
    const wizard = document.querySelector('[data-bid-wizard]');
    if (!wizard || wizard.dataset.ready === 'true') return;

    const storageKey = `procurex.bidWorkspace.${wizard.dataset.bidTenderId || 'selected'}.step`;
    const panels = Array.from(wizard.querySelectorAll('.wizard-workspace > .journey-panel'));
    const railSteps = Array.from(wizard.querySelectorAll('[data-bid-step-index]'));
    const previousButton = wizard.querySelector('[data-bid-prev]');
    const nextButton = wizard.querySelector('[data-bid-next]');
    const progressOutput = wizard.querySelector('[data-bid-progress]');
    const stepTitleOutput = wizard.querySelector('[data-bid-step-title]');
    let activeStepIndex = Number(localStorage.getItem(storageKey) || 0);

    const setActiveStep = (index) => {
        activeStepIndex = Math.min(Math.max(index, 0), panels.length - 1);
        panels.forEach((panel, panelIndex) => {
            const active = panelIndex === activeStepIndex;
            panel.classList.toggle('active', active);
            panel.setAttribute('aria-hidden', active ? 'false' : 'true');
        });
        railSteps.forEach((step, stepIndex) => {
            const active = stepIndex === activeStepIndex;
            step.classList.toggle('active', active);
            step.setAttribute('aria-current', active ? 'step' : 'false');
        });
        if (previousButton) previousButton.disabled = activeStepIndex === 0;
        if (nextButton) nextButton.hidden = activeStepIndex === panels.length - 1;
        if (progressOutput) progressOutput.textContent = `Step ${activeStepIndex + 1} of ${panels.length}`;
        if (stepTitleOutput) stepTitleOutput.textContent = railSteps[activeStepIndex]?.querySelector('span')?.textContent || '';
        localStorage.setItem(storageKey, String(activeStepIndex));
    };

    const refreshBidTotals = () => {
        let total = 0;
        wizard.querySelectorAll('[data-bid-commercial-body] tr').forEach((row) => {
            const rate = parseCreateTenderNumber(row.querySelector('[data-bid-rate]')?.value);
            const qty = parseCreateTenderNumber(row.children[2]?.textContent || '1') || 1;
            const amount = rate * qty;
            total += amount;
            const output = row.querySelector('[data-bid-line-amount]');
            if (output) output.textContent = formatCreateTenderMoney(amount);
        });
        wizard.querySelector('[data-bid-total]')?.replaceChildren(document.createTextNode(formatCreateTenderMoney(total)));
        wizard.querySelector('[data-bid-review-total]')?.replaceChildren(document.createTextNode(formatCreateTenderMoney(total)));
    };

    wizard.addEventListener('click', (event) => {
        const railStep = event.target?.closest('[data-bid-step-index]');
        if (railStep) {
            event.preventDefault();
            setActiveStep(Number(railStep.dataset.bidStepIndex));
            return;
        }

        const target = event.target?.closest('button');
        if (!target) return;

        if (target.matches('[data-bid-prev]')) {
            setActiveStep(activeStepIndex - 1);
            return;
        }

        if (target.matches('[data-bid-next]')) {
            setActiveStep(activeStepIndex + 1);
            return;
        }

        if (target.matches('[data-bid-jump-submit]')) {
            setActiveStep(3);
            return;
        }

        if (target.matches('[data-bid-save-draft]')) {
            localStorage.setItem(storageKey, String(activeStepIndex));
            alert('Bid draft saved.');
            return;
        }

        if (target.matches('[data-bid-submit]')) {
            localStorage.setItem(storageKey, String(4));
            setActiveStep(4);
            alert('Bid submitted successfully.');
        }
    });

    wizard.addEventListener('input', (event) => {
        if (event.target?.matches('[data-bid-rate]')) refreshBidTotals();
    });

    setActiveStep(activeStepIndex);
    refreshBidTotals();
    wizard.dataset.ready = 'true';
}

if (window.app) {
    window.app.renderBiddingWorkspace = renderBiddingWorkspace;
}

window.initializeBiddingWorkspace = initializeBiddingWorkspace;
