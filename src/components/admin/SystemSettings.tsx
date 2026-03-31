import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { laravelApi } from "@/integrations/laravel/client";
import { Settings, Mail, KeyRound } from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
  role?: string;
};

const SystemSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialEmail, setInitialEmail] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const user = (await laravelApi.getCurrentUser()) as AdminUser;
        if (user?.email) {
          setInitialEmail(user.email);
          setEmail(user.email);
        }
      } catch {
        toast({
          title: "Սխալ",
          description: "Չհաջողվեց բեռնել ադմինի տվյալները",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [toast]);

  const emailChanged = email.trim() !== initialEmail;
  const passwordFilled = newPassword.length > 0 || confirmPassword.length > 0;
  const needsCurrentPassword = emailChanged || passwordFilled;

  const saveProfile = async () => {
    if (passwordFilled && newPassword !== confirmPassword) {
      toast({
        title: "Սխալ",
        description: "Նոր գաղտնաբառերը չեն համընկնում",
        variant: "destructive",
      });
      return;
    }

    if (needsCurrentPassword && !currentPassword) {
      toast({
        title: "Անհրաժեշտ է",
        description: "Մուտքագրեք ընթացիկ գաղտնաբառը էլ. հասցե կամ գաղտնաբառ փոխելու համար",
        variant: "destructive",
      });
      return;
    }

    if (!email.trim()) {
      toast({
        title: "Սխալ",
        description: "Էլ. հասցեն չի կարող դատարկ լինել",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const body: {
        email: string;
        current_password?: string;
        password?: string;
        password_confirmation?: string;
      } = { email: email.trim() };

      if (needsCurrentPassword) {
        body.current_password = currentPassword;
      }
      if (passwordFilled) {
        body.password = newPassword;
        body.password_confirmation = confirmPassword;
      }

      const res = await laravelApi.updateProfile(body);

      if (res.success && res.data?.email) {
        setInitialEmail(res.data.email);
        setEmail(res.data.email);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast({
          title: "Հաջողություն",
          description: res.message || "Տվյալները պահպանվեցին",
        });
      } else {
        throw new Error(res.message || "Չհաջողվեց պահպանել");
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Չհաջողվեց պահպանել";
      toast({
        title: "Սխալ",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500 mx-auto mb-4" />
              <p className="text-gray-400">Բեռնում...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Համակարգի կարգավորումներ
          </CardTitle>
          <CardDescription>
            Ադմինիստրատորի էլ. հասցե (Gmail) և գաղտնաբառ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              Ադմինի էլ. հասցե
            </h3>
            <div className="space-y-2 max-w-md">
              <Label htmlFor="admin-email">Էլ. հասցե (մուտքի համար)</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
              />
              <p className="text-xs text-muted-foreground">
                Սա է հասցեն, որով մուտք եք գործում ադմին պանել
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
              <KeyRound className="h-4 w-4" />
              Գաղտնաբառ
            </h3>
            <div className="grid gap-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="current-password">Ընթացիկ գաղտնաբառ</Label>
                <Input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={needsCurrentPassword ? "Պարտադիր է փոփոխության դեպքում" : "Թողեք դատարկ, եթե ոչինչ չեք փոխում"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Նոր գաղտնաբառ (ըստ ցանկության)</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Նվազագույն 8 նիշ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Կրկնել նոր գաղտնաբառը</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button onClick={() => void saveProfile()} disabled={saving} className="w-full max-w-md">
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                Պահպանում...
              </span>
            ) : (
              "Պահպանել"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
