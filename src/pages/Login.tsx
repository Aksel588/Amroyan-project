import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AuthForm from "@/components/auth/AuthForm";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuthSuccess = (userData: any) => {
    if (userData.role === 'admin') {
      // Admin user, redirect to admin dashboard
      toast({
        title: "Բարի գալուստ ադմին!",
        description: "Դուք մուտք եք գործել ադմինիստրատորի բաժին",
      });
      navigate('/admin');
    } else {
      // Regular user, redirect to home page
      toast({
        title: "Բարի գալուստ!",
        description: "Դուք հաջողությամբ մուտք եք գործել",
      });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Մուտք' : 'Գրանցում'}
          </h1>
          <p className="text-gray-400">
            {isLogin ? 'Մուտքագրեք Ձեր տվյալները' : 'Ստեղծեք նոր հաշիվ'}
          </p>
        </div>
        
        <AuthForm 
          isLogin={isLogin} 
          onToggle={() => setIsLogin(!isLogin)}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </div>
  );
};

export default Login;