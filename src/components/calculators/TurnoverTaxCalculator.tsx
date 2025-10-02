import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calculator, Receipt, TrendingUp, Minus, Plus } from 'lucide-react';

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

const TurnoverTaxCalculator = () => {
  const [activities, setActivities] = useState<ActivityRow[]>([
    {
      id: '1',
      name: 'Առևտուր',
      turnover: 0,
      directCosts: 0,
      adminCosts: 0,
      taxRate: 1.5,
      deductionPercent: 0.3,
      minTaxPercent: 0.5,
      isFixedRate: false
    },
    {
      id: '2',
      name: 'Արտադրություն',
      turnover: 0,
      directCosts: 0,
      adminCosts: 0,
      taxRate: 1.5,
      deductionPercent: 0.3,
      minTaxPercent: 0.5,
      isFixedRate: false
    },
    {
      id: '3',
      name: 'Հասարակական սնունդ',
      turnover: 0,
      directCosts: 0,
      adminCosts: 0,
      taxRate: 1.5,
      deductionPercent: 0.3,
      minTaxPercent: 0.5,
      isFixedRate: false
    },
    {
      id: '4',
      name: 'Այլ գործունեություն',
      turnover: 0,
      directCosts: 0,
      adminCosts: 0,
      taxRate: 1.5,
      deductionPercent: 0.3,
      minTaxPercent: 0.5,
      isFixedRate: false
    },
    {
      id: '5',
      name: 'Ծառայություններ',
      turnover: 0,
      directCosts: 0,
      adminCosts: 0,
      taxRate: 1.5,
      deductionPercent: 0.3,
      minTaxPercent: 0.5,
      isFixedRate: false
    },
    {
      id: '6',
      name: 'Ավտոմոբիլային տրանսպորտ',
      turnover: 0,
      directCosts: 0,
      adminCosts: 0,
      taxRate: 0.5,
      deductionPercent: 0,
      minTaxPercent: 0,
      isFixedRate: true
    },
    {
      id: '7',
      name: 'Ոչ ավտոմոբիլային տրանսպորտ',
      turnover: 0,
      directCosts: 0,
      adminCosts: 0,
      taxRate: 0.5,
      deductionPercent: 0,
      minTaxPercent: 0,
      isFixedRate: true
    },
    {
      id: '8',
      name: 'Կապի ծառայություններ',
      turnover: 0,
      directCosts: 0,
      adminCosts: 0,
      taxRate: 0.5,
      deductionPercent: 0,
      minTaxPercent: 0,
      isFixedRate: true
    },
    {
      id: '9',
      name: 'Արտաքին առևտուր',
      turnover: 0,
      directCosts: 0,
      adminCosts: 0,
      taxRate: 0.5,
      deductionPercent: 0,
      minTaxPercent: 0,
      isFixedRate: true
    },
    {
      id: '10',
      name: 'Այլ ֆիքսված դրույքաչափով',
      turnover: 0,
      directCosts: 0,
      adminCosts: 0,
      taxRate: 0.5,
      deductionPercent: 0,
      minTaxPercent: 0,
      isFixedRate: true
    },
    {
      id: '11',
      name: 'Այլ ֆիքսված դրույքաչափով 2',
      turnover: 0,
      directCosts: 0,
      adminCosts: 0,
      taxRate: 0.5,
      deductionPercent: 0,
      minTaxPercent: 0,
      isFixedRate: true
    }
  ]);

  const updateActivity = (id: string, field: keyof ActivityRow, value: any) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, [field]: value } : activity
    ));
  };

  const calculateRow = (activity: ActivityRow): CalculationResult => {
    if (activity.isFixedRate) {
      // Rows 6-11: Fixed Rate Activities
      const taxPayable = activity.turnover * (activity.taxRate / 100);
      return {
        minTaxAmount: 0,
        actualTaxPercent: activity.taxRate,
        taxPayable
      };
    } else {
      // Rows 1-5: Calculated with deductions and minimum check
      const calculatedTax = (activity.turnover * (activity.taxRate / 100)) - 
                           ((activity.directCosts + activity.adminCosts) * (activity.deductionPercent / 100));
      const minTaxAmount = activity.turnover * (activity.minTaxPercent / 100);
      
      const taxPayable = calculatedTax > minTaxAmount ? calculatedTax : minTaxAmount;
      const actualTaxPercent = activity.turnover > 0 ? (taxPayable / activity.turnover) * 100 : 0;
      
      return {
        minTaxAmount,
        actualTaxPercent,
        taxPayable
      };
    }
  };

  const calculations = useMemo(() => {
    const results = activities.map(activity => ({
      activity,
      result: calculateRow(activity)
    }));

    const totalTaxPayable = results.reduce((sum, item) => sum + item.result.taxPayable, 0);
    const totalTurnover = activities.reduce((sum, activity) => sum + activity.turnover, 0);
    const overallTaxPercent = totalTurnover > 0 ? (totalTaxPayable / totalTurnover) * 100 : 0;

    return {
      results,
      totalTaxPayable,
      totalTurnover,
      overallTaxPercent
    };
  }, [activities]);

  const formatAMD = (amount: number) => 
    new Intl.NumberFormat('hy-AM', { 
      style: 'currency', 
      currency: 'AMD', 
      minimumFractionDigits: 0 
    }).format(amount);

  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card className="bg-gradient-to-b from-gray-900 to-black border-gold-500/20">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl flex items-center gap-2">
            <Receipt className="w-6 h-6" />
            Շրջանառության հարկի հաշվիչ
          </CardTitle>
          <CardDescription className="text-gray-400">
            Հաշվեք եռամսյակային շրջանառության հարկը՝ տարբեր գործունեության տեսակների համար
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Հաշվարկի կարգ</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• <strong>Տողեր 1-5:</strong> Հաշվարկվում է հարկը՝ հանելով ծախսերը և ստուգելով նվազագույն հարկը</p>
              <p>• <strong>Տողեր 6-11:</strong> Ֆիքսված դրույքաչափով պարզ բազմապատկում</p>
              <p>• <strong>Մուտքագրեք:</strong> Շրջանառություն, ինքնարժեք և վարչական ծախսեր (միայն 1-5 տողերի համար)</p>
            </div>
          </div>

          {/* Activities Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-600 p-3 text-left text-gold-400 font-semibold">Գործունեության տեսակ</th>
                  <th className="border border-gray-600 p-3 text-center text-gold-400 font-semibold">Շրջանառություն (AMD)</th>
                  <th className="border border-gray-600 p-3 text-center text-gold-400 font-semibold">Ինքնարժեք (AMD)</th>
                  <th className="border border-gray-600 p-3 text-center text-gold-400 font-semibold">Վարչական ծախսեր (AMD)</th>
                  <th className="border border-gray-600 p-3 text-center text-gold-400 font-semibold">Հարկի դրույքաչափ (%)</th>
                  <th className="border border-gray-600 p-3 text-center text-gold-400 font-semibold">Ծախսերի հանում (%)</th>
                  <th className="border border-gray-600 p-3 text-center text-gold-400 font-semibold">Նվազագույն հարկ (%)</th>
                  <th className="border border-gray-600 p-3 text-center text-gold-400 font-semibold">Նվազագույն հարկ (AMD)</th>
                  <th className="border border-gray-600 p-3 text-center text-gold-400 font-semibold">Իրական %</th>
                  <th className="border border-gray-600 p-3 text-center text-gold-400 font-semibold">Վճարման ենթակա հարկ (AMD)</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, index) => {
                  const result = calculateRow(activity);
                  return (
                    <tr key={activity.id} className={index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-900/50'}>
                      <td className="border border-gray-600 p-3 text-white font-medium">
                        {activity.name}
                        {activity.isFixedRate && (
                          <span className="ml-2 text-xs text-blue-400">(Ֆիքսված)</span>
                        )}
                      </td>
                      <td className="border border-gray-600 p-2">
                        <Input
                          type="number"
                          value={activity.turnover || ''}
                          onChange={(e) => updateActivity(activity.id, 'turnover', Number(e.target.value))}
                          placeholder="0"
                          className="bg-gray-700 border-gray-600 text-white text-center"
                        />
                      </td>
                      <td className="border border-gray-600 p-2">
                        <Input
                          type="number"
                          value={activity.directCosts || ''}
                          onChange={(e) => updateActivity(activity.id, 'directCosts', Number(e.target.value))}
                          placeholder="0"
                          disabled={activity.isFixedRate}
                          className="bg-gray-700 border-gray-600 text-white text-center disabled:opacity-50"
                        />
                      </td>
                      <td className="border border-gray-600 p-2">
                        <Input
                          type="number"
                          value={activity.adminCosts || ''}
                          onChange={(e) => updateActivity(activity.id, 'adminCosts', Number(e.target.value))}
                          placeholder="0"
                          disabled={activity.isFixedRate}
                          className="bg-gray-700 border-gray-600 text-white text-center disabled:opacity-50"
                        />
                      </td>
                      <td className="border border-gray-600 p-3 text-center text-gray-300">
                        {formatPercent(activity.taxRate)}
                      </td>
                      <td className="border border-gray-600 p-3 text-center text-gray-300">
                        {activity.isFixedRate ? '-' : formatPercent(activity.deductionPercent)}
                      </td>
                      <td className="border border-gray-600 p-3 text-center text-gray-300">
                        {activity.isFixedRate ? '-' : formatPercent(activity.minTaxPercent)}
                      </td>
                      <td className="border border-gray-600 p-3 text-center text-orange-400 font-semibold">
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

          {/* Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 text-center">
                <h4 className="text-sm text-gray-400 mb-2">Ընդհանուր շրջանառություն</h4>
                <p className="text-2xl font-bold text-white">{formatAMD(calculations.totalTurnover)}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 text-center">
                <h4 className="text-sm text-gray-400 mb-2">Ընդհանուր հարկ</h4>
                <p className="text-2xl font-bold text-green-400">{formatAMD(calculations.totalTaxPayable)}</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 text-center">
                <h4 className="text-sm text-gray-400 mb-2">Ընդհանուր հարկի %</h4>
                <p className="text-2xl font-bold text-blue-400">{formatPercent(calculations.overallTaxPercent)}</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card className="bg-gradient-to-b from-gray-900 to-black border-gold-500/20">
        <CardHeader>
          <CardTitle className="gradient-text text-xl flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Մանրամասն հաշվարկներ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {calculations.results.map(({ activity, result }, index) => (
              <div key={activity.id} className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-3">
                  {activity.name} {activity.isFixedRate && <span className="text-blue-400 text-sm">(Ֆիքսված դրույքաչափ)</span>}
                </h4>
                
                {activity.isFixedRate ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Շրջանառություն:</span>
                      <span className="text-white">{formatAMD(activity.turnover)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Հարկի դրույքաչափ:</span>
                      <span className="text-white">{formatPercent(activity.taxRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Հարկի հաշվարկ:</span>
                      <span className="text-white">{formatAMD(activity.turnover)} × {formatPercent(activity.taxRate)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-green-400">Վճարման ենթակա հարկ:</span>
                      <span className="text-green-400">{formatAMD(result.taxPayable)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Շրջանառություն:</span>
                      <span className="text-white">{formatAMD(activity.turnover)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ինքնարժեք:</span>
                      <span className="text-white">{formatAMD(activity.directCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Վարչական ծախսեր:</span>
                      <span className="text-white">{formatAMD(activity.adminCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Հարկի դրույքաչափ:</span>
                      <span className="text-white">{formatPercent(activity.taxRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ծախսերի հանում:</span>
                      <span className="text-white">{formatPercent(activity.deductionPercent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Նվազագույն հարկ:</span>
                      <span className="text-white">{formatPercent(activity.minTaxPercent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Հաշվարկված հարկ:</span>
                      <span className="text-white">
                        ({formatAMD(activity.turnover)} × {formatPercent(activity.taxRate)}) - 
                        (({formatAMD(activity.directCosts)} + {formatAMD(activity.adminCosts)}) × {formatPercent(activity.deductionPercent)})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Նվազագույն հարկի գումար:</span>
                      <span className="text-white">{formatAMD(result.minTaxAmount)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-green-400">Վճարման ենթակա հարկ:</span>
                      <span className="text-green-400">{formatAMD(result.taxPayable)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-blue-400">Իրական հարկի %:</span>
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
