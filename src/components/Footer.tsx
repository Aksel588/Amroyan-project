import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram } from 'lucide-react';
import NewsletterSubscription from './NewsletterSubscription';
import AdminLink from './AdminLink';
import { useAdmin } from '@/hooks/useAdmin';
const Footer = () => {
  const { isAdmin } = useAdmin();
  const currentYear = new Date().getFullYear();
  const quickLinks = [{
    name: 'Գլխավոր',
    href: '/'
  }, {
    name: 'Մեր մասին',
    href: '/about'
  }, {
    name: 'Ծառայություններ',
    href: '/services'
  }, {
    name: 'Նորություններ',
    href: '/blog'
  }];
  const services = [{
    name: 'Հարկային խորհրդատվություն',
    href: '/services#tax-consulting'
  }, {
    name: 'Հաշվապահական վարում',
    href: '/services#accounting'
  }, {
    name: 'Ֆինանսական վերլուծություն',
    href: '/services#financial-analysis'
  }, {
    name: 'Բիզնես պլանավորում',
    href: '/services#business-planning'
  }];
  return <footer className="bg-gradient-to-b from-black to-gray-900 border-t border-gold-500/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Newsletter Section */}
        <div className="mb-8 sm:mb-12 text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            <span className="gradient-text">Բաժանորդագրվեք մեր նորություններին</span>
          </h3>
          <p className="text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base px-4">Եղեք տեղեկացված առաջինը</p>
          <NewsletterSubscription className="max-w-md mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <img src="/lovable-uploads/5180109d-84d2-4fc9-aad0-bd08a847311d.png" alt="Amroyan Consulting" className="h-10 sm:h-12 w-auto" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Պրոֆեսիոնալ հաշվապահական և ֆինանսական ծառայություններ 
              Ձեր բիզնեսի աճի և հաջողության համար: Հիմնադրվել է 2020 թվականին:
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-400 transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Արագ հղումներ</h3>
            <ul className="space-y-2">
              {quickLinks.map(link => <li key={link.name}>
                  <Link to={link.href} className="text-gray-400 hover:text-gold-400 transition-colors text-sm py-1 block min-h-[32px] flex items-center">
                    {link.name}
                  </Link>
                </li>)}
              {isAdmin && (
                <li>
                  <AdminLink className="text-gray-400 hover:text-gold-400 transition-colors text-sm py-1 block min-h-[32px] flex items-center">
                    Ադմին
                  </AdminLink>
                </li>
              )}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Ծառայություններ</h3>
            <ul className="space-y-2">
              {services.map(service => <li key={service.name}>
                  <Link to={service.href} className="text-gray-400 hover:text-gold-400 transition-colors text-sm py-1 block min-h-[32px] flex items-center">
                    {service.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Կապ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 min-h-[32px]">
                <Phone size={16} className="text-gold-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+374 55 51 71 31</span>
              </div>
              <div className="flex items-center space-x-3 min-h-[32px]">
                <Mail size={16} className="text-gold-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">amroyanconsulting@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 min-h-[32px]">
                <MapPin size={16} className="text-gold-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">ք․ Երևան, Փիրումյանների 10, 3-րդ հարկ</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Amroyan Consulting. Բոլոր իրավունքները պաշտպանված են:
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;