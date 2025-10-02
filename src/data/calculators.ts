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
    description: 'Հաշվեք ձեր աշխատավարձը՝ հարկերով և նպաստներով',
    icon_name: 'Calculator',
    visible: true,
    category: 'salary',
    tags: ['աշխատավարձ', 'հարկեր', 'նպաստներ'],
    sort_order: 1
  },
  {
    id: 2,
    title: 'Ամբողջական աշխատավարձի հաշվիչ',
    slug: 'comprehensive-salary',
    description: 'Ամբողջական աշխատավարձի հաշվարկ՝ բոլոր հարկերով և նպաստներով',
    icon_name: 'Calculator',
    visible: true,
    category: 'salary',
    tags: ['աշխատավարձ', 'հարկեր', 'նպաստներ', 'ամբողջական'],
    sort_order: 2
  },
  {
    id: 3,
    title: 'Նախագծային հաշվիչ',
    slug: 'estimate',
    description: 'Հաշվեք նախագծի արժեքը՝ աշխատավարձի ֆոնդ, հարկեր, ծախսեր և շահույթ',
    icon_name: 'FileText',
    visible: true,
    category: 'project',
    tags: ['նախագիծ', 'արժեք', 'աշխատավարձ', 'շահույթ'],
    sort_order: 3
  },
  {
    id: 4,
    title: 'Շրջանառության հարկի հաշվիչ',
    slug: 'turnover-tax',
    description: 'Հաշվեք շրջանառության հարկը ձեր բիզնեսի համար',
    icon_name: 'Calculator',
    visible: true,
    category: 'tax',
    tags: ['շրջանառության հարկ', 'հարկ', 'բիզնես'],
    sort_order: 4
  },
  {
    id: 5,
    title: 'Հայաստանի հարկային հաշվիչ',
    slug: 'armenian-tax',
    description: 'Հայաստանի հարկային համակարգի հաշվիչ',
    icon_name: 'Calculator',
    visible: true,
    category: 'tax',
    tags: ['հայաստան', 'հարկ', 'հարկային համակարգ'],
    sort_order: 5
  },
  {
    id: 6,
    title: 'Հայաստանի աշխատավարձի հաշվիչ',
    slug: 'armenian-payroll',
    description: 'Հայաստանի աշխատավարձի հաշվարկ՝ բոլոր հարկերով',
    icon_name: 'Calculator',
    visible: true,
    category: 'salary',
    tags: ['հայաստան', 'աշխատավարձ', 'հարկեր'],
    sort_order: 6
  },
  {
    id: 7,
    title: 'Շահութահարկի հաշվիչ',
    slug: 'profit-tax',
    description: 'Հաշվեք շահութահարկը ձեր շահույթի համար',
    icon_name: 'Calculator',
    visible: true,
    category: 'tax',
    tags: ['շահութահարկ', 'շահույթ', 'հարկ'],
    sort_order: 7
  },
  {
    id: 8,
    title: 'Նպաստի հաշվիչ',
    slug: 'benefit',
    description: 'Հաշվեք տարբեր տեսակի նպաստները',
    icon_name: 'Calculator',
    visible: true,
    category: 'benefits',
    tags: ['նպաստ', 'հաշվարկ', 'օգնություն'],
    sort_order: 8
  },
  {
    id: 9,
    title: 'Շրջհարկի (ԱԱՀ) հաշվիչ',
    slug: 'vat',
    description: 'Հաշվեք ԱԱՀ-ի գումարը և ընդհանուր գումարը՝ մաքուրից (կամ հակառակը)',
    icon_name: 'Calculator',
    visible: true,
    category: 'tax',
    tags: ['ԱԱՀ', 'շրջհարկ', 'հարկ', 'գումար'],
    sort_order: 9
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
