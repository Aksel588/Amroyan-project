import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, FileText, TrendingUp, TrendingDown, Minus, Search, Filter, X, SortAsc, SortDesc, Eye, EyeOff } from 'lucide-react';

interface TaxRow {
  id: string;
  number: number;
  name: string;
  value: number;
  isSubtotal?: boolean;
  parentRows?: number[];
  isCalculated?: boolean;
  formula?: string;
  category?: string;
  section?: string;
}

interface CalculationResults {
  totalIncomes: number;
  totalExpenses: number;
  totalLosses: number;
  totalReductions: number;
  totalCostsAndReductions: number;
  taxableProfit: number;
  adjustedTaxableProfit: number;
  calculatedProfitTax: number;
  finalProfitTax: number;
  payableProfitTax: number;
  transferableTax: number;
}

const ArmenianTaxCalculator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('number');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showEmptyRows, setShowEmptyRows] = useState(true);
  const [showCalculatedRows, setShowCalculatedRows] = useState(true);

  const [rows, setRows] = useState<TaxRow[]>([
    // Incomes (Rows 1-23)
    { id: '1', number: 1, name: 'Վաճառքից եկամուտ', value: 0, section: 'incomes', category: 'domestic' },
    { id: '2', number: 2, name: 'Այլ եկամուտներ', value: 0, section: 'incomes', category: 'domestic' },
    { id: '3', number: 3, name: 'Ֆինանսական եկամուտներ', value: 0, section: 'incomes', category: 'financial' },
    { id: '4', number: 4, name: 'Արտասահմանյան գործունեությունից եկամուտ', value: 0, section: 'incomes', category: 'foreign' },
    { id: '5', number: 5, name: 'Արտասահմանյան ներդրումներից եկամուտ', value: 0, section: 'incomes', category: 'foreign' },
    { id: '6', number: 6, name: 'Արտասահմանյան ակտիվների վաճառքից եկամուտ', value: 0, section: 'incomes', category: 'foreign' },
    { id: '7', number: 7, name: 'Արտասահմանյան ակտիվների վարձակալությունից եկամուտ', value: 0, section: 'incomes', category: 'foreign' },
    { id: '8', number: 8, name: 'Արտասահմանյան ակտիվների այլ օգտագործումից եկամուտ', value: 0, section: 'incomes', category: 'foreign' },
    { id: '9', number: 9, name: 'Արտասահմանյան ակտիվների վաճառքից կորուստ', value: 0, section: 'incomes', category: 'foreign_loss' },
    { id: '10', number: 10, name: 'Արտասահմանյան ակտիվների վարձակալությունից կորուստ', value: 0, section: 'incomes', category: 'foreign_loss' },
    { id: '11', number: 11, name: 'Արտասահմանյան ակտիվների այլ օգտագործումից կորուստ', value: 0, section: 'incomes', category: 'foreign_loss' },
    { id: '12', number: 12, name: 'Արտասահմանյան ներդրումներից կորուստ', value: 0, section: 'incomes', category: 'foreign_loss' },
    { id: '13', number: 13, name: 'Արտասահմանյան գործունեությունից կորուստ', value: 0, section: 'incomes', category: 'foreign_loss' },
    { id: '14', number: 14, name: 'Արտասահմանյան ակտիվների վաճառքից եկամուտ (հարկային)', value: 0, section: 'incomes', category: 'foreign_taxable' },
    { id: '15', number: 15, name: 'Արտասահմանյան ակտիվների վարձակալությունից եկամուտ (հարկային)', value: 0, section: 'incomes', category: 'foreign_taxable' },
    { id: '16', number: 16, name: 'Արտասահմանյան ակտիվների այլ օգտագործումից եկամուտ (հարկային)', value: 0, section: 'incomes', category: 'foreign_taxable' },
    { id: '17', number: 17, name: 'Արտասահմանյան ներդրումներից եկամուտ (հարկային)', value: 0, section: 'incomes', category: 'foreign_taxable' },
    { id: '18', number: 18, name: 'Արտասահմանյան գործունեությունից եկամուտ (հարկային)', value: 0, section: 'incomes', category: 'foreign_taxable' },
    { id: '19', number: 19, name: 'Արտասահմանյան ակտիվների վաճառքից կորուստ (հարկային)', value: 0, section: 'incomes', category: 'foreign_taxable_loss' },
    { id: '20', number: 20, name: 'Արտասահմանյան ակտիվների վարձակալությունից կորուստ (հարկային)', value: 0, section: 'incomes', category: 'foreign_taxable_loss' },
    { id: '21', number: 21, name: 'Արտասահմանյան ակտիվների այլ օգտագործումից կորուստ (հարկային)', value: 0, section: 'incomes', category: 'foreign_taxable_loss' },
    { id: '22', number: 22, name: 'Արտասահմանյան ներդրումներից կորուստ (հարկային)', value: 0, section: 'incomes', category: 'foreign_taxable_loss' },
    { id: '23', number: 23, name: 'Արտասահմանյան գործունեությունից կորուստ (հարկային)', value: 0, section: 'incomes', category: 'foreign_taxable_loss' },
    { id: '24', number: 24, name: 'Ընդամենը եկամուտներ', value: 0, isCalculated: true, formula: 'SUM(1-23)', section: 'incomes', category: 'total' },
    
    // Expenses (Rows 25-44)
    { id: '25', number: 25, name: 'Վաճառված ապրանքների ինքնարժեք', value: 0, section: 'expenses', category: 'cost_of_goods' },
    { id: '26', number: 26, name: 'Վաճառված ապրանքների վարձակալություն', value: 0, section: 'expenses', category: 'cost_of_goods' },
    { id: '27', number: 27, name: 'Վաճառված ապրանքների այլ ծախսեր', value: 0, section: 'expenses', category: 'cost_of_goods' },
    { id: '28', number: 28, name: 'Վաճառված ապրանքների ընդհանուր ծախսեր', value: 0, isSubtotal: true, parentRows: [25, 26, 27], section: 'expenses', category: 'cost_of_goods_total' },
    { id: '29', number: 29, name: 'Վաճառված ծառայությունների ինքնարժեք', value: 0, section: 'expenses', category: 'cost_of_services' },
    { id: '30', number: 30, name: 'Վաճառված ծառայությունների վարձակալություն', value: 0, section: 'expenses', category: 'cost_of_services' },
    { id: '31', number: 31, name: 'Վաճառված ծառայությունների այլ ծախսեր', value: 0, section: 'expenses', category: 'cost_of_services' },
    { id: '32', number: 32, name: 'Վաճառված ծառայությունների ընդհանուր ծախսեր', value: 0, isSubtotal: true, parentRows: [29, 30, 31], section: 'expenses', category: 'cost_of_services_total' },
    { id: '33', number: 33, name: 'Վարչական ծախսեր', value: 0, isSubtotal: true, parentRows: [33.1, 33.2, 33.3, 33.4, 33.5, 33.6], section: 'expenses', category: 'administrative' },
    { id: '34', number: 34, name: 'Վաճառքի ծախսեր', value: 0, isSubtotal: true, parentRows: [34.1, 34.2], section: 'expenses', category: 'sales' },
    { id: '35', number: 35, name: 'Ֆինանսական ծախսեր', value: 0, section: 'expenses', category: 'financial' },
    { id: '36', number: 36, name: 'Այլ ծախսեր', value: 0, isSubtotal: true, parentRows: [36.1, 36.2], section: 'expenses', category: 'other' },
    { id: '37', number: 37, name: 'Արտասահմանյան գործունեության ծախսեր', value: 0, section: 'expenses', category: 'foreign' },
    { id: '38', number: 38, name: 'Արտասահմանյան ներդրումների ծախսեր', value: 0, section: 'expenses', category: 'foreign' },
    { id: '39', number: 39, name: 'Արտասահմանյան ակտիվների վաճառքի ծախսեր', value: 0, section: 'expenses', category: 'foreign' },
    { id: '40', number: 40, name: 'Արտասահմանյան ակտիվների վարձակալության ծախսեր', value: 0, section: 'expenses', category: 'foreign' },
    { id: '41', number: 41, name: 'Արտասահմանյան ակտիվների այլ օգտագործման ծախսեր', value: 0, section: 'expenses', category: 'foreign' },
    { id: '42', number: 42, name: 'Արտասահմանյան գործունեության ծախսեր (հարկային)', value: 0, section: 'expenses', category: 'foreign_taxable' },
    { id: '43', number: 43, name: 'Արտասահմանյան ներդրումների ծախսեր (հարկային)', value: 0, section: 'expenses', category: 'foreign_taxable' },
    { id: '44', number: 44, name: 'Արտասահմանյան ակտիվների ծախսեր (հարկային)', value: 0, section: 'expenses', category: 'foreign_taxable' },
    { id: '45', number: 45, name: 'Ընդամենը ծախսեր', value: 0, isCalculated: true, formula: 'SUM(25-44)', section: 'expenses', category: 'total' },
    
    // Losses (Rows 46-49)
    { id: '46', number: 46, name: 'Արտասահմանյան գործունեության կորուստներ', value: 0, section: 'losses', category: 'foreign' },
    { id: '47', number: 47, name: 'Արտասահմանյան ներդրումների կորուստներ', value: 0, section: 'losses', category: 'foreign' },
    { id: '48', number: 48, name: 'Արտասահմանյան ակտիվների կորուստներ', value: 0, section: 'losses', category: 'foreign' },
    { id: '49', number: 49, name: 'Այլ կորուստներ', value: 0, section: 'losses', category: 'other' },
    { id: '50', number: 50, name: 'Ընդամենը կորուստներ', value: 0, isCalculated: true, formula: 'SUM(46-49)', section: 'losses', category: 'total' },
    
    // Reductions (Rows 51-65)
    { id: '51', number: 51, name: 'Արտասահմանյան գործունեության նվազեցումներ', value: 0, section: 'reductions', category: 'foreign' },
    { id: '52', number: 52, name: 'Արտասահմանյան ներդրումների նվազեցումներ', value: 0, section: 'reductions', category: 'foreign' },
    { id: '53', number: 53, name: 'Արտասահմանյան ակտիվների նվազեցումներ', value: 0, section: 'reductions', category: 'foreign' },
    { id: '54', number: 54, name: 'Արտասահմանյան գործունեության նվազեցումներ (հարկային)', value: 0, section: 'reductions', category: 'foreign_taxable' },
    { id: '55', number: 55, name: 'Արտասահմանյան ներդրումների նվազեցումներ (հարկային)', value: 0, section: 'reductions', category: 'foreign_taxable' },
    { id: '56', number: 56, name: 'Արտասահմանյան ակտիվների նվազեցումներ (հարկային)', value: 0, section: 'reductions', category: 'foreign_taxable' },
    { id: '57', number: 57, name: 'Արտասահմանյան գործունեության նվազեցումներ (հարկային)', value: 0, section: 'reductions', category: 'foreign_taxable' },
    { id: '58', number: 58, name: 'Արտասահմանյան ներդրումների նվազեցումներ (հարկային)', value: 0, section: 'reductions', category: 'foreign_taxable' },
    { id: '59', number: 59, name: 'Արտասահմանյան ակտիվների նվազեցումներ (հարկային)', value: 0, section: 'reductions', category: 'foreign_taxable' },
    { id: '60', number: 60, name: 'Արտասահմանյան գործունեության նվազեցումներ (հարկային)', value: 0, section: 'reductions', category: 'foreign_taxable' },
    { id: '61', number: 61, name: 'Արտասահմանյան ներդրումների նվազեցումներ (հարկային)', value: 0, section: 'reductions', category: 'foreign_taxable' },
    { id: '62', number: 62, name: 'Արտասահմանյան ակտիվների նվազեցումներ (հարկային)', value: 0, section: 'reductions', category: 'foreign_taxable' },
    { id: '63', number: 63, name: 'Արտասահմանյան գործունեության նվազեցումներ (հարկային)', value: 0, section: 'reductions', category: 'foreign_taxable' },
    { id: '64', number: 64, name: 'Արտասահմանյան ներդրումների նվազեցումներ (հարկային)', value: 0, section: 'reductions', category: 'foreign_taxable' },
    { id: '65', number: 65, name: 'Արտասահմանյան ակտիվների նվազեցումներ (հարկային)', value: 0, section: 'reductions', category: 'foreign_taxable' },
    { id: '66', number: 66, name: 'Ընդամենը նվազեցումներ', value: 0, isCalculated: true, formula: 'SUM(51-65)', section: 'reductions', category: 'total' },
    
    // Main Calculations (Rows 67-79)
    { id: '67', number: 67, name: 'Ընդամենը ծախսեր, կորուստներ և նվազեցումներ', value: 0, isCalculated: true, formula: 'Row 45 + Row 50 + Row 66', section: 'calculations', category: 'totals' },
    { id: '68', number: 68, name: 'Հարկվող շահույթ (կորուստ)', value: 0, isCalculated: true, formula: 'Row 24 - Row 67', section: 'calculations', category: 'profit' },
    { id: '69', number: 69, name: 'Ազատումներ (շահույթի նվազեցումներ)', value: 0, section: 'calculations', category: 'exemptions' },
    { id: '70', number: 70, name: 'Ճշգրտված հարկվող շահույթ', value: 0, isCalculated: true, formula: 'Row 68 - Row 69', section: 'calculations', category: 'profit' },
    { id: '71', number: 71, name: 'Հաշվարկված շահութահարկ (18%)', value: 0, isCalculated: true, formula: 'Row 70 × 18%', section: 'calculations', category: 'tax' },
    { id: '72', number: 72, name: 'Պետական արտոնություններ', value: 0, section: 'calculations', category: 'benefits' },
    { id: '73', number: 73, name: 'Զեղչային արտոնություններ', value: 0, section: 'calculations', category: 'benefits' },
    { id: '74', number: 74, name: 'Շահութահարկ ազատումներից հետո', value: 0, isCalculated: true, formula: 'Row 71 - Row 72 - Row 73', section: 'calculations', category: 'tax' },
    { id: '75', number: 75, name: 'Նախավճարներ', value: 0, section: 'calculations', category: 'prepayments' },
    { id: '76', number: 76, name: 'Հարկ նախավճարների հանումից հետո', value: 0, isCalculated: true, formula: 'Row 74 - Row 75', section: 'calculations', category: 'tax' },
    { id: '77', number: 77, name: 'Նախորդ տարիների չհաշվառված նվազագույն հարկ', value: 0, section: 'calculations', category: 'adjustments' },
    { id: '78', number: 78, name: 'Վճարման ենթակա շահութահարկ', value: 0, isCalculated: true, formula: 'Row 76 - Row 77', section: 'calculations', category: 'final' },
    { id: '79', number: 79, name: 'Հաջորդ տարիներ փոխանցվող հարկ', value: 0, isCalculated: true, formula: 'IF(Row 78 < 0, Row 78, 0)', section: 'calculations', category: 'final' }
  ]);

  const updateRow = (id: string, value: number) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, value } : row
    ));
  };

  // Filter and search logic
  const sections = [
    { value: 'all', label: 'Բոլորը', count: rows.length },
    { value: 'incomes', label: 'Եկամուտներ', count: rows.filter(row => row.section === 'incomes').length },
    { value: 'expenses', label: 'Ծախսեր', count: rows.filter(row => row.section === 'expenses').length },
    { value: 'losses', label: 'Կորուստներ', count: rows.filter(row => row.section === 'losses').length },
    { value: 'reductions', label: 'Նվազեցումներ', count: rows.filter(row => row.section === 'reductions').length },
    { value: 'calculations', label: 'Հաշվարկներ', count: rows.filter(row => row.section === 'calculations').length }
  ];

  const categories = [
    { value: 'all', label: 'Բոլորը', count: rows.length },
    { value: 'domestic', label: 'Ներքին', count: rows.filter(row => row.category === 'domestic').length },
    { value: 'foreign', label: 'Արտասահմանյան', count: rows.filter(row => row.category === 'foreign').length },
    { value: 'financial', label: 'Ֆինանսական', count: rows.filter(row => row.category === 'financial').length },
    { value: 'foreign_taxable', label: 'Արտասահմանյան (հարկային)', count: rows.filter(row => row.category === 'foreign_taxable').length },
    { value: 'foreign_loss', label: 'Արտասահմանյան կորուստ', count: rows.filter(row => row.category === 'foreign_loss').length },
    { value: 'foreign_taxable_loss', label: 'Արտասահմանյան կորուստ (հարկային)', count: rows.filter(row => row.category === 'foreign_taxable_loss').length },
    { value: 'cost_of_goods', label: 'Ապրանքների ինքնարժեք', count: rows.filter(row => row.category === 'cost_of_goods').length },
    { value: 'cost_of_services', label: 'Ծառայությունների ինքնարժեք', count: rows.filter(row => row.category === 'cost_of_services').length },
    { value: 'administrative', label: 'Վարչական', count: rows.filter(row => row.category === 'administrative').length },
    { value: 'sales', label: 'Վաճառքի', count: rows.filter(row => row.category === 'sales').length },
    { value: 'other', label: 'Այլ', count: rows.filter(row => row.category === 'other').length },
    { value: 'total', label: 'Ընդամենը', count: rows.filter(row => row.category === 'total').length },
    { value: 'profit', label: 'Շահույթ', count: rows.filter(row => row.category === 'profit').length },
    { value: 'tax', label: 'Հարկ', count: rows.filter(row => row.category === 'tax').length },
    { value: 'exemptions', label: 'Ազատումներ', count: rows.filter(row => row.category === 'exemptions').length },
    { value: 'benefits', label: 'Արտոնություններ', count: rows.filter(row => row.category === 'benefits').length },
    { value: 'prepayments', label: 'Նախավճարներ', count: rows.filter(row => row.category === 'prepayments').length },
    { value: 'adjustments', label: 'Ճշգրտումներ', count: rows.filter(row => row.category === 'adjustments').length },
    { value: 'final', label: 'Վերջնական', count: rows.filter(row => row.category === 'final').length }
  ];

  const filteredRows = useMemo(() => {
    let filtered = rows.filter(row => {
      const matchesSearch = searchQuery === '' || 
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.number.toString().includes(searchQuery);
      
      const matchesSection = selectedSection === 'all' || row.section === selectedSection;
      const matchesCategory = selectedCategory === 'all' || row.category === selectedCategory;
      
      const matchesEmptyFilter = showEmptyRows || row.value !== 0;
      const matchesCalculatedFilter = showCalculatedRows || !row.isCalculated;
      
      return matchesSearch && matchesSection && matchesCategory && matchesEmptyFilter && matchesCalculatedFilter;
    });

    // Sort rows
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'number':
          comparison = a.number - b.number;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name, 'hy');
          break;
        case 'value':
          comparison = a.value - b.value;
          break;
        case 'section':
          comparison = (a.section || '').localeCompare(b.section || '', 'hy');
          break;
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '', 'hy');
          break;
        default:
          comparison = a.number - b.number;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [rows, searchQuery, selectedSection, selectedCategory, sortBy, sortOrder, showEmptyRows, showCalculatedRows]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSection('all');
    setSelectedCategory('all');
    setSortBy('number');
    setSortOrder('asc');
    setShowEmptyRows(true);
    setShowCalculatedRows(true);
  };

  const hasActiveFilters = searchQuery !== '' || selectedSection !== 'all' || selectedCategory !== 'all' || 
    sortBy !== 'number' || sortOrder !== 'asc' || !showEmptyRows || !showCalculatedRows;

  const calculations = useMemo((): CalculationResults => {
    // Calculate subtotals first
    const updatedRows = [...rows];
    
    // Calculate subtotals for expenses
    updatedRows.forEach(row => {
      if (row.isSubtotal && row.parentRows) {
        const subtotal = row.parentRows.reduce((sum, parentNum) => {
          const parentRow = updatedRows.find(r => r.number === parentNum);
          return sum + (parentRow?.value || 0);
        }, 0);
        row.value = subtotal;
      }
    });

    // Calculate main totals
    const totalIncomes = updatedRows.filter(r => r.number >= 1 && r.number <= 23).reduce((sum, row) => sum + row.value, 0);
    const totalExpenses = updatedRows.filter(r => r.number >= 25 && r.number <= 44).reduce((sum, row) => sum + row.value, 0);
    const totalLosses = updatedRows.filter(r => r.number >= 46 && r.number <= 49).reduce((sum, row) => sum + row.value, 0);
    const totalReductions = updatedRows.filter(r => r.number >= 51 && r.number <= 65).reduce((sum, row) => sum + row.value, 0);
    
    const totalCostsAndReductions = totalExpenses + totalLosses + totalReductions;
    const taxableProfit = totalIncomes - totalCostsAndReductions;
    
    const exemptions = updatedRows.find(r => r.number === 69)?.value || 0;
    const adjustedTaxableProfit = taxableProfit - exemptions;
    
    const calculatedProfitTax = adjustedTaxableProfit * 0.18;
    
    const governmentBenefits = updatedRows.find(r => r.number === 72)?.value || 0;
    const discountBenefits = updatedRows.find(r => r.number === 73)?.value || 0;
    const finalProfitTax = calculatedProfitTax - governmentBenefits - discountBenefits;
    
    const prepayments = updatedRows.find(r => r.number === 75)?.value || 0;
    const taxAfterPrepayments = finalProfitTax - prepayments;
    
    const previousMinTax = updatedRows.find(r => r.number === 77)?.value || 0;
    const payableProfitTax = taxAfterPrepayments - previousMinTax;
    
    const transferableTax = payableProfitTax < 0 ? payableProfitTax : 0;

    return {
      totalIncomes,
      totalExpenses,
      totalLosses,
      totalReductions,
      totalCostsAndReductions,
      taxableProfit,
      adjustedTaxableProfit,
      calculatedProfitTax,
      finalProfitTax,
      payableProfitTax,
      transferableTax
    };
  }, [rows]);

  const formatAMD = (amount: number) => 
    new Intl.NumberFormat('hy-AM', { 
      style: 'currency', 
      currency: 'AMD', 
      minimumFractionDigits: 0 
    }).format(amount);

  const getRowCategory = (rowNumber: number) => {
    if (rowNumber >= 1 && rowNumber <= 24) return 'incomes';
    if (rowNumber >= 25 && rowNumber <= 45) return 'expenses';
    if (rowNumber >= 46 && rowNumber <= 50) return 'losses';
    if (rowNumber >= 51 && rowNumber <= 66) return 'reductions';
    if (rowNumber >= 67 && rowNumber <= 79) return 'calculations';
    return 'other';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'incomes': return 'text-green-400';
      case 'expenses': return 'text-red-400';
      case 'losses': return 'text-orange-400';
      case 'reductions': return 'text-yellow-400';
      case 'calculations': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'incomes': return 'bg-green-900/20 border-green-500/30';
      case 'expenses': return 'bg-red-900/20 border-red-500/30';
      case 'losses': return 'bg-orange-900/20 border-orange-500/30';
      case 'reductions': return 'bg-yellow-900/20 border-yellow-500/30';
      case 'calculations': return 'bg-blue-900/20 border-blue-500/30';
      default: return 'bg-gray-900/20 border-gray-500/30';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card className="bg-gradient-to-b from-gray-900 to-black border-gold-500/20">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Հայաստանի հարկային հաշվիչ
          </CardTitle>
          <CardDescription className="text-gray-400">
            Հաշվեք շահութահարկը՝ եկամուտներ, ծախսեր, կորուստներ, նվազեցումներ և հարկվող շահույթ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Հաշվարկի կարգ</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• <strong>Եկամուտներ (1-24):</strong> Մուտքագրեք բոլոր տեսակի եկամուտները</p>
              <p>• <strong>Ծախսեր (25-45):</strong> Մուտքագրեք բոլոր ծախսերը</p>
              <p>• <strong>Կորուստներ (46-50):</strong> Մուտքագրեք կորուստները</p>
              <p>• <strong>Նվազեցումներ (51-66):</strong> Մուտքագրեք նվազեցումները</p>
              <p>• <strong>Հաշվարկներ (67-79):</strong> Ավտոմատ հաշվարկվում են</p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <Card className="bg-gradient-to-b from-gray-900 to-black border-gold-500/20">
            <CardContent className="p-6">
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Փնտրել տողեր... (օր. եկամուտ, հարկ, շահույթ)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-gold-500 focus:ring-gold-500/20"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Section Filter */}
                  <div className="flex-1 min-w-0">
                    <Select value={selectedSection} onValueChange={setSelectedSection}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Ընտրել բաժին" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {sections.map((section) => (
                          <SelectItem key={section.value} value={section.value} className="text-white hover:bg-gray-700">
                            {section.label} ({section.count})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Filter */}
                  <div className="flex-1 min-w-0">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Ընտրել կատեգորիա" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600 max-h-60">
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value} className="text-white hover:bg-gray-700">
                            {category.label} ({category.count})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort Controls */}
                  <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="number" className="text-white hover:bg-gray-700">Տող</SelectItem>
                        <SelectItem value="name" className="text-white hover:bg-gray-700">Անուն</SelectItem>
                        <SelectItem value="value" className="text-white hover:bg-gray-700">Արժեք</SelectItem>
                        <SelectItem value="section" className="text-white hover:bg-gray-700">Բաժին</SelectItem>
                        <SelectItem value="category" className="text-white hover:bg-gray-700">Կատեգորիա</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Filter Toggle and Clear */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Ֆիլտրեր
                  </Button>
                  
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Մաքրել
                    </Button>
                  )}
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-4">Ընդլայնված ֆիլտրեր</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Display Options */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-300 mb-3">Ցուցադրման ընտրանքներ</h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={showEmptyRows ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowEmptyRows(!showEmptyRows)}
                            className={showEmptyRows ? "bg-gold-500 text-black" : "border-gray-600 text-gray-300"}
                          >
                            {showEmptyRows ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                            Դատարկ տողեր
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={showCalculatedRows ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowCalculatedRows(!showCalculatedRows)}
                            className={showCalculatedRows ? "bg-gold-500 text-black" : "border-gray-600 text-gray-300"}
                          >
                            {showCalculatedRows ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                            Հաշվարկվող տողեր
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Results Count */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-300 mb-3">Արդյունքներ</h5>
                      <div className="text-sm text-gray-400">
                        <p>Ցուցադրվում է {filteredRows.length} տող {rows.length}-ից</p>
                        <p>Ընտրված բաժին: {sections.find(s => s.value === selectedSection)?.label}</p>
                        <p>Ընտրված կատեգորիա: {categories.find(c => c.value === selectedCategory)?.label}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <Badge variant="secondary" className="bg-gold-500/20 text-gold-400 border-gold-500/30">
                        Փնտրում: "{searchQuery}"
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSearchQuery('')}
                          className="ml-2 h-4 w-4 p-0 hover:bg-gold-500/20"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    )}
                    
                    {selectedSection !== 'all' && (
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        Բաժին: {sections.find(s => s.value === selectedSection)?.label}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSection('all')}
                          className="ml-2 h-4 w-4 p-0 hover:bg-blue-500/20"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    )}

                    {selectedCategory !== 'all' && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                        Կատեգորիա: {categories.find(c => c.value === selectedCategory)?.label}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCategory('all')}
                          className="ml-2 h-4 w-4 p-0 hover:bg-green-500/20"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    )}

                    {!showEmptyRows && (
                      <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        Դատարկ տողեր թաքցված
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowEmptyRows(true)}
                          className="ml-2 h-4 w-4 p-0 hover:bg-orange-500/20"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    )}

                    {!showCalculatedRows && (
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        Հաշվարկվող տողեր թաքցված
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowCalculatedRows(true)}
                          className="ml-2 h-4 w-4 p-0 hover:bg-purple-500/20"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-4 text-center">
            <p className="text-gray-400">
              {filteredRows.length === rows.length 
                ? `Ցուցադրվում են բոլոր ${rows.length} տողերը`
                : `Ցուցադրվում է ${filteredRows.length} տող ${rows.length}-ից`
              }
            </p>
          </div>

          {/* Tax Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-600 p-3 text-center text-gold-400 font-semibold w-16">Տող</th>
                  <th className="border border-gray-600 p-3 text-left text-gold-400 font-semibold">Անվանում</th>
                  <th className="border border-gray-600 p-3 text-center text-gold-400 font-semibold w-48">Գումար (AMD)</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="border border-gray-600 p-8 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Search className="w-12 h-12 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">Տողեր չեն գտնվել</h3>
                          <p className="text-gray-400 mb-4">
                            Փորձեք փոխել ձեր որոնման պարամետրերը կամ մաքրել ֆիլտրերը
                          </p>
                          <Button onClick={clearFilters} className="bg-gold-500 hover:bg-gold-600 text-black">
                            Մաքրել բոլոր ֆիլտրերը
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, index) => {
                    const category = getRowCategory(row.number);
                    const isHighlighted = [24, 45, 50, 66, 67, 68, 70, 71, 74, 78, 79].includes(row.number);
                    
                    return (
                      <tr key={row.id} className={`${index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-900/50'} ${isHighlighted ? 'bg-gold-900/20' : ''}`}>
                        <td className="border border-gray-600 p-3 text-center text-white font-semibold">
                          {row.number}
                        </td>
                        <td className="border border-gray-600 p-3">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-white ${isHighlighted ? 'font-bold' : ''}`}>
                                {row.name}
                              </span>
                              {row.isCalculated && (
                                <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                                  հաշվարկվող
                                </Badge>
                              )}
                              {row.isSubtotal && (
                                <Badge variant="outline" className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                  ենթագումար
                                </Badge>
                              )}
                            </div>
                            
                            {/* Category and Section Badges */}
                            <div className="flex flex-wrap gap-1">
                              {row.section && (
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    row.section === 'incomes' ? 'border-green-500 text-green-400' :
                                    row.section === 'expenses' ? 'border-red-500 text-red-400' :
                                    row.section === 'losses' ? 'border-orange-500 text-orange-400' :
                                    row.section === 'reductions' ? 'border-yellow-500 text-yellow-400' :
                                    row.section === 'calculations' ? 'border-blue-500 text-blue-400' :
                                    'border-gray-500 text-gray-400'
                                  }`}
                                >
                                  {sections.find(s => s.value === row.section)?.label}
                                </Badge>
                              )}
                              
                              {row.category && row.category !== 'total' && (
                                <Badge 
                                  variant="outline" 
                                  className="text-xs border-gray-500 text-gray-400"
                                >
                                  {categories.find(c => c.value === row.category)?.label}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="border border-gray-600 p-2">
                          {row.isCalculated ? (
                            <div className="text-center">
                              <span className={`font-semibold ${getCategoryColor(category)}`}>
                                {formatAMD(row.value)}
                              </span>
                            </div>
                          ) : (
                            <Input
                              type="number"
                              value={row.value || ''}
                              onChange={(e) => updateRow(row.id, Number(e.target.value))}
                              placeholder="0"
                              className="bg-gray-700 border-gray-600 text-white text-center"
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-green-900/20 border-green-500/30">
              <CardContent className="p-4 text-center">
                <h4 className="text-sm text-green-400 mb-2">Ընդամենը եկամուտներ</h4>
                <p className="text-2xl font-bold text-green-400">{formatAMD(calculations.totalIncomes)}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-red-900/20 border-red-500/30">
              <CardContent className="p-4 text-center">
                <h4 className="text-sm text-red-400 mb-2">Ընդամենը ծախսեր</h4>
                <p className="text-2xl font-bold text-red-400">{formatAMD(calculations.totalExpenses)}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-900/20 border-orange-500/30">
              <CardContent className="p-4 text-center">
                <h4 className="text-sm text-orange-400 mb-2">Ընդամենը կորուստներ</h4>
                <p className="text-2xl font-bold text-orange-400">{formatAMD(calculations.totalLosses)}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-900/20 border-yellow-500/30">
              <CardContent className="p-4 text-center">
                <h4 className="text-sm text-yellow-400 mb-2">Ընդամենը նվազեցումներ</h4>
                <p className="text-2xl font-bold text-yellow-400">{formatAMD(calculations.totalReductions)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-blue-900/20 border-blue-500/30">
              <CardContent className="p-4 text-center">
                <h4 className="text-sm text-blue-400 mb-2">Հարկվող շահույթ (կորուստ)</h4>
                <p className={`text-2xl font-bold ${calculations.taxableProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatAMD(calculations.taxableProfit)}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-900/20 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <h4 className="text-sm text-purple-400 mb-2">Ճշգրտված հարկվող շահույթ</h4>
                <p className={`text-2xl font-bold ${calculations.adjustedTaxableProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatAMD(calculations.adjustedTaxableProfit)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tax Calculations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-indigo-900/20 border-indigo-500/30">
              <CardContent className="p-4 text-center">
                <h4 className="text-sm text-indigo-400 mb-2">Հաշվարկված շահութահարկ (18%)</h4>
                <p className="text-2xl font-bold text-indigo-400">{formatAMD(calculations.calculatedProfitTax)}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-cyan-900/20 border-cyan-500/30">
              <CardContent className="p-4 text-center">
                <h4 className="text-sm text-cyan-400 mb-2">Շահութահարկ ազատումներից հետո</h4>
                <p className="text-2xl font-bold text-cyan-400">{formatAMD(calculations.finalProfitTax)}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-pink-900/20 border-pink-500/30">
              <CardContent className="p-4 text-center">
                <h4 className="text-sm text-pink-400 mb-2">Վճարման ենթակա շահութահարկ</h4>
                <p className={`text-2xl font-bold ${calculations.payableProfitTax >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatAMD(calculations.payableProfitTax)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Final Result */}
          <Card className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 border border-gold-500/50">
            <CardContent className="p-6 text-center">
              <h4 className="text-2xl font-bold text-gold-400 mb-4">Վերջնական արդյունք</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Վճարման ենթակա շահութահարկ</p>
                  <p className={`text-3xl font-bold ${calculations.payableProfitTax >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatAMD(calculations.payableProfitTax)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Հաջորդ տարիներ փոխանցվող հարկ</p>
                  <p className={`text-3xl font-bold ${calculations.transferableTax < 0 ? 'text-orange-400' : 'text-gray-400'}`}>
                    {calculations.transferableTax < 0 ? formatAMD(calculations.transferableTax) : '0 AMD'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArmenianTaxCalculator;
