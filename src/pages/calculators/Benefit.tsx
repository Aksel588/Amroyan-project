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
  benefitType: z.enum(['childCare', 'sickLeave', 'maternity', 'unemployment', 'disability']).default('childCare'),
  baseSalary: z.coerce.number().min(1, { message: 'Աշխատավարձը պետք է լինի դրական թիվ' }),
  daysCount: z.coerce.number().min(1, { message: 'Օրերի քանակը պետք է լինի դրական թիվ' }),
  childAge: z.coerce.number().min(0).max(18).optional(),
  hasInsurance: z.boolean().default(true),
});

type BenefitType = z.infer<typeof formSchema>['benefitType'];

const BenefitCalculatorPage = () => {
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
          description = 'Երեխայի խնամքի նպաստ (3 տարեկանից փոքր)';
        } else {
          benefitAmount = dailyRate * values.daysCount * 0.3; // 30% for children 3-18
          maxBenefit = 40000 * values.daysCount / 30; // Max 40,000 AMD per month
          description = 'Երեխայի խնամքի նպաստ (3-18 տարեկան)';
        }
        break;

      case 'sickLeave':
        if (values.hasInsurance) {
          benefitAmount = dailyRate * values.daysCount * 0.8; // 80% with insurance
          maxBenefit = 100000 * values.daysCount / 30; // Max 100,000 AMD per month
          description = 'Հիվանդության նպաստ (ապահովագրությամբ)';
        } else {
          benefitAmount = dailyRate * values.daysCount * 0.6; // 60% without insurance
          maxBenefit = 80000 * values.daysCount / 30; // Max 80,000 AMD per month
          description = 'Հիվանդության նպաստ (առանց ապահովագրության)';
        }
        break;

      case 'maternity':
        benefitAmount = dailyRate * values.daysCount * 1.0; // 100% for maternity
        maxBenefit = 150000 * values.daysCount / 30; // Max 150,000 AMD per month
        description = 'Ծննդաբերության նպաստ';
        break;

      case 'unemployment':
        benefitAmount = dailyRate * values.daysCount * 0.5; // 50% for unemployment
        maxBenefit = 60000 * values.daysCount / 30; // Max 60,000 AMD per month
        description = 'Գործազրկության նպաստ';
        break;

      case 'disability':
        benefitAmount = dailyRate * values.daysCount * 0.7; // 70% for disability
        maxBenefit = 120000 * values.daysCount / 30; // Max 120,000 AMD per month
        description = 'Հաշմանդամության նպաստ';
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
  }, [values, form.formState.isValid]);

  useEffect(() => {
    document.title = 'Նպաստի հաշվիչ | Amroyan Consulting';
    const desc = 'Հաշվեք տարբեր տեսակի նպաստները՝ երեխայի խնամք, հիվանդություն, ծննդաբերություն և այլն';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name','description'); document.head.appendChild(meta); }
    meta.setAttribute('content', desc);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel','canonical'); document.head.appendChild(meta); }
    canonical.setAttribute('href', window.location.origin + '/calculators/benefit');
  }, []);

  const formatAMD = (amount: number) => new Intl.NumberFormat('hy-AM', { style: 'currency', currency: 'AMD', minimumFractionDigits: 0 }).format(amount);

  return (
    <main className="pt-24 pb-12 bg-gradient-to-b from-black via-gray-900 to-black min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-3xl mx-auto bg-gradient-to-b from-gray-900 to-black border-gold-500/20">
          <CardHeader>
            <CardTitle className="gradient-text">Նպաստի հաշվիչ</CardTitle>
            <CardDescription className="text-gray-400">
              Հաշվեք տարբեր տեսակի նպաստները՝ երեխայի խնամք, հիվանդություն, ծննդաբերություն, գործազրկություն և հաշմանդամություն
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
                      <FormLabel className="text-gold-400">Նպաստի տեսակ</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Ընտրեք նպաստի տեսակը" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="childCare">Երեխայի խնամք</SelectItem>
                          <SelectItem value="sickLeave">Հիվանդության նպաստ</SelectItem>
                          <SelectItem value="maternity">Ծննդաբերության նպաստ</SelectItem>
                          <SelectItem value="unemployment">Գործազրկության նպաստ</SelectItem>
                          <SelectItem value="disability">Հաշմանդամության նպաստ</SelectItem>
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
                      <FormLabel className="text-gold-400">Հիմնական աշխատավարձ (AMD)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Օրինակ՝ 300000" {...field} className="bg-gray-800 border-gray-700 text-white" />
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
                      <FormLabel className="text-gold-400">Օրերի քանակ</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Օրինակ՝ 30" {...field} className="bg-gray-800 border-gray-700 text-white" />
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
                        <FormLabel className="text-gold-400">Երեխայի տարիք</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Օրինակ՝ 3" {...field} className="bg-gray-800 border-gray-700 text-white" />
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
                          <FormLabel className="text-gold-400">Ապահովագրություն</FormLabel>
                          <div className="text-xs text-gray-400">Ունե՞ք ապահովագրություն</div>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              </form>
            </Form>

            {results && (
              <div className="mt-8 pt-6 border-t border-gray-800 space-y-4 animate-fade-in-up">
                <h3 className="text-xl font-bold text-white text-center">Հաշվարկի արդյունքներ</h3>
                <div className="bg-blue-600/20 border border-blue-500/50 p-4 rounded-md text-center mb-4">
                  <p className="text-lg text-blue-300">{results.description}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
                  <div className="bg-gray-800 p-4 rounded-md">
                    <p className="text-sm text-gray-400">Օրական դրույքաչափ</p>
                    <p className="text-lg font-semibold text-blue-400">{formatAMD(results.dailyRate)}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-md">
                    <p className="text-sm text-gray-400">Հաշվարկված նպաստ</p>
                    <p className="text-lg font-semibold text-blue-400">{formatAMD(results.benefitAmount)}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-md">
                    <p className="text-sm text-gray-400">Առավելագույն նպաստ</p>
                    <p className="text-lg font-semibold text-blue-400">{formatAMD(results.maxBenefit)}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-md">
                    <p className="text-sm text-gray-400">Եկամտային հարկ (20%)</p>
                    <p className="text-lg font-semibold text-red-400">- {formatAMD(results.taxDeduction)}</p>
                  </div>
                  <div className="bg-green-600/20 border border-green-500/50 p-4 rounded-md sm:col-span-2 text-center">
                    <p className="text-lg text-green-300">Մաքուր նպաստ</p>
                    <p className="text-3xl font-bold text-green-400">{formatAMD(results.netBenefit)}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center pt-2">* Հաշվարկները հիմնված են Հայաստանի Հանրապետության օրենսդրության վրա</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default BenefitCalculatorPage;
