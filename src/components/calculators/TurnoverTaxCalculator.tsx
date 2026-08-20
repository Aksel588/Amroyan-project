import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calculator, Receipt, TrendingUp, Minus, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCalculatorTranslations, Language } from '@/lib/calculatorTranslations';

interface ActivityRow {
  id: string;
  name: string;
  turnover: number;
  directCosts: number;
  adminCosts: number;
  taxRate: number;
  deductionPercent: number;
  minTaxPercent: number;
  isFixedRate: boolean;
}

interface CalculationResult {
  minTaxAmount: number;
  actualTaxPercent: number;
  taxPayable: number;
}

const INITIAL_CONFIG: Omit<ActivityRow, 'name'>[] = [
  { id: '1', turnover: 0, directCosts: 0, adminCosts: 0, taxRate: 7, deductionPercent: 5, minTaxPercent: 1.24, isFixedRate: false },
  { id: '2', turnover: 0, directCosts: 0, adminCosts: 0, taxRate: 12, deductionPercent: 9, minTaxPercent: 1.5, isFixedRate: false },
  { id: '3', turnover: 0, directCosts: 0, adminCosts: 0, taxRate: 0, deductionPercent: 2, minTaxPercent: 4, isFixedRate: false },
  { id: '4', turnover: 0, directCosts: 0, adminCosts: 0, taxRate: 5, deductionPercent: 0, minTaxPercent: 4.5, isFixedRate: false },
  { id: '5', turnover: 0, directCosts: 0, adminCosts: 0, taxRate: 1.5, deductionPercent: 1.5, minTaxPercent: 1.5, isFixedRate: false },
  { id: '6', turnover: 0, directCosts: 0, adminCosts: 0, taxRate: 10, deductionPercent: 0, minTaxPercent: 0, isFixedRate: true },
  { id: '7', turnover: 0, directCosts: 0, adminCosts: 0, taxRate: 20, deductionPercent: 0, minTaxPercent: 0, isFixedRate: true },
  { id: '8', turnover: 0, directCosts: 0, adminCosts: 0, taxRate: 20, deductionPercent: 0, minTaxPercent: 0, isFixedRate: true },
  { id: '9', turnover: 0, directCosts: 0, adminCosts: 0, taxRate: 1, deductionPercent: 0, minTaxPercent: 0, isFixedRate: true },
  { id: '10', turnover: 0, directCosts: 0, adminCosts: 0, taxRate: 10, deductionPercent: 0, minTaxPercent: 0, isFixedRate: true },
  { id: '11', turnover: 0, directCosts: 0, adminCosts: 0, taxRate: 10, deductionPercent: 0, minTaxPercent: 0, isFixedRate: true }
];

