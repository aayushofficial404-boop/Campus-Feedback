// ========================================
// CONFIGURATION - UPDATE THESE VALUES
// ========================================

// Google Sheets API Configuration
const GOOGLE_SHEETS_API_KEY = 'AIzaSyCDdzU9ZGNCOlVcc7jKTKTOhVUYKpNi5R0'; // Replace with your Google Sheets API key
const SHEET_ID = '19Ldw-_pUaeoE_FCP42TdU_sPCEGPmQR2xe81DqNv9F0'; // Your Google Sheet ID
const RANGE = 'Sheet1!A2:G1000'; // Adjust sheet name if different (data starts from row 2)

// Refresh interval in milliseconds (30 seconds)
const REFRESH_INTERVAL = 30000;

// ========================================
// GLOBAL VARIABLES
// ========================================

let allUpdates = [];
let filteredUpdates = [];
let refreshIntervalId = null;

// ========================================
// MAIN INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    validateConfiguration();
    fetchUpdates();
    startAutoRefresh();
});

// ========================================
// EVENT LISTENERS
// ========================================

function initializeEventListeners() {
    document.getElementById('issueTypeFilter').addEventListener('change', applyFilters);
    document.getElementById('priorityFilter').addEventListener('change', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
}

// ========================================
// CONFIGURATION VALIDATION
// ========================================

function validateConfiguration() {
    const apiKey = GOOGLE_SHEETS_API_KEY;
    const sheetId = SHEET_ID;

    if (apiKey === 'YOUR_API_KEY_HERE' || !apiKey) {
        showError('API Key not configured. Please follow the setup instructions in README.md');
        return false;
    }

    if (sheetId === 'YOUR_SHEET_ID_HERE' || !sheetId) {
        showError('Google Sheet ID not configured. Please follow the setup instructions in README.md');
        return false;
    }

    return true;
}

// ========================================
// FETCH DATA FROM GOOGLE SHEETS API
// ========================================

async function fetchUpdates() {
    try {
        hideError();
        showStatusMessage('Loading updates...');

        // Build the API URL
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${GOOGLE_SHEETS_API_KEY}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const rows = data.values || [];

        if (rows.length === 0) {
            showStatusMessage('No updates available at the moment.');
            renderUpdates([]);
            return;
        }

        // Parse the data into objects
        allUpdates = parseSheetData(rows);

        // Sort by priority (Critical and High first)
        sortByPriority();

        // Apply current filters
        applyFilters();

        // Update last refresh time
        updateLastRefreshTime();

        hideStatusMessage();
    } catch (error) {
        console.error('Error fetching updates:', error);
        showError(`Failed to fetch updates: ${error.message}`);
    }
}

// ========================================
// PARSE SHEET DATA
// ========================================

function parseSheetData(rows) {
    return rows.map(row => ({
        timestamp: row[0] || '',
        title: row[1] || 'Untitled',
        description: row[2] || '',
        issueType: row[3] || 'Other',
        priority: (row[4] || 'Low').trim(),
        status: (row[5] || 'Open').trim()
    })).filter(item => item.title && item.title.trim() !== '');
}

// ========================================
// SORT BY PRIORITY
// ========================================

function sortByPriority() {
    const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };

    allUpdates.sort((a, b) => {
        const priorityA = priorityOrder[a.priority] ?? 999;
        const priorityB = priorityOrder[b.priority] ?? 999;
        return priorityA - priorityB;
    });
}

// ========================================
// FILTERING
// ========================================

function applyFilters() {
    const issueTypeFilter = document.getElementById('issueTypeFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    filteredUpdates = allUpdates.filter(update => {
        const typeMatch = !issueTypeFilter || update.issueType === issueTypeFilter;
        const priorityMatch = !priorityFilter || update.priority === priorityFilter;
        const statusMatch = !statusFilter || update.status === statusFilter;

        return typeMatch && priorityMatch && statusMatch;
    });

    renderUpdates(filteredUpdates);
}

function clearFilters() {
    document.getElementById('issueTypeFilter').value = '';
    document.getElementById('priorityFilter').value = '';
    document.getElementById('statusFilter').value = '';
    applyFilters();
}

// ========================================
// RENDER UPDATES
// ========================================

function renderUpdates(updates) {
    const grid = document.getElementById('updatesGrid');

    if (updates.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>No updates found matching your filters.</p></div>';
        return;
    }

    grid.innerHTML = updates.map(update => createCardHTML(update)).join('');
}

// ========================================
// CREATE CARD HTML
// ========================================

function createCardHTML(update) {
    const priorityClass = update.priority.toLowerCase();
    const statusClass = update.status.toLowerCase().replace(' ', '-');
    const formattedTime = formatTime(update.timestamp);

    return `
        <div class="update-card ${priorityClass}">
            <div class="card-header">
                <h2 class="card-title">${escapeHTML(update.title)}</h2>
                <span class="priority-badge ${priorityClass}">${update.priority}</span>
            </div>

            <div class="card-meta">
                <div class="meta-item">
                    <span class="issue-type-badge">${escapeHTML(update.issueType)}</span>
                </div>
                <div class="meta-item">
                    <span class="status-badge ${statusClass}">${update.status}</span>
                </div>
            </div>

            <p class="card-description">${escapeHTML(update.description)}</p>

            <div class="card-footer">
                <div class="timestamp">
                    <span>📅</span>
                    <span>${formattedTime}</span>
                </div>
            </div>
        </div>
    `;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function formatTime(timestamp) {
    if (!timestamp) return 'No date';

    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return timestamp;
        }

        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    } catch (e) {
        return timestamp;
    }
}

function escapeHTML(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateLastRefreshTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('lastUpdate').textContent = `Last updated: ${timeString}`;
}

// ========================================
// AUTO-REFRESH
// ========================================

function startAutoRefresh() {
    // Refresh immediately, then every 30 seconds
    refreshIntervalId = setInterval(() => {
        fetchUpdates();
    }, REFRESH_INTERVAL);
}

// ========================================
// UI MESSAGING
// ========================================

function showStatusMessage(message) {
    const messageEl = document.getElementById('statusMessage');
    messageEl.textContent = message;
    messageEl.style.display = 'block';
}

function hideStatusMessage() {
    document.getElementById('statusMessage').style.display = 'none';
}

function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}
