export const BLOG_CATEGORY_FILTERS = [
  { id: 'all', key: 'blog.categories.all' },
  { id: 'tax', key: 'blog.categories.tax' },
  { id: 'finance', key: 'blog.categories.finance' },
  { id: 'technology', key: 'blog.categories.technology' },
  { id: 'business', key: 'blog.categories.business' },
  { id: 'economy', key: 'blog.categories.economy' },
  { id: 'hr', key: 'blog.categories.hr' },
  { id: 'author', key: 'blog.categories.author' },
] as const;

const CATEGORY_MAP: Record<string, string> = {
  // all
  'all': 'all',
  'բոլորը': 'all',
  'все': 'all',

  // tax
  'հարկային': 'tax',
  'հարկային իրավունք': 'tax',
  'հարկային օպտիմալացում': 'tax',
  'tax': 'tax',
  'taxes': 'tax',
  'tax law': 'tax',
  'tax optimization': 'tax',
  'налоги': 'tax',
  'налогообложение': 'tax',
  'налоговый': 'tax',
  'налоговое право': 'tax',
  'налоговая оптимизация': 'tax',

  // finance
  'ֆինանսներ': 'finance',
  'ֆինանսական պլանավորում': 'finance',
  'ֆինանսական վերլուծություն': 'finance',
  'finance': 'finance',
  'finances': 'finance',
  'financial': 'finance',
  'financial planning': 'finance',
  'financial analysis': 'finance',
  'финансы': 'finance',
  'финансовое планирование': 'finance',
  'финансовый анализ': 'finance',

  // technology
  'տեխնոլոգիաներ': 'technology',
  'տեխնոլոգիա': 'technology',
  'tech': 'technology',
  'technology': 'technology',
  'technologies': 'technology',
  'технологии': 'technology',
  'технология': 'technology',

  // business
  'բիզնես': 'business',
  'բիզնես ռազմավարություն': 'business',
  'business': 'business',
  'business strategy': 'business',
  'бизнес': 'business',
  'бизнес-стратегия': 'business',

  // economy
  'տնտեսություն': 'economy',
  'economy': 'economy',
  'economics': 'economy',
  'экономика': 'economy',

  // hr
  'hr': 'hr',
  'կադրեր': 'hr',
  'human resources': 'hr',
  'кадры': 'hr',

  // author
  'հեղինակային': 'author',
  'հեղինակ': 'author',
  'author': 'author',
  "author's": 'author',
  'opinion': 'author',
  'авторские': 'author',
  'авторская колонка': 'author',
  'авторское': 'author',

  // risk management (group with finance)
  'ռիսկերի կառավարում': 'finance',
  'risk management': 'finance',
  'управление рисками': 'finance',
};

export function normalizeBlogCategory(category?: string | null): string {
  if (!category) return 'all';
  const clean = category.trim().toLowerCase();
  return CATEGORY_MAP[clean] || clean;
}

export function getBlogCategoryLabel(category: string, t: (key: string) => string): string {
  if (!category) return '';
  const norm = normalizeBlogCategory(category);
  const key = `blog.categories.${norm}`;
  const translated = t(key);
  return translated !== key ? translated : category;
}