const TurnoverTaxCalculator = () => {
  const { currentLanguage } = useLanguage();
  const tCalc = getCalculatorTranslations(currentLanguage as Language);
  const locale = currentLanguage === 'hy' ? 'hy-AM' : currentLanguage === 'ru' ? 'ru-RU' : 'en-US';

  const [rowValues, setRowValues] = useState<Array<{ turnover: number; directCosts: number; adminCosts: number }>>(
    INITIAL_CONFIG.map(() => ({ turnover: 0, directCosts: 0, adminCosts: 0 }))
  );

  const activities: ActivityRow[] = useMemo(() => {
    return INITIAL_CONFIG.map((cfg, index) => ({
      ...cfg,
      name: tCalc.turnoverTax.activities[index] || `Activity ${index + 1}`,
      turnover: rowValues[index]?.turnover || 0,
      directCosts: rowValues[index]?.directCosts || 0,
      adminCosts: rowValues[index]?.adminCosts || 0,
    }));
  }, [tCalc, rowValues]);

  const updateActivity = (id: string, field: 'turnover' | 'directCosts' | 'adminCosts', value: number) => {
    const idx = parseInt(id, 10) - 1;
    if (idx >= 0 && idx < rowValues.length) {
      setRowValues(prev => {
        const next = [...prev];
        next[idx] = { ...next[idx], [field]: value };
        return next;
      });
    }
  };

  const calculateRow = (activity: ActivityRow): CalculationResult => {
    if (activity.isFixedRate) {
      const taxPayable = activity.turnover * (activity.taxRate / 100);
      return {
        minTaxAmount: 0,
        actualTaxPercent: activity.turnover > 0 ? (taxPayable / activity.turnover) * 100 : 0,
        taxPayable
      };
    }

    const calculatedTax = (activity.turnover * (activity.taxRate / 100)) - 
      ((activity.directCosts + activity.adminCosts) * (activity.deductionPercent / 100));
    
    const minTaxAmount = activity.turnover * (activity.minTaxPercent / 100);
    const taxPayable = Math.max(calculatedTax, minTaxAmount);
    const actualTaxPercent = activity.turnover > 0 ? (taxPayable / activity.turnover) * 100 : 0;

    return {
      minTaxAmount,
      actualTaxPercent,
      taxPayable
    };
  };

  const calculations = useMemo(() => {
    const results = activities.map(activity => ({
      activity,
      result: calculateRow(activity)
    }));

    const totalTurnover = activities.reduce((sum, a) => sum + a.turnover, 0);
    const totalTaxPayable = results.reduce((sum, { result }) => sum + result.taxPayable, 0);
    const overallTaxPercent = totalTurnover > 0 ? (totalTaxPayable / totalTurnover) * 100 : 0;

    return {
      results,
      totalTurnover,
      totalTaxPayable,
      overallTaxPercent
    };
  }, [activities]);

  const formatAMD = (amount: number) => 
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'AMD', minimumFractionDigits: 0 }).format(amount);

  const formatPercent = (percent: number) => `${percent.toFixed(2)}%`;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card className="bg-gradient-to-b from-gray-900 to-black border-gold-500/20">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            {tCalc.turnoverTax.title}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {tCalc.turnoverTax.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-600 text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border border-gray-600 p-3 text-left">{tCalc.turnoverTax.colActivity}</th>
                  <th className="border border-gray-600 p-3 text-center w-36">{tCalc.turnoverTax.colTurnover}</th>
                  <th className="border border-gray-600 p-3 text-center w-36">{tCalc.turnoverTax.colDirectCosts}</th>
                  <th className="border border-gray-600 p-3 text-center w-36">{tCalc.turnoverTax.colAdminCosts}</th>
                  <th className="border border-gray-600 p-3 text-center w-24">{tCalc.turnoverTax.colTaxRate}</th>
                  <th className="border border-gray-600 p-3 text-center w-24">{tCalc.turnoverTax.colDeductionPercent}</th>
                  <th className="border border-gray-600 p-3 text-center w-24">{tCalc.turnoverTax.colMinTaxPercent}</th>
                  <th className="border border-gray-600 p-3 text-center w-36">{tCalc.turnoverTax.colMinTaxAmount}</th>
                  <th className="border border-gray-600 p-3 text-center w-24">{tCalc.turnoverTax.colActualTaxPercent}</th>
                  <th className="border border-gray-600 p-3 text-center w-36">{tCalc.turnoverTax.colTaxPayable}</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => {
                  const result = calculateRow(activity);
                  return (
                    <tr key={activity.id} className={index % 2 === 0 ? 'bg-gray-900/50' : 'bg-gray-800/50'}>
                      <td className="border border-gray-600 p-3 text-white">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gold-400">{activity.id}.</span>
                          <span>{activity.name}</span>
                          {activity.isFixedRate && (
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                              {currentLanguage === 'hy' ? 'Ֆիքսված' : currentLanguage === 'ru' ? 'Фикс.' : 'Fixed'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-600 p-2">
                        <Input
                          type="number"
                          value={activity.turnover || ''}
                          onChange={(e) => updateActivity(activity.id, 'turnover', Number(e.target.value) || 0)}
                          placeholder="0"
                          className="bg-gray-700 border-gray-600 text-white text-center"
                        />
                      </td>
                      <td className="border border-gray-600 p-2">
                        {!activity.isFixedRate ? (
                          <Input
                            type="number"
                            value={activity.directCosts || ''}
                            onChange={(e) => updateActivity(activity.id, 'directCosts', Number(e.target.value) || 0)}
                            placeholder="0"
                            className="bg-gray-700 border-gray-600 text-white text-center"
                          />
                        ) : (
                          <div className="text-center text-gray-500">-</div>
                        )}
                      </td>
                      <td className="border border-gray-600 p-2">
                        {!activity.isFixedRate ? (
                          <Input
                            type="number"
                            value={activity.adminCosts || ''}
                            onChange={(e) => updateActivity(activity.id, 'adminCosts', Number(e.target.value) || 0)}
                            placeholder="0"
                            className="bg-gray-700 border-gray-600 text-white text-center"
                          />
                        ) : (
                          <div className="text-center text-gray-500">-</div>
                        )}
                      </td>
                      <td className="border border-gray-600 p-3 text-center text-white">
                        {formatPercent(activity.taxRate)}
                      </td>
                      <td className="border border-gray-600 p-3 text-center text-white">
                        {activity.isFixedRate ? '-' : formatPercent(activity.deductionPercent)}
                      </td>
                      <td className="border border-gray-600 p-3 text-center text-white">
                        {activity.isFixedRate ? '-' : formatPercent(activity.minTaxPercent)}
                      </td>
                      <td className="border border-gray-600 p-3 text-center text-white font-mono">
                        {activity.isFixedRate ? '-' : formatAMD(result.minTaxAmount)}
                      </td>
                      <td className="border border-gray-600 p-3 text-center text-blue-400 font-semibold">
                        {formatPercent(result.actualTaxPercent)}
                      </td>
                      <td className="border border-gray-600 p-3 text-center text-green-400 font-semibold">
                        {formatAMD(result.taxPayable)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 text-center">
                <h4 className="text-sm text-gray-400 mb-2">{tCalc.turnoverTax.totalTurnover}</h4>
                <p className="text-2xl font-bold text-white">{formatAMD(calculations.totalTurnover)}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 text-center">
                <h4 className="text-sm text-gray-400 mb-2">{tCalc.turnoverTax.totalTaxPayable}</h4>
                <p className="text-2xl font-bold text-green-400">{formatAMD(calculations.totalTaxPayable)}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 text-center">
                <h4 className="text-sm text-gray-400 mb-2">{tCalc.turnoverTax.colActualTaxPercent}</h4>
                <p className="text-2xl font-bold text-blue-400">{formatPercent(calculations.overallTaxPercent)}</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-b from-gray-900 to-black border-gold-500/20">
        <CardHeader>
          <CardTitle className="gradient-text text-xl flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            {currentLanguage === 'hy' ? 'Մանրամասն հաշվարկներ' : currentLanguage === 'ru' ? 'Подробные расчеты' : 'Detailed Calculations'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {calculations.results.map(({ activity, result }) => (
              <div key={activity.id} className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-3">
                  {activity.name} {activity.isFixedRate && <span className="text-blue-400 text-sm">({currentLanguage === 'hy' ? 'Ֆիքսված դրույքաչափ' : currentLanguage === 'ru' ? 'Фиксированная ставка' : 'Fixed Rate'})</span>}
                </h4>
                
                {activity.isFixedRate ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{tCalc.turnoverTax.colTurnover}:</span>
                      <span className="text-white">{formatAMD(activity.turnover)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{tCalc.turnoverTax.colTaxRate}:</span>
                      <span className="text-white">{formatPercent(activity.taxRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{currentLanguage === 'hy' ? 'Հարկի հաշվարկ' : currentLanguage === 'ru' ? 'Расчет налога' : 'Tax Calculation'}:</span>
                      <span className="text-white">{formatAMD(activity.turnover)} × {formatPercent(activity.taxRate)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-green-400">{tCalc.turnoverTax.colTaxPayable}:</span>
                      <span className="text-green-400">{formatAMD(result.taxPayable)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{tCalc.turnoverTax.colTurnover}:</span>
                      <span className="text-white">{formatAMD(activity.turnover)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{tCalc.turnoverTax.colDirectCosts}:</span>
                      <span className="text-white">{formatAMD(activity.directCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{tCalc.turnoverTax.colAdminCosts}:</span>
                      <span className="text-white">{formatAMD(activity.adminCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{tCalc.turnoverTax.colTaxRate}:</span>
                      <span className="text-white">{formatPercent(activity.taxRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{tCalc.turnoverTax.colDeductionPercent}:</span>
                      <span className="text-white">{formatPercent(activity.deductionPercent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{tCalc.turnoverTax.colMinTaxPercent}:</span>
                      <span className="text-white">{formatPercent(activity.minTaxPercent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{currentLanguage === 'hy' ? 'Հաշվարկված հարկ' : currentLanguage === 'ru' ? 'Начисленный налог' : 'Calculated Tax'}:</span>
                      <span className="text-white">
                        ({formatAMD(activity.turnover)} × {formatPercent(activity.taxRate)}) - 
                        (({formatAMD(activity.directCosts)} + {formatAMD(activity.adminCosts)}) × {formatPercent(activity.deductionPercent)})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{tCalc.turnoverTax.colMinTaxAmount}:</span>
                      <span className="text-white">{formatAMD(result.minTaxAmount)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-green-400">{tCalc.turnoverTax.colTaxPayable}:</span>
                      <span className="text-green-400">{formatAMD(result.taxPayable)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-blue-400">{tCalc.turnoverTax.colActualTaxPercent}:</span>
                      <span className="text-blue-400">{formatPercent(result.actualTaxPercent)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Final Summary */}
          <div className="mt-6 p-6 bg-gradient-to-r from-gold-500/20 to-gold-600/20 border border-gold-500/50 rounded-lg text-center">
            <h4 className="text-2xl font-bold text-gold-400 mb-4">Եռամսյակային շրջանառության հարկ</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Ընդհանուր շրջանառություն</p>
                <p className="text-xl font-bold text-white">{formatAMD(calculations.totalTurnover)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Ընդհանուր հարկ</p>
                <p className="text-xl font-bold text-green-400">{formatAMD(calculations.totalTaxPayable)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Ընդհանուր հարկի %</p>
                <p className="text-xl font-bold text-blue-400">{formatPercent(calculations.overallTaxPercent)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TurnoverTaxCalculator;
