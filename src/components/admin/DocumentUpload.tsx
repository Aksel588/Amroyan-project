import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { laravelApi } from "@/integrations/laravel/client";
import { Upload, FileText } from "lucide-react";

type DocumentCategory = "standards" | "pek_notifications" | "clarifications_tax" | "clarifications_labor" | "discussions" | "tests_accounting_finance" | "tests_hr";

interface DocumentUploadProps {
  onSuccess?: () => void;
}

const DocumentUpload = ({ onSuccess }: DocumentUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as DocumentCategory | "",
    files: [] as File[]
  });

  const categories = [
    { value: "standards", label: "ՀՀՄՍ / ՖՀՄՍ" },
    { value: "pek_notifications", label: "ՊԵԿ իրազեկումներ" },
    { value: "clarifications_tax", label: "Պաշտոնական պարզաբանումներ · Հարկային օրենսդրություն" },
    { value: "clarifications_labor", label: "Պաշտոնական պարզաբանումներ · Աշխատանքային օրենսդրություն" },
    { value: "discussions", label: "Քննարկումներ" },
    { value: "tests_accounting_finance", label: "Թեստեր · Հաշվապահական և ֆինանսական ոլորտ" },
    { value: "tests_hr", label: "Թեստեր · HR, կադրային ոլորտ" }
  ] as const;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const nonPdf = files.find(f => f.type !== 'application/pdf');
    if (nonPdf) {
      toast({ title: "Սխալ", description: "Միայն PDF ֆայլեր են ընդունվում", variant: "destructive" });
      return;
    }
    setFormData(prev => ({ ...prev, files }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || formData.files.length === 0) {
      toast({ title: "Սխալ", description: "Ընտրեք կատեգորիան և առնվազն մեկ PDF ֆայլ", variant: "destructive" });
      return;
    }
    if (formData.files.length === 1 && !formData.title) {
      toast({ title: "Սխալ", description: "Մեկ ֆայլի դեպքում անհրաժեշտ է վերնագիր", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      for (const file of formData.files) {
        const title = formData.title || file.name.replace(/\.[^/.]+$/, "");
        await laravelApi.uploadDocument(file, {
          title,
          description: formData.description,
          category: formData.category as DocumentCategory,
        });
      }

      toast({ title: "Հաջողություն", description: `${formData.files.length} ֆայլ${formData.files.length>1?"եր":""} վերբեռնվեց` });
      setFormData({ title: "", description: "", category: "", files: [] });
      onSuccess?.();
    } catch (error) {
      console.error('Error uploading document(s):', error);
      toast({ title: "Սխալ", description: "Չհաջողվեց վերբեռնել ֆայլ(երը)", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Նոր փաստաթուղթ վերբեռնել
        </CardTitle>
        <CardDescription>
          Վերբեռնեք PDF փաստաթուղթ և լրացրեք մանրամասները
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Վերնագիր {formData.files.length <= 1 ? '*' : ''}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={formData.files.length > 1 ? "Կկիրառվի, եթե թողնեք" : "Փաստաթղթի վերնագիր"}
            />
          </div>

          <div>
            <Label htmlFor="category">Կատեգորիա *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value: DocumentCategory) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ընտրեք կատեգորիան" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Նկարագրություն</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Փաստաթղթի նկարագրություն"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="files">PDF ֆայլ(եր) *</Label>
            <div className="mt-2">
              <Input
                id="files"
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileChange}
                className="cursor-pointer"
                required
              />
              {formData.files.length > 0 && (
                <div className="mt-2 text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{formData.files.length} ընտրված ֆայլ</span>
                  </div>
                  <ul className="list-disc pl-5">
                    {formData.files.slice(0,3).map((f, i) => (
                      <li key={i}>{f.name} ({(f.size/1024/1024).toFixed(2)} MB)</li>
                    ))}
                    {formData.files.length > 3 && (
                      <li>… և ևս {formData.files.length - 3} ֆայլ</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" disabled={uploading} className="w-full">
            {uploading ? "Վերբեռնում..." : "Վերբեռնել ֆայլ(եր)"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;