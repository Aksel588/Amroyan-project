import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Calendar, User, Clock } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import NotFound from './NotFound';
import { laravelApi } from "@/integrations/laravel/client";
import { useEffect, useState } from "react";

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

// A component to render the HTML with inline styles to mimic prose
const ArticleContent = ({ htmlContent }: { htmlContent: string }) => {
    const styledHtml = htmlContent
        .replace(/<h2>/g, `<h2 style="font-size: 1.875rem; font-weight: bold; color: #fbbf24; margin-top: 2em; margin-bottom: 1em;">`)
        .replace(/<h3>/g, `<h3 style="font-size: 1.5rem; font-weight: bold; color: #fbbf24; margin-top: 1.6em; margin-bottom: 0.8em;">`)
        .replace(/<p>/g, `<p style="margin-bottom: 1.25em; line-height: 1.75;">`)
        .replace(/<ul>/g, `<ul style="list-style-type: disc; padding-left: 1.5em; margin-bottom: 1.25em; line-height: 1.75;">`)
        .replace(/<li>/g, `<li style="margin-bottom: 0.5em;">`)
        .replace(/<a /g, `<a style="color: #f59e0b; text-decoration: underline;" `)
        .replace(/<img/g, '<img style="width: 100%; height: auto; border-radius: 0.75rem; margin-top: 2em; margin-bottom: 2em; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);"')
        .replace(/<iframe/g, '<iframe style="width: 100%; aspect-ratio: 16 / 9; border-radius: 0.5rem; margin-top: 2em; margin-bottom: 2em;"');

    return (
      <div 
        className="prose prose-lg prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: styledHtml }} 
      />
    );
};

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      // For now, we'll use a placeholder since we need to implement slug-based fetching
      // In a real implementation, you'd add a method to fetch by slug
      const response = await laravelApi.getBlogPosts({ published: true });
      const postData = response.data?.find((p: any) => p.slug === slug);
      
      if (postData) {
        setPost(postData);
        
        // Fetch related posts
        const relatedData = response.data?.filter((p: any) => 
          p.category === postData.category && p.id !== postData.id
        ).slice(0, 2);
        
        setRelatedPosts(relatedData || []);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Բեռնում...</div>
      </div>
    );
  }

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="pt-20 bg-black text-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 network-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Featured Image */}
            {post.featured_image && (
              <div className="mb-8">
                <img 
                  src={post.featured_image} 
                  alt={post.title}
                  className="w-full max-w-3xl mx-auto h-64 md:h-80 object-cover rounded-lg shadow-2xl border border-gold-500/20"
                />
              </div>
            )}
            
            <div className="mb-4">
              <span className="bg-gold-500/20 text-gold-400 px-3 py-1 rounded-full text-sm">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">{post.title}</span>
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-gray-400">
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{new Date(post.created_at).toLocaleDateString('hy-AM')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>{post.read_time}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb and Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Գլխավոր</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/blog">Բլոգ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{post.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <article>
            <ArticleContent htmlContent={post.content} />
          </article>

          <hr className="my-12 border-gold-500/20" />

          {/* Author Box */}
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gold-500/20">
            <CardContent className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={32} className="text-gold-400" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gold-400">{post.author}</h4>
                <p className="text-gray-400 mt-1">
                  Amroyan Consulting-ի առաջատար մասնագետ, {post.category} ոլորտի փորձագետ։
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-3xl font-bold mb-8 text-center">
                <span className="gradient-text">Նմանատիպ հոդվածներ</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.slug} className="bg-gradient-to-b from-gray-900 to-black border-gold-500/20 hover:border-gold-400/40 transition-all duration-300 group flex flex-col">
                    <CardContent className="p-6 flex flex-col flex-grow">
                       <h4 className="text-xl font-semibold text-white mb-3 group-hover:text-gold-400 transition-colors">
                        <Link to={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
                      </h4>
                      <p className="text-gray-300 mb-4 leading-relaxed text-sm flex-grow">
                        {relatedPost.excerpt}
                      </p>
                      <Button asChild variant="ghost" className="text-gold-400 hover:text-gold-300 p-0 h-auto text-sm self-start">
                        <Link to={`/blog/${relatedPost.slug}`}>Կարդալ ավելին <ArrowRight size={14} className="ml-1" /></Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <Button asChild variant="outline" className="border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-black">
              <Link to="/blog">
                <ArrowLeft className="mr-2" size={16} />
                Վերադառնալ բլոգ
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPostPage;