// let isAdvancedMode = false;

// document.getElementById('modeToggle').addEventListener('click', function() {
//     isAdvancedMode = !isAdvancedMode;
//     const advancedOptions = document.getElementById('advancedOptions');
//     const button = this;

//     if (isAdvancedMode) {
//         advancedOptions.classList.add('show');
//         button.textContent = 'Switch to Basic Mode';
//         button.classList.add('active');
//     } else {
//         advancedOptions.classList.remove('show');
//         button.textContent = 'Switch to Advanced Mode (AI-Powered)';
//         button.classList.remove('active');
//     }
// });

// document.getElementById('searchForm').addEventListener('submit', async function(e) {
//     e.preventDefault();
    
//     const formData = new FormData(this);
//     const searchData = Object.fromEntries(formData.entries());
//     searchData.mode = isAdvancedMode ? 'advanced' : 'basic';

//     // Show loading
//     document.getElementById('loading').classList.add('show');
//     document.getElementById('results').classList.remove('show');

//     try {
//         const response = await fetch('/search', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(searchData)
//         });

//         const results = await response.json();
//         displayResults(results);
//     } catch (error) {
//         console.error('Search error:', error);
//         alert('Search failed. Please try again.');
//     } finally {
//         document.getElementById('loading').classList.remove('show');
//     }
// });

// function displayResults(results) {
//     const resultsContainer = document.getElementById('results');
    
//     if (!results || results.length === 0) {
//         resultsContainer.innerHTML = '<div class="no-results"><h3>No programs found</h3><p>Try adjusting your search criteria</p></div>';
//         resultsContainer.classList.add('show');
//         return;
//     }

//     const resultsHTML = results.map(result => `
//         <div class="result-card">
//             <div class="result-header">
//                 <div>
//                     <div class="university-name">${result.university}</div>
//                     <div class="program-name">${result.program}</div>
//                 </div>
//                 <div class="funding-badge">${result.fundingType}</div>
//                 ${result.matchPercentage ? `<div class="match-score">${result.matchPercentage}% match</div>` : ''}
//             </div>

//             <div class="result-details">
//                 <div class="detail-item">
//                     <span class="detail-label">Country</span>
//                     <span class="detail-value">${result.country}</span>
//                 </div>
//                 <div class="detail-item">
//                     <span class="detail-label">Session</span>
//                     <span class="detail-value">${result.session}</span>
//                 </div>
//                 <div class="detail-item">
//                     <span class="detail-label">Funding Amount</span>
//                     <span class="detail-value">${result.amount}</span>
//                 </div>
//                 <div class="detail-item">
//                     <span class="detail-label">Application Deadline</span>
//                     <span class="detail-value">${result.applicationDeadline}</span>
//                 </div>
//                 <div class="detail-item">
//                     <span class="detail-label">Eligibility</span>
//                     <span class="detail-value">${result.eligibility}</span>
//                 </div>
//                 <div class="detail-item">
//                     <span class="detail-label">Last Updated</span>
//                     <span class="detail-value">${result.lastUpdated}</span>
//                 </div>
//             </div>

//             <p style="margin: 15px 0; color: #555;">${result.description}</p>

//             ${result.aiInsights ? `<div class="ai-insights">🤖 AI Insight: ${result.aiInsights}</div>` : ''}

//             <div class="requirements">
//                 <strong>Requirements:</strong>
//                 <ul>
//                     ${result.requirements.map(req => `<li>✓ ${req}</li>`).join('')}
//                 </ul>
//             </div>

//             <div style="margin-top: 15px;">
//                 <a href="${result.url}" target="_blank" style="color: #007bff; text-decoration: none;">🔗 View Program Details</a>
//             </div>
//         </div>
//     `).join('');

//     resultsContainer.innerHTML = `
//         <h2 style="margin-bottom: 20px;">Found ${results.length} Programs</h2>
//         ${resultsHTML}
//     `;
//     resultsContainer.classList.add('show');
// }





let isAdvancedMode = false;
let currentProgram = null;

document.getElementById('modeToggle').addEventListener('click', function() {
    isAdvancedMode = !isAdvancedMode;
    const advancedOptions = document.getElementById('advancedOptions');
    const button = this;

    if (isAdvancedMode) {
        advancedOptions.classList.add('show');
        button.innerHTML = '<i class="fas fa-bolt"></i> Switch to Basic Mode';
        button.classList.add('active');
    } else {
        advancedOptions.classList.remove('show');
        button.innerHTML = '<i class="fas fa-robot"></i> Switch to Advanced Mode (AI-Powered)';
        button.classList.remove('active');
    }
});

document.getElementById('searchForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const searchData = Object.fromEntries(formData.entries());
    searchData.mode = isAdvancedMode ? 'advanced' : 'basic';

    // Show loading
    document.getElementById('loading').classList.add('show');
    document.getElementById('results').classList.remove('show');

    try {
        const response = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchData)
        });

        const results = await response.json();
        displayResults(results);
    } catch (error) {
        console.error('Search error:', error);
        alert('Search failed. Please try again.');
    } finally {
        document.getElementById('loading').classList.remove('show');
    }
});

