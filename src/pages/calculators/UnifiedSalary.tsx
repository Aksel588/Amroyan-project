import { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calculator } from 'lucide-react';
import SalaryCalculator from '@/components/calculators/SalaryCalculator';
import ComprehensiveSalaryCalculator from '@/components/calculators/ComprehensiveSalaryCalculator';
import ArmenianPayrollCalculator from '@/components/calculators/ArmenianPayrollCalculator';

const OPTIONS = [
  {
    value: 'simple',
    title: 'Աշխատավարձի հաշվիչ',
    desc: 'Աշխատավարձի հաշվիչը հնարավորություն է տալիս պարզ և մատչելի կերպով հաշվարկել աշխատավարձի չափը, հարկերը և այլ վճարների չափերը։',
    tags: ['աշխատավարձ', 'հարկ', 'կուտակային'],
  },
  {
    value: 'comprehensive',
    title: 'Աշխատավարձի հաշվիչ (լրիվ)',
    desc: 'Հաշվեք աշխատավարձի ֆոնդը, հարկերը, ծախսերը և վերջնական գինը՝ ժամավճարային, օրավճարային և ամսավճարային դրույքներով',
    tags: ['աշխատավարձ', 'ֆոնդ', 'հարկ'],
  },
  {
    value: 'armenian-payroll',
    title: 'Հայաստանի աշխատավարձի հաշվիչ',
    desc: 'Հաշվեք կեղտոտ/մաքուր աշխատավարձը՝ եկամտահարկ, սոցիալական վճարներ և դրոշմանիշային վճար',
    tags: ['աշխատավարձ', 'կեղտոտ', 'մաքուր'],
  },
] as const;

type ChoiceValue = (typeof OPTIONS)[number]['value'];

const UnifiedSalaryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const typeParam = searchParams.get('type') as ChoiceValue | null;
  const initialFromPath =
    location.pathname === '/calculators/comprehensive-salary'
      ? 'comprehensive'
      : location.pathname === '/calculators/armenian-payroll'
        ? 'armenian-payroll'
        : null;
  const [selected, setSelected] = useState<ChoiceValue>(() => {
    if (initialFromPath) return initialFromPath;
    if (typeParam && OPTIONS.some((o) => o.value === typeParam)) return typeParam;
    return 'simple';
  });

  useEffect(() => {
    document.title = 'Աշխատավարձի հաշվիչ | Amroyan Consulting';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Հաշվարկեք աշխատավարձը՝ պարզ, լրիվ կամ կեղտոտ/մաքուր ռեժիմով');
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) canonical.setAttribute('href', window.location.origin + '/calculators/salary');
  }, []);

  useEffect(() => {
    if (initialFromPath) setSelected(initialFromPath);
    else if (typeParam && OPTIONS.some((o) => o.value === typeParam)) setSelected(typeParam);
  }, [typeParam, initialFromPath]);

  const onChoiceChange = (value: ChoiceValue) => {
    setSelected(value);
    setSearchParams(value === 'simple' ? {} : { type: value }, { replace: true });
  };

  const current = OPTIONS.find((o) => o.value === selected);

  return (
    <main className="pt-24 pb-12 bg-gradient-to-b from-black via-gray-900 to-black min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <h1 className="sr-only">Աշխատավարձի հաշվիչ</h1>

        <Card className="mb-6 border-gold-500/30 bg-gray-800/50">
          <CardContent className="p-4">
            <p className="text-sm text-gray-400 mb-3">Ընտրեք հաշվիչը</p>
            <div className="space-y-3">
              {OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 cursor-pointer rounded-lg border p-3 transition-colors ${
                    selected === opt.value
                      ? 'border-gold-500/50 bg-gold-500/10'
                      : 'border-transparent hover:border-gold-500/30'
                  }`}
                >
                  <Checkbox
                    checked={selected === opt.value}
                    onCheckedChange={() => onChoiceChange(opt.value)}
                    className="mt-0.5 border-gray-500 data-[state=checked]:bg-gold-500 data-[state=checked]:border-gold-500"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-white flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-gold-400 shrink-0" />
                      {opt.title}
                    </span>
                    <p className="text-sm text-gray-400 mt-0.5">{opt.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {opt.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {current && (
          <div className="rounded-lg border border-gold-500/30 bg-gold-500/5 p-3 mb-4">
            <h2 className="text-lg font-semibold text-gold-400">{current.title}</h2>
            <p className="text-sm text-gray-400 mt-1">{current.desc}</p>
          </div>
        )}

        <Card className="bg-transparent border-0 shadow-none">
          <CardContent className="p-0">
            {selected === 'simple' && <SalaryCalculator />}
            {selected === 'comprehensive' && <ComprehensiveSalaryCalculator />}
            {selected === 'armenian-payroll' && <ArmenianPayrollCalculator />}
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default UnifiedSalaryPage;
