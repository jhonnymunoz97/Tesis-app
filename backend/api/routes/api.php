<?php

use App\Http\Controllers\AssignController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\MarkerController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;

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

Route::post('upload64', function (Request $request) {
    $image = $request->imagen; // your base64 encoded
    $image = str_replace('data:image/jpeg;base64,', '', $image);
    $image = str_replace(' ', '+', $image);
    $imageName = time() . '.' . 'png';
    File::put(public_path() . "//img//" . $imageName, base64_decode($image));
    return asset("img/$imageName");
});
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
        'users' => UserController::class,
        'markers' => MarkerController::class,
        'assigns' => AssignController::class,
    ]);
});
