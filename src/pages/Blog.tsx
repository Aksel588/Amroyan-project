import { Calendar, User, ArrowRight, Clock, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { laravelApi } from "@/integrations/laravel/client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
const LARAVEL_ORIGIN = (() => {
  const url = import.meta.env.VITE_LARAVEL_API_URL || "https://amroyancons.am/api";
  try {
    return new URL(url).origin;
  } catch {
    return (url && typeof url === 'string' ? url.replace(/\/api\/?$/, "") : "") || "http://127.0.0.1:8000";
  }
})();

function absoluteImageUrl(url: string): string {
  if (!url) return url;
  if (url.includes("/api/storage/")) {
    const path = url.replace(/^https?:\/\/[^/]+\/api\/storage\//, "/storage/");
    return LARAVEL_ORIGIN.replace(/\/$/, "") + path;
  }
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = LARAVEL_ORIGIN.replace(/\/$/, "");
  return base + (url.startsWith("/") ? url : "/" + url);
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  read_time: string;
  slug: string;
  featured: boolean;
  published: boolean;
  featured_image?: string;
  created_at: string;
}
const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();
  const { t } = useLanguage();
  useEffect(() => {
    fetchBlogPosts();
    checkAdminStatus();
  }, []);
  const fetchBlogPosts = async () => {
    try {
      const response = await laravelApi.getBlogPosts({ published: true });
      setBlogPosts(response.data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: t('blog.toast.error'),
        description: t('blog.toast.loadFailed'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const checkAdminStatus = async () => {
    try {
      const response = await laravelApi.getCurrentUser();
      const user = response?.data || response;
      setIsAdmin(user?.role === 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
      // User not logged in, that's fine
      setIsAdmin(false);
    }
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t('blog.loading')}</div>
      </div>;
  }
  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(p => p.category === selectedCategory);
  const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0];
  const otherPosts = featuredPost ? filteredPosts.filter(p => p.slug !== featuredPost.slug) : filteredPosts;
  const categoryValues = ['all', 'Հարկային', 'Ֆինանսներ', 'Տեխնոլոգիաներ', 'Բիզնես', 'Տնտեսություն', 'HR', 'Հեղինակային'];
  return <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black network-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-4 mb-8">
              <h1 className="text-5xl md:text-6xl font-bold">
                <span className="gradient-text text-4xl">{t('blog.heroTitle')}</span>
              </h1>
              {isAdmin && <Link to="/admin/blog/new">
                  
                </Link>}
            </div>
            
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">
                <span className="gradient-text">{t('blog.featuredTitle')}</span>
              </h2>
              
              <Card className="bg-gradient-to-br from-gray-900 to-black border-gold-500/20 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center overflow-hidden">
                    {featuredPost.featured_image ? (
                      <img
                        src={absoluteImageUrl(featuredPost.featured_image)}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl text-gold-400">📊</div>
                    )}
                  </div>
                  
                  <CardContent className="p-8 lg:p-12 flex flex-col">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="bg-gold-500/20 text-gold-400 px-3 py-1 rounded-full text-sm">
                        {featuredPost.category}
                      </span>
                      <span className="text-gray-400 text-sm flex items-center gap-1.5">
                        <Clock size={14} /> {featuredPost.read_time}
                      </span>
                    </div>
                    
                    <h3 className="text-3xl font-bold text-white mb-4">
                      <Link to={`/blog/${featuredPost.slug}`} className="hover:text-gold-400 transition-colors">
                        {featuredPost.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-300 mb-6 leading-relaxed flex-grow">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <User size={16} />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} />
                          <span>{new Date(featuredPost.created_at).toLocaleDateString('hy-AM')}</span>
                        </div>
                      </div>
                      
                      <Button asChild variant="ghost" className="text-gold-400 hover:text-gold-300">
                        <Link to={`/blog/${featuredPost.slug}`}>
                          {t('blog.readMore')} <ArrowRight size={16} className="ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </section>}

      {/* Categories Filter */}
      <section className="py-8 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categoryValues.map((category, index) => (
              <Button
                key={index}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category
                  ? "bg-gradient-to-r from-gold-500 to-gold-600 text-black"
                  : "border-gold-500/30 text-gray-300 hover:bg-gold-500/10 hover:text-gold-400"}
              >
                {category === 'all' ? t('blog.allCategory') : category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map(post => <Card key={post.slug} className="bg-gradient-to-b from-gray-900 to-black border-gold-500/20 hover:border-gold-400/40 transition-all duration-300 group flex flex-col overflow-hidden">
                <div className="aspect-video w-full bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center shrink-0">
                  {post.featured_image ? (
                    <img
                      src={absoluteImageUrl(post.featured_image)}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl text-gold-400">📄</div>
                  )}
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="bg-gold-500/20 text-gold-400 px-2 py-1 rounded text-xs">
                      {post.category}
                    </span>
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <Clock size={12} /> {post.read_time}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white group-hover:text-gold-400 transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                </CardHeader>
                
                <CardContent className="flex flex-col flex-grow">
                  <p className="text-gray-300 mb-6 leading-relaxed text-sm flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <User size={12} />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Calendar size={12} />
                        <span>{new Date(post.created_at).toLocaleDateString('hy-AM')}</span>
                      </div>
                    </div>
                    
                    <Button asChild variant="ghost" size="sm" className="text-gold-400 hover:text-gold-300 p-2">
                      <Link to={`/blog/${post.slug}`}>{t('blog.readMore')} <ArrowRight size={16} className="ml-1" /></Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>
    </div>;
};
export default Blog;