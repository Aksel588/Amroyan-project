import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Archive as ArchiveIcon, Folder } from "lucide-react";
import { Link } from "react-router-dom";
import NetworkAnimation from "@/components/NetworkAnimation";
import { useLanguage } from "@/contexts/LanguageContext";

const Archive = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-20">
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
        {/* Sections Grid */}
        <section className="pt-10 mb-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-6 pt-4">{t('archive.sectionsTitle')}</h2>
            <p className="text-gray-400 text-lg mb-8">{t('archive.sectionsSubtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
            {/* 1. Standards */}
            <Card className="group bg-gradient-to-br from-gray-900/50 to-black border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
              <Link to="/archive/standards" className="block">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/30 transition-colors">
                    <FileText className="w-6 h-6 text-gold-400" />
                  </div>
                  <CardTitle className="text-white group-hover:text-gold-400 transition-colors">{t('archive.sectionCards.standardsTitle')}</CardTitle>
                  <CardDescription className="text-gray-400">{t('archive.sectionCards.standardsDesc')}</CardDescription>
                </CardHeader>
              </Link>
            </Card>

            {/* 2. PEK */}
            <Card className="group bg-gradient-to-br from-gray-900/50 to-black border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
              <Link to="/archive/notifications" className="block">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/30 transition-colors">
                    <ArchiveIcon className="w-6 h-6 text-gold-400" />
                  </div>
                  <CardTitle className="text-white group-hover:text-gold-400 transition-colors">{t('archive.sectionCards.pekTitle')}</CardTitle>
                  <CardDescription className="text-gray-400">{t('archive.sectionCards.pekDesc')}</CardDescription>
                </CardHeader>
              </Link>
            </Card>

            {/* 3. Discussions */}
            <Card className="group bg-gradient-to-br from-gray-900/50 to-black border-gold-500/20 hover:border-gold-500/40 transition-all duration-300">
              <Link to="/archive/discussions" className="block">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/30 transition-colors">
                    <Folder className="w-6 h-6 text-gold-400" />
                  </div>
                  <CardTitle className="text-white group-hover:text-gold-400 transition-colors">{t('archive.sectionCards.discussionsTitle')}</CardTitle>
                  <CardDescription className="text-gray-400">{t('archive.sectionCards.discussionsDesc')}</CardDescription>
                </CardHeader>
              </Link>
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
      </div>
    </div>
  );
};

export default Archive;