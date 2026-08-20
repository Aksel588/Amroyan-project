import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCalculatorTranslations, Language } from '@/lib/calculatorTranslations';

const formSchema = z.object({
  mode: z.enum(['grossToNet', 'netToGross']).default('grossToNet'),
  amount: z.coerce.number().min(1, { message: 'Գումարը պետք է լինի դրական թիվ' }),
  itPrivilege: z.boolean().default(false),
  pensionMode: z.enum(['mandatory', 'voluntary_pre2018', 'voluntary_post2018', 'none']).default('mandatory'),
});

type PensionMode = z.infer<typeof formSchema>['pensionMode'];

// Helpers from description
const STAMP_DUTY = (base: number) => {
  if (base <= 100_000) return 1500;
  if (base <= 200_000) return 3000;
  if (base <= 500_000) return 5500;
  if (base <= 1_000_000) return 8500;
  return 15_000;
};

const pensionParticipantPay = (base: number, mode: PensionMode) => {
  switch (mode) {
    case 'mandatory': {
      if (base <= 500_000) return base * 0.05;
      if (base <= 1_125_000) return base * 0.10 - 25_000; // 10% - 25k
      return 87_500; // cap
    }
    case 'voluntary_pre2018': {
      // Follows mandatory participants' conditions per description
      if (base <= 500_000) return base * 0.05;
      if (base <= 1_125_000) return base * 0.10 - 25_000;
      return 87_500;
    }
    case 'voluntary_post2018': {
      // 5% up to 1,125,000 else 56,250
      if (base <= 1_125_000) return base * 0.05;
      return 56_250;
    }
    case 'none':
    default:
      return 0;
  }
};

const pensionStatePay = (base: number, mode: PensionMode) => {
  switch (mode) {
    case 'mandatory':
    case 'voluntary_pre2018': {
      if (base <= 500_000) return base * 0.05; // state 5%
      if (base <= 1_125_000) return 25_000; // state fixed 25k
      return 25_000; // state fixed 25k above cap
    }
    case 'voluntary_post2018':
    case 'none':
    default:
      return 0;
  }
};

const calcFromGross = (gross: number, incomeTaxRate: number, pensionMode: PensionMode) => {
  const incomeTax = gross * incomeTaxRate;
  const pension = pensionParticipantPay(gross, pensionMode);
  const stamp = STAMP_DUTY(gross);
  const net = gross - incomeTax - pension - stamp;
  const statePension = pensionStatePay(gross, pensionMode);
  return { gross, net: Math.max(0, net), incomeTax, pension, statePension, stamp };
};

const calcFromNetIterative = (netTarget: number, incomeTaxRate: number, pensionMode: PensionMode) => {
  // Numerical inversion since stamp duty and pension caps depend on gross
  let low = netTarget;
  let high = netTarget * 2 + 2_000_000; // generous upper bound
  let best = low;
  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    const { net } = calcFromGross(mid, incomeTaxRate, pensionMode);
    if (Math.abs(net - netTarget) < 0.5) {
      best = mid;
      break;
    }
    if (net > netTarget) {
      // need smaller gross
      high = mid;
    } else {
      low = mid;
    }
    best = mid;
  }
  const res = calcFromGross(best, incomeTaxRate, pensionMode);
  return res;
};

