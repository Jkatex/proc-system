// Tender Publication Page Component

function renderTenderPublication() {
    return `
        <div class="main-layout">
            <!-- Sidebar -->
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>Publish Tender</h3>
                </div>

                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="create-tender">← Back to Create</a></li>
                    <li><a href="#" data-navigate="buyer-dashboard">Dashboard</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <!-- Main Content -->
            <div class="main-content">
                <div style="max-width: 1000px; margin: 0 auto;">
                    <h1 style="margin-bottom: 24px;">Final Preview & Publication</h1>

                    <!-- Preview Card -->
                    <div class="card" style="margin-bottom: 32px;">
                        <h3 style="margin-bottom: 20px;">Tender Preview</h3>

                        <div style="border: 1px solid var(--border); border-radius: 8px; padding: 24px;">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                                <div>
                                    <h4 style="font-size: 20px; margin-bottom: 8px;">Construction of Rural Health Centers</h4>
                                    <p style="color: var(--text-secondary);">Tender ID: T001</p>
                                </div>
                                <span class="badge badge-info">Draft</span>
                            </div>

                            <!-- Timeline Grid -->
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px;">
                                <div style="text-align: center; padding: 16px; background: var(--background); border-radius: 6px;">
                                    <div style="font-size: 18px; font-weight: 600; color: var(--primary-blue);">Jan 15</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Publication</div>
                                </div>
                                <div style="text-align: center; padding: 16px; background: var(--background); border-radius: 6px;">
                                    <div style="font-size: 18px; font-weight: 600; color: var(--primary-blue);">Feb 15</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Closing</div>
                                </div>
                                <div style="text-align: center; padding: 16px; background: var(--background); border-radius: 6px;">
                                    <div style="font-size: 18px; font-weight: 600; color: var(--primary-blue);">Feb 20</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Evaluation</div>
                                </div>
                                <div style="text-align: center; padding: 16px; background: var(--background); border-radius: 6px;">
                                    <div style="font-size: 18px; font-weight: 600; color: var(--primary-blue);">Feb 25</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Award</div>
                                </div>
                            </div>

                            <!-- BOQ Sample -->
                            <div style="margin-bottom: 24px;">
                                <h5 style="margin-bottom: 12px;">Bill of Quantities (Sample)</h5>
                                <div class="data-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Description</th>
                                                <th>Qty</th>
                                                <th>Unit</th>
                                                <th>Rate</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1.1</td>
                                                <td>Site preparation and clearing</td>
                                                <td>1000</td>
                                                <td>m²</td>
                                                <td>25,000</td>
                                                <td>25,000,000</td>
                                            </tr>
                                            <tr>
                                                <td>1.2</td>
                                                <td>Foundation excavation</td>
                                                <td>500</td>
                                                <td>m³</td>
                                                <td>45,000</td>
                                                <td>22,500,000</td>
                                            </tr>
                                            <tr>
                                                <td>...</td>
                                                <td>...</td>
                                                <td>...</td>
                                                <td>...</td>
                                                <td>...</td>
                                                <td>...</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Integrity Disclaimer -->
                            <div style="background: var(--primary-blue-light); padding: 16px; border-radius: 6px; border-left: 4px solid var(--primary-blue);">
                                <h5 style="margin-bottom: 8px; color: var(--primary-blue);">Integrity Notice</h5>
                                <p style="font-size: 14px; color: var(--text-primary); margin: 0;">
                                    This tender is conducted under the Public Procurement Act of Tanzania. All bids will be evaluated transparently,
                                    and the process is recorded on blockchain for complete auditability.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Visibility Model -->
                    <div class="card" style="margin-bottom: 32px;">
                        <h3 style="margin-bottom: 20px;">Visibility Model</h3>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                            <div style="border: 2px solid var(--primary-blue); border-radius: 8px; padding: 20px; text-align: center; cursor: pointer;">
                                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 12px; color: var(--primary-blue);">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"></path>
                                </svg>
                                <h4>Public Tender</h4>
                                <p style="font-size: 14px; color: var(--text-secondary);">Open to all registered suppliers</p>
                            </div>

                            <div style="border: 2px solid var(--border); border-radius: 8px; padding: 20px; text-align: center; cursor: pointer;">
                                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 12px;">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                                <h4>Restricted Tender</h4>
                                <p style="font-size: 14px; color: var(--text-secondary);">Invitation only, pre-qualified suppliers</p>
                            </div>

                            <div style="border: 2px solid var(--border); border-radius: 8px; padding: 20px; text-align: center; cursor: pointer;">
                                <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom: 12px;">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                                </svg>
                                <h4>Invitation Tender</h4>
                                <p style="font-size: 14px; color: var(--text-secondary);">Direct invitation to specific suppliers</p>
                            </div>
                        </div>
                    </div>

                    <!-- Approval Routing -->
                    <div class="card" style="margin-bottom: 32px;">
                        <h3 style="margin-bottom: 20px;">Approval Routing</h3>

                        <div style="space-y: 16px;">
                            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--background); border-radius: 6px;">
                                <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--success-green); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">1</div>
                                <div style="flex: 1;">
                                    <div style="font-weight: 500;">Procurement Officer</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Auto-approved (Creator)</div>
                                </div>
                                <span class="badge badge-success">Approved</span>
                            </div>

                            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--background); border-radius: 6px;">
                                <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary-blue); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">2</div>
                                <div style="flex: 1;">
                                    <div style="font-weight: 500;">Department Head</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Pending approval</div>
                                </div>
                                <span class="badge badge-warning">Pending</span>
                            </div>

                            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--background); border-radius: 6px;">
                                <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); font-weight: 600;">3</div>
                                <div style="flex: 1;">
                                    <div style="font-weight: 500;">Chief Procurement Officer</div>
                                    <div style="font-size: 12px; color: var(--text-secondary);">Final approval required</div>
                                </div>
                                <span class="badge badge-info">Waiting</span>
                            </div>
                        </div>
                    </div>

                    <!-- Risk Intelligence -->
                    <div class="card" style="margin-bottom: 32px;">
                        <h3 style="margin-bottom: 20px;">Risk Intelligence</h3>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                            <div style="text-align: center; padding: 20px; background: var(--success-green); color: white; border-radius: 8px;">
                                <div style="font-size: 24px; font-weight: 600; margin-bottom: 4px;">Low</div>
                                <div style="font-size: 14px;">Market Risk</div>
                            </div>
                            <div style="text-align: center; padding: 20px; background: var(--warning-amber); color: white; border-radius: 8px;">
                                <div style="font-size: 24px; font-weight: 600; margin-bottom: 4px;">Medium</div>
                                <div style="font-size: 14px;">Compliance Risk</div>
                            </div>
                            <div style="text-align: center; padding: 20px; background: var(--success-green); color: white; border-radius: 8px;">
                                <div style="font-size: 24px; font-weight: 600; margin-bottom: 4px;">Good</div>
                                <div style="font-size: 14px;">Supplier Interest</div>
                            </div>
                        </div>
                    </div>

                    <!-- Publish Button -->
                    <div style="text-align: center; padding: 32px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px;">
                        <h3 style="margin-bottom: 16px;">Ready to Publish?</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 24px;">
                            Once published, the tender will be visible to suppliers and the bidding process will begin.
                            You can still make changes until the first bid is received.
                        </p>
                        <button class="btn btn-primary" style="font-size: 18px; padding: 16px 32px;" data-navigate="tender-details">
                            Go Live & Publish Tender
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Register the page render function
if (window.app) {
    window.app.renderTenderPublication = renderTenderPublication;
}