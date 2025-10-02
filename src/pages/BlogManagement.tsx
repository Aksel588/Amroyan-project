import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { laravelApi } from "@/integrations/laravel/client";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Trash2, Plus, Eye, Search } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  slug: string;
  featured: boolean;
  published: boolean;
  created_at: string;
}

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await laravelApi.getBlogPosts();
      setPosts(response.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց բեռնել գրառումները",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await laravelApi.deleteBlogPost(id);
      setPosts(posts.filter(post => post.id !== id));
      toast({
        title: "Հաջողություն",
        description: "Գրառումը հաջողությամբ ջնջվեց",
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց ջնջել գրառումը",
        variant: "destructive",
      });
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      await laravelApi.updateBlogPost(post.id, { published: !post.published });
      setPosts(posts.map(p => 
        p.id === post.id ? { ...p, published: !p.published } : p
      ));

      toast({
        title: "Հաջողություն",
        description: `Գրառումը ${!post.published ? 'հրատարակվեց' : 'անջատվեց'}`,
      });
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց թարմացնել գրառումը",
        variant: "destructive",
      });
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Բեռնում...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Բլոգի կառավարում</h1>
          <Link to="/admin/blog/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Նոր գրառում
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Որոնել գրառումներ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Որոնել ըստ վերնագրի կամ կատեգորիայի..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{post.title}</h3>
                      {post.featured && (
                        <Badge variant="secondary">Առաջնային</Badge>
                      )}
                      <Badge variant={post.published ? "default" : "outline"}>
                        {post.published ? "Հրատարակված" : "Սևագիր"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Կատեգորիա: {post.category}</span>
                      <span>Հեղինակ: {post.author}</span>
                      <span>Ստեղծվել է: {new Date(post.created_at).toLocaleDateString('hy-AM')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link to={`/blog/${post.slug}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to={`/admin/blog/${post.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant={post.published ? "outline" : "default"}
                      size="sm"
                      onClick={() => togglePublish(post)}
                    >
                      {post.published ? "Անջատել" : "Հրատարակել"}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Ջնջել գրառումը</AlertDialogTitle>
                          <AlertDialogDescription>
                            Դուք վստա՞հ եք, որ ցանկանում եք ջնջել այս գրառումը: Այս գործողությունը անվերադարձ է:
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Չեղարկել</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(post.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Ջնջել
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Գրառումներ չեն գտնվել</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;