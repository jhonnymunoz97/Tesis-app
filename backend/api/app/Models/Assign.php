<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Assign extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'driver_id',
        'road_id',
        'horarios',
        'start_date',
        'end_date'
    ];

    protected $casts = [
        'horarios' => 'json'
    ];
}
