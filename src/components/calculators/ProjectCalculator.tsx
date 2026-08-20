import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCalculatorTranslations, Language } from '@/lib/calculatorTranslations';

const POSITIONS_COUNT = 6;
const STAMP_DUTY_PER_POSITION = 3000;
const INCOME_TAX_RATE = 0.2;
const SOCIAL_RATE = 0.05;
const TAX_BASE_DIVISOR = 0.75;
const PROFIT_IN_SERVICE_MULTIPLIER = 0.82;
const VAT_RATE = 0.2;

interface ProjectCalculatorState {
  // ժամավճար: 6 rows, each with ժամավճար, ժամեր օրվա մեջ, օրերի քանակ ամսվա մեջ
  hourly: Array<{ rate: number; hoursPerDay: number; daysPerMonth: number }>;
  // օրավճար: 6 rows, each with օրավճար, օրերի քանակ ամսվա մեջ
  daily: Array<{ rate: number; daysPerMonth: number }>;
  // ամսավճար/հաստիք: 6 values
  monthly: number[];
  // Այլ ծախսեր 1-5
  otherExpenses: number[];
  otherExpensesComment: string;
  profitPercent: number;
  vatPayer: boolean;
}

const defaultHourly = () => Array.from({ length: POSITIONS_COUNT }, () => ({ rate: 0, hoursPerDay: 8, daysPerMonth: 22 }));
const defaultDaily = () => Array.from({ length: POSITIONS_COUNT }, () => ({ rate: 0, daysPerMonth: 22 }));
const defaultMonthly = () => Array(POSITIONS_COUNT).fill(0);
const defaultOther = () => Array(5).fill(0);

