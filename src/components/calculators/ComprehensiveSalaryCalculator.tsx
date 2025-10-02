import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Calculator } from 'lucide-react';

interface Position {
  id: string;
  type: 'hourly' | 'daily' | 'monthly';
  hourlyRate?: number;
  hoursPerDay?: number;
  daysPerMonth?: number;
  dailyRate?: number;
  monthlySalary?: number;
}

interface Expense {
  id: string;
  name: string;
  value: number;
}

interface CalculationResults {
  salaryFundNet: number;
  positionsCount: number;
  stampDuty: number;
  grossAmount: number;
  incomeTax: number;
  socialPayment: number;
  totalSalaryWithTaxes: number;
  expensesTotal: number;
  profitValue: number;
  serviceValue: number;
  vat: number;
  finalTotal: number;
}

const ComprehensiveSalaryCalculator = () => {
  const [positions, setPositions] = useState<Position[]>([
    { id: '1', type: 'monthly', monthlySalary: 300000 }
  ]);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', name: '', value: 0 }
  ]);
  const [profitPercent, setProfitPercent] = useState<number>(20);
  const [vatPayer, setVatPayer] = useState<boolean>(false);

  const addPosition = (type: 'hourly' | 'daily' | 'monthly') => {
    if (positions.length >= 6) return;
    const newPosition: Position = {
      id: Date.now().toString(),
      type,
      ...(type === 'hourly' && { hourlyRate: 0, hoursPerDay: 8, daysPerMonth: 22 }),
      ...(type === 'daily' && { dailyRate: 0, daysPerMonth: 22 }),
      ...(type === 'monthly' && { monthlySalary: 0 })
    };
    setPositions([...positions, newPosition]);
  };

  const removePosition = (id: string) => {
    if (positions.length <= 1) return;
    setPositions(positions.filter(p => p.id !== id));
  };

  const updatePosition = (id: string, field: keyof Position, value: any) => {
    setPositions(positions.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const addExpense = () => {
    if (expenses.length >= 5) return;
    setExpenses([...expenses, { id: Date.now().toString(), name: '', value: 0 }]);
  };

  const removeExpense = (id: string) => {
    if (expenses.length <= 1) return;
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const updateExpense = (id: string, field: keyof Expense, value: any) => {
    setExpenses(expenses.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const calculations = useMemo((): CalculationResults => {
    // A. Salary Fund (Net)
    let salaryFundNet = 0;
    let positionsCount = 0;

    positions.forEach(position => {
      if (position.type === 'hourly' && position.hourlyRate && position.hoursPerDay && position.daysPerMonth) {
        const salary = position.hourlyRate * position.hoursPerDay * position.daysPerMonth;
        salaryFundNet += salary;
        positionsCount++;
      } else if (position.type === 'daily' && position.dailyRate && position.daysPerMonth) {
        const salary = position.dailyRate * position.daysPerMonth;
        salaryFundNet += salary;
        positionsCount++;
      } else if (position.type === 'monthly' && position.monthlySalary) {
        salaryFundNet += position.monthlySalary;
        positionsCount++;
      }
    });

    // B. Taxes
    const stampDuty = positionsCount * 3000;
    const grossAmount = (salaryFundNet + stampDuty) / 0.75;
    const incomeTax = grossAmount * 0.20;
    const socialPayment = grossAmount * 0.05;
    const totalSalaryWithTaxes = salaryFundNet + incomeTax + socialPayment + stampDuty;

    // C. Other Costs
    const expensesTotal = expenses.reduce((sum, expense) => sum + (expense.value || 0), 0);

    // D. Profit
    const profitValue = (totalSalaryWithTaxes + expensesTotal) * (profitPercent / 100);

    // E. Service Value (Including Taxes)
    const serviceValue = totalSalaryWithTaxes + expensesTotal + (profitValue * 0.82);

    // F. VAT
    const vat = vatPayer ? serviceValue * 0.20 : 0;

    // G. Final Total
    const finalTotal = serviceValue + vat;

    return {
      salaryFundNet,
      positionsCount,
      stampDuty,
      grossAmount,
      incomeTax,
      socialPayment,
      totalSalaryWithTaxes,
      expensesTotal,
      profitValue,
      serviceValue,
      vat,
      finalTotal
    };
  }, [positions, expenses, profitPercent, vatPayer]);

  const formatAMD = (amount: number) => 
    new Intl.NumberFormat('hy-AM', { 
      style: 'currency', 
      currency: 'AMD', 
      minimumFractionDigits: 0 
    }).format(amount);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="bg-gradient-to-b from-gray-900 to-black border-gold-500/20">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl">Աշխատավարձի հաշվիչ</CardTitle>
          <CardDescription className="text-gray-400">
            Հաշվեք աշխատավարձի ֆոնդը, հարկերը, ծախսերը և վերջնական գինը
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Salary Positions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Աշխատավարձի դիրքեր</h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addPosition('hourly')}
                  disabled={positions.length >= 6}
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Ժամավճար
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addPosition('daily')}
                  disabled={positions.length >= 6}
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Օրավճար
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addPosition('monthly')}
                  disabled={positions.length >= 6}
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Ամսավճար
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {positions.map((position, index) => (
                <Card key={position.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-white">
                        {position.type === 'hourly' && 'Ժամավճարային դիրք'}
                        {position.type === 'daily' && 'Օրավճարային դիրք'}
                        {position.type === 'monthly' && 'Ամսավճարային դիրք'}
                      </h4>
                      {positions.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePosition(position.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {position.type === 'hourly' && (
                        <>
                          <div>
                            <Label className="text-gold-400">Ժամավճար (AMD)</Label>
                            <Input
                              type="number"
                              value={position.hourlyRate || ''}
                              onChange={(e) => updatePosition(position.id, 'hourlyRate', Number(e.target.value))}
                              placeholder="0"
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-gold-400">ժամ/օր</Label>
                            <Input
                              type="number"
                              value={position.hoursPerDay || ''}
                              onChange={(e) => updatePosition(position.id, 'hoursPerDay', Number(e.target.value))}
                              placeholder="8"
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-gold-400">օր/ամիս</Label>
                            <Input
                              type="number"
                              value={position.daysPerMonth || ''}
                              onChange={(e) => updatePosition(position.id, 'daysPerMonth', Number(e.target.value))}
                              placeholder="22"
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                        </>
                      )}

                      {position.type === 'daily' && (
                        <>
                          <div>
                            <Label className="text-gold-400">Օրավճար (AMD)</Label>
                            <Input
                              type="number"
                              value={position.dailyRate || ''}
                              onChange={(e) => updatePosition(position.id, 'dailyRate', Number(e.target.value))}
                              placeholder="0"
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-gold-400">օր/ամիս</Label>
                            <Input
                              type="number"
                              value={position.daysPerMonth || ''}
                              onChange={(e) => updatePosition(position.id, 'daysPerMonth', Number(e.target.value))}
                              placeholder="22"
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                        </>
                      )}

                      {position.type === 'monthly' && (
                        <div>
                          <Label className="text-gold-400">Ամսական աշխատավարձ (AMD)</Label>
                          <Input
                            type="number"
                            value={position.monthlySalary || ''}
                            onChange={(e) => updatePosition(position.id, 'monthlySalary', Number(e.target.value))}
                            placeholder="0"
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Other Expenses Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Այլ ծախսեր</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExpense}
                disabled={expenses.length >= 5}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Ավելացնել ծախս
              </Button>
            </div>

            <div className="grid gap-4">
              {expenses.map((expense, index) => (
                <Card key={expense.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-white">Ծախս #{index + 1}</h4>
                      {expenses.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExpense(expense.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gold-400">Ծախսի անվանում</Label>
                        <Input
                          type="text"
                          value={expense.name}
                          onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                          placeholder="Օրինակ՝ վարձակալություն"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gold-400">Գումար (AMD)</Label>
                        <Input
                          type="number"
                          value={expense.value || ''}
                          onChange={(e) => updateExpense(expense.id, 'value', Number(e.target.value))}
                          placeholder="0"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Settings Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-gold-400">Շահույթի մարժա (%)</Label>
              <Input
                type="number"
                value={profitPercent}
                onChange={(e) => setProfitPercent(Number(e.target.value))}
                placeholder="20"
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Switch
                checked={vatPayer}
                onCheckedChange={setVatPayer}
              />
              <div>
                <Label className="text-gold-400">ԱԱՀ վճարող</Label>
                <p className="text-xs text-gray-400">Ստուգեք, եթե դուք ԱԱՀ վճարող եք</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="bg-gradient-to-b from-gray-900 to-black border-gold-500/20">
        <CardHeader>
          <CardTitle className="gradient-text text-xl flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Հաշվարկի արդյունքներ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Salary Fund */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-2">Աշխատավարձի ֆոնդ (մաքուր)</h4>
              <p className="text-xl font-bold text-white">{formatAMD(calculations.salaryFundNet)}</p>
              <p className="text-xs text-gray-500 mt-1">{calculations.positionsCount} դիրք</p>
            </div>

            {/* Taxes */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-2">Դրոշմանիշային վճար</h4>
              <p className="text-xl font-bold text-red-400">{formatAMD(calculations.stampDuty)}</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-2">Եկամտային հարկ (20%)</h4>
              <p className="text-xl font-bold text-red-400">{formatAMD(calculations.incomeTax)}</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-2">Կենսաթոշակային վճար (5%)</h4>
              <p className="text-xl font-bold text-red-400">{formatAMD(calculations.socialPayment)}</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-2">Աշխատավարձ հարկերով</h4>
              <p className="text-xl font-bold text-orange-400">{formatAMD(calculations.totalSalaryWithTaxes)}</p>
            </div>

            {/* Expenses */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-2">Այլ ծախսեր</h4>
              <p className="text-xl font-bold text-yellow-400">{formatAMD(calculations.expensesTotal)}</p>
            </div>

            {/* Profit */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-2">Շահույթ ({profitPercent}%)</h4>
              <p className="text-xl font-bold text-green-400">{formatAMD(calculations.profitValue)}</p>
            </div>

            {/* Service Value */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-2">Ծառայության արժեք</h4>
              <p className="text-xl font-bold text-blue-400">{formatAMD(calculations.serviceValue)}</p>
            </div>

            {/* VAT */}
            {vatPayer && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-sm text-gray-400 mb-2">ԱԱՀ (20%)</h4>
                <p className="text-xl font-bold text-purple-400">{formatAMD(calculations.vat)}</p>
              </div>
            )}

            {/* Final Total */}
            <div className={`p-4 rounded-lg ${vatPayer ? 'md:col-span-2 lg:col-span-3' : 'md:col-span-2 lg:col-span-2'}`}>
              <h4 className="text-sm text-gray-400 mb-2">Վերջնական գումար</h4>
              <p className="text-3xl font-bold text-gold-400">{formatAMD(calculations.finalTotal)}</p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h4 className="text-lg font-semibold text-white mb-4">Մանրամասն հաշվարկ</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Աշխատավարձի ֆոնդ (մաքուր):</span>
                <span className="text-white">{formatAMD(calculations.salaryFundNet)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Դրոշմանիշային վճար ({calculations.positionsCount} × 3000):</span>
                <span className="text-white">{formatAMD(calculations.stampDuty)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Գրոս գումար (հարկային բազա):</span>
                <span className="text-white">{formatAMD(calculations.grossAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Եկամտային հարկ (20%):</span>
                <span className="text-white">{formatAMD(calculations.incomeTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Կենսաթոշակային վճար (5%):</span>
                <span className="text-white">{formatAMD(calculations.socialPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Այլ ծախսեր:</span>
                <span className="text-white">{formatAMD(calculations.expensesTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Շահույթ ({profitPercent}%):</span>
                <span className="text-white">{formatAMD(calculations.profitValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ծառայության արժեք (82% շահույթով):</span>
                <span className="text-white">{formatAMD(calculations.serviceValue)}</span>
              </div>
              {vatPayer && (
                <div className="flex justify-between">
                  <span className="text-gray-400">ԱԱՀ (20%):</span>
                  <span className="text-white">{formatAMD(calculations.vat)}</span>
                </div>
              )}
              <Separator className="bg-gray-600 my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gold-400">Վերջնական գումար:</span>
                <span className="text-gold-400">{formatAMD(calculations.finalTotal)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveSalaryCalculator;
