
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

const STORAGE_KEY = 'amroyan_lang';

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === 'hy' || saved === 'ru' || saved === 'en') return saved;
    } catch (_) {}
    return 'hy';
  });

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {}
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
        archive: 'Շտեմարան',
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
        mainTitle: 'Պրոֆեսիոնալ հաշվապահական և ֆինանսական ծառայություններ',
        tagline: 'Ձեր բիզնեսի հաջողության համար',
        subtitle: 'Արհեստավարժություն և պատասխանատվություն',
        description: 'Ձեր բիզնեսի հաջողության համար',
        servicesBtn: 'Ծառայություններ',
        contactBtn: 'Դիմել',
        stats: {
          experience: '4+ տարիների փորձ',
          clients: '200+ գործընկերներ',
          satisfaction: '98% բավարարված հաճախորդներ',
          projects: '500+ կատարված նախագծեր'
        },
        statsLabels: ['գործընկերներ', 'տարիների փորձ', 'տարեկան աճ', 'կատարված նախագծեր']
      },
      services: {
        title: 'Ծառայություններ',
        subtitle: 'Առաջարկում ենք ամբողջական լուծումներ Ձեր բիզնեսի ֆինանսական կարիքների համար',
        list: [
          'Հաշվապահական հաշվառում',
          'Հարկային, ֆինանսական և կադրային խորհրդատվություն',
          'Ֆինանսական վերլուծություն',
          'Ֆինանսական հաշվետվություն',
          'Բիզնես Խորհրդատվություն',
          'Խմբային և անհատական հաշվապահական դասընթացներ'
        ],
        apply: 'Դիմել'
      },
      features: {
        title: 'Ինչու՞ մենք',
        bullets: [
          'Փորձառու մասնագետների թիմ',
          'Հարկային և տեսչական ստուգումների ընթացքում պատվիրատուի շահերի պաշտպանություն',
          'Հուսալի և վստահելի',
          'Ժամանակակից տեխնոլոգիաներ և գործիքակազմի կիրառում'
        ],
        items: [
          'Փորձառու մասնագետների թիմ 2020 թվականից',
          'Հարկային և տեսչական ստուգումների ընթացքում պաշտպանություն',
          'Անվտանգ և գաղտնի',
          'Ժամանակակից տեխնոլոգիաներ'
        ]
      },
      aboutBtn: 'Մեր մասին',
      weProvideTitle: 'Մենք ապահովում ենք',
      weProvideDesc: 'Պրոֆեսիոնալ ծառայությունների մատուցումը, ինչը նպաստում է Ձեր բիզնեսի աճին։',
      loading: 'Բեռնում...',
      noDocumentsYet: 'Դեռ փաստաթղթեր չեն ավելացվել',
      applyDialog: {
        title: 'Դիմում դասընթացներին',
        description: 'Լրացրեք ձեր տվյալները և մենք կկապվենք ձեզ հետ',
        fullName: 'Անուն Ազգանուն',
        phone: 'Հեռախոսահամար',
        email: 'Էլ. փոստ',
        message: 'Հաղորդագրություն',
        placeholderName: 'Ձեր անունն ու ազգանունը',
        placeholderPhone: '+374 XX XXX XXX',
        placeholderEmail: 'your@email.com',
        placeholderMessage: 'Լրացուցիչ տեղեկություններ կամ հարցեր...',
        close: 'Փակել',
        submit: 'Ուղարկել հայտը',
        submitting: 'Ուղարկվում է...',
        thankYou: 'Շնորհակալություն!',
        successMessage: 'Ձեր դիմումը հաջողությամբ ուղարկվեց: Մեր թիմը կկապվի ձեզ հետ մոտակա ժամանակներում:',
        submitAgain: 'Նոր դիմում ուղարկել'
      },
      toast: {
        error: 'Սխալ',
        success: 'Հաջողություն',
        fillRequired: 'Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը',
        applicationSent: 'Ձեր դիմումը հաջողությամբ ուղարկվեց! Մենք կկապվենք ձեզ հետ:',
        sendFailed: 'Չհաջողվեց ուղարկել դիմումը: Խնդրում ենք փորձել կրկին:'
      }
    },
    services: {
      title: 'Մեր ծառայությունները',
      subtitle: 'Ամբողջական ֆինանսական լուծումներ Ձեր բիզնեսի աճի և զարգացման համար',
      list: [
        {
          title: 'Հաշվապահական հաշվառում',
          description: 'Ամբողջական հաշվապահական սպասարկում՝ ՀԾ ծրագրով և հաշվետվությունների ներկայացմամբ',
          features: ['Հաշվապահության վարում ՀԾ ծրագրով', 'Հարկային հաշվետվությունների ներկայացում', 'Վիճակագրական հաշվետվությունների ներկայացում', 'Կադրային հաշվապահության վարում']
        },
        {
          title: 'Հարկային, ֆինանսական և կադրային խորհրդատվություն',
          description: 'Մասնագիտական աջակցություն հարկային, ֆինանսական և կադրային հարցերում',
          features: ['Պլանավորում', 'Հարկերի օպտիմալացում', 'Հարկային ռիսկերի գնահատում', 'Հարկային, ֆինանսական և կադրային վեճերի լուծում']
        },
        {
          title: 'Բիզնես-խորհրդատվություն',
          description: 'Բիզնեսի ռազմավարական ուղղությունների մշակում և գնահատում',
          features: ['Բիզնես-ռազմավարության մշակում', 'Բիզնես-պլանների կազմում', 'Շուկայի հետազոտություն և գնահատական']
        },
        {
          title: 'Ֆինանսական վերլուծություն',
          description: 'Ձեր ֆինանսների խորքային վերլուծություն և կառավարման գործիքներ',
          features: ['Ֆինանսական հաշվետվությունների կազմում և ներկայացում հիմնադիրներին', 'Եկամուտ-ծախսերի հաշվարկ', 'Դրամական հոսքերի հաշվետվություն, հոսքերի կառավարում', 'Կատարողականի վերահսկում', 'Բյուջետավորում և կանխատեսում', 'Եկամտաբերության գնահատում', 'Եկամտաբերության բարձրացման ուղղված միջոցների կիրառում', 'Կազմակերպության ծախսերի օպտիմալացում']
        },
        {
          title: 'Հարկային և տեսչական ստուգումների ընթացքում Պատվիրատուի շահերի պաշտպանում',
          description: 'Ձեր շահերի ներկայացում և պաշտպանություն ստուգման գործընթացում',
          features: ['Ստուգմանը նախորդող աուդիտ-դիտարկման անցկացում', 'Ռիսկերի գնահատում և նվազեցում', 'Ստուգման անցկացում']
        },
        {
          title: 'Խմբային և անհատական հաշվապահական դասընթացներ',
          description: 'Գործնական դասընթացներ սկսնակների և մասնագետների համար',
          features: ['Հաշվապահական հաշվառման դասընթացներ', 'Ֆինանսական և կառավարչական հաշվառման դասընթացներ', 'Կադրային հաշվապահության դասընթացներ', 'Հարկային և կադրային ոլորտներին վերաբերող սեմինար-քննարկումներ']
        }
      ],
      whyUsTitle: 'Ինչու՞ մենք',
      whyUsBullets: ['Փորձառու մասնագետների թիմ', 'Հարկային և տեսչական ստուգումների ընթացքում պատվիրատուի շահերի պաշտպանում', 'Հուսալի և վստահելի', 'Ժամանակակից տեխնոլոգիաներ և գործիքակազմի կիրառում'],
      aboutBtn: 'Մեր մասին',
      weProvideTitle: 'Մենք ապահովում ենք',
      weProvideDesc: 'Պրոֆեսիոնալ ծառայությունների մատուցումը, ինչը նպաստում է Ձեր բիզնեսի աճին։',
      ctaTitle: 'Դիմեք դասընթացների համար',
      ctaDesc: 'Ինտերես ունե՞ք մեր հաշվապահական դասընթացներին մասնակցելու համար? Լրացրեք դիմումը և մենք կկապվենք ձեզ հետ մոտակա ժամանակներում:'
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
        submitting: 'Ուղարկում...',
        required: '*',
        defaultSubject: 'Հետադարձ կապ',
        placeholders: {
          name: 'Ձեր անունը',
          email: 'your@email.com',
          company: 'Ձեր ընկերությունը',
          phone: '+374 XX XXX XXX',
          message: 'Նկարագրեք Ձեր կարիքները...'
        },
        selectService: 'Ընտրեք ծառայությունը'
      },
      toast: {
        success: 'Հաջողություն',
        messageSent: 'Ձեր հաղորդագրությունը հաջողությամբ ուղարկվեց: Մեր մասնագետները կկապվեն ձեզ հետ:',
        error: 'Սխալ',
        sendFailed: 'Չհաջողվեց ուղարկել հաղորդագրությունը: Խնդրում ենք փորձել կրկին:'
      },
      info: {
        phone: 'Հեռախոս',
        phoneDesc: 'WhatsApp, Telegram հասանելի',
        email: 'Էլ. հասցե',
        emailDesc: 'Կպատասխանենք 24 ժամվա ընթացքում',
        address: 'Հասցե',
        addressDesc: 'Կենտրոնական գրասենյակ',
        addressValue: 'ք․ Երևան, Փիրումյանների 10, 3-րդ հարկ',
        postal: 'Փոստային հասցե',
        postalDesc: 'Փաստաթղթերի ուղարկման համար',
        postalValue: '0008, ք․Երևան, Մուրացանի 69'
      },
      mapTitle: 'Մեր գտնվելու վայրը',
      mapSubtitle: 'Այցելեք մեր գրասենյակ կամ նշանակեք հանդիպում',
      mapCity: 'Երևան, Հայաստան',
      mapAddressNote: 'Ճշգրիտ հասցեն կտրամադրվի հանդիպման ժամանակ',
      ctaTitle: 'Պատրա՞ստ եք սկսելու',
      ctaSubtitle: 'Մի՛ սպասեք: Կապվեք մեզ հետ այսօր և ստացեք պրոֆեսիոնալ խորհրդատվություն',
      call: 'Զանգահարել',
      writeEmail: 'Գրել նամակ'
    },
    footer: {
      newsletterTitle: 'Բաժանորդագրվեք մեր նորություններին',
      newsletterSubtitle: 'Եղեք տեղեկացված առաջինը',
      quickLinks: 'Արագ հղումներ',
      services: 'Ծառայություններ',
      contact: 'Կապ',
      admin: 'Ադմին',
      copyright: 'Բոլոր իրավունքները պաշտպանված են',
      companyDesc: 'Պրոֆեսիոնալ հաշվապահական և ֆինանսական ծառայություններ Ձեր բիզնեսի աճի և հաջողության համար: Հիմնադրվել է 2020 թվականին:',
      address: 'ք․ Երևան, Փիրումյանների 10, 3-րդ հարկ',
      serviceTax: 'Հարկային խորհրդատվություն',
      serviceAccounting: 'Հաշվապահական վարում',
      serviceFinancial: 'Ֆինանսական վերլուծություն',
      serviceBusiness: 'Բիզնես պլանավորում'
    },
    adminPanel: {
      title: 'Ադմինիստրատորի վահանակ',
      signOut: 'Դուրս գալ',
      signOutToast: 'Դուրս գալիս',
      signOutSuccess: 'Դուք հաջողությամբ դուրս եկաք համակարգից:',
      statsArchive: 'Շտեմարան',
      statsPdfFiles: 'PDF ֆայլեր',
      statsUsers: 'Օգտատերեր',
      statsRegisteredUsers: 'Գրանցված օգտատերեր',
      statsBlogPosts: 'Բլոգ գրառումներ',
      statsTotalPosts: 'Ընդամենը գրառումներ',
      statsMessages: 'Հաղորդագրություններ',
      statsMessagesReceived: 'Ստացված հաղորդագրություններ',
      statsNewsletters: 'Նորություններ',
      statsSubscribers: 'Բաժանորդներ',
      tabOverview: 'Ընդհանուր',
      tabMessages: 'Հաղորդագրություններ',
      tabBlog: 'Բլոգ',
      tabDocuments: 'Շտեմարան',
      tabApplications: 'Դիմումներ',
      tabUsers: 'Օգտատերեր',
      tabSettings: 'Կարգավորումներ',
      blogManagement: 'Բլոգի կառավարում',
      blogManagementDesc: 'Ստեղծեք և կառավարեք բլոգի գրառումները',
      createNewPost: 'Նոր գրառում ստեղծել',
      managePosts: 'Գրառումների կառավարում',
      archiveManagement: 'Շտեմարանի կառավարում',
      archiveManagementDesc: 'Վերբեռնեք և կառավարեք PDF փաստաթղթերը',
      uploadFile: 'Ֆայլ վերբեռնել',
      messagesDesc: 'Դիտեք և պատասխանեք հաղորդագրություններին',
      unreadMessages: 'Չկարդացված հաղորդագրություններ',
      statistics: 'Վիճակագրություն',
      statisticsDesc: 'Կայքի գործունեության վիճակագրություն',
      activeDocuments: 'Ակտիվ փաստաթղթեր:',
      publishedPosts: 'Հրապարակված գրառումներ:',
      courseApplications: 'Դիմումներ դասընթացների համար',
      courseApplicationsDesc: 'Կառավարեք դիմումները դասընթացների համար',
      manageApplications: 'Դիմումներ կառավարել',
      totalApplications: 'Ընդամենը',
      applicationCount: 'դիմում',
      lastPosts: 'Վերջին գրառումները',
      lastPostsDesc: 'Վերջերս ստեղծված բլոգի գրառումները',
      noPosts: 'Գրառումներ չկան',
      published: 'Հրապարակված',
      draft: 'Սևագիր',
      hide: 'Թաքցնել',
      publish: 'Հրապարակել',
      deletePost: 'Ջնջել գրառումը',
      viewAllPosts: 'Բոլոր գրառումները դիտել',
      lastDocuments: 'Վերջին փաստաթղթերը',
      lastDocumentsDesc: 'Վերջերս վերբեռնված փաստաթղթերի ցանկ',
      noDocuments: 'Փաստաթղթեր չկան',
      deleteDocument: 'Ջնջել փաստաթուղթը',
      toastError: 'Սխալ',
      postPublished: 'Գրառումը հրապարակվեց',
      postHidden: 'Գրառումը թաքցվեց',
      postUpdateFailed: 'Չհաջողվեց թարմացնել գրառումը',
      confirmDeletePost: 'Ջնջե՞լ գրառումը բոլորովին.',
      postDeleted: 'Գրառումը ջնջվեց',
      postDeleteFailed: 'Չհաջողվեց ջնջել գրառումը',
      docPublished: 'Փաստաթուղթը հրապարակվեց',
      docHidden: 'Փաստաթուղթը թաքցվեց',
      changesSaved: 'Փոփոխությունները պահպանվեցին տվյալների բազայում',
      docUpdateFailed: 'Չհաջողվեց թարմացնել փաստաթուղթը',
      confirmDeleteDoc: 'Ջնջե՞լ փաստաթուղթը բոլորովին. Այս գործողությունը անդառնալի է.',
      docDeleted: 'Փաստաթուղթը ջնջվեց',
      docDeleteFailed: 'Չհաջողվեց ջնջել փաստաթուղթը',
      applicationApproved: 'Հայտը հաստատվեց',
      applicationRejected: 'Հայտը մերժվեց',
      applicationUpdateFailed: 'Չհաջողվեց թարմացնել հայտը',
      confirmDeleteApplication: 'Ջնջե՞լ դիմումը բոլորովին.',
      applicationDeleted: 'Դիմումը ջնջվեց',
      applicationDeleteFailed: 'Չհաջողվեց ջնջել դիմումը'
    },
    about: {
      heroTitle: 'Մեր մասին',
      heroSubtitle: 'Amroyan Consulting-ը առաջատար ընկերություն է հաշվապահական և ֆինանսական ծառայությունների ոլորտում՝ 5+ տարվա փորձով:',
      missionLabel: 'Առաքելություն',
      missionTitle: 'Մեր առաքելությունը',
      missionP1: 'Մեր նպատակն է օգնել բիզնեսներին հասնել ֆինանսական կայունության և աճի՝ տրամադրելով պրոֆեսիոնալ հաշվապահական և ֆինանսական ծառայություններ։',
      missionP2: 'Մենք հավատում ենք, որ յուրաքանչյուր բիզնես արժանի է որակյալ ֆինանսական աջակցության՝ անկախ գործունեության ոլորտից և իր մեծությունից։',
      valuesTitle: 'Մեր արժեքները',
      valuesSubtitle: 'Աշխատանքի մեջ մենք առաջնորդվում ենք հետևյալ հիմնական սկզբունքներով',
      values: [
        { title: 'Հուսալիություն', description: 'Մեր պատվիրատուները վստահ են իրենց ֆինանսական և հաշվապահական կառավարման մեջ' },
        { title: 'Որակ', description: 'Միայն բարձրակարգ և արհեստավարժ ծառայությունների մատուցում' },
        { title: 'Նպատակայնություն', description: 'Մենք կենտրոնացած ենք Ձեր բիզնեսի հաջողության վրա և աշխատում ենք հասնել լավագույն արդյունքների:' },
        { title: 'Արդյունավետություն', description: 'Ժամանակը արժեք է, և մենք գնահատում ենք Ձեր ժամանակը խնայելով այն։' }
      ],
      timelineTitle: 'Մեր ուղին',
      timelineSubtitle: 'Մեր ընկերության զարգացման հիմնական փուլերը',
      timeline: [
        '2020 — ընկերության հիմնադրում',
        '2021 — առաջին 20+ իրագործված նախագծեր',
        '2022 — կրթական ծրագրերի ներդրում, առաջին դասընթացների անցկացում',
        '2024 — 100+ նախագծերի ապահովում',
        '2025 — 5 տարվա գործունեություն շուկայում, ավելի քան 30 նոր գործընկերներ'
      ]
    },
    archive: {
      heroTitle: 'Շտեմարան',
      heroSubtitle: 'Օգտակար փաստաթղթեր և տեղեկատվություն',
      sectionsTitle: 'Շտեմարանի բաժիններ',
      sectionsSubtitle: 'Արագ մուտք դեպի տարբեր կատեգորիաների փաստաթղթեր',
      documentsTitle: 'Փաստաթղթեր',
      documentsSubtitle: 'Բոլոր հասանելի փաստաթղթերը կատեգորիաների համաձայն',
      warehouseTitle: 'Շտեմարանի փաստաթղթեր',
      warehouseSubtitle: 'Բազայից բեռնված փաստաթղթեր ըստ կատեգորիաների',
      noDocuments: 'Փաստաթղթեր դեռ չկան։ Վերնախավից կարող եք փաստաթղթեր ավելացնել։',
      downloadPdf: 'Ներբեռնել PDF',
      downloadPdfLoading: 'Բեռնվում է...',
      openDoc: 'Բացել',
      download: 'Ներբեռնել',
      views: 'դիտում',
      seeAllDocuments: 'Տեսնել բոլոր փաստաթղթերը',
      loading: 'Բեռնում...',
      toast: {
        error: 'Սխալ',
        loadFailed: 'Չհաջողվեց բեռնել փաստաթղթերը',
        downloaded: 'Բեռնվեց',
        documentDownloaded: 'Փաստաթուղթը ներբեռնվեց',
        downloadFailed: 'Չհաջողվեց ներբեռնել փաստաթուղթը',
        pdfDownloaded: 'PDF-ը ներբեռնվեց',
        pdfFailed: 'Չհաջողվեց ներբեռնել PDF-ը'
      },
      sectionCards: {
        standardsTitle: 'ՀՀՄՍ / ՖՀՄՍ',
        standardsDesc: 'Հայաստանի հաշվապահական միջազգային ստանդարտներ',
        pekTitle: 'ՊԵԿ իրազեկումներ',
        pekDesc: 'Պետական եկամուտների կոմիտեի ծանուցումներ',
        discussionsTitle: 'Քննարկումներ',
        discussionsDesc: 'Մասնագիտական քննարկումներ և վերլուծություններ',
        clarificationsTitle: 'Պաշտոնական պարզաբանումներ',
        clarificationsDesc: 'Պաշտոնական պարզաբանումներ և մեկնաբանություններ',
        clarificationsAria: 'Պարզաբանումների ենթակատեգորիաներ',
        taxLaw: 'Հարկային օրենսդրություն',
        laborLaw: 'Աշխատանքային օրենսդրություն',
        testsTitle: 'Թեստեր',
        testsDesc: 'Մասնագիտական թեստեր և ստուգումներ',
        testsAria: 'Թեստերի ենթակատեգորիաներ',
        testsAccounting: 'Հաշվապահական և ֆինանսական ոլորտ',
        testsHr: 'HR, կադրային ոլորտ'
      },
      categories: {
        standards: 'Ստանդարտներ',
        pek_notifications: 'ՊԵԿ ծանուցումներ',
        clarifications_tax: 'Հարկային պարզաբանումներ',
        clarifications_labor: 'Աշխատանքային պարզաբանումներ',
        discussions: 'Քննարկումներ',
        tests_accounting_finance: 'Հաշվապահական և ֆինանսական թեստեր',
        tests_hr: 'Մարդկային ռեսուրսների թեստեր'
      }
    },
    blog: {
      heroTitle: 'Նորություններ',
      featuredTitle: 'Առաջնային հոդված',
      readMore: 'Կարդալ ավելին',
      seeAll: 'Տեսնել բոլորը',
      allCategory: 'Բոլորը',
      loading: 'Բեռնում...',
      toast: {
        error: 'Սխալ',
        loadFailed: 'Չհաջողվեց բեռնել բլոգի գրառումները'
      }
    },
    calculators: {
      heroTitle: 'Ֆինանսական հաշվիչներ',
      heroSubtitle: 'Պրոֆեսիոնալ գործիքներ ձեր բիզնեսի ֆինանսական հաշվարկների համար',
      stats: [
        { number: '8+', label: 'հաշվիչներ' },
        { number: '100%', label: 'ճշգրտություն' },
        { number: '24/7', label: 'մատչելիություն' },
        { number: '0', label: 'ծախս' }
      ],
      featuresTitle: 'Ինչու՞ մեր հաշվիչները',
      featuresSubtitle: 'Մենք առաջարկում ենք ամենաարդյունավետ գործիքները ձեր ֆինանսական հաշվարկների համար',
      features: [
        { title: 'Պրոֆեսիոնալ հաշվարկներ', description: 'Մեր հաշվիչները հիմնված են ամենավերջին հարկային և ֆինանսական կարգավորումների վրա' },
        { title: 'Արագ և ճշգրիտ', description: 'Ստացեք ակնթարթային արդյունքներ ձեր ֆինանսական հաշվարկների համար' },
        { title: 'Վստահելի', description: 'Բոլոր հաշվարկները ստուգված են մասնագետների կողմից' },
        { title: 'Կենտրոնացված', description: 'Մի տեղում բոլոր անհրաժեշտ ֆինանսական գործիքները' }
      ],
      listTitle: 'Հասանելի հաշվիչներ',
      listSubtitle: 'Ընտրեք ձեզ անհրաժեշտ հաշվիչը և սկսեք հաշվարկները',
      searchPlaceholder: 'Փնտրել հաշվիչներ... (օր. աշխատավարձ, հարկ, նպաստ)',
      selectCategory: 'Ընտրել կատեգորիա',
      sortByTitle: 'Անուն',
      sortByCategory: 'Կատեգորիա',
      filters: 'Ֆիլտրեր',
      clear: 'Մաքրել',
      advancedFilters: 'Ընդլայնված ֆիլտրեր',
      tagsLabel: 'Հատկորոշիչներ (տեգեր)',
      foundCount: 'Գտնվել է {count} հաշվիչ {total}-ից',
      searchLabel: 'Փնտրում',
      categoryLabel: 'Կատեգորիա',
      showingAll: 'Ցուցադրվում են բոլոր {count} հաշվիչները',
      showingCount: 'Ցուցադրվում է {count} հաշվիչ {total}-ից',
      noResultsTitle: 'Հաշվիչներ չեն գտնվել',
      noResultsDesc: 'Փորձեք փոխել ձեր որոնման պարամետրերը կամ մաքրել ֆիլտրերը',
      clearAllFilters: 'Մաքրել բոլոր ֆիլտրերը',
      openCalculator: 'Բացել հաշվիչը',
      moreTags: 'այլ',
      ctaTitle: 'Ունեք հարցեր հաշվիչների մասին?',
      ctaDesc: 'Մեր փորձագետները պատրաստ են օգնել ձեզ ընտրել ճիշտ հաշվիչը և բացատրել հաշվարկների մանրամասները',
      contactUs: 'Կապ մեզ հետ',
      ourServices: 'Մեր ծառայությունները',
      categories: {
        all: 'Բոլորը',
        salary: 'Աշխատավարձ',
        tax: 'Հարկեր',
        project: 'Նախագծեր',
        benefits: 'Նպաստներ'
      },
      metaTitle: 'Հաշվիչներ — Ֆինանսական հաշվիչներ | Amroyan Consulting',
      metaDescription: 'Ֆինանսական հաշվիչներ՝ Աշխատավարձ, Շրջհարկ, Շահութահարկ, Նպաստ, Նախագծերի (Սմետա) հաշվարկ'
    }
  },
  ru: {
    header: {
      nav: {
        home: 'Главная',
        about: 'О нас',
        services: 'Услуги',
        calculators: 'Калькуляторы',
        archive: 'Архив',
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
        mainTitle: 'Профессиональные бухгалтерские и финансовые услуги',
        tagline: 'Для успеха вашего бизнеса',
        subtitle: 'Профессионализм и ответственность',
        description: 'для успеха вашего бизнеса',
        servicesBtn: 'Услуги',
        contactBtn: 'Обратиться',
        stats: {
          experience: '4+ лет опыта',
          clients: '200+ партнеров',
          satisfaction: '98% довольных клиентов',
          projects: '500+ выполненных проектов'
        },
        statsLabels: ['партнеров', 'лет опыта', 'годовой рост', 'выполненных проектов']
      },
      services: {
        title: 'Услуги',
        subtitle: 'Предлагаем комплексные решения для финансовых потребностей вашего бизнеса',
        list: [
          'Ведение бухгалтерского учета',
          'Налоговое, финансовое и кадровое консультирование',
          'Финансовый анализ',
          'Финансовая отчетность',
          'Бизнес-консультирование',
          'Групповые и индивидуальные курсы бухгалтерии'
        ],
        apply: 'Подать заявку'
      },
      features: {
        title: 'Почему мы?',
        bullets: [
          'Команда опытных специалистов',
          'Защита интересов клиента при налоговых и инспекционных проверках',
          'Надежно и конфиденциально',
          'Современные технологии и инструменты'
        ],
        items: [
          'Команда опытных специалистов с 2020 года',
          'Защита при налоговых и инспекционных проверках',
          'Безопасно и конфиденциально',
          'Современные технологии'
        ]
      },
      aboutBtn: 'О нас',
      weProvideTitle: 'Мы обеспечиваем',
      weProvideDesc: 'Предоставление профессиональных услуг, способствующих росту вашего бизнеса.',
      loading: 'Загрузка...',
      noDocumentsYet: 'Документы пока не добавлены',
      applyDialog: {
        title: 'Заявка на курсы',
        description: 'Заполните ваши данные, и мы свяжемся с вами',
        fullName: 'Имя Фамилия',
        phone: 'Телефон',
        email: 'Эл. почта',
        message: 'Сообщение',
        placeholderName: 'Ваше имя и фамилия',
        placeholderPhone: '+374 XX XXX XXX',
        placeholderEmail: 'your@email.com',
        placeholderMessage: 'Дополнительная информация или вопросы...',
        close: 'Закрыть',
        submit: 'Отправить заявку',
        submitting: 'Отправка...',
        thankYou: 'Спасибо!',
        successMessage: 'Ваша заявка успешно отправлена. Наша команда свяжется с вами в ближайшее время.',
        submitAgain: 'Отправить новую заявку'
      },
      toast: {
        error: 'Ошибка',
        success: 'Успешно',
        fillRequired: 'Пожалуйста, заполните все обязательные поля',
        applicationSent: 'Ваша заявка успешно отправлена! Мы свяжемся с вами.',
        sendFailed: 'Не удалось отправить заявку. Пожалуйста, попробуйте снова.'
      }
    },
    services: {
      title: 'Наши услуги',
      subtitle: 'Комплексные финансовые решения для роста и развития вашего бизнеса',
      list: [
        {
          title: 'Бухгалтерский учет',
          description: 'Полное бухгалтерское обслуживание с программой 1С и представлением отчетности',
          features: ['Ведение бухгалтерии в программе 1С', 'Представление налоговой отчетности', 'Представление статистической отчетности', 'Ведение кадрового учета']
        },
        {
          title: 'Налоговое, финансовое и кадровое консультирование',
          description: 'Профессиональная поддержка по налоговым, финансовым и кадровым вопросам',
          features: ['Планирование', 'Оптимизация налогов', 'Оценка налоговых рисков', 'Решение налоговых, финансовых и кадровых споров']
        },
        {
          title: 'Бизнес-консультирование',
          description: 'Разработка и оценка стратегических направлений бизнеса',
          features: ['Разработка бизнес-стратегии', 'Составление бизнес-планов', 'Исследование и оценка рынка']
        },
        {
          title: 'Финансовый анализ',
          description: 'Глубокий анализ ваших финансов и инструменты управления',
          features: ['Составление и представление финансовой отчетности учредителям', 'Расчет доходов и расходов', 'Отчет о движении денежных средств, управление потоками', 'Контроль эффективности', 'Бюджетирование и прогнозирование', 'Оценка рентабельности', 'Меры по повышению рентабельности', 'Оптимизация расходов организации']
        },
        {
          title: 'Защита интересов заказчика при налоговых и проверках',
          description: 'Представление и защита ваших интересов в процессе проверки',
          features: ['Аудит-обзор перед проверкой', 'Оценка и снижение рисков', 'Сопровождение проверки']
        },
        {
          title: 'Групповые и индивидуальные курсы бухгалтерии',
          description: 'Практические курсы для начинающих и специалистов',
          features: ['Курсы бухгалтерского учета', 'Курсы финансового и управленческого учета', 'Курсы кадрового учета', 'Семинары по налоговой и кадровой тематике']
        }
      ],
      whyUsTitle: 'Почему мы',
      whyUsBullets: ['Команда опытных специалистов', 'Защита интересов заказчика при налоговых и проверках', 'Надежность и доверие', 'Современные технологии и инструменты'],
      aboutBtn: 'О нас',
      weProvideTitle: 'Мы обеспечиваем',
      weProvideDesc: 'Предоставление профессиональных услуг, способствующих росту вашего бизнеса.',
      ctaTitle: 'Заявка на курсы',
      ctaDesc: 'Интересуетесь нашими курсами по бухгалтерии? Заполните заявку, и мы свяжемся с вами в ближайшее время.'
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
        submitting: 'Отправка...',
        required: '*',
        defaultSubject: 'Обратная связь',
        placeholders: {
          name: 'Ваше имя',
          email: 'your@email.com',
          company: 'Ваша компания',
          phone: '+374 XX XXX XXX',
          message: 'Опишите ваши потребности...'
        },
        selectService: 'Выберите услугу'
      },
      toast: {
        success: 'Успешно',
        messageSent: 'Ваше сообщение успешно отправлено. Наши специалисты свяжутся с вами.',
        error: 'Ошибка',
        sendFailed: 'Не удалось отправить сообщение. Пожалуйста, попробуйте снова.'
      },
      info: {
        phone: 'Телефон',
        phoneDesc: 'WhatsApp, Telegram',
        email: 'Эл. почта',
        emailDesc: 'Ответим в течение 24 часов',
        address: 'Адрес',
        addressDesc: 'Центральный офис',
        addressValue: 'г. Ереван, ул. Пирумянов 10, 3 этаж',
        postal: 'Почтовый адрес',
        postalDesc: 'Для отправки документов',
        postalValue: '0008, г. Ереван, ул. Мурацани 69'
      },
      mapTitle: 'Наше местоположение',
      mapSubtitle: 'Посетите наш офис или назначьте встречу',
      mapCity: 'Ереван, Армения',
      mapAddressNote: 'Точный адрес будет предоставлен при встрече',
      ctaTitle: 'Готовы начать?',
      ctaSubtitle: 'Не откладывайте: свяжитесь с нами сегодня и получите профессиональную консультацию',
      call: 'Позвонить',
      writeEmail: 'Написать'
    },
    footer: {
      newsletterTitle: 'Подпишитесь на наши новости',
      newsletterSubtitle: 'Будьте в курсе первыми',
      quickLinks: 'Быстрые ссылки',
      services: 'Услуги',
      contact: 'Контакты',
      admin: 'Админ',
      copyright: 'Все права защищены',
      companyDesc: 'Профессиональные бухгалтерские и финансовые услуги для роста и успеха вашего бизнеса. Основано в 2020 году.',
      address: 'г. Ереван, ул. Пирумянов 10, 3 этаж',
      serviceTax: 'Налоговое консультирование',
      serviceAccounting: 'Ведение бухгалтерии',
      serviceFinancial: 'Финансовый анализ',
      serviceBusiness: 'Бизнес-планирование'
    },
    adminPanel: {
      title: 'Панель администратора',
      signOut: 'Выйти',
      signOutToast: 'Выход',
      signOutSuccess: 'Вы успешно вышли из системы.',
      statsArchive: 'Архив',
      statsPdfFiles: 'PDF файлы',
      statsUsers: 'Пользователи',
      statsRegisteredUsers: 'Зарегистрированные пользователи',
      statsBlogPosts: 'Записи блога',
      statsTotalPosts: 'Всего записей',
      statsMessages: 'Сообщения',
      statsMessagesReceived: 'Полученные сообщения',
      statsNewsletters: 'Новости',
      statsSubscribers: 'Подписчики',
      tabOverview: 'Обзор',
      tabMessages: 'Сообщения',
      tabBlog: 'Блог',
      tabDocuments: 'Архив',
      tabApplications: 'Заявки',
      tabUsers: 'Пользователи',
      tabSettings: 'Настройки',
      blogManagement: 'Управление блогом',
      blogManagementDesc: 'Создавайте и управляйте записями блога',
      createNewPost: 'Создать новую запись',
      managePosts: 'Управление записями',
      archiveManagement: 'Управление архивом',
      archiveManagementDesc: 'Загружайте и управляйте PDF документами',
      uploadFile: 'Загрузить файл',
      messagesDesc: 'Просматривайте и отвечайте на сообщения',
      unreadMessages: 'Непрочитанные сообщения',
      statistics: 'Статистика',
      statisticsDesc: 'Статистика активности сайта',
      activeDocuments: 'Активные документы:',
      publishedPosts: 'Опубликованные записи:',
      courseApplications: 'Заявки на курсы',
      courseApplicationsDesc: 'Управление заявками на курсы',
      manageApplications: 'Управление заявками',
      totalApplications: 'Всего',
      applicationCount: 'заявок',
      lastPosts: 'Последние записи',
      lastPostsDesc: 'Недавно созданные записи блога',
      noPosts: 'Нет записей',
      published: 'Опубликовано',
      draft: 'Черновик',
      hide: 'Скрыть',
      publish: 'Опубликовать',
      deletePost: 'Удалить запись',
      viewAllPosts: 'Смотреть все записи',
      lastDocuments: 'Последние документы',
      lastDocumentsDesc: 'Список недавно загруженных документов',
      noDocuments: 'Нет документов',
      deleteDocument: 'Удалить документ',
      toastError: 'Ошибка',
      postPublished: 'Запись опубликована',
      postHidden: 'Запись скрыта',
      postUpdateFailed: 'Не удалось обновить запись',
      confirmDeletePost: 'Удалить запись полностью?',
      postDeleted: 'Запись удалена',
      postDeleteFailed: 'Не удалось удалить запись',
      docPublished: 'Документ опубликован',
      docHidden: 'Документ скрыт',
      changesSaved: 'Изменения сохранены в базе данных',
      docUpdateFailed: 'Не удалось обновить документ',
      confirmDeleteDoc: 'Удалить документ полностью? Это действие необратимо.',
      docDeleted: 'Документ удален',
      docDeleteFailed: 'Не удалось удалить документ',
      applicationApproved: 'Заявка одобрена',
      applicationRejected: 'Заявка отклонена',
      applicationUpdateFailed: 'Не удалось обновить заявку',
      confirmDeleteApplication: 'Удалить заявку полностью?',
      applicationDeleted: 'Заявка удалена',
      applicationDeleteFailed: 'Не удалось удалить заявку'
    },
    about: {
      heroTitle: 'О нас',
      heroSubtitle: 'Amroyan Consulting — ведущая компания в сфере бухгалтерских и финансовых услуг с опытом более 5 лет.',
      missionLabel: 'Миссия',
      missionTitle: 'Наша миссия',
      missionP1: 'Наша цель — помогать бизнесу достигать финансовой стабильности и роста, предоставляя профессиональные бухгалтерские и финансовые услуги.',
      missionP2: 'Мы верим, что каждый бизнес заслуживает качественной финансовой поддержки независимо от сферы деятельности и масштаба.',
      valuesTitle: 'Наши ценности',
      valuesSubtitle: 'В работе мы руководствуемся следующими основными принципами',
      values: [
        { title: 'Надежность', description: 'Наши заказчики уверены в своем финансовом и бухгалтерском управлении' },
        { title: 'Качество', description: 'Только высококлассные и профессиональные услуги' },
        { title: 'Целеустремленность', description: 'Мы сфокусированы на успехе вашего бизнеса и работаем для достижения лучших результатов.' },
        { title: 'Эффективность', description: 'Время — ценность, и мы ценим ваше время, экономя его.' }
      ],
      timelineTitle: 'Наш путь',
      timelineSubtitle: 'Основные этапы развития нашей компании',
      timeline: [
        '2020 — основание компании',
        '2021 — первые 20+ реализованных проектов',
        '2022 — внедрение образовательных программ, первые курсы',
        '2024 — более 100 реализованных проектов',
        '2025 — 5 лет на рынке, более 30 новых партнеров'
      ]
    },
    archive: {
      heroTitle: 'Архив',
      heroSubtitle: 'Полезные документы и информация',
      sectionsTitle: 'Разделы архива',
      sectionsSubtitle: 'Быстрый доступ к документам по категориям',
      documentsTitle: 'Документы',
      documentsSubtitle: 'Все доступные документы по категориям',
      warehouseTitle: 'Документы архива',
      warehouseSubtitle: 'Документы из базы по категориям',
      noDocuments: 'Документов пока нет. Добавить можно из панели администратора.',
      downloadPdf: 'Скачать PDF',
      downloadPdfLoading: 'Загрузка...',
      openDoc: 'Открыть',
      download: 'Скачать',
      views: 'просмотров',
      seeAllDocuments: 'Смотреть все документы',
      loading: 'Загрузка...',
      toast: {
        error: 'Ошибка',
        loadFailed: 'Не удалось загрузить документы',
        downloaded: 'Загружено',
        documentDownloaded: 'Документ загружен',
        downloadFailed: 'Не удалось загрузить документ',
        pdfDownloaded: 'PDF загружен',
        pdfFailed: 'Не удалось загрузить PDF'
      },
      sectionCards: {
        standardsTitle: 'МСФО / МСБУ',
        standardsDesc: 'Международные стандарты финансовой отчётности Армении',
        pekTitle: 'Уведомления ГНК',
        pekDesc: 'Уведомления Комитета государственных доходов',
        discussionsTitle: 'Обсуждения',
        discussionsDesc: 'Профессиональные обсуждения и аналитика',
        clarificationsTitle: 'Официальные разъяснения',
        clarificationsDesc: 'Официальные разъяснения и комментарии',
        clarificationsAria: 'Подкатегории разъяснений',
        taxLaw: 'Налоговое законодательство',
        laborLaw: 'Трудовое законодательство',
        testsTitle: 'Тесты',
        testsDesc: 'Профессиональные тесты и проверки',
        testsAria: 'Подкатегории тестов',
        testsAccounting: 'Бухгалтерия и финансы',
        testsHr: 'HR, кадровая сфера'
      },
      categories: {
        standards: 'Стандарты',
        pek_notifications: 'Уведомления ГНК',
        clarifications_tax: 'Налоговые разъяснения',
        clarifications_labor: 'Трудовые разъяснения',
        discussions: 'Обсуждения',
        tests_accounting_finance: 'Тесты по бухучёту и финансам',
        tests_hr: 'Тесты по кадрам'
      }
    },
    blog: {
      heroTitle: 'Новости',
      featuredTitle: 'Главная статья',
      readMore: 'Читать далее',
      seeAll: 'Смотреть все',
      allCategory: 'Все',
      loading: 'Загрузка...',
      toast: {
        error: 'Ошибка',
        loadFailed: 'Не удалось загрузить записи блога'
      }
    },
    calculators: {
      heroTitle: 'Финансовые калькуляторы',
      heroSubtitle: 'Профессиональные инструменты для финансовых расчетов вашего бизнеса',
      stats: [
        { number: '8+', label: 'калькуляторов' },
        { number: '100%', label: 'точность' },
        { number: '24/7', label: 'доступность' },
        { number: '0', label: 'затрат' }
      ],
      featuresTitle: 'Почему наши калькуляторы',
      featuresSubtitle: 'Мы предлагаем самые эффективные инструменты для ваших финансовых расчетов',
      features: [
        { title: 'Профессиональные расчеты', description: 'Наши калькуляторы основаны на последних налоговых и финансовых нормативах' },
        { title: 'Быстро и точно', description: 'Получайте мгновенные результаты для ваших финансовых расчетов' },
        { title: 'Надежно', description: 'Все расчеты проверены специалистами' },
        { title: 'В одном месте', description: 'Все необходимые финансовые инструменты в одном месте' }
      ],
      listTitle: 'Доступные калькуляторы',
      listSubtitle: 'Выберите нужный калькулятор и начните расчеты',
      searchPlaceholder: 'Поиск калькуляторов... (напр. зарплата, налог, пособие)',
      selectCategory: 'Выберите категорию',
      sortByTitle: 'Название',
      sortByCategory: 'Категория',
      filters: 'Фильтры',
      clear: 'Сбросить',
      advancedFilters: 'Расширенные фильтры',
      tagsLabel: 'Теги',
      foundCount: 'Найдено {count} из {total} калькуляторов',
      searchLabel: 'Поиск',
      categoryLabel: 'Категория',
      showingAll: 'Показаны все {count} калькуляторов',
      showingCount: 'Показано {count} из {total} калькуляторов',
      noResultsTitle: 'Калькуляторы не найдены',
      noResultsDesc: 'Попробуйте изменить параметры поиска или сбросить фильтры',
      clearAllFilters: 'Сбросить все фильтры',
      openCalculator: 'Открыть калькулятор',
      moreTags: 'ещё',
      ctaTitle: 'Есть вопросы по калькуляторам?',
      ctaDesc: 'Наши эксперты готовы помочь выбрать подходящий калькулятор и объяснить детали расчетов',
      contactUs: 'Связаться с нами',
      ourServices: 'Наши услуги',
      categories: {
        all: 'Все',
        salary: 'Зарплата',
        tax: 'Налоги',
        project: 'Проекты',
        benefits: 'Пособия'
      },
      metaTitle: 'Калькуляторы — Финансовые калькуляторы | Amroyan Consulting',
      metaDescription: 'Финансовые калькуляторы: Зарплата, Налог на оборот, Налог на прибыль, Пособия, Смета проектов'
    }
  },
  en: {
    header: {
      nav: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        calculators: 'Calculators',
        archive: 'Archive',
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
        mainTitle: 'Professional accounting and financial services',
        tagline: 'For your business success',
        subtitle: 'Expertise and Responsibility',
        description: 'for your business success',
        servicesBtn: 'Services',
        contactBtn: 'Contact',
        stats: {
          experience: '4+ years experience',
          clients: '200+ partners',
          satisfaction: '98% satisfied clients',
          projects: '500+ completed projects'
        },
        statsLabels: ['partners', 'years experience', 'annual growth', 'completed projects']
      },
      services: {
        title: 'Services',
        subtitle: 'We offer comprehensive solutions for your business financial needs',
        list: [
          'Bookkeeping and accounting',
          'Tax, financial and HR consulting',
          'Financial analysis',
          'Financial reporting',
          'Business consulting',
          'Group and individual accounting courses'
        ],
        apply: 'Apply'
      },
      features: {
        title: 'Why choose us?',
        bullets: [
          'Team of experienced professionals',
          'Protection of client interests during tax and inspection audits',
          'Reliable and trustworthy',
          'Modern technologies and tools'
        ],
        items: [
          'Team of experienced professionals since 2020',
          'Protection during tax and inspection audits',
          'Safe and confidential',
          'Modern technologies'
        ]
      },
      aboutBtn: 'About us',
      weProvideTitle: 'We provide',
      weProvideDesc: 'Professional services that contribute to your business growth.',
      loading: 'Loading...',
      noDocumentsYet: 'No documents added yet',
      applyDialog: {
        title: 'Course application',
        description: 'Fill in your details and we will contact you',
        fullName: 'Full name',
        phone: 'Phone',
        email: 'Email',
        message: 'Message',
        placeholderName: 'Your full name',
        placeholderPhone: '+374 XX XXX XXX',
        placeholderEmail: 'your@email.com',
        placeholderMessage: 'Additional information or questions...',
        close: 'Close',
        submit: 'Submit application',
        submitting: 'Sending...',
        thankYou: 'Thank you!',
        successMessage: 'Your application was sent successfully. Our team will contact you shortly.',
        submitAgain: 'Submit another application'
      },
      toast: {
        error: 'Error',
        success: 'Success',
        fillRequired: 'Please fill in all required fields',
        applicationSent: 'Your application was sent successfully! We will contact you.',
        sendFailed: 'Failed to send application. Please try again.'
      }
    },
    services: {
      title: 'Our Services',
      subtitle: 'Comprehensive financial solutions for your business growth and development',
      list: [
        {
          title: 'Accounting',
          description: 'Full accounting services with 1C software and reporting',
          features: ['Accounting with 1C software', 'Tax reporting', 'Statistical reporting', 'Payroll and HR accounting']
        },
        {
          title: 'Tax, Financial and HR Consulting',
          description: 'Professional support on tax, financial and HR matters',
          features: ['Planning', 'Tax optimization', 'Tax risk assessment', 'Resolution of tax, financial and HR disputes']
        },
        {
          title: 'Business Consulting',
          description: 'Development and evaluation of strategic business directions',
          features: ['Business strategy development', 'Business plan preparation', 'Market research and assessment']
        },
        {
          title: 'Financial Analysis',
          description: 'In-depth analysis of your finances and management tools',
          features: ['Preparation and presentation of financial reports to founders', 'Income and expense calculation', 'Cash flow reporting and management', 'Performance monitoring', 'Budgeting and forecasting', 'Profitability assessment', 'Measures to improve profitability', 'Organization cost optimization']
        },
        {
          title: 'Client Interest Protection During Tax and Regulatory Audits',
          description: 'Representation and protection of your interests during audits',
          features: ['Pre-audit review', 'Risk assessment and mitigation', 'Audit support']
        },
        {
          title: 'Group and Individual Accounting Courses',
          description: 'Practical courses for beginners and professionals',
          features: ['Accounting courses', 'Financial and management accounting courses', 'Payroll accounting courses', 'Seminars on tax and HR topics']
        }
      ],
      whyUsTitle: 'Why us',
      whyUsBullets: ['Team of experienced professionals', 'Client interest protection during tax and regulatory audits', 'Reliable and trustworthy', 'Modern technologies and tools'],
      aboutBtn: 'About us',
      weProvideTitle: 'We provide',
      weProvideDesc: 'Professional services that support your business growth.',
      ctaTitle: 'Apply for courses',
      ctaDesc: 'Interested in our accounting courses? Fill out the application and we will contact you shortly.'
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
        submitting: 'Sending...',
        required: '*',
        defaultSubject: 'Feedback',
        placeholders: {
          name: 'Your name',
          email: 'your@email.com',
          company: 'Your company',
          phone: '+374 XX XXX XXX',
          message: 'Describe your needs...'
        },
        selectService: 'Select service'
      },
      toast: {
        success: 'Success',
        messageSent: 'Your message was sent successfully. Our specialists will contact you.',
        error: 'Error',
        sendFailed: 'Failed to send message. Please try again.'
      },
      info: {
        phone: 'Phone',
        phoneDesc: 'WhatsApp, Telegram available',
        email: 'Email',
        emailDesc: 'We will reply within 24 hours',
        address: 'Address',
        addressDesc: 'Head office',
        addressValue: 'Yerevan, Pirumyanneri 10, 3rd floor',
        postal: 'Postal address',
        postalDesc: 'For document delivery',
        postalValue: '0008, Yerevan, Muratsani 69'
      },
      mapTitle: 'Our location',
      mapSubtitle: 'Visit our office or schedule a meeting',
      mapCity: 'Yerevan, Armenia',
      mapAddressNote: 'Exact address will be provided when we meet',
      ctaTitle: 'Ready to get started?',
      ctaSubtitle: "Don't wait: contact us today and get professional advice",
      call: 'Call',
      writeEmail: 'Send email'
    },
    footer: {
      newsletterTitle: 'Subscribe to our newsletter',
      newsletterSubtitle: 'Stay informed first',
      quickLinks: 'Quick links',
      services: 'Services',
      contact: 'Contact',
      admin: 'Admin',
      copyright: 'All rights reserved',
      companyDesc: 'Professional accounting and financial services for your business growth and success. Founded in 2020.',
      address: 'Yerevan, Pirumyanneri 10, 3rd floor',
      serviceTax: 'Tax consulting',
      serviceAccounting: 'Accounting',
      serviceFinancial: 'Financial analysis',
      serviceBusiness: 'Business planning'
    },
    adminPanel: {
      title: 'Admin panel',
      signOut: 'Sign out',
      signOutToast: 'Signing out',
      signOutSuccess: 'You have successfully signed out.',
      statsArchive: 'Archive',
      statsPdfFiles: 'PDF files',
      statsUsers: 'Users',
      statsRegisteredUsers: 'Registered users',
      statsBlogPosts: 'Blog posts',
      statsTotalPosts: 'Total posts',
      statsMessages: 'Messages',
      statsMessagesReceived: 'Messages received',
      statsNewsletters: 'News',
      statsSubscribers: 'Subscribers',
      tabOverview: 'Overview',
      tabMessages: 'Messages',
      tabBlog: 'Blog',
      tabDocuments: 'Archive',
      tabApplications: 'Applications',
      tabUsers: 'Users',
      tabSettings: 'Settings',
      blogManagement: 'Blog management',
      blogManagementDesc: 'Create and manage blog posts',
      createNewPost: 'Create new post',
      managePosts: 'Manage posts',
      archiveManagement: 'Archive management',
      archiveManagementDesc: 'Upload and manage PDF documents',
      uploadFile: 'Upload file',
      messagesDesc: 'View and respond to messages',
      unreadMessages: 'Unread messages',
      statistics: 'Statistics',
      statisticsDesc: 'Site activity statistics',
      activeDocuments: 'Active documents:',
      publishedPosts: 'Published posts:',
      courseApplications: 'Course applications',
      courseApplicationsDesc: 'Manage course applications',
      manageApplications: 'Manage applications',
      totalApplications: 'Total',
      applicationCount: 'applications',
      lastPosts: 'Recent posts',
      lastPostsDesc: 'Recently created blog posts',
      noPosts: 'No posts',
      published: 'Published',
      draft: 'Draft',
      hide: 'Hide',
      publish: 'Publish',
      deletePost: 'Delete post',
      viewAllPosts: 'View all posts',
      lastDocuments: 'Recent documents',
      lastDocumentsDesc: 'List of recently uploaded documents',
      noDocuments: 'No documents',
      deleteDocument: 'Delete document',
      toastError: 'Error',
      postPublished: 'Post published',
      postHidden: 'Post hidden',
      postUpdateFailed: 'Failed to update post',
      confirmDeletePost: 'Delete this post permanently?',
      postDeleted: 'Post deleted',
      postDeleteFailed: 'Failed to delete post',
      docPublished: 'Document published',
      docHidden: 'Document hidden',
      changesSaved: 'Changes saved to database',
      docUpdateFailed: 'Failed to update document',
      confirmDeleteDoc: 'Delete this document permanently? This action cannot be undone.',
      docDeleted: 'Document deleted',
      docDeleteFailed: 'Failed to delete document',
      applicationApproved: 'Application approved',
      applicationRejected: 'Application rejected',
      applicationUpdateFailed: 'Failed to update application',
      confirmDeleteApplication: 'Delete this application permanently?',
      applicationDeleted: 'Application deleted',
      applicationDeleteFailed: 'Failed to delete application'
    },
    about: {
      heroTitle: 'About us',
      heroSubtitle: 'Amroyan Consulting is a leading company in accounting and financial services with over 5 years of experience.',
      missionLabel: 'Mission',
      missionTitle: 'Our mission',
      missionP1: 'Our goal is to help businesses achieve financial stability and growth by providing professional accounting and financial services.',
      missionP2: 'We believe every business deserves quality financial support regardless of industry or size.',
      valuesTitle: 'Our values',
      valuesSubtitle: 'We are guided by the following core principles in our work',
      values: [
        { title: 'Reliability', description: 'Our clients are confident in their financial and accounting management' },
        { title: 'Quality', description: 'Only high-grade and professional services' },
        { title: 'Purpose', description: 'We are focused on your business success and work to achieve the best results.' },
        { title: 'Efficiency', description: 'Time is value, and we value your time by saving it.' }
      ],
      timelineTitle: 'Our journey',
      timelineSubtitle: 'Key milestones in our company development',
      timeline: [
        '2020 — company foundation',
        '2021 — first 20+ completed projects',
        '2022 — educational programs launch, first courses',
        '2024 — 100+ projects delivered',
        '2025 — 5 years in the market, over 30 new partners'
      ]
    },
    archive: {
      heroTitle: 'Archive',
      heroSubtitle: 'Useful documents and information',
      sectionsTitle: 'Archive sections',
      sectionsSubtitle: 'Quick access to documents by category',
      documentsTitle: 'Documents',
      documentsSubtitle: 'All available documents by category',
      warehouseTitle: 'Archive documents',
      warehouseSubtitle: 'Documents from database by category',
      noDocuments: 'No documents yet. You can add them from the admin panel.',
      downloadPdf: 'Download PDF',
      downloadPdfLoading: 'Loading...',
      openDoc: 'Open',
      download: 'Download',
      views: 'views',
      seeAllDocuments: 'See all documents',
      loading: 'Loading...',
      toast: {
        error: 'Error',
        loadFailed: 'Failed to load documents',
        downloaded: 'Downloaded',
        documentDownloaded: 'Document downloaded',
        downloadFailed: 'Failed to download document',
        pdfDownloaded: 'PDF downloaded',
        pdfFailed: 'Failed to download PDF'
      },
      sectionCards: {
        standardsTitle: 'IFRS / IAS',
        standardsDesc: 'Armenia international accounting standards',
        pekTitle: 'Tax committee notifications',
        pekDesc: 'State Revenue Committee notifications',
        discussionsTitle: 'Discussions',
        discussionsDesc: 'Professional discussions and analysis',
        clarificationsTitle: 'Official clarifications',
        clarificationsDesc: 'Official clarifications and commentaries',
        clarificationsAria: 'Clarification subcategories',
        taxLaw: 'Tax legislation',
        laborLaw: 'Labor legislation',
        testsTitle: 'Tests',
        testsDesc: 'Professional tests and checks',
        testsAria: 'Test subcategories',
        testsAccounting: 'Accounting and finance',
        testsHr: 'HR, personnel'
      },
      categories: {
        standards: 'Standards',
        pek_notifications: 'Tax committee notifications',
        clarifications_tax: 'Tax clarifications',
        clarifications_labor: 'Labor clarifications',
        discussions: 'Discussions',
        tests_accounting_finance: 'Accounting and finance tests',
        tests_hr: 'HR tests'
      }
    },
    blog: {
      heroTitle: 'News',
      featuredTitle: 'Featured article',
      readMore: 'Read more',
      seeAll: 'See all',
      allCategory: 'All',
      loading: 'Loading...',
      toast: {
        error: 'Error',
        loadFailed: 'Failed to load blog posts'
      }
    },
    calculators: {
      heroTitle: 'Financial calculators',
      heroSubtitle: 'Professional tools for your business financial calculations',
      stats: [
        { number: '8+', label: 'calculators' },
        { number: '100%', label: 'accuracy' },
        { number: '24/7', label: 'availability' },
        { number: '0', label: 'cost' }
      ],
      featuresTitle: 'Why our calculators',
      featuresSubtitle: 'We offer the most effective tools for your financial calculations',
      features: [
        { title: 'Professional calculations', description: 'Our calculators are based on the latest tax and financial regulations' },
        { title: 'Fast and accurate', description: 'Get instant results for your financial calculations' },
        { title: 'Reliable', description: 'All calculations are verified by specialists' },
        { title: 'All in one place', description: 'All the financial tools you need in one place' }
      ],
      listTitle: 'Available calculators',
      listSubtitle: 'Choose the calculator you need and start calculating',
      searchPlaceholder: 'Search calculators... (e.g. salary, tax, benefit)',
      selectCategory: 'Select category',
      sortByTitle: 'Title',
      sortByCategory: 'Category',
      filters: 'Filters',
      clear: 'Clear',
      advancedFilters: 'Advanced filters',
      tagsLabel: 'Tags',
      foundCount: 'Found {count} of {total} calculators',
      searchLabel: 'Search',
      categoryLabel: 'Category',
      showingAll: 'Showing all {count} calculators',
      showingCount: 'Showing {count} of {total} calculators',
      noResultsTitle: 'No calculators found',
      noResultsDesc: 'Try changing your search parameters or clearing the filters',
      clearAllFilters: 'Clear all filters',
      openCalculator: 'Open calculator',
      moreTags: 'more',
      ctaTitle: 'Questions about the calculators?',
      ctaDesc: 'Our experts are ready to help you choose the right calculator and explain the calculation details',
      contactUs: 'Contact us',
      ourServices: 'Our services',
      categories: {
        all: 'All',
        salary: 'Salary',
        tax: 'Tax',
        project: 'Projects',
        benefits: 'Benefits'
      },
      metaTitle: 'Calculators — Financial calculators | Amroyan Consulting',
      metaDescription: 'Financial calculators: Salary, Turnover tax, Profit tax, Benefits, Project estimates'
    }
  }
};
