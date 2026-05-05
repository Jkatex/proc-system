// eKYC onboarding for first-time signed-in users.

function renderIAMVerification() {
    const selectedRole = mockData.eKycProfile?.role || mockData.currentRole || 'buyer';
    const account = mockData.pendingAccount || {};
    const profile = mockData.eKycProfile || {};

    return `
        <div class="ekyc-page">
            <div class="ekyc-shell">
                <aside class="ekyc-side">
                    <div class="ekyc-brand">
                        <span class="brand-mark">PX</span>
                        <div>
                            <strong>ProcureX eKYC</strong>
                            <span>Business verification</span>
                        </div>
                    </div>

                    <div class="ekyc-side-status">
                        <span class="badge badge-warning">New user</span>
                        <h2>Complete onboarding before platform access.</h2>
                        <p>Buyer and supplier accounts are verified against business details, procurement scope, signatures, and supporting documents.</p>
                    </div>

                    <ol class="ekyc-steps">
                        <li class="active"><span>1</span>Account type</li>
                        <li><span>2</span>Business profile</li>
                        <li><span>3</span>Procurement scope</li>
                        <li><span>4</span>Digital signature</li>
                        <li><span>5</span>Documents</li>
                    </ol>
                </aside>

                <main class="ekyc-main">
                    <div class="ekyc-header">
                        <div>
                            <span class="section-label">Secure onboarding</span>
                            <h1>Electronic Know Your Customer</h1>
                            <p>Submit your company identity, procurement focus, authority details, digital signature, and verification documents.</p>
                        </div>
                        <button class="btn btn-secondary" data-navigate="sign-in">Sign out</button>
                    </div>

                    <form class="ekyc-form" data-action="complete-ekyc">
                        <section class="ekyc-section">
                            <div class="ekyc-section-heading">
                                <span class="ekyc-step-badge">1</span>
                                <div>
                                    <h2>Select account type</h2>
                                    <p>Choose how this organization will participate on ProcureX.</p>
                                </div>
                            </div>

                            <div class="ekyc-role-grid">
                                <label class="ekyc-role-card ${selectedRole === 'buyer' ? 'selected' : ''}">
                                    <input type="radio" name="accountRole" value="buyer" ${selectedRole === 'buyer' ? 'checked' : ''} required>
                                    <span class="ekyc-role-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M3 7h18M6 7v13h12V7M9 7V4h6v3"/>
                                        </svg>
                                    </span>
                                    <strong>Buyer</strong>
                                    <small>Procures goods, works, and services through tenders.</small>
                                </label>

                                <label class="ekyc-role-card ${selectedRole === 'supplier' ? 'selected' : ''}">
                                    <input type="radio" name="accountRole" value="supplier" ${selectedRole === 'supplier' ? 'checked' : ''} required>
                                    <span class="ekyc-role-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M21 16V8l-9-5-9 5v8l9 5 9-5z"/>
                                            <path d="M3.3 7.5L12 12l8.7-4.5M12 22V12"/>
                                        </svg>
                                    </span>
                                    <strong>Supplier</strong>
                                    <small>Supplies products, services, or works to buyers.</small>
                                </label>
                            </div>
                        </section>

                        <section class="ekyc-section">
                            <div class="ekyc-section-heading">
                                <span class="ekyc-step-badge">2</span>
                                <div>
                                    <h2>Business and authorized person</h2>
                                    <p>These details identify the organization and the person signing on its behalf.</p>
                                </div>
                            </div>

                            <div class="ekyc-grid two">
                                <div class="form-group">
                                    <label class="form-label">Legal Business Name *</label>
                                    <input class="form-input" name="businessName" value="${profile.businessName || ''}" placeholder="Registered company name" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Registration Number *</label>
                                    <input class="form-input" name="registrationNumber" value="${profile.registrationNumber || ''}" placeholder="BRELA or authority number" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">TIN / VAT Number *</label>
                                    <input class="form-input" name="taxNumber" value="${profile.taxNumber || ''}" placeholder="Tax identification number" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Business License Number</label>
                                    <input class="form-input" name="licenseNumber" value="${profile.licenseNumber || ''}" placeholder="License or permit number">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Country *</label>
                                    <select class="form-input" name="country" required>
                                        <option value="Tanzania">Tanzania</option>
                                        <option value="Kenya">Kenya</option>
                                        <option value="Uganda">Uganda</option>
                                        <option value="Rwanda">Rwanda</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Region / City *</label>
                                    <input class="form-input" name="region" value="${profile.region || ''}" placeholder="Dar es Salaam" required>
                                </div>
                                <div class="form-group span-2">
                                    <label class="form-label">Physical Address *</label>
                                    <input class="form-input" name="address" value="${profile.address || ''}" placeholder="Street, building, ward, district" required>
                                </div>
                            </div>

                            <div class="ekyc-grid two">
                                <div class="form-group">
                                    <label class="form-label">Authorized Representative *</label>
                                    <input class="form-input" name="representativeName" value="${profile.representativeName || ''}" placeholder="Full name" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Job Title *</label>
                                    <input class="form-input" name="representativeTitle" value="${profile.representativeTitle || ''}" placeholder="Director, officer, owner" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Email *</label>
                                    <input type="email" class="form-input" name="representativeEmail" value="${account.email || ''}" placeholder="name@company.com" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Phone *</label>
                                    <input class="form-input" name="representativePhone" value="${account.phone || mockData.registrationDraft?.phone || ''}" placeholder="+255 XXX XXX XXX" required>
                                </div>
                            </div>
                        </section>

                        <section class="ekyc-section">
                            <div class="ekyc-section-heading">
                                <span class="ekyc-step-badge">3</span>
                                <div>
                                    <h2>Business line and products</h2>
                                    <p>Define procurement categories, products, services, capacity, and operating areas.</p>
                                </div>
                            </div>

                            <div class="ekyc-grid two">
                                <div class="form-group">
                                    <label class="form-label">Primary Business Line *</label>
                                    <select class="form-input" name="businessLine" required>
                                        <option value="">Select category</option>
                                        <option>Construction and civil works</option>
                                        <option>Medical and laboratory supplies</option>
                                        <option>ICT hardware and software</option>
                                        <option>Office supplies and furniture</option>
                                        <option>Transport and logistics</option>
                                        <option>Consultancy and professional services</option>
                                        <option>Energy and utilities</option>
                                        <option>Agriculture and food supplies</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Business Size *</label>
                                    <select class="form-input" name="businessSize" required>
                                        <option value="">Select size</option>
                                        <option>Micro enterprise</option>
                                        <option>Small business</option>
                                        <option>Medium business</option>
                                        <option>Large enterprise</option>
                                        <option>Government entity</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Annual Procurement / Bid Capacity *</label>
                                    <input class="form-input" name="annualCapacity" placeholder="TZS 500,000,000" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Preferred Regions *</label>
                                    <input class="form-input" name="deliveryRegions" placeholder="Dar es Salaam, Dodoma, Arusha" required>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Products and Services *</label>
                                <div class="chip-grid">
                                    ${[
                                        'Medical equipment',
                                        'Construction materials',
                                        'IT hardware',
                                        'Software licenses',
                                        'Consultancy services',
                                        'Office furniture',
                                        'Vehicles and fleet',
                                        'Maintenance services',
                                        'Food and agriculture',
                                        'Logistics services'
                                    ].map(item => `
                                        <label class="check-chip">
                                            <input type="checkbox" name="products" value="${item}">
                                            <span>${item}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="ekyc-grid two">
                                <div class="form-group">
                                    <label class="form-label">Special Requirements</label>
                                    <textarea class="form-input" name="requirements" rows="4" placeholder="Certifications, delivery constraints, framework agreements, or eligibility notes"></textarea>
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Bank / Payment Details</label>
                                    <textarea class="form-input" name="bankDetails" rows="4" placeholder="Bank name, account name, account number, branch"></textarea>
                                </div>
                            </div>

                            <div class="ekyc-declarations">
                                <label>
                                    <input type="checkbox" name="beneficialOwnership" required>
                                    <span>I confirm the declared owners and authorized representatives are accurate.</span>
                                </label>
                                <label>
                                    <input type="checkbox" name="antiCorruption" required>
                                    <span>I accept the anti-corruption, conflict-of-interest, and procurement integrity declaration.</span>
                                </label>
                            </div>
                        </section>

                        <section class="ekyc-section">
                            <div class="ekyc-section-heading">
                                <span class="ekyc-step-badge">4</span>
                                <div>
                                    <h2>Create digital signature</h2>
                                    <p>The signature links this eKYC submission to the authorized representative.</p>
                                </div>
                            </div>

                            <div class="signature-panel">
                                <div class="ekyc-grid two">
                                    <div class="form-group">
                                        <label class="form-label">Signer Name *</label>
                                        <input class="form-input" name="signatureName" placeholder="Type legal signer name" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Signer Title *</label>
                                        <input class="form-input" name="signatureTitle" placeholder="Director, procurement head" required>
                                    </div>
                                </div>

                                <div class="signature-preview" id="signature-preview">
                                    <span>Typed signature preview</span>
                                </div>

                                <label class="signature-consent">
                                    <input type="checkbox" name="signatureConsent" required>
                                    <span>I authorize ProcureX to use this digital signature for eKYC verification and procurement workflow consent.</span>
                                </label>
                            </div>
                        </section>

                        <section class="ekyc-section">
                            <div class="ekyc-section-heading">
                                <span class="ekyc-step-badge">5</span>
                                <div>
                                    <h2>Upload verification documents</h2>
                                    <p>Attach documents needed for business, tax, identity, and authority checks.</p>
                                </div>
                            </div>

                            <div class="ekyc-upload-grid">
                                ${[
                                    'Business registration certificate',
                                    'TIN / VAT certificate',
                                    'Tax clearance certificate',
                                    'Authorized representative ID',
                                    'Business license or permit',
                                    'Bank confirmation letter',
                                    'Product catalogue or procurement mandate',
                                    'Sector certification or compliance license'
                                ].map((documentName, index) => `
                                    <label class="upload-area ekyc-upload">
                                        <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01.88-7.9A5 5 0 0117.9 9H18a3 3 0 010 6h-1m-5-4v9m0-9l-3 3m3-3l3 3"/>
                                        </svg>
                                        <strong>${documentName}</strong>
                                        <span>PDF, JPG, or PNG</span>
                                        <small class="file-name">No file selected</small>
                                        <input type="file" name="document${index + 1}" accept=".pdf,.jpg,.jpeg,.png" hidden>
                                    </label>
                                `).join('')}
                            </div>
                        </section>

                        <div class="ekyc-actions">
                            <button type="button" class="btn btn-secondary" data-navigate="sign-in">Cancel</button>
                            <div>
                                <button type="button" class="btn btn-secondary" id="save-ekyc-draft">Save Draft</button>
                                <button type="submit" class="btn btn-primary">Submit eKYC</button>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    `;
}

function renderIamVerification() {
    return renderIAMVerification();
}

if (window.app) {
    window.app.renderIAMVerification = renderIAMVerification;
    window.app.renderIamVerification = renderIamVerification;
}
