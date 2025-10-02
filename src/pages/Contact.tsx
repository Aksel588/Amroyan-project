import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { laravelApi } from '@/integrations/laravel/client';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: Phone,
      title: 'Հեռախոս',
      content: '+374 55 51 71 31',
      description: 'WhatsApp, Telegram հասանելի'
    },
    {
      icon: Mail,
      title: 'Էլ. հասցե',
      content: 'amroyanconsulting@gmail.com',
      description: 'Կպատասխանենք 24 ժամվա ընթացքում'
    },
    {
      icon: MapPin,
      title: 'Հասցե',
      content: 'ք․ Երևան, Փիրումյանների 10, 3-րդ հարկ',
      description: 'Կենտրոնական գրասենյակ'
    },
    {
      icon: MapPin,
      title: 'Փոստային հասցե',
      content: '0008, ք․Երևան, Մուրացանի 69',
      description: 'Փաստաթղթերի ուղարկման համար'
    }
  ];

  const servicesData = t('services.list');
  const services = Array.isArray(servicesData) ? servicesData.map((service: any) => service.title) : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for API (map company to subject for now)
      const apiData = {
        name: formData.name,
        email: formData.email,
        subject: formData.company || 'Հետադարձ կապ',
        message: formData.message,
        phone: formData.phone,
        service: formData.service
      };

      await laravelApi.createContactMessage(apiData);

      toast({
        title: "Հաջողություն",
        description: "Ձեր հաղորդագրությունը հաջողությամբ ուղարկվեց: Մեր մասնագետները կկապվեն ձեզ հետ:"
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        service: '',
        message: ''
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց ուղարկել հաղորդագրությունը: Խնդրում ենք փորձել կրկին:",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-black via-gray-900 to-black network-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
              <span className="gradient-text">{t('contact.title')}</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed px-4">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="bg-gradient-to-b from-gray-900 to-black border-gold-500/20 hover:border-gold-400/40 transition-all duration-300 text-center">
                <CardContent className="p-6 sm:p-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <info.icon size={28} className="text-black sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    {info.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gold-400 font-medium mb-2">
                    {info.content}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {info.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 sm:py-16 lg:py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
                <span className="gradient-text">{t('contact.form.title')}</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 px-4">
                {t('contact.form.subtitle')}
              </p>
            </div>

            <Card className="bg-gradient-to-br from-gray-900 to-black border-gold-500/20">
              <CardContent className="p-6 sm:p-8 lg:p-12">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                        {t('contact.form.name')} {t('contact.form.required')}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold-400 transition-colors text-sm sm:text-base min-h-[48px]"
                        placeholder={t('contact.form.placeholders.name')}
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                        {t('contact.form.email')} {t('contact.form.required')}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold-400 transition-colors text-sm sm:text-base min-h-[48px]"
                        placeholder={t('contact.form.placeholders.email')}
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                        {t('contact.form.company')}
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold-400 transition-colors text-sm sm:text-base min-h-[48px]"
                        placeholder={t('contact.form.placeholders.company')}
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                        {t('contact.form.phone')}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold-400 transition-colors text-sm sm:text-base min-h-[48px]"
                        placeholder={t('contact.form.placeholders.phone')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                      {t('contact.form.service')}
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold-400 transition-colors text-sm sm:text-base min-h-[48px]"
                    >
                      <option value="">{t('contact.form.selectService')}</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2 text-sm sm:text-base">
                      {t('contact.form.message')} {t('contact.form.required')}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold-400 transition-colors resize-none text-sm sm:text-base"
                      placeholder={t('contact.form.placeholders.message')}
                    />
                  </div>

                  <div className="text-center pt-2 sm:pt-4">
                    <Button 
                      type="submit" 
                      size="lg"
                      className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-semibold px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg min-h-[48px] w-full sm:w-auto"
                      disabled={loading}
                    >
                      {loading ? 'Ուղարկում...' : t('contact.form.submit')} <Send size={18} className="ml-2 sm:w-5 sm:h-5" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
                <span className="gradient-text">Մեր գտնվելու վայրը</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 px-4">
                Այցելեք մեր գրասենյակ կամ նշանակեք հանդիպում
              </p>
            </div>

            <Card className="bg-gradient-to-br from-gray-900 to-black border-gold-500/20 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center p-6 sm:p-8">
                <div className="text-center">
                  <MapPin size={48} className="text-gold-400 mx-auto mb-4 sm:w-16 sm:h-16" />
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Amroyan Consulting</h3>
                  <p className="text-sm sm:text-base text-gray-300">Երևան, Հայաստան</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-2 px-4">Ճշգրիտ հասցեն կտրամադրվի հանդիպման ժամանակ</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
            <span className="gradient-text">Պատրա՞ստ եք սկսելու</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Մի՛ սպասեք: Կապվեք մեզ հետ այսօր և ստացեք պրոֆեսիոնալ խորհրդատվություն
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg min-h-[48px]"
              onClick={() => window.open('tel:+37455517131')}
            >
              <Phone size={18} className="mr-2 sm:w-5 sm:h-5" />
              Զանգահարել
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-black px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg min-h-[48px]"
              onClick={() => window.open('mailto:amroyanconsulting@gmail.com')}
            >
              <Mail size={18} className="mr-2 sm:w-5 sm:h-5" />
              Գրել նամակ
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
