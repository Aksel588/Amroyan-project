import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SEOData {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  keywords: string;
}

interface SEOSettingsProps {
  seoData: SEOData;
  onChange: (seoData: SEOData) => void;
}

const SEOSettings = ({ seoData, onChange }: SEOSettingsProps) => {
  const updateSEOData = (field: keyof SEOData, value: string) => {
    onChange({
      ...seoData,
      [field]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO կարգավորումներ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Մետա վերնագիր</Label>
          <Input
            id="metaTitle"
            value={seoData.metaTitle}
            onChange={(e) => updateSEOData('metaTitle', e.target.value)}
            placeholder="SEO վերնագիր (մաքս. 60 նիշ)"
            maxLength={60}
          />
          <div className="text-xs text-muted-foreground">
            {seoData.metaTitle.length}/60 նիշ
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">Մետա նկարագրություն</Label>
          <Textarea
            id="metaDescription"
            value={seoData.metaDescription}
            onChange={(e) => updateSEOData('metaDescription', e.target.value)}
            placeholder="SEO նկարագրություն (մաքս. 160 նիշ)"
            maxLength={160}
            rows={3}
          />
          <div className="text-xs text-muted-foreground">
            {seoData.metaDescription.length}/160 նիշ
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords">Հիմնաբառեր</Label>
          <Input
            id="keywords"
            value={seoData.keywords}
            onChange={(e) => updateSEOData('keywords', e.target.value)}
            placeholder="հիմնաբառ1, հիմնաբառ2, հիմնաբառ3"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="canonicalUrl">Հիմնական URL</Label>
          <Input
            id="canonicalUrl"
            value={seoData.canonicalUrl}
            onChange={(e) => updateSEOData('canonicalUrl', e.target.value)}
            placeholder="https://example.com/blog/post-slug"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SEOSettings;