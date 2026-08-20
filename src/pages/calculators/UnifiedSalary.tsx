import { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calculator } from 'lucide-react';
import SalaryCalculator from '@/components/calculators/SalaryCalculator';
import ComprehensiveSalaryCalculator from '@/components/calculators/ComprehensiveSalaryCalculator';
import ArmenianPayrollCalculator from '@/components/calculators/ArmenianPayrollCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCalculatorTranslations, Language } from '@/lib/calculatorTranslations';

type ChoiceValue = 'simple' | 'comprehensive' | 'armenian-payroll';

const UnifiedSalaryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { currentLanguage } = useLanguage();
  const tCalc = getCalculatorTranslations(currentLanguage as Language);

  const options = [
    {
      value: 'simple' as const,
      desc: tCalc.unifiedSalary.simpleDesc,
      tags: tCalc.unifiedSalary.simpleTags,
    },
    {
      value: 'comprehensive' as const,
      desc: tCalc.unifiedSalary.compDesc,
      tags: tCalc.unifiedSalary.compTags,
    },
    {
      value: 'armenian-payroll' as const,
      desc: tCalc.unifiedSalary.payrollDesc,
      tags: tCalc.unifiedSalary.payrollTags,
    },
  ];

  const typeParam = searchParams.get('type') as ChoiceValue | null;
  const initialFromPath =
    location.pathname === '/calculators/comprehensive-salary'
      ? 'comprehensive'
      : location.pathname === '/calculators/armenian-payroll'
        ? 'armenian-payroll'
        : null;

  const [selected, setSelected] = useState<ChoiceValue>(() => {
    if (initialFromPath) return initialFromPath;
    if (typeParam && (typeParam === 'simple' || typeParam === 'comprehensive' || typeParam === 'armenian-payroll')) return typeParam;
    return 'simple';
  });

  useEffect(() => {
    document.title = `${tCalc.salary.title} | Amroyan Consulting`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', tCalc.salary.description);
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) canonical.setAttribute('href', window.location.origin + '/calculators/salary');
  }, [tCalc]);

  useEffect(() => {
    if (initialFromPath) setSelected(initialFromPath);
    else if (typeParam && (typeParam === 'simple' || typeParam === 'comprehensive' || typeParam === 'armenian-payroll')) setSelected(typeParam);
  }, [typeParam, initialFromPath]);

  const onChoiceChange = (value: ChoiceValue) => {
    setSelected(value);
    setSearchParams(value === 'simple' ? {} : { type: value }, { replace: true });
  };

  return (
    <main className="pt-24 pb-12 bg-gradient-to-b from-black via-gray-900 to-black min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <h1 className="sr-only">{tCalc.salary.title}</h1>

        <Card className="mb-6 border-gold-500/30 bg-gray-800/50">
          <CardContent className="p-4">
            <p className="text-sm text-gray-400 mb-3">{tCalc.unifiedSalary.chooseCalculator}</p>
            <div className="space-y-3">
              {options.map((opt) => (
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
                    <p className="text-sm text-gray-200 flex items-start gap-2">
                      <Calculator className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                      {opt.desc}
                    </p>
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
