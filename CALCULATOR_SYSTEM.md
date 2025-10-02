# 🧮 Amroyan Consulting - Calculator System Documentation

## 📋 Overview

The Amroyan Consulting platform features a comprehensive suite of financial calculators designed specifically for Armenian business needs. This document provides detailed information about each calculator, their functionality, and implementation details.

## 🏗️ Calculator Architecture

```
Calculator System
├── Frontend Components
│   ├── Calculator Pages
│   ├── Input Forms
│   ├── Result Displays
│   └── Export Functions
├── Backend API
│   ├── Calculator Controller
│   ├── Rate Management
│   └── Data Validation
└── Database
    ├── Calculators Table
    ├── Calculator Rates Table
    └── User Calculations (Future)
```

## 📊 Available Calculators

### 1. 🇦🇲 Armenian Tax Calculator

**Purpose**: Complete Armenian tax calculation system with 79 calculation rows covering all aspects of Armenian tax law.

#### Features
- **Income Calculations**: Domestic and foreign income tracking
- **Expense Management**: Comprehensive expense categorization
- **Loss Calculations**: Foreign activity losses and deductions
- **Tax Reductions**: Various reduction categories
- **Final Calculations**: 18% profit tax calculation

#### Calculation Flow
```
1. Income Calculation (Rows 1-24)
   ├── Domestic Income (Rows 1-3)
   ├── Foreign Income (Rows 4-8)
   ├── Foreign Losses (Rows 9-13)
   ├── Foreign Taxable Income (Rows 14-18)
   ├── Foreign Taxable Losses (Rows 19-23)
   └── Total Income (Row 24)

2. Expense Calculation (Rows 25-45)
   ├── Cost of Goods (Rows 25-28)
   ├── Cost of Services (Rows 29-32)
   ├── Administrative Expenses (Row 33)
   ├── Sales Expenses (Row 34)
   ├── Financial Expenses (Row 35)
   ├── Other Expenses (Row 36)
   ├── Foreign Expenses (Rows 37-41)
   ├── Foreign Taxable Expenses (Rows 42-44)
   └── Total Expenses (Row 45)

3. Loss Calculation (Rows 46-50)
   ├── Foreign Activity Losses (Rows 46-48)
   ├── Other Losses (Row 49)
   └── Total Losses (Row 50)

4. Reduction Calculation (Rows 51-66)
   ├── Foreign Reductions (Rows 51-53)
   ├── Foreign Taxable Reductions (Rows 54-65)
   └── Total Reductions (Row 66)

5. Final Tax Calculation (Rows 67-79)
   ├── Total Costs & Reductions (Row 67)
   ├── Taxable Profit (Row 68)
   ├── Exemptions (Row 69)
   ├── Adjusted Taxable Profit (Row 70)
   ├── Calculated Profit Tax 18% (Row 71)
   ├── Government Benefits (Row 72)
   ├── Discount Benefits (Row 73)
   ├── Final Profit Tax (Row 74)
   ├── Prepayments (Row 75)
   ├── Tax After Prepayments (Row 76)
   ├── Previous Min Tax (Row 77)
   ├── Payable Profit Tax (Row 78)
   └── Transferable Tax (Row 79)
```

#### Key Formulas
- **Total Income**: `SUM(Rows 1-23)`
- **Total Expenses**: `SUM(Rows 25-44)`
- **Total Losses**: `SUM(Rows 46-49)`
- **Total Reductions**: `SUM(Rows 51-65)`
- **Taxable Profit**: `Total Income - (Total Expenses + Total Losses + Total Reductions)`
- **Adjusted Taxable Profit**: `Taxable Profit - Exemptions`
- **Calculated Profit Tax**: `Adjusted Taxable Profit × 18%`
- **Final Profit Tax**: `Calculated Profit Tax - Government Benefits - Discount Benefits`
- **Payable Profit Tax**: `Final Profit Tax - Prepayments - Previous Min Tax`

### 2. 💼 Project Calculator

**Purpose**: Project cost estimation with comprehensive salary and tax calculations.

#### Features
- **Multiple Salary Types**: Hourly, daily, and monthly positions
- **Tax Calculations**: Income tax and pension contributions
- **Profit Margins**: Configurable profit percentage
- **VAT Inclusion**: Optional 20% VAT calculation
- **Detailed Breakdown**: Step-by-step cost analysis

