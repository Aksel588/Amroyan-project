# Հայաստանի հարկային հաշվիչ - JSON Schema

## 🔹 Overview
Complete Armenian tax calculator with 79 rows covering incomes, expenses, losses, reductions, and tax calculations.

## 🔹 JSON Schema Structure

```json
{
  "taxCalculator": {
    "metadata": {
      "title": "Հայաստանի հարկային հաշվիչ",
      "description": "Հաշվեք շահութահարկը՝ եկամուտներ, ծախսեր, կորուստներ, նվազեցումներ և հարկվող շահույթ",
      "version": "1.0.0",
      "totalRows": 79
    },
    "sections": {
      "incomes": {
        "range": "1-24",
        "description": "Եկամուտներ",
        "rows": [
          {
            "number": 1,
            "name": "Վաճառքից եկամուտ",
            "type": "input",
            "required": false,
            "category": "domestic_income"
          },
          {
            "number": 2,
            "name": "Այլ եկամուտներ",
            "type": "input",
            "required": false,
            "category": "domestic_income"
          },
          {
            "number": 3,
            "name": "Ֆինանսական եկամուտներ",
            "type": "input",
            "required": false,
            "category": "financial_income"
          },
          {
            "number": 4,
            "name": "Արտասահմանյան գործունեությունից եկամուտ",
            "type": "input",
            "required": false,
            "category": "foreign_income"
          },
          {
            "number": 5,
            "name": "Արտասահմանյան ներդրումներից եկամուտ",
            "type": "input",
            "required": false,
            "category": "foreign_income"
          },
          {
            "number": 6,
            "name": "Արտասահմանյան ակտիվների վաճառքից եկամուտ",
            "type": "input",
            "required": false,
            "category": "foreign_income"
          },
          {
            "number": 7,
            "name": "Արտասահմանյան ակտիվների վարձակալությունից եկամուտ",
            "type": "input",
            "required": false,
            "category": "foreign_income"
          },
          {
            "number": 8,
            "name": "Արտասահմանյան ակտիվների այլ օգտագործումից եկամուտ",
            "type": "input",
            "required": false,
            "category": "foreign_income"
          },
          {
            "number": 9,
            "name": "Արտասահմանյան ակտիվների վաճառքից կորուստ",
            "type": "input",
            "required": false,
            "category": "foreign_loss"
          },
          {
            "number": 10,
            "name": "Արտասահմանյան ակտիվների վարձակալությունից կորուստ",
            "type": "input",
            "required": false,
            "category": "foreign_loss"
          },
          {
            "number": 11,
            "name": "Արտասահմանյան ակտիվների այլ օգտագործումից կորուստ",
            "type": "input",
            "required": false,
            "category": "foreign_loss"
          },
          {
            "number": 12,
            "name": "Արտասահմանյան ներդրումներից կորուստ",
            "type": "input",
            "required": false,
            "category": "foreign_loss"
          },
          {
            "number": 13,
            "name": "Արտասահմանյան գործունեությունից կորուստ",
            "type": "input",
            "required": false,
            "category": "foreign_loss"
          },
          {
            "number": 14,
            "name": "Արտասահմանյան ակտիվների վաճառքից եկամուտ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_income"
          },
          {
            "number": 15,
            "name": "Արտասահմանյան ակտիվների վարձակալությունից եկամուտ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_income"
          },
          {
            "number": 16,
            "name": "Արտասահմանյան ակտիվների այլ օգտագործումից եկամուտ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_income"
          },
          {
            "number": 17,
            "name": "Արտասահմանյան ներդրումներից եկամուտ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_income"
          },
          {
            "number": 18,
            "name": "Արտասահմանյան գործունեությունից եկամուտ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_income"
          },
          {
            "number": 19,
            "name": "Արտասահմանյան ակտիվների վաճառքից կորուստ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_loss"
          },
          {
            "number": 20,
            "name": "Արտասահմանյան ակտիվների վարձակալությունից կորուստ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_loss"
          },
          {
            "number": 21,
            "name": "Արտասահմանյան ակտիվների այլ օգտագործումից կորուստ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_loss"
          },
          {
            "number": 22,
            "name": "Արտասահմանյան ներդրումներից կորուստ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_loss"
          },
          {
            "number": 23,
            "name": "Արտասահմանյան գործունեությունից կորուստ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_loss"
          },
          {
            "number": 24,
            "name": "Ընդամենը եկամուտներ",
            "type": "calculated",
            "formula": "SUM(1-23)",
            "category": "total_income"
          }
        ]
      },
      "expenses": {
        "range": "25-45",
        "description": "Ծախսեր",
        "rows": [
          {
            "number": 25,
            "name": "Վաճառված ապրանքների ինքնարժեք",
            "type": "input",
            "required": false,
            "category": "cost_of_goods"
          },
          {
            "number": 26,
            "name": "Վաճառված ապրանքների վարձակալություն",
            "type": "input",
            "required": false,
            "category": "cost_of_goods"
          },
          {
            "number": 27,
            "name": "Վաճառված ապրանքների այլ ծախսեր",
            "type": "input",
            "required": false,
            "category": "cost_of_goods"
          },
          {
            "number": 28,
            "name": "Վաճառված ապրանքների ընդհանուր ծախսեր",
            "type": "subtotal",
            "formula": "SUM(25-27)",
            "category": "cost_of_goods_total"
          },
          {
            "number": 29,
            "name": "Վաճառված ծառայությունների ինքնարժեք",
            "type": "input",
            "required": false,
            "category": "cost_of_services"
          },
          {
            "number": 30,
            "name": "Վաճառված ծառայությունների վարձակալություն",
            "type": "input",
            "required": false,
            "category": "cost_of_services"
          },
          {
            "number": 31,
            "name": "Վաճառված ծառայությունների այլ ծախսեր",
            "type": "input",
            "required": false,
            "category": "cost_of_services"
          },
          {
            "number": 32,
            "name": "Վաճառված ծառայությունների ընդհանուր ծախսեր",
            "type": "subtotal",
            "formula": "SUM(29-31)",
            "category": "cost_of_services_total"
          },
          {
            "number": 33,
            "name": "Վարչական ծախսեր",
            "type": "subtotal",
            "formula": "SUM(33.1-33.6)",
            "category": "administrative_expenses"
          },
          {
            "number": 34,
            "name": "Վաճառքի ծախսեր",
            "type": "subtotal",
            "formula": "SUM(34.1-34.2)",
            "category": "sales_expenses"
          },
          {
            "number": 35,
            "name": "Ֆինանսական ծախսեր",
            "type": "input",
            "required": false,
            "category": "financial_expenses"
          },
          {
            "number": 36,
            "name": "Այլ ծախսեր",
            "type": "subtotal",
            "formula": "SUM(36.1-36.2)",
            "category": "other_expenses"
          },
          {
            "number": 37,
            "name": "Արտասահմանյան գործունեության ծախսեր",
            "type": "input",
            "required": false,
            "category": "foreign_expenses"
          },
          {
            "number": 38,
            "name": "Արտասահմանյան ներդրումների ծախսեր",
            "type": "input",
            "required": false,
            "category": "foreign_expenses"
          },
          {
            "number": 39,
            "name": "Արտասահմանյան ակտիվների վաճառքի ծախսեր",
            "type": "input",
            "required": false,
            "category": "foreign_expenses"
          },
          {
            "number": 40,
            "name": "Արտասահմանյան ակտիվների վարձակալության ծախսեր",
            "type": "input",
            "required": false,
            "category": "foreign_expenses"
          },
          {
            "number": 41,
            "name": "Արտասահմանյան ակտիվների այլ օգտագործման ծախսեր",
            "type": "input",
            "required": false,
            "category": "foreign_expenses"
          },
          {
            "number": 42,
            "name": "Արտասահմանյան գործունեության ծախսեր (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_expenses"
          },
          {
            "number": 43,
            "name": "Արտասահմանյան ներդրումների ծախսեր (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_expenses"
          },
          {
            "number": 44,
            "name": "Արտասահմանյան ակտիվների ծախսեր (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_expenses"
          },
          {
            "number": 45,
            "name": "Ընդամենը ծախսեր",
            "type": "calculated",
            "formula": "SUM(25-44)",
            "category": "total_expenses"
          }
        ]
      },
      "losses": {
        "range": "46-50",
        "description": "Կորուստներ",
        "rows": [
          {
            "number": 46,
            "name": "Արտասահմանյան գործունեության կորուստներ",
            "type": "input",
            "required": false,
            "category": "foreign_losses"
          },
          {
            "number": 47,
            "name": "Արտասահմանյան ներդրումների կորուստներ",
            "type": "input",
            "required": false,
            "category": "foreign_losses"
          },
          {
            "number": 48,
            "name": "Արտասահմանյան ակտիվների կորուստներ",
            "type": "input",
            "required": false,
            "category": "foreign_losses"
          },
          {
            "number": 49,
            "name": "Այլ կորուստներ",
            "type": "input",
            "required": false,
            "category": "other_losses"
          },
          {
            "number": 50,
            "name": "Ընդամենը կորուստներ",
            "type": "calculated",
            "formula": "SUM(46-49)",
            "category": "total_losses"
          }
        ]
      },
      "reductions": {
        "range": "51-66",
        "description": "Նվազեցումներ",
        "rows": [
          {
            "number": 51,
            "name": "Արտասահմանյան գործունեության նվազեցումներ",
            "type": "input",
            "required": false,
            "category": "foreign_reductions"
          },
          {
            "number": 52,
            "name": "Արտասահմանյան ներդրումների նվազեցումներ",
            "type": "input",
            "required": false,
            "category": "foreign_reductions"
          },
          {
            "number": 53,
            "name": "Արտասահմանյան ակտիվների նվազեցումներ",
            "type": "input",
            "required": false,
            "category": "foreign_reductions"
          },
          {
            "number": 54,
            "name": "Արտասահմանյան գործունեության նվազեցումներ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_reductions"
          },
          {
            "number": 55,
            "name": "Արտասահմանյան ներդրումների նվազեցումներ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_reductions"
          },
          {
            "number": 56,
            "name": "Արտասահմանյան ակտիվների նվազեցումներ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_reductions"
          },
          {
            "number": 57,
            "name": "Արտասահմանյան գործունեության նվազեցումներ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_reductions"
          },
          {
            "number": 58,
            "name": "Արտասահմանյան ներդրումների նվազեցումներ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_reductions"
          },
          {
            "number": 59,
            "name": "Արտասահմանյան ակտիվների նվազեցումներ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_reductions"
          },
          {
            "number": 60,
            "name": "Արտասահմանյան գործունեության նվազեցումներ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_reductions"
          },
          {
            "number": 61,
            "name": "Արտասահմանյան ներդրումների նվազեցումներ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_reductions"
          },
          {
            "number": 62,
            "name": "Արտասահմանյան ակտիվների նվազեցումներ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_reductions"
          },
          {
            "number": 63,
            "name": "Արտասահմանյան գործունեության նվազեցումներ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_reductions"
          },
          {
            "number": 64,
            "name": "Արտասահմանյան ներդրումների նվազեցումներ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_reductions"
          },
          {
            "number": 65,
            "name": "Արտասահմանյան ակտիվների նվազեցումներ (հարկային)",
            "type": "input",
            "required": false,
            "category": "foreign_taxable_reductions"
          },
          {
            "number": 66,
            "name": "Ընդամենը նվազեցումներ",
            "type": "calculated",
            "formula": "SUM(51-65)",
            "category": "total_reductions"
          }
        ]
      },
      "calculations": {
        "range": "67-79",
        "description": "Հաշվարկներ",
        "rows": [
          {
            "number": 67,
            "name": "Ընդամենը ծախսեր, կորուստներ և նվազեցումներ",
            "type": "calculated",
            "formula": "Row 45 + Row 50 + Row 66",
            "category": "total_costs_and_reductions"
          },
          {
            "number": 68,
            "name": "Հարկվող շահույթ (կորուստ)",
            "type": "calculated",
            "formula": "Row 24 - Row 67",
            "category": "taxable_profit"
          },
          {
            "number": 69,
            "name": "Ազատումներ (շահույթի նվազեցումներ)",
            "type": "input",
            "required": false,
            "category": "exemptions"
          },
          {
            "number": 70,
            "name": "Ճշգրտված հարկվող շահույթ",
            "type": "calculated",
            "formula": "Row 68 - Row 69",
            "category": "adjusted_taxable_profit"
          },
          {
            "number": 71,
            "name": "Հաշվարկված շահութահարկ (18%)",
            "type": "calculated",
            "formula": "Row 70 × 18%",
            "category": "calculated_profit_tax"
          },
          {
            "number": 72,
            "name": "Պետական արտոնություններ",
            "type": "input",
            "required": false,
            "category": "government_benefits"
          },
          {
            "number": 73,
            "name": "Զեղչային արտոնություններ",
            "type": "input",
            "required": false,
            "category": "discount_benefits"
          },
          {
            "number": 74,
            "name": "Շահութահարկ ազատումներից հետո",
            "type": "calculated",
            "formula": "Row 71 - Row 72 - Row 73",
            "category": "final_profit_tax"
          },
          {
            "number": 75,
            "name": "Նախավճարներ",
            "type": "input",
            "required": false,
            "category": "prepayments"
          },
          {
            "number": 76,
            "name": "Հարկ նախավճարների հանումից հետո",
            "type": "calculated",
            "formula": "Row 74 - Row 75",
            "category": "tax_after_prepayments"
          },
          {
            "number": 77,
            "name": "Նախորդ տարիների չհաշվառված նվազագույն հարկ",
            "type": "input",
            "required": false,
            "category": "previous_min_tax"
          },
          {
            "number": 78,
            "name": "Վճարման ենթակա շահութահարկ",
            "type": "calculated",
            "formula": "Row 76 - Row 77",
            "category": "payable_profit_tax"
          },
          {
            "number": 79,
            "name": "Հաջորդ տարիներ փոխանցվող հարկ",
            "type": "calculated",
            "formula": "IF(Row 78 < 0, Row 78, 0)",
            "category": "transferable_tax"
          }
        ]
      }
    },
    "calculationFlow": {
      "step1": {
        "description": "Calculate subtotals for expenses",
        "formula": "For each subtotal row, sum parent rows"
      },
      "step2": {
        "description": "Calculate total incomes",
        "formula": "SUM(rows 1-23)"
      },
      "step3": {
        "description": "Calculate total expenses",
        "formula": "SUM(rows 25-44)"
      },
      "step4": {
        "description": "Calculate total losses",
        "formula": "SUM(rows 46-49)"
      },
      "step5": {
        "description": "Calculate total reductions",
        "formula": "SUM(rows 51-65)"
      },
      "step6": {
        "description": "Calculate total costs and reductions",
        "formula": "Row 45 + Row 50 + Row 66"
      },
      "step7": {
        "description": "Calculate taxable profit/loss",
        "formula": "Row 24 - Row 67"
      },
      "step8": {
        "description": "Calculate adjusted taxable profit",
        "formula": "Row 68 - Row 69"
      },
      "step9": {
        "description": "Calculate profit tax (18%)",
        "formula": "Row 70 × 0.18"
      },
      "step10": {
        "description": "Calculate final profit tax after benefits",
        "formula": "Row 71 - Row 72 - Row 73"
      },
      "step11": {
        "description": "Calculate tax after prepayments",
        "formula": "Row 74 - Row 75"
      },
      "step12": {
        "description": "Calculate payable profit tax",
        "formula": "Row 76 - Row 77"
      },
      "step13": {
        "description": "Calculate transferable tax",
        "formula": "IF(Row 78 < 0, Row 78, 0)"
      }
    },
    "outputs": {
      "summary": [
        "totalIncomes",
        "totalExpenses", 
        "totalLosses",
        "totalReductions",
        "totalCostsAndReductions",
        "taxableProfit",
        "adjustedTaxableProfit",
        "calculatedProfitTax",
        "finalProfitTax",
        "payableProfitTax",
        "transferableTax"
      ],
      "keyResults": [
        "Row 24: Total Incomes",
        "Row 45: Total Expenses",
        "Row 50: Total Losses", 
        "Row 66: Total Reductions",
        "Row 67: Total Costs & Reductions",
        "Row 68: Taxable Profit/Loss",
        "Row 70: Adjusted Taxable Profit",
        "Row 71: Calculated Profit Tax (18%)",
        "Row 74: Final Profit Tax after benefits",
        "Row 78: Payable Profit Tax",
        "Row 79: Transferable Tax"
      ]
    }
  }
}
```

