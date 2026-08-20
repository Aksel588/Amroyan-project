import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const TestsAccounting = () => {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = `${t('archive.subpages.testsAccountingTitle')} | ${t('archive.heroTitle')}`;
  }, [t]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-32 px-4 pb-20">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/archive"
          className="inline-flex items-center text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('archive.subpages.backToArchive')}
        </Link>
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white">{t('archive.subpages.testsAccountingTitle')}</h1>
          <p className="text-gray-300 mt-2 max-w-2xl mx-auto leading-relaxed">{t('archive.subpages.testsAccountingSubtitle')}</p>
        </header>
        <section className="text-gray-400 text-center py-8">{t('archive.subpages.comingSoon')}</section>
      </div>
    </main>
  );
};

export default TestsAccounting;
