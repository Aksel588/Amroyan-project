import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Calculator, DollarSign, TrendingUp, TrendingDown, Users, Receipt, FileText } from 'lucide-react';

interface PayrollCalculation {
  grossSalary: number;
  netSalary: number;
  incomeTax: number;
  socialContribution: number;
  stampDuty: number;
  totalDeductions: number;
}

const ArmenianPayrollCalculator = () => {
  const [calculationType, setCalculationType] = useState<'dirty-to-net' | 'net-to-dirty'>('dirty-to-net');
  const [isSocialPayer, setIsSocialPayer] = useState(true);
  const [isITCompany, setIsITCompany] = useState(false);
  const [inputAmount, setInputAmount] = useState<number>(0);

  // Calculate stamp duty based on salary amount and social payer status
  const calculateStampDuty = (salary: number, isSocialPayer: boolean, isNetSalary: boolean = false): number => {
    if (salary === 0) return 0;

    // Different thresholds for different scenarios
    if (isNetSalary) {
      // Net salary thresholds
      if (isSocialPayer) {
        if (salary <= 100000) return 1500;
        if (salary <= 200000) return 3000;
        if (salary <= 500000) return 5500;
        if (salary <= 1000000) return 8500;
        return 15000;
      } else {
        if (salary <= 100000) return 1500;
        if (salary <= 200000) return 3000;
        if (salary <= 500000) return 5500;
        if (salary <= 1000000) return 8500;
        return 15000;
      }
    } else {
      // Gross salary thresholds
      if (salary <= 100000) return 1500;
      if (salary <= 200000) return 3000;
      if (salary <= 500000) return 5500;
      if (salary <= 1000000) return 8500;
      return 15000;
    }
  };

  // Calculate social contribution (pension system) based on gross salary
  const calculateSocialContribution = (grossSalary: number): number => {
    if (!isSocialPayer) return 0;
    
    // Mandatory participants (born 1974 or later)
    if (grossSalary < 500000) {
      return grossSalary * 0.05; // 5% paid by individual
    } else if (grossSalary < 1125000) {
      return (grossSalary * 0.10) - 25000; // 10% - 25,000 (state pays 25,000)
    } else {
      return 87500; // Fixed amount (state pays 25,000, participant pays 87,500)
    }
  };

  // Calculate income tax (20% for regular, 10% for IT companies)
  const calculateIncomeTax = (grossSalary: number): number => {
    return grossSalary * (isITCompany ? 0.10 : 0.20);
  };

  // Dirty to Net calculation
  const calculateDirtyToNet = (grossSalary: number): PayrollCalculation => {
    const incomeTax = calculateIncomeTax(grossSalary);
    const socialContribution = calculateSocialContribution(grossSalary);
    const stampDuty = calculateStampDuty(grossSalary, isSocialPayer, false);
    
    const totalDeductions = incomeTax + socialContribution + stampDuty;
    const netSalary = grossSalary - totalDeductions;

    return {
      grossSalary,
      netSalary,
      incomeTax,
      socialContribution,
      stampDuty,
      totalDeductions
    };
  };

  // Net to Dirty calculation
  const calculateNetToDirty = (netSalary: number): PayrollCalculation => {
    const stampDuty = calculateStampDuty(netSalary, isSocialPayer, true);
    
    let grossSalary: number;
    const taxRate = isITCompany ? 0.10 : 0.20;
    
    if (isSocialPayer) {
      // With social contributions
      if (netSalary < 500000) {
        // 5% social contribution
        grossSalary = (netSalary + stampDuty) / (1 - taxRate - 0.05);
      } else if (netSalary < 1125000) {
        // 10% social contribution with state subsidy
        grossSalary = (netSalary + stampDuty + 25000) / (1 - taxRate - 0.10);
      } else {
        // Fixed social contribution
        grossSalary = (netSalary + stampDuty + 87500) / (1 - taxRate);
      }
    } else {
      // For non-social payers
      grossSalary = (netSalary + stampDuty) / (1 - taxRate);
    }

    const incomeTax = calculateIncomeTax(grossSalary);
    const socialContribution = calculateSocialContribution(grossSalary);
    const totalDeductions = incomeTax + socialContribution + stampDuty;

    return {
      grossSalary,
      netSalary,
      incomeTax,
      socialContribution,
      stampDuty,
      totalDeductions
    };
  };

  // Main calculation
  const calculation = useMemo((): PayrollCalculation => {
    if (inputAmount <= 0) {
      return {
        grossSalary: 0,
        netSalary: 0,
        incomeTax: 0,
        socialContribution: 0,
        stampDuty: 0,
        totalDeductions: 0
      };
    }

    if (calculationType === 'dirty-to-net') {
      return calculateDirtyToNet(inputAmount);
    } else {
      return calculateNetToDirty(inputAmount);
    }
  }, [inputAmount, calculationType, isSocialPayer, isITCompany]);

  const formatAMD = (amount: number): string => {
    return new Intl.NumberFormat('hy-AM', {
      style: 'currency',
      currency: 'AMD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCalculationTypeLabel = () => {
    return calculationType === 'dirty-to-net' ? 'Կեղտոտ → Մաքուր' : 'Մաքուր → Կեղտոտ';
  };

  const getInputLabel = () => {
    return calculationType === 'dirty-to-net' ? 'Կեղտոտ աշխատավարձ (AMD)' : 'Մաքուր աշխատավարձ (AMD)';
  };

  const getOutputLabel = () => {
    return calculationType === 'dirty-to-net' ? 'Մաքուր աշխատավարձ' : 'Կեղտոտ աշխատավարձ';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8">
      <div className="container mx-auto px-4">
        <Card className="bg-gradient-to-br from-gray-900 to-black border-gold-500/20 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gold-500/20 rounded-full">
                <Calculator className="w-8 h-8 text-gold-400" />
              </div>
              <CardTitle className="text-3xl font-bold text-white">
                Հայաստանի աշխատավարձի հաշվիչ
              </CardTitle>
            </div>
            <CardDescription className="text-gray-400 text-lg">
              Հաշվեք կեղտոտ/մաքուր աշխատավարձը՝ եկամտահարկ, սոցիալական վճարներ և դրոշմանիշային վճար
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Instructions */}
            <div className="bg-gold-900/20 border border-gold-500/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gold-400 mb-4">Հաշվարկի կարգ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Կեղտոտ → Մաքուր</h4>
                  <div className="text-sm text-gray-300 space-y-2">
                    <p>• <strong>Եկամտահարկ:</strong> 20% (կամ 10% IT ընկերությունների համար)</p>
                    <p>• <strong>Պարտադիր կուտակային:</strong> 5%, 10%-25,000, կամ 87,500</p>
                    <p>• <strong>Դրոշմանիշային վճար:</strong> 1,500-15,000 AMD</p>
                    <p>• <strong>Մաքուր =</strong> Կեղտոտ - Բոլոր վճարներ</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Մաքուր → Կեղտոտ</h4>
                  <div className="text-sm text-gray-300 space-y-2">
                    <p>• <strong>Դրոշմանիշային վճար:</strong> մաքուր աշխատավարձի հիման վրա</p>
                    <p>• <strong>Կեղտոտ հաշվարկ:</strong> հարկի և կուտակայինի տոկոսներով</p>
                    <p>• <strong>Եկամտահարկ:</strong> 20% (կամ 10% IT-ի համար)</p>
                    <p>• <strong>Պարտադիր կուտակային:</strong> 5%, 10%-25,000, կամ 87,500</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Section */}
            <Card className="bg-gradient-to-br from-gray-900 to-black border-gold-500/20">
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Calculation Type */}
                  <div className="space-y-4">
                    <Label className="text-xl font-semibold text-white">Հաշվարկի տեսակ</Label>
                    <Select value={calculationType} onValueChange={(value: 'dirty-to-net' | 'net-to-dirty') => setCalculationType(value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-14 text-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="dirty-to-net" className="text-white hover:bg-gray-600 text-lg">
                          Կեղտոտ → Մաքուր
                        </SelectItem>
                        <SelectItem value="net-to-dirty" className="text-white hover:bg-gray-600 text-lg">
                          Մաքուր → Կեղտոտ
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Social Payer Status */}
                    <div className="space-y-4">
                      <Label className="text-xl font-semibold text-white">Սոցիալական վճարող</Label>
                      <div className="flex gap-3">
                        <Button
                          variant={isSocialPayer ? "default" : "outline"}
                          onClick={() => setIsSocialPayer(true)}
                          className={`h-12 px-6 text-lg ${isSocialPayer ? "bg-gold-500 text-black hover:bg-gold-600" : "border-gray-600 text-gray-300 hover:bg-gray-700"}`}
                        >
                          Այո
                        </Button>
                        <Button
                          variant={!isSocialPayer ? "default" : "outline"}
                          onClick={() => setIsSocialPayer(false)}
                          className={`h-12 px-6 text-lg ${!isSocialPayer ? "bg-gold-500 text-black hover:bg-gold-600" : "border-gray-600 text-gray-300 hover:bg-gray-700"}`}
                        >
                          Ոչ
                        </Button>
                      </div>
                    </div>

                    {/* IT Company Status */}
                    <div className="space-y-4">
                      <Label className="text-xl font-semibold text-white">IT ընկերություն</Label>
                      <div className="flex gap-3">
                        <Button
                          variant={isITCompany ? "default" : "outline"}
                          onClick={() => setIsITCompany(true)}
                          className={`h-12 px-6 text-lg ${isITCompany ? "bg-gold-500 text-black hover:bg-gold-600" : "border-gray-600 text-gray-300 hover:bg-gray-700"}`}
                        >
                          Այո (10% հարկ)
                        </Button>
                        <Button
                          variant={!isITCompany ? "default" : "outline"}
                          onClick={() => setIsITCompany(false)}
                          className={`h-12 px-6 text-lg ${!isITCompany ? "bg-gold-500 text-black hover:bg-gold-600" : "border-gray-600 text-gray-300 hover:bg-gray-700"}`}
                        >
                          Ոչ (20% հարկ)
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-4">
                    <Label className="text-xl font-semibold text-white">
                      {getInputLabel()}
                    </Label>
                    <div className="relative max-w-lg">
                      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                      <Input
                        type="number"
                        value={inputAmount || ''}
                        onChange={(e) => setInputAmount(Number(e.target.value))}
                        placeholder="Մուտքագրեք գումարը..."
                        className="pl-12 pr-4 py-4 text-xl bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-gold-500 focus:ring-gold-500/20 w-full h-14"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            {inputAmount > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main Results */}
                <Card className="bg-gradient-to-br from-gold-900/20 to-gold-800/20 border-gold-500/30">
                  <CardHeader>
                    <CardTitle className="text-xl text-gold-400 flex items-center gap-2">
                      <TrendingUp className="w-6 h-6" />
                      Հաշվարկի արդյունքներ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gold-500/20">
                      <span className="text-white font-medium">Կեղտոտ աշխատավարձ:</span>
                      <span className="text-gold-400 font-bold text-lg">
                        {formatAMD(calculation.grossSalary)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gold-500/20">
                      <span className="text-white font-medium">Մաքուր աշխատավարձ:</span>
                      <span className="text-gold-400 font-bold text-lg">
                        {formatAMD(calculation.netSalary)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-white font-medium">Ընդհանուր նվազեցումներ:</span>
                      <span className="text-red-400 font-bold text-lg">
                        {formatAMD(calculation.totalDeductions)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Breakdown */}
                <Card className="bg-gradient-to-br from-gray-900 to-black border-gold-500/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-gold-400 flex items-center gap-2">
                      <Receipt className="w-6 h-6" />
                      Նվազեցումների մանրամասնություն
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">Եկամտահարկ ({isITCompany ? '10%' : '20%'}):</span>
                      <span className="text-red-400 font-semibold">
                        {formatAMD(calculation.incomeTax)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">Պարտադիր կուտակային:</span>
                      <span className="text-orange-400 font-semibold">
                        {formatAMD(calculation.socialContribution)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">Դրոշմանիշային վճար:</span>
                      <span className="text-yellow-400 font-semibold">
                        {formatAMD(calculation.stampDuty)}
                      </span>
                    </div>
                    <Separator className="bg-gray-600" />
                    <div className="flex justify-between items-center py-2">
                      <span className="text-white font-semibold">Ընդամենը:</span>
                      <span className="text-red-400 font-bold">
                        {formatAMD(calculation.totalDeductions)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Social Contribution Details */}
            {isSocialPayer && inputAmount > 0 && (
              <Card className="bg-gradient-to-br from-gold-900/20 to-gold-800/20 border-gold-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-gold-400 flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Պարտադիր Կուտակային Կենսաթոշակային Համակարգ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">Մինչև 500,000 AMD</h4>
                      <p className="text-gray-300">5% (անձնական վճար)</p>
                      <p className="text-gray-400 text-xs">5% պետություն</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">500,000 - 1,125,000 AMD</h4>
                      <p className="text-gray-300">10% - 25,000 AMD</p>
                      <p className="text-gray-400 text-xs">25,000 AMD պետություն</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">1,125,000+ AMD</h4>
                      <p className="text-gray-300">87,500 AMD (ֆիքսված)</p>
                      <p className="text-gray-400 text-xs">25,000 AMD պետություն</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-900/20 rounded-lg">
                    <p className="text-blue-300 text-xs">
                      <strong>Նշում:</strong> Պարտադիր մասնակիցներ (1974 և ավելի ուշ ծնվածներ)
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stamp Duty Details */}
            {inputAmount > 0 && (
              <Card className="bg-gradient-to-br from-gold-900/20 to-gold-800/20 border-gold-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-gold-400 flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    Դրոշմանիշային վճարի սանդղակ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <h4 className="font-semibold text-white mb-1">0 AMD</h4>
                      <p className="text-gray-300">0 AMD</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <h4 className="font-semibold text-white mb-1">≤ 100,000</h4>
                      <p className="text-gray-300">1,500 AMD</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <h4 className="font-semibold text-white mb-1">≤ 200,000</h4>
                      <p className="text-gray-300">3,000 AMD</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <h4 className="font-semibold text-white mb-1">≤ 500,000</h4>
                      <p className="text-gray-300">5,500 AMD</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <h4 className="font-semibold text-white mb-1">≤ 1,000,000</h4>
                      <p className="text-gray-300">8,500 AMD</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center col-span-2 md:col-span-1">
                      <h4 className="font-semibold text-white mb-1">1,000,000+</h4>
                      <p className="text-gray-300">15,000 AMD</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Examples */}
            <Card className="bg-gradient-to-br from-gold-900/20 to-gold-800/20 border-gold-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-gold-400">Արագ օրինակներ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setInputAmount(300000)}
                    className="border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-black h-20 flex flex-col justify-center p-4"
                  >
                    <span className="font-semibold text-sm">300,000 AMD</span>
                    <span className="text-xs opacity-75 mt-1">Միջին աշխատավարձ</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setInputAmount(500000)}
                    className="border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-black h-20 flex flex-col justify-center p-4"
                  >
                    <span className="font-semibold text-sm">500,000 AMD</span>
                    <span className="text-xs opacity-75 mt-1">Բարձր աշխատավարձ</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setInputAmount(1000000)}
                    className="border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-black h-20 flex flex-col justify-center p-4"
                  >
                    <span className="font-semibold text-sm">1,000,000 AMD</span>
                    <span className="text-xs opacity-75 mt-1">Շատ բարձր աշխատավարձ</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setInputAmount(0)}
                    className="border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-black h-20 flex flex-col justify-center p-4"
                  >
                    <span className="font-semibold text-sm">Մաքրել</span>
                    <span className="text-xs opacity-75 mt-1">Ռեսետ</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArmenianPayrollCalculator;
