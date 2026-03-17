import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { laravelApi } from '@/integrations/laravel/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, Mail, Phone, MessageSquare, Send, CheckCircle } from 'lucide-react';

interface CourseApplicationFormProps {
  submittedFrom?: string;
}

const CourseApplicationForm: React.FC<CourseApplicationFormProps> = ({ submittedFrom }) => {
  const { t } = useLanguage();
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
        title: t('home.toast.error'),
        description: t('home.toast.fillRequired'),
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
        title: t('home.toast.success'),
        description: t('home.toast.applicationSent'),
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: t('home.toast.error'),
        description: t('home.toast.sendFailed'),
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
          <h3 className="text-xl font-semibold mb-2">{t('home.applyDialog.thankYou')}</h3>
          <p className="text-muted-foreground mb-4">
            {t('home.applyDialog.successMessage')}
          </p>
          <Button 
            onClick={() => setSubmitted(false)}
            variant="outline"
          >
            {t('home.applyDialog.submitAgain')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">{t('home.applyDialog.title')}</CardTitle>
        <CardDescription className="text-center">
          {t('home.applyDialog.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('home.applyDialog.fullName')} *
            </Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder={t('home.applyDialog.placeholderName')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {t('home.applyDialog.email')} *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('home.applyDialog.placeholderEmail')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {t('home.applyDialog.phone')} *
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={t('home.applyDialog.placeholderPhone')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {t('home.applyDialog.message')}
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={t('home.applyDialog.placeholderMessage')}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {t('home.applyDialog.submitting')}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t('home.applyDialog.submit')}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CourseApplicationForm;
