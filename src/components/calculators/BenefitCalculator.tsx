import { useMemo } from 'react';
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
  benefitType: z.enum(['childCare', 'sickLeave', 'maternity', 'unemployment', 'disability']).default('childCare'),
  baseSalary: z.coerce.number().min(1, { message: 'Աշխատավարձը պետք է լինի դրական թիվ' }),
  daysCount: z.coerce.number().min(1, { message: 'Օրերի քանակը պետք է լինի դրական թիվ' }),
  childAge: z.coerce.number().min(0).max(18).optional(),
  hasInsurance: z.boolean().default(true),
});

const BenefitCalculator = () => {
  const { currentLanguage } = useLanguage();
  const tCalc = getCalculatorTranslations(currentLanguage as Language);
  const locale = currentLanguage === 'hy' ? 'hy-AM' : currentLanguage === 'ru' ? 'ru-RU' : 'en-US';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: { 
      benefitType: 'childCare', 
      baseSalary: 300000, 
      daysCount: 30,
      childAge: 3,
      hasInsurance: true 
    },
  });

  const values = form.watch();

  const results = useMemo(() => {
    if (!form.formState.isValid || !values.baseSalary || !values.daysCount) return null;

    const dailyRate = values.baseSalary / 30; // Assuming 30 days per month
    let benefitAmount = 0;
    let maxBenefit = 0;
    let description = '';

    switch (values.benefitType) {
      case 'childCare':
        if (values.childAge && values.childAge < 3) {
          benefitAmount = dailyRate * values.daysCount * 0.4; // 40% for children under 3
          maxBenefit = 50000 * values.daysCount / 30; // Max 50,000 AMD per month
          description = tCalc.benefit.descriptions.childCareUnder3;
        } else {
          benefitAmount = dailyRate * values.daysCount * 0.3; // 30% for children 3-18
          maxBenefit = 40000 * values.daysCount / 30; // Max 40,000 AMD per month
          description = tCalc.benefit.descriptions.childCareOver3;
        }
        break;

      case 'sickLeave':
        if (values.hasInsurance) {
          benefitAmount = dailyRate * values.daysCount * 0.8; // 80% with insurance
          maxBenefit = 100000 * values.daysCount / 30; // Max 100,000 AMD per month
          description = tCalc.benefit.descriptions.sickLeaveInsured;
        } else {
          benefitAmount = dailyRate * values.daysCount * 0.6; // 60% without insurance
          maxBenefit = 80000 * values.daysCount / 30; // Max 80,000 AMD per month
          description = tCalc.benefit.descriptions.sickLeaveUninsured;
        }
        break;

      case 'maternity':
        benefitAmount = dailyRate * values.daysCount * 1.0; // 100% for maternity
        maxBenefit = 150000 * values.daysCount / 30; // Max 150,000 AMD per month
        description = tCalc.benefit.descriptions.maternity;
        break;

      case 'unemployment':
        benefitAmount = dailyRate * values.daysCount * 0.5; // 50% for unemployment
        maxBenefit = 60000 * values.daysCount / 30; // Max 60,000 AMD per month
        description = tCalc.benefit.descriptions.unemployment;
        break;

      case 'disability':
        benefitAmount = dailyRate * values.daysCount * 0.7; // 70% for disability
        maxBenefit = 120000 * values.daysCount / 30; // Max 120,000 AMD per month
        description = tCalc.benefit.descriptions.disability;
        break;
    }

    const finalBenefit = Math.min(benefitAmount, maxBenefit);
    const taxDeduction = finalBenefit * 0.2; // 20% income tax
    const netBenefit = finalBenefit - taxDeduction;

    return {
      dailyRate,
      benefitAmount,
      maxBenefit,
      finalBenefit,
      taxDeduction,
      netBenefit,
      description
    };
  }, [values, form.formState.isValid, tCalc]);

  const formatAMD = (amount: number) => 
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'AMD', minimumFractionDigits: 0 }).format(amount);

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gradient-to-b from-gray-900 to-black border-gold-500/20">
      <CardHeader>
        <CardTitle className="gradient-text">{tCalc.benefit.title}</CardTitle>
        <CardDescription className="text-gray-400">
          {tCalc.benefit.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="benefitType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gold-400">{tCalc.benefit.typeLabel}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder={tCalc.benefit.typeLabel} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="childCare">{tCalc.benefit.types.childCare}</SelectItem>
                      <SelectItem value="sickLeave">{tCalc.benefit.types.sickLeave}</SelectItem>
                      <SelectItem value="maternity">{tCalc.benefit.types.maternity}</SelectItem>
                      <SelectItem value="unemployment">{tCalc.benefit.types.unemployment}</SelectItem>
                      <SelectItem value="disability">{tCalc.benefit.types.disability}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="baseSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gold-400">{tCalc.benefit.salaryLabel}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={tCalc.benefit.salaryPlaceholder} {...field} className="bg-gray-800 border-gray-700 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="daysCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gold-400">{tCalc.benefit.daysLabel}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={tCalc.benefit.daysPlaceholder} {...field} className="bg-gray-800 border-gray-700 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {values.benefitType === 'childCare' && (
              <FormField
                control={form.control}
                name="childAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gold-400">{tCalc.benefit.childAgeLabel}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder={tCalc.benefit.childAgePlaceholder} {...field} className="bg-gray-800 border-gray-700 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {values.benefitType === 'sickLeave' && (
              <FormField
                control={form.control}
                name="hasInsurance"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 mt-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div>
                      <FormLabel className="text-gold-400">{tCalc.benefit.insuranceLabel}</FormLabel>
                      <div className="text-xs text-gray-400">{tCalc.benefit.insuranceDesc}</div>
                    </div>
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>

        {results && (
          <div className="mt-8 pt-6 border-t border-gray-800 space-y-4 animate-fade-in-up">
            <h3 className="text-xl font-bold text-white text-center">{tCalc.resultsTitle}</h3>
            <div className="bg-blue-600/20 border border-blue-500/50 p-4 rounded-md text-center mb-4">
              <p className="text-lg text-blue-300">{results.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
              <div className="bg-gray-800 p-4 rounded-md">
                <p className="text-sm text-gray-400">{tCalc.benefit.dailyRateLabel}</p>
                <p className="text-lg font-semibold text-blue-400">{formatAMD(results.dailyRate)}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-md">
                <p className="text-sm text-gray-400">{tCalc.benefit.calculatedBenefitLabel}</p>
                <p className="text-lg font-semibold text-blue-400">{formatAMD(results.benefitAmount)}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-md">
                <p className="text-sm text-gray-400">{tCalc.benefit.maxBenefitLabel}</p>
                <p className="text-lg font-semibold text-blue-400">{formatAMD(results.maxBenefit)}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-md">
                <p className="text-sm text-gray-400">{tCalc.benefit.taxDeductionLabel}</p>
                <p className="text-lg font-semibold text-red-400">- {formatAMD(results.taxDeduction)}</p>
              </div>
              <div className="bg-green-600/20 border border-green-500/50 p-4 rounded-md sm:col-span-2 text-center">
                <p className="text-lg text-green-300">{tCalc.benefit.netBenefitLabel}</p>
                <p className="text-3xl font-bold text-green-400">{formatAMD(results.netBenefit)}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center pt-2">{tCalc.benefit.note}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BenefitCalculator;
