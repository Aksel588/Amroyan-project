<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Newsletter extends Model
{
    protected $fillable = [
        'email',
        'is_active',
        'subscribed_at',
        'unsubscribed_at'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'subscribed_at' => 'datetime',
        'unsubscribed_at' => 'datetime',
    ];

    /**
     * Check if email is already subscribed
     */
    public static function isSubscribed($email)
    {
        return self::where('email', $email)
                   ->where('is_active', true)
                   ->exists();
    }

    /**
     * Subscribe an email
     */
    public static function subscribe($email)
    {
        return self::updateOrCreate(
            ['email' => $email],
            [
                'is_active' => true,
                'subscribed_at' => now(),
                'unsubscribed_at' => null
            ]
        );
    }

    /**
     * Unsubscribe an email
     */
    public static function unsubscribe($email)
    {
        return self::where('email', $email)->update([
            'is_active' => false,
            'unsubscribed_at' => now()
        ]);
    }
}
