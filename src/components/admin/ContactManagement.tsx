import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { laravelApi } from '@/integrations/laravel/client';
import { 
  Mail, 
  Phone, 
  Building, 
  MessageSquare, 
  Search, 
  Eye, 
  Trash2, 
  CheckCircle,
  Clock
} from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  service?: string;
  is_read: boolean;
  created_at: string;
}

const ContactManagement = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMessages();
  }, [search, statusFilter, currentPage]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params: any = {
        per_page: 10,
        page: currentPage
      };

      if (search) {
        params.search = search;
      }

      if (statusFilter !== 'all') {
        params.is_read = statusFilter === 'read';
      }

      const response = await laravelApi.getContactMessages(params);
      
      if (response.data) {
        setMessages(response.data);
        setTotalPages(response.meta?.last_page || 1);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց բեռնել հաղորդագրությունները",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await laravelApi.updateContactMessage(id, { is_read: true });
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === id ? { ...msg, is_read: true } : msg
        )
      );

      toast({
        title: "Հաջողություն",
        description: "Հաղորդագրությունը նշվեց որպես կարդացված"
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց նշել հաղորդագրությունը որպես կարդացված",
        variant: "destructive"
      });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Դուք վստա՞հ եք, որ ցանկանում եք ջնջել այս հաղորդագրությունը:')) {
      return;
    }

    try {
      await laravelApi.deleteContactMessage(id);
      
      setMessages(prev => prev.filter(msg => msg.id !== id));
      
      toast({
        title: "Հաջողություն",
        description: "Հաղորդագրությունը հաջողությամբ ջնջվեց"
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց ջնջել հաղորդագրությունը",
        variant: "destructive"
      });
    }
  };

  const viewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setViewDialogOpen(true);
    
    // Mark as read if not already read
    if (!message.is_read) {
      await markAsRead(message.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hy-AM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (isRead: boolean) => {
    return isRead ? (
      <Badge variant="secondary" className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Կարդացված
      </Badge>
    ) : (
      <Badge variant="default" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Նոր
      </Badge>
    );
  };

  if (loading && messages.length === 0) {
    return <div className="text-center py-8">Բեռնում...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Հաղորդագրությունների կառավարում
          </CardTitle>
          <CardDescription>
            Դիտեք և կառավարեք օգտատերերի ուղարկած հաղորդագրությունները
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Որոնել անունով, էլ. հասցեով կամ թեմայով..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ընտրել կարգավիճակ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Բոլորը</SelectItem>
                  <SelectItem value="unread">Նոր</SelectItem>
                  <SelectItem value="read">Կարդացված</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Messages List */}
            {messages.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Հաղորդագրություններ չկան
              </p>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{message.name}</span>
                          </div>
                          {getStatusBadge(message.is_read)}
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {message.email}
                          </div>
                          {message.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {message.phone}
                            </div>
                          )}
                          {message.service && (
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {message.service}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-sm">
                          <strong>Թեմա:</strong> {message.subject}
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {formatDate(message.created_at)}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewMessage(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMessage(message.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Նախորդ
                </Button>
                <span className="flex items-center px-3">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Հաջորդ
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Message Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Հաղորդագրության մանրամասներ</DialogTitle>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Անուն:</strong> {selectedMessage.name}
                </div>
                <div>
                  <strong>Էլ. հասցե:</strong> {selectedMessage.email}
                </div>
                {selectedMessage.phone && (
                  <div>
                    <strong>Հեռախոս:</strong> {selectedMessage.phone}
                  </div>
                )}
                {selectedMessage.service && (
                  <div>
                    <strong>Ծառայություն:</strong> {selectedMessage.service}
                  </div>
                )}
                <div>
                  <strong>Ամսաթիվ:</strong> {formatDate(selectedMessage.created_at)}
                </div>
              </div>
              
              <div>
                <strong>Թեմա:</strong>
                <p className="mt-1">{selectedMessage.subject}</p>
              </div>
              
              <div>
                <strong>Հաղորդագրություն:</strong>
                <p className="mt-1 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactManagement;