#### Calculation Logic
```
1. Salary Fund Calculation
   ├── Hourly Positions: Hourly Rate × Hours/Day × Days/Month
   ├── Daily Positions: Daily Rate × Days/Month
   └── Monthly Positions: Monthly Salary

2. Tax Calculations
   ├── Stamp Duty: Number of Positions × 3000 AMD
   ├── Tax Base: (Salary Fund + Stamp Duty) ÷ 0.75
   ├── Income Tax: Tax Base × 20%
   └── Pension Contribution: Tax Base × 5%

3. Total Salary with Taxes
   └── Salary Fund + Stamp Duty + Income Tax + Pension Contribution

4. Profit Calculation
   └── (Total Salary with Taxes + Other Expenses) × Profit Margin %

5. Service Value
   └── Total Salary with Taxes + Other Expenses + Profit × 0.82

6. VAT Calculation (if applicable)
   └── Service Value × 20%

7. Final Total
   └── Service Value + VAT
```

#### Input Fields
- **Salary Positions** (up to 6):
  - Position Type: Hourly/Daily/Monthly
  - Rate: Amount per hour/day/month
  - Hours per Day: For hourly positions
  - Days per Month: For hourly and daily positions
- **Other Expenses** (up to 5 items)
- **Profit Margin**: Percentage
- **VAT Payer**: Yes/No

### 3. 💰 Armenian Payroll Calculator

**Purpose**: Comprehensive salary and payroll calculations for Armenian businesses.

#### Features
- **Multiple Salary Types**: Various compensation structures
- **Tax Deductions**: Income tax and social security
- **Net/Gross Calculations**: Automatic conversion between net and gross
- **Benefit Calculations**: Additional compensation elements

#### Calculation Components
```
1. Gross Salary Calculation
   ├── Base Salary
   ├── Bonuses
   ├── Allowances
   └── Other Benefits

2. Tax Deductions
   ├── Income Tax (20%)
   ├── Social Security (5%)
   └── Other Deductions

3. Net Salary
   └── Gross Salary - All Deductions
```

### 4. 📈 Turnover Tax Calculator

**Purpose**: Quarterly turnover tax calculations for different business activities.

#### Features
- **Multiple Business Types**: Various activity categories
- **Fixed and Calculated Rates**: Different tax calculation methods
- **Minimum Tax**: Minimum tax calculations
- **Cost Deductions**: Expense deduction handling

#### Business Activity Types

**Rows 1-5 (Calculated Tax Rates)**:
- Trade
- Manufacturing
- Public Catering
- Other Activities
- Services

**Rows 6-11 (Fixed Tax Rates)**:
- Automotive Transport
- Non-Automotive Transport
- Communication Services
- Foreign Trade
- Other Fixed Rate Activities

#### Calculation Logic

**For Rows 1-5 (Calculated)**:
```
1. Calculated Tax = (Turnover × Tax Rate) - ((Cost + Administrative Expenses) × Cost Deduction %)
2. Minimum Tax = Turnover × Minimum Tax %
3. Payable Tax = max(Calculated Tax, Minimum Tax)
4. Actual % = (Payable Tax ÷ Turnover) × 100
```

**For Rows 6-11 (Fixed)**:
```
1. Payable Tax = Turnover × Fixed Tax Rate
2. Actual % = Fixed Tax Rate
```

#### Input Fields
- **Turnover**: Amount for each business activity
- **Cost**: Cost of goods/services (for rows 1-5)
- **Administrative Expenses**: Administrative costs (for rows 1-5)
- **Tax Rate**: Percentage (system-managed)
- **Cost Deduction %**: Percentage (system-managed)
- **Minimum Tax %**: Percentage (system-managed)

### 5. 🎯 Comprehensive Salary Calculator

**Purpose**: Advanced salary calculations with comprehensive benefit analysis.

#### Features
- **Multiple Benefit Types**: Various compensation elements
- **Tax Optimization**: Optimal tax planning
- **Detailed Reporting**: Comprehensive calculation reports
- **Scenario Analysis**: Multiple calculation scenarios

## 🔧 Technical Implementation

### Frontend Components

#### Calculator Pages
- **Location**: `src/pages/calculators/`
- **Components**: Individual calculator pages
- **Features**: Form handling, validation, real-time calculations

