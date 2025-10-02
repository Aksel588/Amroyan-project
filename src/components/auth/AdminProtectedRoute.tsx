import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { laravelApi } from "@/integrations/laravel/client";
import { useToast } from "@/hooks/use-toast";
import AuthForm from "./AuthForm";
import { Loader2 } from "lucide-react";

interface AdminProtectedRouteProps {
  children: ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    
    if (userData.role === 'admin') {
      // User is admin, allow access to admin area
      setProfile({ role: 'admin' });
      toast({
        title: "Բարի գալուստ ադմին!",
        description: "Դուք մուտք եք գործել ադմինիստրատորի բաժին",
      });
    } else {
      // User is not admin, redirect to home page
      toast({
        title: "Բարի գալուստ!",
        description: "Դուք ունեք սահմանափակ մուտքի իրավունքներ",
      });
      navigate('/'); // Redirect to home page
    }
  };

  const checkAuthentication = async () => {
    const token = localStorage.getItem('laravel_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Verify token with backend by making an authenticated request
      const response = await laravelApi.getCurrentUser();
      if (response && response.id) {
        setUser(response);
        // Check if user has admin role
        if (response.role === 'admin') {
          setProfile({ role: 'admin' });
        } else {
          // User is not admin, clear token and redirect to login
          localStorage.removeItem('laravel_token');
          setUser(null);
          setProfile(null);
          toast({
            title: "Մուտքի սխալ",
            description: "Ձեզ չունեք ադմինիստրատորի իրավունքներ",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      // Token is invalid or expired, remove it
      localStorage.removeItem('laravel_token');
      setUser(null);
      setProfile(null);
      console.error('Authentication check failed:', error);
      
      // Only show error toast if it's not just an unauthorized error
      if (!error.message?.includes('Unauthenticated')) {
        toast({
          title: "Սխալ",
          description: "Չհաջողվեց ստուգել նույնականացումը",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      // For now, assume admin role if token exists
      setProfile({ role: 'admin' });
    } catch (error: any) {
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց բեռնել օգտատիրական տվյալները",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await laravelApi.logout();
      setUser(null);
      setProfile(null);
      toast({
        title: "Դուրս գալիս",
        description: "Դուք հաջողությամբ դուրս եկաք համակարգից:",
      });
      
      // Dispatch custom event to notify other components of auth state change
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
    } catch (error) {
      // Even if logout fails, clear local storage
      localStorage.removeItem('laravel_token');
      setUser(null);
      setProfile(null);
      toast({
        title: "Դուրս գալիս",
        description: "Դուք հաջողությամբ դուրս եկաք համակարգից:",
      });
      
      // Dispatch custom event to notify other components of auth state change
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AuthForm 
          isLogin={isLogin} 
          onToggle={() => setIsLogin(!isLogin)}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  if (profile.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Մուտքը արգելված է</h1>
          <p className="mb-4">Դուք չունեք ադմինիստրատորի իրավունքներ:</p>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Դուրս գալ
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;