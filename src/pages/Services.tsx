import { Calculator, Shield, Users, BarChart3, Award, BookOpen, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import CourseApplicationForm from '@/components/CourseApplicationForm';
const serviceIcons = [Calculator, Users, Briefcase, BarChart3, Shield, BookOpen];

const Services = () => {
  const { t } = useLanguage();
  const servicesData = (() => {
    const v = t('services.list') as unknown;
    return Array.isArray(v) ? (v as { title: string; description: string; features: string[] }[]) : [];
  })();
  const whyUsBullets = (() => {
    const b = t('services.whyUsBullets') as unknown;
    return Array.isArray(b) ? (b as string[]) : [];
  })();
  return <div className="pt-20 overflow-x-hidden max-w-full">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-black via-gray-900 to-black network-bg overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
              <span className="gradient-text">{t('services.title')}</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed px-4">
              {t('services.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-black to-gray-900 overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {servicesData.map((service: { title: string; description?: string; features?: string[] }, index: number) => {
            const IconComponent = serviceIcons[index];
            return <Card key={index} className="bg-gradient-to-br from-gray-900 to-black border-gold-500/20 hover:border-gold-400/40 transition-all duration-300 group overflow-hidden">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center group-hover:animate-pulse mx-auto sm:mx-0 flex-shrink-0">
                        <IconComponent size={24} className="text-black sm:w-7 sm:h-7" />
                      </div>
                      <CardTitle className="text-xl sm:text-2xl text-white text-center sm:text-left break-words">
                        {service.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    
                    <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                      {service.features && service.features.map((feature: string, idx: number) => <li key={idx} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-gold-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-400 leading-relaxed break-words">{feature}</span>
                        </li>)}
                    </ul>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>
      </section>

      {/* Benefits Section (Why Us) - match homepage style */}
      <section className="py-12 sm:py-16 lg:py-20 bg-black overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8">
                  <span className="gradient-text">{t('services.whyUsTitle')}</span>
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {whyUsBullets.map((bullet, i) => (
                    <div key={i} className="flex items-center space-x-3 sm:space-x-4">
                      <CheckCircle className="text-gold-400 flex-shrink-0" size={20} />
                      <span className="text-base sm:text-lg text-gray-300">{bullet}</span>
                    </div>
                  ))}
                </div>
                <Button asChild className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-semibold mt-6 sm:mt-8 min-h-[44px] w-full sm:w-auto">
                  <Link to="/about">
                    {t('services.aboutBtn')} <ArrowRight className="ml-2" size={16} />
                  </Link>
                </Button>
              </div>
              <div className="relative order-1 lg:order-2">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-gold-600/20 rounded-3xl blur-3xl" />
                <Card className="relative bg-gradient-to-br from-gray-900 to-black border-gold-500/20">
                  <CardContent className="p-6 sm:p-8">
                    <Award className="text-gold-400 mb-4 sm:mb-6" size={40} />
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">{t('services.weProvideTitle')}</h3>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{t('services.weProvideDesc')}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-900 to-black overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="gradient-text">{t('services.ctaTitle')}</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              {t('services.ctaDesc')}
            </p>
          </div>
          <CourseApplicationForm submittedFrom="services-page" />
        </div>
      </section>
    </div>;
};
export default Services;