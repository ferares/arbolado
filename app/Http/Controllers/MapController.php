<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;

class MapController extends BaseController
{
    public function view() {
        return view('pages.map', ['templateName' => 'template-map',]);
    }
}
