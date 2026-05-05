// Admin Dashboard Page Component

function renderAdminDashboard() {
    const kpis = mockData.kpis.admin;

    return `
        <div class="main-layout">
            <!-- Sidebar -->
            <div class="sidebar">
                <div style="padding: 0 16px 20px;">
                    <h3>ProcureX Admin</h3>
                </div>

                <ul class="sidebar-nav">
                    <li><a href="#" data-navigate="admin-dashboard" class="active">Dashboard</a></li>
                    <li><a href="#" data-navigate="coming-soon">IAM/Verify</a></li>
                    <li><a href="#" data-navigate="coming-soon">System Logs</a></li>
                    <li><a href="#" data-navigate="welcome">Logout</a></li>
                </ul>
            </div>

            <!-- Main Content -->
            <div class="main-content">
                <div class="header">
                    <h1>Admin Control Room</h1>
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <span>Welcome, Admin</span>
                        <button class="btn btn-secondary">Settings</button>
                    </div>
                </div>

                <!-- KPI Cards -->
                <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 24px;">
                    <div class="kpi-card">
                        <div class="kpi-value">${kpis.activeUsers}</div>
                        <div class="kpi-label">ACTIVE USERS</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">${kpis.pendingVerifications}</div>
                        <div class="kpi-label">PENDING VERIFY</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">${kpis.supportTickets}</div>
                        <div class="kpi-label">SUPPORT TICKETS</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-value">${kpis.systemUptime}%</div>
                        <div class="kpi-label">SYSTEM UPTIME</div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="tabs">
                    <div class="tab active" data-tab="overview">Overview</div>
                    <div class="tab" data-tab="verification">Verification Queue</div>
                    <div class="tab" data-tab="rules">Platform Rules</div>
                    <div class="tab" data-tab="audit">Audit Logs</div>
                </div>

                <!-- Tab Content -->
                <div class="tab-content" data-tab="overview" style="display: block;">
                    <div class="grid" style="grid-template-columns: 2fr 1fr; gap: 24px;">
                        <!-- Platform Activity Chart -->
                        <div class="chart-container">
                            <h3 style="margin-bottom: 16px;">Platform Activity Growth</h3>
                            <canvas id="admin-activity-chart" width="400" height="200"></canvas>
                        </div>

                        <!-- System Health -->
                        <div class="card">
                            <h3 style="margin-bottom: 16px;">System Health</h3>
                            <div style="space-y: 12px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span>API Gateway</span>
                                    <span class="badge badge-success">Healthy</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span>Database</span>
                                    <span class="badge badge-success">Healthy</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span>Blockchain Node</span>
                                    <span class="badge badge-warning">Degraded</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span>File Storage</span>
                                    <span class="badge badge-success">Healthy</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span>Notification Service</span>
                                    <span class="badge badge-error">Down</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tab-content" data-tab="verification" style="display: none;">
                    <div class="card">
                        <h3 style="margin-bottom: 16px;">Pending Verifications</h3>
                        <div class="data-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Organization</th>
                                        <th>Role</th>
                                        <th>Submitted</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>john.doe@gov.tz</td>
                                        <td>Ministry of Health</td>
                                        <td>Buyer</td>
                                        <td>2024-01-15</td>
                                        <td><span class="badge badge-warning">Reviewing</span></td>
                                        <td>
                                            <button class="btn btn-primary" style="font-size: 12px; padding: 4px 8px;">Approve</button>
                                            <button class="btn btn-secondary" style="font-size: 12px; padding: 4px 8px;">Reject</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>jane.smith@contractor.tz</td>
                                        <td>ABC Construction</td>
                                        <td>Supplier</td>
                                        <td>2024-01-14</td>
                                        <td><span class="badge badge-info">Pending</span></td>
                                        <td>
                                            <button class="btn btn-primary" style="font-size: 12px; padding: 4px 8px;">Review</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="tab-content" data-tab="rules" style="display: none;">
                    <div class="card">
                        <h3 style="margin-bottom: 16px;">Platform Rules & Policies</h3>
                        <p>Platform rules management interface would go here.</p>
                    </div>
                </div>

                <div class="tab-content" data-tab="audit" style="display: none;">
                    <div class="card">
                        <h3 style="margin-bottom: 16px;">Audit Logs</h3>
                        <p>System audit logs would be displayed here.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Register the page render function
if (window.app) {
    window.app.renderAdminDashboard = renderAdminDashboard;
}