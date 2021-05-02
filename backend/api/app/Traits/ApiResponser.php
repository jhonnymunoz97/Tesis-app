<?php

namespace App\Traits;

trait ApiResponser
{
    private function successResponse($data, $messages = 'Operación exitosa!', $code = 200)
    {
        if (!is_array($messages) && !is_object($messages)) {
            $messages = array($messages);
        }
        return response()->json([
            'status' => 'success',
            'messages' => json_decode(json_encode($messages, true)),
            'data' => $data,
            'code' => $code
        ], $code);
    }
    private function errorResponse($messages = 'Error', $code = 400, $data = null)
    {
        if (!is_array($messages) && !is_object($messages)) {
            $messages = array($messages);
        }
        return response()->json([
            'status' => 'error',
            'messages' => json_decode(json_encode($messages, true)),
            'data' => $data,
            'code' => $code
        ], $code);
    }
}
