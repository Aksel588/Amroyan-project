import { ArrowRight, Calculator, TrendingUp, Shield, Users, Award, CheckCircle, Calendar, User, FileText, BarChart3, GraduationCap, Download, Eye, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';

import { Link } from 'react-router-dom';
import NetworkAnimation from '@/components/NetworkAnimation';
import NewsletterSubscription from '@/components/NewsletterSubscription';
import { useLanguage } from '@/contexts/LanguageContext';
import { laravelApi } from '@/integrations/laravel/client';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  created_at: string;
  slug: string;
}

interface Document {
  id: string;
  title: string;
  description?: string;
  category: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  view_count: number;
  created_at: string;
}
const Index = () => {
  const {
    t
  } = useLanguage();
  const { toast } = useToast();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [appForm, setAppForm] = useState({ full_name: '', phone: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const services = [{
    icon: Calculator,
    title: "Հաշվապահական հաշվառում"
  }, {
    icon: Users,
    title: "Հարկային, ֆինանսական և կադրային խորհրդատվություն"
  }, {
    icon: BarChart3,
    title: "Ֆինանսական վերլուծություն"
  }, {
    icon: FileText,
    title: "Ֆինանսական հաշվետվություն"
  }, {
    icon: TrendingUp,
    title: "Բիզնես Խորհրդատվություն"
  }, {
    icon: GraduationCap,
    title: "Խմբային և անհատական հաշվապահական դասընթացներ"
  }];
  const featuresData = t('home.features.items');
  const features = Array.isArray(featuresData) ? featuresData : [];
  const stats = [{
    number: '35+',
    label: 'գործընկերեներ'
  }, {
    number: '5+',
    label: 'տարիների փորձ'
  }, {
    number: '20%',
    label: 'տարեկան աճ'
  }, {
    number: '120+',
    label: 'կատարված նախագծեր'
  }];
  useEffect(() => {
    fetchBlogPosts();
    fetchDocuments();
    
    // Auto-refresh documents every 30 seconds to sync with admin changes
    const interval = setInterval(fetchDocuments, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await laravelApi.getBlogPosts({ published: true, per_page: 3 });
      setBlogPosts(response.data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await laravelApi.getDocuments({ published: true, per_page: 6 });
      setDocuments(response.data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const getCategoryTitle = (category: string) => {
    const titles: Record<string, string> = {
      standards: "Ստանդարտներ",
      pek_notifications: "ՊԵԿ ծանուցումներ",
      clarifications_tax: "Հարկային պարզաբանումներ",
      clarifications_labor: "Աշխատանքային պարզաբանումներ",
      discussions: "Քննարկումներ",
      tests_accounting_finance: "Հաշվապահական թեստեր",
      tests_hr: "HR թեստեր"
    };
    return titles[category] || category;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleDocumentView = async (doc: Document) => {
    try {
      // Increment view count
      await laravelApi.incrementDocumentViewCount(doc.id);
      
      // Open document in new tab
      if (doc.file_url) {
        const url = doc.file_url.startsWith('http') ? doc.file_url : `http://127.0.0.1:8000${doc.file_url}`;
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error('Error opening document:', error);
    }
  };

  const submitApplication = async () => {
    if (!appForm.full_name || !appForm.phone || !appForm.email) {
      toast({
        title: "Սխալ",
        description: "Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    try {
      console.log('Submitting application:', appForm);
      
      const response = await laravelApi.createCourseApplication({
        full_name: appForm.full_name,
        phone: appForm.phone,
        email: appForm.email,
        message: 'Դիմում դասընթացների համար - գլխավոր էջից',
        submitted_from: 'main_page_course_card'
      });
      
      console.log('Application submitted successfully:', response);
      
      // Show success message
      toast({
        title: "Հաջողություն",
        description: "Ձեր դիմումը հաջողությամբ ուղարկվեց! Մենք կկապվենք ձեզ հետ:",
      });
      
      // Close dialog and reset form
      setApplyOpen(false);
      setAppForm({ full_name: '', phone: '', email: '' });
      
    } catch (error) {
      console.error('Application submit error:', error);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց ուղարկել դիմումը: Խնդրում ենք փորձել կրկին:",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return <div className="relative">
      <NetworkAnimation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center network-bg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 leading-tight font-bold lg:text-5xl">
              <span className="gradient-text py-0 px-0 mx-0 my-[8px] font-semibold leading-relaxed">Պրոֆեսիոնալ հաշվապահական և ֆինանսական ծառայություններ</span>
            </h1>
            <p className="text-lg text-gray-300 mb-6 sm:mb-8 my-0 py-[20px] sm:text-2xl">
              Ձեր բիզնեսի հաջողության համար
            </p>


            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-12 px-0 py-[20px]">
              <Button asChild size="lg" className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg min-h-[44px] w-full sm:w-auto">
                <Link to="/services">
                  {t('home.hero.servicesBtn')} <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-black px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg min-h-[44px] w-full sm:w-auto">
                <Link to="/contact">
                  {t('home.hero.contactBtn')}
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto px-4 mt-16">
              {stats.map((stat, index) => <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1 sm:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm lg:text-base">
                    {stat.label}
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gold-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              <span className="gradient-text">{t('home.services.title')}</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Առաջարկում ենք ամբողջական լուծումներ Ձեր բիզնեսի ֆինանսական կարիքների համար
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-gradient-to-b from-gray-900 to-black border-gold-500/20 hover:border-gold-400/40 transition-all duration-300 group hover:transform hover:scale-105">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:animate-pulse">
                    <service.icon size={24} className="text-black sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                    {service.title}
                  </h3>
                  {service.title.includes('դասընթացներ') && (
                    <Button onClick={() => setApplyOpen(true)} className="mt-2 min-h-[44px] w-full sm:w-auto bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black">
                      Դիմել
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                      Մենք ապահովում ենք
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">Պրոֆեսիոնալ ծառայությունների մատուցումը, ինչը նպաստում է Ձեր բիզնեսի աճին։</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              <span className="gradient-text">Շտեմարան</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Օգտակար փաստաթղթեր և տեղեկատվություն
            </p>
          </div>

          {documentsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-400 mt-4">Բեռնում...</p>
            </div>
          ) : documents.length > 0 ? (
            <>
              {/* Group documents by category */}
              {Array.from(new Set(documents.map(doc => doc.category)))
                .sort()
                .map(category => {
                  const categoryDocs = documents.filter(doc => doc.category === category);
                  return (
                    <div key={category} className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <Folder className="text-gold-400" size={24} />
                        <h3 className="text-2xl font-bold text-gold-400">
                          {getCategoryTitle(category)}
                        </h3>
                        <span className="text-gray-500">({categoryDocs.length})</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryDocs.map(doc => (
                          <Card key={doc.id} className="bg-gradient-to-b from-gray-900 to-black border-gold-500/20 hover:border-gold-400/40 transition-all duration-300 group">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <FileText className="text-gold-400 flex-shrink-0" size={20} />
                                  {doc.file_name?.toLowerCase().endsWith('.pdf') && (
                                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                                      PDF
                                    </span>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDocumentView(doc)}
                                  disabled={!doc.file_url}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors">
                                {doc.title}
                              </h4>
                              
                              {doc.description && (
                                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                                  {doc.description}
                                </p>
                              )}
                              
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-3">
                                  {doc.file_size && (
                                    <span className="flex items-center gap-1">
                                      <FileText size={12} />
                                      {formatFileSize(doc.file_size)}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Eye size={12} />
                                    {doc.view_count}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDocumentView(doc)}
                                  disabled={!doc.file_url}
                                  className="text-gold-400 hover:text-gold-300 h-auto p-0"
                                >
                                  Բացել <ArrowRight size={12} className="ml-1" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              
              <div className="text-center mt-8">
                <Button asChild className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-semibold min-h-[44px] w-full sm:w-auto">
                  <Link to="/archive">
                    Տեսնել բոլոր փաստաթղթերը <ArrowRight className="ml-2" size={16} />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto text-gray-500 mb-4" size={48} />
              <p className="text-gray-500">Դեռ փաստաթղթեր չեն ավելացվել</p>
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              <span className="gradient-text">Նորություններ</span>
            </h2>
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {blogPosts.map(post => <Card key={post.slug} className="bg-gradient-to-b from-gray-900 to-black border-gold-500/20 hover:border-gold-400/40 transition-all duration-300 group flex flex-col">
                <CardContent className="p-4 sm:p-6 flex flex-col flex-grow">
                  <div className="mb-3 sm:mb-4">
                    <span className="bg-gold-500/20 text-gold-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3 group-hover:text-gold-400 transition-colors leading-snug">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  
                  <p className="text-gray-300 mb-3 sm:mb-4 leading-relaxed text-sm flex-grow">
                    {post.excerpt}
                  </p>
                  
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3 sm:mb-4">
                     <div className="flex items-center space-x-2">
                       <User size={12} />
                       <span>{post.author}</span>
                     </div>
                     <div className="flex items-center space-x-2">
                       <Calendar size={12} />
                       <span>{new Date(post.created_at).toLocaleDateString('hy-AM')}</span>
                     </div>
                   </div>
                  
                  <Button asChild variant="ghost" className="text-gold-400 hover:text-gold-300 p-0 h-auto text-sm self-start min-h-[44px] flex items-center">
                    <Link to={`/blog/${post.slug}`}>
                      Կարդալ ավելին <ArrowRight size={14} className="ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>)}
          </div>

          <div className="text-center">
            <Button asChild className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-semibold min-h-[44px] w-full sm:w-auto">
              <Link to="/blog">
                Տեսնել բոլորը <ArrowRight className="ml-2" size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Application Dialog */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="bg-black border-gold-500/20">
          <DialogHeader>
            <DialogTitle className="text-white">Դիմում դասընթացներին</DialogTitle>
            <DialogDescription className="text-gray-400">
              Լրացրեք տվյալները, մենք կհետադարձկանենք Ձեզ հետ:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Անուն Ազգանուն</Label>
              <Input id="full_name" value={appForm.full_name} onChange={(e) => setAppForm({ ...appForm, full_name: e.target.value })} placeholder="Ձեր անուն ազգանունը" />
            </div>
            <div>
              <Label htmlFor="phone">Հեռախոսահամար</Label>
              <Input id="phone" value={appForm.phone} onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })} placeholder="+374 ..." />
            </div>
            <div>
              <Label htmlFor="email">Էլ. փոստ</Label>
              <Input id="email" type="email" value={appForm.email} onChange={(e) => setAppForm({ ...appForm, email: e.target.value })} placeholder="name@example.com" />
            </div>
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setApplyOpen(false)}>Փակել</Button>
            <Button onClick={submitApplication} disabled={submitting} className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black">
              {submitting ? 'Ուղարկվում է...' : 'Ուղարկել հայտը'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast notifications */}
      <Toaster />

    </div>
};
export default Index;