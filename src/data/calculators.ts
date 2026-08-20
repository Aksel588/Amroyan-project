export interface Calculator {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon_name: string;
  visible: boolean;
  category: string;
  tags: string[];
  sort_order: number;
}

export const staticCalculators: Calculator[] = [
  {
    id: 1,
    title: 'Աշխատավարձի հաշվիչ',
    slug: 'salary',
    description: 'Աշխատավարձի հաշվիչը հնարավորություն է տալիս պարզ և մատչելի կերպով հաշվարկել աշխատավարձի չափը, հարկերը և այլ վճարների չափերը։',
    icon_name: 'Calculator',
    visible: true,
    category: 'salary',
    tags: ['աշխատավարձ', 'հարկ', 'կուտակային', 'դրոշմանիշ'],
    sort_order: 1
  },
  {
    id: 2,
    title: 'Նախագծերի հաշվիչ',
    slug: 'estimate',
    description: 'Հաշվիչը հնարավորություն է տալիս հաշվարկել տարբեր ծառայությունների, աշխատանքների և պրոյեկտների բյուջեն՝ ինչպես պատվիրատուների, այնպես էլ կատարողների համար։',
    icon_name: 'Calculator',
    visible: true,
    category: 'project',
    tags: ['նախագիծ', 'արժեք', 'գնահատում', 'սմետա'],
    sort_order: 2
  },
  {
    id: 3,
    title: 'Շրջհարկի հաշվիչ',
    slug: 'turnover-tax',
    description: 'Շրջանառության հարկի հաշվիչը հնարավորություն է տալիս հաշվարկել կազմակերպության կամ ԱՁ-ի եռամսյակային շրջանառության հարկը: Տող 1-5 համար լրացվում է շրջանառության ծավալը, գործունեության հետ անմիջականորեն կապ ունեցող ծախս (ինքնարժեք) ...',
    icon_name: 'Calculator',
    visible: true,
    category: 'tax',
    tags: ['շրջանառություն', 'հարկ', 'եռամսյակ', 'գործունեություն'],
    sort_order: 3
  },
  {
    id: 4,
    title: 'Շահութահարկի հաշվիչ',
    slug: 'armenian-tax',
    description: 'Հաշվեք շահութահարկը՝ եկամուտներ, ծախսեր, կորուստներ, նվազեցումներ և հարկվող շահույթ՝ 79 տողի ամբողջական հարկային աղյուսակով',
    icon_name: 'Calculator',
    visible: true,
    category: 'tax',
    tags: ['հայաստան', 'հարկային', 'շահութահարկ', 'եկամուտ', 'ծախս'],
    sort_order: 4
  },
  {
    id: 5,
    title: 'Նպաստի հաշվիչ',
    slug: 'benefit',
    description: 'Հաշվեք տարբեր տեսակի նպաստները՝ երեխայի խնամք, հիվանդություն, ծննդաբերություն և այլն',
    icon_name: 'Calculator',
    visible: true,
    category: 'benefits',
    tags: ['նպաստ', 'երեխա', 'հիվանդություն', 'ծննդաբերություն'],
    sort_order: 5
  }
];

// Helper function to get calculator by slug
export const getCalculatorBySlug = (slug: string): Calculator | undefined => {
  return staticCalculators.find(calc => calc.slug === slug && calc.visible);
};

// Helper function to get all visible calculators
export const getVisibleCalculators = (): Calculator[] => {
  return staticCalculators.filter(calc => calc.visible).sort((a, b) => a.sort_order - b.sort_order);
};

// Helper function to get calculators by category
export const getCalculatorsByCategory = (category: string): Calculator[] => {
  return staticCalculators.filter(calc => calc.visible && calc.category === category);
};

// Helper function to search calculators
export const searchCalculators = (query: string): Calculator[] => {
  const lowercaseQuery = query.toLowerCase();
  return staticCalculators.filter(calc => 
    calc.visible && (
      calc.title.toLowerCase().includes(lowercaseQuery) ||
      calc.description.toLowerCase().includes(lowercaseQuery) ||
      calc.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  );
};
