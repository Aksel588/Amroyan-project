<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CourseApplication;

class CourseApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $applications = [
            [
                'full_name' => 'Անի Սարգսյան',
                'email' => 'ani.sargsyan@example.com',
                'phone' => '+374 91 123 456',
                'message' => 'Ինտերես ունեմ հաշվապահական դասընթացներին մասնակցելու համար: Կարո՞ղ եմ ստանալ լրացուցիչ տեղեկություններ:',
                'status' => 'pending',
                'submitted_from' => 'services-page',
            ],
            [
                'full_name' => 'Հայկ Մարտիրոսյան',
                'email' => 'hayk.martirosyan@example.com',
                'phone' => '+374 93 234 567',
                'message' => 'Ուզում եմ սովորել հաշվապահական հաշվառում: Ե՞րբ են սկսվում հաջորդ դասընթացները:',
                'status' => 'approved',
                'processed_by' => 'Admin',
                'submitted_from' => 'website',
                'notes' => 'Հաստատված է հաջորդ դասընթացին մասնակցելու համար: Կապ հաստատել էլ. փոստով:',
            ],
            [
                'full_name' => 'Մարիա Հովհաննիսյան',
                'email' => 'maria.hovhannisyan@example.com',
                'phone' => '+374 94 345 678',
                'message' => 'Կարո՞ղ եմ մասնակցել առցանց դասընթացներին:',
                'status' => 'rejected',
                'processed_by' => 'Admin',
                'submitted_from' => 'services-page',
                'notes' => 'Մերժված է - առցանց դասընթացներ չկան: Առաջարկվել է ստացիոնար դասընթացներ:',
            ],
            [
                'full_name' => 'Գևորգ Աբրահամյան',
                'email' => 'gevor.abrahamyan@example.com',
                'phone' => '+374 95 456 789',
                'message' => 'Որքա՞ն է դասընթացների արժեքը:',
                'status' => 'pending',
                'submitted_from' => 'website',
            ],
            [
                'full_name' => 'Լուսինե Գրիգորյան',
                'email' => 'lusine.grigoryan@example.com',
                'phone' => '+374 96 567 890',
                'message' => 'Կարո՞ղ եմ ստանալ վկայական դասընթացների ավարտից հետո:',
                'status' => 'cancelled',
                'processed_by' => 'Admin',
                'submitted_from' => 'services-page',
                'notes' => 'Չեղարկված է հաճախորդի խնդրանքով:',
            ],
        ];

        foreach ($applications as $application) {
            CourseApplication::create($application);
        }
    }
}
