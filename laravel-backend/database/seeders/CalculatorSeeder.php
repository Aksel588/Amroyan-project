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
                // Source: cal.xlsx (Лист1)
                'description' => "Աշխատավարձի հաշվիչը հնարավորություն է տալիս պարզ և մատչելի կերպով հաշվարկել աշխատավարձի չափը, հարկերը և այլ վճարների չափերը։\nՀաշվիչի միջոցով կարելի է հաշվարկել և՛ մաքուր աշխատավարձը (հարկերից հետո)՝ նշելով գրանցված աշխատավարձի չափը, և՛ գրանցված աշխատավարձը (մինչ հարկումը)՝ նշելով մաքուր աշխատավարձը։\n2023թ.-ի հունվարի 1-ից եկամտային հարկի դրույքաչափը կազմում է 20%։",
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
                // Source: cal.xlsx (նախագծերի հաշվիչ)
                'title' => 'ՆԱԽԱԳԾԵՐԻ ՀԱՇՎԻՉ (смета)',
                'slug' => 'estimate',
                'description' => 'Հաշվիչը հնարավորություն է տալիս հաշվարկել տարբեր ծառայությունների, աշխատանքների և պրոյեկտների բյուջեն, և օգտակար կլինի ինչպես պատվիրատուների, այնպես էլ կատարողների համար: Նախագծի արժեքը հաշվարկելու համար լրացրեք աշխատավարձային մասը (հաստիքների զուտ արժեքները), այլ ծախսային հոդվածները, նշեք կազմակերպության շահույթը (маржа) և Կատարողի ԱԱՀ վճարող լինելը կամ ոչ:',
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
                // Source: cal.xlsx (շրջհարկի հաշվիչ)
                'description' => 'Շրջանառության հարկի հաշվիչը հնարավորություն է տալիս հաշվարկել կազմակերպության կամ ԱՁ-ի եռամսյակային շրջանառության հարկը: Տող 1-5 համար լրացվում է շրջանառության ծավալը, գործունեության հետ անմիջականորեն կապ ունեցող ծախս (ինքնարժեք), իրացման, վարչական և այլ ծախսերը, որից հետո հաշվիչը ավտոմատ կերպով հաշվարկում է հարկի փաստացի տոկոսը և վճարման ենթակա հարկը: Տող 6-11 համար լրացվում է միայն շրջանառության ծավալը, գործունեության հարկի դրույքաչափը ֆիքսված է:',
                'icon_name' => 'Calculator',
                'sort_order' => 7,
                'visible' => true,
            ],
        ];

        foreach ($calculators as $calculatorData) {
            $calculator = Calculator::updateOrCreate(
                ['slug' => $calculatorData['slug']],
                $calculatorData
            );

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
                    CalculatorRate::updateOrCreate(
                        [
                            'calculator_id' => $calculator->id,
                            'label' => $rateData['label'],
                        ],
                        [
                            'calculator_id' => $calculator->id,
                            ...$rateData,
                        ]
                    );
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
                    CalculatorRate::updateOrCreate(
                        [
                            'calculator_id' => $calculator->id,
                            'label' => $rateData['label'],
                        ],
                        [
                            'calculator_id' => $calculator->id,
                            ...$rateData,
                        ]
                    );
                }
            }
        }
    }
}
