import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FileText, Download, Eye, ChevronDown, ChevronRight, Folder, Archive as ArchiveIcon, Users } from "lucide-react";
import { laravelApi } from "@/integrations/laravel/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import NetworkAnimation from "@/components/NetworkAnimation";
interface Document {
  id: string;
  title: string;
  description?: string;
  category: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  view_count: number;
  is_published: boolean;
  created_at: string;
}
const Archive = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    tax: true,
    personnel: true,
    database: true
  });
  const {
    toast
  } = useToast();
  useEffect(() => {
    fetchDocuments();
    
    // Auto-refresh every 30 seconds to sync with database changes
    const interval = setInterval(fetchDocuments, 30000);
    return () => clearInterval(interval);
  }, []);
  const fetchDocuments = async () => {
    try {
      // LOGIC: If published show, if not published do not show
      // Only load published documents (is_published: true)
      const response = await laravelApi.getDocuments({ is_published: true });
      setDocuments(response.data || []);
    } catch (error: any) {
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց բեռնել փաստաթղթերը",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDocumentView = async (doc: Document) => {
    try {
      // Increment view count
      await laravelApi.incrementDocumentViewCount(doc.id);

      // Open document in new tab
      if (doc.file_url) {
        // Ensure the URL is absolute and open in new tab
        const url = doc.file_url.startsWith('http') ? doc.file_url : `http://127.0.0.1:8000${doc.file_url}`;
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch (error: any) {
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց բացել փաստաթուղթը",
        variant: "destructive"
      });
    }
  };


  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };
  const getCategoryTitle = (category: string) => {
    const titles: Record<string, string> = {
      standards: "Ստանդարտներ",
      pek_notifications: "ՊԵԿ ծանուցումներ",
      clarifications_tax: "Հարկային պարզաբանումներ",
      clarifications_labor: "Աշխատանքային պարզաբանումներ",
      discussions: "Քննարկումներ",
      tests_accounting_finance: "Հաշվապահական և ֆինանսական թեստեր",
      tests_hr: "Մարդկային ռեսուրսների թեստեր"
    };
    return titles[category] || category;
  };
  const filterDocumentsByCategory = (prefix: string) => {
    return documents.filter(doc => doc.category.startsWith(prefix));
  };
  const renderDocumentsByGroup = (groupType: string) => {
    let relevantCategories: string[] = [];
    
    if (groupType === 'tax') {
      relevantCategories = ['standards', 'clarifications_tax', 'pek_notifications'];
    } else if (groupType === 'personnel') {
      relevantCategories = ['clarifications_labor', 'tests_hr'];
    }
    
    return relevantCategories.map(category => {
      const docs = documents.filter(doc => doc.category === category);
      if (docs.length === 0) return null;
      
      return (
        <div key={category} className="mb-6">
          <h4 className="text-lg font-semibold text-gold-400 mb-3 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            {getCategoryTitle(category)}
          </h4>
          <div className="grid gap-4">
            {docs.map(doc => (
              <Card key={doc.id} className="group bg-gradient-to-br from-gray-900/50 to-black border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors">{doc.title}</h5>
                          {doc.description && <p className="text-sm text-gray-400 mb-3">{doc.description}</p>}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {doc.file_size && (
                              <span className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {formatFileSize(doc.file_size)}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {doc.view_count} դիտում
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm" 
                        className="bg-gold-500 hover:bg-gold-600 text-black font-medium"
                        onClick={() => handleDocumentView(doc)} 
                        disabled={!doc.file_url}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Բացել →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }).filter(Boolean);
  };

  const renderDocumentsBySubcategory = (prefix: string) => {
    // Keep the old function for compatibility, but use the new one
    return renderDocumentsByGroup(prefix);
  };

  const renderDocumentsByCategory = (category: string) => {
    const docs = documents.filter(doc => doc.category === category);
    if (docs.length === 0) return null;
    
    return (
      <div key={category} className="mb-6">
        <h4 className="text-lg font-semibold text-gold-400 mb-3 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          {getCategoryTitle(category)}
        </h4>
        <div className="grid gap-4">
          {docs.map(doc => (
            <Card key={doc.id} className="group bg-gradient-to-br from-gray-900/50 to-black border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors">{doc.title}</h5>
                        {doc.description && <p className="text-sm text-gray-400 mb-3">{doc.description}</p>}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {doc.file_size && (
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {formatFileSize(doc.file_size)}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {doc.view_count} դիտում
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button 
                      size="sm" 
                      className="bg-gold-500 hover:bg-gold-600 text-black font-medium"
                      onClick={() => handleDocumentView(doc)} 
                      disabled={!doc.file_url}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Բացել →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  if (loading) {
    return <div className="pt-20">
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-black via-gray-900 to-black network-bg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <div className="animate-spin w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-400 mt-4">Բեռնում...</p>
            </div>
          </div>
        </section>
      </div>;
  }
  return <div className="pt-20">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-black via-gray-900 to-black network-bg">
        <NetworkAnimation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
              Շտեմարան
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Օգտակար փաստաթղթեր և տեղեկատվություն
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-20">

        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Շտեմարանի բաժիններ</h2>
            <p className="text-gray-400 text-lg">Արագ մուտք դեպի տարբեր կատեգորիաների փաստաթղթեր</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. ՀՀՄՍ / ՖՀՄՍ */}
            <Link to="/archive/standards">
              <Card className="group bg-gradient-to-br from-gray-900/50 to-black border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/30 transition-colors">
                    <FileText className="w-6 h-6 text-gold-400" />
                  </div>
                  <CardTitle className="text-white group-hover:text-gold-400 transition-colors">ՀՀՄՍ / ՖՀՄՍ</CardTitle>
                  <CardDescription className="text-gray-400">Հայաստանի հաշվապահական միջազգային ստանդարտներ</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* 2. ՊԵԿ իրազեկումներ */}
            <Link to="/archive/notifications">
              <Card className="group bg-gradient-to-br from-gray-900/50 to-black border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/30 transition-colors">
                    <ArchiveIcon className="w-6 h-6 text-gold-400" />
                  </div>
                  <CardTitle className="text-white group-hover:text-gold-400 transition-colors">ՊԵԿ իրազեկումներ</CardTitle>
                  <CardDescription className="text-gray-400">Պետական եկամուտների կոմիտեի ծանուցումներ</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* 3. Քննարկումներ */}
            <Link to="/archive/discussions">
              <Card className="group bg-gradient-to-br from-gray-900/50 to-black border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/30 transition-colors">
                    <Folder className="w-6 h-6 text-gold-400" />
                  </div>
                  <CardTitle className="text-white group-hover:text-gold-400 transition-colors">Քննարկումներ</CardTitle>
                  <CardDescription className="text-gray-400">Մասնագիտական քննարկումներ և վերլուծություններ</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* 4. Պաշտոնական պարզաբանումներ */}
            <Card className="group bg-gradient-to-br from-gray-900/50 to-black border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/30 transition-colors">
                  <FileText className="w-6 h-6 text-gold-400" />
                </div>
                <CardTitle className="text-white group-hover:text-gold-400 transition-colors">Պաշտոնական պարզաբանումներ</CardTitle>
                <CardDescription className="text-gray-400">Պաշտոնական պարզաբանումներ և մեկնաբանություններ</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <nav aria-label="Պարզաբանումների ենթակատեգորիաներ" className="space-y-2">
                  <Link to="/archive/clarifications/tax-law" className="block text-gold-400 hover:text-gold-300 transition-colors py-2 px-3 rounded-lg hover:bg-gold-500/10">
                    Հարկային օրենսդրություն
                  </Link>
                  <Link to="/archive/clarifications/labor-law" className="block text-gold-400 hover:text-gold-300 transition-colors py-2 px-3 rounded-lg hover:bg-gold-500/10">
                    Աշխատանքային օրենսդրություն
                  </Link>
                </nav>
              </CardContent>
            </Card>

            {/* 5. Թեստեր */}
            <Card className="group bg-gradient-to-br from-gray-900/50 to-black border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/30 transition-colors">
                  <FileText className="w-6 h-6 text-gold-400" />
                </div>
                <CardTitle className="text-white group-hover:text-gold-400 transition-colors">Թեստեր</CardTitle>
                <CardDescription className="text-gray-400">Մասնագիտական թեստեր և ստուգումներ</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <nav aria-label="Թեստերի ենթակատեգորիաներ" className="space-y-2">
                  <Link to="/archive/tests/accounting" className="block text-gold-400 hover:text-gold-300 transition-colors py-2 px-3 rounded-lg hover:bg-gold-500/10">
                    Հաշվապահական և ֆինանսկան ոլորտ
                  </Link>
                  <Link to="/archive/tests/hr" className="block text-gold-400 hover:text-gold-300 transition-colors py-2 px-3 rounded-lg hover:bg-gold-500/10">
                    HR, կադրային ոլորտ
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Documents Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Փաստաթղթեր</h2>
            <p className="text-gray-400 text-lg">Բոլոր հասանելի փաստաթղթերը կատեգորիաների համաձայն</p>
          </div>

          <div className="space-y-8">
            {/* Հարկային օրենսդրություն */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gold-500/20">
              <Collapsible open={openSections.tax} onOpenChange={() => toggleSection("tax")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gold-500/10 transition-colors">
                    <CardTitle className="flex items-center justify-between text-2xl text-gold-400">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        Հարկային օրենսդրություն
                      </div>
                      {openSections.tax ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Հարկային նորմերի և կանոնակարգերի ամբողջական ցանկ
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <p className="text-center text-gray-500 py-8">
                      Փաստաթղթերը տեսնելու համար այցելեք "Շտեմարանի փաստաթղթեր" բաժինը ներքևում
                    </p>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Կադրային օրենսդրություն */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gold-500/20">
              <Collapsible open={openSections.personnel} onOpenChange={() => toggleSection("personnel")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gold-500/10 transition-colors">
                    <CardTitle className="flex items-center justify-between text-2xl text-gold-400">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                        Կադրային օրենսդրություն
                      </div>
                      {openSections.personnel ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Աշխատանքային հարաբերությունների կարգավորման նորմեր
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <p className="text-center text-gray-500 py-8">
                      Փաստաթղթերը տեսնելու համար այցելեք "Շտեմարանի փաստաթղթեր" բաժինը ներքևում
                    </p>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Database Documents */}
            <Card className="bg-gradient-to-br from-gray-900/50 to-black border-gold-500/20">
              <Collapsible open={openSections.database} onOpenChange={() => toggleSection("database")}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gold-500/10 transition-colors">
                    <CardTitle className="flex items-center justify-between text-2xl text-gold-400">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center">
                          <ArchiveIcon className="w-5 h-5" />
                        </div>
                        Շտեմարանի փաստաթղթեր
                      </div>
                      {openSections.database ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Բազայից բեռնված փաստաթղթեր ըստ կատեգորիաների
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    {documents.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-500 text-lg">Դեռ փաստաթղթեր չեն ավելացվել շտեմարանում</p>
                      </div>
                    ) : (
                      // Get unique categories from documents and render them
                      Array.from(new Set(documents.map(doc => doc.category)))
                        .sort()
                        .map(category => renderDocumentsByCategory(category))
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        </section>
      </div>
    </div>;
};
export default Archive;