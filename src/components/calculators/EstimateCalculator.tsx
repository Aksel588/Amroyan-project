import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Calculator } from 'lucide-react';

interface EstimateItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const EstimateCalculator = () => {
  const [items, setItems] = useState<EstimateItem[]>([]);
  const [vatRate, setVatRate] = useState(20);
  const [profitMargin, setProfitMargin] = useState(10);

  const addItem = () => {
    const newItem: EstimateItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof EstimateItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const vatAmount = subtotal * (vatRate / 100);
  const profitAmount = subtotal * (profitMargin / 100);
  const total = subtotal + vatAmount + profitAmount;

  const formatAMD = (amount: number) => new Intl.NumberFormat('hy-AM', { style: 'currency', currency: 'AMD', minimumFractionDigits: 0 }).format(amount);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-b from-gray-900 to-black border-gold-500/20">
      <CardHeader>
        <CardTitle className="gradient-text flex items-center gap-3">
          <Calculator className="w-6 h-6 text-gold-500" />
          Նախագծերի հաշվիչ (Սմետա)
        </CardTitle>
        <CardDescription className="text-gray-400">
          Ավելացրեք նյութեր, աշխատանքային ժամեր և ծախսեր՝ ստանալու համար ամբողջական սմետա
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Items Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Ծախսերի ցանկ</h3>
            <Button onClick={addItem} className="bg-gold-600 hover:bg-gold-700 text-black">
              <Plus className="w-4 h-4 mr-2" />
              Ավելացնել տարր
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Դեռևս տարրեր չեն ավելացվել</p>
              <p className="text-sm">Սեղմեք "Ավելացնել տարր" կոճակը՝ սկսելու համար</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <Card key={item.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                      <div className="md:col-span-2">
                        <Label className="text-gold-400">Անվանում</Label>
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          placeholder="Օրինակ՝ ցեմենտ, աշխատանք"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gold-400">Քանակ</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gold-400">Միավորային գին (AMD)</Label>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Label className="text-gold-400">Ընդհանուր</Label>
                          <div className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white">
                            {formatAMD(item.total)}
                          </div>
                        </div>
                        <Button
                          onClick={() => removeItem(item.id)}
                          variant="destructive"
                          size="sm"
                          className="mt-6"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Settings Section */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Կարգավորումներ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gold-400">ԱԱՀ տոկոսադրույք (%)</Label>
                <Input
                  type="number"
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gold-400">Շահույթի մարժա (%)</Label>
                <Input
                  type="number"
                  value={profitMargin}
                  onChange={(e) => setProfitMargin(Number(e.target.value))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {items.length > 0 && (
          <Card className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 border-gold-500/50">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white text-center mb-6">Սմետայի արդյունք</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-white">
                <div className="bg-gray-800 p-4 rounded-md text-center">
                  <p className="text-sm text-gray-400">Ընդհանուր գումար</p>
                  <p className="text-lg font-semibold text-blue-400">{formatAMD(subtotal)}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-md text-center">
                  <p className="text-sm text-gray-400">ԱԱՀ ({vatRate}%)</p>
                  <p className="text-lg font-semibold text-red-400">{formatAMD(vatAmount)}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-md text-center">
                  <p className="text-sm text-gray-400">Շահույթ ({profitMargin}%)</p>
                  <p className="text-lg font-semibold text-orange-400">{formatAMD(profitAmount)}</p>
                </div>
                <div className="bg-green-600/20 border border-green-500/50 p-4 rounded-md text-center">
                  <p className="text-lg text-green-300">Վերջնական գումար</p>
                  <p className="text-2xl font-bold text-green-400">{formatAMD(total)}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center pt-4">* Հաշվարկները նախնական են</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default EstimateCalculator;
