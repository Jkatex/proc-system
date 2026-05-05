// Post-Award Tracking Page Component

function renderPostAwardTracking() {
    const tracking = mockData.postAwardTracking;

    return `
        <div class="main-layout">
            <!-- Sidebar -->
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>Post-Award Tracking</h3>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Contract #${tracking.contractId}</div>
                </div>

                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="contract-negotiation">← Back to Negotiation</a></li>
                    <li><a href="#" data-navigate="buyer-dashboard">Dashboard</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <!-- Main Content -->
            <div class="main-content">
                <div class="tracking-content">
                    <!-- Main Content -->
                    <div class="tracking-main">
                        <!-- Contract Header -->
                        <div class="tracking-header">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 24px;">
                                <div>
                                    <h1>Contract #${tracking.contractId}</h1>
                                    <p style="color: var(--text-secondary); margin-top: 4px;">Construction of Rural Health Centers • ABC Construction Ltd</p>
                                </div>
                                <span class="badge badge-info">${tracking.status}</span>
                            </div>

                            <!-- Progress Overview -->
                            <div class="card" style="margin-bottom: 24px;">
                                <h3 style="margin-bottom: 16px;">Delivery Fulfillment Progress</h3>
                                <div style="margin-bottom: 16px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                        <span>Overall Progress</span>
                                        <span style="font-weight: 600;">${tracking.progress}%</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${tracking.progress}%"></div>
                                    </div>
                                </div>

                                <!-- Timeline -->
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px;">
                                    <div style="text-align: center; padding: 12px; background: var(--success-green); color: white; border-radius: 6px;">
                                        <div style="font-size: 14px; font-weight: 600;">Award</div>
                                        <div style="font-size: 12px;">Feb 25, 2024</div>
                                    </div>
                                    <div style="text-align: center; padding: 12px; background: var(--success-green); color: white; border-radius: 6px;">
                                        <div style="font-size: 14px; font-weight: 600;">Dispatch</div>
                                        <div style="font-size: 12px;">Mar 15, 2024</div>
                                    </div>
                                    <div style="text-align: center; padding: 12px; background: var(--warning-amber); color: white; border-radius: 6px;">
                                        <div style="font-size: 14px; font-weight: 600;">Transit</div>
                                        <div style="font-size: 12px;">Apr 15, 2024</div>
                                    </div>
                                    <div style="text-align: center; padding: 12px; background: var(--border); color: var(--text-secondary); border-radius: 6px;">
                                        <div style="font-size: 14px; font-weight: 600;">Closure</div>
                                        <div style="font-size: 12px;">May 15, 2024</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Fulfillment Tabs -->
                        <div class="fulfillment-tabs">
                            <div class="tabs">
                                <div class="tab active" data-tab="grn">GRN & Acceptance</div>
                                <div class="tab" data-tab="billing">Billing & Invoices</div>
                            </div>
                        </div>

                        <!-- Tab Content -->
                        <div class="tab-content" data-tab="grn" style="display: block;">
                            <div class="card">
                                <h3 style="margin-bottom: 16px;">Goods Receipt Notes & Acceptance</h3>

                                <div class="data-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Milestone</th>
                                                <th>Description</th>
                                                <th>Scheduled Date</th>
                                                <th>Actual Date</th>
                                                <th>Status</th>
                                                <th>GRN #</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Milestone 1</td>
                                                <td>Foundation and structural completion</td>
                                                <td>Mar 15, 2024</td>
                                                <td>Mar 12, 2024</td>
                                                <td><span class="badge badge-success">Accepted</span></td>
                                                <td>GRN-2024-001</td>
                                                <td>
                                                    <button class="btn btn-secondary" style="font-size: 12px; padding: 4px 8px;">View</button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Milestone 2</td>
                                                <td>MEP installations</td>
                                                <td>Apr 15, 2024</td>
                                                <td>Apr 18, 2024</td>
                                                <td><span class="badge badge-warning">Under Review</span></td>
                                                <td>GRN-2024-002</td>
                                                <td>
                                                    <button class="btn btn-secondary" style="font-size: 12px; padding: 4px 8px;">Review</button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Milestone 3</td>
                                                <td>Finishing works</td>
                                                <td>May 15, 2024</td>
                                                <td>-</td>
                                                <td><span class="badge badge-info">Pending</span></td>
                                                <td>-</td>
                                                <td>
                                                    <button class="btn btn-secondary" style="font-size: 12px; padding: 4px 8px;">Schedule</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div class="tab-content" data-tab="billing" style="display: none;">
                            <div class="card">
                                <h3 style="margin-bottom: 16px;">Billing & Invoice Management</h3>

                                <div class="data-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Invoice #</th>
                                                <th>Milestone</th>
                                                <th>Amount</th>
                                                <th>Issue Date</th>
                                                <th>Due Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>INV-2024-001</td>
                                                <td>Milestone 1</td>
                                                <td>TZS 960,000</td>
                                                <td>Mar 15, 2024</td>
                                                <td>Apr 15, 2024</td>
                                                <td><span class="badge badge-success">Paid</span></td>
                                                <td>
                                                    <button class="btn btn-secondary" style="font-size: 12px; padding: 4px 8px;">View</button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>INV-2024-002</td>
                                                <td>Milestone 2</td>
                                                <td>TZS 1,440,000</td>
                                                <td>Apr 20, 2024</td>
                                                <td>May 20, 2024</td>
                                                <td><span class="badge badge-warning">Pending Approval</span></td>
                                                <td>
                                                    <button class="btn btn-secondary" style="font-size: 12px; padding: 4px 8px;">Approve</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div class="tracking-sidebar">
                        <!-- Supplier Performance -->
                        <div class="card" style="margin-bottom: 24px;">
                            <h4 style="margin-bottom: 16px;">Supplier Performance</h4>

                            <div style="space-y: 12px;">
                                <div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                        <span style="font-size: 14px;">Delivery</span>
                                        <span style="font-size: 14px; font-weight: 600;">${tracking.supplierPerformance.delivery}%</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${tracking.supplierPerformance.delivery}%"></div>
                                    </div>
                                </div>

                                <div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                        <span style="font-size: 14px;">Quality</span>
                                        <span style="font-size: 14px; font-weight: 600;">${tracking.supplierPerformance.quality}%</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${tracking.supplierPerformance.quality}%"></div>
                                    </div>
                                </div>

                                <div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                        <span style="font-size: 14px;">Communication</span>
                                        <span style="font-size: 14px; font-weight: 600;">${tracking.supplierPerformance.communication}%</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${tracking.supplierPerformance.communication}%"></div>
                                    </div>
                                </div>

                                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border);">
                                    <div style="text-align: center;">
                                        <div style="font-size: 24px; font-weight: 600; color: var(--primary-blue); margin-bottom: 4px;">${tracking.supplierPerformance.overall}%</div>
                                        <div style="font-size: 12px; color: var(--text-secondary);">Overall Rating</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Supplier Health -->
                        <div class="card" style="margin-bottom: 24px;">
                            <h4 style="margin-bottom: 16px;">Supplier Health Card</h4>

                            <div style="space-y: 12px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span>Trust Score</span>
                                    <span class="badge badge-success">${tracking.supplierHealth.trustScore}/100</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span>Risk Level</span>
                                    <span class="badge badge-success">${tracking.supplierHealth.riskLevel}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span>Last Audit</span>
                                    <span style="font-size: 12px;">${tracking.supplierHealth.lastAudit}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Active Disputes -->
                        <div class="card">
                            <h4 style="margin-bottom: 16px;">Active Disputes</h4>

                            ${tracking.disputes.length > 0 ? `
                                <div style="space-y: 12px;">
                                    ${tracking.disputes.map(dispute => `
                                        <div style="padding: 12px; background: var(--background); border-radius: 6px;">
                                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                                <span style="font-weight: 500; font-size: 14px;">${dispute.title}</span>
                                                <span class="badge badge-${dispute.priority === 'high' ? 'error' : dispute.priority === 'medium' ? 'warning' : 'info'}">${dispute.priority}</span>
                                            </div>
                                            <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">Status: ${dispute.status}</div>
                                            <button class="btn btn-secondary" style="font-size: 12px; padding: 4px 8px; width: 100%;">View Details</button>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : `
                                <p style="color: var(--text-secondary); font-size: 14px;">No active disputes</p>
                            `}

                            <button class="btn btn-secondary" style="width: 100%; margin-top: 16px;">Report Issue</button>
                        </div>

                        <!-- Institutional Memory -->
                        <div class="card" style="margin-top: 24px;">
                            <h4 style="margin-bottom: 16px;">Institutional Memory</h4>
                            <div style="space-y: 8px;">
                                <div style="padding: 8px; background: var(--background); border-radius: 4px; font-size: 12px;">
                                    Contract signed on Feb 25, 2024
                                </div>
                                <div style="padding: 8px; background: var(--background); border-radius: 4px; font-size: 12px;">
                                    Milestone 1 completed Mar 12, 2024
                                </div>
                                <div style="padding: 8px; background: var(--background); border-radius: 4px; font-size: 12px;">
                                    Payment released Mar 20, 2024
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Register the page render function
if (window.app) {
    window.app.renderPostAwardTracking = renderPostAwardTracking;
}