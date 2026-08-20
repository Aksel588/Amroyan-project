import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getCalculatorBySlug } from '@/data/calculators';
import LoadingPage from '@/components/LoadingPage';
import NotFound from '@/pages/NotFound';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCalculatorTranslations, Language } from '@/lib/calculatorTranslations';

// Import specific calculator components
import SalaryCalculator from '@/components/calculators/SalaryCalculator';
import ComprehensiveSalaryCalculator from '@/components/calculators/ComprehensiveSalaryCalculator';
import ProjectCalculator from '@/components/calculators/ProjectCalculator';
import TurnoverTaxCalculator from '@/components/calculators/TurnoverTaxCalculator';
import ArmenianTaxCalculator from '@/components/calculators/ArmenianTaxCalculator';
import ArmenianPayrollCalculator from '@/components/calculators/ArmenianPayrollCalculator';
import BenefitCalculator from '@/components/calculators/BenefitCalculator';
import EstimateCalculator from '@/components/calculators/EstimateCalculator';

const CalculatorPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { currentLanguage } = useLanguage();
  const tCalc = getCalculatorTranslations(currentLanguage as Language);

  const matchedCard = tCalc.cards.find(c => c.slug === slug);
  const staticCalc = slug ? getCalculatorBySlug(slug) : null;

  const title = matchedCard?.title || staticCalc?.title || '';
  const description = matchedCard?.desc || staticCalc?.description || '';
  const iconName = matchedCard?.icon_name || staticCalc?.icon_name || 'Calculator';

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    if (matchedCard || staticCalc) {
      document.title = `${title} | Amroyan Consulting`;
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
      
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', `${window.location.origin}/calculators/${slug}`);
      setNotFound(false);
    } else {
      setNotFound(true);
    }
    
    setLoading(false);
  }, [slug, title, description, matchedCard, staticCalc]);

  if (loading) {
    return <LoadingPage />;
  }

  if (notFound || (!matchedCard && !staticCalc)) {
    return <NotFound />;
  }

  const renderCalculatorComponent = () => {
    switch (slug) {
      case 'salary':
        return <SalaryCalculator />;
      case 'comprehensive-salary':
        return <ComprehensiveSalaryCalculator />;
      case 'estimate':
        return <EstimateCalculator />;
      case 'turnover-tax':
        return <TurnoverTaxCalculator />;
      case 'armenian-tax':
        return <ArmenianTaxCalculator />;
      case 'armenian-payroll':
        return <ArmenianPayrollCalculator />;
      case 'benefit':
        return <BenefitCalculator />;
      default:
        return (
          <Card className="bg-gray-900/50 border-gold-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                  <DynamicIcon name={iconName as any} className="text-black" size={20} />
                </div>
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-6">{description}</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <main className="pt-20 bg-gradient-to-b from-black via-gray-900 to-black min-h-screen">
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                <DynamicIcon name={iconName as any} className="text-black" size={28} />
              </div>
              {title}
            </h1>
            {description && (
              <p className="text-xl text-gray-300 mt-6">{description}</p>
            )}
          </header>
          
          <div className="max-w-4xl mx-auto">
            {renderCalculatorComponent()}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CalculatorPage;