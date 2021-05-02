<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/**No protegidas */
Route::group(['middleware' => 'api'], function () {
    Route::get('/', function () {
        return response()->json([
            'message' => 'Bienvenido Papu',
            'status' => 'success',
            'code' => 200
        ], 200);
    });
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('driver-login', [DriverController::class, 'login'])->name('driver-login');
    Route::post('logout', [AuthController::class, 'logout'])->name('logout');
});
/**Protegidas */
Route::group([
    'middleware' => ['auth:api', 'last_login'],
], function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('test', [AuthController::class, 'test'])->name('test');

    Route::apiResources([
        'drivers' => DriverController::class
    ]);
    Route::apiResources([
        'users' => UserController::class
    ]);
});
