<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use SoftDeletes;
    protected $table = 'vehicles';
    use HasFactory;

    protected $fillable = [
        'vehicle_type',
        'registration_no',
        'type',
        'fuel',
        'brand',
        'model',
        'year'
    ];

}
