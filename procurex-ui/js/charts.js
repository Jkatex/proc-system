// Chart.js initialization and configuration

const chartConfigs = {
    // Admin Dashboard - Platform Activity Growth
    adminActivity: {
        type: 'bar',
        data: {
            labels: mockData.charts.adminActivity.labels,
            datasets: [{
                label: 'Active Users',
                data: mockData.charts.adminActivity.data,
                backgroundColor: '#2563EB',
                borderColor: '#2563EB',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    },

    // Buyer Dashboard - Monthly Procurement Spend
    buyerSpend: {
        type: 'line',
        data: {
            labels: mockData.charts.buyerSpend.labels,
            datasets: [{
                label: 'Monthly Spend (TZS)',
                data: mockData.charts.buyerSpend.data,
                borderColor: '#2563EB',
                backgroundColor: '#EFF6FF',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        callback: function(value) {
                            return (value / 1000000).toFixed(0) + 'M';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    }
};

// Function to create a chart
function createChart(canvasId, configKey) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    const ctx = canvas.getContext('2d');
    return new Chart(ctx, chartConfigs[configKey]);
}

// Export for use in other modules
window.createChart = createChart;
