import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getCalculatorBySlug } from '@/data/calculators';
import LoadingPage from '@/components/LoadingPage';
import NotFound from '@/pages/NotFound';
import DynamicIcon from '@/components/ui/DynamicIcon';

// Import specific calculator components
import SalaryCalculator from '@/components/calculators/SalaryCalculator';
import ComprehensiveSalaryCalculator from '@/components/calculators/ComprehensiveSalaryCalculator';
import ProjectCalculator from '@/components/calculators/ProjectCalculator';
import TurnoverTaxCalculator from '@/components/calculators/TurnoverTaxCalculator';
import ArmenianTaxCalculator from '@/components/calculators/ArmenianTaxCalculator';
import ArmenianPayrollCalculator from '@/components/calculators/ArmenianPayrollCalculator';
import ProfitTaxCalculator from '@/pages/calculators/ProfitTax';
import BenefitCalculator from '@/pages/calculators/Benefit';
import VATCalculator from '@/pages/calculators/VAT';

const CalculatorPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Get calculator from static data
    const calculator = getCalculatorBySlug(slug);
    
    if (calculator) {
      // Set page title and meta description
      document.title = `${calculator.title} — Հաշվիչ | Amroyan Consulting`;
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', calculator.description || `${calculator.title} հաշվիչ`);
      
      // Set canonical URL
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', `${window.location.origin}/calculators/${slug}`);
    } else {
      setNotFound(true);
    }
    
    setLoading(false);
  }, [slug]);

  // Show loading while fetching
  if (loading) {
    return <LoadingPage />;
  }

  // Show 404 if calculator not found
  if (notFound) {
    return <NotFound />;
  }

  // Get calculator from static data
  const calculator = getCalculatorBySlug(slug!);
  if (!calculator) {
    return <NotFound />;
  }

  // Render the appropriate calculator component based on slug
  const renderCalculatorComponent = () => {
    switch (slug) {
      case 'salary':
        return <SalaryCalculator />;
      case 'comprehensive-salary':
        return <ComprehensiveSalaryCalculator />;
      case 'estimate':
        return <ProjectCalculator />;
      case 'turnover-tax':
        return <TurnoverTaxCalculator />;
      case 'armenian-tax':
        return <ArmenianTaxCalculator />;
      case 'armenian-payroll':
        return <ArmenianPayrollCalculator />;
      case 'profit-tax':
        return <ProfitTaxCalculator />;
      case 'benefit':
        return <BenefitCalculator />;
      case 'vat':
        return <VATCalculator />;
      default:
        return (
          <Card className="bg-gray-900/50 border-gold-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                  <DynamicIcon name={calculator.icon_name as any} className="text-black" size={20} />
                </div>
                {calculator.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-6">{calculator.description}</p>
              <div className="text-center text-gray-400 py-8">
                Այս հաշվիչը շուտով կլինի հասանելի
              </div>
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
                <DynamicIcon name={calculator.icon_name as any} className="text-black" size={28} />
              </div>
              {calculator.title}
            </h1>
            {calculator.description && (
              <p className="text-xl text-gray-300 mt-6">{calculator.description}</p>
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