import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { laravelApi } from '@/integrations/laravel/client';
import LoadingPage from '@/components/LoadingPage';
import NotFound from '@/pages/NotFound';
import { toast } from '@/hooks/use-toast';
import DynamicIcon from '@/components/ui/DynamicIcon';

// Import specific calculator components
import SalaryCalculator from '@/components/calculators/SalaryCalculator';

interface Calculator {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon_name: string;
  visible: boolean;
}

const CalculatorPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [calculator, setCalculator] = useState<Calculator | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchCalculator = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        // Get all calculators and find the one with matching slug
        const response = await laravelApi.getCalculators();
        const calculators = response.data || [];
        const foundCalculator = calculators.find((calc: Calculator) => calc.slug === slug && calc.visible);
        
        if (foundCalculator) {
          setCalculator(foundCalculator);
          
          // Set page title and meta description
          document.title = `${foundCalculator.title} — Հաշվիչ | Amroyan Consulting`;
          let meta = document.querySelector('meta[name="description"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'description');
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', foundCalculator.description || `${foundCalculator.title} հաշվիչ`);
          
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
      } catch (error) {
        console.error('Error fetching calculator:', error);
        // Don't show toast for 404 errors, just set not found
        if (error.response?.status !== 404) {
          toast({
            title: "Սխալ",
            description: "Չհաջողվեց բեռնել հաշվիչը",
            variant: "destructive"
          });
        }
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCalculator();
  }, [slug]);

  // Show loading while fetching
  if (loading) {
    return <LoadingPage />;
  }

  // Show 404 if calculator not found
  if (notFound || !calculator) {
    return <NotFound />;
  }

  // Render the appropriate calculator component based on slug
  const renderCalculatorComponent = () => {
    switch (slug) {
      case 'salary':
        return <SalaryCalculator />;
      case 'vat':
        // You can add other calculator components here as they're implemented
        return <div className="text-center text-gray-400 py-8">VAT հաշվիչը շուտով կլինի հասանելի</div>;
      case 'profit-tax':
        return <div className="text-center text-gray-400 py-8">Շահութահարկի հաշվիչը շուտով կլինի հասանելի</div>;
      case 'benefit':
        return <div className="text-center text-gray-400 py-8">Նպաստի հաշվիչը շուտով կլինի հասանելի</div>;
      case 'estimate':
        return <div className="text-center text-gray-400 py-8">Նախագծային հաշվիչը շուտով կլինի հասանելի</div>;
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