import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

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

const formatAMD = (amount: number) => new Intl.NumberFormat('hy-AM', { style: 'currency', currency: 'AMD', minimumFractionDigits: 0 }).format(amount);

const SalaryCalculator = () => {
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
        <CardTitle className="gradient-text">Աշխատավարձի հաշվիչ</CardTitle>
        <CardDescription className="text-gray-400">
          Հաշվեք գրանցված ↔ մաքուր աշխատավարձը՝ հաշվի առնելով եկամտային հարկը, կուտակային վճարներն ու դրոշմանիշային վճարը։
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
                  <FormLabel className="text-gold-400">Հաշվարկի ռեժիմ</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Ընտրեք ռեժիմը" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="grossToNet">Գրանցված → Մաքուր</SelectItem>
                      <SelectItem value="netToGross">Մաքուր → Գրանցված</SelectItem>
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
                  <FormLabel className="text-gold-400">{values.mode === 'grossToNet' ? 'Գրանցված աշխատավարձ' : 'Մաքուր աշխատավարձ'}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Օրինակ՝ 300000" {...field} className="bg-gray-800 border-gray-700 text-white" />
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
                    <FormLabel className="text-gold-400">ՏՏ արտոնյալ հարկում (EK 10%)</FormLabel>
                    <div className="text-xs text-gray-400">Ստուգեք, եթե ենթակա եք 10% եկամտային հարկի։</div>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pensionMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gold-400">Կուտակային համակարգ</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Ընտրեք տարբերակը" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mandatory">Պարտադիր (1974 և հետո)</SelectItem>
                      <SelectItem value="voluntary_pre2018">Կամավոր (մինչև 2018-07 – պարտադիրի կանոններով)</SelectItem>
                      <SelectItem value="voluntary_post2018">Կամավոր (2018-07 հետո – 5%/56,250)</SelectItem>
                      <SelectItem value="none">Չեմ մասնակցում</SelectItem>
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
            <h3 className="text-xl font-bold text-white text-center">Հաշվարկի արդյունքներ</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
              <div className="bg-gray-800 p-4 rounded-md">
                <p className="text-sm text-gray-400">Եկամտային հարկ ({(incomeTaxRate*100).toFixed(0)}%)</p>
                <p className="text-lg font-semibold text-red-400">- {formatAMD(results.incomeTax)}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-md">
                <p className="text-sm text-gray-400">Կուտակային վճար (մասնակից)</p>
                <p className="text-lg font-semibold text-red-400">- {formatAMD(results.pension)}</p>
                {results.statePension > 0 && (
                  <p className="text-xs text-gray-400 mt-1">Պետության համաֆինանսավորում՝ {formatAMD(results.statePension)}</p>
                )}
              </div>
              <div className="bg-gray-800 p-4 rounded-md">
                <p className="text-sm text-gray-400">Դրոշմանիշային վճար</p>
                <p className="text-lg font-semibold text-red-400">- {formatAMD(results.stamp)}</p>
              </div>
              <div className="bg-green-600/20 border border-green-500/50 p-4 rounded-md sm:col-span-2 text-center">
                <p className="text-lg text-green-300">{values.mode === 'grossToNet' ? 'Մաքուր աշխատավարձ' : 'Անհրաժեշտ գրանցված աշխատավարձ'}</p>
                <p className="text-3xl font-bold text-green-400">{values.mode === 'grossToNet' ? formatAMD(results.net) : formatAMD(results.gross)}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center pt-2">* Հաշվարկները ստեղծված են 2023թ. կարգավորումներով՝ ցուցադրական նպատակների համար։</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalaryCalculator;
