import { Target, Award, Clock, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const VALUE_ICONS = [ShieldCheck, Award, Target, Clock] as const;

const About = () => {
  const { t } = useLanguage();
  const valuesData = (() => {
    const v = t('about.values') as unknown;
    return Array.isArray(v) ? v as { title: string; description: string }[] : [];
  })();
  const values = valuesData.map((item, i) => ({
    icon: VALUE_ICONS[i] ?? ShieldCheck,
    title: item?.title ?? '',
    description: item?.description ?? '',
  }));
  const timelineItems = (() => {
    const tl = t('about.timeline') as unknown;
    return Array.isArray(tl) ? (tl as string[]) : [];
  })();
  return <div className="pt-20">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-black via-gray-900 to-black network-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
              <span className="gradient-text">{t('about.heroTitle')}</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed px-4">{t('about.heroSubtitle')}</p>
          </div>
        </div>
      </section>

      {/* Mission Section — modern clean */}
      <section className="py-16 sm:py-20 lg:py-24 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="relative pl-0 sm:pl-8 border-l-0 sm:border-l-2 border-gold-500/40">
              <span className="text-xs font-medium uppercase tracking-widest text-gold-400/80 mb-4 block">
                {t('about.missionLabel')}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 tracking-tight">
                {t('about.missionTitle')}
              </h2>
              <div className="space-y-6 text-gray-300 text-base sm:text-lg leading-relaxed">
                <p>{t('about.missionP1')}</p>
                <p>{t('about.missionP2')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
              <span className="gradient-text">{t('about.valuesTitle')}</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">{t('about.valuesSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => <Card key={index} className="bg-gradient-to-b from-gray-900 to-black border-gold-500/20 hover:border-gold-400/40 transition-all duration-300 group">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:animate-pulse">
                    <value.icon size={28} className="text-black sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                    {value.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
              <span className="gradient-text">{t('about.timelineTitle')}</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              {t('about.timelineSubtitle')}
            </p>
          </div>

          <ol className="relative border-l border-gold-500/30 max-w-3xl mx-auto pl-6 space-y-8">
            {[0, 1, 2, 3, 4].map((i) => (
              <li key={i} className="relative">
                <span className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 ring-4 ring-black" aria-hidden="true" />
                <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl border border-gold-500/20 p-5">
                  <h3 className="font-semibold text-white">{timelineItems[i] ?? ''}</h3>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

    </div>;
};
export default About;