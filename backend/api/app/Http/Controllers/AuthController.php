<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\ApiResponser;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    use ApiResponser;
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'dni' => 'required|min:6',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse($validator->errors()->all(), 422);
        }

        if (!$token = Auth::attempt($request->all())) {
            return $this->errorResponse('Datos incorrectos', 401);
        }

        return $this->createNewToken($token);
    }

    protected function createNewToken($token)
    {
        $user = User::find(Auth::user()->id);
        $user->last_login = Carbon::now();
        $user->save();
        $user->access_token = $token;
        return $this->successResponse($user);
    }

    public function test()
    {
        return response()->json([
            'message' => 'Estás logueado'
        ]);
    }
    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        Auth::logout();
        return $this->successResponse(null, 'Ha salido del sistema');
    }
}
