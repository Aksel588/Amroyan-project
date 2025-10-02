import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { laravelApi } from '@/integrations/laravel/client';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Ban,
  User,
  Mail,
  Phone,
  Calendar,
  FileText
} from 'lucide-react';

interface CourseApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  processed_by?: string;
  submitted_from?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface CourseApplicationStats {
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  total: number;
}

const CourseApplicationManagement: React.FC = () => {
  // Component for managing course applications
  const [applications, setApplications] = useState<CourseApplication[]>([]);
  const [stats, setStats] = useState<CourseApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<CourseApplication | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [statusFilter, searchQuery]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await laravelApi.getCourseApplications({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined,
      });
      setApplications(response.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց բեռնավորել դիմումները",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await laravelApi.getCourseApplicationsCount();
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateApplicationStatus = async () => {
    if (!selectedApplication || !newStatus) return;

    try {
      await laravelApi.updateCourseApplicationStatus(selectedApplication.id, {
        status: newStatus,
        notes: notes,
      });

      toast({
        title: "Հաջողություն",
        description: "Դիմումի կարգավիճակը հաջողությամբ թարմացվեց",
      });

      setStatusDialogOpen(false);
      setSelectedApplication(null);
      setNewStatus('');
      setNotes('');
      fetchApplications();
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց թարմացնել կարգավիճակը",
        variant: "destructive",
      });
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm('Դուք վստա՞հ եք, որ ցանկանում եք ջնջել այս դիմումը:')) {
      return;
    }

    try {
      await laravelApi.deleteCourseApplication(id);
      toast({
        title: "Հաջողություն",
        description: "Դիմումը հաջողությամբ ջնջվեց",
      });
      fetchApplications();
      fetchStats();
    } catch (error) {
      console.error('Error deleting application:', error);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց ջնջել դիմումը",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary', icon: Clock, text: 'Սպասում է' },
      approved: { variant: 'default', icon: CheckCircle, text: 'Հաստատված' },
      rejected: { variant: 'destructive', icon: XCircle, text: 'Մերժված' },
      cancelled: { variant: 'outline', icon: Ban, text: 'Չեղարկված' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hy-AM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Դիմումներ դասընթացների համար</h2>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ընդամենը</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Սպասում է</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Հաստատված</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Մերժված</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Չեղարկված</CardTitle>
              <Ban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.cancelled}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Որոնել անունով, էլ. փոստով կամ հեռախոսահամարով..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Կարգավիճակ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Բոլորը</SelectItem>
                  <SelectItem value="pending">Սպասում է</SelectItem>
                  <SelectItem value="approved">Հաստատված</SelectItem>
                  <SelectItem value="rejected">Մերժված</SelectItem>
                  <SelectItem value="cancelled">Չեղարկված</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Դիմումների ցուցակ</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Բեռնվում է...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Անուն</TableHead>
                  <TableHead>Էլ. փոստ</TableHead>
                  <TableHead>Հեռախոս</TableHead>
                  <TableHead>Կարգավիճակ</TableHead>
                  <TableHead>Ամսաթիվ</TableHead>
                  <TableHead>Գործողություններ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.full_name}</TableCell>
                    <TableCell>{application.email}</TableCell>
                    <TableCell>{application.phone}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell>{formatDate(application.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(application);
                            setViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(application);
                            setNewStatus(application.status);
                            setNotes(application.notes || '');
                            setStatusDialogOpen(true);
                          }}
                        >
                          <Filter className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteApplication(application.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Application Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Դիմումի մանրամասներ</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Անուն</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedApplication.full_name}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Էլ. փոստ</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedApplication.email}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Հեռախոս</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedApplication.phone}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Կարգավիճակ</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Հղում</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedApplication.submitted_from || 'Ոչնչից'}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Ամսաթիվ</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(selectedApplication.created_at)}</span>
                  </div>
                </div>
              </div>
              
              {selectedApplication.message && (
                <div>
                  <Label className="text-sm font-medium">Հաղորդագրություն</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md">
                    {selectedApplication.message}
                  </div>
                </div>
              )}

              {selectedApplication.notes && (
                <div>
                  <Label className="text-sm font-medium">Նշումներ</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md">
                    {selectedApplication.notes}
                  </div>
                </div>
              )}

              {selectedApplication.processed_by && (
                <div>
                  <Label className="text-sm font-medium">Մշակված է</Label>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {selectedApplication.processed_by}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Թարմացնել կարգավիճակ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Կարգավիճակ</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Ընտրել կարգավիճակ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Սպասում է</SelectItem>
                  <SelectItem value="approved">Հաստատված</SelectItem>
                  <SelectItem value="rejected">Մերժված</SelectItem>
                  <SelectItem value="cancelled">Չեղարկված</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Նշումներ</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ավելացնել նշումներ..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                Չեղարկել
              </Button>
              <Button onClick={updateApplicationStatus}>
                Թարմացնել
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseApplicationManagement;
