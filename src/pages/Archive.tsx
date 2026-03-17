import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FileText, Download, Eye, ChevronDown, ChevronRight, Folder, Archive as ArchiveIcon } from "lucide-react";
import { laravelApi } from "@/integrations/laravel/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import NetworkAnimation from "@/components/NetworkAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    database: true
  });
  const { toast } = useToast();
  const { t } = useLanguage();
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
      const response = await laravelApi.getDocuments({ is_published: true, per_page: 200 });
      setDocuments(response.data || []);
    } catch (error: any) {
      toast({
        title: t('archive.toast.error'),
        description: t('archive.toast.loadFailed'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDocumentDownload = async (doc: Document) => {
    if (!doc.file_url) return;
    try {
      await laravelApi.incrementDocumentViewCount(doc.id);
      const blob = await laravelApi.downloadDocument(doc.id);
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = doc.file_name || `${doc.title || 'document'}.pdf`;
      a.click();
      URL.revokeObjectURL(blobUrl);
      toast({ title: t('archive.toast.downloaded'), description: t('archive.toast.documentDownloaded') });
    } catch (error: any) {
      toast({
        title: t('archive.toast.error'),
        description: error?.message || t('archive.toast.downloadFailed'),
        variant: 'destructive',
      });
    }
  };


  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };
  const getCategoryTitle = (category: string) => {
    const key = `archive.categories.${category}`;
    const translated = t(key);
    return translated !== key ? translated : category;
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
                              {doc.view_count} {t('archive.views')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm" 
                        className="bg-gold-500 hover:bg-gold-600 text-black font-medium"
                        onClick={() => handleDocumentDownload(doc)} 
                        disabled={!doc.file_url}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {t('archive.download')}
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
                            {doc.view_count} {t('archive.views')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button 
                      size="sm" 
                      className="bg-gold-500 hover:bg-gold-600 text-black font-medium"
                      onClick={() => handleDocumentDownload(doc)} 
                      disabled={!doc.file_url}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {t('archive.download')}
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
              <p className="text-gray-400 mt-4">{t('archive.loading')}</p>
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
              {t('archive.heroTitle')}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {t('archive.heroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-20">

        {/* Features Section */}
        <section className="pt-10 mb-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-6 pt-4">{t('archive.sectionsTitle')}</h2>
            <p className="text-gray-400 text-lg mb-8">{t('archive.sectionsSubtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
            {/* 1. Standards */}
            <Card className="group bg-gradient-to-br from-gray-900/50 to-black border-gold-500/20">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/30 transition-colors">
                  <FileText className="w-6 h-6 text-gold-400" />
                </div>
                <CardTitle className="text-white transition-colors">{t('archive.sectionCards.standardsTitle')}</CardTitle>
                <CardDescription className="text-gray-400">{t('archive.sectionCards.standardsDesc')}</CardDescription>
              </CardHeader>
            </Card>

            {/* 2. PEK */}
            <Card className="group bg-gradient-to-br from-gray-900/50 to-black border-gold-500/20">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/30 transition-colors">
                  <ArchiveIcon className="w-6 h-6 text-gold-400" />
                </div>
                <CardTitle className="text-white transition-colors">{t('archive.sectionCards.pekTitle')}</CardTitle>
                <CardDescription className="text-gray-400">{t('archive.sectionCards.pekDesc')}</CardDescription>
              </CardHeader>
            </Card>

            {/* 3. Discussions */}
            <Card className="group bg-gradient-to-br from-gray-900/50 to-black border-gold-500/20">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/30 transition-colors">
                  <Folder className="w-6 h-6 text-gold-400" />
                </div>
                <CardTitle className="text-white transition-colors">{t('archive.sectionCards.discussionsTitle')}</CardTitle>
                <CardDescription className="text-gray-400">{t('archive.sectionCards.discussionsDesc')}</CardDescription>
              </CardHeader>
            </Card>

            {/* 4. Clarifications */}
            <Card className="group bg-gradient-to-br from-gray-900/50 to-black border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/30 transition-colors">
                  <FileText className="w-6 h-6 text-gold-400" />
                </div>
                <CardTitle className="text-white group-hover:text-gold-400 transition-colors">{t('archive.sectionCards.clarificationsTitle')}</CardTitle>
                <CardDescription className="text-gray-400">{t('archive.sectionCards.clarificationsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <nav aria-label={t('archive.sectionCards.clarificationsAria')} className="space-y-2">
                  <Link to="/archive/clarifications/tax-law" className="block text-gold-400 hover:text-gold-300 transition-colors py-2 px-3 rounded-lg hover:bg-gold-500/10">
                    {t('archive.sectionCards.taxLaw')}
                  </Link>
                  <Link to="/archive/clarifications/labor-law" className="block text-gold-400 hover:text-gold-300 transition-colors py-2 px-3 rounded-lg hover:bg-gold-500/10">
                    {t('archive.sectionCards.laborLaw')}
                  </Link>
                </nav>
              </CardContent>
            </Card>

            {/* 5. Tests */}
            <Card className="group bg-gradient-to-br from-gray-900/50 to-black border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/30 transition-colors">
                  <FileText className="w-6 h-6 text-gold-400" />
                </div>
                <CardTitle className="text-white group-hover:text-gold-400 transition-colors">{t('archive.sectionCards.testsTitle')}</CardTitle>
                <CardDescription className="text-gray-400">{t('archive.sectionCards.testsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <nav aria-label={t('archive.sectionCards.testsAria')} className="space-y-2">
                  <Link to="/archive/tests/accounting" className="block text-gold-400 hover:text-gold-300 transition-colors py-2 px-3 rounded-lg hover:bg-gold-500/10">
                    {t('archive.sectionCards.testsAccounting')}
                  </Link>
                  <Link to="/archive/tests/hr" className="block text-gold-400 hover:text-gold-300 transition-colors py-2 px-3 rounded-lg hover:bg-gold-500/10">
                    {t('archive.sectionCards.testsHr')}
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Documents Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">{t('archive.documentsTitle')}</h2>
            <p className="text-gray-400 text-lg">{t('archive.documentsSubtitle')}</p>
          </div>

          <div className="space-y-8">
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
                        {t('archive.warehouseTitle')}
                      </div>
                      {openSections.database ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {t('archive.warehouseSubtitle')}
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    {/* Document list from database by category */}
                    {documents.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        {t('archive.noDocuments')}
                      </p>
                    ) : (
                      <div className="space-y-8">
                        {Array.from(new Set(documents.map(d => d.category)))
                          .sort()
                          .map(cat => renderDocumentsByCategory(cat))}
                      </div>
                    )}
                    <div className="flex flex-col items-center justify-center pt-4 border-t border-gold-500/20">
                      <Button
                        size="lg"
                        className="bg-gold-500 hover:bg-gold-600 text-black font-medium"
                        disabled={downloadingPdf}
                        onClick={async () => {
                          setDownloadingPdf(true);
                          try {
                            const blob = await laravelApi.downloadWarehousePdf();
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "warehouse-documents.pdf";
                            a.click();
                            URL.revokeObjectURL(url);
                            toast({ title: t('archive.toast.downloaded'), description: t('archive.toast.pdfDownloaded') });
                          } catch (e: any) {
                            toast({
                              title: t('archive.toast.error'),
                              description: e?.message || t('archive.toast.pdfFailed'),
                              variant: "destructive",
                            });
                          } finally {
                            setDownloadingPdf(false);
                          }
                        }}
                      >
                        {downloadingPdf ? (
                          <>
                            <span className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2" />
                            {t('archive.downloadPdfLoading')}
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5 mr-2" />
                            {t('archive.downloadPdf')}
                          </>
                        )}
                      </Button>
                    </div>
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