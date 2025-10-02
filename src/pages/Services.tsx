import { Calculator, TrendingUp, Shield, FileText, Users, BarChart3, Clock, Award, BookOpen, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import CourseApplicationForm from '@/components/CourseApplicationForm';
const Services = () => {
  const {
    t
  } = useLanguage();
  const serviceIcons = [Calculator, Users, Briefcase, BarChart3, Shield, BookOpen];
  const benefits = [{
    icon: Clock,
    title: 'Ժամանակի խնայողություն',
    description: 'Մենք վերցնում ենք ֆինանսական գործերի պատասխանատվությունը'
  }, {
    icon: Award,
    title: 'Պրոֆեսիոնալիզմ',
    description: 'Մեր թիմը բաղկացած է վավերացված մասնագետներից'
  }, {
    icon: Shield,
    title: 'Անվտանգություն',
    description: 'Ձեր տվյալները լիովին պաշտպանված են'
  }];
  const services = [{
    title: "Հաշվապահական հաշվառում",
    description: "Ամբողջական հաշվապահական սպասարկում՝ ՀԾ ծրագրով և հաշվետվությունների ներկայացմամբ",
    features: ["Հաշվապահության վարում ՀԾ ծրագրով", "Հարկային հաշվետվությունների ներկայացում", "Վիճակագրական հաշվետվությունների ներկայացում", "Կադրային հաշվապահության վարում"]
  }, {
    title: "Հարկային, ֆինանսական և կադրային խորհրդատվություն",
    description: "Մասնագիտական աջակցություն հարկային, ֆինանսական և կադրային հարցերում",
    features: ["Պլանավորում", "Հարկերի օպտիմալացում", "Հարկային ռիսկերի գնահատում", "Հարկային, ֆինանսական և կադրային վեճերի լուծում"]
  }, {
    title: "Բիզնես-խորհրդատվություն",
    description: "Բիզնեսի ռազմավարական ուղղությունների մշակում և գնահատում",
    features: ["Բիզնես-ռազմավարության մշակում", "Բիզնես-պլանների կազմում", "Շուկայի հետազոտություն և գնահատական"]
  }, {
    title: "Ֆինանսական վերլուծություն",
    description: "Ձեր ֆինանսների խորքային վերլուծություն և կառավարման գործիքներ",
    features: ["Ֆինանսական հաշվետվությունների կազմում և ներկայացում հիմնադիրներին", "Եկամուտ-ծախսերի հաշվարկ", "Դրամական հոսքերի հաշվետվություն, հոսքերի կառավարում", "Կատարողականի վերահսկում", "Բյուջետավորում և կանխատեսում", "Եկամտաբերության գնահատում", "Եկամտաբերության բարձրացման ուղղված միջոցների կիրառում", "Կազմակերպության ծախսերի օպտիմալացում"]
  }, {
    title: "Հարկային և տեսչական ստուգումների ընթացքում Պատվիրատուի շահերի պաշտպանում",
    description: "Ձեր շահերի ներկայացում և պաշտպանություն ստուգման գործընթացում",
    features: ["Ստուգմանը նախորդող աուդիտ-դիտարկման անցկացում", "Ռիսկերի գնահատում և նվազեցում", "Ստուգման անցկացում"]
  }, {
    title: "Խմբային և անհատական հաշվապահական դասընթացներ",
    description: "Գործնական դասընթացներ սկսնակների և մասնագետների համար",
    features: ["Հաշվապահական հաշվառման դասընթացներ", "Ֆինանսական և կառավարչական հաշվառման դասընթացներ", "Կադրային հաշվապահության դասընթացներ", "Հարկային և կադրային ոլորտներին վերաբերող սեմինար-քննարկումներ"]
  }];
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
            {services.map((service: any, index: number) => {
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
                  <span className="gradient-text">Ինչու՞ մենք</span>
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <CheckCircle className="text-gold-400 flex-shrink-0" size={20} />
                    <span className="text-base sm:text-lg text-gray-300">Փորձառու մասնագետների թիմ</span>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <CheckCircle className="text-gold-400 flex-shrink-0" size={20} />
                    <span className="text-base sm:text-lg text-gray-300">Հարկային և տեսչական ստուգումների ընթացքում պատվիրատուի շահերի պաշտպանում</span>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <CheckCircle className="text-gold-400 flex-shrink-0" size={20} />
                    <span className="text-base sm:text-lg text-gray-300">Հուսալի և վստահելի</span>
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <CheckCircle className="text-gold-400 flex-shrink-0" size={20} />
                    <span className="text-base sm:text-lg text-gray-300">Ժամանակակից տեխնոլոգիաներ և գործիքակազմի կիրառում</span>
                  </div>
                </div>
                <Button asChild className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-semibold mt-6 sm:mt-8 min-h-[44px] w-full sm:w-auto">
                  <Link to="/about">
                    Մեր մասին <ArrowRight className="ml-2" size={16} />
                  </Link>
                </Button>
              </div>
              <div className="relative order-1 lg:order-2">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-gold-600/20 rounded-3xl blur-3xl" />
                <Card className="relative bg-gradient-to-br from-gray-900 to-black border-gold-500/20">
                  <CardContent className="p-6 sm:p-8">
                    <Award className="text-gold-400 mb-4 sm:mb-6" size={40} />
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Մենք ապահովում ենք</h3>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">Պրոֆեսիոնալ ծառայությունների մատուցումը, ինչը նպաստում է Ձեր բիզնեսի աճին։</p>
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
              <span className="gradient-text">Դիմեք դասընթացների համար</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              Ինտերես ունե՞ք մեր հաշվապահական դասընթացներին մասնակցելու համար: 
              Լրացրեք դիմումը և մենք կկապվենք ձեզ հետ մոտակա ժամանակներում:
            </p>
          </div>
          <CourseApplicationForm submittedFrom="services-page" />
        </div>
      </section>
    </div>;
};
export default Services;