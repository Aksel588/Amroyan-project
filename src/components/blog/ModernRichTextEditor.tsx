import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useRef, useEffect } from 'react';
import { laravelApi } from '@/integrations/laravel/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  X
} from 'lucide-react';

interface ModernRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ModernRichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Մուտքագրեք բովանդակությունը..." 
}: ModernRichTextEditorProps) => {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer hover:text-blue-800',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-md',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-6 bg-background text-foreground',
        placeholder: placeholder,
      },
    },
    onCreate: ({ editor }) => {
      console.log('Editor created:', editor);
    },
    onSelectionUpdate: ({ editor }) => {
      console.log('Selection updated:', editor.state.selection);
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="bg-background border rounded-lg p-6 min-h-[400px] flex items-center justify-center">
        <div className="text-muted-foreground">Բեռնում է...</div>
      </div>
    );
  }

  const handleImageUpload = async (file: File) => {
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

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Սխալ",
        description: "Նկարի չափը չպետք է գերազանցի 10MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingImage(true);
      
      // Upload to Laravel API
      const response = await laravelApi.uploadImage(file, 'blog-images');
      
      // Insert image into editor
      editor.chain().focus().setImage({ 
        src: response.url,
        alt: file.name,
        title: file.name
      }).run();

      setImageDialogOpen(false);
      toast({
        title: "Հաջողություն",
        description: "Նկարը հաջողությամբ ավելացվեց",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց բեռնավորել նկարը",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLinkInsert = () => {
    if (linkUrl && linkText) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setLinkText('');
      setLinkDialogOpen(false);
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getCharacterCount = () => {
    const text = editor.getText();
    return text.length;
  };

  // Helper function to safely execute editor commands
  const executeCommand = (command: () => void) => {
    try {
      editor.chain().focus();
      command();
      editor.run();
    } catch (error) {
      console.error('Editor command error:', error);
    }
  };

  // Heading button handlers
  const toggleHeading = (level: 1 | 2 | 3) => {
    console.log(`Toggling heading level ${level}`);
    editor.chain().focus().toggleHeading({ level }).run();
  };

  // List button handlers
  const toggleBulletList = () => {
    console.log('Toggling bullet list');
    editor.chain().focus().toggleBulletList().run();
  };

  const toggleOrderedList = () => {
    console.log('Toggling ordered list');
    editor.chain().focus().toggleOrderedList().run();
  };

  return (
    <div className="bg-background border rounded-lg overflow-hidden">
      {/* Character count display */}
      <div className="border-b px-4 py-2 bg-muted/20">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Բովանդակություն *</Label>
          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {getCharacterCount()} նիշ
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b p-3 flex flex-wrap gap-2 bg-muted/10">
        {/* Text formatting */}
        <div className="flex gap-1">
          <Button
            variant={editor.isActive('bold') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Թավ (Ctrl+B)"
            disabled={!editor.isEditable}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('italic') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Շեղ (Ctrl+I)"
            disabled={!editor.isEditable}
          >
            <Italic className="h-4 w-4" />
          </Button>
          {/* Test button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log('Test button clicked');
              console.log('Editor state:', editor.state);
              console.log('Editor is active:', editor.isActive('heading', { level: 1 }));
            }}
            title="Test"
          >
            Test
          </Button>
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Headings */}
        <div className="flex gap-1">
          <Button
            variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleHeading(1)}
            title="Վերնագիր 1"
            disabled={!editor.isEditable}
          >
            H1
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleHeading(2)}
            title="Վերնագիր 2"
            disabled={!editor.isEditable}
          >
            H2
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleHeading(3)}
            title="Վերնագիր 3"
            disabled={!editor.isEditable}
          >
            H3
          </Button>
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Lists */}
        <div className="flex gap-1">
          <Button
            variant={editor.isActive('bulletList') ? 'default' : 'outline'}
            size="sm"
            onClick={toggleBulletList}
            title="Նշանավորված ցուցակ"
            disabled={!editor.isEditable}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('orderedList') ? 'default' : 'outline'}
            size="sm"
            onClick={toggleOrderedList}
            title="Համարակալված ցուցակ"
            disabled={!editor.isEditable}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Alignment */}
        <div className="flex gap-1">
          <Button
            variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            title="Ձախ կողմ"
            disabled={!editor.isEditable}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            title="Կենտրոն"
            disabled={!editor.isEditable}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            title="Աջ կողմ"
            disabled={!editor.isEditable}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            title="Հավասարեցնել"
            disabled={!editor.isEditable}
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Other formatting */}
        <div className="flex gap-1">
          <Button
            variant={editor.isActive('blockquote') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Մեջբերում"
            disabled={!editor.isEditable}
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('codeBlock') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Կոդի բլոկ"
            disabled={!editor.isEditable}
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Links and images */}
        <div className="flex gap-1">
          <Button
            variant={editor.isActive('link') ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLinkDialogOpen(true)}
            title="Հղում ավելացնել"
            disabled={!editor.isEditable}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          {editor.isActive('link') && (
            <Button
              variant="outline"
              size="sm"
              onClick={removeLink}
              title="Հղում հեռացնել"
              disabled={!editor.isEditable}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setImageDialogOpen(true)}
            title="Նկար ավելացնել"
            disabled={!editor.isEditable}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Editor content */}
      <EditorContent editor={editor} className="min-h-[400px]" />

      {/* Hidden file input for image upload */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleImageUpload(file);
          }
        }}
        className="hidden"
      />

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Հղում ավելացնել</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkText">Հղման տեքստ</Label>
              <Input
                id="linkText"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Հղման տեքստը..."
              />
            </div>
            <div>
              <Label htmlFor="linkUrl">URL</Label>
              <Input
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                type="url"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                Չեղարկել
              </Button>
              <Button onClick={handleLinkInsert}>
                Ավելացնել
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Նկար ավելացնել</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Ընտրեք նկար ձեր համակարգչից
              </p>
              <Button
                variant="outline"
                onClick={openFileDialog}
                disabled={uploadingImage}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadingImage ? 'Բեռնավորում...' : 'Ընտրել նկար'}
              </Button>
              {uploadingImage && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Նկարը բեռնավորվում է...
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground text-center">
              PNG, JPG, GIF մինչև 10MB
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModernRichTextEditor; 