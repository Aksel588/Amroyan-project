import { useEffect, useState } from "react";
import { laravelApi } from "@/integrations/laravel/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Eye, EyeOff, Trash2, Save, X, Calculator } from "lucide-react";
import DynamicIcon from "@/components/ui/DynamicIcon";

interface Calculator {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon_name: string;
  visible: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

const emptyCalculator: Omit<Calculator, "id" | "created_at" | "updated_at"> = {
  title: "",
  slug: "",
  description: "",
  icon_name: "Calculator",
  visible: true,
  sort_order: 0,
};

const iconOptions = [
  "Calculator",
  "DollarSign",
  "Percent",
  "TrendingUp",
  "TrendingDown",
  "PieChart",
  "BarChart",
  "LineChart",
  "Activity",
  "Target",
  "Award",
  "Star",
  "Heart",
  "Shield",
  "Zap",
  "Settings",
  "Tool",
  "Wrench",
  "Cog",
  "Gear"
];

export default function CalculatorsManagement() {
  const { toast } = useToast();
  const [calculators, setCalculators] = useState<Calculator[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Calculator | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<typeof emptyCalculator>(emptyCalculator);

  const loadCalculators = async () => {
    setLoading(true);
    try {
      const response = await laravelApi.getCalculators();
      setCalculators(response.data || []);
    } catch (error) {
      console.error(error);
      toast({ title: "Սխալ", description: "Չհաջողվեց բեռնել հաշվիչները", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalculators();
  }, []);

  const reset = () => {
    setEditing(null);
    setForm(emptyCalculator);
    setShowForm(false);
  };

  const edit = (calculator: Calculator) => {
    setEditing(calculator);
    setForm({
      title: calculator.title,
      slug: calculator.slug,
      description: calculator.description,
      icon_name: calculator.icon_name,
      visible: calculator.visible,
      sort_order: calculator.sort_order,
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title.trim()) return toast({ title: "Լրացրեք վերնագիրը", variant: "destructive" });
    if (!form.slug.trim()) return toast({ title: "Լրացրեք slug-ը", variant: "destructive" });
    if (!form.description.trim()) return toast({ title: "Լրացրեք նկարագրությունը", variant: "destructive" });

    try {
      if (editing) {
        await laravelApi.updateCalculator(editing.id, form);
        toast({ title: "Թարմացվել է" });
      } else {
        await laravelApi.createCalculator(form);
        toast({ title: "Ավելացվել է" });
      }
      await loadCalculators();
      reset();
    } catch (error) {
      console.error(error);
      toast({ 
        title: "Սխալ", 
        description: editing ? "Չհաջողվեց թարմացնել" : "Չհաջողվեց ավելացնել", 
        variant: "destructive" 
      });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Դուք վստա՞հ եք, որ ցանկանում եք ջնջել այս հաշվիչը:")) return;
    
    try {
      await laravelApi.deleteCalculator(id);
      toast({ title: "Ջնջվել է" });
      await loadCalculators();
    } catch (error) {
      toast({ title: "Սխալ", description: "Չհաջողվեց ջնջել", variant: "destructive" });
    }
  };

  const toggleVisible = async (calculator: Calculator) => {
    try {
      await laravelApi.updateCalculator(calculator.id, { visible: !calculator.visible });
      await loadCalculators();
    } catch (error) {
      toast({ title: "Սխալ", description: "Չհաջողվեց փոխել տեսանելիությունը", variant: "destructive" });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Հաշվիչների կառավարում</h2>
          <p className="text-gray-400">Ստեղծեք, խմբագրեք և կառավարեք հաշվիչները</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700">
          <Plus className="w-4 h-4 mr-2" />
          Նոր հաշվիչ
        </Button>
      </div>

      {showForm && (
        <Card className="bg-gradient-to-b from-gray-900 to-black border-gold-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              {editing ? "Խմբագրել հաշվիչ" : "Նոր հաշվիչ"}
              <Button variant="ghost" size="sm" onClick={reset} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gold-400">Վերնագիր *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="օր. Աշխատավարձի հաշվիչ"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-gold-400">Slug *</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="օր. salary-calculator"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon" className="text-gold-400">Նշանի անվանում</Label>
                <Select value={form.icon_name} onValueChange={(value) => setForm({ ...form, icon_name: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Ընտրեք նշանը" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon} className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <DynamicIcon name={icon as any} size={16} />
                          {icon}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order" className="text-gold-400">Կարգի համար</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gold-400">Նկարագրություն *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Հաշվիչի նկարագրությունը..."
                rows={3}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="visible"
                checked={form.visible}
                onCheckedChange={(checked) => setForm({ ...form, visible: checked })}
              />
              <Label htmlFor="visible" className="text-gold-400">Տեսանելի</Label>
            </div>
            <div className="flex gap-3">
              <Button onClick={save} className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700">
                <Save className="w-4 h-4 mr-2" />
                {editing ? "Թարմացնել" : "Պահպանել"}
              </Button>
              <Button variant="outline" onClick={reset}>
                Չեղարկել
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-400">Բեռնվում է...</p>
          </div>
        ) : (
          calculators.map((calculator) => (
            <Card key={calculator.id} className="bg-gradient-to-br from-gray-900 to-black border-gold-500/20 hover:border-gold-400/40 transition-all">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                  <DynamicIcon name={calculator.icon_name as any} className="text-black" size={22} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-white text-lg">{calculator.title}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm mt-1">
                    {calculator.description}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">Slug: {calculator.slug}</span>
                    <span className="text-xs text-gray-500">Կարգ: {calculator.sort_order}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Տեսանելի:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVisible(calculator)}
                      className="p-1 h-auto"
                    >
                      {calculator.visible ? (
                        <Eye className="w-4 h-4 text-green-400" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-red-400" />
                      )}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => edit(calculator)}
                      className="border-gold-500/50 text-gold-400 hover:bg-gold-500/20"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => remove(calculator.id)}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                                 <div className="text-xs text-gray-500">
                   Ստեղծվել է: {calculator.created_at ? new Date(calculator.created_at).toLocaleDateString('hy-AM') : '—'}
                 </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {calculators.length === 0 && !loading && (
        <div className="text-center py-12">
          <Calculator className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">Հաշվիչներ չկան</h3>
          <p className="text-gray-500">Սկսեք ստեղծելով առաջին հաշվիչը</p>
        </div>
      )}
    </div>
  );
}
