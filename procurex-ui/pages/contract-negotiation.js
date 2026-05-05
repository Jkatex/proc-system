// Contract Negotiation Page Component

function renderContractNegotiation() {
    const negotiation = mockData.contractNegotiation;

    return `
        <div class="negotiation-layout">
            <!-- Main Content -->
            <div class="contract-content">
                <div style="margin-bottom: 24px;">
                    <h1 style="margin-bottom: 8px;">Contract Negotiation</h1>
                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                        <span class="badge badge-info">Draft Version 2.1</span>
                        <span style="font-size: 14px; color: var(--text-secondary);">Contract #${negotiation.contractId}</span>
                    </div>

                    <!-- Status Indicators -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px;">
                        <div style="text-align: center; padding: 16px; background: var(--success-green); color: white; border-radius: 8px;">
                            <div style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">OK</div>
                            <div style="font-size: 14px;">PO Matched</div>
                        </div>
                        <div style="text-align: center; padding: 16px; background: var(--success-green); color: white; border-radius: 8px;">
                            <div style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">OK</div>
                            <div style="font-size: 14px;">Budget Verified</div>
                        </div>
                        <div style="text-align: center; padding: 16px; background: var(--warning-amber); color: white; border-radius: 8px;">
                            <div style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">⏳</div>
                            <div style="font-size: 14px;">Signature Pending</div>
                        </div>
                    </div>
                </div>

                <!-- Contract Title -->
                <div style="text-align: center; margin-bottom: 32px;">
                    <h2>Contract Finalization</h2>
                    <p style="color: var(--text-secondary);">Formal Agreement for Construction of Rural Health Centers</p>
                </div>

                <!-- Contract Body -->
                <div class="card" style="margin-bottom: 32px;">
                    <h3 style="margin-bottom: 20px;">Formal Contract Agreement</h3>

                    <!-- Section 1 -->
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin-bottom: 12px;">1. Parties to the Agreement</h4>
                        <div style="background: var(--background); padding: 16px; border-radius: 6px; margin-bottom: 12px;">
                            <strong>Employer:</strong> Ministry of Health, United Republic of Tanzania<br>
                            <strong>Contractor:</strong> ABC Construction Ltd<br>
                            <strong>Contract Price:</strong> TZS 4,800,000,000 (Four Billion Eight Hundred Million Only)<br>
                            <strong>Contract Duration:</strong> 12 months from contract signing
                        </div>
                    </div>

                    <!-- Section 2 -->
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin-bottom: 12px;">2. Scope of Works</h4>
                        <div style="background: var(--background); padding: 16px; border-radius: 6px; margin-bottom: 12px;">
                            The Contractor shall construct 5 rural health centers in Dodoma region including:
                            <ul style="margin-top: 8px; margin-left: 20px;">
                                <li>Site preparation and foundation works</li>
                                <li>Structural construction (walls, roof, floors)</li>
                                <li>Electrical and plumbing installations</li>
                                <li>Medical equipment installation</li>
                                <li>Finishing works and landscaping</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Section 3 -->
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin-bottom: 12px;">3. Payment Terms</h4>
                        <div style="background: var(--background); padding: 16px; border-radius: 6px; margin-bottom: 12px;">
                            <div style="display: grid; grid-template-columns: 1fr auto; gap: 16px;">
                                <div>
                                    <strong>Milestone 1:</strong> Foundation completion (20%) - TZS 960,000,000<br>
                                    <strong>Milestone 2:</strong> Structural completion (30%) - TZS 1,440,000,000<br>
                                    <strong>Milestone 3:</strong> MEP completion (25%) - TZS 1,200,000,000<br>
                                    <strong>Milestone 4:</strong> Final completion (25%) - TZS 1,200,000,000
                                </div>
                                <div style="text-align: right;">
                                    <div style="color: var(--success-green); font-weight: 600;">Agreed</div>
                                    <div style="color: var(--text-secondary); font-size: 12px;">Last updated: 2 hours ago</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Digital Signature Panel -->
                <div class="card">
                    <h3 style="margin-bottom: 20px;">Digital Signatures</h3>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                        <!-- Buyer Signature -->
                        <div style="border: 2px solid var(--border); border-radius: 8px; padding: 20px; text-align: center;">
                            <h4 style="margin-bottom: 16px;">Procurement Officer</h4>
                            <div style="margin-bottom: 16px;">
                                <div style="width: 120px; height: 60px; border: 1px dashed var(--border); border-radius: 4px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary);">
                                    Signature Area
                                </div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Click to sign digitally</div>
                            </div>
                            <div style="margin-bottom: 12px;">
                                <input type="text" class="form-input" placeholder="Full Name" style="text-align: center;">
                            </div>
                            <div style="margin-bottom: 12px;">
                                <input type="text" class="form-input" placeholder="Position/Title" style="text-align: center;" value="Procurement Officer">
                            </div>
                            <button class="btn btn-primary">Apply Digital Signature</button>
                        </div>

                        <!-- Supplier Signature -->
                        <div style="border: 2px solid var(--border); border-radius: 8px; padding: 20px; text-align: center;">
                            <h4 style="margin-bottom: 16px;">Contractor Representative</h4>
                            <div style="margin-bottom: 16px;">
                                <div style="width: 120px; height: 60px; border: 1px dashed var(--border); border-radius: 4px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary);">
                                    Signature Area
                                </div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Click to sign digitally</div>
                            </div>
                            <div style="margin-bottom: 12px;">
                                <input type="text" class="form-input" placeholder="Full Name" style="text-align: center;">
                            </div>
                            <div style="margin-bottom: 12px;">
                                <input type="text" class="form-input" placeholder="Position/Title" style="text-align: center;" value="Managing Director">
                            </div>
                            <button class="btn btn-secondary" disabled>Waiting for Buyer</button>
                        </div>
                    </div>

                    <div style="margin-top: 24px; padding: 16px; background: var(--primary-blue-light); border-radius: 6px;">
                        <p style="font-size: 14px; color: var(--primary-blue); margin: 0;">
                            <strong>Digital signature audit:</strong> This agreement records signer identity, document hash, timestamp, and certificate metadata once both parties sign.
                            After signatures are complete, the contract moves to post-award milestone tracking.
                        </p>
                    </div>
                    <div class="inline-actions" style="margin-top: 20px;">
                        <button class="btn btn-secondary" data-navigate="award-recommendation">Back to Award</button>
                        <button class="btn btn-primary" data-navigate="post-award-tracking">Activate Contract Tracking</button>
                    </div>
                </div>
            </div>

            <!-- Chat Sidebar -->
            <div class="chat-sidebar">
                <h4 style="margin-bottom: 16px;">Negotiation Chat</h4>

                <!-- Messages -->
                <div class="chat-messages">
                    ${negotiation.messages.map(msg => `
                        <div style="margin-bottom: 16px; padding: 12px; background: ${msg.from === 'buyer' ? 'var(--primary-blue-light)' : 'var(--background)'}; border-radius: 8px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                <span style="font-weight: 500; font-size: 12px;">${msg.from === 'buyer' ? 'Procurement Officer' : 'ABC Construction'}</span>
                                <span style="font-size: 10px; color: var(--text-secondary);">${msg.timestamp}</span>
                            </div>
                            <p style="font-size: 14px; margin: 0;">${msg.message}</p>
                        </div>
                    `).join('')}
                </div>

                <!-- Input -->
                <div class="chat-input">
                    <div style="display: flex; gap: 8px;">
                        <input type="text" placeholder="Type your message..." style="flex: 1; border: 1px solid var(--border); border-radius: 4px; padding: 8px;">
                        <button class="btn btn-primary" style="padding: 8px 16px;">Send</button>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border);">
                    <h5 style="margin-bottom: 8px; font-size: 14px;">Quick Actions</h5>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <button class="btn btn-secondary" style="font-size: 12px; padding: 6px 12px;">Request Clarification</button>
                        <button class="btn btn-secondary" style="font-size: 12px; padding: 6px 12px;">Counter Proposal</button>
                        <button class="btn btn-secondary" style="font-size: 12px; padding: 6px 12px;">Accept Terms</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Register the page render function
if (window.app) {
    window.app.renderContractNegotiation = renderContractNegotiation;
}
