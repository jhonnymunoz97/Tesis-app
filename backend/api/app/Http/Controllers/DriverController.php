<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

use App\Models\User;
use App\Traits\ApiResponser;
use Carbon\Carbon;


class DriverController extends Controller
{
    public function loginDriver(Request $request){
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

    public function loginUser(Request $request){
        
    }
}
