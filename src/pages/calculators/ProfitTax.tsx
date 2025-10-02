import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const schema = z.object({
  profit: z.coerce.number().min(0, { message: 'Շահույթը պետք է լինի 0 կամ դրական' }),
  rate: z.coerce.number().min(0).max(100).default(18),
});

type FormValues = z.infer<typeof schema>;

const ProfitTaxCalculatorPage = () => {
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { rate: 18 } });
  const profit = form.watch('profit');
  const rate = form.watch('rate');

  const results = useMemo(() => {
    if (profit == null || profit < 0) return null;
    const r = (rate ?? 18) / 100;
    const tax = profit * r;
    const net = profit - tax;
    return { tax, net };
  }, [profit, rate]);

  useEffect(() => {
    document.title = 'Շահութահարկի հաշվիչ | Amroyan Consulting';
    const desc = 'Հաշվեք Շահութահարկը (կանխադրված՝ 18%) և մաքուր շահույթը՝ արագ';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name','description'); document.head.appendChild(meta); }
    meta.setAttribute('content', desc);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel','canonical'); document.head.appendChild(canonical); }
    canonical.setAttribute('href', window.location.origin + '/calculators/profit-tax');
  }, []);

  const format = (n: number) => new Intl.NumberFormat('hy-AM', { style: 'currency', currency: 'AMD', minimumFractionDigits: 0 }).format(n);

  return (
    <main className="pt-24 pb-12 bg-gradient-to-b from-black via-gray-900 to-black min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-lg mx-auto bg-gradient-to-b from-gray-900 to-black border-gold-500/20">
          <CardHeader>
            <CardTitle className="gradient-text">Շահութահարկի հաշվիչ</CardTitle>
            <CardDescription className="text-gray-400">Մուտքագրեք շահույթը և տոկոսադրույքը՝ տեսնելու համար հարկը և մաքուր շահույթը</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6">
                <FormField control={form.control} name="profit" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gold-400">Շահույթ (AMD)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Օրինակ՝ 500000" {...field} className="bg-gray-800 border-gray-700 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="rate" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gold-400">Տոկոսադրույք (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="18" {...field} className="bg-gray-800 border-gray-700 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </form>
            </Form>

            {results && (
              <div className="mt-8 pt-6 border-t border-gray-800 space-y-4 animate-fade-in-up">
                <h3 className="text-xl font-bold text-white text-center">Արդյունք</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
                  <div className="bg-gray-800 p-4 rounded-md">
                    <p className="text-sm text-gray-400">Շահութահարկ ({rate ?? 18}%)</p>
                    <p className="text-lg font-semibold text-red-400">{format(results.tax)}</p>
                  </div>
                  <div className="bg-green-600/20 border border-green-500/50 p-4 rounded-md text-center">
                    <p className="text-lg text-green-300">Մաքուր շահույթ</p>
                    <p className="text-2xl font-bold text-green-400">{format(results.net)}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center pt-2">* Հաշվարկները նախնական են</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default ProfitTaxCalculatorPage;
