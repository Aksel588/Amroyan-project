import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { laravelApi } from '@/integrations/laravel/client';
import { User, Mail, Phone, MessageSquare, Send, CheckCircle } from 'lucide-react';

interface CourseApplicationFormProps {
  submittedFrom?: string;
}

const CourseApplicationForm: React.FC<CourseApplicationFormProps> = ({ submittedFrom }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted!', formData);
    
    if (!formData.full_name || !formData.email || !formData.phone) {
      console.log('Validation failed - missing required fields');
      toast({
        title: "Սխալ",
        description: "Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const requestData = {
        ...formData,
        submitted_from: submittedFrom || 'website',
      };
      
      console.log('Submitting course application:', requestData);
      
      const response = await laravelApi.createCourseApplication(requestData);
      
      console.log('Course application response:', response);

      setSubmitted(true);
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        message: '',
      });

      toast({
        title: "Հաջողություն",
        description: "Ձեր դիմումը հաջողությամբ ուղարկվեց: Մենք կկապվենք ձեզ հետ:",
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց ուղարկել դիմումը: Խնդրում ենք փորձել կրկին:",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('Input changed:', name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (submitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Շնորհակալություն!</h3>
          <p className="text-muted-foreground mb-4">
            Ձեր դիմումը հաջողությամբ ուղարկվեց: Մեր թիմը կկապվի ձեզ հետ մոտակա ժամանակներում:
          </p>
          <Button 
            onClick={() => setSubmitted(false)}
            variant="outline"
          >
            Նոր դիմում ուղարկել
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Դիմում դասընթացների համար</CardTitle>
        <CardDescription className="text-center">
          Լրացրեք ձեր տվյալները և մենք կկապվենք ձեզ հետ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="full_name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Անուն Ազգանուն *
            </Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="Ձեր անունն ու ազգանունը"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Էլ. փոստ *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Հեռախոսահամար *
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+374 XX XXX XXX"
              required
            />
          </div>

          <div>
            <Label htmlFor="message" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Հաղորդագրություն
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Լրացուցիչ տեղեկություններ կամ հարցեր..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Ուղարկվում է...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Ուղարկել հայտը
              </>
            )}
          </Button>
          
          {/* Debug button - remove after testing */}
          <Button 
            type="button" 
            variant="outline" 
            className="w-full mt-2"
            onClick={() => {
              console.log('Current form data:', formData);
              console.log('Form validation:', {
                hasName: !!formData.full_name,
                hasEmail: !!formData.email,
                hasPhone: !!formData.phone
              });
            }}
          >
            Debug Form Data
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CourseApplicationForm;