## 🔹 Implementation Notes

### Data Types
- **input**: User-entered values
- **calculated**: Automatically calculated based on formulas
- **subtotal**: Sum of specific parent rows

### Categories
- **domestic_income**: Armenian domestic income
- **foreign_income**: Foreign income
- **foreign_loss**: Foreign losses
- **foreign_taxable_income**: Foreign taxable income
- **foreign_taxable_loss**: Foreign taxable losses
- **cost_of_goods**: Cost of goods sold
- **cost_of_services**: Cost of services sold
- **administrative_expenses**: Administrative expenses
- **sales_expenses**: Sales expenses
- **financial_expenses**: Financial expenses
- **other_expenses**: Other expenses
- **foreign_expenses**: Foreign expenses
- **foreign_taxable_expenses**: Foreign taxable expenses
- **foreign_losses**: Foreign losses
- **other_losses**: Other losses
- **foreign_reductions**: Foreign reductions
- **foreign_taxable_reductions**: Foreign taxable reductions
- **exemptions**: Tax exemptions
- **government_benefits**: Government benefits
- **discount_benefits**: Discount benefits
- **prepayments**: Tax prepayments
- **previous_min_tax**: Previous years minimum tax

### Key Formulas
1. **Total Incomes**: `SUM(rows 1-23)`
2. **Total Expenses**: `SUM(rows 25-44)`
3. **Total Losses**: `SUM(rows 46-49)`
4. **Total Reductions**: `SUM(rows 51-65)`
5. **Taxable Profit**: `Total Incomes - (Total Expenses + Total Losses + Total Reductions)`
6. **Adjusted Taxable Profit**: `Taxable Profit - Exemptions`
7. **Calculated Profit Tax**: `Adjusted Taxable Profit × 18%`
8. **Final Profit Tax**: `Calculated Profit Tax - Government Benefits - Discount Benefits`
9. **Payable Profit Tax**: `Final Profit Tax - Prepayments - Previous Min Tax`
10. **Transferable Tax**: `IF(Payable Profit Tax < 0, Payable Profit Tax, 0)`

This schema provides a complete structure for implementing the Armenian tax calculator with all 79 rows and their relationships.
