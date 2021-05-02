<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Driver extends Authenticatable implements JWTSubject
{
    use SoftDeletes;
    protected $table = 'drivers';
    use HasFactory;

    protected $fillable = [
        'dni',
        'name',
        'surname',
        'email',
        'telefono',
        'licencia',
        'password',
        'verified',
        'last_login'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password'
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
    /**
     * RelationShip between user, and user activation token
     *
     * @return void
     */
    public function verifyToken()
    {
        return $this->hasOne(UserVerification::class);
    }
}
