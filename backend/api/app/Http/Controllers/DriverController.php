<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Traits\ApiResponser;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class DriverController extends Controller
{
    use ApiResponser;
    public function __construct()
    {
        $this->middleware(['auth:api', 'last_login', 'is_admin'])
            ->except(['index', 'show', 'login']);
    }
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'dni' => 'required|min:6',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse($validator->errors()->all(), 422);
        }
        // @php-ignore
        if (!$token = Auth::guard('drivers')->attempt($request->all())) {
            return $this->errorResponse('Datos incorrectos', 401);
        }

        $driver = Driver::where('dni', $request->dni)->first();
        $driver->last_login = Carbon::now();
        $driver->save();
        $driver->access_token = $token;
        return $this->successResponse($driver->fresh());
    }



    public function index()
    {
        return $this->successResponse(Driver::all());
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    public function show($driver)
    {
        return $this->successResponse(Driver::findOrFail($driver));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Driver  $driver
     * @return \Illuminate\Http\Response
     */
    public function edit(Driver $driver)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Driver  $driver
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Driver $driver)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Driver  $driver
     * @return \Illuminate\Http\Response
     */
    public function destroy(Driver $driver)
    {
        //
    }
}
