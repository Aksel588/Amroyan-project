<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        // Check if admin user already exists
        $existingAdmin = User::where('email', 'admin@amroyan.com')->first();
        
        if (!$existingAdmin) {
            User::create([
                'email' => 'admin@amroyan.com',
                'role' => 'admin',
                'password' => bcrypt('admin123'),
                'email_verified_at' => now()
            ]);
            
            echo "Admin user created successfully!\n";
            echo "Email: admin@amroyan.com\n";
            echo "Password: admin123\n";
        } else {
            echo "Admin user already exists!\n";
        }
    }
}