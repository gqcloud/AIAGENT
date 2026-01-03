# Change: Add Account Statement Export

## Why
Users need to download their account statements for record-keeping and tax purposes. Currently, users can only view transaction history in the web interface, but cannot export it.

## What Changes
- Add PDF export functionality for account statements
- Add date range selection for statement generation
- Add API endpoint to generate and download statements
- Add frontend UI for statement export

## Impact
- Affected specs: account-management, transaction-history
- Affected code: 
  - `backend/src/routes/account.js` - Add statement endpoint
  - `frontend/src/pages/History.js` - Add export button
  - New: `backend/src/services/statement-generator.js` - PDF generation service

