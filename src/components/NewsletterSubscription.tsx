
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { laravelApi } from '@/integrations/laravel/client';
import { Mail } from 'lucide-react';

interface NewsletterSubscriptionProps {
  className?: string;
}

const NewsletterSubscription = ({ className = '' }: NewsletterSubscriptionProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Սխալ",
        description: "Խնդրում ենք լրացնել էլ. փոստի հասցեն",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Սխալ",
        description: "Խնդրում ենք մուտքագրել վավեր էլ. փոստի հասցե",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await laravelApi.subscribeToNewsletter(email);
      
      if (response.success) {
        toast({
          title: "Հաջողություն!",
          description: response.message || "Դուք հաջողությամբ բաժանորդագրվեցիք մեր նորություններին",
        });
        setEmail('');
      } else {
        toast({
          title: "Տեղեկություն",
          description: response.message || "Տեղի է ունեցել խնդիր",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Սխալ",
        description: error.message || "Սխալ է տեղի ունեցել: Խնդրում ենք փորձել մի փոքր ուշ",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ձեր էլ. փոստի հասցեն"
            className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-semibold px-6 py-3 whitespace-nowrap"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Բաժանորդագրում...
            </div>
          ) : (
            'Բաժանորդագրվել'
          )}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSubscription;
