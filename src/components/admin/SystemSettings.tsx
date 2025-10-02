import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { laravelApi } from "@/integrations/laravel/client";
import { Settings, Shield, Mail, Database, Bell } from "lucide-react";

const SystemSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    autoBackup: true,
    siteName: "Փաստաթղթային Համակարգ",
    adminEmail: "admin@example.com",
    welcomeMessage: "Բարի գալուստ մեր կայք"
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load settings from API on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const response = await laravelApi.getSettings();
        
        if (response.success && response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: "Սխալ",
          description: "Չհաջողվեց բեռնել կարգավորումները",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await laravelApi.updateSettings(settings);
      
      if (response.success) {
        toast({
          title: "Հաջողություն",
          description: "Կարգավորումները հաջողությամբ պահպանվեցին"
        });
        
        // Update local state with response data to ensure sync
        if (response.data) {
          setSettings(response.data);
        }
      } else {
        throw new Error(response.message || 'Failed to save settings');
      }
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Սխալ", 
        description: error.message || "Չհաջողվեց պահպանել կարգավորումները",
        variant: "destructive"
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Բեռնում են կարգավորումները...</p>
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
            Կազմակերպեք և կառավարեք համակարգի պարամետրերը
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Site Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Database className="h-5 w-5" />
              Կայքի կարգավորումներ
            </h3>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="siteName">Կայքի անվանում</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  placeholder="Կայքի անվանում"
                />
              </div>
              
              <div>
                <Label htmlFor="adminEmail">Ադմինիստրատորի էլ. հասցե</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="welcomeMessage">Ողջույնի հաղորդագրություն</Label>
                <Textarea
                  id="welcomeMessage"
                  value={settings.welcomeMessage}
                  onChange={(e) => handleSettingChange('welcomeMessage', e.target.value)}
                  placeholder="Բարի գալուստ հաղորդագրություն"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Անվտանգություն
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Սպասարկման ռեժիմ</Label>
                  <p className="text-sm text-muted-foreground">
                    Միացնելիս կայքը կլինի անմատչելի օգտատերերի համար
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Գրանցման թույլտվություն</Label>
                  <p className="text-sm text-muted-foreground">
                    Թույլ տալ նոր օգտատերերի գրանցումը
                  </p>
                </div>
                <Switch
                  checked={settings.allowRegistration}
                  onCheckedChange={(checked) => handleSettingChange('allowRegistration', checked)}
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Ծանուցումներ
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Էլ. նամակների ծանուցումներ</Label>
                  <p className="text-sm text-muted-foreground">
                    Ուղարկել ծանուցումներ նոր հաղորդագրությունների համար
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>
            </div>
          </div>

          {/* Backup Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Database className="h-5 w-5" />
              Պահեստավորում
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ավտոմատ պահեստավորում</Label>
                  <p className="text-sm text-muted-foreground">
                    Ավտոմատ ստեղծել տվյալների պահեստային պատճեններ
                  </p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={saveSettings} disabled={saving || loading} className="w-full">
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Պահպանում...
                </div>
              ) : (
                "Պահպանել կարգավորումները"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;