#### Calculator Components
- **Location**: `src/components/calculators/`
- **Components**: Reusable calculator logic
- **Features**: Calculation engines, result displays

### Backend API

#### Calculator Controller
- **Location**: `laravel-backend/app/Http/Controllers/Api/CalculatorController.php`
- **Endpoints**: CRUD operations for calculators
- **Features**: Rate management, validation

#### Database Schema

**Calculators Table**:
```sql
CREATE TABLE calculators (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**Calculator Rates Table**:
```sql
CREATE TABLE calculator_rates (
    id BIGINT PRIMARY KEY,
    calculator_id BIGINT,
    name VARCHAR(255),
    value DECIMAL(10,4),
    type ENUM('percentage', 'fixed', 'formula'),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (calculator_id) REFERENCES calculators(id)
);
```

### API Endpoints

#### Get All Calculators
```http
GET /api/calculators
```

#### Get Calculator Rates
```http
GET /api/calculators/{id}/rates
```

#### Update Calculator Rates (Admin)
```http
PUT /api/calculators/{id}/rates
Authorization: Bearer {token}
Content-Type: application/json

{
  "rates": [
    {
      "name": "Income Tax Rate",
      "value": 20,
      "type": "percentage"
    }
  ]
}
```

## 🎨 User Interface Features

### Design Principles
- **Mobile-First**: Responsive design for all devices
- **Armenian Localization**: Full Armenian language support
- **Currency Formatting**: Proper AMD formatting
- **Real-Time Updates**: Instant calculation updates
- **Visual Feedback**: Color-coded results and status indicators

### User Experience
- **Intuitive Forms**: Clear input fields with validation
- **Step-by-Step Guidance**: Logical calculation flow
- **Error Handling**: User-friendly error messages
- **Export Options**: Save and export calculations
- **History Tracking**: Previous calculation access

## 🔒 Security Features

### Input Validation
- **Frontend Validation**: Real-time form validation
- **Backend Validation**: Server-side validation
- **Type Safety**: TypeScript type checking
- **Sanitization**: Input sanitization and cleaning

### Data Protection
- **No Sensitive Data Storage**: Calculations not stored permanently
- **Client-Side Processing**: Calculations performed locally
- **Secure API**: Protected admin endpoints
- **Rate Limiting**: API rate limiting

## 📱 Mobile Optimization

### Responsive Design
- **Mobile Layout**: Optimized for mobile devices
- **Touch-Friendly**: Large touch targets
- **Swipe Navigation**: Gesture-based navigation
- **Offline Capability**: Basic offline functionality

### Performance
- **Fast Loading**: Optimized bundle sizes
- **Smooth Animations**: 60fps animations
- **Efficient Rendering**: Optimized React components
- **Caching**: Intelligent data caching

## 🚀 Future Enhancements

### Planned Features
- **Calculation History**: Save and retrieve previous calculations
- **PDF Export**: Generate PDF reports
- **Excel Integration**: Import/export Excel files
- **Multi-User Support**: Team collaboration features
- **API Integration**: Connect with external tax systems
- **Advanced Analytics**: Usage analytics and insights

### Technical Improvements
- **Progressive Web App**: PWA capabilities
- **Offline Support**: Full offline functionality
- **Real-Time Collaboration**: Multi-user editing
- **Advanced Caching**: Intelligent caching strategies
- **Performance Optimization**: Further performance improvements

## 📊 Usage Analytics

### Metrics Tracked
- **Calculator Usage**: Most used calculators
- **Calculation Frequency**: Usage patterns
- **User Engagement**: Time spent on calculations
- **Error Rates**: Common calculation errors
- **Performance Metrics**: Load times and responsiveness

### Reporting
- **Admin Dashboard**: Usage statistics
- **User Insights**: User behavior analysis
- **Performance Reports**: System performance metrics
- **Error Reports**: Error tracking and resolution

## 🛠️ Development Guidelines

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Component Structure**: Consistent component organization
- **API Design**: RESTful API conventions
- **Documentation**: Comprehensive code documentation

### Testing
- **Unit Tests**: Component and function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: End-to-end user flow testing
- **Performance Tests**: Load and stress testing

### Deployment
- **Automated Builds**: CI/CD pipeline
- **Environment Management**: Multiple environment support
- **Version Control**: Git-based version management
- **Monitoring**: Application monitoring and logging

---

*For technical implementation details, please refer to the main README.md and API documentation.*
