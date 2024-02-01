<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login', [AuthController::class,'login']);
Route::post('register ', [AuthController::class,'register']);


Route::group(['middleware' => 'api'],function(){
    Route::get('project/statistics', [ProjectController::class, 'statistics']);
    Route::apiResource('projects', ProjectController::class);
    Route::post('logout', [AuthController::class,'logout']);
    Route::post('refresh', [AuthController::class,'refresh']);
    Route::post('me', [AuthController::class,'me']);
    Route::put('project/update-orders', [ProjectController::class, 'updateOrders']);
    Route::put('project/{id}/changeFavorite', [ProjectController::class, 'changeFavorite']);
    Route::get('project/myFavorites', [ProjectController::class, 'myFavorites']);


});
