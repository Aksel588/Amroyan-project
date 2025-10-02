import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { laravelApi } from "@/integrations/laravel/client";
import { useToast } from "@/hooks/use-toast";
import { FileText, Users, Upload, MessageSquare, Settings, PenTool, BarChart3, Database, Eye, Edit, Trash2, Mail, Phone, Calendar, ExternalLink, Check, X, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DocumentUpload from "@/components/admin/DocumentUpload";
import UserManagement from "@/components/admin/UserManagement";
import SystemSettings from "@/components/admin/SystemSettings";
import CalculatorsManagement from "@/components/admin/CalculatorsManagement";
import ContactManagement from "@/components/admin/ContactManagement";
import CourseApplicationManagement from "@/components/admin/CourseApplicationManagement";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    documents: 0,
    users: 0,
    blogPosts: 0,
    messages: 0,
    newsletters: 0,
    calculators: 0
  });
  
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [courseApplications, setCourseApplications] = useState<any[]>([]);
  const [calculators, setCalculators] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchStats();
    fetchNewsletterStats();
    fetchBlogPosts();
    fetchDocuments();
    fetchUsers();
    fetchCourseApplications();
    fetchCalculatorStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await laravelApi.getStats();
      setStats(prev => ({
        ...prev,
        documents: response.data.documents,
        users: response.data.users,
        blogPosts: response.data.blog_posts,
        messages: response.data.messages
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchNewsletterStats = async () => {
    try {
      const response = await laravelApi.getNewsletterStats();
      if (response.success) {
        setStats(prev => ({
          ...prev,
          newsletters: response.data.total_subscribers
        }));
      }
    } catch (error) {
      console.error('Error fetching newsletter stats:', error);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const response = await laravelApi.getBlogPosts({ per_page: 10 });
      setBlogPosts(response.data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      // Get ALL documents (both published and unpublished) for admin
      const response = await laravelApi.getDocuments({ per_page: 100 });
      console.log('Fetched documents for admin:', response.data);
      setDocuments(response.data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await laravelApi.getUsers({ per_page: 10 });
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCourseApplications = async () => {
    try {
      const response = await laravelApi.getCourseApplications({ per_page: 10 });
      setCourseApplications(response.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchCalculatorStats = async () => {
    try {
      const response = await laravelApi.getCalculators();
      setCalculators(response.data || []);
      setStats(prev => ({
        ...prev,
        calculators: response.data?.length || 0
      }));
    } catch (error) {
      console.error('Error fetching calculator stats:', error);
    }
  };
  const handleSignOut = async () => {
    try {
      await laravelApi.logout();
      toast({
        title: "Դուրս գալիս",
        description: "Դուք հաջողությամբ դուրս եկաք համակարգից:",
      });
      
      // Dispatch custom event to notify other components of auth state change
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
      
      // Navigate to home page after logout
      navigate('/');
    } catch (error) {
      // Even if logout fails, clear local storage
      localStorage.removeItem('laravel_token');
      toast({
        title: "Դուրս գալիս",
        description: "Դուք հաջողությամբ դուրս եկաք համակարգից:",
      });
      
      // Dispatch custom event to notify other components of auth state change
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
      
      // Navigate to home page after logout
      navigate('/');
    }
  };

  const toggleBlogPostStatus = async (postId: string, currentStatus: boolean) => {
    try {
      await laravelApi.updateBlogPost(postId, { published: !currentStatus });
      
      setBlogPosts(prev => 
        prev.map(post => 
          post.id === postId ? { ...post, published: !currentStatus } : post
        )
      );
      
      toast({
        title: `Գրառումը ${!currentStatus ? 'հրապարակվեց' : 'թաքցվեց'}`,
      });
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց թարմացնել գրառումը",
        variant: "destructive"
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const confirmed = window.confirm('Ջնջե՞լ գրառումը բոլորովին.');
      if (!confirmed) return;
      await laravelApi.deleteBlogPost(postId);
      setBlogPosts(prev => prev.filter(p => p.id !== postId));
      toast({ title: 'Գրառումը ջնջվեց' });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({ title: 'Սխալ', description: 'Չհաջողվեց ջնջել գրառումը', variant: 'destructive' });
    }
  };

  const toggleDocumentStatus = async (docId: string, currentStatus: boolean) => {
    try {
      console.log('Toggling document status:', docId, 'from', currentStatus, 'to', !currentStatus);
      
      // Update local state immediately for better UX
      setDocuments(prev => prev.map(doc => 
        doc.id === docId 
          ? { ...doc, is_published: !currentStatus }
          : doc
      ));
      
      // Call the API to update the database
      const response = await laravelApi.toggleDocumentPublishStatus(docId);
      console.log('Toggle response:', response);
      
      // Show success message
      toast({
        title: `Փաստաթուղթը ${!currentStatus ? 'հրապարակվեց' : 'թաքցվեց'}`,
        description: "Փոփոխությունները պահպանվեցին տվյալների բազայում",
      });
      
      // Refresh the documents list from the database to ensure sync
      await fetchDocuments();
      
    } catch (error: any) {
      console.error('Error toggling document status:', error);
      
      // Revert the local state change on error
      setDocuments(prev => prev.map(doc => 
        doc.id === docId 
          ? { ...doc, is_published: currentStatus }
          : doc
      ));
      
      toast({
        title: "Սխալ",
        description: error.message || "Չհաջողվեց թարմացնել փաստաթուղթը",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDocument = async (docId: string, fileUrl?: string) => {
    try {
      const confirmed = window.confirm('Ջնջե՞լ փաստաթուղթը բոլորովին. Այս գործողությունը անդառնալի է.');
      if (!confirmed) return;

      await laravelApi.deleteDocument(docId);

      setDocuments(prev => prev.filter(d => d.id !== docId));
      toast({ title: 'Փաստաթուղթը ջնջվեց' });
    } catch (err) {
      console.error('Error deleting document:', err);
      toast({ title: 'Սխալ', description: 'Չհաջողվեց ջնջել փաստաթուղթը', variant: 'destructive' });
    }
  };

  const updateCourseApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await laravelApi.updateCourseApplication(id, { status });
      setCourseApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      toast({ title: status === 'approved' ? 'Հայտը հաստատվեց' : 'Հայտը մերժվեց' });
    } catch (error) {
      console.error('Error updating application:', error);
      toast({ title: 'Սխալ', description: 'Չհաջողվեց թարմացնել հայտը', variant: 'destructive' });
    }
  };

  const deleteCourseApplication = async (id: string) => {
    try {
      const confirmed = window.confirm('Ջնջե՞լ դիմումը բոլորովին.');
      if (!confirmed) return;
      await laravelApi.deleteCourseApplication(id);
      setCourseApplications(prev => prev.filter(a => a.id !== id));
      toast({ title: 'Դիմումը ջնջվեց' });
    } catch (error) {
      console.error('Error deleting application:', error);
      toast({ title: 'Սխալ', description: 'Չհաջողվեց ջնջել դիմումը', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-32 px-4">
        <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-white">Ադմինիստրատորի վահանակ</h1>
          <Button variant="outline" onClick={handleSignOut}>
            Դուրս գալ
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Շտեմարան</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.documents}</div>
              <p className="text-xs text-muted-foreground">PDF ֆայլեր</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Օգտատերեր</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users}</div>
              <p className="text-xs text-muted-foreground">Գրանցված օգտատերեր</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Բլոգ գրառումներ</CardTitle>
              <PenTool className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.blogPosts}</div>
              <p className="text-xs text-muted-foreground">Ընդամենը գրառումներ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Հաղորդագրություններ</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.messages}</div>
              <p className="text-xs text-muted-foreground">Ստացված հաղորդագրություններ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Նորություններ</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newsletters}</div>
              <p className="text-xs text-muted-foreground">Բաժանորդներ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Հաշվիչներ</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.calculators}</div>
              <p className="text-xs text-muted-foreground">Ընդամենը հաշվիչներ</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Ընդհանուր</TabsTrigger>
            <TabsTrigger value="messages">Հաղորդագրություններ</TabsTrigger>
            <TabsTrigger value="blog">Բլոգ</TabsTrigger>
            <TabsTrigger value="documents">Շտեմարան</TabsTrigger>
            <TabsTrigger value="applications">Դիմումներ</TabsTrigger>
            <TabsTrigger value="calculators">Հաշվիչներ</TabsTrigger>
            <TabsTrigger value="users">Օգտատերեր</TabsTrigger>
            <TabsTrigger value="settings">Կարգավորումներ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="h-5 w-5" />
                    Բլոգի կառավարում
                  </CardTitle>
                  <CardDescription>
                    Ստեղծեք և կառավարեք բլոգի գրառումները
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/blog-editor')}
                  >
                    Նոր գրառում ստեղծել
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/blog-management')}
                  >
                    Գրառումների կառավարում
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Շտեմարանի կառավարում
                  </CardTitle>
                  <CardDescription>
                    Վերբեռնեք և կառավարեք PDF փաստաթղթերը
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    onClick={() => setActiveTab("documents")}
                  >
                    Ֆայլ վերբեռնել
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Հաղորդագրություններ
                  </CardTitle>
                  <CardDescription>
                    Դիտեք և պատասխանեք հաղորդագրություններին
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {/* contactMessages.filter(msg => !msg.is_read).length */}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Չկարդացված հաղորդագրություններ
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Վիճակագրություն
                  </CardTitle>
                  <CardDescription>
                    Կայքի գործունեության վիճակագրություն
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Ակտիվ փաստաթղթեր:</span>
                      <span className="font-medium">{documents.filter(d => d.is_published).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Հրապարակված գրառումներ:</span>
                      <span className="font-medium">{blogPosts.filter(d => d.published).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Ակտիվ հաշվիչներ:</span>
                      <span className="font-medium">{calculators.filter(c => c.visible).length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Հաշվիչների կառավարում
                  </CardTitle>
                  <CardDescription>
                    Ստեղծեք և կառավարեք հաշվիչները
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={() => setActiveTab("calculators")}
                  >
                    Հաշվիչներ կառավարել
                  </Button>
                  <div className="text-sm text-muted-foreground text-center">
                    Ընդամենը: {stats.calculators} հաշվիչ
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Դիմումներ դասընթացների համար
                  </CardTitle>
                  <CardDescription>
                    Կառավարեք դիմումները դասընթացների համար
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={() => setActiveTab("applications")}
                  >
                    Դիմումներ կառավարել
                  </Button>
                  <div className="text-sm text-muted-foreground text-center">
                    Ընդամենը: {courseApplications.length} դիմում
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <ContactManagement />
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Բլոգի կառավարում</h2>
              <Button onClick={() => navigate('/blog-editor')}>
                Նոր գրառում ստեղծել
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Վերջին գրառումները</CardTitle>
                <CardDescription>
                  Վերջերս ստեղծված բլոգի գրառումները
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogPosts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Գրառումներ չկան
                    </p>
                  ) : (
                    blogPosts.map((post) => (
                      <div key={post.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="space-y-1">
                            <h4 className="font-medium">{post.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant={post.published ? "default" : "secondary"}>
                                {post.published ? "Հրապարակված" : "Սևագիր"}
                              </Badge>
                              <span>{post.category}</span>
                              <span>{new Date(post.created_at).toLocaleDateString('hy-AM')}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/blog/${post.slug}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/blog-editor?edit=${post.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={post.published ? "secondary" : "default"}
                              onClick={() => toggleBlogPostStatus(post.id, post.published)}
                            >
                              {post.published ? "Թաքցնել" : "Հրապարակել"}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeletePost(post.id)}
                              title="Ջնջել գրառումը"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                {blogPosts.length > 0 && (
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate('/blog-management')}
                    >
                      Բոլոր գրառումները դիտել
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="grid gap-6">
              <DocumentUpload onSuccess={() => fetchDocuments()} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Վերջին փաստաթղթերը</CardTitle>
                  <CardDescription>
                    Վերջերս վերբեռնված փաստաթղթերի ցանկ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documents.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Փաստաթղթեր չկան
                      </p>
                    ) : (
                      documents.map((doc) => (
                        <div key={doc.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="space-y-1">
                              <h4 className="font-medium">{doc.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant={doc.is_published ? "default" : "secondary"}>
                                  {doc.is_published ? "Հրապարակված" : "Սևագիր"}
                                </Badge>
                                <span>{doc.category}</span>
                                <span>{new Date(doc.created_at).toLocaleDateString('hy-AM')}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {doc.file_url && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const url = doc.file_url?.startsWith('http') ? doc.file_url : `http://127.0.0.1:8000${doc.file_url}`;
                                    window.open(url, '_blank', 'noopener,noreferrer');
                                  }}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant={doc.is_published ? "secondary" : "default"}
                                onClick={() => toggleDocumentStatus(doc.id, doc.is_published)}
                              >
                                {doc.is_published ? "Թաքցնել" : "Հրապարակել"}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteDocument(doc.id, doc.file_url)}
                                title="Ջնջել փաստաթուղթը"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {doc.description && (
                            <p className="text-sm text-muted-foreground">
                              {doc.description}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <CourseApplicationManagement />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SystemSettings />
          </TabsContent>

          <TabsContent value="calculators" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Հաշվիչների կառավարում</h2>
            <CalculatorsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;