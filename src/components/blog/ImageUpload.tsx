import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { laravelApi } from '@/integrations/laravel/client';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X, Image as ImageIcon, Camera, FileImage } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
}

const ImageUpload = ({ onImageUpload, currentImage }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Սխալ",
        description: "Խնդրում ենք ընտրել նկար",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB for better quality)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Սխալ", 
        description: "Նկարի չափը չպետք է գերազանցի 10MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      
      // Upload to Laravel API
      const response = await laravelApi.uploadImage(file, 'blog-images');
      
      setPreviewUrl(response.url);
      onImageUpload(response.url);

      toast({
        title: "Հաջողություն",
        description: "Նկարը հաջողությամբ բեռնավորվեց",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց բեռնավորել նկարը",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleFileSelect(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleRemoveImage = () => {
    setPreviewUrl('');
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2">
        <Camera className="w-4 h-4" />
        Գլխավոր նկար
      </Label>
      
      {previewUrl ? (
        <div className="relative group">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-md border transition-all duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemoveImage}
              className="bg-red-600 hover:bg-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Ջնջել
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className={`border-2 border-dashed rounded-md p-8 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-gold-400 bg-gold-50/10' 
              : 'border-muted-foreground/25'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            {dragActive ? (
              <FileImage className="w-12 h-12 mx-auto mb-4 text-gold-400" />
            ) : (
              <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            )}
            
            <p className="text-muted-foreground mb-4">
              {dragActive 
                ? 'Թողեք նկարը այստեղ' 
                : 'Քաշեք և թողեք նկարը կամ սեղմեք ընտրելու համար'
              }
            </p>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={openFileDialog}
                disabled={uploading}
                className="min-w-[120px]"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Բեռնավորում...' : 'Ընտրել նկար'}
              </Button>
              
              {uploading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
                  Բեռնավորվում է...
                </div>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground mt-4">
              PNG, JPG, GIF մինչև 10MB
            </p>
          </div>
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;