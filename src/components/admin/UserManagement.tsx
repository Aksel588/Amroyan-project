import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { laravelApi } from "@/integrations/laravel/client";
import { Users, Shield, ShieldCheck, Calendar, Mail } from "lucide-react";

interface User {
  id: string;
  user_id: string;
  email: string;
  role: string;
  created_at: string;
}

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await laravelApi.getUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց բեռնել օգտատերերի ցանկը",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      await laravelApi.updateUser(selectedUser.id, { role: newRole });

      toast({
        title: "Հաջողություն",
        description: `${selectedUser.email} օգտատիրոջ դերը փոխվեց`
      });

      setUsers(prev => 
        prev.map(user => 
          user.id === selectedUser.id 
            ? { ...user, role: newRole }
            : user
        )
      );

      setSelectedUser(null);
      setNewRole("");
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց փոխել օգտատիրոջ դերը",
        variant: "destructive"
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return "destructive" as const;
      default:
        return "default" as const;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Ադմինիստրատոր';
      default:
        return 'Օգտատեր';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Բեռնում...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Օգտատերերի կառավարում
          </CardTitle>
          <CardDescription>
            Կառավարեք օգտատերերի իրավունքները և դերերը
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Օգտատերեր չկան
              </p>
            ) : (
              users.map((user) => (
                <div key={user.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{user.email}</span>
                        </div>
                        <Badge 
                          variant={getRoleBadgeVariant(user.role)}
                          className="flex items-center gap-1"
                        >
                          {getRoleIcon(user.role)}
                          {getRoleLabel(user.role)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Գրանցման ամսաթիվ: {new Date(user.created_at).toLocaleDateString('hy-AM')}
                        </span>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setNewRole(user.role);
                          }}
                        >
                          Դեր փոխել
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Դեր փոխել</DialogTitle>
                          <DialogDescription>
                            Փոխեք {user.email} օգտատիրոջ դերը
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Ընտրեք նոր դեր</label>
                            <Select value={newRole} onValueChange={setNewRole}>
                              <SelectTrigger className="mt-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">Օգտատեր</SelectItem>
                                <SelectItem value="admin">Ադմինիստրատոր</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setSelectedUser(null)}>
                            Չեղարկել
                          </Button>
                          <Button onClick={updateUserRole}>
                            Պահպանել
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;