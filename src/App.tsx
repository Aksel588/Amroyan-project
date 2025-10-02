
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Archive from "./pages/Archive";
import Blog from "./pages/Blog";
import BlogPostPage from "./pages/BlogPostPage";
import Contact from "./pages/Contact";
import ArchiveStandards from "./pages/archive/Standards";
import ArchiveNotifications from "./pages/archive/Notifications";
import ArchiveClarificationsTax from "./pages/archive/ClarificationsTax";
import ArchiveClarificationsLabor from "./pages/archive/ClarificationsLabor";
import ArchiveDiscussions from "./pages/archive/Discussions";
import ArchiveTestsAccounting from "./pages/archive/TestsAccounting";
import ArchiveTestsHR from "./pages/archive/TestsHR";
import Admin from "./pages/Admin";
import BlogEditor from "./pages/BlogEditor";
import BlogManagement from "./pages/BlogManagement";
import NotFound from "./pages/NotFound";
import LoadingPage from "./components/LoadingPage";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import Calculators from "./pages/Calculators";
import SalaryPage from "./pages/calculators/Salary";
import ComprehensiveSalaryPage from "./pages/calculators/ComprehensiveSalary";
import ProjectPage from "./pages/calculators/Project";
import TurnoverTaxPage from "./pages/calculators/TurnoverTax";
import ArmenianTaxPage from "./pages/calculators/ArmenianTax";
import ArmenianPayrollPage from "./pages/calculators/ArmenianPayroll";
import VATCalculatorPage from "./pages/calculators/VAT";
import ProfitTaxCalculatorPage from "./pages/calculators/ProfitTax";
import BenefitCalculatorPage from "./pages/calculators/Benefit";
import EstimateCalculatorPage from "./pages/calculators/Estimate";
import CalculatorPage from "./pages/CalculatorPage";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingPage />;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-black">
              <Header />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/archive/standards" element={<ArchiveStandards />} />
                <Route path="/archive/notifications" element={<ArchiveNotifications />} />
                <Route path="/archive/clarifications/tax-law" element={<ArchiveClarificationsTax />} />
                <Route path="/archive/clarifications/labor-law" element={<ArchiveClarificationsLabor />} />
                <Route path="/archive/discussions" element={<ArchiveDiscussions />} />
                <Route path="/archive/tests/accounting" element={<ArchiveTestsAccounting />} />
                <Route path="/archive/tests/hr" element={<ArchiveTestsHR />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />

                {/* Calculators */}
                <Route path="/calculators" element={<Calculators />} />
                <Route path="/calculators/salary" element={<SalaryPage />} />
                <Route path="/calculators/comprehensive-salary" element={<ComprehensiveSalaryPage />} />
                <Route path="/calculators/estimate" element={<ProjectPage />} />
                <Route path="/calculators/turnover-tax" element={<TurnoverTaxPage />} />
                <Route path="/calculators/armenian-tax" element={<ArmenianTaxPage />} />
                <Route path="/calculators/armenian-payroll" element={<ArmenianPayrollPage />} />
                <Route path="/calculators/vat" element={<VATCalculatorPage />} />
                <Route path="/calculators/profit-tax" element={<ProfitTaxCalculatorPage />} />
                <Route path="/calculators/benefit" element={<BenefitCalculatorPage />} />
                <Route path="/calculators/:slug" element={<CalculatorPage />} />

                <Route path="/admin" element={
                  <AdminProtectedRoute>
                    <Admin />
                  </AdminProtectedRoute>
                } />
                <Route path="/blog-editor" element={
                  <AdminProtectedRoute>
                    <BlogEditor />
                  </AdminProtectedRoute>
                } />
                <Route path="/blog-management" element={
                  <AdminProtectedRoute>
                    <BlogManagement />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/blog/new" element={
                  <AdminProtectedRoute>
                    <BlogEditor />
                  </AdminProtectedRoute>
                } />
                <Route path="/admin/blog/:id" element={
                  <AdminProtectedRoute>
                    <BlogEditor />
                  </AdminProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
              <ScrollToTop />
            </div>
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