const SalaryCalculator = () => {
  const { currentLanguage } = useLanguage();
  const tCalc = getCalculatorTranslations(currentLanguage as Language);
  const locale = currentLanguage === 'hy' ? 'hy-AM' : currentLanguage === 'ru' ? 'ru-RU' : 'en-US';

  const formatAMD = (amount: number) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'AMD', minimumFractionDigits: 0 }).format(amount);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: { 
      mode: 'grossToNet', 
      amount: 300000, 
      itPrivilege: false, 
      pensionMode: 'mandatory' 
    },
  });

  const values = form.watch();
  const incomeTaxRate = useMemo(() => (values.itPrivilege ? 0.10 : 0.20), [values.itPrivilege]);

  const results = useMemo(() => {
    if (!form.formState.isValid || !values.amount) return null;
    if (values.mode === 'grossToNet') {
      return calcFromGross(values.amount, incomeTaxRate, values.pensionMode);
    }
    return calcFromNetIterative(values.amount, incomeTaxRate, values.pensionMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, form.formState.isValid, incomeTaxRate]);

  useEffect(() => {
    // Reset amount results when switching mode to avoid confusion
    form.clearErrors('amount');
  }, [values.mode]);

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gradient-to-b from-gray-900 to-black border-gold-500/20">
      <CardHeader>
        <CardTitle className="gradient-text">{tCalc.salary.title}</CardTitle>
        <CardDescription className="text-gray-400">
          {tCalc.salary.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gold-400">{tCalc.salary.modeLabel}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder={tCalc.salary.modeLabel} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="grossToNet" className="text-white hover:bg-gray-700">{tCalc.salary.grossToNet}</SelectItem>
                      <SelectItem value="netToGross" className="text-white hover:bg-gray-700">{tCalc.salary.netToGross}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gold-400">
                    {values.mode === 'grossToNet' ? tCalc.salary.grossAmountLabel : tCalc.salary.netAmountLabel}
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={tCalc.salary.amountPlaceholder} {...field} className="bg-gray-800 border-gray-700 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="itPrivilege"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 mt-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div>
                    <FormLabel className="text-gold-400">{tCalc.salary.itPrivilegeLabel}</FormLabel>
                    <div className="text-xs text-gray-400">{tCalc.salary.itPrivilegeDesc}</div>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pensionMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gold-400">{tCalc.salary.pensionLabel}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder={tCalc.salary.pensionLabel} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="mandatory" className="text-white hover:bg-gray-700">{tCalc.salary.pensionMandatory}</SelectItem>
                      <SelectItem value="voluntary_pre2018" className="text-white hover:bg-gray-700">{tCalc.salary.pensionVoluntaryPre2018}</SelectItem>
                      <SelectItem value="voluntary_post2018" className="text-white hover:bg-gray-700">{tCalc.salary.pensionVoluntaryPost2018}</SelectItem>
                      <SelectItem value="none" className="text-white hover:bg-gray-700">{tCalc.salary.pensionNone}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        {results && (
          <div className="mt-8 pt-6 border-t border-gray-800 space-y-4 animate-fade-in-up">
            <h3 className="text-xl font-bold text-white text-center">{tCalc.resultsTitle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
              <div className="bg-gray-800 p-4 rounded-md">
                <p className="text-sm text-gray-400">{tCalc.salary.incomeTaxLabel} ({(incomeTaxRate*100).toFixed(0)}%)</p>
                <p className="text-lg font-semibold text-red-400">- {formatAMD(results.incomeTax)}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-md">
                <p className="text-sm text-gray-400">{tCalc.salary.pensionFeeLabel}</p>
                <p className="text-lg font-semibold text-red-400">- {formatAMD(results.pension)}</p>
                {results.statePension > 0 && (
                  <p className="text-xs text-gray-400 mt-1">{tCalc.salary.statePensionLabel}՝ {formatAMD(results.statePension)}</p>
                )}
              </div>
              <div className="bg-gray-800 p-4 rounded-md">
                <p className="text-sm text-gray-400">{tCalc.salary.stampDutyLabel}</p>
                <p className="text-lg font-semibold text-red-400">- {formatAMD(results.stamp)}</p>
              </div>
              <div className="bg-green-600/20 border border-green-500/50 p-4 rounded-md sm:col-span-2 text-center">
                <p className="text-lg text-green-300">
                  {values.mode === 'grossToNet' ? tCalc.salary.netResultLabel : tCalc.salary.grossResultLabel}
                </p>
                <p className="text-3xl font-bold text-green-400">
                  {formatAMD(values.mode === 'grossToNet' ? results.net : results.gross)}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center pt-2">{tCalc.salary.note}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalaryCalculator;
