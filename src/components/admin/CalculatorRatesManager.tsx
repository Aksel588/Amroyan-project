import { useEffect, useMemo, useState } from "react";
import { laravelApi } from "@/integrations/laravel/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface RateRow {
  id: string;
  calculator_id: string;
  label: string;
  rate: number;
  visible: boolean;
  sort_order: number;
  effective_from: string | null;
  effective_to: string | null;
  created_at?: string;
  updated_at?: string;
}

interface Props {
  calculatorId: string;
  calculatorTitle?: string;
}

const emptyRate: Omit<RateRow, "id" | "calculator_id" | "sort_order"> & { sort_order?: number } = {
  label: "",
  rate: 0,
  visible: true,
  sort_order: 0,
  effective_from: null,
  effective_to: null,
};

export default function CalculatorRatesManager({ calculatorId, calculatorTitle }: Props) {
  const { toast } = useToast();
  const [rates, setRates] = useState<RateRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<RateRow | null>(null);
  const [form, setForm] = useState<typeof emptyRate>(emptyRate);

  const title = useMemo(
    () => (calculatorTitle ? `«${calculatorTitle}» հաշվիչի տոկոսադրույքներ` : "Տոկոսադրույքների կառավարում"),
    [calculatorTitle]
  );

  const load = async () => {
    setLoading(true);
    try {
      const response = await laravelApi.getCalculatorRates(calculatorId);
      setRates(response.data || []);
    } catch (error) {
      console.error(error);
      toast({ title: "Սխալ", description: "Չհաջողվեց բեռնել տոկոսադրույքները", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (calculatorId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculatorId]);

  const reset = () => {
    setEditing(null);
    setForm(emptyRate);
  };

  const save = async () => {
    if (!form.label) return toast({ title: "Լրացրեք անվանումը", variant: "destructive" });
    if (isNaN(Number(form.rate))) return toast({ title: "Տոկոսադրույքը պետք է լինի թիվ", variant: "destructive" });

    if (editing) {
      try {
        await laravelApi.updateCalculatorRate(editing.id, {
          label: form.label,
          rate: Number(form.rate),
          visible: form.visible,
          effective_from: form.effective_from,
          effective_to: form.effective_to,
        });
        toast({ title: "Թարմացվել է" });
      } catch (error) {
        toast({ title: "Սխալ", description: "Չհաջողվեց թարմացնել", variant: "destructive" });
        return;
      }
    } else {
      const nextOrder = rates.length ? Math.max(...rates.map(r => r.sort_order)) + 1 : 0;
      try {
        await laravelApi.createCalculatorRate({
          calculator_id: calculatorId,
          label: form.label,
          rate: Number(form.rate),
          visible: form.visible,
          sort_order: nextOrder,
          effective_from: form.effective_from,
          effective_to: form.effective_to,
        });
        toast({ title: "Ավելացվել է" });
      } catch (error) {
        toast({ title: "Սխալ", description: "Չհաջողվեց ավելացնել", variant: "destructive" });
        return;
      }
    }
    await load();
    reset();
  };

  const remove = async (row: RateRow) => {
    try {
      await laravelApi.deleteCalculatorRate(row.id);
      toast({ title: "Ջնջվել է" });
      await load();
    } catch (error) {
      toast({ title: "Սխալ", description: "Չհաջողվեց ջնջել", variant: "destructive" });
    }
  };

  const toggleVisible = async (row: RateRow) => {
    try {
      await laravelApi.updateCalculatorRate(row.id, { visible: !row.visible });
      await load();
    } catch (error) {
      toast({ title: "Սխալ", description: "Չհաջողվեց փոխել տեսանելիությունը", variant: "destructive" });
    }
  };

  const move = async (row: RateRow, direction: -1 | 1) => {
    const index = rates.findIndex(r => r.id === row.id);
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= rates.length) return;
    const target = rates[targetIndex];
    try {
      await laravelApi.updateCalculatorRate(row.id, { sort_order: target.sort_order });
      await laravelApi.updateCalculatorRate(target.id, { sort_order: row.sort_order });
      await load();
    } catch (error) {
      toast({ title: "Սխալ", description: "Չհաջողվեց փոխել կարգը", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Ավելացրեք, խմբագրեք կամ ջնջեք տոկոսադրույքները տվյալ հաշվիչի համար</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rate-label">Անվանում</Label>
            <Input id="rate-label" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="օր. Գործատու, Աշխատող, Սոց." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate-value">Տոկոս (%)</Label>
            <Input id="rate-value" type="number" step="0.01" value={form.rate} onChange={e => setForm({ ...form, rate: Number(e.target.value) })} placeholder="օր. 20" />
          </div>
          <div className="flex items-end gap-3">
            <div className="flex items-center gap-2">
              <Switch id="rate-visible" checked={form.visible} onCheckedChange={(v) => setForm({ ...form, visible: v })} />
              <Label htmlFor="rate-visible">Տեսանելի</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="from">Գործելու սկիզբ</Label>
            <Input id="from" type="date" value={form.effective_from ?? ''} onChange={e => setForm({ ...form, effective_from: e.target.value || null })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to">Գործելու ավարտ</Label>
            <Input id="to" type="date" value={form.effective_to ?? ''} onChange={e => setForm({ ...form, effective_to: e.target.value || null })} />
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={save}>{editing ? "Պահպանել" : "Ավելացնել"}</Button>
          {editing && <Button variant="outline" onClick={reset}>Չեղարկել</Button>}
        </div>

        <div className="space-y-3 pt-4">
          {loading && <p className="text-sm text-muted-foreground">Բեռնվում է…</p>}
          {!loading && rates.length === 0 && (
            <p className="text-sm text-muted-foreground">Դեռ տոկոսադրույքներ չկան</p>
          )}
          {!loading && rates.map((row, idx) => (
            <div key={row.id} className="border rounded-lg p-3 bg-background/60">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{row.label} {row.visible ? '' : '(թաքնված)'}</div>
                  <div className="text-xs text-muted-foreground">{row.rate}% • կարգ {row.sort_order}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => move(row, -1)} disabled={idx === 0}>Վերև</Button>
                  <Button size="sm" variant="outline" onClick={() => move(row, 1)} disabled={idx === rates.length - 1}>Ներքև</Button>
                  <Button size="sm" variant="outline" onClick={() => toggleVisible(row)}>{row.visible ? 'Թաքցնել' : 'Ցույց տալ'}</Button>
                  <Button size="sm" variant="outline" onClick={() => { setEditing(row); setForm({ label: row.label, rate: row.rate, visible: row.visible, sort_order: row.sort_order, effective_from: row.effective_from, effective_to: row.effective_to }); }}>Խմբագրել</Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(row)}>Ջնջել</Button>
                </div>
              </div>
              <div className="mt-2 text-[11px] text-muted-foreground">
                Թարմ․ {row.updated_at ? new Date(row.updated_at).toLocaleString('hy-AM') : '—'} • Ստեղծ․ {row.created_at ? new Date(row.created_at).toLocaleString('hy-AM') : '—'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
