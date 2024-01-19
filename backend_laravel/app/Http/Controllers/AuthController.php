<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login','register']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
   public function login(Request $request)
{

     $validator = Validator::make($request->all(), [
        'email' => 'required|email',
        'password' => 'required|min:6',
    ]);

    if ($validator->fails()) {
        return response()->json(['error' => $validator->errors()->first()], 400);
    }


    $credentials = $request->only('email', 'password');

    if (!auth()->attempt($credentials)) {

        return response()->json(['error' => 'Unauthorized'], 401);
    }

    // Authentication successful, generate a token
    $token = $this->respondWithToken(auth()->attempt($credentials));

    return $this->respondWithToken($token);
}


public function register(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required',
        'email' => 'required|string|email|max:255|unique:users,email',
        'password' => 'required|min:6',
    ]);

    if ($validator->fails()) {
        return response()->json(['error' => $validator->errors()->first()], 400);
    }

    $credentials = $request->only('name', 'email', 'password');
    $credentials['password'] = bcrypt($credentials['password']);

    try {
        // Attempt to create the user
        User::create($credentials);

        // Return success
        return response()->json('success');
    } catch (\Exception $e) {
        // If user creation fails
        return response()->json(['error' => 'User registration failed. Please try again.'], 500);
    }
}


    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => auth()->user()
        ]);
    }
}
