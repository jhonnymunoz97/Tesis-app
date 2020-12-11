<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Traits\ApiResponser;
use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class IsAdmin
{
    use ApiResponser;
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        //Access token from the request
        $token = JWTAuth::parseToken();
        //Try authenticating user
        $user = $token->authenticate();

        //If user was authenticated successfully and user is in one of the acceptable roles, send to next request.
        if ($user && in_array($user->role, [User::ROLE_SUPER_USER])) {
            return $next($request);
        }
        return $this->errorResponse('No tienes acceso a este recurso', 401);
    }
}
