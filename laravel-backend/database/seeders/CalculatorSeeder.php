<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Calculator;
use App\Models\CalculatorRate;

class CalculatorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $calculators = [
            [
                'title' => 'Աշխատավարձի հաշվիչ',
                'slug' => 'salary',
                'description' => 'Հաշվեք գրանցված ↔ մաքուր աշխատավարձը՝ հաշվի առնելով եկամտային հարկը, կուտակային վճարներն ու դրոշմանիշային վճարը',
                'icon_name' => 'Calculator',
                'sort_order' => 1,
                'visible' => true,
            ],
            [
                'title' => 'ԱԱՀ հաշվիչ',
                'slug' => 'vat',
                'description' => 'Հաշվեք ԱԱՀ-ն և գինը ԱԱՀ-ով',
                'icon_name' => 'Calculator',
                'sort_order' => 2,
                'visible' => true,
            ],
            [
                'title' => 'Շահութահարկի հաշվիչ',
                'slug' => 'profit-tax',
                'description' => 'Հաշվեք շահութահարկը և մաքուր շահույթը',
                'icon_name' => 'Calculator',
                'sort_order' => 3,
                'visible' => true,
            ],
            [
                'title' => 'Նպաստի հաշվիչ',
                'slug' => 'benefit',
                'description' => 'Հաշվեք տարբեր տեսակի նպաստները՝ երեխայի խնամք, հիվանդություն, ծննդաբերություն և այլն',
                'icon_name' => 'Calculator',
                'sort_order' => 4,
                'visible' => true,
            ],
            [
                'title' => 'Նախագծային հաշվիչ',
                'slug' => 'estimate',
                'description' => 'Հաշվեք նախագծերի արժեքը և գնահատումները',
                'icon_name' => 'Calculator',
                'sort_order' => 5,
                'visible' => true,
            ],
            [
                'title' => 'Աշխատավարձի հաշվիչ (լրիվ)',
                'slug' => 'comprehensive-salary',
                'description' => 'Հաշվեք աշխատավարձի ֆոնդը, հարկերը, ծախսերը և վերջնական գինը՝ ժամավճարային, օրավճարային և ամսավճարային դիրքերով',
                'icon_name' => 'Calculator',
                'sort_order' => 6,
                'visible' => true,
            ],
            [
                'title' => 'Շրջանառության հարկի հաշվիչ',
                'slug' => 'turnover-tax',
                'description' => 'Հաշվեք եռամսյակային շրջանառության հարկը՝ տարբեր գործունեության տեսակների համար՝ հանելով ծախսերը և ստուգելով նվազագույն հարկը',
                'icon_name' => 'Calculator',
                'sort_order' => 7,
                'visible' => true,
            ],
        ];

        foreach ($calculators as $calculatorData) {
            $calculator = Calculator::create($calculatorData);

            // Add default rates for salary calculator
            if ($calculator->slug === 'salary') {
                $rates = [
                    [
                        'label' => 'Եկամտային հարկ',
                        'rate' => 20.0,
                        'sort_order' => 1,
                        'visible' => true,
                    ],
                    [
                        'label' => 'Կուտակային վճար',
                        'rate' => 10.0,
                        'sort_order' => 2,
                        'visible' => true,
                    ],
                    [
                        'label' => 'Դրոշմանիշային վճար',
                        'rate' => 1500.0,
                        'sort_order' => 3,
                        'visible' => true,
                    ],
                ];

                foreach ($rates as $rateData) {
                    CalculatorRate::create([
                        'calculator_id' => $calculator->id,
                        ...$rateData,
                    ]);
                }
            }

            // Add default rates for VAT calculator
            if ($calculator->slug === 'vat') {
                $rates = [
                    [
                        'label' => 'ԱԱՀ (20%)',
                        'rate' => 20.0,
                        'sort_order' => 1,
                        'visible' => true,
                    ],
                    [
                        'label' => 'ԱԱՀ (0%)',
                        'rate' => 0.0,
                        'sort_order' => 2,
                        'visible' => true,
                    ],
                ];

                foreach ($rates as $rateData) {
                    CalculatorRate::create([
                        'calculator_id' => $calculator->id,
                        ...$rateData,
                    ]);
                }
            }
        }
    }
}
