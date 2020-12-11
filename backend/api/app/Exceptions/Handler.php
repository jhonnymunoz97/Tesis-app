<?php

namespace App\Exceptions;

use App\Traits\ApiResponser;
use Exception;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class Handler extends ExceptionHandler
{
    use ApiResponser;
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->renderable(function (AuthenticationException $exception, $request) {
            return $this->errorResponse('No estás autenticado.', 401);
        });
        $this->renderable(function (TokenExpiredException $exception, $request) {
            return $this->errorResponse('Tu token está expirado, Ingresa de nuevo.', 401);
        });
        $this->renderable(function (TokenInvalidException $exception, $request) {
            return $this->errorResponse('Tu token es invalido, Ingresa de nuevo.', 401);
        });
        $this->renderable(function (JWTException $exception, $request) {
            return $this->errorResponse('Por favor, adjunte un  Bearer Token a su solicitud.', 401);
        });
        $this->renderable(function (QueryException $exception, $request) {
            switch ($exception->getCode()) {
                case '23000':
                    return $this->errorResponse('Violación de integridad, (existe un valor duplicado o el objeto está asociado a otros)', 422);
                    break;

                default:
                    return $this->errorResponse($exception->getMessage(), 422);
                    break;
            }
        });
    }
}
