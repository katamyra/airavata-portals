<?php

namespace App\Http\Controllers;

use CommonUtilities;
use Theme;
use View;
use Session;
use Log;
use Exception;

class HomeController extends BaseController {

	/*
	|--------------------------------------------------------------------------
	| Default Home Controller
	|--------------------------------------------------------------------------
	|
	| You may wish to use controllers instead of, or in addition to, Closure
	| based routes. That's great! Here is an example controller method to
	| get you started. To route to this controller, just add the route:
	|
	|	Route::get('/', 'HomeController@showWelcome');
	|
	*/

	public function index()
	{
		Session::put("nav-active", "home");
		// Fallback: just render the home view regardless of theme or login status
		return View::make('home');
	}

}

?>
