## ADDED Requirements

### Requirement: Account Statement Export

Users SHALL be able to export their account statements as PDF files. The statement SHALL include account information, transaction history for a selected date range, and account balance summary.

#### Scenario: Export statement for date range

- **WHEN** user selects account and date range (e.g., January 1-31, 2024)
- **AND** clicks "Export Statement"
- **THEN** a PDF file is generated
- **AND** the file contains account number, account holder name, date range, all transactions in the range, and ending balance
- **AND** the file is downloaded to the user's device

#### Scenario: Export all transactions

- **WHEN** user does not specify a date range
- **AND** clicks "Export Statement"
- **THEN** a PDF file is generated with all transactions
- **AND** the file is downloaded to the user's device

#### Scenario: Empty statement

- **WHEN** user selects a date range with no transactions
- **AND** clicks "Export Statement"
- **THEN** a PDF file is generated showing "No transactions in this period"
- **AND** the file is downloaded to the user's device