function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    
    if (!results || results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-search" style="font-size: 3rem; color: #64748b; margin-bottom: 20px;"></i>
                    <h3>No programs found</h3>
                    <p>Try adjusting your search criteria</p>
                </div>
            </div>
        `;
        resultsContainer.classList.add('show');
        return;
    }

    const resultsHTML = results.map(result => `
        <div class="result-card">
            <div class="result-header">
                <div>
                    <div class="university-name">${result.university}</div>
                    <div class="program-name">${result.program}</div>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <div class="funding-badge">${result.fundingType}</div>
                    ${result.matchPercentage ? `<div class="match-score">${result.matchPercentage}% match</div>` : ''}
                </div>
            </div>

            <div class="result-details">
                <div class="detail-item">
                    <span class="detail-label">Country</span>
                    <span class="detail-value">${result.country}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Session</span>
                    <span class="detail-value">${result.session}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Funding Amount</span>
                    <span class="detail-value">${result.amount}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Application Deadline</span>
                    <span class="detail-value">${result.applicationDeadline}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Eligibility</span>
                    <span class="detail-value">${result.eligibility}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Last Updated</span>
                    <span class="detail-value">${result.lastUpdated}</span>
                </div>
            </div>

            <p style="margin: 15px 0; color: #555;">${result.description}</p>

            ${result.aiInsights ? `<div class="ai-insights">🤖 AI Insight: ${result.aiInsights}</div>` : ''}

            <div class="requirements">
                <strong>Requirements:</strong>
                <ul>
                    ${result.requirements.map(req => `<li>✓ ${req}</li>`).join('')}
                </ul>
            </div>

            <div style="margin-top: 20px; display: flex; gap: 15px; flex-wrap: wrap;">
                <button class="apply-btn" data-program='${JSON.stringify(result).replace(/'/g, "\\'")}'>
                    <i class="fas fa-paper-plane"></i> Apply Now
                </button>
                <a href="${result.url}" target="_blank" style="padding: 12px 25px; background: #e2e8f0; color: #475569; border-radius: 8px; text-decoration: none; font-weight: 500; display: inline-flex; align-items: center; gap: 8px;">
                    <i class="fas fa-external-link-alt"></i> View Details
                </a>
            </div>
        </div>
    `).join('');

    resultsContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <h2 style="margin: 0;">Found ${results.length} Programs</h2>
            <div style="background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 600;">
                <i class="fas fa-filter"></i> Filter Results
            </div>
        </div>
        ${resultsHTML}
    `;
    
    // Add event listeners to apply buttons
    document.querySelectorAll('.apply-btn').forEach(button => {
        button.addEventListener('click', function() {
            const programData = JSON.parse(this.getAttribute('data-program'));
            openApplicationModal(programData);
        });
    });
    
    resultsContainer.classList.add('show');
}

function openApplicationModal(program) {
    currentProgram = program;
    const modal = document.getElementById('applicationModal');
    const applicationDetails = document.getElementById('applicationDetails');
    const applicationFee = document.getElementById('applicationFee');
    const totalAmount = document.getElementById('totalAmount');
    
    applicationDetails.innerHTML = `
        <div style="background: #f1f5f9; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin-bottom: 10px;">Application Summary</h3>
            <p><strong>University:</strong> ${program.university}</p>
            <p><strong>Program:</strong> ${program.program}</p>
            <p><strong>Country:</strong> ${program.country}</p>
            <p><strong>Funding:</strong> ${program.fundingType}</p>
        </div>
    `;
    
    applicationFee.textContent = '0.00';
    totalAmount.textContent = '0.00';
    
    modal.style.display = 'block';
}

function closeModals() {
    document.getElementById('applicationModal').style.display = 'none';
    document.getElementById('confirmationModal').style.display = 'none';
}

// Close modals when clicking on X
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', closeModals);
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        closeModals();
    }
});

// Handle application form submission
document.getElementById('applicationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const applicationData = {
        programId: currentProgram ? currentProgram.id || 'test-id' : '',
        university: currentProgram ? currentProgram.university : '',
        program: currentProgram ? currentProgram.program : '',
        email: formData.get('applicantEmail'),
        name: formData.get('applicantName'),
        phone: formData.get('applicantPhone')
    };
    
    try {
        const response = await fetch('/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(applicationData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Close application modal and show confirmation
            closeModals();
            
            // Show confirmation modal
            const confirmationModal = document.getElementById('confirmationModal');
            document.getElementById('applicationId').textContent = result.applicationId;
            document.getElementById('confirmedProgram').textContent = applicationData.program;
            document.getElementById('confirmedUniversity').textContent = applicationData.university;
            
            confirmationModal.style.display = 'block';
        } else {
            alert('Application failed. Please try again.');
        }
    } catch (error) {
        console.error('Application error:', error);
        alert('Application failed. Please try again.');
    }
});

// Close confirmation modal
document.getElementById('closeConfirmation').addEventListener('click', closeModals);