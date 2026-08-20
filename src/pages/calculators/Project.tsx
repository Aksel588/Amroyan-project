import { useEffect } from 'react';
import ProjectCalculator from '@/components/calculators/ProjectCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCalculatorTranslations, Language } from '@/lib/calculatorTranslations';

const ProjectPage = () => {
  const { currentLanguage } = useLanguage();
  const tCalc = getCalculatorTranslations(currentLanguage as Language);

  useEffect(() => {
    document.title = `${tCalc.project.title} | Amroyan Consulting`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { 
      meta = document.createElement('meta'); 
      meta.setAttribute('name','description'); 
      document.head.appendChild(meta); 
    }
    meta.setAttribute('content', tCalc.project.description);
    
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { 
      canonical = document.createElement('link'); 
      canonical.setAttribute('rel','canonical'); 
      document.head.appendChild(canonical); 
    }
    canonical.setAttribute('href', window.location.origin + '/calculators/estimate');
  }, [tCalc]);

  return (
    <main className="pt-24 pb-12 bg-gradient-to-b from-black via-gray-900 to-black min-h-screen">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="sr-only">{tCalc.project.title}</h1>
        <ProjectCalculator />
      </section>
    </main>
  );
};

export default ProjectPage;
