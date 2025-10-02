import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { laravelApi } from "@/integrations/laravel/client";
import { Loader2 } from "lucide-react";

interface AuthFormProps {
  isLogin: boolean;
  onToggle: () => void;
  onAuthSuccess?: (user: any) => void;
}

const AuthForm = ({ isLogin, onToggle, onAuthSuccess }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await laravelApi.login(email, password);
        console.log('AuthForm: Login response:', response);
        
        toast({
          title: "Բարի գալուստ!",
          description: "Դուք հաջողությամբ մուտք եք գործել:",
        });
        
        // Dispatch custom event to notify other components of auth state change
        console.log('AuthForm: Dispatching auth-state-changed event');
        window.dispatchEvent(new CustomEvent('auth-state-changed'));
        
        // Call onAuthSuccess with user data
        if (onAuthSuccess && response.user) {
          console.log('AuthForm: Calling onAuthSuccess with user:', response.user);
          onAuthSuccess(response.user);
        }
      } else {
        // Validate password confirmation
        if (password !== password_confirmation) {
          toast({
            title: "Սխալ",
            description: "Գաղտնաբառերը չեն համընկնում",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        const response = await laravelApi.register(email, password, password_confirmation);
        
        toast({
          title: "Գրանցումը կատարված է",
          description: "Ձեր հաշիվը հաջողությամբ ստեղծվեց:",
        });
        
        // Dispatch custom event to notify other components of auth state change
        window.dispatchEvent(new CustomEvent('auth-state-changed'));
        
        // Call onAuthSuccess with user data
        if (onAuthSuccess && response.user) {
          onAuthSuccess(response.user);
        }
        
        // Clear form after successful registration
        setEmail("");
        setPassword("");
        setPasswordConfirmation("");
      }
    } catch (error: any) {
      toast({
        title: "Սխալ",
        description: error.message || "Սխալ է տեղի ունեցել",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isLogin ? "Մուտք" : "Գրանցում"}</CardTitle>
        <CardDescription>
          {isLogin ? "Մուտքագրեք Ձեր տվյալները" : "Ստեղծեք նոր հաշիվ"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Էլ. փոստ</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Գաղտնաբառ</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Հաստատել գաղտնաբառը</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={password_confirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLogin ? "Մուտք" : "Գրանցվել"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button variant="link" onClick={() => {
            setPasswordConfirmation("");
            onToggle();
          }}>
            {isLogin ? "Գրանցվել" : "Մուտք գործել"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthForm;