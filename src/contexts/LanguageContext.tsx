
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'hy' | 'ru' | 'en';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('hy');

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  hy: {
    header: {
      nav: {
        home: 'Գլխավոր',
        about: 'Մեր մասին',
        services: 'Ծառայություններ',
        calculators: 'Հաշվիչներ',
        blog: 'Նորություններ',
        contact: 'Կապ'
      },
      cta: 'Դիմել',
      logout: 'Դուրս գալ',
      login: 'Մուտք'
    },
    home: {
      hero: {
        title: 'Հաշվապահական և Ֆինանսական ծառայություններ',
        subtitle: 'Արհեստավարժություն և պատասխանատվություն',
        description: 'Ձեր բիզնեսի հաջողության համար',
        servicesBtn: 'Ծառայություններ',
        contactBtn: 'Դիմել',
        stats: {
          experience: '4+ տարիների փորձ',
          clients: '200+ գործընկերներ',
          satisfaction: '98% բավարարված հաճախորդներ',
          projects: '500+ կատարված նախագծեր'
        }
      },
      services: {
        title: 'Ծառայություններ',
        subtitle: 'Ամբողջական լուծումներ Ձեր բիզնեսի ֆինանսական կարիքների համար'
      },
      features: {
        title: 'Ինչու՞ մենք',
        items: [
          'Փորձառու մասնագետների թիմ 2020 թվականից',
          'Հարկային և տեսչական ստուգումների ընթացքում պաշտպանություն',
          'Անվտանգ և գաղտնի',
          'Ժամանակակից տեխնոլոգիաներ'
        ]
      }
    },
    services: {
      title: 'Մեր ծառայությունները',
      subtitle: 'Ամբողջական ֆինանսական լուծումներ Ձեր բիզնեսի աճի և զարգացման համար',
      list: [
        {
          title: 'Հարկային, ֆինանսական և կադրային խորհրդատվություն',
          description: 'Պրոֆեսիոնալ խորհրդատվություն բոլոր ֆինանսական հարցերում',
          features: [
            'Հարկային պլանավորում և օպտիմալացում',
            'Ֆինանսական ռիսկերի գնահատում',
            'Կադրային քաղաքականության մշակում',
            'Օրենսդրական փոփոխությունների մշտադիտարկում'
          ]
        },
        {
          title: 'Հաշվապահական հաշվառման վարում',
          description: 'Ամբողջական հաշվապահական ծառայություններ Ձեր բիզնեսի համար',
          features: [
            'Ամենօրյա հաշվապահական գրանցումներ',
            'Ֆինանսական հաշվետվությունների կազմում',
            'Հարկային հաշվետվությունների նախապատրաստում',
            'Գանձապահական գործառնություններ'
          ]
        },
        {
          title: 'Հաշվապահական քաղաքականության մշակում',
          description: 'Պատվիրատուի գործունեությանը համապատասխան քաղաքականություն',
          features: [
            'Ընկերային հաշվապահական քաղաքականություն',
            'Ընթացակարգերի ստանդարտացում',
            'Ներքին հսկողության համակարգ',
            'Ռիսկերի կառավարման մեխանիզմներ'
          ]
        },
        {
          title: 'Ընթացիկ գործունեությանն առնչվող գործառույթներ',
          description: 'Ամենօրյա գործառնական աջակցություն Ձեր բիզնեսին',
          features: [
            'Փաստաթղթառության կազմակերպում',
            'Բանկային գործառնությունների համակարգում',
            'Մատակարարների հետ հաշվարկներ',
            'Գույքագրման անցկացում'
          ]
        },
        {
          title: 'Հարկային և վիճակագրական հաշվետվություններ',
          description: 'Ժամանակին և ճշգրիտ հաշվետվությունների ներկայացում',
          features: [
            'Ամսական հարկային հաշվետվություններ',
            'Տարեկան ֆինանսական հաշվետվություններ',
            'Վիճակագրական տվյալների հավաքագրում',
            'Հաշվետվությունների վերլուծություն'
          ]
        },
        {
          title: 'Խմբային և անհատական հաշվապահական դասընթացներ',
          description: 'Մասնագիտական կրթություն և վերապատրաստում',
          features: [
            'Հիմնական հաշվապահական գիտելիքներ',
            'Հարկային օրենսդրության ուսուցում',
            'Համակարգչային ծրագրերի օգտագործում',
            'Արտոնագրման և վավերացման աջակցություն'
          ]
        },
        {
          title: 'Ֆինանսական վերլուծությունների կատարում',
          description: 'Մանրամասն ֆինանսական հաշվետվություններ և վերլուծություններ',
          features: [
            'Շահույթի և վնասի վերլուծություն',
            'Կանխատեսային բյուջետավորում',
            'Ֆինանսական ցուցանիշների գնահատում',
            'Ինվեստիցիոն նախագծերի գնահատում'
          ]
        },
        {
          title: 'Բիզնես-պլանների կազմում',
          description: 'Ռազմավարական պլանավորում և բիզնես ռազմավարության մշակում',
          features: [
            'Շուկայական հետազոտություն',
            'Ֆինանսական մոդելավորում',
            'Ռիսկերի գնահատում',
            'Ներդրումային գրավչության գնահատում'
          ]
        }
      ]
    },
    contact: {
      title: 'Կապ մեզ հետ',
      subtitle: 'Պատրա՞ստ եք սկսելու: Կապվեք մեզ հետ և ստացեք անվճար խորհրդատվություն',
      form: {
        title: 'Ուղարկեք մեզ հաղորդագրություն',
        subtitle: 'Լրացրեք ձևը և մեր մասնագետները կկապվեն ձեզ հետ',
        name: 'Անուն Ազգանուն',
        email: 'Էլ. հասցե',
        company: 'Ընկերություն',
        phone: 'Հեռախոս',
        service: 'Ծառայություն',
        message: 'Հաղորդագրություն',
        submit: 'Ուղարկել հաղորդագրությունը',
        required: '*',
        placeholders: {
          name: 'Ձեր անունը',
          email: 'your@email.com',
          company: 'Ձեր ընկերությունը',
          phone: '+374 XX XXX XXX',
          message: 'Նկարագրեք Ձեր կարիքները...'
        },
        selectService: 'Ընտրեք ծառայությունը'
      }
    }
  },
  ru: {
    header: {
      nav: {
        home: 'Главная',
        about: 'О нас',
        services: 'Услуги',
        calculators: 'Калькуляторы',
        blog: 'Новости',
        contact: 'Контакты'
      },
      cta: 'Обратиться',
      logout: 'Выйти',
      login: 'Вход'
    },
    home: {
      hero: {
        title: 'Бухгалтерские и финансовые услуги',
        subtitle: 'Профессионализм и ответственность',
        description: 'для успеха вашего бизнеса',
        servicesBtn: 'Услуги',
        contactBtn: 'Обратиться',
        stats: {
          experience: '4+ лет опыта',
          clients: '200+ партнеров',
          satisfaction: '98% довольных клиентов',
          projects: '500+ выполненных проектов'
        }
      },
      services: {
        title: 'Услуги',
        subtitle: 'Комплексные решения для финансовых потребностей вашего бизнеса'
      },
      features: {
        title: 'Почему мы?',
        items: [
          'Команда опытных специалистов с 2020 года',
          'Защита при налоговых и инспекционных проверках',
          'Безопасно и конфиденциально',
          'Современные технологии'
        ]
      }
    },
    services: {
      title: 'Наши услуги',
      subtitle: 'Комплексные финансовые решения для роста и развития вашего бизнеса',
      list: [
        {
          title: 'Налоговое, финансовое и кадровое консультирование',
          description: 'Профессиональные консультации по всем финансовым вопросам',
          features: [
            'Налоговое планирование и оптимизация',
            'Оценка финансовых рисков',
            'Разработка кадровой политики',
            'Мониторинг законодательных изменений'
          ]
        },
        {
          title: 'Ведение бухгалтерского учета',
          description: 'Полный комплекс бухгалтерских услуг для вашего бизнеса',
          features: [
            'Ежедневные бухгалтерские записи',
            'Составление финансовой отчетности',
            'Подготовка налоговой отчетности',
            'Операции казначейства'
          ]
        },
        {
          title: 'Разработка учетной политики',
          description: 'Политика, соответствующая деятельности заказчика',
          features: [
            'Корпоративная учетная политика',
            'Стандартизация процедур',
            'Система внутреннего контроля',
            'Механизмы управления рисками'
          ]
        },
        {
          title: 'Функции, связанные с текущей деятельностью',
          description: 'Ежедневная операционная поддержка вашего бизнеса',
          features: [
            'Организация документооборота',
            'Координация банковских операций',
            'Расчеты с поставщиками',
            'Проведение инвентаризации'
          ]
        },
        {
          title: 'Налоговая и статистическая отчетность',
          description: 'Своевременная и точная подача отчетности',
          features: [
            'Ежемесячная налоговая отчетность',
            'Годовая финансовая отчетность',
            'Сбор статистических данных',
            'Анализ отчетности'
          ]
        },
        {
          title: 'Групповые и индивидуальные курсы бухгалтерии',
          description: 'Профессиональное образование и переподготовка',
          features: [
            'Основы бухгалтерского учета',
            'Изучение налогового законодательства',
            'Использование компьютерных программ',
            'Помощь в лицензировании и сертификации'
          ]
        },
        {
          title: 'Проведение финансового анализа',
          description: 'Подробные финансовые отчеты и анализ',
          features: [
            'Анализ прибылей и убытков',
            'Прогнозное бюджетирование',
            'Оценка финансовых показателей',
            'Оценка инвестиционных проектов'
          ]
        },
        {
          title: 'Составление бизнес-планов',
          description: 'Стратегическое планирование и разработка бизнес-стратегии',
          features: [
            'Исследование рынка',
            'Финансовое моделирование',
            'Оценка рисков',
            'Оценка инвестиционной привлекательности'
          ]
        }
      ]
    },
    contact: {
      title: 'Свяжитесь с нами',
      subtitle: 'Готовы начать? Свяжитесь с нами и получите бесплатную консультацию',
      form: {
        title: 'Отправьте нам сообщение',
        subtitle: 'Заполните форму и наши специалисты свяжутся с вами',
        name: 'Имя Фамилия',
        email: 'Эл. адрес',
        company: 'Компания',
        phone: 'Телефон',
        service: 'Услуга',
        message: 'Сообщение',
        submit: 'Отправить сообщение',
        required: '*',
        placeholders: {
          name: 'Ваше имя',
          email: 'your@email.com',
          company: 'Ваша компания',
          phone: '+374 XX XXX XXX',
          message: 'Опишите ваши потребности...'
        },
        selectService: 'Выберите услугу'
      }
    }
  },
  en: {
    header: {
      nav: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        calculators: 'Calculators',
        blog: 'News',
        contact: 'Contact'
      },
      cta: 'Get Started',
      logout: 'Logout',
      login: 'Login'
    },
    home: {
      hero: {
        title: 'Accounting and Financial Services',
        subtitle: 'Expertise and Responsibility',
        description: 'for your business success',
        servicesBtn: 'Services',
        contactBtn: 'Contact',
        stats: {
          experience: '4+ years experience',
          clients: '200+ partners',
          satisfaction: '98% satisfied clients',
          projects: '500+ completed projects'
        }
      },
      services: {
        title: 'Services',
        subtitle: 'Comprehensive solutions for your business financial needs'
      },
      features: {
        title: 'Why choose us?',
        items: [
          'Team of experienced professionals since 2020',
          'Protection during tax and inspection audits',
          'Safe and confidential',
          'Modern technologies'
        ]
      }
    },
    services: {
      title: 'Our Services',
      subtitle: 'Comprehensive financial solutions for your business growth and development',
      list: [
        {
          title: 'Tax, Financial and HR Consulting',
          description: 'Professional consulting on all financial matters',
          features: [
            'Tax planning and optimization',
            'Financial risk assessment',
            'HR policy development',
            'Legislative changes monitoring'
          ]
        },
        {
          title: 'Bookkeeping and Accounting',
          description: 'Complete accounting services for your business',
          features: [
            'Daily accounting entries',
            'Financial statements preparation',
            'Tax returns preparation',
            'Treasury operations'
          ]
        },
        {
          title: 'Accounting Policy Development',
          description: 'Policy tailored to client\'s business activities',
          features: [
            'Corporate accounting policy',
            'Procedures standardization',
            'Internal control system',
            'Risk management mechanisms'
          ]
        },
        {
          title: 'Current Operations Support',
          description: 'Daily operational support for your business',
          features: [
            'Document flow organization',
            'Banking operations coordination',
            'Supplier settlements',
            'Inventory management'
          ]
        },
        {
          title: 'Tax and Statistical Reporting',
          description: 'Timely and accurate reporting submission',
          features: [
            'Monthly tax reports',
            'Annual financial statements',
            'Statistical data collection',
            'Reports analysis'
          ]
        },
        {
          title: 'Group and Individual Accounting Courses',
          description: 'Professional education and retraining',
          features: [
            'Basic accounting knowledge',
            'Tax legislation training',
            'Computer software usage',
            'Licensing and certification support'
          ]
        },
        {
          title: 'Financial Analysis',
          description: 'Detailed financial reports and analysis',
          features: [
            'Profit and loss analysis',
            'Forecast budgeting',
            'Financial indicators assessment',
            'Investment projects evaluation'
          ]
        },
        {
          title: 'Business Plan Development',
          description: 'Strategic planning and business strategy development',
          features: [
            'Market research',
            'Financial modeling',
            'Risk assessment',
            'Investment attractiveness evaluation'
          ]
        }
      ]
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Ready to start? Contact us and get free consultation',
      form: {
        title: 'Send us a message',
        subtitle: 'Fill out the form and our specialists will contact you',
        name: 'Full Name',
        email: 'Email',
        company: 'Company',
        phone: 'Phone',
        service: 'Service',
        message: 'Message',
        submit: 'Send Message',
        required: '*',
        placeholders: {
          name: 'Your name',
          email: 'your@email.com',
          company: 'Your company',
          phone: '+374 XX XXX XXX',
          message: 'Describe your needs...'
        },
        selectService: 'Select service'
      }
    }
  }
};
