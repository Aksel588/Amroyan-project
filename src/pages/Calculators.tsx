import { ArrowRight, Calculator, TrendingUp, Shield, Users, Award, CheckCircle, BarChart3, FileText, GraduationCap, Zap, Target, Clock, Search, Filter, X, SortAsc, SortDesc } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { laravelApi } from '@/integrations/laravel/client';
import DynamicIcon from '@/components/ui/DynamicIcon';
import NetworkAnimation from '@/components/NetworkAnimation';

const Calculators = () => {
  useEffect(() => {
    document.title = 'Հաշվիչներ — Ֆինանսական հաշվիչներ | Amroyan Consulting';
    const desc = 'Ֆինանսական հաշվիչներ՝ Աշխատավարձ, Շրջհարկ, Շահութահարկ, Նպաստ, Նախագծերի (Սմետա) հաշվարկ';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(meta);
    }
    canonical.setAttribute('href', window.location.origin + '/calculators');
  }, []);

  const [items, setItems] = useState<Array<{ title: string; to: string; icon_name: string; desc: string; category?: string; tags?: string[] }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Fetch visible calculators from Laravel API
    const fetchCalculators = async () => {
      try {
        const response = await laravelApi.getCalculators();
        const data = response.data || [];
        console.log('API Response:', response);
        console.log('Calculators data:', data);
        
        const apiItems = data.map((d: any) => ({
          title: d.title,
          to: `/calculators/${d.slug}`,
          icon_name: d.icon_name || 'Calculator',
          desc: d.description || '',
          category: d.category || 'general',
          tags: d.tags || []
        }));
        
        console.log('Processed items:', apiItems);
        setItems(apiItems);
      } catch (error) {
        console.error('Error fetching calculators:', error);
        // Fallback to default calculators if API fails
        setItems([
          {
            title: 'Աշխատավարձի հաշվիչ',
            to: '/calculators/salary',
            icon_name: 'Calculator',
            desc: 'Հաշվեք գրանցված ↔ մաքուր աշխատավարձը՝ հաշվի առնելով եկամտային հարկը, կուտակային վճարներն ու դրոշմանիշային վճարը',
            category: 'salary',
            tags: ['աշխատավարձ', 'հարկ', 'կուտակային', 'դրոշմանիշ']
          },
          {
            title: 'Աշխատավարձի հաշվիչ (լրիվ)',
            to: '/calculators/comprehensive-salary',
            icon_name: 'Calculator',
            desc: 'Հաշվեք աշխատավարձի ֆոնդը, հարկերը, ծախսերը և վերջնական գինը՝ ժամավճարային, օրավճարային և ամսավճարային դիրքերով',
            category: 'salary',
            tags: ['աշխատավարձ', 'ֆոնդ', 'հարկ', 'ծախս', 'շահույթ']
          },
          {
            title: 'Նախագծային հաշվիչ',
            to: '/calculators/estimate',
            icon_name: 'Calculator',
            desc: 'Հաշվեք նախագծերի արժեքը և գնահատումները',
            category: 'project',
            tags: ['նախագիծ', 'արժեք', 'գնահատում', 'սմետա']
          },
          {
            title: 'Շրջանառության հարկի հաշվիչ',
            to: '/calculators/turnover-tax',
            icon_name: 'Calculator',
            desc: 'Հաշվեք եռամսյակային շրջանառության հարկը՝ տարբեր գործունեության տեսակների համար՝ հանելով ծախսերը և ստուգելով նվազագույն հարկը',
            category: 'tax',
            tags: ['շրջանառություն', 'հարկ', 'եռամսյակ', 'գործունեություն']
          },
          {
            title: 'Հայաստանի հարկային հաշվիչ',
            to: '/calculators/armenian-tax',
            icon_name: 'Calculator',
            desc: 'Հաշվեք շահութահարկը՝ եկամուտներ, ծախսեր, կորուստներ, նվազեցումներ և հարկվող շահույթ՝ 79 տողի ամբողջական հարկային աղյուսակով',
            category: 'tax',
            tags: ['շահութահարկ', 'հարկային', 'եկամուտ', 'ծախս', 'կորուստ']
          },
          {
            title: 'Հայաստանի աշխատավարձի հաշվիչ',
            to: '/calculators/armenian-payroll',
            icon_name: 'Calculator',
            desc: 'Հաշվեք կեղտոտ/մաքուր աշխատավարձը՝ եկամտահարկ, սոցիալական վճարներ և դրոշմանիշային վճար',
            category: 'salary',
            tags: ['աշխատավարձ', 'կեղտոտ', 'մաքուր', 'հարկ', 'սոցիալական']
          },
          {
            title: 'ԱԱՀ հաշվիչ',
            to: '/calculators/vat',
            icon_name: 'Calculator',
            desc: 'Հաշվեք ԱԱՀ-ն և գինը ԱԱՀ-ով',
            category: 'tax',
            tags: ['ԱԱՀ', 'հարկ', 'գին']
          },
          {
            title: 'Շահութահարկի հաշվիչ',
            to: '/calculators/profit-tax',
            icon_name: 'Calculator',
            desc: 'Հաշվեք շահութահարկը և մաքուր շահույթը',
            category: 'tax',
            tags: ['շահութահարկ', 'շահույթ', 'հարկ']
          },
          {
            title: 'Նպաստի հաշվիչ',
            to: '/calculators/benefit',
            icon_name: 'Calculator',
            desc: 'Հաշվեք տարբեր տեսակի նպաստները՝ երեխայի խնամք, հիվանդություն, ծննդաբերություն և այլն',
            category: 'benefits',
            tags: ['նպաստ', 'երեխա', 'հիվանդություն', 'ծննդաբերություն']
          }
        ]);
      }
    };
    fetchCalculators();
  }, []);

  const features = [
    {
      icon: Calculator,
      title: "Պրոֆեսիոնալ հաշվարկներ",
      description: "Մեր հաշվիչները հիմնված են ամենավերջին հարկային և ֆինանսական կարգավորումների վրա"
    },
    {
      icon: Zap,
      title: "Արագ և ճշգրիտ",
      description: "Ստացեք ակնթարթային արդյունքներ ձեր ֆինանսական հաշվարկների համար"
    },
    {
      icon: Shield,
      title: "Վստահելի",
      description: "Բոլոր հաշվարկները ստուգված են մասնագետների կողմից"
    },
    {
      icon: Target,
      title: "Կենտրոնացված",
      description: "Մի տեղում բոլոր անհրաժեշտ ֆինանսական գործիքները"
    }
  ];

  const stats = [
    { number: '8+', label: 'հաշվիչներ' },
    { number: '100%', label: 'ճշգրտություն' },
    { number: '24/7', label: 'մատչելիություն' },
    { number: '0', label: 'ծախս' }
  ];

  // Categories for filtering
  const categories = [
    { value: 'all', label: 'Բոլորը', count: items.length },
    { value: 'salary', label: 'Աշխատավարձ', count: items.filter(item => item.category === 'salary').length },
    { value: 'tax', label: 'Հարկեր', count: items.filter(item => item.category === 'tax').length },
    { value: 'project', label: 'Նախագծեր', count: items.filter(item => item.category === 'project').length },
    { value: 'benefits', label: 'Նպաստներ', count: items.filter(item => item.category === 'benefits').length }
  ];

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort items
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title, 'hy');
          break;
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '', 'hy');
          break;
        default:
          comparison = a.title.localeCompare(b.title, 'hy');
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [items, searchQuery, selectedCategory, sortBy, sortOrder]);

  // Get all unique tags for search suggestions
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    items.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [items]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('title');
    setSortOrder('asc');
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || sortBy !== 'title' || sortOrder !== 'asc';

  return (
    <div className="relative">
      <NetworkAnimation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center network-bg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 leading-tight font-bold lg:text-5xl">
              <span className="gradient-text py-0 px-0 mx-0 my-[8px] font-semibold leading-relaxed">Ֆինանսական հաշվիչներ</span>
            </h1>
            <p className="text-lg text-gray-300 mb-6 sm:mb-8 my-0 py-[20px] sm:text-2xl">
              Պրոֆեսիոնալ գործիքներ ձեր բիզնեսի ֆինանսական հաշվարկների համար
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto px-4 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1 sm:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm lg:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gold-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              <span className="gradient-text">Ինչու՞ մեր հաշվիչները</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Մենք առաջարկում ենք ամենաարդյունավետ գործիքները ձեր ֆինանսական հաշվարկների համար
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group bg-gradient-to-br from-gray-900 to-black border-gold-500/20 hover:border-gold-400/40 transition-all duration-300">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="text-black" size={32} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 group-hover:text-gold-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calculators Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              <span className="gradient-text">Հասանելի հաշվիչներ</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Ընտրեք ձեզ անհրաժեշտ հաշվիչը և սկսեք հաշվարկները
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 sm:mb-12">
            <Card className="bg-gradient-to-br from-gray-900 to-black border-gold-500/20">
              <CardContent className="p-6">
                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Փնտրել հաշվիչներ... (օր. աշխատավարձ, հարկ, նպաստ)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-gold-500 focus:ring-gold-500/20"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    {/* Category Filter */}
                    <div className="flex-1 min-w-0">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Ընտրել կատեգորիա" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value} className="text-white hover:bg-gray-700">
                              {category.label} ({category.count})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort Controls */}
                    <div className="flex gap-2">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="title" className="text-white hover:bg-gray-700">Անուն</SelectItem>
                          <SelectItem value="category" className="text-white hover:bg-gray-700">Կատեգորիա</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Filter Toggle and Clear */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Ֆիլտրեր
                    </Button>
                    
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Մաքրել
                      </Button>
                    )}
                  </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h4 className="text-lg font-semibold text-white mb-4">Ընդլայնված ֆիլտրեր</h4>
                    
                    {/* Tags Filter */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Հատկորոշիչներ (տեգեր)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className={`cursor-pointer transition-colors ${
                              searchQuery.toLowerCase().includes(tag.toLowerCase())
                                ? 'bg-gold-500 text-black border-gold-500'
                                : 'border-gray-600 text-gray-300 hover:border-gold-500 hover:text-gold-400'
                            }`}
                            onClick={() => setSearchQuery(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Results Count */}
                    <div className="text-sm text-gray-400">
                      Գտնվել է {filteredItems.length} հաշվիչ {items.length}-ից
                    </div>
                  </div>
                )}

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {searchQuery && (
                        <Badge variant="secondary" className="bg-gold-500/20 text-gold-400 border-gold-500/30">
                          Փնտրում: "{searchQuery}"
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearchQuery('')}
                            className="ml-2 h-4 w-4 p-0 hover:bg-gold-500/20"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      )}
                      
                      {selectedCategory !== 'all' && (
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          Կատեգորիա: {categories.find(c => c.value === selectedCategory)?.label}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCategory('all')}
                            className="ml-2 h-4 w-4 p-0 hover:bg-blue-500/20"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-center">
            <p className="text-gray-400">
              {filteredItems.length === items.length 
                ? `Ցուցադրվում են բոլոր ${items.length} հաշվիչները`
                : `Ցուցադրվում է ${filteredItems.length} հաշվիչ ${items.length}-ից`
              }
            </p>
          </div>

          {/* No Results Message */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Հաշվիչներ չեն գտնվել</h3>
              <p className="text-gray-400 mb-6">
                Փորձեք փոխել ձեր որոնման պարամետրերը կամ մաքրել ֆիլտրերը
              </p>
              <Button onClick={clearFilters} className="bg-gold-500 hover:bg-gold-600 text-black">
                Մաքրել բոլոր ֆիլտրերը
              </Button>
            </div>
          )}

          {/* Calculators Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map(({ title, to, icon_name, desc, category, tags }, index) => (
              <Card key={to} className="group bg-gradient-to-br from-gray-900 to-black border-gold-500/20 hover:border-gold-400/40 transition-all duration-300 hover:scale-105 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <DynamicIcon name={icon_name as any} className="text-black" size={28} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-white text-xl sm:text-2xl group-hover:text-gold-400 transition-colors">
                          {title}
                        </CardTitle>
                        {category && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              category === 'salary' ? 'border-green-500 text-green-400' :
                              category === 'tax' ? 'border-red-500 text-red-400' :
                              category === 'project' ? 'border-blue-500 text-blue-400' :
                              category === 'benefits' ? 'border-purple-500 text-purple-400' :
                              'border-gray-500 text-gray-400'
                            }`}
                          >
                            {categories.find(c => c.value === category)?.label}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4">
                    {desc}
                  </CardDescription>
                  
                  {/* Tags */}
                  {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="text-xs bg-gray-700 text-gray-300 hover:bg-gray-600"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                          +{tags.length - 3} այլ
                        </Badge>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0">
                  <Button asChild className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-semibold w-full h-12 text-base group-hover:shadow-lg group-hover:shadow-gold-500/25 transition-all duration-300">
                    <Link to={to} aria-label={`${title} էջ`}>
                      Բացել հաշվիչը <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={18} />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-gold-600/20 rounded-3xl blur-3xl" />
              <Card className="relative bg-gradient-to-br from-gray-900 to-black border-gold-500/20">
                <CardContent className="p-8 sm:p-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                    <Calculator className="text-black" size={40} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    Ունեք հարցեր հաշվիչների մասին?
                  </h3>
                  <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                    Մեր փորձագետները պատրաստ են օգնել ձեզ ընտրել ճիշտ հաշվիչը և բացատրել հաշվարկների մանրամասները
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-semibold px-8 py-4">
                      <Link to="/contact">
                        Կապ մեզ հետ <ArrowRight className="ml-2" size={20} />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-black px-8 py-4">
                      <Link to="/services">
                        Մեր ծառայությունները
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Calculators;