const ProjectCalculator = () => {
  const { currentLanguage } = useLanguage();
  const tCalc = getCalculatorTranslations(currentLanguage as Language);
  const locale = currentLanguage === 'hy' ? 'hy-AM' : currentLanguage === 'ru' ? 'ru-RU' : 'en-US';

  const [state, setState] = useState<ProjectCalculatorState>({
    hourly: defaultHourly(),
    daily: defaultDaily(),
    monthly: defaultMonthly(),
    otherExpenses: defaultOther(),
    otherExpensesComment: '',
    profitPercent: 13,
    vatPayer: false
  });

  const updateHourly = (index: number, field: 'rate' | 'hoursPerDay' | 'daysPerMonth', value: number) => {
    setState(s => ({
      ...s,
      hourly: s.hourly.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    }));
  };
  const updateDaily = (index: number, field: 'rate' | 'daysPerMonth', value: number) => {
    setState(s => ({
      ...s,
      daily: s.daily.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    }));
  };
  const updateMonthly = (index: number, value: number) => {
    setState(s => ({
      ...s,
      monthly: s.monthly.map((v, i) => (i === index ? value : v))
    }));
  };
  const updateOtherExpense = (index: number, value: number) => {
    setState(s => ({
      ...s,
      otherExpenses: s.otherExpenses.map((v, i) => (i === index ? value : v))
    }));
  };

  const calculations = useMemo(() => {
    const hourlyValues = state.hourly.map(
      row => (row.rate && row.hoursPerDay && row.daysPerMonth ? row.rate * row.hoursPerDay * row.daysPerMonth : 0)
    );
    const dailyValues = state.daily.map(row => (row.rate && row.daysPerMonth ? row.rate * row.daysPerMonth : 0));
    const monthlyValues = state.monthly.map(v => v || 0);

    const hourlyCount = hourlyValues.filter(v => v > 0).length;
    const dailyCount = dailyValues.filter(v => v > 0).length;
    const monthlyCount = monthlyValues.filter(v => v > 0).length;

    const hourlySum = hourlyValues.reduce((a, b) => a + b, 0);
    const dailySum = dailyValues.reduce((a, b) => a + b, 0);
    const monthlySum = monthlyValues.reduce((a, b) => a + b, 0);

    const totalPositionsCount = hourlyCount + dailyCount + monthlyCount;
    const totalSalaryFundNet = hourlySum + dailySum + monthlySum;

    const stampDuty = totalPositionsCount * STAMP_DUTY_PER_POSITION;
    const taxBase = (totalSalaryFundNet + stampDuty) / TAX_BASE_DIVISOR;
    const incomeTax = taxBase * INCOME_TAX_RATE;
    const socialContribution = taxBase * SOCIAL_RATE;
    const totalSalaryWithTaxes = totalSalaryFundNet + incomeTax + socialContribution + stampDuty;

    const totalOther = state.otherExpenses.reduce((a, b) => a + (b || 0), 0);
    const baseCost = totalSalaryWithTaxes + totalOther;
    const profitValue = baseCost * (state.profitPercent / 100);
    const serviceCostInclTaxes = baseCost + profitValue * PROFIT_IN_SERVICE_MULTIPLIER;
    const vat = state.vatPayer ? serviceCostInclTaxes * VAT_RATE : 0;
    const finalTotal = serviceCostInclTaxes + vat;

    return {
      hourlyValues,
      dailyValues,
      monthlyValues,
      hourlyCount,
      dailyCount,
      monthlyCount,
      hourlySum,
      dailySum,
      monthlySum,
      totalPositionsCount,
      totalSalaryFundNet,
      stampDuty,
      taxBase,
      incomeTax,
      socialContribution,
      totalSalaryWithTaxes,
      totalOther,
      profitValue,
      serviceCostInclTaxes,
      vat,
      finalTotal
    };
  }, [state]);

  const formatAMD = (n: number) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'AMD', minimumFractionDigits: 0 }).format(n || 0);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="bg-gradient-to-b from-gray-900 to-black border-gold-500/20">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl flex items-center gap-2">
            <FileText className="w-6 h-6" />
            {tCalc.project.title}
          </CardTitle>
          <CardDescription className="text-gray-400 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm">
            {tCalc.project.infoBanner}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Salary Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{tCalc.project.salarySectionTitle}</h3>

            {/* 3 columns: hourly, daily, monthly */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Hourly */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gold-400">{tCalc.project.hourlyTitle}</h4>
                <div className="grid grid-cols-3 gap-1 text-xs text-gray-400 mb-2">
                  <span>{tCalc.project.hourlyRate}</span>
                  <span>{tCalc.project.hourlyHoursPerDay}</span>
                  <span>{tCalc.project.hourlyDaysPerMonth}</span>
                </div>
                {state.hourly.map((row, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      value={row.rate || ''}
                      onChange={e => updateHourly(i, 'rate', Number(e.target.value) || 0)}
                      placeholder="0"
                      className="bg-blue-500/20 border-blue-500/50 text-white text-sm"
                    />
                    <Input
                      type="number"
                      value={row.hoursPerDay || ''}
                      onChange={e => updateHourly(i, 'hoursPerDay', Number(e.target.value) || 0)}
                      placeholder="8"
                      className="bg-blue-500/20 border-blue-500/50 text-white text-sm"
                    />
                    <Input
                      type="number"
                      value={row.daysPerMonth || ''}
                      onChange={e => updateHourly(i, 'daysPerMonth', Number(e.target.value) || 0)}
                      placeholder="22"
                      className="bg-blue-500/20 border-blue-500/50 text-white text-sm"
                    />
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-2">{tCalc.project.positionCostNote}</p>
                <div className="mt-2 space-y-1">
                  {calculations.hourlyValues.map((v, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-500">{tCalc.project.positionLabel} {i + 1}</span>
                      <span className="text-white font-mono">{formatAMD(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gold-400">{tCalc.project.dailyTitle}</h4>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-400 mb-2">
                  <span>{tCalc.project.dailyRate}</span>
                  <span>{tCalc.project.dailyDaysPerMonth}</span>
                </div>
                {state.daily.map((row, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={row.rate || ''}
                      onChange={e => updateDaily(i, 'rate', Number(e.target.value) || 0)}
                      placeholder="0"
                      className="bg-blue-500/20 border-blue-500/50 text-white text-sm"
                    />
                    <Input
                      type="number"
                      value={row.daysPerMonth || ''}
                      onChange={e => updateDaily(i, 'daysPerMonth', Number(e.target.value) || 0)}
                      placeholder="22"
                      className="bg-blue-500/20 border-blue-500/50 text-white text-sm"
                    />
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-2">{tCalc.project.positionCostNote}</p>
                <div className="mt-2 space-y-1">
                  {calculations.dailyValues.map((v, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-500">{tCalc.project.positionLabel} {i + 1}</span>
                      <span className="text-white font-mono">{formatAMD(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gold-400">{tCalc.project.monthlyTitle}</h4>
                <div className="text-xs text-gray-400 mb-2">{tCalc.project.monthlyRate}</div>
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <div key={i}>
                    <Label className="text-gray-500 text-xs">{tCalc.project.positionLabel} {i + 1}</Label>
                    <Input
                      type="number"
                      value={state.monthly[i] || ''}
                      onChange={e => updateMonthly(i, Number(e.target.value) || 0)}
                      className="bg-blue-500/20 border-blue-500/50 text-white text-sm mt-0.5"
                      placeholder="0"
                    />
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-2">{tCalc.project.positionCostNote}</p>
                <div className="mt-2 space-y-1">
                  {calculations.monthlyValues.map((v, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-500">{tCalc.project.positionLabel} {i + 1}</span>
                      <span className="text-white font-mono">{formatAMD(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-800/50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">{tCalc.project.statsPositionsCount}</p>
                <p className="text-white font-mono">{calculations.hourlyCount} / {calculations.dailyCount} / {calculations.monthlyCount}</p>
              </div>
              <div>
                <p className="text-gray-400">{tCalc.project.statsPositionsValues}</p>
                <p className="text-white font-mono">{formatAMD(calculations.hourlySum)} / {formatAMD(calculations.dailySum)} / {formatAMD(calculations.monthlySum)}</p>
              </div>
              <div>
                <p className="text-gray-400">{tCalc.project.totalPositionsCountLabel}</p>
                <p className="text-white font-semibold">{calculations.totalPositionsCount}</p>
              </div>
              <div>
                <p className="text-gray-400">{tCalc.project.totalSalaryFundNetLabel}</p>
                <p className="text-white font-semibold">{formatAMD(calculations.totalSalaryFundNet)}</p>
              </div>
            </div>

            {/* Taxes */}
            <div className="bg-gray-800/50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400">{tCalc.project.incomeTaxLabel}</p>
                <p className="text-red-400 font-mono">{formatAMD(calculations.incomeTax)}</p>
              </div>
              <div>
                <p className="text-gray-400">{tCalc.project.socialContributionLabel}</p>
                <p className="text-red-400 font-mono">{formatAMD(calculations.socialContribution)}</p>
              </div>
              <div>
                <p className="text-gray-400">{tCalc.project.stampDutyLabel}</p>
                <p className="text-red-400 font-mono">{formatAMD(calculations.stampDuty)} ({calculations.totalPositionsCount} × 3000)</p>
              </div>
              <div>
                <p className="text-gray-400">{tCalc.project.totalSalaryWithTaxesLabel}</p>
                <p className="text-white font-semibold">{formatAMD(calculations.totalSalaryWithTaxes)}</p>
              </div>
            </div>
          </div>

          {/* Other Expenses */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{tCalc.project.otherExpensesSectionTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {state.otherExpenses.map((val, i) => (
                <div key={i}>
                  <Label className="text-gold-400">{tCalc.project.otherExpenseLabel} {i + 1} *</Label>
                  <Input
                    type="number"
                    value={val || ''}
                    onChange={e => updateOtherExpense(i, Number(e.target.value) || 0)}
                    className="bg-blue-500/20 border-blue-500/50 text-white mt-1"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
            <div>
              <Label className="text-gray-400">{tCalc.project.otherExpensesCommentLabel}</Label>
              <Input
                type="text"
                value={state.otherExpensesComment}
                onChange={e => setState(s => ({ ...s, otherExpensesComment: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white mt-1"
                placeholder={tCalc.project.otherExpensesCommentPlaceholder}
              />
            </div>
          </div>

          {/* Profit, Service Cost, VAT, Total */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gold-400">{tCalc.project.profitPercentLabel}</Label>
                <Input
                  type="number"
                  value={state.profitPercent ?? ''}
                  onChange={e => setState(s => ({ ...s, profitPercent: Number(e.target.value) || 0 }))}
                  className="bg-blue-500/20 border-blue-500/50 text-white mt-1"
                  placeholder="13"
                />
              </div>
              <div>
                <p className="text-gray-400">{tCalc.project.profitAmountLabel}</p>
                <p className="text-green-400 font-semibold text-lg mt-1">{formatAMD(calculations.profitValue)}</p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">{tCalc.project.serviceCostInclTaxesLabel}</p>
              <p className="text-xl font-bold text-white mt-1">{formatAMD(calculations.serviceCostInclTaxes)}</p>
              <p className="text-xs text-gray-500 mt-1">{tCalc.project.serviceCostFormula}</p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <Switch checked={state.vatPayer} onCheckedChange={c => setState(s => ({ ...s, vatPayer: c }))} />
                <Label className="text-gold-400">{tCalc.project.vatPayerLabel}</Label>
              </div>
              <div>
                <p className="text-gray-400 text-sm">{tCalc.project.vatAmountLabel}</p>
                <p className="text-white font-mono">{formatAMD(calculations.vat)}</p>
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm">{tCalc.project.finalTotalLabel}</p>
                <p className="text-2xl font-bold text-gold-400">{formatAMD(calculations.finalTotal)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCalculator;
