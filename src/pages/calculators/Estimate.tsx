import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const EstimateCalculatorPage = () => {
  useEffect(() => {
    document.title = 'Նախագծերի հաշվիչ (Սմետա) | Amroyan Consulting';
    const desc = 'Սմետայի հաշվիչ — կկազմենք ծախսերի նախահաշիվ։ Խնդրում ենք տրամադրել դաշտերն ու բանաձևերը';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name','description'); document.head.appendChild(meta); }
    meta.setAttribute('content', desc);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel','canonical'); document.head.appendChild(canonical); }
    canonical.setAttribute('href', window.location.origin + '/calculators/estimate');
  }, []);

  return (
    <main className="pt-24 pb-12 bg-gradient-to-b from-black via-gray-900 to-black min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl mx-auto bg-gradient-to-b from-gray-900 to-black border-gոլд-500/20">
          <CardHeader>
            <CardTitle className="gradient-text">Նախագծերի հաշվիչ (Սմետա)</CardTitle>
            <CardDescription className="text-gray-400">Նախնական տարբերակ. նշեք՝ ինչ տողեր, միավորներ և հաշվարկների կանոններ պետք է ավելացնենք</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">Կկարողանանք ավելացնել նյութեր, աշխատանքային ժամեր, միավորային գներ, ԱԱՀ, շահույթ և այլն՝ ստանալու համար ամբողջական սմետա:</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default EstimateCalculatorPage;
