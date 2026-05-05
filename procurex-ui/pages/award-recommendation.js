// Award Recommendation Page Component

function renderAwardRecommendation() {
    return `
        <div class="main-layout">
            <!-- Sidebar -->
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>Award Recommendation</h3>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Construction of Rural Health Centers</div>
                </div>

                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="bid-evaluation">Back to Evaluation</a></li>
                    <li><a href="#" data-navigate="buyer-dashboard">Dashboard</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <!-- Main Content -->
            <div class="main-content">
                <div class="ranking-table">
                    <h3 style="margin-bottom: 20px;">Top Ranked Bidders</h3>

                    <div class="data-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Supplier</th>
                                    <th>Technical Score</th>
                                    <th>Financial Score</th>
                                    <th>Total Score</th>
                                    <th>Price (TZS)</th>
                                    <th>Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span class="badge badge-success">1st</span></td>
                                    <td>ABC Construction Ltd</td>
                                    <td>85%</td>
                                    <td>90%</td>
                                    <td style="font-weight: 600;">87.5%</td>
                                    <td>4,800,000,000</td>
                                    <td><input type="radio" name="winner" value="abc" checked></td>
                                </tr>
                                <tr>
                                    <td><span class="badge badge-info">2nd</span></td>
                                    <td>BuildRight Ltd</td>
                                    <td>92%</td>
                                    <td>82%</td>
                                    <td style="font-weight: 600;">88.4%</td>
                                    <td>4,650,000,000</td>
                                    <td><input type="radio" name="winner" value="buildright"></td>
                                </tr>
                                <tr>
                                    <td><span class="badge badge-warning">3rd</span></td>
                                    <td>Prime Contractors</td>
                                    <td>88%</td>
                                    <td>88%</td>
                                    <td style="font-weight: 600;">88.0%</td>
                                    <td>4,750,000,000</td>
                                    <td><input type="radio" name="winner" value="prime"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Notification & Templates -->
                <div class="award-form">
                    <h3 style="margin-bottom: 20px;">Notification & Award Letters</h3>

                    <div style="margin-bottom: 24px;">
                        <h4 style="margin-bottom: 16px;">Winner Notification Template</h4>
                        <div class="card">
                            <div style="margin-bottom: 12px;">
                                <label style="display: flex; align-items: center; gap: 8px;">
                                    <input type="checkbox" checked>
                                    <span>Send congratulatory email to winner</span>
                                </label>
                            </div>
                            <div style="margin-bottom: 12px;">
                                <label class="form-label">Subject Line</label>
                                <input type="text" class="form-input" value="Congratulations! You have been awarded the Construction of Rural Health Centers Tender">
                            </div>
                            <div style="margin-bottom: 12px;">
                                <label class="form-label">Email Body</label>
                                <textarea class="form-input" rows="6">Dear [Supplier Name],

We are pleased to inform you that your bid for the Construction of Rural Health Centers has been successful.

Tender Details:
- Tender ID: T001
- Contract Value: TZS 4,800,000,000
- Award Date: [Current Date]

Please contact us within 7 working days to commence contract finalization.

Best regards,
Procurement Department
Ministry of Health</textarea>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 24px;">
                        <h4 style="margin-bottom: 16px;">Unsuccessful Bidders Notification</h4>
                        <div class="card">
                            <div style="margin-bottom: 12px;">
                                <label style="display: flex; align-items: center; gap: 8px;">
                                    <input type="checkbox" checked>
                                    <span>Send notification emails to unsuccessful bidders</span>
                                </label>
                            </div>
                            <div style="margin-bottom: 12px;">
                                <label class="form-label">Subject Line</label>
                                <input type="text" class="form-input" value="Update on Construction of Rural Health Centers Tender">
                            </div>
                            <div style="margin-bottom: 12px;">
                                <label class="form-label">Email Body</label>
                                <textarea class="form-input" rows="6">Dear [Supplier Name],

Thank you for your interest and participation in the Construction of Rural Health Centers tender.

After careful evaluation, we regret to inform you that your bid was not successful on this occasion.

We encourage you to participate in future tenders that match your capabilities.

Best regards,
Procurement Department
Ministry of Health</textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Award Justification -->
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin-bottom: 16px;">Award Justification</h4>
                        <textarea class="form-input" rows="4" placeholder="Provide detailed justification for the award recommendation...">The award is recommended to ABC Construction Ltd based on their strong technical score of 85% and competitive financial proposal. Their extensive experience in healthcare construction projects, qualified project team, and reasonable pricing make them the best value proposition for this tender.</textarea>
                    </div>

                    <!-- Standstill Period -->
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin-bottom: 16px;">Standstill Period Configuration</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                            <div>
                                <label class="form-label">Standstill Period (Days)</label>
                                <input type="number" class="form-input" value="14" min="10" max="30">
                            </div>
                            <div>
                                <label class="form-label">Notification Date</label>
                                <input type="date" class="form-input" value="2026-06-30">
                            </div>
                            <div>
                                <label class="form-label">Contract Start Date</label>
                                <input type="date" class="form-input" value="2026-07-05">
                            </div>
                        </div>
                    </div>

                    <!-- Legal Notice -->
                    <div style="background: var(--primary-blue-light); padding: 16px; border-radius: 8px; border-left: 4px solid var(--primary-blue); margin-bottom: 24px;">
                        <h4 style="margin-bottom: 8px; color: var(--primary-blue);">Legal Notice</h4>
                        <p style="font-size: 14px; color: var(--text-primary); margin: 0;">
                            This award recommendation is subject to final approval by the Chief Procurement Officer.
                            All bidders will be notified of the outcome within the specified standstill period.
                            The successful bidder must provide performance guarantee within 7 days of contract signing.
                        </p>
                    </div>

                    <!-- Dispute Management -->
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin-bottom: 16px;">Dispute Management</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
                            <div class="card">
                                <h5 style="margin-bottom: 8px;">Dispute Resolution Period</h5>
                                <input type="number" class="form-input" value="30" min="14" max="90">
                                <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Days from award notification</div>
                            </div>
                            <div class="card">
                                <h5 style="margin-bottom: 8px;">Appeals Contact</h5>
                                <input type="email" class="form-input" value="appeals@health.go.tz">
                                <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Email for dispute submissions</div>
                            </div>
                        </div>
                    </div>

                    <!-- Smart Contract Draft -->
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin-bottom: 16px;">Smart Contract Draft</h4>
                        <div class="card">
                            <div style="margin-bottom: 16px;">
                                <label style="display: flex; align-items: center; gap: 8px;">
                                    <input type="checkbox" checked>
                                    <span>Generate smart contract with automatic milestone payments</span>
                                </label>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                                <div>
                                    <label class="form-label">Contract Value</label>
                                    <input type="text" class="form-input" value="TZS 4,800,000,000" readonly>
                                </div>
                                <div>
                                    <label class="form-label">Payment Milestones</label>
                                    <input type="number" class="form-input" value="4" min="1" max="10">
                                </div>
                                <div>
                                    <label class="form-label">Performance Bond (%)</label>
                                    <input type="number" class="form-input" value="10" min="5" max="20">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div style="display: flex; gap: 12px; justify-content: space-between; padding: 24px; background: var(--background); border-radius: 8px;">
                        <div style="display: flex; gap: 12px;">
                            <button class="btn btn-secondary">Save Draft</button>
                            <button class="btn btn-secondary">Export Report</button>
                        </div>
                        <div style="display: flex; gap: 12px;">
                            <button class="btn btn-secondary">Send for Approval</button>
                            <button class="btn btn-primary" data-navigate="contract-negotiation">Issue Intent to Award</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Register the page render function
if (window.app) {
    window.app.renderAwardRecommendation = renderAwardRecommendation;
}
