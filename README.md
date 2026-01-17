# Campus Public View Portal

A lightweight, responsive website to display live campus updates fetched from a Google Sheet. Perfect for embedding in college websites.

## Features

✅ **Live Data Integration** - Fetches updates from Google Sheets API  
✅ **Smart Sorting** - Critical & High priority issues appear first  
✅ **Color Coding** - Visual priority indicators (Red, Orange, Blue, Green)  
✅ **Advanced Filtering** - Filter by Issue Type, Priority, and Status  
✅ **Auto-Refresh** - Updates automatically every 30 seconds  
✅ **Mobile Responsive** - Works perfectly on all devices  
✅ **Public Access** - No login required  
✅ **Lightweight** - ~50KB total, perfect for embedding  

## File Structure

```
website.c/
├── index.html          # Main HTML structure
├── styles.css          # Responsive styling & color coding
├── script.js           # Google Sheets API integration & logic
└── README.md           # This file
```

## Setup Instructions

### Step 1: Create/Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project:
   - Click the project dropdown at the top
   - Click "New Project"
   - Enter a name (e.g., "Campus Portal")
   - Click "Create"

3. Enable Google Sheets API:
   - In the search bar, type "Google Sheets API"
   - Click on it
   - Click "Enable"

### Step 2: Create an API Key

1. In Google Cloud Console, go to **Credentials** (left sidebar)
2. Click **Create Credentials** → **API Key**
3. Copy the API Key
4. Open `script.js` and replace:
   ```javascript
   const GOOGLE_SHEETS_API_KEY = 'YOUR_API_KEY_HERE';
   ```
   with your actual API key

### Step 3: Prepare Your Google Sheet

1. Create a new Google Sheet with these columns:
   - **Column A**: Timestamp (e.g., `2024-01-10 14:30:00`)
   - **Column B**: Title (e.g., `Library Maintenance`)
   - **Column C**: Description (e.g., `Library will be closed for maintenance`)
   - **Column D**: Issue Type (Academic, Hostel, Exam, Event, Maintenance)
   - **Column E**: Priority (Critical, High, Medium, Low)
   - **Column F**: Status (Open, In Progress, Resolved)
   - **Column G**: (Optional, can be left empty)

2. Example data:
   ```
   Timestamp              | Title                  | Description                      | Issue Type    | Priority | Status
   2024-01-10 14:30:00   | Exam Postponed         | Physics exam postponed to Friday | Exam          | Critical | Open
   2024-01-10 12:00:00   | WiFi Maintenance       | WiFi down in Hostel A            | Maintenance   | High     | In Progress
   ```

3. **Make the sheet public**:
   - Click "Share" button
   - Change to "Anyone with the link"
   - Copy the sheet URL

### Step 4: Get Your Sheet ID

From your Google Sheet URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

Copy the SHEET_ID part and replace in `script.js`:
```javascript
const SHEET_ID = 'YOUR_SHEET_ID_HERE';
```

### Step 5: (Optional) Adjust Sheet Range

If your data is on a different sheet or range, edit in `script.js`:
```javascript
const RANGE = 'Sheet1!A2:G1000'; // Change 'Sheet1' if needed
```

## How It Works

1. **Initialization**: When the page loads, it fetches data from your Google Sheet
2. **Sorting**: Updates are automatically sorted by priority (Critical → High → Medium → Low)
3. **Display**: Updates are shown as attractive cards with color-coded priorities
4. **Filtering**: Users can filter by Issue Type, Priority, or Status
5. **Auto-Refresh**: Every 30 seconds, new data is fetched automatically

## Color Scheme

| Priority | Color  | Hex Code |
|----------|--------|----------|
| Critical | Red    | #e74c3c  |
| High     | Orange | #f39c12  |
| Medium   | Blue   | #3498db  |
| Low      | Green  | #27ae60  |

## Embedding in Google Sites

1. Go to your Google Site
2. Click "Insert" → "Embed Code"
3. Add this HTML:
   ```html
   <iframe 
       src="https://your-domain.com/website.c/index.html" 
       width="100%" 
       height="800" 
       frameborder="0" 
       style="border: none;">
   </iframe>
   ```
4. Or create a button linking to: `https://your-domain.com/website.c/index.html`

## Hosting Options

### Option 1: GitHub Pages (Free)
1. Push files to a GitHub repo
2. Enable GitHub Pages in repo settings
3. Get the URL like: `https://username.github.io/campus-portal/`

### Option 2: Netlify (Free)
1. Connect your GitHub repo
2. Netlify deploys automatically
3. Get a custom domain

### Option 3: Any Web Server
- Upload `index.html`, `styles.css`, `script.js` to your web server
- Access via your domain/URL

## Troubleshooting

### "API Key not configured"
- Make sure you've replaced `YOUR_API_KEY_HERE` in `script.js` with your actual API key
- Check that you enabled Google Sheets API in Google Cloud Console

### "Sheet ID not configured"
- Replace `YOUR_SHEET_ID_HERE` with your actual Google Sheet ID
- The ID is in the URL: `https://docs.google.com/spreadsheets/d/{THIS_IS_YOUR_ID}/edit`

### No data appears
- Make sure your Google Sheet is publicly accessible (Share → Anyone with the link)
- Verify column order matches (A: Timestamp, B: Title, C: Description, etc.)
- Check browser console (F12) for API errors
- Wait a few seconds as API calls take time

### Sheet updates not showing
- The page refreshes every 30 seconds automatically
- Click refresh or wait for auto-update
- Make sure data is in Sheet1 starting from row 2

## Customization

### Change Refresh Interval
In `script.js`, modify:
```javascript
const REFRESH_INTERVAL = 30000; // in milliseconds (30 seconds)
```

### Add Custom Issue Types
In `index.html`, add options to the Issue Type filter:
```html
<option value="IT">IT Support</option>
<option value="Sports">Sports</option>
```

### Change Colors
In `styles.css`, modify the CSS variables:
```css
--critical-color: #e74c3c;
--high-color: #f39c12;
```

## Performance Notes

- Lightweight: Only ~50KB of code and styling
- Fast loading: No heavy dependencies or frameworks
- Mobile optimized: Works on phones, tablets, and desktops
- API efficient: One request every 30 seconds

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security

- API key is visible in client-side code (this is normal for Google Sheets public data)
- Sheet must be publicly readable
- No authentication needed
- Only reads data, cannot modify

## Need Help?

1. Check the troubleshooting section above
2. Open browser DevTools (F12) to see console errors
3. Verify Google Sheets API is enabled
4. Make sure Sheet is publicly accessible
5. Check that column order is correct

---

**Version**: 1.0  
**Last Updated**: January 2026  
**License**: Open Source
