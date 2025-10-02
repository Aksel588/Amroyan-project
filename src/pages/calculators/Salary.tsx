import { useEffect } from 'react';
import SalaryCalculator from '@/components/calculators/SalaryCalculator';

const SalaryPage = () => {
  useEffect(() => {
    document.title = 'Աշխատավարձի հաշվիչ | Amroyan Consulting';
    const desc = 'Հաշվեք բրուտո և նետ աշխատավարձը՝ եկամտահարկ, կենսաթոշակ և դրոշմանիշային վճարներով';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name','description'); document.head.appendChild(meta); }
    meta.setAttribute('content', desc);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel','canonical'); document.head.appendChild(meta); }
    canonical.setAttribute('href', window.location.origin + '/calculators/salary');
  }, []);

  return (
    <main className="pt-24 pb-12 bg-gradient-to-b from-black via-gray-900 to-black min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="sr-only">Աշխատավարձի հաշվիչ</h1>
        <SalaryCalculator />
      </section>
    </main>
  );
};

export default SalaryPage;
