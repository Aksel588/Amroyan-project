import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const schema = z.object({
  amount: z.coerce.number().min(0.01, { message: 'Գումարը պետք է լինի դրական' }),
  rate: z.coerce.number().min(0).max(100).default(20),
});

type FormValues = z.infer<typeof schema>;

const VATCalculatorPage = () => {
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { rate: 20 } });
  const { watch } = form;
  const amount = watch('amount');
  const rate = watch('rate');

  const results = useMemo(() => {
    if (!amount || amount <= 0) return null;
    const r = (rate ?? 20) / 100;
    // Assume amount is net; compute VAT and gross
    const vat = amount * r;
    const gross = amount + vat;
    return { vat, gross };
  }, [amount, rate]);

  useEffect(() => {
    document.title = 'Շրջհարկի (ԱԱՀ) հաշվիչ | Amroyan Consulting';
    const desc = 'Հաշվեք ԱԱՀ-ի գումարը և ընդհանուր գումարը՝ մաքուրից (կամ հակառակը)՝ արագ և պարզ';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name','description'); document.head.appendChild(meta); }
    meta.setAttribute('content', desc);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel','canonical'); document.head.appendChild(canonical); }
    canonical.setAttribute('href', window.location.origin + '/calculators/vat');
  }, []);

  const format = (n: number) => new Intl.NumberFormat('hy-AM', { style: 'currency', currency: 'AMD', minimumFractionDigits: 0 }).format(n);

  return (
    <main className="pt-24 pb-12 bg-gradient-to-b from-black via-gray-900 to-black min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-lg mx-auto bg-gradient-to-b from-gray-900 to-black border-gold-500/20">
          <CardHeader>
            <CardTitle className="gradient-text">Շրջհարկի (ԱԱՀ) հաշվիչ</CardTitle>
            <CardDescription className="text-gray-400">Մուտքագրեք մաքուր գումարը և տոկոսադրույքը՝ հաշվարկելու համար ԱԱՀ-ը և ընդհանուր գումարը</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6">
                <FormField control={form.control} name="amount" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gold-400">Մաքուր գումար</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Օրինակ՝ 100000" {...field} className="bg-gray-800 border-gray-700 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="rate" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gold-400">Տոկոսադրույք (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="20" {...field} className="bg-gray-800 border-gray-700 text-white" />
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
                    <p className="text-sm text-gray-400">ԱԱՀ ({rate ?? 20}%)</p>
                    <p className="text-lg font-semibold text-red-400">{format(results.vat)}</p>
                  </div>
                  <div className="bg-green-600/20 border border-green-500/50 p-4 rounded-md text-center">
                    <p className="text-lg text-green-300">Ընդհանուր (մաքուր + ԱԱՀ)</p>
                    <p className="text-2xl font-bold text-green-400">{format(results.gross)}</p>
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

export default VATCalculatorPage;
