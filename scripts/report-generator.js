const fs = require('fs').promises;
const path = require('path');

module.exports = {
  generateComparisonReport,
  generateSummaryReport,
  generateMarkdownSummary,
  generateHTMLReport
};

// Generate comparison report
async function generateComparisonReport(comparison, results) {
  const report = {
    timestamp: new Date().toISOString(),
    totalDevices: results.length,
    successfulCaptures: results.filter(r => r.success).length,
    comparison,
    recommendations: generateRecommendations(comparison, results)
  };
  
  const reportPath = path.join(__dirname, '..', 'output', 'reports', 'summary', 'comparison-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  // Also generate markdown version
  await generateMarkdownSummary(comparison, results);
  
  return report;
}

// Generate summary report
async function generateSummaryReport(results) {
  const summary = {
    timestamp: new Date().toISOString(),
    totalDevices: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    
    issuesSummary: summarizeIssues(results),
    deviceBreakdown: results.map(r => ({
      device: r.device,
      status: r.success ? 'success' : 'failed',
      issueCount: r.success ? r.analysis.issues.length : 0,
      criticalIssues: r.success ? r.analysis.issues.filter(i => i.severity === 'high').length : 0
    })),
    
    mostProblematicDevices: getMostProblematicDevices(results),
    recommendedActions: getRecommendedActions(results)
  };
  
  const summaryPath = path.join(__dirname, '..', 'output', 'reports', 'summary', 'summary-report.json');
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
  
  // Generate HTML report
  await generateHTMLReport(results);
  
  return summary;
}

// Generate markdown summary
async function generateMarkdownSummary(comparison, results) {
  const timestamp = new Date().toLocaleString();
  
  let markdown = `# iPhone Viewport Analysis Report
Generated: ${timestamp}

## 🚨 Critical Issues
`;
  
  // Add critical issues
  const criticalIssues = [];
  results.forEach(result => {
    if (result.success) {
      result.analysis.issues
        .filter(i => i.severity === 'high')
        .forEach(issue => {
          criticalIssues.push(`- [ ] ${issue.description} on ${result.device}`);
        });
    }
  });
  
  if (criticalIssues.length === 0) {
    markdown += '✅ No critical issues found!\n';
  } else {
    markdown += criticalIssues.join('\n') + '\n';
  }
  
  // Device-specific findings
  markdown += '\n## 📱 Device-Specific Findings\n';
  
  results
    .filter(r => r.success)
    .forEach(result => {
      markdown += `\n### ${result.device} (${getDeviceViewport(result.device)})\n`;
      
      if (result.analysis.issues.length === 0) {
        markdown += '- ✅ No issues detected\n';
      } else {
        result.analysis.issues.forEach(issue => {
          const icon = issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '⚠️' : 'ℹ️';
          markdown += `- ${icon} ${issue.description}\n`;
          
          if (issue.details && issue.details.length > 0) {
            markdown += `  - Details: ${issue.details.slice(0, 3).map(d => 
              typeof d === 'object' ? JSON.stringify(d).substring(0, 50) + '...' : d
            ).join(', ')}\n`;
          }
        });
      }
    });
  
  // Breakpoint recommendations
  if (comparison.breakpoints && comparison.breakpoints.length > 0) {
    markdown += '\n## 📐 Recommended Breakpoints\n';
    comparison.breakpoints.forEach(bp => {
      markdown += `- Add breakpoint between ${bp.between[0]}px and ${bp.between[1]}px\n`;
      if (bp.newIssues.length > 0) {
        markdown += `  - New issues: ${bp.newIssues.join(', ')}\n`;
      }
    });
  }
  
  // General recommendations
  markdown += '\n## 🎯 Recommendations\n';
  const recommendations = generateRecommendations(comparison, results);
  recommendations.forEach((rec, index) => {
    markdown += `${index + 1}. ${rec}\n`;
  });
  
  // Statistics
  markdown += '\n## 📊 Statistics\n';
  const stats = calculateStatistics(results);
  markdown += `- Total devices tested: ${stats.totalDevices}\n`;
  markdown += `- Devices with issues: ${stats.devicesWithIssues}\n`;
  markdown += `- Most common issue: ${stats.mostCommonIssue}\n`;
  markdown += `- Average issues per device: ${stats.averageIssues.toFixed(1)}\n`;
  
  const markdownPath = path.join(__dirname, '..', 'output', 'reports', 'summary', 'issues-summary.md');
  await fs.writeFile(markdownPath, markdown);
}

// Generate HTML report
async function generateHTMLReport(results) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>iPhone Viewport Analysis</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f7;
      color: #1d1d1f;
      line-height: 1.6;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    .timestamp {
      color: #86868b;
      margin-bottom: 2rem;
    }
    .device-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
    .device-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .device-card h3 {
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .status-success { background: #d1fae5; color: #065f46; }
    .status-warning { background: #fed7aa; color: #92400e; }
    .status-error { background: #fee2e2; color: #991b1b; }
    .issue {
      margin: 0.5rem 0;
      padding: 0.5rem;
      background: #f9fafb;
      border-radius: 6px;
      font-size: 0.875rem;
    }
    .issue-high { border-left: 3px solid #ef4444; }
    .issue-medium { border-left: 3px solid #f59e0b; }
    .issue-low { border-left: 3px solid #3b82f6; }
    .screenshot {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
      margin-top: 1rem;
      cursor: pointer;
    }
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .summary-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .summary-card h2 {
      font-size: 2rem;
      color: #1d1d1f;
    }
    .summary-card p {
      color: #86868b;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📱 iPhone Viewport Analysis</h1>
    <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
    
    <div class="summary-cards">
      <div class="summary-card">
        <h2>${results.length}</h2>
        <p>Devices Tested</p>
      </div>
      <div class="summary-card">
        <h2>${results.filter(r => r.success && r.analysis.issues.length === 0).length}</h2>
        <p>Perfect Scores</p>
      </div>
      <div class="summary-card">
        <h2>${results.filter(r => r.success).reduce((sum, r) => sum + r.analysis.issues.filter(i => i.severity === 'high').length, 0)}</h2>
        <p>Critical Issues</p>
      </div>
      <div class="summary-card">
        <h2>${Math.round((results.filter(r => r.success).length / results.length) * 100)}%</h2>
        <p>Success Rate</p>
      </div>
    </div>
    
    <div class="device-grid">
      ${results.map(result => `
        <div class="device-card">
          <h3>
            ${result.device}
            <span class="status-badge ${getStatusClass(result)}">
              ${getStatusText(result)}
            </span>
          </h3>
          <p style="color: #86868b; font-size: 0.875rem;">
            ${result.success ? `${getDeviceViewport(result.device)} • ${result.analysis.issues.length} issues` : 'Failed to capture'}
          </p>
          
          ${result.success ? `
            <div class="issues">
              ${result.analysis.issues.length === 0 ? 
                '<p style="color: #059669; margin-top: 1rem;">✅ No issues detected</p>' :
                result.analysis.issues.map(issue => `
                  <div class="issue issue-${issue.severity}">
                    ${issue.description}
                  </div>
                `).join('')
              }
            </div>
            ${result.screenshot ? `
              <img src="../../${path.relative(path.join(__dirname, '..'), result.screenshot)}" 
                   alt="${result.device} screenshot" 
                   class="screenshot"
                   onclick="window.open(this.src, '_blank')"
              />
            ` : ''}
          ` : `
            <p style="color: #dc2626; margin-top: 1rem;">❌ ${result.error || 'Unknown error'}</p>
          `}
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`;
  
  const htmlPath = path.join(__dirname, '..', 'output', 'reports', 'summary', 'responsive-analysis.html');
  await fs.writeFile(htmlPath, html);
}

// Helper functions
function summarizeIssues(results) {
  const issueCounts = {};
  
  results.forEach(result => {
    if (result.success) {
      result.analysis.issues.forEach(issue => {
        issueCounts[issue.type] = (issueCounts[issue.type] || 0) + 1;
      });
    }
  });
  
  return Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({ type, count }));
}

function getMostProblematicDevices(results) {
  return results
    .filter(r => r.success)
    .map(r => ({
      device: r.device,
      issueCount: r.analysis.issues.length,
      criticalCount: r.analysis.issues.filter(i => i.severity === 'high').length
    }))
    .sort((a, b) => b.criticalCount - a.criticalCount || b.issueCount - a.issueCount)
    .slice(0, 5);
}

function getRecommendedActions(results) {
  const actions = [];
  
  // Check for common issues
  const hasHorizontalScroll = results.some(r => 
    r.success && r.analysis.issues.some(i => i.type === 'horizontal-scroll')
  );
  
  const hasSmallTouchTargets = results.some(r => 
    r.success && r.analysis.issues.some(i => i.type === 'small-touch-targets')
  );
  
  const hasSafeAreaViolations = results.some(r => 
    r.success && r.analysis.issues.some(i => i.type === 'safe-area-violation')
  );
  
  if (hasHorizontalScroll) {
    actions.push('Fix horizontal scroll issues by constraining content width');
  }
  
  if (hasSmallTouchTargets) {
    actions.push('Increase touch target sizes to minimum 44x44px');
  }
  
  if (hasSafeAreaViolations) {
    actions.push('Adjust layout to respect safe areas on notched/Dynamic Island devices');
  }
  
  return actions;
}

function generateRecommendations(comparison, results) {
  const recommendations = [];
  
  // Based on breakpoints
  if (comparison.breakpoints && comparison.breakpoints.length > 0) {
    recommendations.push(`Add responsive breakpoints at ${comparison.breakpoints.map(bp => `${bp.between[1]}px`).join(', ')}`);
  }
  
  // Based on common issues
  const commonIssues = comparison.commonIssues || [];
  if (commonIssues.some(i => i.issue === 'small-touch-targets')) {
    recommendations.push('Increase minimum touch target size to 48x48px for better mobile usability');
  }
  
  if (commonIssues.some(i => i.issue === 'horizontal-scroll')) {
    recommendations.push('Review and constrain content width to prevent horizontal scrolling');
  }
  
  // Safe area recommendations
  if (comparison.safeAreaIssues && comparison.safeAreaIssues.length > 0) {
    recommendations.push('Use CSS environment variables (safe-area-inset-*) for proper spacing on modern iPhones');
  }
  
  return recommendations;
}

function calculateStatistics(results) {
  const successfulResults = results.filter(r => r.success);
  const totalIssues = successfulResults.reduce((sum, r) => sum + r.analysis.issues.length, 0);
  
  const issueCounts = {};
  successfulResults.forEach(r => {
    r.analysis.issues.forEach(issue => {
      issueCounts[issue.type] = (issueCounts[issue.type] || 0) + 1;
    });
  });
  
  const mostCommonIssue = Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1])[0];
  
  return {
    totalDevices: results.length,
    devicesWithIssues: successfulResults.filter(r => r.analysis.issues.length > 0).length,
    mostCommonIssue: mostCommonIssue ? `${mostCommonIssue[0]} (${mostCommonIssue[1]} devices)` : 'None',
    averageIssues: successfulResults.length > 0 ? totalIssues / successfulResults.length : 0
  };
}

function getDeviceViewport(deviceName) {
  const devices = require('./iphone-devices.json').devices;
  const device = devices.find(d => d.name === deviceName);
  return device ? `${device.viewport.width}×${device.viewport.height}` : 'Unknown';
}

function getStatusClass(result) {
  if (!result.success) return 'status-error';
  if (result.analysis.issues.length === 0) return 'status-success';
  if (result.analysis.issues.some(i => i.severity === 'high')) return 'status-error';
  return 'status-warning';
}

function getStatusText(result) {
  if (!result.success) return 'Failed';
  if (result.analysis.issues.length === 0) return 'Perfect';
  if (result.analysis.issues.some(i => i.severity === 'high')) return 'Issues';
  return 'Warnings';
}