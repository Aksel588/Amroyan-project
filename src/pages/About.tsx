import { Users, Target, Award, Clock, Mail, Linkedin, GraduationCap, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
const About = () => {
  const values = [{
    icon: ShieldCheck,
    title: 'Հուսալիություն',
    description: 'Մեր պատվիրատուները վստահ են իրենց ֆինանսական և հաշվապահական կառավարման մեջ'
  }, {
    icon: Award,
    title: 'Որակ',
    description: 'Միայն բարձրակարգ և արհեստավարժ ծառայությունների մատուցում'
  }, {
    icon: Target,
    title: 'Նպատակայնություն',
    description: 'Մենք կենտրոնացած ենք Ձեր բիզնեսի հաջողության վրա և աշխատում ենք հասնել լավագույն արդյունքների:'
  }, {
    icon: Clock,
    title: 'Արդյունավետություն',
    description: 'Ժամանակը արժեք է, և մենք գնահատում ենք Ձեր ժամանակը խնայելով այն։'
  }];
  return <div className="pt-20">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-black via-gray-900 to-black network-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
              <span className="gradient-text">Մեր մասին</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed px-4">Amroyan Consulting-ը առաջատար ընկերություն է հաշվապահական և ֆինանսական ծառայությունների ոլորտում՝ 5+ տարվա փորձով:</p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 gap-8 lg:gap-16 items-stretch">
              
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-gold-600/20 rounded-3xl blur-3xl" />
                <Card className="relative h-full bg-gradient-to-br from-gray-900 to-black border-gold-500/20 flex items-center justify-center overflow-hidden">
                  <CardContent className="p-8 sm:p-10 flex flex-col items-center text-center gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-md">
                      <GraduationCap className="text-black" size={40} aria-hidden="true" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold">Մեր առաքելությունը</h3>
                    <p className="text-sm sm:text-base text-gray-300 max-w-md px-0 mx-0 my-0 py-0">Մեր նպատակն է օգնել բիզնեսներին հասնել ֆինանսական կայունության և աճի՝ տրամադրելով պրոֆեսիոնալ հաշվապահական և ֆինանսական ծառայություններ:

Մենք հավատում ենք, որ յուրաքանչյուր բիզնես արժանի է որակյալ ֆինանսական աջակցության՝ անկախ գործունեության ոլորտից և իր մեծությունից:</p>
                  </CardContent>
                </Card>
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
              <span className="gradient-text">Մեր արժեքները</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">Աշխատանքի մեջ մենք առաջնորդվում ենք հետևյալ հիմնական սկզբունքներով</p>
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
              <span className="gradient-text">Մեր ուղին</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Մեր ընկերության զարգացման հիմնական փուլերը
            </p>
          </div>

          <ol className="relative border-l border-gold-500/30 max-w-3xl mx-auto pl-6 space-y-8">
            <li className="relative">
              <span className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 ring-4 ring-black" aria-hidden="true" />
              <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl border border-gold-500/20 p-5">
                <h3 className="font-semibold text-white">2020 — ընկերության հիմնադրում</h3>
              </div>
            </li>
            <li className="relative">
              <span className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 ring-4 ring-black" aria-hidden="true" />
              <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl border border-gold-500/20 p-5">
                <h3 className="font-semibold text-white">2021 — առաջին 20+ իրագործված նախագծեր</h3>
              </div>
            </li>
            <li className="relative">
              <span className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 ring-4 ring-black" aria-hidden="true" />
              <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl border border-gold-500/20 p-5">
                <h3 className="font-semibold text-white">2022 — կրթական ծրագրերի ներդրում, առաջին դասընթացների անցկացում</h3>
              </div>
            </li>
            <li className="relative">
              <span className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 ring-4 ring-black" aria-hidden="true" />
              <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl border border-gold-500/20 p-5">
                <h3 className="font-semibold text-white">2024 — 100+ նախագծերի ապահովում</h3>
              </div>
            </li>
            <li className="relative">
              <span className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 ring-4 ring-black" aria-hidden="true" />
              <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl border border-gold-500/20 p-5">
                <h3 className="font-semibold text-white">2025 — 5 տարվա գործունեություն շուկայում, ավելի քան 30 նոր գործընկերներ</h3>
              </div>
            </li>
          </ol>
        </div>
      </section>

    </div>;
};
export default About;